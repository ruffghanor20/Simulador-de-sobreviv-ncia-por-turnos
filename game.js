const STORAGE_PREFIX = "survival_sim_v4_slot_";

const DIFFICULTY = {
  easy: {
    label: "Fácil",
    targetDays: 10,
    dailyDrain: 6,
    scarcity: 0,
    eventChance: 0.35
  },
  normal: {
    label: "Normal",
    targetDays: 15,
    dailyDrain: 9,
    scarcity: 1,
    eventChance: 0.50
  },
  hard: {
    label: "Difícil",
    targetDays: 22,
    dailyDrain: 12,
    scarcity: 2,
    eventChance: 0.62
  }
};

const BIOMES = {
  forest: {
    label: "Floresta",
    start: { water: 1, fiber: 1 },
    waterBonus: 1,
    forageBonus: 1,
    huntBonus: 0.04
  },
  desert: {
    label: "Deserto",
    start: { wood: -1, water: -1, scrap: 1 },
    waterBonus: -1,
    forageBonus: -1,
    huntBonus: -0.05
  },
  tundra: {
    label: "Tundra",
    start: { wood: 1, food: 1, energy: -5 },
    waterBonus: 0,
    forageBonus: -1,
    huntBonus: 0
  }
};

const WEATHER_BY_BIOME = {
  forest: [
    { id: "clear", name: "Claro", drain: 0, waterBonus: 0, huntMod: 0 },
    { id: "rain", name: "Chuva", drain: 2, waterBonus: 2, huntMod: -0.06 },
    { id: "fog", name: "Neblina", drain: 1, waterBonus: 0, huntMod: -0.04 },
    { id: "storm", name: "Tempestade", drain: 3, waterBonus: 1, huntMod: -0.10 }
  ],
  desert: [
    { id: "clear", name: "Claro", drain: 0, waterBonus: 0, huntMod: 0 },
    { id: "heat", name: "Calor", drain: 3, waterBonus: -1, huntMod: -0.03 },
    { id: "drywind", name: "Vento seco", drain: 2, waterBonus: -1, huntMod: -0.02 },
    { id: "sandstorm", name: "Temp. de areia", drain: 4, waterBonus: -2, huntMod: -0.10 }
  ],
  tundra: [
    { id: "clear", name: "Claro", drain: 0, waterBonus: 0, huntMod: 0 },
    { id: "cold", name: "Frio", drain: 4, waterBonus: 0, huntMod: -0.05 },
    { id: "snow", name: "Neve", drain: 3, waterBonus: 1, huntMod: -0.08 },
    { id: "blizzard", name: "Nevasca", drain: 5, waterBonus: 0, huntMod: -0.12 }
  ]
};

const BASE_CAPS = {
  health: 100,
  energy: 100,
  morale: 100,
  food: 12,
  water: 12,
  wood: 30,
  scrap: 25,
  fiber: 20,
  shelter: 3,
  fire: 3,
  traps: 3,
  medkits: 5
};

const UPGRADE_META = {
  canteen: "Cantil improvisado",
  spear: "Lança rústica",
  purifier: "Purificador simples",
  bedroll: "Cama de folhas",
  rainCollector: "Coletor de chuva",
  smokeRack: "Defumador"
};

const RECIPES = [
  {
    id: "canteen",
    label: "Cantil improvisado",
    description: "Melhora a coleta de água e aumenta o limite máximo.",
    cost: { scrap: 2, fiber: 1 },
    repeatable: false
  },
  {
    id: "spear",
    label: "Lança rústica",
    description: "Aumenta a chance de caça e reduz dano em falhas.",
    cost: { wood: 2, scrap: 1 },
    repeatable: false
  },
  {
    id: "purifier",
    label: "Purificador simples",
    description: "Melhora a busca por água e reduz riscos em água ruim.",
    cost: { wood: 1, scrap: 2 },
    repeatable: false
  },
  {
    id: "bedroll",
    label: "Cama de folhas",
    description: "Descansar rende mais energia e moral.",
    cost: { wood: 1, fiber: 2 },
    repeatable: false
  },
  {
    id: "rainCollector",
    label: "Coletor de chuva / degelo",
    description: "Chuva e neve passam a gerar água extra.",
    cost: { wood: 2, scrap: 1, fiber: 1 },
    repeatable: false
  },
  {
    id: "smokeRack",
    label: "Defumador",
    description: "Caça rende mais comida e amplia a capacidade de estoque.",
    cost: { wood: 4, scrap: 2 },
    repeatable: false
  },
  {
    id: "trap",
    label: "Armadilha",
    description: "Ajuda na caça e em eventos hostis.",
    cost: { wood: 2, scrap: 1 },
    repeatable: true
  },
  {
    id: "medkit",
    label: "Kit médico improvisado",
    description: "Converte fibra e sucata em kit médico.",
    cost: { fiber: 2, scrap: 1 },
    repeatable: true
  }
];

const ACHIEVEMENTS = [
  {
    id: "five_days",
    title: "Casca grossa",
    desc: "Sobreviva até o dia 5.",
    reward: { morale: 2 },
    check: (s) => s.day >= 5
  },
  {
    id: "ten_days",
    title: "Ainda vivo",
    desc: "Sobreviva até o dia 10.",
    reward: { morale: 3 },
    check: (s) => s.day >= 10
  },
  {
    id: "master_builder",
    title: "Arquiteto do desespero",
    desc: "Leve o abrigo ao nível 3.",
    reward: { morale: 3, health: 2 },
    check: (s) => s.shelter >= 3
  },
  {
    id: "hunter",
    title: "Caçador consistente",
    desc: "Tenha 3 caçadas bem-sucedidas.",
    reward: { food: 1, morale: 2 },
    check: (s) => s.counters.successfulHunts >= 3
  },
  {
    id: "engineer",
    title: "Engenheiro da gambiarra",
    desc: "Construa 3 itens de crafting.",
    reward: { scrap: 2, morale: 2 },
    check: (s) => s.counters.totalCrafts >= 3
  },
  {
    id: "barely_alive",
    title: "Por um fio",
    desc: "Chegue a 20 de saúde ou menos e continue vivo.",
    reward: { medkits: 1 },
    check: (s) => s.health <= 20 && !s.gameOver
  }
];

