#!/usr/bin/env node

/**
 * PUBLIC_INTERFACE
 * i18n_sync_fr_ca.js
 * 
 * This script reverse-applies fr-CA translations from a provided JSON file into all Excel (.xlsx) files
 * under a target i18n directory (default: gtk-device-ui-sky-262/i18n).
 * 
 * Features:
 * - Accepts CLI args:
 *    --json <path>           Path to fr-CA JSON (default: <targetDir>/fr-CA.json OR aggregates from lang/fr-CA/*.json if not provided)
 *    --targetDir <path>      Directory containing .xlsx files (default: gtk-device-ui-sky-262/i18n)
 *    --dry-run               Perform a dry run (no file modifications), outputs a report
 *    --backup                When modifying, create .bak copy of each changed workbook (same folder/filename.xlsx.bak)
 *    --report <path>         Path to write a detail report file (default: <targetDir>/fr-CA_sync_report.txt)
 *    --keyHeaders <list>     Comma-separated list of possible key header names (default: key,id,name)
 *    --langHeaders <list>    Comma-separated list of language header names to detect (default: en,zh,zh-TW,fr,fr-CA)
 *    --sheetFilter <name>    Optional: Only process sheets whose name includes this substring (case-insensitive). Otherwise scan all.
 * 
 * Behavior:
 * - Parses .xlsx files in targetDir, scanning each worksheet for a key column and language headers.
 * - If a fr-CA column is missing, adds it to the header row.
 * - Matches JSON keys to rows using the inferred key column; updates or inserts fr-CA values.
 * - Preserves other columns and formatting; only modifies fr-CA cells and appends new rows if keys are missing.
 * - Generates a dry-run report listing files/sheets/rows/keys updated/inserted/skipped, and logs Excel keys missing in JSON.
 * - Exits with non-zero code if no Excel files were updated when not in dry-run mode.
 * 
 * Assumptions:
 * - Keys in JSON are literal strings; the script compares them literally to the key column values.
 * - Excel header row is the first row; case-insensitive matching for key/lang headers.
 * - Uses exceljs for robust XLSX handling.
 * 
 * Usage:
 *   node scripts/i18n_sync_fr_ca.js --json path/to/fr-CA.json --targetDir gtk-device-ui-sky-262/i18n --dry-run --backup --report sync_report.txt
 */

const fs = require('fs');
const path = require('path');
const process = require('process');
const ExcelJS = require('exceljs');

// CLI argument parsing (minimal, no extra deps)
function parseArgs(argv) {
  const args = {
    json: null,
    targetDir: path.join(process.cwd(), 'gtk-device-ui-sky-262', 'i18n'),
    dryRun: false,
    backup: false,
    report: null,
    keyHeaders: ['key', 'id', 'name'],
    langHeaders: ['en', 'zh', 'zh-tw', 'fr', 'fr-ca'],
    sheetFilter: null,
    // New options for per-file JSON behavior
    jsonDir: path.join(process.cwd(), 'gtk-device-ui-sky-262', 'lang', 'fr-CA'),
    fallbackGlobal: true, // if true, fall back to global/common map when per-file is missing; else skip
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--backup') args.backup = true;
    else if (a === '--json' && i + 1 < argv.length) { args.json = argv[++i]; }
    else if (a === '--targetDir' && i + 1 < argv.length) { args.targetDir = argv[++i]; }
    else if (a === '--report' && i + 1 < argv.length) { args.report = argv[++i]; }
    else if (a === '--keyHeaders' && i + 1 < argv.length) {
      args.keyHeaders = argv[++i].split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    } else if (a === '--langHeaders' && i + 1 < argv.length) {
      args.langHeaders = argv[++i].split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    } else if (a === '--sheetFilter' && i + 1 < argv.length) {
      args.sheetFilter = argv[++i];
    } else if (a === '--jsonDir' && i + 1 < argv.length) {
      args.jsonDir = argv[++i];
    } else if (a === '--fallbackGlobal') {
      // presence enables fallback; support explicit true/false next token
      const next = argv[i + 1];
      if (next === 'true' || next === 'false') {
        args.fallbackGlobal = (argv[++i] === 'true');
      } else {
        args.fallbackGlobal = true;
      }
    } else {
      // ignore unknowns
    }
  }
  if (!args.report) {
    args.report = path.join(args.targetDir, 'fr-CA_sync_report.txt');
  }
  return args;
}

