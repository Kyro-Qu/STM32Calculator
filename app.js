const STORAGE_KEY = "stm32-timer-calculator-state-v3";

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
  clockDivision: "4",
  dtgValue: "255",
  targetFrequencyHz: "",
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
  dutyCycleMode: document.getElementById("dutyCycleMode"),
  clockDivision: document.getElementById("clockDivision"),
  dtgValue: document.getElementById("dtgValue"),
  targetFrequencyHz: document.getElementById("targetFrequencyHz"),
  applyTargetButton: document.getElementById("applyTargetButton"),
  resetButton: document.getElementById("resetButton"),
  copySnippetButton: document.getElementById("copySnippetButton"),
  messages: document.getElementById("messages"),
  currentPresetLabel: document.getElementById("currentPresetLabel"),
  presetClockHint: document.getElementById("presetClockHint"),
  presetNote: document.getElementById("presetNote"),
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
  tdtgUs: document.getElementById("tdtgUs"),
  deadTimeUs: document.getElementById("deadTimeUs"),
  deadTimeDuty: document.getElementById("deadTimeDuty"),
  dtgRawDec: document.getElementById("dtgRawDec"),
  dtgRawBin: document.getElementById("dtgRawBin"),
  dtgPrefixDec: document.getElementById("dtgPrefixDec"),
  dtgPrefixBin: document.getElementById("dtgPrefixBin"),
  dtgActiveLabel: document.getElementById("dtgActiveLabel"),
  dtgActiveDec: document.getElementById("dtgActiveDec"),
  dtgActiveBin: document.getElementById("dtgActiveBin"),
  generatedSnippet: document.getElementById("generatedSnippet"),
  snippetMeta: document.getElementById("snippetMeta"),
};

let statusMessage = null;

function init() {
  populatePresetSelect();
  restoreState();
  populateClockProfiles(getSelectedPreset(), elements.clockProfile.value);
  updatePresetSummary();
  bindEvents();
  calculate();
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
  elements.applyTargetButton.addEventListener("click", applyTargetFrequency);
  elements.resetButton.addEventListener("click", resetToDefaults);
  elements.copySnippetButton.addEventListener("click", copySnippet);

  [
    "timerBits",
    "prescaler",
    "counterPeriod",
    "compareValue",
    "dutyCycleMode",
    "clockDivision",
    "dtgValue",
    "targetFrequencyHz",
  ].forEach((key) => {
    elements[key].addEventListener("input", clearStatusAndCalculate);
    elements[key].addEventListener("change", clearStatusAndCalculate);
  });
}

function clearStatusAndCalculate() {
  statusMessage = null;
  calculate();
}

function handlePresetChange() {
  const preset = getSelectedPreset();
  populateClockProfiles(preset);
  applyClockProfileSelection();
  updatePresetSummary();
  statusMessage = null;
  calculate();
}

function handleClockProfileChange() {
  applyClockProfileSelection();
  updatePresetSummary();
  statusMessage = null;
  calculate();
}

