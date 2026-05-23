---
name: timesheet
description: "Manage weekly timesheets in Google Sheets with NZ public holiday tracking. Creates timesheet spreadsheets, fills missing weeks, records PTO/unpaid leave, and tracks cumulative hours with per-day category breakdowns. Trigger on: timesheet, fill timesheet, record PTO, record leave, update hours, check hours, time tracking, holiday tracking."
argument-hint: "[setup|fill|pto|unpaid|status] [--date DATE] [--hours N] [--note TEXT]"
metadata:
  version: 0.1.0
  openclaw:
    category: "recipe"
    domain: "productivity"
    requires:
      bins:
        - gws
      skills:
        - gws-sheets
        - gws-sheets-append
        - gws-sheets-read
        - gws-drive
        - gws-calendar
---

# Timesheet Management

Manage weekly timesheets in Google Sheets. Each row is one work week (Mon-Fri), with per-day breakdowns of work hours, PTO, public holidays, and unpaid leave. Cumulative totals and remaining balances are tracked automatically via formulas.

## Constants

| Constant | Value |
|----------|-------|
| FOLDER_ID | `1yEE-2vwDzwn_jmse8xe6ApzGCGCBuUwQ` |
| ANCHOR_MONDAY | 2026-04-27 |
| FIRST_WORK_DAY | 2026-04-28 (Tuesday) |
| HOURS_PER_DAY | 8 |
| ANNUAL_PTO_DAYS | 20 (160 hours) |
| MAX_PUBLIC_HOLIDAYS | 11 |
| HOLIDAY_CALENDAR | `en.new_zealand#holiday@group.v.calendar.google.com` |
| TIMEZONE | `Pacific/Auckland` |

## Column Layout (33 columns, A-AG)

Row 1 is headers. Data starts at row 2.

Each day has 4 columns: **Work**, **PTO**, **Holiday**, **Unpaid**. These should sum to HOURS_PER_DAY (8) for a full day.

### Day columns (C-V, 4 per weekday)

| Col | Header | Default |
|-----|--------|---------|
| C | Mon Work | 8 |
| D | Mon PTO | 0 |
| E | Mon Holiday | 0 |
| F | Mon Unpaid | 0 |
| G | Tue Work | 8 |
| H | Tue PTO | 0 |
| I | Tue Holiday | 0 |
| J | Tue Unpaid | 0 |
| K | Wed Work | 8 |
| L | Wed PTO | 0 |
| M | Wed Holiday | 0 |
| N | Wed Unpaid | 0 |
| O | Thu Work | 8 |
| P | Thu PTO | 0 |
| Q | Thu Holiday | 0 |
| R | Thu Unpaid | 0 |
| S | Fri Work | 8 |
| T | Fri PTO | 0 |
| U | Fri Holiday | 0 |
| V | Fri Unpaid | 0 |

### Info columns (A-B)

| Col | Header |
|-----|--------|
| A | Week # |
| B | Week Start |

### Summary columns (W-AG)

| Col | Header | Formula |
|-----|--------|---------|
| W | Work Hrs | `=SUM(C{r},G{r},K{r},O{r},S{r})` |
| X | PTO Hrs | `=SUM(D{r},H{r},L{r},P{r},T{r})` |
| Y | Holiday Hrs | `=SUM(E{r},I{r},M{r},Q{r},U{r})` |
| Z | Unpaid Hrs | `=SUM(F{r},J{r},N{r},R{r},V{r})` |
| AA | YTD Work | `=W2` (row 2) or `=AA{r-1}+W{r}` |
| AB | YTD PTO | `=X2` (row 2) or `=AB{r-1}+X{r}` |
| AC | YTD Holiday | `=Y2` (row 2) or `=AC{r-1}+Y{r}` |
| AD | YTD Unpaid | `=Z2` (row 2) or `=AD{r-1}+Z{r}` |
| AE | PTO Remaining | `=160-AB{r}` |
| AF | Holidays Remaining | `=11-AC{r}/8` |
| AG | Notes | Free text |

