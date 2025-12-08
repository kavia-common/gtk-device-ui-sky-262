#!/usr/bin/env python3
import os
import re
import json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

INCLUDE_EXT = {'.ini', '.html', '.htm', '.js', '.css', '.txt', '.json'}
EXCLUDE_DIRS = {'node_modules', 'dist', 'build', 'vendor', 'third_party', 'logs'}
EXCLUDE_FILES_PAT = re.compile(r'.*\.min\.js$|.*\.map$')
# Paths to focus per task
FOCUS_DIRS = [
    'dialog', 'js', 'langPack', 'lang', 'pages',
    '.',  # root html like login.html, main.html, index.html, pc-blocked.html, echo.html
]

# Simple heuristics for user-facing English words (avoid URLs, assets)
WORD_RE = re.compile(r'\b(?!(http|https|img|css|js|png|jpg|svg|eot|ttf|woff|woff2|data))([A-Za-z][A-Za-z]+)\b')
# Skip obvious code identifiers (camelCase or ALL_CAPS tokens often code)
CODEY_RE = re.compile(r'^[A-Za-z_][A-Za-z0-9_]*$')
JSON_KEY_LINE = re.compile(r'\"([A-Za-z0-9_.-]+)\"\\s*:')
# Likely placeholder/value patterns in HTML attributes
HTML_ATTR_TEXT = re.compile(r'(title|alt|placeholder|value|aria-label)\\s*=\\s*\"([^\"]+)\"', re.I)

LANG_DIR_EN = os.path.join(ROOT, 'lang', 'en')
LANG_DIR_FR = os.path.join(ROOT, 'lang', 'fr-CA')

def load_lang_keys():
    en_keys = set()
    fr_keys = set()
    for lang_dir, acc in [(LANG_DIR_EN, en_keys), (LANG_DIR_FR, fr_keys)]:
        if not os.path.isdir(lang_dir):
            continue
        for fn in os.listdir(lang_dir):
            if not fn.endswith('.json'):
                continue
            try:
                with open(os.path.join(lang_dir, fn), 'r', encoding='utf-8') as f:
                    data = json.load(f)
                def walk(prefix, obj):
                    if isinstance(obj, dict):
                        for k,v in obj.items():
                            walk(f"{prefix}.{k}" if prefix else k, v)
                    else:
                        acc.add(prefix)
                walk('', data)
            except Exception:
                # skip broken json
                continue
    return en_keys, fr_keys

def is_vendor_or_excluded(path):
    parts = set(path.split(os.sep))
    if parts & EXCLUDE_DIRS:
        return True
    if EXCLUDE_FILES_PAT.match(path):
        return True
    # vendor libs inside js directories
    if '/js/Bootstrap/' in path or '/js/angular/' in path or '/js/materialize/' in path:
        return True
    if '/css/materialize/' in path or '/css/Bootstrap/' in path:
        return True
    return False

def should_scan_file(path):
    if is_vendor_or_excluded(path):
        return False
    _, ext = os.path.splitext(path)
    if ext not in INCLUDE_EXT:
        return False
    return True

def looks_like_ui_text(token):
    if not token:
        return False
    tok = token.strip()
    if not tok:
        return False
    # Ignore pure code-like identifiers or numbers
    if CODEY_RE.match(tok):
        return False
    # Ignore if token is a typical key notation key.like.this
    if '.' in tok and tok.replace('.', '').isalnum():
        return False
    # Ignore if looks like URL or path
    if '://' in tok or '/' in tok:
        return False
    # Ignore very short
    if len(tok) < 2:
        return False
    # Contains letters
    if re.search(r'[A-Za-z]', tok) is None:
        return False
    return True

def extract_candidates_from_html(line):
    out = []
    # attributes
    for m in HTML_ATTR_TEXT.finditer(line):
        txt = m.group(2)
        if looks_like_ui_text(txt):
            out.append(txt)
    # text nodes: rough heuristic, find >Text< between tags
    for m in re.finditer(r'>\\s*([^<>\\s][^<>]*?)\\s*<', line):
        txt = m.group(1)
        if looks_like_ui_text(txt):
            out.append(txt)
    return out

