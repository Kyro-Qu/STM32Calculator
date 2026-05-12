const STORAGE_KEY = "stm32-timer-calculator-state-v4";
const LEGACY_STORAGE_KEYS = [
  "stm32-timer-calculator-state-v3",
  "stm32-timer-calculator-state-v2",
];
const THEME_STORAGE_KEY = "stm32-timer-calculator-theme";

function manualClockProfile() {
  return { id: "manual", label: "手工输入", apbClockMhz: null };
}

function commonClockProfiles(clockMhz, label = "常用 TIMxCLK") {
  return [
    { id: "common", label, apbClockMhz: clockMhz, isDefault: true },
    manualClockProfile(),
  ];
}

function dualBusClockProfiles(apb1Mhz, apb2Mhz) {
  return [
    { id: "apb1", label: `APB1 定时器（常用） / ${apb1Mhz} MHz`, apbClockMhz: apb1Mhz, isDefault: true },
    { id: "apb2", label: `APB2 定时器 / ${apb2Mhz} MHz`, apbClockMhz: apb2Mhz },
    manualClockProfile(),
  ];
}

const PRESET_GROUPS = [
  {
    label: "F0 / F1 / F3",
    items: [
      {
        id: "stm32f030",
        name: "STM32F030",
        family: "STM32F0",
        note: "常见 48 MHz 起点，适合快速估算基础定时器参数。",
        bitsHint: "大多数定时器为 16 位",
        clockProfiles: commonClockProfiles(48),
      },
      {
        id: "stm32f072",
        name: "STM32F072",
        family: "STM32F0",
        note: "USB 常用系列，定时器起点通常按 48 MHz 工程值估算。",
        bitsHint: "大多数定时器为 16 位",
        clockProfiles: commonClockProfiles(48),
      },
      {
        id: "stm32f103",
        name: "STM32F103",
        family: "STM32F1",
        note: "Blue Pill 等常见 F1 方案，默认延续原工作簿参数。",
        bitsHint: "TIM2 常见 32 位，其余多为 16 位",
        clockProfiles: commonClockProfiles(72),
      },
      {
        id: "stm32f303",
        name: "STM32F303",
        family: "STM32F3",
        note: "电机控制常见系列，适合做 PWM 和死区时间初算。",
        bitsHint: "大多数定时器为 16 位",
        clockProfiles: commonClockProfiles(72),
      },
    ],
  },
  {
    label: "F4 / F7",
    items: [
      {
        id: "stm32f401",
        name: "STM32F401",
        family: "STM32F4",
        note: "F401 常见工程里 APB1 / APB2 定时器都可落在 84 MHz 左右。",
        bitsHint: "TIM2 / TIM5 常见 32 位",
        clockProfiles: commonClockProfiles(84, "常见 APB 定时器"),
      },
      {
        id: "stm32f411",
        name: "STM32F411",
        family: "STM32F4",
        note: "F411 常见工程里 APB1 / APB2 定时器都可落在 100 MHz 左右。",
        bitsHint: "TIM2 / TIM5 常见 32 位",
        clockProfiles: commonClockProfiles(100, "常见 APB 定时器"),
      },
      {
        id: "stm32f407",
        name: "STM32F407",
        family: "STM32F4",
        note: "已按常见 APB1 定时器默认值处理，避免 TIM2-TIM5 直接算错 2 倍。",
        bitsHint: "TIM2 / TIM5 常见 32 位",
        clockProfiles: dualBusClockProfiles(84, 168),
      },
      {
        id: "stm32f429",
        name: "STM32F429",
        family: "STM32F4",
        note: "带 LTDC 的 F4 系列，默认先按 APB1 定时器 90 MHz 起算。",
        bitsHint: "TIM2 / TIM5 常见 32 位",
        clockProfiles: dualBusClockProfiles(90, 180),
      },
      {
        id: "stm32f446",
        name: "STM32F446",
        family: "STM32F4",
        note: "默认先按 APB1 定时器 90 MHz 起算，需要高级定时器时可切到 APB2。",
        bitsHint: "TIM2 / TIM5 常见 32 位",
        clockProfiles: dualBusClockProfiles(90, 180),
      },
      {
        id: "stm32f767",
        name: "STM32F767",
        family: "STM32F7",
        note: "默认先按 APB1 定时器 108 MHz 起算，避免通用定时器误差翻倍。",
        bitsHint: "TIM2 / TIM5 常见 32 位",
        clockProfiles: dualBusClockProfiles(108, 216),
      },
    ],
  },
  {
    label: "G0 / G4",
    items: [
      {
        id: "stm32g030",
        name: "STM32G030",
        family: "STM32G0",
        note: "G0 入门系列，适合低成本控制。",
        bitsHint: "大多数定时器为 16 位",
        clockProfiles: commonClockProfiles(64),
      },
      {
        id: "stm32g071",
        name: "STM32G071",
        family: "STM32G0",
        note: "G0 系列常见工程起点。",
        bitsHint: "大多数定时器为 16 位",
        clockProfiles: commonClockProfiles(64),
      },
      {
        id: "stm32g431",
        name: "STM32G431",
        family: "STM32G4",
        note: "G4 电机控制常见系列，适合高分辨率 PWM。",
        bitsHint: "大多数定时器为 16 位",
        clockProfiles: commonClockProfiles(170),
      },
      {
        id: "stm32g474",
        name: "STM32G474",
        family: "STM32G4",
        note: "G4 高性能控制系列，常用于数字电源。",
        bitsHint: "大多数定时器为 16 位",
        clockProfiles: commonClockProfiles(170),
      },
    ],
  },
  {
    label: "H7",
    items: [
      {
        id: "stm32h723",
        name: "STM32H723",
        family: "STM32H7",
        note: "H723/H733 属于 550 MHz 级 H7；这里给出常见高性能工程起点，最终请按 RCC 实际 TIM 内核时钟修正。",
        bitsHint: "TIM2 / TIM5 常见 32 位",
        clockProfiles: commonClockProfiles(275, "H7 常见高性能 TIMxCLK"),
      },
      {
        id: "stm32h730",
        name: "STM32H730",
        family: "STM32H7",
        note: "550 MHz 级 H7 单核系列，默认给一个可编辑起点。",
        bitsHint: "TIM2 / TIM5 常见 32 位",
        clockProfiles: commonClockProfiles(275, "H7 常见高性能 TIMxCLK"),
      },
      {
        id: "stm32h733",
        name: "STM32H733",
        family: "STM32H7",
        note: "550 MHz 级 H7 单核系列，适合高性能控制与通信项目。",
        bitsHint: "TIM2 / TIM5 常见 32 位",
        clockProfiles: commonClockProfiles(275, "H7 常见高性能 TIMxCLK"),
      },
      {
        id: "stm32h735",
        name: "STM32H735",
        family: "STM32H7",
        note: "550 MHz 级 H7 单核系列，默认给可编辑的高性能定时器时钟起点。",
        bitsHint: "TIM2 / TIM5 常见 32 位",
        clockProfiles: commonClockProfiles(275, "H7 常见高性能 TIMxCLK"),
      },
      {
        id: "stm32h743",
        name: "STM32H743",
        family: "STM32H7",
        note: "480 MHz 级 H7 单核系列，常见 TIMxCLK 起点按 240 MHz 估算。",
        bitsHint: "TIM2 / TIM5 常见 32 位",
        clockProfiles: commonClockProfiles(240, "H7 常见 TIMxCLK"),
      },
      {
        id: "stm32h745",
        name: "STM32H745",
        family: "STM32H7",
        note: "双核 H7，M7 常见 480 MHz；页面预设仍只作为定时器时钟起点。",
        bitsHint: "TIM2 / TIM5 常见 32 位",
        clockProfiles: commonClockProfiles(240, "H7 常见 TIMxCLK"),
      },
      {
        id: "stm32h747",
        name: "STM32H747",
        family: "STM32H7",
        note: "双核 H7，适合图形与高带宽应用；TIM 时钟仍需按工程时钟树确认。",
        bitsHint: "TIM2 / TIM5 常见 32 位",
        clockProfiles: commonClockProfiles(240, "H7 常见 TIMxCLK"),
      },
      {
        id: "stm32h750",
        name: "STM32H750",
        family: "STM32H7",
        note: "修正原表中的 480 MHz 口径，默认改为更合理的 240 MHz TIMxCLK 起点。",
        bitsHint: "TIM2 / TIM5 常见 32 位",
        clockProfiles: commonClockProfiles(240, "H7 常见 TIMxCLK"),
      },
      {
        id: "stm32h753",
        name: "STM32H753",
        family: "STM32H7",
        note: "与 H743 同代，定时器时钟仍建议按工程时钟树确认。",
        bitsHint: "TIM2 / TIM5 常见 32 位",
        clockProfiles: commonClockProfiles(240, "H7 常见 TIMxCLK"),
      },
      {
        id: "stm32h755",
        name: "STM32H755",
        family: "STM32H7",
        note: "双核 H7，默认给 240 MHz 级 TIMxCLK 起点以便快速估算。",
        bitsHint: "TIM2 / TIM5 常见 32 位",
        clockProfiles: commonClockProfiles(240, "H7 常见 TIMxCLK"),
      },
      {
        id: "stm32h757",
        name: "STM32H757",
        family: "STM32H7",
        note: "双核 H7，适合复杂图形和高速接口项目；时钟值请按实际时钟树修正。",
        bitsHint: "TIM2 / TIM5 常见 32 位",
        clockProfiles: commonClockProfiles(240, "H7 常见 TIMxCLK"),
      },
    ],
  },
  {
    label: "L / U / 无线",
    items: [
      {
        id: "stm32l031",
        name: "STM32L031",
        family: "STM32L0",
        note: "低功耗小型项目常见系列。",
        bitsHint: "大多数定时器为 16 位",
        clockProfiles: commonClockProfiles(32),
      },
      {
        id: "stm32l072",
        name: "STM32L072",
        family: "STM32L0",
        note: "低功耗带更多外设的 L0 起点。",
        bitsHint: "大多数定时器为 16 位",
        clockProfiles: commonClockProfiles(32),
      },
      {
        id: "stm32l476",
        name: "STM32L476",
        family: "STM32L4",
        note: "L4 常用高性能低功耗系列。",
        bitsHint: "大多数定时器为 16 位",
        clockProfiles: commonClockProfiles(80),
      },
      {
        id: "stm32u575",
        name: "STM32U575",
        family: "STM32U5",
        note: "U5 系列常见起点，适合更高安全需求项目。",
        bitsHint: "大多数定时器为 16 位",
        clockProfiles: commonClockProfiles(160),
      },
      {
        id: "stm32wb55",
        name: "STM32WB55",
        family: "STM32WB",
        note: "BLE / Thread 双核无线常见系列。",
        bitsHint: "大多数定时器为 16 位",
        clockProfiles: commonClockProfiles(64),
      },
      {
        id: "stm32wl55",
        name: "STM32WL55",
        family: "STM32WL",
        note: "LoRa / Sub-GHz 无线项目常见起点。",
        bitsHint: "大多数定时器为 16 位",
        clockProfiles: commonClockProfiles(48),
      },
    ],
  },
  {
    label: "自定义",
    items: [
      {
        id: "custom",
        name: "自定义",
        family: "手工输入",
        note: "自行填写实际 TIMxCLK / APB 定时器时钟。",
        bitsHint: "按具体定时器选择位宽",
        clockProfiles: [manualClockProfile()],
      },
    ],
  },
];

