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

## Issues Found in Third Review (All Now Resolved)

| # | Bug | Original Severity | Current Status |
|---|-----|-------------------|----------------|
| 1 | Branch-0 step label always says "Tdtg" | Very Low | ✅ Fixed — dynamically shows "步长 Tdts" / "步长 Tdtg" |
| 2 | Clock profile dropdown not restored from localStorage | Low-Medium | ✅ Fixed — `restoreState()` returns state, passed to `populateClockProfiles()` |
| 3 | Strict `===` float comparison in profile matching | Very Low | ⚪ Acceptable — see Fourth Pass assessment |
| 4 | `dutyModeLabel` missing on error path | Very Low | ⚪ Harmless — early return prevents access |
| 5 | Dead-time grid has 5 cards (uneven layout) | Very Low | ✅ Fixed — 6th card (`deadTimeNs`) added |
| 6 | `counterPeriod = 1` confusing but valid | Low | ⚪ By design — existing warning is adequate |
| 7 | No `<meta name="description">` / OG tags | Low | ✅ Fixed — meta description + OG tags + theme-color all present |

---

## Follow-up Review (Fourth Pass, 2026-05-12)

This pass re-checked the seven low / very-low severity items raised after the third review.

### Verification Result

| # | Item | Result | Action |
|---|------|--------|--------|
| 1 | Branch-0 dead-time step label still says `Tdtg` | ✅ Fixed | UI now dynamically switches to "步长 Tdts" for branch `0xxxxxxx` |
| 2 | Clock-profile dropdown does not restore correctly from localStorage | ✅ Fixed | `restoreState()` now returns saved state; `init()` passes `restoredState.clockProfile` into `populateClockProfiles()` |
| 3 | Strict floating-point equality in `syncClockProfileWithInput()` | Still uses `===` | See recommendation below |
| 4 | Error-path call to `updateSnippet()` omits `dutyModeLabel` | Harmless | Early-return prevents access; no visible effect |
| 5 | Dead-time grid has 5 cards and creates uneven layouts | ✅ Fixed | Added 6th card (`deadTimeNs`) — grid now tiles evenly |
| 6 | `counterPeriod = 1` is hardware-valid but confusing | UX only | Not a bug; existing warning message is adequate |
| 7 | Missing meta tags | ✅ No longer valid | `<meta name="description">`, `og:title`, `og:description`, `og:type`, `theme-color` all present in `index.html` |

---

### Detailed Assessment of Each Item

**Bug #1 (Tdtg/Tdts label)** — Fully resolved. The code now reads:

```javascript
elements.dtgStepLabel.textContent = dtg.branch === "0xxxxxxx" ? "步长 Tdts" : "步长 Tdtg";
```

This matches the RM convention perfectly. **No further action needed.**

---

**Bug #2 (Clock profile restore)** — Fully resolved. The `init()` function now uses:

```javascript
const restoredState = restoreState();
populateClockProfiles(getSelectedPreset(), restoredState.clockProfile);
```

The saved `clockProfile` ID is passed directly from the parsed localStorage object, bypassing the empty-select problem. Additionally, `restoreState()` now includes v2→v3 migration logic via `LEGACY_STORAGE_KEY`. **No further action needed.**

---

**Bug #3 (Floating-point equality)** — The code still uses strict `===`:

```javascript
const matchedProfile = profiles.find((profile) => profile.apbClockMhz === currentClock);
```

**My recommendation: Leave as-is.** All preset clock values are integers (32, 48, 64, 72, 80, 84, 90, 100, 108, 160, 168, 170, 180, 216, 240, 275). JavaScript's `Number("84") === 84` is always true for integers within safe range. The only scenario where this fails is if a user types something like `84.000000001` — in which case falling back to "手工输入" is the correct behavior anyway. Adding epsilon-based comparison would introduce complexity for no real benefit and could cause false matches (e.g., user types `83.9` matching the `84` profile).

---

**Bug #4 (Missing `dutyModeLabel` on error path)** — Still technically present but completely harmless. The `updateSnippet()` function returns immediately when `pscRegister == null`, so `dutyModeLabel` is never accessed. **No action needed.** If you want to be pedantic, add `dutyModeLabel: ""` to the error-path call, but it has zero functional impact.

---

**Bug #5 (Odd card count)** — Fully resolved. The dead-time section now has 6 cards: TDTS, DTG Binary, RM Branch, Step (Tdts/Tdtg), Dead Time (μs), Dead Time (ns). This tiles as 3×2, 2×3, or 6×1 depending on viewport. **No further action needed.**

---

**Bug #6 (counterPeriod = 1 / ARR = 0)** — This is valid hardware behavior. The existing warning message ("Counter Period 为 1 时，Excel 口径分母为 0") is adequate for the legacy mode. In hardware mode, `counterPeriod = 1` produces 100% duty when CCR ≥ 1, which is also correct. **No action needed** — this is a design choice, not a bug.

---

**Bug #7 (Missing meta tags)** — **This issue is no longer valid.** The current `index.html` contains:

```html
<meta name="description" content="STM32 定时器计算器：支持 TIMxCLK、PSC、ARR、CCR、PWM 占空比、死区时间、目标频率反推和多系列 STM32 预设。">
<meta property="og:title" content="STM32 定时器计算器">
<meta property="og:description" content="支持 TIMxCLK、PSC、ARR、CCR、PWM 占空比、死区时间、目标频率反推和多系列 STM32 预设。">
<meta property="og:type" content="website">
<meta name="theme-color" content="#0b1020">
```

This covers SEO description, Open Graph for social sharing, and theme color for mobile browsers. **Fully addressed. No further action needed.**

