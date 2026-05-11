# STM32 Timer Calculator — Code Review (Third Pass)

## Previously Reported Issues — All Fixed ✅

| # | Issue | Status | Evidence |
|---|-------|--------|----------|
| 1 | F4/F7 presets use APB2 clock only | ✅ Fixed | `dualBusClockProfiles()` added, defaults to APB1 |
| 2 | Duty cycle uses CCR/ARR instead of CCR/(ARR+1) | ✅ Fixed | `dutyCycleMode` selector with hardware/legacy toggle |
| 3 | DTG bit-field display doesn't match RM naming | ✅ Fixed | `getDtgDecode()` shows correct RM branch and active field |
| 4 | DTG formula label says Tdtg instead of Tdts in branch 0 | ✅ Fixed | Now reads `"DT = DTG[6:0] × Tdts"` |
| 5 | Storage key version bump without migration | ✅ Acceptable | Intentional v2→v3 bump, falls back to defaults |
| 6 | Missing `change` event on clock input | ✅ Fixed | Both `input` and `change` now bound |

---

## New Issues Found (Third Review)

### Bug #1: Dead Time Calculation — `Tdtg` Step Variable Mismatch in Branch 0

**Severity**: Very Low (cosmetic only — numeric result is correct)

In `calculate()`, the dead time step is computed as:
```javascript
const tdtgUs = dtg.branch === "0xxxxxxx"
  ? tdtsUs   // correct: Tdtg = Tdts for this branch
  ...
```

The variable is named `tdtgUs` but for branch 0 it equals `tdtsUs`. The displayed label "步长 Tdtg" in the UI always shows this value. For branch 0, the RM doesn't define a separate "Tdtg" — it just uses Tdts directly. The label could say "步长 Tdts" for this branch to be fully accurate.

**Impact**: None on calculations. Cosmetic label inconsistency only.

---

### Bug #2: `restoreState()` Does Not Repopulate Clock Profile Dropdown Before Setting Value

**Severity**: Low-Medium (can cause silent failure on page load)

The `init()` flow is:
```javascript
function init() {
  populatePresetSelect();   // fills chip dropdown
  restoreState();           // sets all element values from localStorage (including clockProfile)
  populateClockProfiles(getSelectedPreset(), elements.clockProfile.value);  // fills clock profile dropdown
  ...
}
```