const PRESETS = PRESET_GROUPS.flatMap((group) => group.items);
const PRESET_MAP = new Map(PRESETS.map((preset) => [preset.id, preset]));

const DEFAULT_STATE = {
  chipPreset: "stm32f103",
  clockProfile: "common",
  apbClockMhz: "72",
  timerBits: "16",
  prescaler: "720",
  counterPeriod: "1000",
  compareValue: "500",
  counterMode: "up",
  clockDivision: "4",
  dtgValue: "255",
  targetFrequencyHz: "",
  targetDutyPercent: "",
  targetDeadTimeUs: "",
  channel1Compare: "500",
  channel2Compare: "250",
  channel3Compare: "750",
  channel4Compare: "900",
  captureSignalHz: "",
  captureTargetCounts: "10000",
  dutyCycleMode: "hardware",
};

const elements = {
  chipPreset: document.getElementById("chipPreset"),
  clockProfile: document.getElementById("clockProfile"),
  apbClockMhz: document.getElementById("apbClockMhz"),
  timerBits: document.getElementById("timerBits"),
  prescaler: document.getElementById("prescaler"),
  counterPeriod: document.getElementById("counterPeriod"),
  compareValue: document.getElementById("compareValue"),
  counterMode: document.getElementById("counterMode"),
  dutyCycleMode: document.getElementById("dutyCycleMode"),
  clockDivision: document.getElementById("clockDivision"),
  dtgValue: document.getElementById("dtgValue"),
  targetFrequencyHz: document.getElementById("targetFrequencyHz"),
  targetDutyPercent: document.getElementById("targetDutyPercent"),
  targetDeadTimeUs: document.getElementById("targetDeadTimeUs"),
  applyTargetButton: document.getElementById("applyTargetButton"),
  applyDutyButton: document.getElementById("applyDutyButton"),
  applyDeadTimeButton: document.getElementById("applyDeadTimeButton"),
  resetButton: document.getElementById("resetButton"),
  themeToggleButton: document.getElementById("themeToggleButton"),
  copyShareLinkButton: document.getElementById("copyShareLinkButton"),
  exportJsonButton: document.getElementById("exportJsonButton"),
  exportCsvButton: document.getElementById("exportCsvButton"),
  copySnippetButton: document.getElementById("copySnippetButton"),
  messages: document.getElementById("messages"),
  currentPresetLabel: document.getElementById("currentPresetLabel"),
  presetClockHint: document.getElementById("presetClockHint"),
  presetNote: document.getElementById("presetNote"),
  heroClock: document.getElementById("heroClock"),
  heroFrequency: document.getElementById("heroFrequency"),
  heroDuty: document.getElementById("heroDuty"),
  heroDeadTime: document.getElementById("heroDeadTime"),
  overviewClock: document.getElementById("overviewClock"),
  overviewFrequency: document.getElementById("overviewFrequency"),
  overviewDuty: document.getElementById("overviewDuty"),
  overviewDeadTime: document.getElementById("overviewDeadTime"),
  overviewRegisters: document.getElementById("overviewRegisters"),
  overviewProfile: document.getElementById("overviewProfile"),
  flowClock: document.getElementById("flowClock"),
  flowTick: document.getElementById("flowTick"),
  flowPeriod: document.getElementById("flowPeriod"),
  flowPulse: document.getElementById("flowPulse"),
  targetFrequencyActual: document.getElementById("targetFrequencyActual"),
  targetFrequencyError: document.getElementById("targetFrequencyError"),
  targetFrequencyFit: document.getElementById("targetFrequencyFit"),
  targetFrequencyHint: document.getElementById("targetFrequencyHint"),
  targetDutyHint: document.getElementById("targetDutyHint"),
  reverseDtgValue: document.getElementById("reverseDtgValue"),
  reverseDeadTimeActual: document.getElementById("reverseDeadTimeActual"),
  reverseDeadTimeError: document.getElementById("reverseDeadTimeError"),
  reverseDeadTimeBranch: document.getElementById("reverseDeadTimeBranch"),
  targetDeadTimeHint: document.getElementById("targetDeadTimeHint"),
  shareLinkHint: document.getElementById("shareLinkHint"),
  presetFamily: document.getElementById("presetFamily"),
  presetBitsHint: document.getElementById("presetBitsHint"),
  pscRegister: document.getElementById("pscRegister"),
  arrRegister: document.getElementById("arrRegister"),
  registerMax: document.getElementById("registerMax"),
  timerClockMhz: document.getElementById("timerClockMhz"),
  timerClockHz: document.getElementById("timerClockHz"),
  tickTimeUs: document.getElementById("tickTimeUs"),
  periodUs: document.getElementById("periodUs"),
  periodMs: document.getElementById("periodMs"),
  frequencyHz: document.getElementById("frequencyHz"),
  frequencyKhz: document.getElementById("frequencyKhz"),
  pulseWidthUs: document.getElementById("pulseWidthUs"),
  pulseWidthMs: document.getElementById("pulseWidthMs"),
  dutyCycle: document.getElementById("dutyCycle"),
  dutyCycleDetail: document.getElementById("dutyCycleDetail"),
  tdtsUs: document.getElementById("tdtsUs"),
  tdtsNs: document.getElementById("tdtsNs"),
  dtgBinary: document.getElementById("dtgBinary"),
  dtgBinarySplit: document.getElementById("dtgBinarySplit"),
  dtgBranch: document.getElementById("dtgBranch"),
  dtgFormula: document.getElementById("dtgFormula"),
  dtgStepLabel: document.getElementById("dtgStepLabel"),
  tdtgUs: document.getElementById("tdtgUs"),
  deadTimeUs: document.getElementById("deadTimeUs"),
  deadTimeDuty: document.getElementById("deadTimeDuty"),
  deadTimeNs: document.getElementById("deadTimeNs"),
  dtgRawDec: document.getElementById("dtgRawDec"),
  dtgRawBin: document.getElementById("dtgRawBin"),
  dtgPrefixDec: document.getElementById("dtgPrefixDec"),
  dtgPrefixBin: document.getElementById("dtgPrefixBin"),
  dtgActiveLabel: document.getElementById("dtgActiveLabel"),
  dtgActiveDec: document.getElementById("dtgActiveDec"),
  dtgActiveBin: document.getElementById("dtgActiveBin"),
  channel1Compare: document.getElementById("channel1Compare"),
  channel2Compare: document.getElementById("channel2Compare"),
  channel3Compare: document.getElementById("channel3Compare"),
  channel4Compare: document.getElementById("channel4Compare"),
  channel1Duty: document.getElementById("channel1Duty"),
  channel1Detail: document.getElementById("channel1Detail"),
  channel2Duty: document.getElementById("channel2Duty"),
  channel2Detail: document.getElementById("channel2Detail"),
  channel3Duty: document.getElementById("channel3Duty"),
  channel3Detail: document.getElementById("channel3Detail"),
  channel4Duty: document.getElementById("channel4Duty"),
  channel4Detail: document.getElementById("channel4Detail"),
  captureSignalHz: document.getElementById("captureSignalHz"),
  captureTargetCounts: document.getElementById("captureTargetCounts"),
  capturePrescaler: document.getElementById("capturePrescaler"),
  capturePscRegister: document.getElementById("capturePscRegister"),
  captureCounterPeriod: document.getElementById("captureCounterPeriod"),
  captureArrRegister: document.getElementById("captureArrRegister"),
  captureActualCounts: document.getElementById("captureActualCounts"),
  captureResolution: document.getElementById("captureResolution"),
  captureTickFrequency: document.getElementById("captureTickFrequency"),
  captureOverflowHint: document.getElementById("captureOverflowHint"),
  captureHint: document.getElementById("captureHint"),
  generatedSnippet: document.getElementById("generatedSnippet"),
  snippetMeta: document.getElementById("snippetMeta"),
  waveMode: document.getElementById("waveMode"),
  wavePeriod: document.getElementById("wavePeriod"),
  wavePulse: document.getElementById("wavePulse"),
  waveDeadTime: document.getElementById("waveDeadTime"),
  waveformPreview: document.getElementById("waveformPreview"),
  waveHint: document.getElementById("waveHint"),
};

