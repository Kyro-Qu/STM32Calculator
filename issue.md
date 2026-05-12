# STM32 Timer Calculator — Open Issues

**Last reviewed**: 2026-05-12

## Bugs

**None.** All previously identified bugs have been fixed. The codebase is clean and all calculations are correct, including:
- Center-aligned mode frequency/period/pulse calculations ✓
- Target frequency reverse search with period factor ✓
- Dead time reverse calculator (DTG brute-force search) ✓
- DTG decode matching RM branch patterns ✓
- Dual-bus clock profiles for F4/F7 ✓
- Hardware vs legacy duty cycle modes ✓
- localStorage save/restore with v2→v3 migration ✓
- Enter key shortcut for target frequency ✓

---

## Feature Backlog

| # | Feature | Priority | Status | Notes |
|---|---------|----------|--------|-------|
| F1 | Target duty cycle reverse calculation | Medium | ✅ Implemented | Enter desired %, auto-fill CCR |
| F2 | URL parameter sharing | Low-Medium | ✅ Implemented | Encodes current state into query string and supports copy link |
| F3 | Multiple timer channels (CH1–CH4) | Low-Medium | ✅ Implemented | Separate CCR inputs with simultaneous duty / pulse summaries |
| F4 | Input capture / frequency measurement calculator | Low-Medium | ✅ Implemented | Reverse-plans PSC / ARR for a given measured frequency |
| F5 | Dark/Light theme toggle | Low | ✅ Implemented | Toggle button plus `prefers-color-scheme` default |
| F6 | Export configuration as JSON/CSV | Low | ✅ Implemented | JSON / CSV downloads for current config |
| F7 | Print-friendly stylesheet | Low | ✅ Implemented | `@media print` simplifies layout and forces white background |
| F8 | Favicon | Low | ✅ Implemented | Added SVG timer icon |
| F9 | `og:image` for social link previews | Very Low | ✅ Implemented | Added branded SVG cover and meta tags |

---

## 2026-05-12 Feature Sweep

All 9 remaining enhancement ideas were reasonable. None needed to be rejected.

- `F1` is now available as a direct "目标占空比反推" tool and writes back to the main CCR field.
- `F2` is implemented with URL query-state sync and a copy-share-link action.
- `F3` is implemented as a separate CH1–CH4 planning panel with independent CCR inputs.
- `F4` is implemented as an input-capture planning panel using the current timer clock and bit width.
- `F5` defaults to system theme and adds an explicit dark/light toggle.
- `F6` exports the current configuration and key results as JSON or CSV.
- `F7` adds a print stylesheet optimized for paper / PDF output.
- `F8` adds an SVG favicon.
- `F9` adds an `og:image` asset and corresponding social meta tags.