/**
 * Load fr-CA key/value map from:
 * - Provided --json path if given.
 * - Else, attempt gtk-device-ui-sky-262/i18n/fr-CA.json if it exists.
 * - Else, aggregate all JSON under gtk-device-ui-sky-262/lang/fr-CA/*.json into flat key:value by file scope:
 *      Creates keys "filename.key" if nested, with literal flattening of object keys using dot path.
 */
function loadFrCaMap(args) {
  // helper: flatten nested objects into key paths with dot notation
  const flatten = (obj, prefix = '') => {
    const out = {};
    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      for (const [k, v] of Object.entries(obj)) {
        const p = prefix ? `${prefix}.${k}` : k;
        if (v && typeof v === 'object' && !Array.isArray(v)) {
          Object.assign(out, flatten(v, p));
        } else {
          out[p] = v;
        }
      }
    }
    return out;
  };

  const existFile = (p) => { try { return fs.existsSync(p) && fs.statSync(p).isFile(); } catch { return false; } };
  const existDir = (p) => { try { return fs.existsSync(p) && fs.statSync(p).isDirectory(); } catch { return false; } };

  // Attempt provided --json
  if (args.json) {
    const p = path.isAbsolute(args.json) ? args.json : path.resolve(process.cwd(), args.json);
    if (!existFile(p)) {
      throw new Error(`Provided --json path not found: ${p}`);
    }
    const src = JSON.parse(fs.readFileSync(p, 'utf8'));
    // If JSON is array or flat map expected
    if (Array.isArray(src)) {
      // Expect array of objects with { key, value } or similar
      const map = {};
      for (const item of src) {
        if (!item) continue;
        const k = (item.key || item.id || item.name || '').toString();
        if (k) map[k] = item['fr-CA'] || item['fr_ca'] || item['fr'] || item['value'] || '';
      }
      return map;
    } else {
      // object: flatten
      return flatten(src);
    }
  }

  // Attempt default file under targetDir: fr-CA.json
  const defaultJson = path.join(args.targetDir, 'fr-CA.json');
  if (existFile(defaultJson)) {
    const obj = JSON.parse(fs.readFileSync(defaultJson, 'utf8'));
    return flatten(obj);
  }

  // Aggregate from lang/fr-CA/*.json
  const langDir = path.join(process.cwd(), 'gtk-device-ui-sky-262', 'lang', 'fr-CA');
  const map = {};
  if (existDir(langDir)) {
    const files = fs.readdirSync(langDir).filter(f => f.toLowerCase().endsWith('.json'));
    for (const f of files) {
      const p = path.join(langDir, f);
      try {
        const name = path.basename(f, '.json');
        const obj = JSON.parse(fs.readFileSync(p, 'utf8'));
        const flat = flatten(obj, ''); // result is like { a.b: "..." }
        // Store keys as "name.key" to reduce collision across files
        for (const [k, v] of Object.entries(flat)) {
          const newKey = `${name}.${k}`;
          map[newKey] = v;
        }
      } catch (e) {
        console.warn(`Warn: Failed parsing ${p}: ${e.message}`);
      }
    }
  }

  if (Object.keys(map).length === 0) {
    throw new Error('No fr-CA JSON source found. Provide --json or ensure i18n/fr-CA.json or lang/fr-CA/*.json exists.');
  }
  return map;
}

/**
 * Load a per-file fr-CA map based on an Excel filename (without path).
 * Resolution order for <base> (where file is <base>.xlsx):
 * 1) If args.json is a directory, use <args.json>/<base>.json
 * 2) args.json if it's a file and its basename matches <base>.json
 * 3) args.jsonDir/<base>.json
 * 4) <targetDir>/<base>.json (sibling next to the xlsx)
 * If none exists:
 *  - If args.fallbackGlobal is true, return the global map from loadFrCaMap(args)
 *  - Else, return null and let caller skip with a clear log
 */