let statusMessage = null;
let lastTargetFrequencyFit = null;
let lastDeadTimeReverseFit = null;
let themePreference = null;

function init() {
  initTheme();
  populatePresetSelect();
  const restoredState = restoreState();
  populateClockProfiles(getSelectedPreset(), restoredState.clockProfile);
  updatePresetSummary();
  bindEvents();
  calculate();
}

function initTheme() {
  try {
    themePreference = localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    themePreference = null;
  }
  applyTheme(themePreference);
}

function getResolvedTheme(preference = themePreference) {
  if (preference === "light" || preference === "dark") {
    return preference;
  }
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(preference = themePreference) {
  const resolvedTheme = getResolvedTheme(preference);
  document.body.dataset.theme = resolvedTheme;
  const nextLabel = resolvedTheme === "dark" ? "切换浅色主题" : "切换深色主题";
  elements.themeToggleButton.textContent = nextLabel;
}

function toggleTheme() {
  const currentTheme = getResolvedTheme();
  themePreference = currentTheme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themePreference);
  } catch (error) {
    // Ignore storage failures.
  }
  applyTheme(themePreference);
}

function populatePresetSelect() {
  PRESET_GROUPS.forEach((group) => {
    const optgroup = document.createElement("optgroup");
    optgroup.label = group.label;
    group.items.forEach((preset) => {
      const option = document.createElement("option");
      option.value = preset.id;
      option.textContent = preset.name;
      if (preset.id === DEFAULT_STATE.chipPreset) {
        option.selected = true;
      }
      optgroup.append(option);
    });
    elements.chipPreset.append(optgroup);
  });
}

function getSelectedPreset() {
  return PRESET_MAP.get(elements.chipPreset.value) ?? PRESET_MAP.get("custom");
}

function getCurrentClockProfiles(preset = getSelectedPreset()) {
  return preset.clockProfiles ?? [manualClockProfile()];
}

function getDefaultClockProfileId(profiles) {
  return profiles.find((profile) => profile.isDefault)?.id ?? profiles[0]?.id ?? "manual";
}

function populateClockProfiles(preset, preferredId = "") {
  const profiles = getCurrentClockProfiles(preset);
  elements.clockProfile.innerHTML = "";

  profiles.forEach((profile) => {
    const option = document.createElement("option");
    option.value = profile.id;
    option.textContent = profile.label;
    elements.clockProfile.append(option);
  });

  const selectedId = profiles.some((profile) => profile.id === preferredId)
    ? preferredId
    : getDefaultClockProfileId(profiles);
  elements.clockProfile.value = selectedId;
}

function getSelectedClockProfile() {
  const profiles = getCurrentClockProfiles();
  return profiles.find((profile) => profile.id === elements.clockProfile.value) ?? profiles[0];
}

function applyClockProfileSelection() {
  const profile = getSelectedClockProfile();
  if (profile && profile.apbClockMhz != null) {
    elements.apbClockMhz.value = String(profile.apbClockMhz);
  }
}

function bindEvents() {
  elements.chipPreset.addEventListener("change", handlePresetChange);
  elements.clockProfile.addEventListener("change", handleClockProfileChange);
  elements.apbClockMhz.addEventListener("input", syncClockProfileWithInput);
  elements.apbClockMhz.addEventListener("change", syncClockProfileWithInput);
  elements.applyTargetButton.addEventListener("click", applyTargetFrequency);
  elements.applyDutyButton.addEventListener("click", applyTargetDuty);
  elements.applyDeadTimeButton.addEventListener("click", applyTargetDeadTime);
  elements.resetButton.addEventListener("click", resetToDefaults);
  elements.themeToggleButton.addEventListener("click", toggleTheme);
  elements.copyShareLinkButton.addEventListener("click", copyShareLink);
  elements.exportJsonButton.addEventListener("click", exportConfigJson);
  elements.exportCsvButton.addEventListener("click", exportConfigCsv);
  elements.copySnippetButton.addEventListener("click", copySnippet);
  elements.targetFrequencyHz.addEventListener("keydown", handleTargetFrequencyKeydown);
  elements.targetDutyPercent.addEventListener("keydown", handleTargetDutyKeydown);
  elements.targetDeadTimeUs.addEventListener("keydown", handleTargetDeadTimeKeydown);
  elements.targetFrequencyHz.addEventListener("input", handleTargetFrequencyDraftChange);
  elements.targetFrequencyHz.addEventListener("change", handleTargetFrequencyDraftChange);
  elements.targetDutyPercent.addEventListener("input", handleTargetDutyDraftChange);
  elements.targetDutyPercent.addEventListener("change", handleTargetDutyDraftChange);
  elements.targetDeadTimeUs.addEventListener("input", handleTargetDeadTimeDraftChange);
  elements.targetDeadTimeUs.addEventListener("change", handleTargetDeadTimeDraftChange);

  [
    "timerBits",
    "prescaler",
    "counterPeriod",
    "compareValue",
    "counterMode",
    "dutyCycleMode",
    "clockDivision",
    "dtgValue",
    "channel1Compare",
    "channel2Compare",
    "channel3Compare",
    "channel4Compare",
    "captureSignalHz",
    "captureTargetCounts",
  ].forEach((key) => {
    elements[key].addEventListener("input", clearStatusAndCalculate);
    elements[key].addEventListener("change", clearStatusAndCalculate);
  });
}

function clearStatusAndCalculate() {
  clearTransientFeedback();
  calculate();
}

function clearTransientFeedback() {
  statusMessage = null;
  lastTargetFrequencyFit = null;
  lastDeadTimeReverseFit = null;
}

function handleTargetFrequencyKeydown(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    applyTargetFrequency();
  }
}

function handleTargetDutyKeydown(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    applyTargetDuty();
  }
}

function handleTargetDeadTimeKeydown(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    applyTargetDeadTime();
  }
}

function handleTargetFrequencyDraftChange() {
  statusMessage = null;
  lastTargetFrequencyFit = null;
  calculate();
}

function handleTargetDutyDraftChange() {
  statusMessage = null;
  calculate();
}

function handleTargetDeadTimeDraftChange() {
  statusMessage = null;
  lastDeadTimeReverseFit = null;
  calculate();
}

function handlePresetChange() {
  const preset = getSelectedPreset();
  populateClockProfiles(preset);
  applyClockProfileSelection();
  updatePresetSummary();
  clearTransientFeedback();
  calculate();
}

function handleClockProfileChange() {
  applyClockProfileSelection();
  updatePresetSummary();
  clearTransientFeedback();
  calculate();
}

function syncClockProfileWithInput() {
  const currentClock = Number(elements.apbClockMhz.value);
  const profiles = getCurrentClockProfiles();
  const matchedProfile = profiles.find((profile) =>
    profile.apbClockMhz != null && Math.abs(profile.apbClockMhz - currentClock) < 1e-9
  );
  elements.clockProfile.value = matchedProfile ? matchedProfile.id : "manual";
  updatePresetSummary();
  clearTransientFeedback();
  calculate();
}

function updatePresetSummary() {
  const preset = getSelectedPreset();
  const profile = getSelectedClockProfile();
  elements.currentPresetLabel.textContent = preset.name;
  elements.presetFamily.textContent = preset.family;
  elements.presetBitsHint.textContent = preset.bitsHint;
  elements.presetClockHint.textContent = profile.apbClockMhz == null
    ? `当前时钟来源：${profile.label}`
    : `当前时钟来源：${profile.label}`;
  elements.presetNote.textContent = preset.note;
  elements.overviewProfile.textContent = profile.label;
}