In `restoreState()` → `resetInputs()`, the code does `elements.clockProfile.value = savedValue`. But at this point, the `<select id="clockProfile">` is still **empty** (it hasn't been populated yet). Setting `.value` on an empty `<select>` silently fails — the value won't stick.

Then `populateClockProfiles()` is called with `elements.clockProfile.value` as `preferredId`, but since the previous assignment failed, `elements.clockProfile.value` will be `""` (empty string), so it falls back to the default profile.

**Consequence**: If a user had selected "APB2" on STM32F407 and refreshed the page, the clock profile would reset to "APB1" (the default) even though localStorage saved "apb2". The `apbClockMhz` value itself IS correctly restored (since it's a plain `<input>`), so the calculation result is still correct — but the dropdown won't visually match.

**Fix**: Pass the saved `clockProfile` value directly to `populateClockProfiles()` from the parsed localStorage data, rather than reading it from the DOM element.

---

### Bug #3: `syncClockProfileWithInput()` — Floating Point Comparison May Fail

**Severity**: Very Low

```javascript
const matchedProfile = profiles.find((profile) => profile.apbClockMhz === currentClock);
```

This uses strict equality (`===`) to compare a `Number` parsed from the input field with the preset's `apbClockMhz`. If the user types `84.0` or the browser represents it differently, the comparison could fail. In practice this is unlikely since the presets use integer values and `Number("84")` === `84`, but a fractional clock like `33.333` would never match.

**Impact**: Minimal. The dropdown just falls back to "手工输入" which is acceptable behavior.

---

### Bug #4: `updateSnippet()` Receives `undefined` for `dutyModeLabel` on Error Path

**Severity**: Very Low (no visible effect)

When `calculate()` hits the error path:
```javascript
updateSnippet({
  pscRegister: null,
  ...
  clockProfileLabel: "",
  // dutyModeLabel is NOT passed
});
```

Inside `updateSnippet()`, the null check on `pscRegister` causes an early return before `dutyModeLabel` is used, so this never manifests. But it's technically inconsistent with the success path.

---

### Bug #5: Dead Time Result Grid Has 5 Cards — Odd Layout on Some Viewports

**Severity**: Very Low (visual only)

The dead time section has 5 result cards (TDTS, DTG Binary, RM Branch, Tdtg Step, Dead Time DT). With `grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))`, on many common viewport widths this creates an uneven last row (3+2 or 4+1 layout). The other sections have 4 or 6 cards which tile evenly.

**Suggestion**: Either add a 6th card (e.g., "Dead Time as ns") or merge two cards to keep even grid rows.

---

### Bug #6: `counterPeriod` Input Semantics — Label Says "ARR + 1" But Validation Allows Values Beyond Register

**Severity**: Low (by design, but potentially confusing)

The input is labeled "计数周期 ARR + 1" and the user enters the count value (PSC+1 / ARR+1 semantics). The validation warns when `counterPeriod > inputValueMax` (i.e., > 2^bits), which is correct. However, the `min="1"` HTML attribute allows the browser spinner to go to 1, which means ARR = 0. While technically valid hardware-wise (ARR=0 means the counter overflows every single clock), it produces extremely high frequencies that may confuse users. A note or different warning threshold could help.

**Impact**: Not a bug per se — just a UX consideration.

---

### Bug #7: No `<meta name="description">` for SEO / Social Sharing

**Severity**: Low

The page has no `<meta name="description">` or Open Graph tags. Since it's deployed on GitHub Pages as a public tool, adding these would improve discoverability and link previews.

---

## Remaining Feature Gaps (Carried Forward)

These were identified in the previous review and remain unimplemented:

| # | Feature | Priority | Notes |
|---|---------|----------|-------|
| F1 | Center-aligned PWM mode support | Medium | Frequency halves in center-aligned; needs counter mode selector |
| F2 | Target duty cycle reverse calculation | Medium | Enter desired %, auto-fill CCR |
| F3 | Visual PWM waveform preview (SVG/Canvas) | Medium | Would greatly improve intuitiveness |
| F4 | Timer interrupt period display | Medium | Frame output as "interrupt every X ms" for non-PWM users |
| F5 | URL parameter sharing | Low-Medium | Encode config in query string for link sharing |
| F6 | Multiple timer channels (CH1–CH4) | Low-Medium | Show multiple CCR/duty values simultaneously |
| F7 | Input capture / frequency measurement calculator | Low-Medium | Reverse mode: measure incoming signal |
| F8 | Complementary output + dead time visualization | Low-Medium | Show CHx and CHxN waveforms with DT gap |
| F9 | Dark/Light theme toggle | Low | Currently dark-only |
| F10 | Export configuration as JSON/CSV | Low | For documentation and comparison |

---

## Summary of Current State

The codebase is in good shape. The three major issues from the first review are all properly fixed. The remaining bugs are all low/very-low severity — mostly cosmetic or edge-case UX issues. The most impactful remaining bug is **#2** (clock profile dropdown not properly restored from localStorage), which causes a visual mismatch but doesn't affect calculation accuracy.

The most valuable feature additions would be:
1. **Center-aligned PWM mode** — common in motor control, changes frequency formula
2. **Visual waveform preview** — makes the tool much more intuitive
3. **Target duty cycle input** — natural complement to the existing target frequency feature

---

## Follow-up Review (Fourth Pass, 2026-05-12)

This pass re-checked the seven low / very-low severity items raised after the third review.

### Verification Result

| # | Item | Result | Action |
|---|------|--------|--------|
| 1 | Branch-0 dead-time step label still says `Tdtg` | Valid | Fixed: UI now switches to `?? Tdts` for branch `0xxxxxxx` |
| 2 | Clock-profile dropdown does not restore correctly from localStorage | Valid | Fixed: `restoreState()` now returns saved state and `init()` passes the saved `clockProfile` into `populateClockProfiles()` |
| 3 | Strict floating-point equality in `syncClockProfileWithInput()` | Valid but low impact | Fixed: profile matching now uses a tolerance instead of raw `===` |
| 4 | Error-path call to `updateSnippet()` omits `dutyModeLabel` | Valid but harmless | Fixed for consistency |
| 5 | Dead-time grid has 5 cards and creates uneven layouts | Valid | Fixed: added a 6th card (`deadTimeNs`) so the section tiles more cleanly |
| 6 | `counterPeriod = 1` is hardware-valid but confusing | Valid as UX issue | Mitigated: page now shows an explicit informational message when `ARR = 0` |
| 7 | Missing meta tags | Original claim no longer fully applies | `meta description` was already present before this pass; this pass additionally added Open Graph tags and `theme-color` |

### Additional Notes

- No new high-severity functional bugs were found in this pass.
- The previously suggested feature backlog still stands; the highest-value additions remain center-aligned PWM mode, target duty-cycle reverse calculation, and visual waveform preview.