def extract_candidates_from_js(line):
    out = []
    # string literals in JS "..." or '...'
    for m in re.finditer(r'([\"\'])(?P<txt>(?:\\\\\\1|.)*?)\\1', line):
        txt = m.group('txt')
        # Unescape simple sequences
        txt = txt.replace('\\\"','\"').replace("\\'", "'")
        if looks_like_ui_text(txt):
            out.append(txt)
    return out

def suggest_action(txt, en_keys, fr_keys):
    # Try to find if token is already a translation value present; we can’t easily reverse-map.
    # Heuristic: mark as "add to fr-CA pack" by default; if file in lang/en has a matching context key nearby, suggest update to use that key.
    # For now: default to "add to fr-CA pack or bind to existing key"
    return "Replace with lang key; if no key exists, add to fr-CA and en packs"

def main():
    en_keys, fr_keys = load_lang_keys()
    report = []
    for focus in FOCUS_DIRS:
        base = os.path.join(ROOT, focus)
        if focus == '.':
            # include root HTMLs
            pass
        if not os.path.exists(base):
            continue
        if os.path.isfile(base):
            files = [base]
        else:
            files = []
            for dirpath, dirnames, filenames in os.walk(base):
                # prune excluded dirs
                dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
                for fn in filenames:
                    filepath = os.path.join(dirpath, fn)
                    if should_scan_file(filepath):
                        files.append(filepath)
        for fp in files:
            try:
                with open(fp, 'r', encoding='utf-8', errors='ignore') as f:
                    for i, line in enumerate(f, 1):
                        _, ext = os.path.splitext(fp)
                        candidates = []
                        if ext in {'.html', '.htm'}:
                            candidates = extract_candidates_from_html(line)
                        elif ext == '.js':
                            # exclude likely code-only files
                            candidates = extract_candidates_from_js(line)
                        elif ext == '.ini':
                            # pack files likely key=value; extract right side
                            m = re.match(r'\\s*([A-Za-z0-9_.-]+)\\s*=\\s*(.+)$', line)
                            if m:
                                val = m.group(2).strip()
                                # strip quotes
                                val = re.sub(r'^\"|\"$', '', val)
                                if looks_like_ui_text(val):
                                    candidates = [val]
                        else:
                            # For other text/json, skip to avoid noise
                            candidates = []
                        # filter out trivial words
                        filtered = []
                        for c in candidates:
                            if WORD_RE.search(c):
                                filtered.append(c)
                        if not filtered:
                            continue
                        for c in filtered:
                            action = suggest_action(c, en_keys, fr_keys)
                            snippet = line.strip()
                            if len(snippet) > 240:
                                snippet = snippet[:240] + '...'
                            report.append({
                                'file': os.path.relpath(fp, ROOT),
                                'line': i,
                                'text': c,
                                'snippet': snippet,
                                'action': action
                            })
            except Exception:
                continue
    # Group by file
    from collections import defaultdict
    grouped = defaultdict(list)
    for r in report:
        grouped[r['file']].append(r)

    # Output markdown report to utils/ui_strings_report.md
    out_path = os.path.join(ROOT, 'utils', 'ui_strings_report.md')
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, 'w', encoding='utf-8') as outf:
        outf.write('# UI English Strings Scan Report\\n\\n')
        outf.write('Note: Excludes vendor/minified libraries. Heuristics may include false positives.\\n\\n')
        for file in sorted(grouped.keys()):
            outf.write(f'## {file}\\n\\n')
            for r in grouped[file][:200]:  # cap per file to keep concise
                outf.write(f'- L{r[\"line\"]}: \"{r[\"text\"]}\"\\n')
                outf.write(f'  - Snippet: {r[\"snippet\"]}\\n')
                outf.write(f'  - Suggested action: {r[\"action\"]}\\n')
            outf.write('\\n')
    print(f'Wrote report to utils/ui_strings_report.md with {sum(len(v) for v in grouped.values())} findings across {len(grouped)} files.')

if __name__ == '__main__':
    main()