function isCenterAlignedMode(counterMode = elements.counterMode.value) {
  return counterMode.startsWith("center");
}

function getCounterModeLabel(counterMode = elements.counterMode.value) {
  return {
    up: "边沿对齐 / 向上计数",
    center1: "中心对齐 1",
    center2: "中心对齐 2",
    center3: "中心对齐 3",
  }[counterMode] ?? "边沿对齐 / 向上计数";
}

function getCounterModeConstant(counterMode = elements.counterMode.value) {
  return {
    up: "TIM_COUNTERMODE_UP",
    center1: "TIM_COUNTERMODE_CENTERALIGNED1",
    center2: "TIM_COUNTERMODE_CENTERALIGNED2",
    center3: "TIM_COUNTERMODE_CENTERALIGNED3",
  }[counterMode] ?? "TIM_COUNTERMODE_UP";
}

function getCounterModePeriodFactor(counterMode = elements.counterMode.value) {
  return isCenterAlignedMode(counterMode) ? 2 : 1;
}

function getTdtsUs(apbClockMhz, clockDivision) {
  return 1 / (apbClockMhz / clockDivision);
}

function getDtgTiming(dtgValue, tdtsUs) {
  const dtg = getDtgDecode(dtgValue);
  const tdtgUs = dtg.branch === "0xxxxxxx"
    ? tdtsUs
    : dtg.branch === "10xxxxxx"
      ? 2 * tdtsUs
      : dtg.branch === "110xxxxx"
        ? 8 * tdtsUs
        : 16 * tdtsUs;

  const deadTimeUs = dtg.branch === "0xxxxxxx"
    ? dtgValue * tdtgUs
    : dtg.branch === "10xxxxxx"
      ? (64 + dtg.activeDec) * tdtgUs
      : (32 + dtg.activeDec) * tdtgUs;

  return {
    dtg,
    tdtgUs,
    deadTimeUs,
    deadTimeNs: deadTimeUs * 1000,
  };
}

function updateDashboardMetrics(values) {
  elements.heroClock.textContent = `${formatNumber(values.timerClockMhz)} MHz`;
  elements.heroFrequency.textContent = `${formatNumber(values.frequencyHz, 6)} Hz`;
  elements.heroDuty.textContent = `${formatNumber(values.dutyCycle, 6)} %`;
  elements.heroDeadTime.textContent = `${formatNumber(values.deadTimeUs, 6)} μs`;
  elements.overviewClock.textContent = `${formatNumber(values.timerClockMhz)} MHz`;
  elements.overviewFrequency.textContent = `${formatNumber(values.frequencyHz, 6)} Hz`;
  elements.overviewDuty.textContent = `${formatNumber(values.dutyCycle, 6)} %`;
  elements.overviewDeadTime.textContent = `${formatNumber(values.deadTimeUs, 6)} μs`;
  elements.overviewRegisters.textContent = `PSC ${values.pscRegister} / ARR ${values.arrRegister}`;
  elements.overviewProfile.textContent = `${values.clockProfileLabel} · ${values.counterModeLabel}`;
  elements.flowClock.textContent = `${formatNumber(values.apbClockMhz, 4)} MHz`;
  elements.flowTick.textContent = `${formatNumber(values.tickTimeUs, 8)} μs`;
  elements.flowPeriod.textContent = `${formatNumber(values.periodUs, 8)} μs`;
  elements.flowPulse.textContent = `${formatNumber(values.pulseWidthUs, 8)} μs`;
}

function readNumber(element) {
  return Number(element.value);
}

function readInt(element) {
  return Number.parseInt(element.value, 10);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function padBinary(value, length) {
  return clamp(Math.trunc(value), 0, Number.MAX_SAFE_INTEGER).toString(2).padStart(length, "0");
}

function formatNumber(value, maxFractionDigits = 6) {
  if (!Number.isFinite(value)) {
    return "-";
  }
  const abs = Math.abs(value);
  let digits = maxFractionDigits;
  if (abs === 0) {
    digits = 0;
  } else if (abs >= 1000) {
    digits = Math.min(3, maxFractionDigits);
  } else if (abs >= 1) {
    digits = Math.min(6, maxFractionDigits);
  } else if (abs >= 0.01) {
    digits = Math.min(8, Math.max(6, maxFractionDigits));
  } else {
    digits = Math.min(10, Math.max(8, maxFractionDigits));
  }
  return value.toLocaleString("zh-CN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
    useGrouping: false,
  });
}

function getStateSnapshot() {
  const snapshot = {};
  Object.keys(DEFAULT_STATE).forEach((key) => {
    snapshot[key] = elements[key].value;
  });
  return snapshot;
}

function loadStateFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const snapshot = {};
    Object.keys(DEFAULT_STATE).forEach((key) => {
      if (params.has(key)) {
        snapshot[key] = params.get(key);
      }
    });
    return Object.keys(snapshot).length > 0 ? snapshot : null;
  } catch (error) {
    return null;
  }
}

function updateUrlState(snapshot = getStateSnapshot()) {
  try {
    const url = new URL(window.location.href);
    url.search = "";
    Object.entries(snapshot).forEach(([key, value]) => {
      if (value !== "" && String(value) !== String(DEFAULT_STATE[key])) {
        url.searchParams.set(key, value);
      }
    });
    history.replaceState(null, "", url.toString());
  } catch (error) {
    // Ignore URL update failures.
  }
}

function downloadTextFile(filename, content, mimeType = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mimeType });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

function getExportPayload() {
  return {
    generatedAt: new Date().toISOString(),
    preset: getSelectedPreset().name,
    clockProfile: getSelectedClockProfile().label,
    theme: getResolvedTheme(),
    inputs: getStateSnapshot(),
    outputs: {
      timerClockMhz: elements.timerClockMhz.textContent,
      frequencyHz: elements.frequencyHz.textContent,
      periodUs: elements.periodUs.textContent,
      dutyCycle: elements.dutyCycle.textContent,
      deadTimeUs: elements.deadTimeUs.textContent,
      snippetMeta: elements.snippetMeta.textContent,
    },
  };
}

async function copyShareLink() {
  updateUrlState();
  try {
    await navigator.clipboard.writeText(window.location.href);
    statusMessage = { type: "ok", text: "分享链接已复制到剪贴板。" };
  } catch (error) {
    statusMessage = { type: "warn", text: "浏览器未允许复制分享链接，请手动复制地址栏。" };
  }
  calculate();
}

function exportConfigJson() {
  downloadTextFile("stm32-timer-config.json", JSON.stringify(getExportPayload(), null, 2), "application/json;charset=utf-8");
  statusMessage = { type: "ok", text: "已导出 JSON 配置文件。" };
  calculate();
}

function exportConfigCsv() {
  const payload = getExportPayload();
  const rows = [
    ["section", "key", "value"],
    ...Object.entries(payload.inputs).map(([key, value]) => ["input", key, value]),
    ...Object.entries(payload.outputs).map(([key, value]) => ["output", key, value]),
    ["meta", "preset", payload.preset],
    ["meta", "clockProfile", payload.clockProfile],
    ["meta", "theme", payload.theme],
    ["meta", "generatedAt", payload.generatedAt],
  ];
  const csv = rows
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  downloadTextFile("stm32-timer-config.csv", csv, "text/csv;charset=utf-8");
  statusMessage = { type: "ok", text: "已导出 CSV 配置文件。" };
  calculate();
}

function renderTargetFrequencyFeedback() {
  if (!lastTargetFrequencyFit) {
    elements.targetFrequencyActual.textContent = "-";
    elements.targetFrequencyError.textContent = "-";
    elements.targetFrequencyFit.textContent = "-";
    elements.targetFrequencyHint.textContent = "在目标频率输入框按 Enter 也可以直接回填。";
    return;
  }

  elements.targetFrequencyActual.textContent = `${formatNumber(lastTargetFrequencyFit.actualFrequency, 8)} Hz`;
  elements.targetFrequencyError.textContent = `${formatNumber(lastTargetFrequencyFit.relativeError * 100, 8)} %`;
  elements.targetFrequencyFit.textContent = `PSC ${lastTargetFrequencyFit.prescaler} / ARR ${lastTargetFrequencyFit.counterPeriod}`;
  elements.targetFrequencyHint.textContent = `目标 ${formatNumber(lastTargetFrequencyFit.targetFrequencyHz, 8)} Hz，当前模式 ${lastTargetFrequencyFit.counterModeLabel}。`;
}