function loadPerFileFrCaMap(args, baseName) {
  const existFile = (p) => { try { return fs.existsSync(p) && fs.statSync(p).isFile(); } catch { return false; } };
  const existDir = (p) => { try { return fs.existsSync(p) && fs.statSync(p).isDirectory(); } catch { return false; } };

  // If --json provided and is a directory, prefer <jsonDir>/<base>.json
  if (args.json) {
    const jPath = path.isAbsolute(args.json) ? args.json : path.resolve(process.cwd(), args.json);
    if (existDir(jPath)) {
      const candidate = path.join(jPath, `${baseName}.json`);
      if (existFile(candidate)) {
        try { return JSON.parse(fs.readFileSync(candidate, 'utf8')); } catch (e) { console.warn(`Warn: Failed parsing ${candidate}: ${e.message}`); }
      }
    } else if (existFile(jPath)) {
      // If provided JSON is a single file that matches the baseName, use it
      if (path.basename(jPath).toLowerCase() === `${baseName.toLowerCase()}.json`) {
        try { return JSON.parse(fs.readFileSync(jPath, 'utf8')); } catch (e) { console.warn(`Warn: Failed parsing ${jPath}: ${e.message}`); }
      }
    }
  }

  // Check configured jsonDir
  if (args.jsonDir) {
    const dir = path.isAbsolute(args.jsonDir) ? args.jsonDir : path.resolve(process.cwd(), args.jsonDir);
    const candidate = path.join(dir, `${baseName}.json`);
    if (existFile(candidate)) {
      try { return JSON.parse(fs.readFileSync(candidate, 'utf8')); } catch (e) { console.warn(`Warn: Failed parsing ${candidate}: ${e.message}`); }
    }
  }

  // Check sibling to xlsx in targetDir
  const sibling = path.join(args.targetDir, `${baseName}.json`);
  if (existFile(sibling)) {
    try { return JSON.parse(fs.readFileSync(sibling, 'utf8')); } catch (e) { console.warn(`Warn: Failed parsing ${sibling}: ${e.message}`); }
  }

  // Fallback
  if (args.fallbackGlobal) {
    try {
      // global map already flattened; wrap so updateWorksheet expects flat k/v
      return loadFrCaMap(args);
    } catch (e) {
      console.warn(`Warn: Global fallback map failed to load: ${e.message}`);
      return null;
    }
  }
  return null;
}

/**
 * Detect header indexes for a worksheet.
 * Returns { headerRow, headers: string[], keyColIndex, frCaColIndex, langColIndexes: {headerNameLower: index}, addedFrCaColumn }
 */
function detectHeaders(ws, keyHeaders, langHeaders) {
  const headerRow = ws.getRow(1);
  const headers = [];
  const headerMap = {}; // lowercase header -> index
  for (let c = 1; c <= headerRow.cellCount; c++) {
    const v = (headerRow.getCell(c).value ?? '').toString().trim();
    headers.push(v);
    if (v) {
      headerMap[v.toLowerCase()] = c;
    }
  }

  // find key column (first match)
  let keyColIndex = null;
  for (const kh of keyHeaders) {
    if (typeof headerMap[kh] === 'number') { keyColIndex = headerMap[kh]; break; }
  }
  if (!keyColIndex) {
    // attempt fuzzy: headers like "Key", "KEY", "Key Name"
    for (const [hLower, idx] of Object.entries(headerMap)) {
      if (hLower.startsWith('key')) { keyColIndex = idx; break; }
    }
  }

  // find language columns
  const langColIndexes = {};
  for (const lh of langHeaders) {
    if (typeof headerMap[lh] === 'number') {
      langColIndexes[lh] = headerMap[lh];
    }
  }

  // ensure fr-CA column
  let frCaColIndex = headerMap['fr-ca'] || headerMap['fr_ca'] || headerMap['fr'];
  let addedFrCaColumn = false;
  if (!frCaColIndex) {
    // add new column at end
    const newIndex = headerRow.cellCount + 1;
    headerRow.getCell(newIndex).value = 'fr-CA';
    frCaColIndex = newIndex;
    addedFrCaColumn = true;
  }

  return { headerRow, headers, keyColIndex, frCaColIndex, langColIndexes, addedFrCaColumn };
}