Optional enhancement: Consider adding `og:image` with a screenshot of the tool for richer link previews on social platforms, and `og:url` with the canonical GitHub Pages URL.

---

### Final Verdict

All previously reported bugs are either **fixed** or **confirmed as non-issues**. The codebase is clean and functional. No new bugs were found in this pass.

**Remaining open items (all optional / enhancement-level):**

1. Bug #3 (float comparison) — Recommend leaving as-is (see reasoning above)
2. Bug #4 (missing `dutyModeLabel` on error path) — Cosmetic inconsistency, zero impact
3. Feature backlog (F1–F10) — Still valid enhancement opportunities

---

## Feature Backlog (Unchanged)

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

## Fifth Pass Review (2026-05-12)

### New Bugs Found

**No new functional bugs found.** The codebase is solid. All calculations are correct, all DOM elements are properly referenced, and the error/fallback paths are consistent.

One minor observation:

#### Observation: `fillFallback()` Sets `dtgStepLabel` Twice

In `fillFallback()`, `dtgStepLabel` is included in the loop that sets all elements to `"-"`, then immediately overwritten to `"步长 Tdtg"` on the next line. This is harmless (two DOM writes in the same synchronous frame are coalesced by the browser), but could be slightly cleaner by excluding it from the loop.

**Impact**: Zero. Not worth fixing.

---

### New Feature Suggestions

#### F11: Keyboard Shortcut for "Apply Target Frequency"

**Priority**: Low

Power users who frequently adjust the target frequency would benefit from pressing Enter in the target frequency input to trigger the "回填 PSC / ARR" button, rather than needing to click it. Currently pressing Enter in the input does nothing.

**Implementation**: Add a `keydown` listener on `targetFrequencyHz` that calls `applyTargetFrequency()` when `event.key === "Enter"`.

---

#### F12: Show Relative Error After Target Frequency Apply

**Priority**: Low-Medium

When the target frequency is applied, the status message shows the actual frequency but not the relative error percentage. For precision-sensitive applications (e.g., UART baud rate generation, audio sampling), showing something like "误差 0.016%" would be immediately useful.

---

#### F13: Reverse Dead Time Calculator (Target DT → DTG Value)

**Priority**: Medium

Currently the user must manually try different DTG values to achieve a desired dead time. A reverse calculator — "I want 1.5 μs dead time, what DTG value should I use?" — would be very practical for H-bridge and motor control design.

---

#### F14: Favicon

**Priority**: Low

The page has no favicon. Adding a simple SVG favicon (e.g., a timer icon) would make it easier to identify among browser tabs and improve the professional appearance.

---

#### F15: Print-Friendly Stylesheet

**Priority**: Low

Engineers sometimes print or PDF-export calculator results for design reviews. A `@media print` stylesheet that removes the dark background, adjusts colors for paper, and ensures all result cards are visible would be a nice touch.

---

#### F16: Keyboard Navigation / Focus Indicators

**Priority**: Low

The `:focus` styles exist for inputs but the buttons lack visible focus indicators for keyboard-only users. Adding `outline` or `box-shadow` on `.button:focus-visible` would improve accessibility.

---

#### F17: `og:image` for Social Link Previews

**Priority**: Very Low

The OG tags are present but there's no `og:image`. Adding a screenshot or branded image would make shared links look better on social platforms and chat apps.

---

### Updated Feature Backlog

| # | Feature | Priority | Status |
|---|---------|----------|--------|
| F1 | Center-aligned PWM mode support | Medium | ✅ Implemented |
| F2 | Target duty cycle reverse calculation | Medium | Open |
| F3 | Visual PWM waveform preview (SVG/Canvas) | Medium | ✅ Implemented |
| F4 | Timer interrupt period display | Medium | Open |
| F5 | URL parameter sharing | Low-Medium | Open |
| F6 | Multiple timer channels (CH1–CH4) | Low-Medium | Open |
| F7 | Input capture / frequency measurement calculator | Low-Medium | Open |
| F8 | Complementary output + dead time visualization | Low-Medium | Open |
| F9 | Dark/Light theme toggle | Low | Open |
| F10 | Export configuration as JSON/CSV | Low | Open |
| F11 | Enter key triggers target frequency apply | Low | ✅ Implemented |
| F12 | Show relative error after frequency apply | Low-Medium | ✅ Implemented |
| F13 | Reverse dead time calculator (target DT → DTG) | Medium | ✅ Implemented |
| F14 | Favicon | Low | New |
| F15 | Print-friendly stylesheet | Low | New |
| F16 | Button focus-visible indicators | Low | New |
| F17 | `og:image` for social previews | Very Low | New |

---

### Final Status

The project has **zero known functional bugs**. All previously reported issues have been resolved. The code quality is high, calculations are correct, and the UI is well-structured.

The next most impactful features to add would be:
1. **F2 — Target duty cycle reverse calculation**
2. **F4 — Timer interrupt period display**
3. **F8 — Complementary output + dead time visualization**
4. **F10 — Export configuration as JSON/CSV**

---

### Feature Update (2026-05-12)

This pass implemented the highest-value interaction improvements from the backlog:

- **F1**: Added center-aligned counter modes and folded the doubled PWM period into frequency / pulse-width calculations.
- **F3**: Added an on-page waveform preview to visualize edge-aligned vs center-aligned output and dead-time windows.
- **F11**: Pressing `Enter` in the target frequency input now triggers reverse fitting directly.
- **F12**: The target-frequency reverse-fit card now shows actual frequency and relative error percentage.
- **F13**: Added reverse dead-time calculation (`target dead time → DTG`) using the same `Tdts / DTG` logic as the main calculator.