---

## Commands

### setup — Create the timesheet spreadsheet

Use when the user first sets up timesheets, or says "create timesheet", "set up timesheet", or "initialise timesheet".

**Steps:**

1. **Check for existing spreadsheet:**
   ```bash
   gws drive files list --params '{"q": "name = '\''Timesheet'\'' and '\''1yEE-2vwDzwn_jmse8xe6ApzGCGCBuUwQ'\'' in parents and trashed = false"}'
   ```
   If found, use that spreadsheet ID. If not, create it (step 2).

2. **Create the spreadsheet:**
   ```bash
   gws drive files create --json '{"name": "Timesheet", "mimeType": "application/vnd.google-apps.spreadsheet", "parents": ["1yEE-2vwDzwn_jmse8xe6ApzGCGCBuUwQ"]}'
   ```
   Capture the `id` from the response — this is the SPREADSHEET_ID.

3. **Get the default sheet's sheetId:**
   ```bash
   gws sheets spreadsheets get --params '{"spreadsheetId": "SPREADSHEET_ID", "fields": "sheets.properties"}'
   ```
   Note the `sheetId` of the default sheet (usually 0).

4. **Rename the default tab to "Year 1":**
   ```bash
   gws sheets spreadsheets.batchUpdate --params '{"spreadsheetId": "SPREADSHEET_ID"}' \
     --json '{"requests": [{"updateSheetProperties": {"properties": {"sheetId": 0, "title": "Year 1"}, "fields": "title"}}]}'
   ```

5. **Write the header row:**
   ```bash
   gws sheets spreadsheets.values.update \
     --params '{"spreadsheetId": "SPREADSHEET_ID", "range": "Year 1!A1:AG1", "valueInputOption": "USER_ENTERED"}' \
     --json '{"values": [["Week #","Week Start","Mon Work","Mon PTO","Mon Holiday","Mon Unpaid","Tue Work","Tue PTO","Tue Holiday","Tue Unpaid","Wed Work","Wed PTO","Wed Holiday","Wed Unpaid","Thu Work","Thu PTO","Thu Holiday","Thu Unpaid","Fri Work","Fri PTO","Fri Holiday","Fri Unpaid","Work Hrs","PTO Hrs","Holiday Hrs","Unpaid Hrs","YTD Work","YTD PTO","YTD Holiday","YTD Unpaid","PTO Remaining","Holidays Remaining","Notes"]]}'
   ```

6. **Fetch NZ public holidays for Year 1:**
   ```bash
   gws calendar events list --params '{
     "calendarId": "en.new_zealand#holiday@group.v.calendar.google.com",
     "timeMin": "2026-04-27T00:00:00+12:00",
     "timeMax": "2027-05-04T00:00:00+12:00",
     "singleEvents": true,
     "orderBy": "startTime",
     "timeZone": "Pacific/Auckland"
   }'
   ```
   Build a map of `date_string -> holiday_name` from the response. Each event has a `start.date` (YYYY-MM-DD) and `summary` (holiday name). Some holidays may appear as "Observed" variants — include those too.

7. **Generate week rows** from ANCHOR_MONDAY (2026-04-27) up to the current week. For each week:
   - **Week #**: sequential number starting at 1
   - **Week Start**: Monday date in YYYY-MM-DD format
   - **Day columns**: For each day Mon-Fri, check if that date:
     - Falls on or before ANCHOR_MONDAY and is Monday → Mon Work=0, all others 0 (pre-start)
     - Is a public holiday → Work=0, Holiday=8, others=0
     - Is a normal work day → Work=8, others=0
   - **Summary formulas**: Use the formulas from the column layout table above, with the correct row number
   - **Notes**: Holiday names if any, "Start date April 28" for week 1

   The first week (2026-04-27) is partial: Monday April 27 Work=0 (not started yet), Tuesday April 28 onwards Work=8.