function syncClockProfileWithInput() {
  const currentClock = Number(elements.apbClockMhz.value);
  const profiles = getCurrentClockProfiles();
  const matchedProfile = profiles.find((profile) => profile.apbClockMhz === currentClock);
  elements.clockProfile.value = matchedProfile ? matchedProfile.id : "manual";
  updatePresetSummary();
  statusMessage = null;
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

function getDutyModeConfig(counterPeriod, compareValue) {
  const hardwareDuty = counterPeriod > 0 ? compareValue / counterPeriod * 100 : Number.NaN;
  const legacyDuty = counterPeriod === 1 ? Number.NaN : compareValue / (counterPeriod - 1) * 100;
  const mode = elements.dutyCycleMode.value;

  return {
    mode,
    hardwareDuty,
    legacyDuty,
    displayedDuty: mode === "hardware" ? hardwareDuty : legacyDuty,
    compareLimit: mode === "hardware" ? counterPeriod : Math.max(counterPeriod - 1, 0),
  };
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
      formula: "DT = DTG[6:0] × Tdtg",
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

  const allMessages = buildMessages(baseMessages);
  renderMessages(allMessages);
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
    });
    saveState();
    return;
  }

  const pscRegister = prescaler - 1;
  const arrRegister = counterPeriod - 1;
  const timerClockMhz = apbClockMhz / prescaler;
  const timerClockHz = timerClockMhz * 1_000_000;
  const tickTimeUs = 1 / timerClockMhz;
  const periodUs = tickTimeUs * counterPeriod;
  const periodMs = periodUs / 1000;
  const periodS = periodMs / 1000;
  const frequencyMhz = 1 / periodUs;
  const frequencyKhz = 1 / periodMs;
  const frequencyHz = 1 / periodS;
  const pulseWidthUs = compareValue * tickTimeUs;
  const pulseWidthMs = pulseWidthUs / 1000;
  const tdtsUs = 1 / (apbClockMhz / clockDivision);
  const tdtsNs = tdtsUs * 1000;
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

  const deadTimeDuty = deadTimeUs / periodUs * 100;

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
    ? `硬件准确：CCR / (ARR + 1)；Excel 口径 ${formatNumber(dutyConfig.legacyDuty, 8)} %`
    : `Excel 口径：CCR / ARR；硬件准确 ${formatNumber(dutyConfig.hardwareDuty, 8)} %`;
  elements.tdtsUs.textContent = `${formatNumber(tdtsUs, 8)} μs`;
  elements.tdtsNs.textContent = `${formatNumber(tdtsNs, 8)} ns`;
  elements.dtgBinary.textContent = padBinary(dtgValue, 8);
  elements.dtgBinarySplit.textContent = `前缀 ${dtg.prefixBin} / 有效位 ${dtg.activeBin}`;
  elements.dtgBranch.textContent = dtg.branch;
  elements.dtgFormula.textContent = dtg.formula;
  elements.tdtgUs.textContent = formatNumber(tdtgUs, 8);
  elements.deadTimeUs.textContent = `${formatNumber(deadTimeUs, 8)} μs`;
  elements.deadTimeDuty.textContent = `${formatNumber(deadTimeDuty, 8)} % of period`;
  elements.dtgRawDec.textContent = dtgValue;
  elements.dtgRawBin.textContent = padBinary(dtgValue, 8);
  elements.dtgPrefixDec.textContent = dtg.prefixDec;
  elements.dtgPrefixBin.textContent = dtg.prefixBin;
  elements.dtgActiveLabel.textContent = dtg.activeLabel;
  elements.dtgActiveDec.textContent = dtg.activeDec;
  elements.dtgActiveBin.textContent = dtg.activeBin;

  updateSnippet({
    pscRegister,
    arrRegister,
    compareValue,
    clockDivision,
    apbClockMhz,
    dutyCycle: dutyConfig.displayedDuty,
    timerBits,
    dtgValue,
    clockProfileLabel: getSelectedClockProfile().label,
    dutyModeLabel: dutyConfig.mode === "hardware" ? "硬件准确" : "Excel legacy",
  });
  saveState();
}

function fillFallback() {
  [
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
    "tdtgUs",
    "deadTimeUs",
    "deadTimeDuty",
    "dtgRawDec",
    "dtgRawBin",
    "dtgPrefixDec",
    "dtgPrefixBin",
    "dtgActiveDec",
    "dtgActiveBin",
  ].forEach((key) => {
    elements[key].textContent = "-";
  });
  elements.dtgActiveLabel.textContent = "当前有效字段";
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
    "TIM_HandleTypeDef htimx;",
    "TIM_OC_InitTypeDef sConfigOC = {0};",
    "",
    `htimx.Init.Prescaler = ${values.pscRegister};`,
    "htimx.Init.CounterMode = TIM_COUNTERMODE_UP;",
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

function applyTargetFrequency() {
  const targetFrequencyHz = readNumber(elements.targetFrequencyHz);
  const apbClockMhz = readNumber(elements.apbClockMhz);
  const timerBits = readInt(elements.timerBits);
  const counterPeriod = readInt(elements.counterPeriod);
  const compareValue = readInt(elements.compareValue);
  const dutyMode = elements.dutyCycleMode.value;

  if (!(targetFrequencyHz > 0) || !(apbClockMhz > 0)) {
    statusMessage = { type: "warn", text: "请先输入合法的 TIMxCLK 和目标频率。" };
    calculate();
    return;
  }

  const timerClockHz = apbClockMhz * 1_000_000;
  const targetCounts = timerClockHz / targetFrequencyHz;
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
    const actualFrequency = timerClockHz / (candidatePrescaler * counterCandidate);
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

  statusMessage = {
    type: "info",
    text: `已按目标频率 ${formatNumber(targetFrequencyHz, 6)} Hz 回填：Prescaler = ${best.prescaler}，Counter Period = ${best.counterPeriod}，实际频率约 ${formatNumber(best.actualFrequency, 6)} Hz。`,
  };
  calculate();
}

function resetToDefaults() {
  resetInputs(DEFAULT_STATE);
  populateClockProfiles(getSelectedPreset(), DEFAULT_STATE.clockProfile);
  applyClockProfileSelection();
  updatePresetSummary();
  statusMessage = { type: "info", text: "已恢复为默认参数。" };
  calculate();
}

function saveState() {
  const snapshot = {};
  Object.keys(DEFAULT_STATE).forEach((key) => {
    snapshot[key] = elements[key].value;
  });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch (error) {
    // Ignore storage failures.
  }
}

function restoreState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      resetInputs(DEFAULT_STATE);
      return;
    }
    const parsed = JSON.parse(raw);
    resetInputs({ ...DEFAULT_STATE, ...parsed });
  } catch (error) {
    resetInputs(DEFAULT_STATE);
  }
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