const QUEST_LIBRARY = {
  reach_day_5: {
    title: "Segure a barra",
    desc: "Chegue ao dia 5.",
    reward: { food: 2, water: 2 },
    check: (s) => s.day >= 5
  },
  shelter_2: {
    title: "Teto minimamente digno",
    desc: "Leve o abrigo ao nível 2.",
    reward: { medkits: 1, morale: 4 },
    check: (s) => s.shelter >= 2
  },
  hunt_2: {
    title: "Proteína com esforço",
    desc: "Tenha 2 caçadas bem-sucedidas.",
    reward: { food: 2, morale: 3 },
    check: (s) => s.counters.successfulHunts >= 2
  },
  craft_2: {
    title: "Improviso profissional",
    desc: "Faça 2 receitas de crafting.",
    reward: { scrap: 2, fiber: 2 },
    check: (s) => s.counters.totalCrafts >= 2
  },
  fire_2: {
    title: "Calor estratégico",
    desc: "Leve a fogueira ao nível 2.",
    reward: { morale: 4, health: 2 },
    check: (s) => s.fire >= 2
  },
  canteen: {
    title: "Armazenamento decente",
    desc: "Construa um cantil improvisado.",
    reward: { water: 2, morale: 2 },
    check: (s) => s.crafted.canteen
  }
};

const els = {
  difficulty: document.getElementById("difficulty"),
  biome: document.getElementById("biome"),
  saveSlot: document.getElementById("saveSlot"),

  newGameBtn: document.getElementById("newGameBtn"),
  loadSlotBtn: document.getElementById("loadSlotBtn"),
  saveToSlotBtn: document.getElementById("saveToSlotBtn"),
  clearSlotBtn: document.getElementById("clearSlotBtn"),
  useMedkitBtn: document.getElementById("useMedkitBtn"),

  messageBox: document.getElementById("messageBox"),
  log: document.getElementById("log"),

  dayValue: document.getElementById("dayValue"),
  goalValue: document.getElementById("goalValue"),
  weatherValue: document.getElementById("weatherValue"),
  biomeValue: document.getElementById("biomeValue"),
  shelterValue: document.getElementById("shelterValue"),
  fireValue: document.getElementById("fireValue"),
  trapsValue: document.getElementById("trapsValue"),
  activeSlotValue: document.getElementById("activeSlotValue"),

  healthText: document.getElementById("healthText"),
  energyText: document.getElementById("energyText"),
  moraleText: document.getElementById("moraleText"),
  foodText: document.getElementById("foodText"),
  waterText: document.getElementById("waterText"),

  healthBar: document.getElementById("healthBar"),
  energyBar: document.getElementById("energyBar"),
  moraleBar: document.getElementById("moraleBar"),
  foodBar: document.getElementById("foodBar"),
  waterBar: document.getElementById("waterBar"),

  woodInvValue: document.getElementById("woodInvValue"),
  scrapInvValue: document.getElementById("scrapInvValue"),
  fiberInvValue: document.getElementById("fiberInvValue"),
  medkitsInvValue: document.getElementById("medkitsInvValue"),
  foodInvValue: document.getElementById("foodInvValue"),
  waterInvValue: document.getElementById("waterInvValue"),

  craftGrid: document.getElementById("craftGrid"),
  upgradeList: document.getElementById("upgradeList"),
  questList: document.getElementById("questList"),
  achievementList: document.getElementById("achievementList"),

  eventPanel: document.getElementById("eventPanel"),
  eventTitle: document.getElementById("eventTitle"),
  eventText: document.getElementById("eventText"),
  eventChoices: document.getElementById("eventChoices"),

  historyChart: document.getElementById("historyChart"),

  actionButtons: Array.from(document.querySelectorAll("[data-action]"))
};

let state = loadFromSlot("1") || createInitialState("normal", "forest", "1");

