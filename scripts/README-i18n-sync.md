# i18n fr-CA Reverse Sync Utility

This utility reverse-applies translations from a fr-CA JSON source into the Excel `.xlsx` files under the `i18n/` directory.

Path: scripts/i18n_sync_fr_ca.js

## Requirements
- Node.js (v14+ recommended)
- NPM dependency: exceljs

Install exceljs in the project (if not already present):
  npm install --save-dev exceljs

## Usage

Dry run (no modifications, generates report):
  node scripts/i18n_sync_fr_ca.js --dry-run

Apply changes with backup:
  node scripts/i18n_sync_fr_ca.js --backup

Specify a custom JSON file and target directory:
  node scripts/i18n_sync_fr_ca.js --json path/to/fr-CA.json --targetDir gtk-device-ui-sky-262/i18n --backup

Filter to sheets containing a name:
  node scripts/i18n_sync_fr_ca.js --sheetFilter Language --backup

Custom report location:
  node scripts/i18n_sync_fr_ca.js --report ./fr_ca_sync_report.txt --dry-run

Per-file JSONs in a directory, skip if missing:
  node scripts/i18n_sync_fr_ca.js --jsonDir ./gtk-device-ui-sky-262/lang/fr-CA --fallbackGlobal false --backup

Per-file JSONs placed next to Excels in i18n/:
  node scripts/i18n_sync_fr_ca.js --targetDir gtk-device-ui-sky-262/i18n --fallbackGlobal false --backup

Custom key and language header detection:
  node scripts/i18n_sync_fr_ca.js --keyHeaders key,id,name --langHeaders en,zh,zh-TW,fr,fr-CA --backup

## Behavior
- Scans all `.xlsx` files in the targetDir (default: `gtk-device-ui-sky-262/i18n`).
- Detects header row (first row) and infers a key column using common names (`key,id,name`) and case-insensitive matching.
- Detects language columns, ensures a `fr-CA` column exists (adds one if missing).
- Updates rows matching keys from JSON to set `fr-CA` value.
- Appends new rows if a key exists in JSON but not in Excel (only sets key and fr-CA).
- Preserves other columns and formatting.
- Generates a detailed report (console + file). Default report path: `<targetDir>/fr-CA_sync_report.txt`.
- Exits with non-zero status when not in dry-run and no updates were applied to any file.

## JSON source resolution
Per-file source (preferred):
- For each Excel `<base>.xlsx`, the script looks for `<base>.json`:
  1) If `--json` points to a directory, uses `<--json>/<base>.json`
  2) If `--json` is a file whose basename matches `<base>.json`, uses it
  3) `--jsonDir/<base>.json` (default: `gtk-device-ui-sky-262/lang/fr-CA`)
  4) Sibling of the Excel: `<targetDir>/<base>.json`
- If none found:
  - If `--fallbackGlobal` is true (default), falls back to the global source resolution below
  - Else, skips the Excel with a clear log entry

Global fallback:
- If `--json` is provided and is a file (not matching per-file), it is used.
- Else if `<targetDir>/fr-CA.json` exists, it is used.
- Else aggregates `gtk-device-ui-sky-262/lang/fr-CA/*.json` by flattening each file to dot-keys and prefixing with the filename (e.g., `login.title`).

## Notes
- Keys are compared literally; the script does not attempt to transform dot or dash notation unless your Excel keys match them literally.
- To avoid accidental schema changes, it only modifies the `fr-CA` column and appends rows when needed.

