const STORAGE_KEY = "stm32-timer-calculator-state-v2";

const PRESET_GROUPS = [
  {
    label: "F0 / F1 / F3",
    items: [
      { id: "stm32f030", name: "STM32F030", family: "STM32F0", apbClockMhz: 48, note: "常见 48 MHz 起点，适合快速估算基础定时器参数。", bitsHint: "大多数定时器为 16 位" },
      { id: "stm32f072", name: "STM32F072", family: "STM32F0", apbClockMhz: 48, note: "USB 常用系列，定时器起点通常按 48 MHz 工程值估算。", bitsHint: "大多数定时器为 16 位" },
      { id: "stm32f103", name: "STM32F103", family: "STM32F1", apbClockMhz: 72, note: "Blue Pill 等常见 F1 方案，默认延续原工作簿参数。", bitsHint: "TIM2 常见 32 位，其余多为 16 位" },
      { id: "stm32f303", name: "STM32F303", family: "STM32F3", apbClockMhz: 72, note: "电机控制常见系列，适合做 PWM 和死区时间初算。", bitsHint: "大多数定时器为 16 位" },
    ],
  },
  {
    label: "F4 / F7",
    items: [
      { id: "stm32f401", name: "STM32F401", family: "STM32F4", apbClockMhz: 84, note: "轻量级 F4 常见起点。", bitsHint: "TIM2 / TIM5 常见 32 位" },
      { id: "stm32f411", name: "STM32F411", family: "STM32F4", apbClockMhz: 100, note: "常见 DSP/控制类项目起点。", bitsHint: "TIM2 / TIM5 常见 32 位" },
      { id: "stm32f407", name: "STM32F407", family: "STM32F4", apbClockMhz: 168, note: "原工具已有型号，保留为常见 F4 高性能配置。", bitsHint: "TIM2 / TIM5 常见 32 位" },
      { id: "stm32f429", name: "STM32F429", family: "STM32F4", apbClockMhz: 180, note: "带 LTDC 的 F4 系列，常用于屏幕项目。", bitsHint: "TIM2 / TIM5 常见 32 位" },
      { id: "stm32f446", name: "STM32F446", family: "STM32F4", apbClockMhz: 180, note: "常见于中高性能控制项目。", bitsHint: "TIM2 / TIM5 常见 32 位" },
      { id: "stm32f767", name: "STM32F767", family: "STM32F7", apbClockMhz: 216, note: "F7 系列常见高性能起点。", bitsHint: "TIM2 / TIM5 常见 32 位" },
    ],
  },
  {
    label: "G0 / G4",
    items: [
      { id: "stm32g030", name: "STM32G030", family: "STM32G0", apbClockMhz: 64, note: "G0 入门系列，适合低成本控制。", bitsHint: "大多数定时器为 16 位" },
      { id: "stm32g071", name: "STM32G071", family: "STM32G0", apbClockMhz: 64, note: "G0 系列常见工程起点。", bitsHint: "大多数定时器为 16 位" },
      { id: "stm32g431", name: "STM32G431", family: "STM32G4", apbClockMhz: 170, note: "G4 电机控制常见系列，适合高分辨率 PWM。", bitsHint: "大多数定时器为 16 位" },
      { id: "stm32g474", name: "STM32G474", family: "STM32G4", apbClockMhz: 170, note: "G4 高性能控制系列，常用于数字电源。", bitsHint: "大多数定时器为 16 位" },
    ],
  },
  {
    label: "H7",
    items: [
      { id: "stm32h743", name: "STM32H743", family: "STM32H7", apbClockMhz: 240, note: "这里用常见 TIMxCLK 上限 240 MHz 起算，不直接等于 480 MHz CPU 主频。", bitsHint: "TIM2 / TIM5 常见 32 位" },
      { id: "stm32h750", name: "STM32H750", family: "STM32H7", apbClockMhz: 240, note: "修正原表中的 480 MHz 口径，预设改为更合理的 240 MHz TIMxCLK 起点。", bitsHint: "TIM2 / TIM5 常见 32 位" },
    ],
  },
  {
    label: "L / U / 无线",
    items: [
      { id: "stm32l031", name: "STM32L031", family: "STM32L0", apbClockMhz: 32, note: "低功耗小型项目常见系列。", bitsHint: "大多数定时器为 16 位" },
      { id: "stm32l072", name: "STM32L072", family: "STM32L0", apbClockMhz: 32, note: "低功耗带更多外设的 L0 起点。", bitsHint: "大多数定时器为 16 位" },
      { id: "stm32l476", name: "STM32L476", family: "STM32L4", apbClockMhz: 80, note: "L4 常用高性能低功耗系列。", bitsHint: "大多数定时器为 16 位" },
      { id: "stm32u575", name: "STM32U575", family: "STM32U5", apbClockMhz: 160, note: "U5 系列常见起点，适合更高安全需求项目。", bitsHint: "大多数定时器为 16 位" },
      { id: "stm32wb55", name: "STM32WB55", family: "STM32WB", apbClockMhz: 64, note: "BLE / Thread 双核无线常见系列。", bitsHint: "大多数定时器为 16 位" },
      { id: "stm32wl55", name: "STM32WL55", family: "STM32WL", apbClockMhz: 48, note: "LoRa / Sub-GHz 无线项目常见起点。", bitsHint: "大多数定时器为 16 位" },
    ],
  },
  {
    label: "自定义",
    items: [
      { id: "custom", name: "自定义", family: "手工输入", apbClockMhz: null, note: "自行填写实际 TIMxCLK / APB 定时器时钟。", bitsHint: "按具体定时器选择位宽" },
    ],
  },
];

