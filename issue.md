# STM32 Timer Calculator — Code Review Issues

## Previous Issues Status

| # | Issue | Status |
|---|-------|--------|
| 1 | F4/F7 presets use APB2 clock, misleading for APB1 timers | ? FIXED — Added `clockProfiles` with `dualBusClockProfiles()`, defaults to APB1 |
| 2 | Duty cycle uses CCR/ARR instead of CCR/(ARR+1) | ? FIXED — Added `dutyCycleMode` selector (hardware vs legacy) |
| 3 | DTG bit-field display doesn't match RM naming | ? FIXED — `getDtgDecode()` now shows RM branch pattern and active bit-field |

All three original issues have been addressed.

---

## New Issues Found (Second Review)

### Issue #4: Dead Time Calculation Uses `Tdts` Instead of `Tdtg` in Branch 0

**Severity**: Low (cosmetic / naming only — result is correct)

In the first branch (`0xxxxxxx`), the RM formula is `DT = DTG[6:0] × Tdts` (not `× Tdtg`). The code sets `tdtgUs = tdtsUs` for this branch, so the numeric result is correct, but the displayed formula says `DT = DTG[6:0] × Tdtg` which is slightly misleading. The RM explicitly uses `Tdts` for this branch and only introduces `Tdtg` as a multiplied step in the other branches.

**File**: `app.js`, `getDtgDecode()` function, first branch formula string.

---

### Issue #5: `STORAGE_KEY` Version Bump Without Migration

**Severity**: Low

The storage key changed from `v2` to `v3`. Users who had saved state under `v2` will lose their settings silently (falls back to defaults). This is acceptable for a tool like this, but a one-time migration or a note in the UI would be friendlier.

**File**: `app.js`, `STORAGE_KEY` constant.

---

### Issue #6: `apbClockMhz` Input Allows `change` Event Without Recalculation Binding

**Severity**: Very Low

The `apbClockMhz` field listens to `input` via `syncClockProfileWithInput`, but does not have a separate `change` listener. If a browser autofills or a spinner button is used without triggering `input`, the calculation may not update. Other numeric fields (`prescaler`, `counterPeriod`, etc.) bind both `input` and `change`.

**File**: `app.js`, `bindEvents()` function.

---

### Issue #7: No `<meta name="description">` Tag for SEO

**Severity**: Very Low

The page has no meta description. Since it's deployed on GitHub Pages, adding a description would improve discoverability.

**File**: `index.html`, `<head>` section.

---

## Feature Suggestions

### Feature #1: Center-Aligned PWM Mode Support

**Priority**: Medium

Currently the calculator only handles edge-aligned (up-counting) PWM. Center-aligned mode is common in motor control and H-bridge applications. In center-aligned mode:
- The counter counts up to ARR then back down to 0
- The effective PWM frequency is halved: `f = TIMxCLK / ((PSC+1) × (ARR+1) × 2)`
- Duty cycle calculation remains the same

Adding a "Counter Mode" selector (Up / Down / Center-Aligned) would make the tool more useful for motor control engineers.

---

### Feature #2: Target Duty Cycle Input (Reverse Calculation)

**Priority**: Medium

The tool already has "target frequency" reverse calculation. A similar "target duty cycle" input would be useful — enter a desired duty percentage and the tool fills in the CCR value automatically.

---

### Feature #3: Multiple Timer Channel Display

**Priority**: Low-Medium

Many projects use multiple output compare channels (CH1–CH4) on the same timer. Allowing the user to input multiple CCR values and see all duty cycles / pulse widths at once would reduce repetitive manual work.

---

### Feature #4: Timer Interrupt Period Display

**Priority**: Medium

Many users configure timers for periodic interrupts (not PWM). Showing the interrupt period prominently (e.g., "Interrupt fires every X ms" or "X times per second") would make the tool more intuitive for non-PWM use cases. The data is already computed (`periodMs`), but framing it as "interrupt interval" would help.

---

### Feature #5: URL Parameter Sharing