function renderDeadTimeReverseFeedback() {
  if (!lastDeadTimeReverseFit) {
    elements.reverseDtgValue.textContent = "-";
    elements.reverseDeadTimeActual.textContent = "-";
    elements.reverseDeadTimeError.textContent = "-";
    elements.reverseDeadTimeBranch.textContent = "-";
    elements.targetDeadTimeHint.textContent = "这个反推沿用当前页面的 DTG / Tdts 计算逻辑。";
    return;
  }

  elements.reverseDtgValue.textContent = `${lastDeadTimeReverseFit.dtgValue} / 0b${padBinary(lastDeadTimeReverseFit.dtgValue, 8)}`;
  elements.reverseDeadTimeActual.textContent = `${formatNumber(lastDeadTimeReverseFit.actualDeadTimeUs, 8)} μs`;
  elements.reverseDeadTimeError.textContent = `${formatNumber(lastDeadTimeReverseFit.relativeError * 100, 8)} %`;
  elements.reverseDeadTimeBranch.textContent = `${lastDeadTimeReverseFit.branch} · ${lastDeadTimeReverseFit.formula}`;
  elements.targetDeadTimeHint.textContent = `目标 ${formatNumber(lastDeadTimeReverseFit.targetDeadTimeUs, 8)} μs，在当前 CKD / TIMxCLK 下找到最接近 DTG。`;
}

function renderWaveformPreview(values) {
  if (!values) {
    elements.waveMode.textContent = "-";
    elements.wavePeriod.textContent = "-";
    elements.wavePulse.textContent = "-";
    elements.waveDeadTime.textContent = "-";
    elements.waveHint.textContent = "预览按当前硬件 PWM 时序归一化显示；死区窗口用于提示切换留白，不代表驱动器传播延迟。";
    elements.waveformPreview.innerHTML = "";
    return;
  }

  const svgWidth = 960;
  const svgHeight = 260;
  const chartLeft = 88;
  const chartRight = 900;
  const chartWidth = chartRight - chartLeft;
  const yHigh = 72;
  const yLow = 128;
  const yBaseline = 196;
  const dutyRatio = clamp(values.hardwareDuty / 100, 0, 1);
  const highStartRatio = values.isCenterAligned
    ? (1 - dutyRatio) / 2
    : 0;
  const highEndRatio = values.isCenterAligned
    ? (1 + dutyRatio) / 2
    : dutyRatio;
  const deadTimeRatio = values.periodUs > 0 ? clamp(values.deadTimeUs / values.periodUs, 0, 0.45) : 0;
  const deadTimeWidth = deadTimeRatio * chartWidth;
  const transitionRatios = [];

  if (dutyRatio > 0 && highStartRatio > 0) {
    transitionRatios.push(highStartRatio);
  }
  if (dutyRatio > 0 && dutyRatio < 1) {
    transitionRatios.push(highEndRatio);
  }

  const highStartX = chartLeft + chartWidth * highStartRatio;
  const highEndX = chartLeft + chartWidth * highEndRatio;
  const lowStartPath = highStartRatio === 0
    ? `M ${chartLeft} ${yHigh}`
    : `M ${chartLeft} ${yLow} L ${highStartX} ${yLow} L ${highStartX} ${yHigh}`;
  const highPath = dutyRatio === 0
    ? `M ${chartLeft} ${yLow} L ${chartRight} ${yLow}`
    : dutyRatio === 1
      ? `M ${chartLeft} ${yHigh} L ${chartRight} ${yHigh}`
      : `${lowStartPath} L ${highEndX} ${yHigh} L ${highEndX} ${yLow} L ${chartRight} ${yLow}`;

  const gridLines = Array.from({ length: 11 }, (_, index) => {
    const x = chartLeft + chartWidth * index / 10;
    return `<line x1="${x}" y1="34" x2="${x}" y2="214" stroke="rgba(148,163,184,0.12)" stroke-dasharray="4 6" />`;
  }).join("");

  const deadBands = transitionRatios.map((ratio, index) => {
    const x = chartLeft + chartWidth * ratio;
    return `
      <rect x="${x}" y="42" width="${Math.max(deadTimeWidth, 2)}" height="146" rx="8" fill="rgba(248, 113, 113, 0.16)" stroke="rgba(248, 113, 113, 0.4)" />
      <text x="${x + Math.max(deadTimeWidth, 2) / 2}" y="204" fill="#fecaca" font-size="13" text-anchor="middle">DT${index + 1}</text>
    `;
  }).join("");

  const centerMarker = values.isCenterAligned
    ? `<line x1="${chartLeft + chartWidth / 2}" y1="34" x2="${chartLeft + chartWidth / 2}" y2="214" stroke="rgba(96,165,250,0.36)" stroke-dasharray="8 8" />`
    : "";

  elements.waveMode.textContent = values.counterModeLabel;
  elements.wavePeriod.textContent = `${formatNumber(values.periodUs, 8)} μs`;
  elements.wavePulse.textContent = `${formatNumber(values.pulseWidthUs, 8)} μs`;
  elements.waveDeadTime.textContent = `${formatNumber(values.deadTimeUs, 8)} μs`;
  elements.waveHint.textContent = values.isCenterAligned
    ? "中心对齐模式下，一个完整周期包含上升与下降两个计数阶段，所以周期相对边沿对齐会翻倍。"
    : "边沿对齐模式下，波形从周期起点开始计数；死区窗口按当前 DTG 归一化绘制。";

  elements.waveformPreview.innerHTML = `
    <rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" rx="18" fill="rgba(5,12,24,0.28)"></rect>
    ${gridLines}
    ${centerMarker}
    <text x="24" y="76" fill="#c7d6ec" font-size="15">PWM</text>
    <text x="24" y="198" fill="#c7d6ec" font-size="15">Dead Time</text>
    <line x1="${chartLeft}" y1="${yBaseline}" x2="${chartRight}" y2="${yBaseline}" stroke="rgba(148,163,184,0.24)" stroke-width="2" />
    <path d="${highPath}" fill="none" stroke="url(#waveGradient)" stroke-width="8" stroke-linejoin="round" stroke-linecap="round" />
    ${deadBands}
    <text x="${chartLeft}" y="232" fill="#9fb0cc" font-size="13">0%</text>
    <text x="${chartLeft + chartWidth / 2}" y="232" fill="#9fb0cc" font-size="13" text-anchor="middle">${values.isCenterAligned ? "周期中心" : "50%"}</text>
    <text x="${chartRight}" y="232" fill="#9fb0cc" font-size="13" text-anchor="end">100%</text>
    <defs>
      <linearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#22d3ee"></stop>
        <stop offset="100%" stop-color="#60a5fa"></stop>
      </linearGradient>
    </defs>
  `;
}

function renderChannelOutputs(counterPeriod, tickTimeUs, periodFactor, registerMax) {
  const channelDescriptors = [
    { compare: "channel1Compare", duty: "channel1Duty", detail: "channel1Detail", name: "CH1" },
    { compare: "channel2Compare", duty: "channel2Duty", detail: "channel2Detail", name: "CH2" },
    { compare: "channel3Compare", duty: "channel3Duty", detail: "channel3Detail", name: "CH3" },
    { compare: "channel4Compare", duty: "channel4Duty", detail: "channel4Detail", name: "CH4" },
  ];

  channelDescriptors.forEach((descriptor) => {
    const compareValue = readInt(elements[descriptor.compare]);
    if (!Number.isInteger(compareValue) || compareValue < 0) {
      elements[descriptor.duty].textContent = "输入无效";
      elements[descriptor.detail].textContent = "CCR 需为非负整数";
      return;
    }

    const dutyConfig = getDutyModeConfig(counterPeriod, compareValue);
    const pulseWidthUs = compareValue * tickTimeUs * periodFactor;
    elements[descriptor.duty].textContent = `${formatNumber(dutyConfig.displayedDuty, 8)} %`;
    elements[descriptor.detail].textContent = compareValue > registerMax
      ? `CCR = ${compareValue}，超出当前位宽`
      : `CCR = ${compareValue} · 高电平 ${formatNumber(pulseWidthUs, 8)} μs`;
  });
}

function renderCapturePlanner(apbClockMhz, timerBits) {
  const signalHz = readNumber(elements.captureSignalHz);
  const targetCounts = readInt(elements.captureTargetCounts);
  const registerMax = (2 ** timerBits) - 1;
  const inputMax = registerMax + 1;

  if (!(signalHz > 0) || !Number.isInteger(targetCounts) || targetCounts < 1 || !(apbClockMhz > 0)) {
    [
      "capturePrescaler",
      "capturePscRegister",
      "captureCounterPeriod",
      "captureArrRegister",
      "captureActualCounts",
      "captureResolution",
      "captureTickFrequency",
      "captureOverflowHint",
    ].forEach((key) => {
      elements[key].textContent = "-";
    });
    elements.captureHint.textContent = "输入待测频率和期望每周期计数后，页面会给出更适合输入捕获的 PSC / ARR 组合。";
    return;
  }

  const timerClockHz = apbClockMhz * 1_000_000;
  const idealPrescaler = clamp(Math.round(timerClockHz / (signalHz * targetCounts)), 1, inputMax);
  const captureTickHz = timerClockHz / idealPrescaler;
  const actualCounts = captureTickHz / signalHz;
  const recommendedCounterPeriod = clamp(Math.ceil(actualCounts * 1.25), 1, inputMax);
  const resolutionUs = 1_000_000 / captureTickHz;
  const overflowTimeMs = recommendedCounterPeriod / captureTickHz * 1000;

  elements.capturePrescaler.textContent = String(idealPrescaler);
  elements.capturePscRegister.textContent = `PSC 寄存器 = ${idealPrescaler - 1}`;
  elements.captureCounterPeriod.textContent = String(recommendedCounterPeriod);
  elements.captureArrRegister.textContent = `ARR 寄存器 = ${recommendedCounterPeriod - 1}`;
  elements.captureActualCounts.textContent = formatNumber(actualCounts, 8);
  elements.captureResolution.textContent = `计数分辨率 ${formatNumber(resolutionUs, 8)} μs`;
  elements.captureTickFrequency.textContent = `${formatNumber(captureTickHz, 8)} Hz`;
  elements.captureOverflowHint.textContent = `约 ${formatNumber(overflowTimeMs, 8)} ms 溢出一次`;
  elements.captureHint.textContent = `目标每周期 ${targetCounts} 个计数；当前建议给了约 25% 裕量。`;
}

