const PRESETS = [
  { name: "STM32H750", apbClockMhz: 480 },
  { name: "STM32G431", apbClockMhz: 168 },
  { name: "STM32F407", apbClockMhz: 168 },
  { name: "STM32F103", apbClockMhz: 72 },
  { name: "自定义", apbClockMhz: null },
];

const elements = {
  chipPreset: document.getElementById("chipPreset"),
  apbClockMhz: document.getElementById("apbClockMhz"),
  timerBits: document.getElementById("timerBits"),
  prescaler: document.getElementById("prescaler"),
  counterPeriod: document.getElementById("counterPeriod"),
  compareValue: document.getElementById("compareValue"),
  clockDivision: document.getElementById("clockDivision"),
  dtgValue: document.getElementById("dtgValue"),
  messages: document.getElementById("messages"),
  lastPresetLabel: document.getElementById("lastPresetLabel"),
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
};

function init() {
  PRESETS.forEach((preset, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = preset.apbClockMhz == null
      ? preset.name
      : `${preset.name} / ${preset.apbClockMhz} MHz`;
    if (preset.name === "STM32F103") {
      option.selected = true;
    }
    elements.chipPreset.append(option);
  });

  elements.chipPreset.addEventListener("change", handlePresetChange);
  elements.apbClockMhz.addEventListener("input", syncPresetWithClock);

  [
    "timerBits",
    "prescaler",
    "counterPeriod",
    "compareValue",
    "clockDivision",
    "dtgValue",
  ].forEach((key) => {
    elements[key].addEventListener("input", calculate);
    elements[key].addEventListener("change", calculate);
  });

  handlePresetChange();
  calculate();
}

function handlePresetChange() {
  const preset = PRESETS[Number(elements.chipPreset.value)];
  if (preset.apbClockMhz != null) {
    elements.apbClockMhz.value = preset.apbClockMhz;
    elements.lastPresetLabel.textContent = `${preset.name} / ${preset.apbClockMhz} MHz`;
  } else {
    elements.lastPresetLabel.textContent = "自定义 APB 时钟";
  }
  calculate();
}

function syncPresetWithClock() {
  const preset = PRESETS[Number(elements.chipPreset.value)];
  if (preset.apbClockMhz == null) {
    elements.lastPresetLabel.textContent = "自定义 APB 时钟";
    calculate();
    return;
  }

  const currentClock = Number(elements.apbClockMhz.value);
  if (currentClock !== preset.apbClockMhz) {
    elements.chipPreset.value = String(PRESETS.length - 1);
    elements.lastPresetLabel.textContent = "自定义 APB 时钟";
  } else {
    elements.lastPresetLabel.textContent = `${preset.name} / ${preset.apbClockMhz} MHz`;
  }
  calculate();
}

function readNumber(element) {
  return Number(element.value);
}

function padBinary(value, length) {
  return Math.max(0, value).toString(2).padStart(length, "0");
}

function formatNumber(value, digits = 6) {
  if (!Number.isFinite(value)) {
    return "-";
  }
  if (Math.abs(value) >= 1000000 || (Math.abs(value) > 0 && Math.abs(value) < 0.001)) {
    return value.toExponential(6);
  }
  return Number(value.toFixed(digits)).toString();
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
  const timerBits = readNumber(elements.timerBits);
  const prescaler = readNumber(elements.prescaler);
  const counterPeriod = readNumber(elements.counterPeriod);
  const compareValue = readNumber(elements.compareValue);
  const clockDivision = readNumber(elements.clockDivision);
  const dtgValue = readNumber(elements.dtgValue);

  const messages = [];
  const registerMax = (2 ** timerBits) - 1;
  const inputValueMax = registerMax + 1;

  if (!(apbClockMhz > 0)) {
    messages.push({ type: "error", text: "APB 定时器时钟必须大于 0 MHz。" });
  }
  if (!Number.isInteger(prescaler) || prescaler < 1) {
    messages.push({ type: "error", text: "Prescaler 必须是大于等于 1 的整数。" });
  }
  if (!Number.isInteger(counterPeriod) || counterPeriod < 1) {
    messages.push({ type: "error", text: "Counter Period 必须是大于等于 1 的整数。" });
  }
  if (!Number.isInteger(compareValue) || compareValue < 0) {
    messages.push({ type: "error", text: "CCR 必须是大于等于 0 的整数。" });
  }
  if (!Number.isInteger(dtgValue) || dtgValue < 0 || dtgValue > 255) {
    messages.push({ type: "error", text: "DTG[7:0] 必须在 0 到 255 之间。" });
  }
  if (prescaler > inputValueMax) {
    messages.push({ type: "warn", text: `Prescaler 超出 ${timerBits} 位可表示范围，最大建议输入 ${inputValueMax}。` });
  }
  if (counterPeriod > inputValueMax) {
    messages.push({ type: "warn", text: `Counter Period 超出 ${timerBits} 位可表示范围，最大建议输入 ${inputValueMax}。` });
  }
  if (compareValue > registerMax) {
    messages.push({ type: "warn", text: `CCR 超出 ${timerBits} 位寄存器最大值 ${registerMax}。` });
  }
  if (compareValue > Math.max(counterPeriod - 1, 0)) {
    messages.push({ type: "warn", text: "CCR 大于 ARR 寄存器值，PWM 输出通常不建议这样配置。" });
  }
  if (counterPeriod === 1) {
    messages.push({ type: "warn", text: "Counter Period 为 1 时，占空比公式分母为 0，页面将不显示占空比。" });
  }

  renderMessages(messages);
  elements.registerMax.textContent = formatNumber(registerMax, 0);

  if (messages.some((item) => item.type === "error")) {
    fillFallback();
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
  elements.tickTimeUs.textContent = formatNumber(tickTimeUs);
  elements.periodUs.textContent = `${formatNumber(periodUs)} μs`;
  elements.periodMs.textContent = `${formatNumber(periodMs)} ms / ${formatNumber(periodS)} s`;
  elements.frequencyHz.textContent = `${formatNumber(frequencyHz)} Hz`;
  elements.frequencyKhz.textContent = `${formatNumber(frequencyKhz)} kHz / ${formatNumber(frequencyMhz)} MHz`;
  elements.dutyCycle.textContent = `${formatNumber(dutyCycle)} %`;
  elements.tdtsUs.textContent = `${formatNumber(tdtsUs)} μs`;
  elements.tdtsNs.textContent = `${formatNumber(tdtsNs)} ns`;
  elements.dtgBinary.textContent = dtg80Bin;
  elements.dtgBinarySplit.textContent = `[7:5] ${dtg75Bin} / [4:0] ${dtg40Bin}`;
  elements.tdtgUs.textContent = formatNumber(tdtgUs);
  elements.deadTimeUs.textContent = `${formatNumber(deadTimeUs)} μs`;
  elements.deadTimeDuty.textContent = `${formatNumber(deadTimeDuty)} % of period`;
  elements.dtg80Dec.textContent = dtg80Dec;
  elements.dtg80Bin.textContent = dtg80Bin;
  elements.dtg75Dec.textContent = dtg75Dec;
  elements.dtg75Bin.textContent = dtg75Bin;
  elements.dtg40Dec.textContent = dtg40Dec;
  elements.dtg40Bin.textContent = dtg40Bin;
  elements.dtg50Dec.textContent = dtg50Dec;
  elements.dtg50Bin.textContent = dtg50Bin;
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

init();