/**
 * Apply updates to a worksheet given the fr-CA map.
 * Returns summary info.
 */
function updateWorksheet(ws, frCaMap, options) {
  const {
    keyHeaders = ['key', 'id', 'name'],
    langHeaders = ['en', 'zh', 'zh-tw', 'fr', 'fr-ca'],
  } = options;

  const result = {
    updated: 0,
    inserted: 0,
    skipped: 0,
    excelKeysMissingInJson: [],
    jsonKeysMissingInExcel: [],
    addedFrCaColumn: false,
    keyColumnName: null,
  };

  // Detect headers (first row)
  const { headerRow, keyColIndex, frCaColIndex, addedFrCaColumn } = detectHeaders(ws, keyHeaders, langHeaders.map(s => s.toLowerCase()));
  result.addedFrCaColumn = addedFrCaColumn;

  if (!keyColIndex) {
    // no key column -> skip this worksheet
    result.skipped = (ws.rowCount > 1 ? ws.rowCount - 1 : 0);
    return result;
  }
  result.keyColumnName = (headerRow.getCell(keyColIndex).value || '').toString();

  // Build a map of existing keys -> row
  const excelKeyToRow = new Map();
  for (let r = 2; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const keyVal = row.getCell(keyColIndex).value;
    const key = keyVal === null || keyVal === undefined ? '' : keyVal.toString().trim();
    if (!key) continue;
    if (!excelKeyToRow.has(key)) {
      excelKeyToRow.set(key, row);
    }
  }

  // Track JSON keys found/updated
  const processedJsonKeys = new Set();

  // 1) Update existing rows
  for (const [key, row] of excelKeyToRow.entries()) {
    if (Object.prototype.hasOwnProperty.call(frCaMap, key)) {
      const newVal = frCaMap[key] ?? '';
      const cell = row.getCell(frCaColIndex);
      const oldVal = cell.value ? cell.value.toString() : '';
      if ((oldVal || '') !== (newVal || '')) {
        cell.value = newVal;
        result.updated += 1;
      } else {
        result.skipped += 1;
      }
      processedJsonKeys.add(key);
    } else {
      // Excel has a key not present in JSON log it as missing-in-json
      result.excelKeysMissingInJson.push(key);
      result.skipped += 1;
    }
  }

  // 2) Insert rows for JSON keys not present in Excel
  for (const [key, value] of Object.entries(frCaMap)) {
    if (!processedJsonKeys.has(key)) {
      // append to end
      const newRowIndex = ws.rowCount + 1;
      const newRow = ws.getRow(newRowIndex);

      // Place key in key column
      newRow.getCell(keyColIndex).value = key;
      // Place fr-CA in frCa column
      newRow.getCell(frCaColIndex).value = value ?? '';

      // Keep other cells empty; do not alter formatting broadly.
      newRow.commit();
      result.inserted += 1;
      result.jsonKeysMissingInExcel.push(key);
    }
  }

  // Commit header if a column was added
  headerRow.commit();

  return result;
}

/**
 * Process a workbook file and update all relevant worksheets.
 */
