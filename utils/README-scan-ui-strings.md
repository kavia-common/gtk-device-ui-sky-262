Scan for potential English UI strings

What this does
- Scans first-party HTML/JS/INI files for likely user-visible English strings.
- Excludes vendor/minified libraries and common noise.
- Produces utils/ui_strings_report.md grouped by file with line numbers, snippets, and suggested actions.

How to run
1) From repository root:
   python3 gtk-device-ui-sky-262/utils/scan_ui_strings.py

2) Open the generated report:
   gtk-device-ui-sky-262/utils/ui_strings_report.md

Scope and heuristics
- Includes: .ini, .html, .htm, .js (first-party), plus root HTML shells.
- Excludes: node_modules, dist, build, vendor, third_party, *.min.js, logs, and vendor subfolders under js/css.
- HTML: extracts text nodes and attribute values (title, alt, placeholder, value, aria-label).
- JS: extracts string literals; may include false positives for non-UI messages.
- INI: extracts RHS values per key=value.

Next steps
- Replace hard-coded English in HTML/JS with language keys via lang.js usage.
- If a suitable key does not exist in lang/en/*.json, add it in both lang/en and lang/fr-CA and wire up usage.
- For legacy langPack/*.ini consumers, mirror keys as needed if still used.

Caveats
- This is a best-effort heuristic. Manual review is recommended to confirm UI exposure and context.