8. **Append all week rows at once:**
   ```bash
   gws sheets +append --spreadsheet SPREADSHEET_ID --range "Year 1!A1" \
     --json-values '[<row1>,<row2>,...,<rowN>]'
   ```
   Each row is a JSON array of 33 values. Example for a normal week (row 3):
   ```json
   [3,"2026-05-11",8,0,0,0,8,0,0,0,8,0,0,0,8,0,0,0,8,0,0,0,"=SUM(C3,G3,K3,O3,S3)","=SUM(D3,H3,L3,P3,T3)","=SUM(E3,I3,M3,Q3,U3)","=SUM(F3,J3,N3,R3,V3)","=AA2+W3","=AB2+X3","=AC2+Y3","=AD2+Z3","=160-AB3","=11-AC3/8",""]
   ```

---

### fill — Fill missing weeks

Use when the user says "fill timesheet", "update timesheet", "catch up timesheet", or "fill missing weeks".

**Steps:**

1. **Find the spreadsheet:**
   ```bash
   gws drive files list --params '{"q": "name = '\''Timesheet'\'' and '\''1yEE-2vwDzwn_jmse8xe6ApzGCGCBuUwQ'\'' in parents and trashed = false"}'
   ```
   If not found, tell the user to run `setup` first.

2. **Determine the current year tab:**
   Calculate `yearNumber = floor((today - 2026-04-27).days / 365.25) + 1`. Clamp to minimum 1. The tab name is `"Year {yearNumber}"`.

3. **Read the existing data:**
   ```bash
   gws sheets +read --spreadsheet SPREADSHEET_ID --range "Year {yearNumber}!A1:AG"
   ```
   Find the last non-empty row. Extract its Week # and Week Start date.

4. **Check for year rollover:**
   If the current date falls in a year beyond the existing tabs, create a new tab:
   ```bash
   gws sheets spreadsheets.batchUpdate --params '{"spreadsheetId": "SPREADSHEET_ID"}' \
     --json '{"requests": [{"addSheet": {"properties": {"title": "Year {newYearNumber}"}}}]}'
   ```
   Then write headers to the new tab (same as step 5 of `setup`).

5. **Fetch NZ holidays for the current year range:**
   Calculate the year start (Monday on or before April 27 of the appropriate calendar year) and end (day before the next year start). Query:
   ```bash
   gws calendar events list --params '{
     "calendarId": "en.new_zealand#holiday@group.v.calendar.google.com",
     "timeMin": "{yearStart}T00:00:00+12:00",
     "timeMax": "{yearEnd}T00:00:00+12:00",
     "singleEvents": true,
     "orderBy": "startTime",
     "timeZone": "Pacific/Auckland"
   }'
   ```

6. **Generate missing week rows** from (last filled week + 1) to the current week, applying holiday matching as described in `setup` step 7.

7. **Append the missing rows:**
   ```bash
   gws sheets +append --spreadsheet SPREADSHEET_ID --range "Year {yearNumber}!A1" \
     --json-values '[<row1>,<row2>,...]'
   ```

---

### pto — Record PTO for a specific date

Use when the user says "record PTO", "I took PTO", "mark PTO", or specifies a date with PTO hours.

Arguments: `--date` (required, YYYY-MM-DD), `--hours` (optional, defaults to 8), `--note` (optional).

**Steps:**

1. **Find the spreadsheet** (same lookup as `fill` step 1).

2. **Determine the year tab** for the given date (same calculation as `fill` step 2).

3. **Map the date to a row and columns:**
   - Find the Monday of the date's week.
   - Calculate the week number within the year (days from year start Monday / 7 + 1).
   - The row number is `weekNumber + 1` (row 1 is headers).
   - Determine the day-of-week column offset:
     - Monday → columns C,D,E,F (Work, PTO, Holiday, Unpaid)
     - Tuesday → columns G,H,I,J
     - Wednesday → columns K,L,M,N
     - Thursday → columns O,P,Q,R
     - Friday → columns S,T,U,V
   - Saturday or Sunday → error, PTO can't be recorded on weekends.