async function processWorkbook(filePath, _frCaMapGlobal, args, reportLines) {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(filePath);

  const sheetFilterLower = args.sheetFilter ? args.sheetFilter.toLowerCase() : null;

  let fileUpdated = false;
  let fileStats = { updated: 0, inserted: 0, skipped: 0, addedFrCaColumn: 0 };
  const sheetReports = [];

  // Determine per-file mapping
  const base = path.basename(filePath, '.xlsx');
  let frCaMapLocal = loadPerFileFrCaMap(args, base);
  let sourceNote = '';
  if (frCaMapLocal === null) {
    sourceNote = 'json source: missing (skipped)';
  } else if (typeof frCaMapLocal === 'object' && !Array.isArray(frCaMapLocal)) {
    sourceNote = `json source: per-file (${base}.json${args.jsonDir ? ` from ${args.jsonDir}` : ''} or fallback)`;
  } else {
    sourceNote = 'json source: unknown type';
  }

  if (frCaMapLocal === null) {
    // Skip whole workbook with clear log
    reportLines.push(`File: ${path.basename(filePath)} | SKIPPED (no per-file JSON found and fallback disabled)`);
    reportLines.push(`  - ${sourceNote}`);
    return { fileUpdated: false, fileStats: { updated: 0, inserted: 0, skipped: 0, addedFrCaColumn: 0 } };
  }

  // If fallback produced a global aggregated map, we might need to flatten
  const normalizeToFlat = (obj) => {
    // If it's already a flat map of key->value (string/primitive), keep as-is. If nested, flatten.
    const isFlat = Object.values(obj).every(v => (typeof v !== 'object' || v === null));
    if (isFlat) return obj;
    // reuse inline flattener
    const flatten = (o, prefix = '') => {
      const out = {};
      if (o && typeof o === 'object' && !Array.isArray(o)) {
        for (const [k, v] of Object.entries(o)) {
          const p = prefix ? `${prefix}.${k}` : k;
          if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(out, flatten(v, p));
          else out[p] = v;
        }
      }
      return out;
    };
    return flatten(obj);
  };
  const frCaMap = normalizeToFlat(frCaMapLocal);

  for (const ws of wb.worksheets) {
    const shouldProcess = !sheetFilterLower || (ws.name.toLowerCase().includes(sheetFilterLower));
    if (!shouldProcess) {
      sheetReports.push(`  - Sheet "${ws.name}": skipped by filter`);
      continue;
    }

    const res = updateWorksheet(ws, frCaMap, {
      keyHeaders: args.keyHeaders,
      langHeaders: args.langHeaders,
    });

    if (res.addedFrCaColumn) fileStats.addedFrCaColumn += 1;
    fileStats.updated += res.updated;
    fileStats.inserted += res.inserted;
    fileStats.skipped += res.skipped;

    if (res.updated > 0 || res.inserted > 0 || res.addedFrCaColumn) {
      fileUpdated = true;
    }

    // Build sheet report
    const lines = [];
    lines.push(`  - Sheet "${ws.name}":`);
    lines.push(`      key column: ${res.keyColumnName || '(none)'}`);
    if (res.addedFrCaColumn) lines.push(`      action: added fr-CA column`);
    lines.push(`      updated: ${res.updated}, inserted: ${res.inserted}, skipped: ${res.skipped}`);
    if (res.excelKeysMissingInJson.length) {
      lines.push(`      excel keys missing in json: ${res.excelKeysMissingInJson.length}`);
      lines.push(`        sample: ${res.excelKeysMissingInJson.slice(0, 10).join(', ')}${res.excelKeysMissingInJson.length > 10 ? ' ...' : ''}`);
    }
    if (res.jsonKeysMissingInExcel.length) {
      lines.push(`      json keys inserted: ${res.jsonKeysMissingInExcel.length}`);
      lines.push(`        sample: ${res.jsonKeysMissingInExcel.slice(0, 10).join(', ')}${res.jsonKeysMissingInExcel.length > 10 ? ' ...' : ''}`);
    }

    sheetReports.push(lines.join('\n'));
  }

  // If changes and not dry-run, backup and save
  if (fileUpdated && !args.dryRun) {
    if (args.backup) {
      const bakPath = `${filePath}.bak`;
      try {
        fs.copyFileSync(filePath, bakPath);
      } catch (e) {
        console.warn(`Warn: Failed to create backup for ${filePath}: ${e.message}`);
      }
    }
    await wb.xlsx.writeFile(filePath);
  }

  // Report for the file
  const header = `File: ${path.basename(filePath)} | updated: ${fileStats.updated}, inserted: ${fileStats.inserted}, skipped: ${fileStats.skipped}, fr-CA column added in ${fileStats.addedFrCaColumn} sheet(s)`;
  reportLines.push(header);
  reportLines.push(`  - ${sourceNote}`);
  sheetReports.forEach(l => reportLines.push(l));

  return { fileUpdated, fileStats };
}