const PRESETS = PRESET_GROUPS.flatMap((group) => group.items);
const PRESET_MAP = new Map(PRESETS.map((preset) => [preset.id, preset]));

const DEFAULT_STATE = {
  chipPreset: "stm32f103",
  apbClockMhz: "72",
  timerBits: "16",
  prescaler: "720",
  counterPeriod: "1000",
  compareValue: "500",
  clockDivision: "4",
  dtgValue: "255",
  targetFrequencyHz: "",
};

const elements = {
  chipPreset: document.getElementById("chipPreset"),
  apbClockMhz: document.getElementById("apbClockMhz"),
  timerBits: document.getElementById("timerBits"),
  prescaler: document.getElementById("prescaler"),
  counterPeriod: document.getElementById("counterPeriod"),
  compareValue: document.getElementById("compareValue"),
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
  tdtsUs: document.getElementById("tdtsUs"),
  tdtsNs: document.getElementById("tdtsNs"),
  dtgBinary: document.getElementById("dtgBinary"),
  dtgBinarySplit: document.getElementById("dtgBinarySplit"),
  tdtgUs: document.getElementById("tdtgUs"),
  deadTimeUs: document.getElementById("deadTimeUs"),
  deadTimeDuty: document.getElementById("deadTimeDuty"),
  dtg80Dec: document.getElementById("dtg80Dec"),
  dtg80Bin: document.getElementById("dtg80Bin"),
  dtg75Dec: document.getElementById("dtg75Dec"),
  dtg75Bin: document.getElementById("dtg75Bin"),
  dtg40Dec: document.getElementById("dtg40Dec"),
  dtg40Bin: document.getElementById("dtg40Bin"),
  dtg50Dec: document.getElementById("dtg50Dec"),
  dtg50Bin: document.getElementById("dtg50Bin"),
  generatedSnippet: document.getElementById("generatedSnippet"),
  snippetMeta: document.getElementById("snippetMeta"),
};

let statusMessage = null;

function init() {
  populatePresetSelect();
  restoreState();
  bindEvents();
  updatePresetSummary();
  calculate();
}

function populatePresetSelect() {
  PRESET_GROUPS.forEach((group) => {
    const optgroup = document.createElement("optgroup");
    optgroup.label = group.label;
    group.items.forEach((preset) => {
      const option = document.createElement("option");
      option.value = preset.id;
      option.textContent = preset.apbClockMhz == null
        ? preset.name
        : `${preset.name} / ${preset.apbClockMhz} MHz`;
      if (preset.id === DEFAULT_STATE.chipPreset) {
        option.selected = true;
      }
      optgroup.append(option);
    });
    elements.chipPreset.append(optgroup);
  });
}

function bindEvents() {
  elements.chipPreset.addEventListener("change", handlePresetChange);
  elements.apbClockMhz.addEventListener("input", syncPresetWithClock);
  elements.applyTargetButton.addEventListener("click", applyTargetFrequency);
  elements.resetButton.addEventListener("click", resetToDefaults);
  elements.copySnippetButton.addEventListener("click", copySnippet);

  [
    "timerBits",
    "prescaler",
    "counterPeriod",
    "compareValue",
    "clockDivision",
    "dtgValue",
    "targetFrequencyHz",
  ].forEach((key) => {
    elements[key].addEventListener("input", calculate);
    elements[key].addEventListener("change", calculate);
  });
}

function getSelectedPreset() {
  return PRESET_MAP.get(elements.chipPreset.value) ?? PRESET_MAP.get("custom");
}

function handlePresetChange() {
  const preset = getSelectedPreset();
  if (preset.apbClockMhz != null) {
    elements.apbClockMhz.value = preset.apbClockMhz;
  }
  updatePresetSummary();
  statusMessage = null;
  calculate();
}

function syncPresetWithClock() {
  const preset = getSelectedPreset();
  if (preset.apbClockMhz == null) {
    updatePresetSummary();
    calculate();
    return;
  }

  const currentClock = Number(elements.apbClockMhz.value);
  if (currentClock !== preset.apbClockMhz) {
    elements.chipPreset.value = "custom";
  }
  updatePresetSummary();
  calculate();
}