function buildMessages(baseMessages) {
  const messages = [...baseMessages];
  if (statusMessage) {
    messages.push(statusMessage);
  }
  return messages;
}

function renderMessages(messages) {
  elements.messages.innerHTML = "";
  messages.forEach(({ type, text }) => {
    const node = document.createElement("div");
    node.className = `message ${type}`;
    node.textContent = text;
    elements.messages.append(node);
  });
}

function getDutyModeConfig(counterPeriod, compareValue, mode = elements.dutyCycleMode.value) {
  const hardwareDuty = counterPeriod > 0 ? compareValue / counterPeriod * 100 : Number.NaN;
  const legacyDuty = counterPeriod === 1 ? Number.NaN : compareValue / (counterPeriod - 1) * 100;

  return {
    mode,
    hardwareDuty,
    legacyDuty,
    displayedDuty: mode === "hardware" ? hardwareDuty : legacyDuty,
    compareLimit: mode === "hardware" ? counterPeriod : Math.max(counterPeriod - 1, 0),
  };
}

function getCompareValueFromDuty(dutyPercent, counterPeriod, mode = elements.dutyCycleMode.value) {
  const clampedDuty = clamp(dutyPercent, 0, 100);
  const scale = mode === "hardware"
    ? counterPeriod
    : Math.max(counterPeriod - 1, 0);
  return clamp(Math.round(scale * clampedDuty / 100), 0, scale);
}

function getDtgDecode(dtgValue) {
  if (dtgValue < 128) {
    return {
      branch: "0xxxxxxx",
      prefixDec: 0,
      prefixBin: "0",
      activeLabel: "DTG[6:0]",
      activeDec: dtgValue,
      activeBin: padBinary(dtgValue, 7),
      formula: "DT = DTG[6:0] × Tdts",
    };
  }
  if (dtgValue < 192) {
    const activeDec = dtgValue % 64;
    return {
      branch: "10xxxxxx",
      prefixDec: 2,
      prefixBin: "10",
      activeLabel: "DTG[5:0]",
      activeDec,
      activeBin: padBinary(activeDec, 6),
      formula: "DT = (64 + DTG[5:0]) × 2 × Tdtg",
    };
  }
  if (dtgValue < 224) {
    const activeDec = dtgValue % 32;
    return {
      branch: "110xxxxx",
      prefixDec: 6,
      prefixBin: "110",
      activeLabel: "DTG[4:0]",
      activeDec,
      activeBin: padBinary(activeDec, 5),
      formula: "DT = (32 + DTG[4:0]) × 8 × Tdtg",
    };
  }

  const activeDec = dtgValue % 32;
  return {
    branch: "111xxxxx",
    prefixDec: 7,
    prefixBin: "111",
    activeLabel: "DTG[4:0]",
    activeDec,
    activeBin: padBinary(activeDec, 5),
    formula: "DT = (32 + DTG[4:0]) × 16 × Tdtg",
  };
}

function calculate() {
  const apbClockMhz = readNumber(elements.apbClockMhz);
  const timerBits = readInt(elements.timerBits);
  const prescaler = readInt(elements.prescaler);
  const counterPeriod = readInt(elements.counterPeriod);
  const compareValue = readInt(elements.compareValue);
  const counterMode = elements.counterMode.value;
  const clockDivision = readInt(elements.clockDivision);
  const dtgValue = readInt(elements.dtgValue);

  const registerMax = (2 ** timerBits) - 1;
  const inputValueMax = registerMax + 1;
  const baseMessages = [];
  const dutyConfig = getDutyModeConfig(counterPeriod, compareValue);

  if (!(apbClockMhz > 0)) {
    baseMessages.push({ type: "error", text: "TIMxCLK / APB 定时器时钟必须大于 0 MHz。" });
  }
  if (!Number.isInteger(prescaler) || prescaler < 1) {
    baseMessages.push({ type: "error", text: "Prescaler 必须是大于等于 1 的整数。" });
  }
  if (!Number.isInteger(counterPeriod) || counterPeriod < 1) {
    baseMessages.push({ type: "error", text: "Counter Period 必须是大于等于 1 的整数。" });
  }
  if (!Number.isInteger(compareValue) || compareValue < 0) {
    baseMessages.push({ type: "error", text: "CCR 必须是大于等于 0 的整数。" });
  }
  if (!Number.isInteger(dtgValue) || dtgValue < 0 || dtgValue > 255) {
    baseMessages.push({ type: "error", text: "DTG[7:0] 必须在 0 到 255 之间。" });
  }
  if (prescaler > inputValueMax) {
    baseMessages.push({ type: "warn", text: `Prescaler 超出 ${timerBits} 位可表示范围，建议输入不大于 ${inputValueMax}。` });
  }
  if (counterPeriod > inputValueMax) {
    baseMessages.push({ type: "warn", text: `Counter Period 超出 ${timerBits} 位可表示范围，建议输入不大于 ${inputValueMax}。` });
  }
  if (compareValue > registerMax) {
    baseMessages.push({ type: "warn", text: `CCR 超出 ${timerBits} 位寄存器最大值 ${registerMax}。` });
  }
  if (compareValue > dutyConfig.compareLimit) {
    baseMessages.push({
      type: "warn",
      text: dutyConfig.mode === "hardware"
        ? "当前为硬件口径：CCR 大于 ARR + 1，输出将超过标准 PWM 100% 范围。"
        : "当前为 Excel 口径：CCR 大于 ARR 寄存器值，PWM 输出通常不建议这样配置。",
    });
  }
  if (counterPeriod === 1 && dutyConfig.mode === "legacy") {
    baseMessages.push({ type: "warn", text: "Counter Period 为 1 时，Excel 口径分母为 0，页面将不显示该口径占空比。" });
  }
  if (counterPeriod === 1) {
    baseMessages.push({ type: "info", text: "Counter Period = 1 表示 ARR = 0。硬件允许，但定时器会在每个计数时钟周期更新，这通常只用于极端高频场景。" });
  }

  const allMessages = buildMessages(baseMessages);
  renderMessages(allMessages);
  renderTargetFrequencyFeedback();
  renderDeadTimeReverseFeedback();
  renderCapturePlanner(apbClockMhz, timerBits);
  elements.registerMax.textContent = formatNumber(registerMax, 0);

  if (baseMessages.some((item) => item.type === "error")) {
    fillFallback();
    updateSnippet({
      pscRegister: null,
      arrRegister: null,
      compareValue: null,
      clockDivision: null,
      apbClockMhz: null,
      dutyCycle: null,
      timerBits,
      clockProfileLabel: "",
      dutyModeLabel: "",
      counterMode,
    });
    saveState();
    return;
  }

  const pscRegister = prescaler - 1;
  const arrRegister = counterPeriod - 1;
  const timerClockMhz = apbClockMhz / prescaler;
  const timerClockHz = timerClockMhz * 1_000_000;
  const tickTimeUs = 1 / timerClockMhz;
  const periodFactor = getCounterModePeriodFactor(counterMode);
  const periodUs = tickTimeUs * counterPeriod * periodFactor;
  const periodMs = periodUs / 1000;
  const periodS = periodMs / 1000;
  const frequencyMhz = 1 / periodUs;
  const frequencyKhz = 1 / periodMs;
  const frequencyHz = 1 / periodS;
  const pulseWidthUs = compareValue * tickTimeUs * periodFactor;
  const pulseWidthMs = pulseWidthUs / 1000;
  const tdtsUs = getTdtsUs(apbClockMhz, clockDivision);
  const tdtsNs = tdtsUs * 1000;
  const dtgTiming = getDtgTiming(dtgValue, tdtsUs);
  const { dtg, tdtgUs, deadTimeUs, deadTimeNs } = dtgTiming;
  const deadTimeDuty = deadTimeUs / periodUs * 100;
  const clockProfileLabel = getSelectedClockProfile().label;
  const counterModeLabel = getCounterModeLabel(counterMode);
  const targetDutyPercent = readNumber(elements.targetDutyPercent);
  const hasTargetDutyPercent = elements.targetDutyPercent.value.trim() !== "";

  elements.pscRegister.textContent = formatNumber(pscRegister, 0);
  elements.arrRegister.textContent = formatNumber(arrRegister, 0);
  elements.timerClockMhz.textContent = `${formatNumber(timerClockMhz)} MHz`;
  elements.timerClockHz.textContent = `${formatNumber(timerClockHz, 3)} Hz`;
  elements.tickTimeUs.textContent = formatNumber(tickTimeUs, 8);
  elements.periodUs.textContent = `${formatNumber(periodUs, 8)} μs`;
  elements.periodMs.textContent = `${formatNumber(periodMs, 8)} ms / ${formatNumber(periodS, 8)} s`;
  elements.frequencyHz.textContent = `${formatNumber(frequencyHz, 8)} Hz`;
  elements.frequencyKhz.textContent = `${formatNumber(frequencyKhz, 8)} kHz / ${formatNumber(frequencyMhz, 8)} MHz`;
  elements.pulseWidthUs.textContent = `${formatNumber(pulseWidthUs, 8)} μs`;
  elements.pulseWidthMs.textContent = `${formatNumber(pulseWidthMs, 8)} ms`;
  elements.dutyCycle.textContent = `${formatNumber(dutyConfig.displayedDuty, 8)} %`;
  elements.dutyCycleDetail.textContent = dutyConfig.mode === "hardware"
    ? `硬件准确：CCR / (ARR + 1)；Excel 口径 ${formatNumber(dutyConfig.legacyDuty, 8)} %；${counterModeLabel}`
    : `Excel 口径：CCR / ARR；硬件准确 ${formatNumber(dutyConfig.hardwareDuty, 8)} %；${counterModeLabel}`;
  elements.tdtsUs.textContent = `${formatNumber(tdtsUs, 8)} μs`;
  elements.tdtsNs.textContent = `${formatNumber(tdtsNs, 8)} ns`;
  elements.dtgBinary.textContent = padBinary(dtgValue, 8);
  elements.dtgBinarySplit.textContent = `前缀 ${dtg.prefixBin} / 有效位 ${dtg.activeBin}`;
  elements.dtgBranch.textContent = dtg.branch;
  elements.dtgFormula.textContent = dtg.formula;
  elements.dtgStepLabel.textContent = dtg.branch === "0xxxxxxx" ? "步长 Tdts" : "步长 Tdtg";
  elements.tdtgUs.textContent = formatNumber(tdtgUs, 8);
  elements.deadTimeUs.textContent = `${formatNumber(deadTimeUs, 8)} μs`;
  elements.deadTimeDuty.textContent = `${formatNumber(deadTimeDuty, 8)} % of period`;
  elements.deadTimeNs.textContent = formatNumber(deadTimeNs, 8);
  elements.dtgRawDec.textContent = dtgValue;
  elements.dtgRawBin.textContent = padBinary(dtgValue, 8);
  elements.dtgPrefixDec.textContent = dtg.prefixDec;
  elements.dtgPrefixBin.textContent = dtg.prefixBin;
  elements.dtgActiveLabel.textContent = dtg.activeLabel;
  elements.dtgActiveDec.textContent = dtg.activeDec;
  elements.dtgActiveBin.textContent = dtg.activeBin;
  elements.targetDutyHint.textContent = hasTargetDutyPercent && Number.isFinite(targetDutyPercent)
    ? `按当前模式回填后，目标占空比 ${formatNumber(targetDutyPercent, 6)} % 会映射到对应 CCR。`
    : "会按当前占空比口径和计数模式计算。";
  elements.shareLinkHint.textContent = "分享链接会带上当前参数，接收方打开即可恢复。";

  updateDashboardMetrics({
    apbClockMhz,
    timerClockMhz,
    frequencyHz,
    dutyCycle: dutyConfig.displayedDuty,
    deadTimeUs,
    pscRegister,
    arrRegister,
    clockProfileLabel,
    counterModeLabel,
    tickTimeUs,
    periodUs,
    pulseWidthUs,
  });

  renderChannelOutputs(counterPeriod, tickTimeUs, periodFactor, registerMax);

  renderWaveformPreview({
    hardwareDuty: dutyConfig.hardwareDuty,
    periodUs,
    pulseWidthUs,
    deadTimeUs,
    counterModeLabel,
    isCenterAligned: isCenterAlignedMode(counterMode),
  });

  updateSnippet({
    pscRegister,
    arrRegister,
    compareValue,
    clockDivision,
    apbClockMhz,
    dutyCycle: dutyConfig.displayedDuty,
    timerBits,
    dtgValue,
    clockProfileLabel,
    counterMode,
    dutyModeLabel: dutyConfig.mode === "hardware" ? "硬件准确" : "Excel legacy",
  });
  saveState();
}