async function main() {
  const args = parseArgs(process.argv);

  const resolvePath = (p) => path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);

  args.targetDir = resolvePath(args.targetDir);
  if (!fs.existsSync(args.targetDir) || !fs.statSync(args.targetDir).isDirectory()) {
    console.error(`Target directory not found: ${args.targetDir}`);
    process.exit(2);
  }

  // Try to pre-load a global map for reporting context; it's optional now
  let frCaMap = {};
  try {
    frCaMap = loadFrCaMap(args);
  } catch (e) {
    // Do not exit; per-file JSONs may still exist
    console.warn(`Warn: Global fr-CA JSON not loaded (${e.message}). Will attempt per-file JSONs.`);
  }

  const files = fs.readdirSync(args.targetDir).filter(f => f.toLowerCase().endsWith('.xlsx'));
  if (files.length === 0) {
    console.warn(`No .xlsx files found in ${args.targetDir}`);
  }

  const reportLines = [];
  reportLines.push(`fr-CA reverse-sync report`);
  reportLines.push(`timestamp: ${new Date().toISOString()}`);
  reportLines.push(`targetDir: ${args.targetDir}`);
  reportLines.push(`dryRun: ${args.dryRun}`);
  reportLines.push(`backup: ${args.backup}`);
  reportLines.push(`sheetFilter: ${args.sheetFilter || '(none)'}`);
  reportLines.push(`keyHeaders: ${args.keyHeaders.join(', ')}`);
  reportLines.push(`langHeaders: ${args.langHeaders.join(', ')}`);
  reportLines.push(`jsonDir: ${args.jsonDir}`);
  reportLines.push(`fallbackGlobal: ${args.fallbackGlobal}`);
  reportLines.push(`globalJsonKeys(preload): ${Object.keys(frCaMap).length}`);
  reportLines.push(`Mode: per-file JSON (basename match); will skip file if JSON missing and fallbackGlobal=false`);
  reportLines.push(`---------------------------------------------`);

  let anyUpdated = false;
  const overallStats = { updated: 0, inserted: 0, skipped: 0, frCaColAddedFiles: 0, filesProcessed: 0 };

  for (const f of files) {
    const p = path.join(args.targetDir, f);
    try {
      const { fileUpdated, fileStats } = await processWorkbook(p, frCaMap, args, reportLines);
      overallStats.filesProcessed += 1;
      overallStats.updated += fileStats.updated;
      overallStats.inserted += fileStats.inserted;
      overallStats.skipped += fileStats.skipped;
      if (fileStats.addedFrCaColumn > 0) overallStats.frCaColAddedFiles += 1;
      if (fileUpdated) anyUpdated = true;
    } catch (e) {
      reportLines.push(`File: ${f} | ERROR: ${e.message}`);
    }
    reportLines.push(`---------------------------------------------`);
  }

  // Summary
  reportLines.push(`Summary: filesProcessed=${overallStats.filesProcessed}, updated=${overallStats.updated}, inserted=${overallStats.inserted}, skipped=${overallStats.skipped}, fr-CA column added in ${overallStats.frCaColAddedFiles} file(s)`);

  // Write report file
  try {
    const reportPath = resolvePath(args.report);
    fs.writeFileSync(reportPath, reportLines.join('\n'), 'utf8');
    console.log(`Report written to ${reportPath}`);
  } catch (e) {
    console.warn(`Warn: Failed to write report file: ${e.message}`);
  }

  // Also log concise console summary
  console.log(reportLines.join('\n'));

  if (!args.dryRun && !anyUpdated) {
    // Non-zero exit to signal potential mismatch
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error(`Fatal error: ${err.message}`);
    process.exit(2);
  });
}

// PUBLIC_INTERFACE
module.exports = {
  parseArgs,
  loadFrCaMap,
  detectHeaders,
  updateWorksheet,
  processWorkbook,
};