function updatePresetSummary() {
  const preset = getSelectedPreset();
  elements.currentPresetLabel.textContent = preset.name;
  elements.presetFamily.textContent = preset.family;
  elements.presetBitsHint.textContent = preset.bitsHint;
  elements.presetClockHint.textContent = preset.apbClockMhz == null
    ? "建议 TIMxCLK 起点：手工输入"
    : `建议 TIMxCLK 起点：${preset.apbClockMhz} MHz`;
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
  if (compareValue > Math.max(counterPeriod - 1, 0)) {
    baseMessages.push({ type: "warn", text: "CCR 大于 ARR 寄存器值，PWM 输出通常不建议这样配置。" });
  }
  if (counterPeriod === 1) {
    baseMessages.push({ type: "warn", text: "Counter Period 为 1 时，占空比公式分母为 0，页面将不显示占空比。" });
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
  const dutyCycle = counterPeriod === 1 ? Number.NaN : compareValue / (counterPeriod - 1) * 100;
  const tdtsUs = 1 / (apbClockMhz / clockDivision);
  const tdtsNs = tdtsUs * 1000;

  const dtg80Dec = dtgValue;
  const dtg80Bin = padBinary(dtg80Dec, 8);
  const dtg75Dec = Math.floor(dtgValue / 32);
  const dtg75Bin = padBinary(dtg75Dec, 3);
  const dtg40Dec = dtgValue % 32;
  const dtg40Bin = padBinary(dtg40Dec, 5);
  const dtg50Dec = dtgValue % 64;
  const dtg50Bin = padBinary(dtg50Dec, 6);

  const tdtgUs = dtg75Dec < 4
    ? tdtsUs
    : dtg75Dec < 6
      ? 2 * tdtsUs
      : dtg75Dec === 6
        ? 8 * tdtsUs
        : 16 * tdtsUs;

  const deadTimeUs = dtg75Dec < 4
    ? dtgValue * tdtgUs
    : dtg75Dec < 6
      ? (64 + dtg50Dec) * tdtgUs
      : (32 + dtg40Dec) * tdtgUs;

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
  elements.dutyCycle.textContent = `${formatNumber(dutyCycle, 8)} %`;
  elements.tdtsUs.textContent = `${formatNumber(tdtsUs, 8)} μs`;
  elements.tdtsNs.textContent = `${formatNumber(tdtsNs, 8)} ns`;
  elements.dtgBinary.textContent = dtg80Bin;
  elements.dtgBinarySplit.textContent = `[7:5] ${dtg75Bin} / [4:0] ${dtg40Bin}`;
  elements.tdtgUs.textContent = formatNumber(tdtgUs, 8);
  elements.deadTimeUs.textContent = `${formatNumber(deadTimeUs, 8)} μs`;
  elements.deadTimeDuty.textContent = `${formatNumber(deadTimeDuty, 8)} % of period`;
  elements.dtg80Dec.textContent = dtg80Dec;
  elements.dtg80Bin.textContent = dtg80Bin;
  elements.dtg75Dec.textContent = dtg75Dec;
  elements.dtg75Bin.textContent = dtg75Bin;
  elements.dtg40Dec.textContent = dtg40Dec;
  elements.dtg40Bin.textContent = dtg40Bin;
  elements.dtg50Dec.textContent = dtg50Dec;
  elements.dtg50Bin.textContent = dtg50Bin;

  updateSnippet({
    pscRegister,
    arrRegister,
    compareValue,
    clockDivision,
    apbClockMhz,
    dutyCycle,
    timerBits,
    dtgValue,
    targetFrequencyHz: readNumber(elements.targetFrequencyHz),
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
    "tdtsUs",
    "tdtsNs",
    "dtgBinary",
    "dtgBinarySplit",
    "tdtgUs",
    "deadTimeUs",
    "deadTimeDuty",
    "dtg80Dec",
    "dtg80Bin",
    "dtg75Dec",
    "dtg75Bin",
    "dtg40Dec",
    "dtg40Bin",
    "dtg50Dec",
    "dtg50Bin",
  ].forEach((key) => {
    elements[key].textContent = "-";
  });
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
    `// ${selectedPreset.name} | TIMxCLK = ${formatNumber(values.apbClockMhz)} MHz`,
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
  elements.snippetMeta.textContent = `寄存器位宽 ${values.timerBits} bit | 预估占空比 ${formatNumber(values.dutyCycle, 6)} %`;
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
  const prescaler = readInt(elements.prescaler);
  const counterPeriod = readInt(elements.counterPeriod);
  const compareValue = readInt(elements.compareValue);

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

  const dutyRatio = counterPeriod > 1
    ? clamp(compareValue / Math.max(counterPeriod - 1, 1), 0, 1)
    : 0;
  const newCompareValue = clamp(Math.round(dutyRatio * Math.max(best.counterPeriod - 1, 0)), 0, registerMax);

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
  Object.entries(DEFAULT_STATE).forEach(([key, value]) => {
    elements[key].value = value;
  });
  statusMessage = { type: "info", text: "已恢复为默认参数。"}; 
  updatePresetSummary();
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