function fillFallback() {
  [
    "heroClock",
    "heroFrequency",
    "heroDuty",
    "heroDeadTime",
    "overviewClock",
    "overviewFrequency",
    "overviewDuty",
    "overviewDeadTime",
    "overviewRegisters",
    "flowClock",
    "flowTick",
    "flowPeriod",
    "flowPulse",
    "targetFrequencyActual",
    "targetFrequencyError",
    "targetFrequencyFit",
    "channel1Duty",
    "channel1Detail",
    "channel2Duty",
    "channel2Detail",
    "channel3Duty",
    "channel3Detail",
    "channel4Duty",
    "channel4Detail",
    "capturePrescaler",
    "capturePscRegister",
    "captureCounterPeriod",
    "captureArrRegister",
    "captureActualCounts",
    "captureResolution",
    "captureTickFrequency",
    "captureOverflowHint",
    "reverseDtgValue",
    "reverseDeadTimeActual",
    "reverseDeadTimeError",
    "reverseDeadTimeBranch",
    "waveMode",
    "wavePeriod",
    "wavePulse",
    "waveDeadTime",
    "pscRegister",
    "arrRegister",
    "timerClockMhz",
    "timerClockHz",
    "tickTimeUs",
    "periodUs",
    "periodMs",
    "frequencyHz",
    "frequencyKhz",
    "pulseWidthUs",
    "pulseWidthMs",
    "dutyCycle",
    "dutyCycleDetail",
    "tdtsUs",
    "tdtsNs",
    "dtgBinary",
    "dtgBinarySplit",
    "dtgBranch",
    "dtgFormula",
    "dtgStepLabel",
    "tdtgUs",
    "deadTimeUs",
    "deadTimeDuty",
    "deadTimeNs",
    "dtgRawDec",
    "dtgRawBin",
    "dtgPrefixDec",
    "dtgPrefixBin",
    "dtgActiveDec",
    "dtgActiveBin",
  ].forEach((key) => {
    elements[key].textContent = "-";
  });
  elements.dtgStepLabel.textContent = "步长 Tdtg";
  elements.dtgActiveLabel.textContent = "当前有效字段";
  elements.targetFrequencyHint.textContent = "在目标频率输入框按 Enter 也可以直接回填。";
  elements.targetDutyHint.textContent = "会按当前占空比口径和计数模式计算。";
  elements.targetDeadTimeHint.textContent = "这个反推沿用当前页面的 DTG / Tdts 计算逻辑。";
  elements.shareLinkHint.textContent = "分享链接会带上当前参数，接收方打开即可恢复。";
  elements.captureHint.textContent = "输入待测频率和期望每周期计数后，页面会给出更适合输入捕获的 PSC / ARR 组合。";
  renderWaveformPreview(null);
}

function getClockDivisionConstant(clockDivision) {
  return {
    1: "TIM_CLOCKDIVISION_DIV1",
    2: "TIM_CLOCKDIVISION_DIV2",
    4: "TIM_CLOCKDIVISION_DIV4",
  }[clockDivision] ?? "TIM_CLOCKDIVISION_DIV1";
}

function updateSnippet(values) {
  if (values.pscRegister == null || values.arrRegister == null || values.compareValue == null) {
    elements.snippetMeta.textContent = "输入无效，暂不生成代码片段";
    elements.generatedSnippet.textContent = "-";
    return;
  }

  const selectedPreset = getSelectedPreset();
  const snippet = [
    `// ${selectedPreset.name} | ${values.clockProfileLabel} | TIMxCLK = ${formatNumber(values.apbClockMhz)} MHz`,
    `// Duty mode: ${values.dutyModeLabel}`,
    `// Counter mode: ${getCounterModeLabel(values.counterMode)}`,
    "TIM_HandleTypeDef htimx;",
    "TIM_OC_InitTypeDef sConfigOC = {0};",
    "",
    `htimx.Init.Prescaler = ${values.pscRegister};`,
    `htimx.Init.CounterMode = ${getCounterModeConstant(values.counterMode)};`,
    `htimx.Init.Period = ${values.arrRegister};`,
    `htimx.Init.ClockDivision = ${getClockDivisionConstant(values.clockDivision)};`,
    "htimx.Init.AutoReloadPreload = TIM_AUTORELOAD_PRELOAD_DISABLE;",
    "",
    `sConfigOC.Pulse = ${values.compareValue};`,
    `// DeadTime (CubeMX DTG) = ${values.dtgValue}`,
  ].join("\n");

  elements.generatedSnippet.textContent = snippet;
  elements.snippetMeta.textContent = `寄存器位宽 ${values.timerBits} bit | 当前占空比 ${formatNumber(values.dutyCycle, 6)} %`;
}