4. **Read the current row values** to preserve existing data:
   ```bash
   gws sheets +read --spreadsheet SPREADSHEET_ID --range "Year {yearNumber}!A{row}:AG{row}"
   ```

5. **Update the row:**
   - Reduce the day's Work column by the PTO hours (e.g., if Mon Work was 8 and PTO is 4, set Mon Work=4)
   - Set the day's PTO column to the PTO hours
   - Keep all other columns unchanged (the summary formulas in W-AG auto-recalculate)
   ```bash
   gws sheets spreadsheets.values.update \
     --params '{"spreadsheetId": "SPREADSHEET_ID", "range": "Year {yearNumber}!A{row}:AG{row}", "valueInputOption": "USER_ENTERED"}' \
     --json '{"values": [[<updated values>]]}'
   ```

6. If `--note` was provided, append it to the Notes column (AG).

---

### unpaid — Record unpaid leave for a specific date

Same workflow as `pto`, but:
- Sets the day's **Unpaid** column instead of PTO
- Reduces the day's Work column accordingly

---

### status — Show year-to-date summary

Use when the user says "timesheet status", "check my hours", "how many hours have I worked", "PTO remaining", or "holiday balance".

**Steps:**

1. **Find the spreadsheet** (same lookup as `fill` step 1).

2. **Determine the current year tab** (same as `fill` step 2).

3. **Read the last filled row:**
   ```bash
   gws sheets +read --spreadsheet SPREADSHEET_ID --range "Year {yearNumber}!A{lastRow}:AG{lastRow}"
   ```

4. **Report:**
   - Week number and date range
   - Cumulative work hours (column AA)
   - Cumulative PTO hours (column AB) and remaining days (column AE / 8)
   - Cumulative holiday days (column AC / 8) and remaining (column AF)
   - Cumulative unpaid hours (column AD)

---

## Year Tab Logic

Each anniversary year starts on the Monday of the week containing April 27.

To find the year start Monday for year N:
1. The anchor year starts 2026-04-27.
2. Calendar year for year N's start = 2025 + N.
3. Find April 27 of that calendar year.
4. Find the Monday on or before that date (i.e., subtract (weekday - 1) days where Monday=1).

Examples:
- Year 1: Monday 2026-04-27 (April 27 is a Monday)
- Year 2: Monday 2026-04-26 (April 27, 2027 is a Tuesday, so Monday is April 26)
- Year 3: Monday 2028-04-24 (April 27, 2028 is a Thursday, so Monday is April 24)

To determine which year a date falls into:
```
yearNumber = floor((date - 2026-04-27).days / 365.25) + 1
```

## Holiday Matching

When generating week rows, for each day Mon-Fri:

1. Check if the date exists in the holiday map.
2. If it's a holiday:
   - Work column = 0
   - Holiday column = 8
   - Add holiday name to Notes column
3. If it's not a holiday:
   - Work column = 8 (or 0 if before FIRST_WORK_DAY)
   - Holiday column = 0

For the first week only: Monday 2026-04-27 Work=0 (not yet started). Tuesday 2026-04-28 onwards is normal.

## GWS API Patterns

Before calling any API method, inspect it if unsure:
```bash
gws schema sheets.spreadsheets.values.update
gws schema drive.files.create
gws schema calendar.events.list
```

All write operations require user confirmation before executing. Use `valueInputOption: "USER_ENTERED"` so that formula strings (starting with `=`) are interpreted as formulas, not literal text.

When reading sheet data, the response contains a `values` array where each element is a row. Empty cells may be represented as empty strings or omitted from the end of a row.

## See Also

- `gws-sheets` — All spreadsheet operations
- `gws-sheets-append` — Row appending helper
- `gws-sheets-read` — Row reading helper
- `gws-drive` — File management
- `gws-calendar` — Calendar and holiday lookup