function storageKey(slot) {
  return `${STORAGE_PREFIX}${slot}`;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getWeatherForBiome(biome) {
  return { ...pick(WEATHER_BY_BIOME[biome]) };
}

function biomeLabel(id) {
  return BIOMES[id]?.label || id;
}

function capFor(key) {
  if (key === "food") return state.crafted.smokeRack ? 15 : BASE_CAPS.food;
  if (key === "water") return state.crafted.canteen ? 14 : BASE_CAPS.water;
  return BASE_CAPS[key];
}

function createLog(title, text) {
  return { day: state ? state.day : 1, title, text };
}

function addLog(title, text) {
  state.logs.unshift(createLog(title, text));
  state.logs = state.logs.slice(0, 50);
}

function initialHistoryEntry(day, s) {
  return {
    day,
    health: s.health,
    energy: s.energy,
    morale: s.morale
  };
}

function buildQuestsForBiome(biome) {
  const ids = ["reach_day_5", "shelter_2", "craft_2"];

  if (biome === "forest") ids.push("hunt_2");
  if (biome === "desert") ids.push("canteen");
  if (biome === "tundra") ids.push("fire_2");

  return ids.map((id) => ({
    id,
    title: QUEST_LIBRARY[id].title,
    desc: QUEST_LIBRARY[id].desc,
    reward: QUEST_LIBRARY[id].reward,
    done: false
  }));
}

function createInitialState(difficulty = "normal", biome = "forest", saveSlot = "1") {
  const cfg = DIFFICULTY[difficulty];
  const biomeCfg = BIOMES[biome];

  const freshState = {
    difficulty,
    biome,
    saveSlot,
    day: 1,
    targetDays: cfg.targetDays,
    weather: getWeatherForBiome(biome),

    health: 100,
    energy: 80,
    morale: 70,
    food: 4,
    water: 4,
    wood: 2,
    scrap: 1,
    fiber: 1,
    shelter: 0,
    fire: 0,
    traps: 0,
    medkits: 1,

    crafted: {
      canteen: false,
      spear: false,
      purifier: false,
      bedroll: false,
      rainCollector: false,
      smokeRack: false
    },

    quests: buildQuestsForBiome(biome),

    achievements: ACHIEVEMENTS.reduce((acc, item) => {
      acc[item.id] = false;
      return acc;
    }, {}),

    counters: {
      successfulHunts: 0,
      totalCrafts: 0,
      eventsResolved: 0,
      turnsPlayed: 0
    },

    pendingEvent: null,
    gameOver: false,
    victory: false,

    message: "Escolha uma ação para iniciar a sobrevivência.",
    messageType: "neutral",

    logs: [
      {
        day: 1,
        title: "Início",
        text: `Você começou no bioma ${biomeCfg.label}. O ambiente já está calculando como te punir.`
      }
    ],

    history: []
  };

  applyBiomeStartModifiers(freshState);
  freshState.history.push(initialHistoryEntry(1, freshState));
  return freshState;
}

function applyBiomeStartModifiers(target) {
  const mods = BIOMES[target.biome].start;
  Object.entries(mods).forEach(([key, value]) => {
    const max = BASE_CAPS[key] || 999;
    target[key] = clamp(target[key] + value, 0, max);
  });
}

function setMessage(text, type = "neutral") {
  state.message = text;
  state.messageType = type;
}

function setStat(key, value) {
  state[key] = clamp(value, 0, capFor(key));
}

function changeStat(key, delta) {
  setStat(key, state[key] + delta);
}

function hasCost(cost) {
  return Object.entries(cost).every(([key, value]) => state[key] >= value);
}

function payCost(cost) {
  Object.entries(cost).forEach(([key, value]) => {
    changeStat(key, -value);
  });
}

function applyEffects(effects) {
  Object.entries(effects).forEach(([key, value]) => {
    if (Object.prototype.hasOwnProperty.call(BASE_CAPS, key) || key === "food" || key === "water") {
      changeStat(key, value);
    }
  });
}

function translateKey(key) {
  const map = {
    wood: "madeira",
    scrap: "sucata",
    fiber: "fibra",
    medkits: "kit",
    food: "comida",
    water: "água"
  };
  return map[key] || key;
}

function saveCurrentState() {
  localStorage.setItem(storageKey(state.saveSlot), JSON.stringify(state));
}

function saveToChosenSlot(slot) {
  state.saveSlot = slot;
  saveCurrentState();
}

function loadFromSlot(slot) {
  try {
    const raw = localStorage.getItem(storageKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    parsed.saveSlot = slot;
    return parsed;
  } catch {
    return null;
  }
}

function clearSlot(slot) {
  localStorage.removeItem(storageKey(slot));
}

function render() {
  els.difficulty.value = state.difficulty;
  els.biome.value = state.biome;
  els.saveSlot.value = state.saveSlot;

  els.dayValue.textContent = state.day;
  els.goalValue.textContent = state.targetDays;
  els.weatherValue.textContent = state.weather.name;
  els.biomeValue.textContent = biomeLabel(state.biome);
  els.shelterValue.textContent = state.shelter;
  els.fireValue.textContent = state.fire;
  els.trapsValue.textContent = state.traps;
  els.activeSlotValue.textContent = state.saveSlot;

  els.healthText.textContent = state.health;
  els.energyText.textContent = state.energy;
  els.moraleText.textContent = state.morale;
  els.foodText.textContent = state.food;
  els.waterText.textContent = state.water;

  els.healthBar.style.width = `${state.health}%`;
  els.energyBar.style.width = `${state.energy}%`;
  els.moraleBar.style.width = `${state.morale}%`;
  els.foodBar.style.width = `${(state.food / capFor("food")) * 100}%`;
  els.waterBar.style.width = `${(state.water / capFor("water")) * 100}%`;

  els.woodInvValue.textContent = state.wood;
  els.scrapInvValue.textContent = state.scrap;
  els.fiberInvValue.textContent = state.fiber;
  els.medkitsInvValue.textContent = state.medkits;
  els.foodInvValue.textContent = state.food;
  els.waterInvValue.textContent = state.water;

  els.messageBox.textContent = state.message;
  els.messageBox.className = "message";
  if (state.messageType === "good") els.messageBox.classList.add("good");
  if (state.messageType === "bad") els.messageBox.classList.add("bad");
  if (state.messageType === "warn") els.messageBox.classList.add("warn");

  const blocked = state.gameOver || !!state.pendingEvent;

  els.actionButtons.forEach((btn) => {
    btn.disabled = blocked;
  });

  els.useMedkitBtn.disabled = state.gameOver || state.medkits <= 0 || !!state.pendingEvent;
  els.newGameBtn.disabled = false;
  els.loadSlotBtn.disabled = false;
  els.saveToSlotBtn.disabled = false;
  els.clearSlotBtn.disabled = false;

  renderCraftGrid();
  renderUpgrades();
  renderQuests();
  renderAchievements();
  renderEventPanel();
  renderLog();
  drawHistoryChart();

  saveCurrentState();
}

function renderCraftGrid() {
  els.craftGrid.innerHTML = "";

  RECIPES.forEach((recipe) => {
    const btn = document.createElement("button");
    btn.className = "craft-btn";

    const alreadyOwned =
      !recipe.repeatable &&
      recipe.id !== "trap" &&
      recipe.id !== "medkit" &&
      state.crafted[recipe.id];

    const disabled = state.gameOver || !!state.pendingEvent || alreadyOwned || !hasCost(recipe.cost);
    btn.disabled = disabled;

    const costText = Object.entries(recipe.cost)
      .map(([k, v]) => `${translateKey(k)} ${v}`)
      .join(" • ");

    btn.innerHTML = `
      <span class="title">${recipe.label}</span>
      <span class="small">${recipe.description}</span>
      <span class="cost">Custo: ${costText}${alreadyOwned ? " • já construído" : ""}</span>
    `;

    btn.addEventListener("click", () => craftRecipe(recipe));
    els.craftGrid.appendChild(btn);
  });
}

function renderUpgrades() {
  els.upgradeList.innerHTML = "";

  Object.entries(UPGRADE_META).forEach(([id, name]) => {
    const span = document.createElement("span");
    span.className = `badge ${state.crafted[id] ? "active" : ""}`;
    span.textContent = state.crafted[id] ? `${name} ativo` : `${name} inativo`;
    els.upgradeList.appendChild(span);
  });
}

function renderQuests() {
  els.questList.innerHTML = "";

  state.quests.forEach((quest) => {
    const div = document.createElement("div");
    div.className = `quest-card ${quest.done ? "done" : ""}`;

    const rewardText = Object.entries(quest.reward)
      .map(([k, v]) => `${v} ${translateKey(k)}`)
      .join(" • ");

    div.innerHTML = `
      <strong>${quest.title}${quest.done ? " ✓" : ""}</strong>
      <small>${quest.desc}</small>
      <small>Recompensa: ${rewardText}</small>
    `;

    els.questList.appendChild(div);
  });
}

function renderAchievements() {
  els.achievementList.innerHTML = "";

  ACHIEVEMENTS.forEach((item) => {
    const unlocked = state.achievements[item.id];
    const div = document.createElement("div");
    div.className = `achievement-card ${unlocked ? "unlocked" : ""}`;

    div.innerHTML = `
      <strong>${item.title}${unlocked ? " ✓" : ""}</strong>
      <small>${item.desc}</small>
    `;

    els.achievementList.appendChild(div);
  });
}

function renderEventPanel() {
  if (!state.pendingEvent) {
    els.eventPanel.classList.add("hidden");
    return;
  }

  els.eventPanel.classList.remove("hidden");
  els.eventTitle.textContent = state.pendingEvent.title;
  els.eventText.textContent = state.pendingEvent.text;
  els.eventChoices.innerHTML = "";

  state.pendingEvent.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.innerHTML = `
      <strong>${option.label}</strong>
      <span>${option.description}</span>
    `;
    btn.addEventListener("click", () => resolvePendingEvent(index));
    els.eventChoices.appendChild(btn);
  });
}