async function copySnippet() {
  const snippet = elements.generatedSnippet.textContent;
  if (!snippet || snippet === "-") {
    statusMessage = { type: "warn", text: "当前没有可复制的代码片段。" };
    calculate();
    return;
  }

  try {
    await navigator.clipboard.writeText(snippet);
    statusMessage = { type: "ok", text: "代码片段已复制到剪贴板。" };
  } catch (error) {
    statusMessage = { type: "warn", text: "浏览器未允许剪贴板访问，请手动复制代码片段。" };
  }
  calculate();
}

function applyTargetDuty() {
  const targetDutyPercent = readNumber(elements.targetDutyPercent);
  const counterPeriod = readInt(elements.counterPeriod);

  if (!(targetDutyPercent >= 0) || !(targetDutyPercent <= 100) || !Number.isInteger(counterPeriod) || counterPeriod < 1) {
    statusMessage = { type: "warn", text: "请先输入 0 到 100 之间的目标占空比，并保证 ARR + 1 合法。" };
    calculate();
    return;
  }

  const compareValue = getCompareValueFromDuty(targetDutyPercent, counterPeriod);
  elements.compareValue.value = String(compareValue);
  statusMessage = {
    type: "info",
    text: `目标占空比 ${formatNumber(targetDutyPercent, 6)} % 已回填为 CCR = ${compareValue}。`,
  };
  calculate();
}

function applyTargetFrequency() {
  const targetFrequencyHz = readNumber(elements.targetFrequencyHz);
  const apbClockMhz = readNumber(elements.apbClockMhz);
  const timerBits = readInt(elements.timerBits);
  const counterPeriod = readInt(elements.counterPeriod);
  const compareValue = readInt(elements.compareValue);
  const counterMode = elements.counterMode.value;
  const dutyMode = elements.dutyCycleMode.value;

  if (!(targetFrequencyHz > 0) || !(apbClockMhz > 0)) {
    statusMessage = { type: "warn", text: "请先输入合法的 TIMxCLK 和目标频率。" };
    calculate();
    return;
  }

  const timerClockHz = apbClockMhz * 1_000_000;
  const targetCounts = timerClockHz / (targetFrequencyHz * getCounterModePeriodFactor(counterMode));
  const registerMax = (2 ** timerBits) - 1;
  const inputMax = registerMax + 1;

  if (targetCounts < 1) {
    statusMessage = { type: "warn", text: "目标频率过高，当前 TIMxCLK 无法实现至少 1 个计数周期。" };
    calculate();
    return;
  }

  const initialPrescaler = clamp(Math.ceil(targetCounts / inputMax), 1, inputMax);
  const searchRadius = timerBits === 16 ? 4000 : 200;
  const searchStart = clamp(initialPrescaler - searchRadius, 1, inputMax);
  const searchEnd = clamp(initialPrescaler + searchRadius, 1, inputMax);

  let best = null;

  for (let candidatePrescaler = searchStart; candidatePrescaler <= searchEnd; candidatePrescaler += 1) {
    const counterCandidate = clamp(Math.round(targetCounts / candidatePrescaler), 1, inputMax);
    const actualFrequency = timerClockHz / (
      candidatePrescaler
      * counterCandidate
      * getCounterModePeriodFactor(counterMode)
    );
    const relativeError = Math.abs(actualFrequency - targetFrequencyHz) / targetFrequencyHz;
    const candidate = {
      prescaler: candidatePrescaler,
      counterPeriod: counterCandidate,
      actualFrequency,
      relativeError,
    };

    if (
      best == null
      || candidate.relativeError < best.relativeError
      || (candidate.relativeError === best.relativeError && candidate.counterPeriod > best.counterPeriod)
    ) {
      best = candidate;
    }
  }

  if (!best || best.prescaler > inputMax || best.counterPeriod > inputMax) {
    statusMessage = { type: "warn", text: "未找到落在当前位宽范围内的 PSC / ARR 组合。" };
    calculate();
    return;
  }

  const dutyRatio = dutyMode === "hardware"
    ? clamp(compareValue / Math.max(counterPeriod, 1), 0, 1)
    : clamp(compareValue / Math.max(counterPeriod - 1, 1), 0, 1);
  const compareScale = dutyMode === "hardware"
    ? best.counterPeriod
    : Math.max(best.counterPeriod - 1, 0);
  const compareCap = dutyMode === "hardware"
    ? best.counterPeriod
    : Math.max(best.counterPeriod - 1, 0);
  const newCompareValue = clamp(Math.round(dutyRatio * compareScale), 0, Math.min(compareCap, registerMax));

  elements.prescaler.value = String(best.prescaler);
  elements.counterPeriod.value = String(best.counterPeriod);
  elements.compareValue.value = String(newCompareValue);
  lastTargetFrequencyFit = {
    ...best,
    targetFrequencyHz,
    counterModeLabel: getCounterModeLabel(counterMode),
  };

  statusMessage = {
    type: "info",
    text: `已按目标频率 ${formatNumber(targetFrequencyHz, 6)} Hz 回填：Prescaler = ${best.prescaler}，Counter Period = ${best.counterPeriod}，实际频率约 ${formatNumber(best.actualFrequency, 6)} Hz，相对误差 ${formatNumber(best.relativeError * 100, 8)} %。`,
  };
  calculate();
}

function applyTargetDeadTime() {
  const targetDeadTimeUs = readNumber(elements.targetDeadTimeUs);
  const apbClockMhz = readNumber(elements.apbClockMhz);
  const clockDivision = readInt(elements.clockDivision);

  if (!(targetDeadTimeUs >= 0) || !(apbClockMhz > 0) || ![1, 2, 4].includes(clockDivision)) {
    statusMessage = { type: "warn", text: "请先输入合法的目标死区时间、TIMxCLK 和 CKD。" };
    calculate();
    return;
  }

  const tdtsUs = getTdtsUs(apbClockMhz, clockDivision);
  let best = null;

  for (let candidateDtg = 0; candidateDtg <= 255; candidateDtg += 1) {
    const candidateTiming = getDtgTiming(candidateDtg, tdtsUs);
    const absoluteError = Math.abs(candidateTiming.deadTimeUs - targetDeadTimeUs);
    const relativeError = targetDeadTimeUs > 0 ? absoluteError / targetDeadTimeUs : 0;
    const candidate = {
      dtgValue: candidateDtg,
      actualDeadTimeUs: candidateTiming.deadTimeUs,
      absoluteError,
      relativeError,
      branch: candidateTiming.dtg.branch,
      formula: candidateTiming.dtg.formula,
    };

    if (
      best == null
      || candidate.absoluteError < best.absoluteError
      || (candidate.absoluteError === best.absoluteError && candidate.dtgValue < best.dtgValue)
    ) {
      best = candidate;
    }
  }

  if (!best) {
    statusMessage = { type: "warn", text: "未找到可用的 DTG 组合。" };
    calculate();
    return;
  }

  elements.dtgValue.value = String(best.dtgValue);
  lastDeadTimeReverseFit = {
    ...best,
    targetDeadTimeUs,
  };
  statusMessage = {
    type: "info",
    text: `目标死区 ${formatNumber(targetDeadTimeUs, 8)} μs 已反推为 DTG = ${best.dtgValue}，实际死区约 ${formatNumber(best.actualDeadTimeUs, 8)} μs，相对误差 ${formatNumber(best.relativeError * 100, 8)} %。`,
  };
  calculate();
}

function resetToDefaults() {
  resetInputs(DEFAULT_STATE);
  populateClockProfiles(getSelectedPreset(), DEFAULT_STATE.clockProfile);
  applyClockProfileSelection();
  updatePresetSummary();
  clearTransientFeedback();
  statusMessage = { type: "info", text: "已恢复为默认参数。" };
  calculate();
}

function saveState() {
  const snapshot = getStateSnapshot();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch (error) {
    // Ignore storage failures.
  }
  updateUrlState(snapshot);
}

function loadStateFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function restoreState() {
  const savedState = loadStateFromStorage(STORAGE_KEY);
  const legacyKey = savedState
    ? null
    : LEGACY_STORAGE_KEYS.find((key) => loadStateFromStorage(key) != null) ?? null;
  const legacyState = legacyKey ? loadStateFromStorage(legacyKey) : null;
  const urlState = loadStateFromUrl();
  const restoredState = {
    ...DEFAULT_STATE,
    ...(savedState ?? legacyState ?? {}),
    ...(urlState ?? {}),
  };

  resetInputs(restoredState);

  if ((legacyState || urlState) && !savedState) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(restoredState));
      if (typeof localStorage.removeItem === "function" && legacyKey) {
        localStorage.removeItem(legacyKey);
      }
    } catch (error) {
      // Ignore migration failures.
    }
  }

  return restoredState;
}

function resetInputs(state) {
  Object.entries(state).forEach(([key, value]) => {
    if (elements[key]) {
      elements[key].value = value;
    }
  });

  if (!PRESET_MAP.has(elements.chipPreset.value)) {
    elements.chipPreset.value = DEFAULT_STATE.chipPreset;
  }
}

init();