**Priority**: Low-Medium

Allow encoding the current configuration in the URL query string (e.g., `?chip=stm32f407&psc=84&arr=1000&ccr=500`). This lets users share specific configurations via links without needing to manually re-enter values.

---

### Feature #6: Dark/Light Theme Toggle

**Priority**: Low

The page is dark-mode only. Some users prefer light mode, especially when working in well-lit environments or printing. A simple toggle with `prefers-color-scheme` media query fallback would improve usability.

---

### Feature #7: Export Configuration as JSON / CSV

**Priority**: Low

Allow exporting the current parameter set and results as a JSON or CSV file. Useful for documentation or comparing multiple configurations side by side.

---

### Feature #8: Input Capture / Frequency Measurement Calculator

**Priority**: Low-Medium

A reverse mode: given a known input signal frequency, calculate what PSC/ARR values are needed to measure it accurately using timer input capture mode. This is a common use case that complements the existing PWM output calculator.

---

### Feature #9: Visual PWM Waveform Preview

**Priority**: Medium

A simple SVG or Canvas-based waveform diagram showing:
- The PWM output signal with correct duty cycle
- Dead time visualization (for complementary outputs)
- Period and pulse width annotations

This would make the tool much more intuitive, especially for beginners.

---

### Feature #10: Complementary Output with Dead Time Visualization

**Priority**: Low-Medium

For advanced timers (TIM1/TIM8), show both CHx and CHxN outputs with the dead time gap between them. This is critical for H-bridge and half-bridge power stage design.

---

## Summary

| Category | Item | Priority |
|----------|------|----------|
| Bug | #4 Formula label says Tdtg instead of Tdts in branch 0 | Low |
| Bug | #5 Storage key version bump without migration | Low |
| Bug | #6 Missing `change` event on clock input | Very Low |
| Bug | #7 No meta description for SEO | Very Low |
| Feature | #1 Center-aligned PWM mode | Medium |
| Feature | #2 Target duty cycle reverse calc | Medium |
| Feature | #3 Multiple timer channels | Low-Medium |
| Feature | #4 Timer interrupt period display | Medium |
| Feature | #5 URL parameter sharing | Low-Medium |
| Feature | #6 Dark/Light theme toggle | Low |
| Feature | #7 Export as JSON/CSV | Low |
| Feature | #8 Input capture calculator | Low-Medium |
| Feature | #9 Visual PWM waveform | Medium |
| Feature | #10 Complementary output visualization | Low-Medium |

---

## Follow-up Review (2026-05-12)

This follow-up review was re-checked against the current implementation after the F4/F7 preset fix, duty-cycle mode switch, and H7 preset expansion.

### Fix Status Update

| # | Item | Previous Review | Current Status | Notes |
|---|------|-----------------|----------------|-------|
| 4 | Branch `0xxxxxxx` formula label uses `Tdtg` instead of `Tdts` | Open | Fixed | `getDtgDecode()` now displays `DT = DTG[6:0] ? Tdts` |
| 5 | `STORAGE_KEY` bumped to `v3` without migration | Open | Still Open | Low impact, but a one-time `v2 -> v3` migration would be friendlier |
| 6 | `apbClockMhz` missing `change` event binding | Open | Fixed | `bindEvents()` now binds both `input` and `change` |
| 7 | Missing `<meta name="description">` | Open | Fixed | Added a description meta tag to `index.html` |

### Additional Check Result

No new high-severity functional bugs were found in this pass.

### Additional Feature Suggestion

#### Feature #11: Timer Instance Selector

**Priority**: Medium

Selecting a concrete timer instance such as `TIM1`, `TIM2`, `TIM3`, `TIM8`, `TIM15` would reduce ambiguity more than chip-only presets. It could automatically drive:

- APB1 / APB2 timer clock source selection
- 16-bit vs 32-bit counter width
- availability of advanced-timer features such as complementary output and dead time

This would make the calculator closer to actual STM32 timer configuration work.