function renderLog() {
  els.log.innerHTML = "";

  state.logs.forEach((item) => {
    const div = document.createElement("div");
    div.className = "log-item";
    div.innerHTML = `
      <small>Dia ${item.day} • ${item.title}</small>
      <div>${item.text}</div>
    `;
    els.log.appendChild(div);
  });
}

function drawHistoryChart() {
  const canvas = els.historyChart;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#0c1322";
  ctx.fillRect(0, 0, w, h);

  const pad = 30;
  const plotW = w - pad * 2;
  const plotH = h - pad * 2;

  ctx.strokeStyle = "rgba(140,160,210,0.15)";
  ctx.lineWidth = 1;

  for (let i = 0; i <= 4; i++) {
    const y = pad + (plotH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(w - pad, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(170,190,235,0.35)";
  ctx.beginPath();
  ctx.moveTo(pad, pad);
  ctx.lineTo(pad, h - pad);
  ctx.lineTo(w - pad, h - pad);
  ctx.stroke();

  ctx.fillStyle = "rgba(180,200,240,0.65)";
  ctx.font = "11px Arial";
  ctx.fillText("100", 6, pad + 4);
  ctx.fillText("0", 14, h - pad + 4);

  const data = state.history || [];
  if (data.length < 2) return;

  plotSeries(ctx, data.map((d) => d.health), "#ff6b6b", pad, plotW, plotH);
  plotSeries(ctx, data.map((d) => d.energy), "#ffbf5f", pad, plotW, plotH);
  plotSeries(ctx, data.map((d) => d.morale), "#43dd9e", pad, plotW, plotH);

  ctx.fillStyle = "rgba(180,200,240,0.65)";
  ctx.fillText(`D${data[0].day}`, pad - 4, h - 10);
  ctx.fillText(`D${data[data.length - 1].day}`, w - pad - 24, h - 10);
}

function plotSeries(ctx, values, color, pad, plotW, plotH) {
  const stepX = values.length > 1 ? plotW / (values.length - 1) : plotW;

  ctx.strokeStyle = color;
  ctx.lineWidth = 2.2;
  ctx.beginPath();

  values.forEach((value, index) => {
    const x = pad + stepX * index;
    const y = pad + plotH - (clamp(value, 0, 100) / 100) * plotH;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.stroke();
}

function recordHistoryPoint() {
  state.history.push({
    day: state.day,
    health: state.health,
    energy: state.energy,
    morale: state.morale
  });

  state.history = state.history.slice(-45);
}

function clampAll() {
  [
    "health",
    "energy",
    "morale",
    "food",
    "water",
    "wood",
    "scrap",
    "fiber",
    "shelter",
    "fire",
    "traps",
    "medkits"
  ].forEach((key) => {
    state[key] = clamp(state[key], 0, capFor(key));
  });
}

function checkQuestProgress() {
  state.quests.forEach((quest) => {
    if (quest.done) return;

    const def = QUEST_LIBRARY[quest.id];
    if (def.check(state)) {
      quest.done = true;
      applyEffects(quest.reward);
      addLog("Objetivo concluído", `${quest.title} concluído. Recompensa recebida.`);
      setMessage(`Objetivo concluído: ${quest.title}`, "good");
    }
  });
}

function checkAchievements() {
  ACHIEVEMENTS.forEach((item) => {
    if (state.achievements[item.id]) return;
    if (item.check(state)) {
      state.achievements[item.id] = true;
      applyEffects(item.reward);
      addLog("Conquista", `${item.title} desbloqueada.`);
      setMessage(`Conquista desbloqueada: ${item.title}`, "good");
    }
  });
}

function applyEndOfTurnCosts() {
  const cfg = DIFFICULTY[state.difficulty];
  const biomeCfg = BIOMES[state.biome];

  if (state.food > 0) {
    changeStat("food", -1);
  } else {
    changeStat("health", -10);
    changeStat("morale", -6);
    addLog("Fome", "Sem comida ao fim do turno. O corpo e a moral começaram a cobrar.");
  }

  if (state.water > 0) {
    changeStat("water", -1);
  } else {
    changeStat("health", -14);
    changeStat("energy", -8);
    addLog("Sede", "Sem água ao fim do turno. O jogo ficou mais cruel.");
  }

  if (state.weather.id === "heat" || state.weather.id === "sandstorm") {
    if (state.water > 0) {
      changeStat("water", -1);
      addLog("Clima seco", "O calor puxou consumo extra de água.");
    } else {
      changeStat("health", -4);
      changeStat("morale", -3);
    }
  }

  let drain = cfg.dailyDrain + state.weather.drain;

  if (state.biome === "desert") drain += 1;
  if (state.biome === "tundra") drain += 1;

  drain -= state.shelter * 2;
  drain -= state.fire;

  if (state.crafted.bedroll) drain -= 1;

  drain = Math.max(3, drain);
  changeStat("energy", -drain);

  if ((state.weather.id === "cold" || state.weather.id === "blizzard") && state.fire === 0 && state.shelter < 2) {
    changeStat("health", -7);
    changeStat("morale", -4);
    addLog("Frio brutal", "Sem fogo e sem abrigo decente, o frio fez o serviço dele.");
  }

  if ((state.weather.id === "rain" || state.weather.id === "snow") && state.crafted.rainCollector) {
    changeStat("water", 1);
    addLog("Coletor ativo", "Seu coletor transformou o clima ruim em +1 água.");
  }

  if (state.energy <= 10) {
    changeStat("health", -8);
    changeStat("morale", -4);
    addLog("Exaustão", "Você chegou perto do colapso físico. Nada ideal.");
  }

  if (state.fire > 0) {
    changeStat("fire", -1);
  }

  // pequeno bônus passivo da floresta
  if (state.biome === "forest" && biomeCfg.forageBonus > 0 && Math.random() < 0.12) {
    changeStat("fiber", 1);
    addLog("Ambiente favorável", "A floresta te entregou +1 fibra sem muito drama.");
  }
}

function maybeTriggerEvent() {
  const cfg = DIFFICULTY[state.difficulty];
  if (Math.random() > cfg.eventChance) return false;

  state.pendingEvent = buildContextualEvent();
  setMessage(`Evento: ${state.pendingEvent.title}`, "warn");
  return true;
}

function buildContextualEvent() {
  const events = [];

  // evento universal
  events.push(() => ({
    title: "Viajante mercador",
    text: "Um mercador exausto aparece. Ele ainda topa trocar alguma coisa antes de sumir no nada.",
    options: [
      {
        label: "Trocar 1 comida por 1 kit médico",
        description: "Negócio honesto, raridade estatística.",
        resolve() {
          if (state.food >= 1) {
            changeStat("food", -1);
            changeStat("medkits", 1);
            setMessage("A troca foi feita com sucesso.", "good");
            addLog("Viajante mercador", "Você trocou comida por um kit médico.");
          } else {
            setMessage("Você não tinha comida suficiente para a troca.", "bad");
            addLog("Viajante mercador", "Sem comida, sem negócio.");
          }
        }
      },
      {
        label: "Dispensar e manter distância",
        description: "Seguro, porém sem recompensa.",
        resolve() {
          changeStat("energy", 2);
          setMessage("Você evitou risco e preservou algum fôlego.", "warn");
          addLog("Viajante mercador", "Você preferiu não se envolver.");
        }
      }
    ]
  }));

  // floresta
  if (state.biome === "forest") {
    events.push(() => ({
      title: "Rastro de ervas",
      text: "Você encontra plantas medicinais entre raízes e lama.",
      options: [
        {
          label: "Coletar com calma",
          description: "Ganha 1 kit médico e perde 2 de energia.",
          resolve() {
            changeStat("medkits", 1);
            changeStat("energy", -2);
            setMessage("Você coletou ervas úteis.", "good");
            addLog("Rastro de ervas", "A floresta foi generosa: +1 kit médico.");
          }
        },
        {
          label: "Ignorar e seguir",
          description: "Ganha 2 de moral por evitar perder tempo.",
          resolve() {
            changeStat("morale", 2);
            setMessage("Você manteve o foco e seguiu.", "warn");
            addLog("Rastro de ervas", "Você preferiu não gastar tempo com coleta.");
          }
        }
      ]
    }));
  }

  // deserto
  if (state.biome === "desert") {
    events.push(() => ({
      title: "Carcaça metálica",
      text: "No meio do deserto, uma estrutura velha e enferrujada emerge da areia.",
      options: [
        {
          label: "Desmontar por peças",
          description: "Ganha 3 sucata, perde 3 de energia.",
          resolve() {
            changeStat("scrap", 3);
            changeStat("energy", -3);
            setMessage("Você arrancou material útil do esqueleto metálico.", "good");
            addLog("Carcaça metálica", "A sucata veio com esforço, mas veio.");
          }
        },
        {
          label: "Procurar sombra e poupar forças",
          description: "Ganha 4 de energia, perde 1 de moral.",
          resolve() {
            changeStat("energy", 4);
            changeStat("morale", -1);
            setMessage("Você escolheu não brigar com o sol.", "warn");
            addLog("Carcaça metálica", "Sem sucata, mas com mais energia para não derreter.");
          }
        }
      ]
    }));
  }

  // tundra
  if (state.biome === "tundra") {
    events.push(() => ({
      title: "Camada de gelo fino",
      text: "Um trecho de gelo pode esconder água ou esconder um tombo memorável.",
      options: [
        {
          label: "Quebrar com cuidado",
          description: "Ganha 2 água. Se tiver fogueira, ganha +1 água.",
          resolve() {
            changeStat("water", 2 + (state.fire > 0 ? 1 : 0));
            setMessage("Você conseguiu água do gelo.", "good");
            addLog("Camada de gelo fino", "Frio e paciência renderam água.");
          }
        },
        {
          label: "Atravessar rápido",
          description: "Perde 5 de saúde e 3 de moral.",
          resolve() {
            changeStat("health", -5);
            changeStat("morale", -3);
            setMessage("A pressa cobrou seu preço.", "bad");
            addLog("Camada de gelo fino", "O gelo e a pressa formaram uma dupla bem ruim.");
          }
        }
      ]
    }));
  }

  // evento condicionado ao clima
  if (state.weather.id === "storm" || state.weather.id === "sandstorm" || state.weather.id === "blizzard") {
    events.push(() => ({
      title: "Clima hostil",
      text: "O tempo virou de vez. Você pode gastar recurso agora para evitar parte do estrago.",
      options: [
        {
          label: "Reforçar o acampamento",
          description: "Perde 2 madeira e reduz dano.",
          resolve() {
            if (state.wood >= 2) {
              changeStat("wood", -2);
              changeStat("morale", 1);
              changeStat("energy", -2);
              setMessage("Você reforçou o acampamento a tempo.", "good");
              addLog("Clima hostil", "A madeira poupou prejuízo maior.");
            } else {
              changeStat("health", -5);
              changeStat("morale", -3);
              setMessage("Faltou madeira para um reforço decente.", "bad");
              addLog("Clima hostil", "Sem recurso, o clima venceu a negociação.");
            }
          }
        },
        {
          label: "Aguardar e suportar",
          description: "Perde 7 saúde e 4 moral.",
          resolve() {
            changeStat("health", -7);
            changeStat("morale", -4);
            setMessage("Você aguentou o tranco na marra.", "bad");
            addLog("Clima hostil", "Conservar recurso custou caro em carne e cabeça.");
          }
        }
      ]
    }));
  }

  // evento ligado a upgrades
  if (state.crafted.purifier || state.crafted.canteen) {
    events.push(() => ({
      title: "Poça suspeita",
      text: "Uma água ruim, mas abundante. Com preparo, vira chance. Sem preparo, vira erro clássico.",
      options: [
        {
          label: "Tratar e armazenar",
          description: "Ganha 3 água; com purificador, ganha +1.",
          resolve() {
            changeStat("water", 3 + (state.crafted.purifier ? 1 : 0));
            changeStat("energy", -2);
            setMessage("Você converteu risco em recurso.", "good");
            addLog("Poça suspeita", "Seu preparo evitou uma burrada hidratada.");
          }
        },
        {
          label: "Beber logo e seguir",
          description: "Ganha 2 água, perde 4 saúde.",
          resolve() {
            changeStat("water", 2);
            changeStat("health", -4);
            setMessage("Funcionou, mas de um jeito bem questionável.", "warn");
            addLog("Poça suspeita", "A água veio rápido. O preço veio junto.");
          }
        }
      ]
    }));
  }

  // evento universal hostil
  events.push(() => ({
    title: "Predador rondando",
    text: "Algo está circulando perto do acampamento. Dá para improvisar ou peitar.",
    options: [
      {
        label: "Puxar para a armadilha",
        description: "Se tiver armadilha, consome 1 e ganha 2 comida. Sem armadilha, perde 1 comida.",
        resolve() {
          if (state.traps > 0) {
            changeStat("traps", -1);
            changeStat("food", 2);
            setMessage("A armadilha resolveu o problema.", "good");
            addLog("Predador rondando", "Você trocou 1 armadilha por segurança e comida.");
          } else {
            changeStat("food", -1);
            changeStat("energy", -2);
            setMessage("Sem armadilha, você só perdeu suprimento e paciência.", "bad");
            addLog("Predador rondando", "Faltou preparo. Sobrou prejuízo.");
          }
        }
      },
      {
        label: "Enfrentar diretamente",
        description: "Perde 6 energia e 3 saúde.",
        resolve() {
          changeStat("energy", -6);
          changeStat("health", -3);
          setMessage("Você espantou a ameaça, mas doeu.", "bad");
          addLog("Predador rondando", "Funcionou, mas nada de graça sobrevive neste jogo.");
        }
      }
    ]
  }));

  return pick(events)();
}

function resolvePendingEvent(optionIndex) {
  if (!state.pendingEvent) return;

  const option = state.pendingEvent.options[optionIndex];
  option.resolve();

  state.counters.eventsResolved += 1;
  state.pendingEvent = null;

  clampAll();
  checkQuestProgress();
  checkAchievements();
  finalizeTurn();
}

function checkEndState() {
  if (state.health <= 0) {
    state.gameOver = true;
    state.victory = false;
    setMessage("Derrota: sua saúde chegou a zero.", "bad");
    addLog("Fim", "Seu corpo desistiu antes da meta.");
    return true;
  }

  if (state.morale <= 0) {
    state.gameOver = true;
    state.victory = false;
    setMessage("Derrota: sua moral chegou a zero.", "bad");
    addLog("Fim", "Sem vontade de continuar, o resto caiu junto.");
    return true;
  }

  if (state.day >= state.targetDays) {
    state.gameOver = true;
    state.victory = true;
    setMessage(`Vitória: você sobreviveu até o dia ${state.targetDays}.`, "good");
    addLog("Vitória", "Você venceu o sistema, ao menos por enquanto.");
    return true;
  }

  return false;
}

function finalizeTurn() {
  clampAll();
  checkQuestProgress();
  checkAchievements();
  clampAll();

  if (checkEndState()) {
    render();
    return;
  }

  state.day += 1;
  state.counters.turnsPlayed += 1;
  state.weather = getWeatherForBiome(state.biome);
  recordHistoryPoint();

  render();
}

function advanceTurnFlow() {
  applyEndOfTurnCosts();
  clampAll();
  checkQuestProgress();
  checkAchievements();
  clampAll();

  if (checkEndState()) {
    render();
    return;
  }

  const triggered = maybeTriggerEvent();
  if (triggered) {
    render();
    return;
  }

  finalizeTurn();
}

function doAction(action) {
  if (state.gameOver || state.pendingEvent) return;

  const cfg = DIFFICULTY[state.difficulty];
  const biomeCfg = BIOMES[state.biome];

  switch (action) {
    case "rest": {
      let energyGain = 24;
      let moraleGain = 4;

      if (state.crafted.bedroll) {
        energyGain += 10;
        moraleGain += 2;
      }

      if (state.fire > 0) moraleGain += 2;
      if (state.shelter > 0) changeStat("health", 2);

      changeStat("energy", energyGain);
      changeStat("morale", moraleGain);

      setMessage("Você descansou e segurou a estrutura por mais um turno.", "good");
      addLog("Descansar", "Uma decisão humilde, mas extremamente profissional.");
      break;
    }

    case "water": {
      let gain = Math.max(1, randomInt(2, 4) + state.weather.waterBonus - cfg.scarcity + biomeCfg.waterBonus);

      if (state.crafted.canteen) gain += 1;
      if (state.crafted.purifier) gain += 1;

      changeStat("water", gain);
      changeStat("energy", -(10 + cfg.scarcity));
      changeStat("morale", -1);

      setMessage(`Você conseguiu +${gain} de água.`, "good");
      addLog("Buscar água", `As reservas subiram em +${gain}.`);
      break;
    }

    case "hunt": {
      let successChance =
        0.54 +
        (state.traps * 0.06) +
        state.weather.huntMod +
        biomeCfg.huntBonus -
        (cfg.scarcity * 0.05);

      if (state.crafted.spear) successChance += 0.12;
      successChance = clamp(successChance, 0.20, 0.92);

      changeStat("energy", -(14 + cfg.scarcity));

      if (Math.random() <= successChance) {
        let gain = Math.max(1, randomInt(2, 4) - cfg.scarcity);
        if (state.crafted.smokeRack) gain += 1;

        changeStat("food", gain);
        changeStat("morale", 4);
        state.counters.successfulHunts += 1;

        setMessage(`Caçada bem-sucedida: +${gain} comida.`, "good");
        addLog("Caçar", "Você conseguiu transformar esforço em proteína.");
      } else {
        const healthLoss = state.crafted.spear ? -4 : -7;
        changeStat("health", healthLoss);
        changeStat("morale", -3);

        setMessage("A caçada falhou e cobrou seu imposto.", "bad");
        addLog("Caçar", "Nada de comida. Só desgaste e dignidade em baixa.");
      }
      break;
    }

    case "wood": {
      const woodGain = Math.max(1, randomInt(2, 4) - Math.floor(cfg.scarcity / 2));
      const gotScrap = Math.random() < 0.35;
      const gotFiber = Math.random() < (state.biome === "forest" ? 0.5 : 0.25);

      changeStat("wood", woodGain);
      changeStat("energy", -(9 + cfg.scarcity));

      if (gotScrap) changeStat("scrap", 1);
      if (gotFiber) changeStat("fiber", 1);

      setMessage(`Você coletou +${woodGain} madeira.`, "good");
      addLog("Coletar madeira", `A coleta rendeu ${woodGain} madeira${gotScrap ? ", +1 sucata" : ""}${gotFiber ? ", +1 fibra" : ""}.`);
      break;
    }

    case "forage": {
      const foodGain = Math.max(1, randomInt(1, 3) + biomeCfg.forageBonus - Math.floor(cfg.scarcity / 2));
      const fiberGain = randomInt(1, state.biome === "forest" ? 3 : 2);

      changeStat("food", foodGain);
      changeStat("fiber", fiberGain);
      changeStat("energy", -(8 + cfg.scarcity));

      setMessage(`Você conseguiu +${foodGain} comida e +${fiberGain} fibra.`, "good");
      addLog("Forragear", "Pouco glamour, boa utilidade.");
      break;
    }

    case "explore": {
      changeStat("energy", -(16 + cfg.scarcity));

      const outcomes = [
        () => {
          changeStat("scrap", 2);
          changeStat("wood", 1);
          setMessage("A exploração rendeu materiais úteis.", "good");
          addLog("Explorar", "Você encontrou restos reaproveitáveis.");
        },
        () => {
          changeStat("medkits", 1);
          changeStat("morale", 2);
          setMessage("Você encontrou suprimentos abandonados.", "good");
          addLog("Explorar", "O caos deixou uma pequena vantagem para trás.");
        },
        () => {
          changeStat("food", 1);
          changeStat("water", 1);
          changeStat("fiber", 1);
          setMessage("A exploração foi produtiva.", "good");
          addLog("Explorar", "Um pouco de tudo. Evento raro e civilizado.");
        },
        () => {
          changeStat("health", -8);
          changeStat("morale", -3);
          setMessage("A exploração terminou em acidente.", "bad");
          addLog("Explorar", "O mapa não assinou contrato de segurança.");
        },
        () => {
          changeStat("morale", 5);
          changeStat("energy", -2);
          setMessage("Você encontrou um local menos hostil por alguns minutos.", "good");
          addLog("Explorar", "Às vezes, esperança também é recurso.");
        }
      ];

      pick(outcomes)();
      break;
    }

    case "buildShelter": {
      if (state.shelter >= BASE_CAPS.shelter) {
        changeStat("morale", -2);
        setMessage("Seu abrigo já está no nível máximo.", "bad");
        addLog("Melhorar abrigo", "Você tentou construir além do limite. Bravura inútil.");
        render();
        return;
      }

      const cost = { wood: 4, fiber: 1 };
      if (!hasCost(cost)) {
        changeStat("energy", -3);
        changeStat("morale", -4);
        setMessage("Faltam recursos para melhorar o abrigo.", "bad");
        addLog("Melhorar abrigo", "A ideia era boa. O estoque discordou.");
        advanceTurnFlow();
        return;
      }

      payCost(cost);
      changeStat("shelter", 1);
      changeStat("morale", 5);
      changeStat("health", 2);

      setMessage("Abrigo melhorado com sucesso.", "good");
      addLog("Melhorar abrigo", `Seu abrigo agora está no nível ${state.shelter}.`);
      break;
    }

    case "lightFire": {
      if (state.fire >= BASE_CAPS.fire) {
        changeStat("morale", -1);
        setMessage("A fogueira já está no máximo.", "bad");
        addLog("Acender fogueira", "Mais fogo que isso vira outro tipo de problema.");
        render();
        return;
      }

      const cost = { wood: 2 };
      if (!hasCost(cost)) {
        changeStat("morale", -2);
        setMessage("Falta madeira para acender a fogueira.", "bad");
        addLog("Acender fogueira", "Sem madeira, sem calor, sem milagre.");
        advanceTurnFlow();
        return;
      }

      payCost(cost);
      changeStat("fire", 1);
      changeStat("morale", 3);

      setMessage("Você acendeu a fogueira.", "good");
      addLog("Acender fogueira", `A fogueira subiu para nível ${state.fire}.`);
      break;
    }

    default:
      return;
  }

  advanceTurnFlow();
}

function craftRecipe(recipe) {
  if (state.gameOver || state.pendingEvent) return;

  const alreadyOwned =
    !recipe.repeatable &&
    recipe.id !== "trap" &&
    recipe.id !== "medkit" &&
    state.crafted[recipe.id];

  if (alreadyOwned) {
    setMessage("Esse upgrade já foi construído.", "bad");
    render();
    return;
  }

  if (!hasCost(recipe.cost)) {
    setMessage("Faltam recursos para essa receita.", "bad");
    render();
    return;
  }

  payCost(recipe.cost);
  state.counters.totalCrafts += 1;

  switch (recipe.id) {
    case "trap":
      changeStat("traps", 1);
      setMessage("Você montou uma armadilha.", "good");
      addLog("Crafting", "Uma nova armadilha foi montada.");
      break;

    case "medkit":
      changeStat("medkits", 1);
      setMessage("Você improvisou um kit médico.", "good");
      addLog("Crafting", "Gambiarra médica concluída com sucesso duvidoso.");
      break;

    default:
      state.crafted[recipe.id] = true;
      setMessage(`${recipe.label} construído com sucesso.`, "good");
      addLog("Crafting", `${recipe.label} foi adicionado ao acampamento.`);
      break;
  }

  advanceTurnFlow();
}

function useMedkit() {
  if (state.gameOver || state.pendingEvent || state.medkits <= 0) return;

  changeStat("medkits", -1);
  changeStat("health", 22);
  changeStat("morale", 3);

  setMessage("Você usou um kit médico e estabilizou a situação.", "good");
  addLog("Kit médico", "Curativos, improviso e mais um dia ganho.");
  checkQuestProgress();
  checkAchievements();
  render();
}

function newGame() {
  const difficulty = els.difficulty.value;
  const biome = els.biome.value;
  const slot = els.saveSlot.value;

  state = createInitialState(difficulty, biome, slot);
  render();
}

function loadSelectedSlot() {
  const slot = els.saveSlot.value;
  const loaded = loadFromSlot(slot);

  if (loaded) {
    state = loaded;
    setMessage(`Slot ${slot} carregado.`, "good");
  } else {
    state = createInitialState(els.difficulty.value, els.biome.value, slot);
    setMessage(`Slot ${slot} estava vazio. Novo jogo criado.`, "warn");
  }

  render();
}

function saveSelectedSlot() {
  const slot = els.saveSlot.value;
  saveToChosenSlot(slot);
  setMessage(`Jogo salvo no slot ${slot}.`, "good");
  render();
}

function clearSelectedSlot() {
  const slot = els.saveSlot.value;
  clearSlot(slot);

  if (state.saveSlot === slot) {
    state = createInitialState(els.difficulty.value, els.biome.value, slot);
    setMessage(`Slot ${slot} limpo. Novo estado criado.`, "warn");
  } else {
    setMessage(`Slot ${slot} foi limpo.`, "warn");
  }

  render();
}

els.actionButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    doAction(btn.dataset.action);
  });
});

els.useMedkitBtn.addEventListener("click", useMedkit);
els.newGameBtn.addEventListener("click", newGame);
els.loadSlotBtn.addEventListener("click", loadSelectedSlot);
els.saveToSlotBtn.addEventListener("click", saveSelectedSlot);
els.clearSlotBtn.addEventListener("click", clearSelectedSlot);

render();