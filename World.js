/*
Life Unlocked — world.js
Master World / Life Simulation Controller
Version: World 1.0 foundation

This file owns shared life systems:
- Character profile
- Bellmont master clock and calendar
- Personal account and savings
- Career funds + business-location operating balances
- Needs, happiness, quality of life
- Personal skills and hobbies
- Relationships / persistent NPCs
- Bellmont reputation and influence
- Life events, holidays, reminders, and notifications
- Parallel background life activities
- Transportation / current location
- Life history
- Autosave and save migration

Career-specific gameplay (cafe orders, hotel rooms, employees, machines, supplies,
career XP, etc.) belongs in the career files, not here.
*/

(function () {
  "use strict";

  const STORAGE_KEY = "lifeUnlockedWorldSave";
  const WORLD_VERSION = 1;

  const MONTHS = [
    { name: "January", days: 31 },
    { name: "February", days: 28 },
    { name: "March", days: 31 },
    { name: "April", days: 30 },
    { name: "May", days: 31 },
    { name: "June", days: 30 },
    { name: "July", days: 31 },
    { name: "August", days: 31 },
    { name: "September", days: 30 },
    { name: "October", days: 31 },
    { name: "November", days: 30 },
    { name: "December", days: 31 }
  ];

  const WEEKDAYS = [
    "Monday", "Tuesday", "Wednesday", "Thursday",
    "Friday", "Saturday", "Sunday"
  ];

  const NEED_KEYS = ["hunger", "energy", "hygiene", "bathroom", "happiness"];

  const SKILL_KEYS = [
    "cooking",
    "fitness",
    "knowledge",
    "creativity",
    "music",
    "gardening",
    "socialConfidence"
  ];

  const DEFAULT_STATE = {
    version: WORLD_VERSION,

    firstLaunch: true,
    welcomeSeen: false,
    characterCreated: false,

    character: {
      id: "",
      name: "",
      age: 18,
      birthdayMonth: 3,
      birthdayDay: 1,
      gender: "",
      customGender: "",
      appearance: {
        skinTone: "",
        hairLength: "",
        hairStyle: "",
        hairColor: "",
        eyeColor: "",
        bodyShape: "",
        clothingStyle: ""
      },
      relationshipPreferences: {
        sexuality: "Prefer Not to Say",
        interestedIn: "Open to Anyone",
        relationshipStatus: "Single",
        goal: "Stay Single for Now"
      },
      currentHomeId: "willowmereStarterApartment"
    },

    clock: {
      year: 1,
      month: 3,
      day: 1,
      weekdayIndex: 0,
      hour: 8,
      minute: 0,
      dayEnded: false
    },

    location: {
      area: "Willowmere Square",
      place: "Willowmere Starter Apartment"
    },

    money: {
      personalAccount: 1000,
      savingsAccount: 0,
      transactions: []
    },

    careers: {},

    needs: {
      hunger: 85,
      energy: 90,
      hygiene: 90,
      bathroom: 90,
      happiness: 75
    },

    qualityOfLife: {
      score: 50,
      label: "Stable"
    },

    body: {
      fitnessProgress: 0,
      longTermWeightTrend: 0,
      description: "No major changes yet"
    },

    skills: {
      cooking: { level: 1, xp: 0 },
      fitness: { level: 1, xp: 0 },
      knowledge: { level: 1, xp: 0 },
      creativity: { level: 1, xp: 0 },
      music: { level: 1, xp: 0 },
      gardening: { level: 1, xp: 0 },
      socialConfidence: { level: 1, xp: 0 }
    },

    hobbies: {
      favorite: [],
      activityCounts: {}
    },

    relationships: {
      npcs: {},
      encounterHistory: []
    },

    bellmontStanding: {
      reputation: 0,
      influence: 0
    },

    events: {
      upcoming: [],
      active: [],
      resolved: [],
      generatedKeys: {}
    },

    reminders: [],

    notifications: {
      queue: [],
      history: []
    },

    backgroundActivities: [],

    lifeHistory: [],

    settings: {
      showChoiceConsequences: true,
      backgroundLifeSimulation: true,
      backgroundNotifications: "Normal",
      browserNotificationsEnabled: false,
      worldTutorialSeen: false,
      detailedNeeds: false,
      worldTimeSpeed: "normal"
    },

    statistics: {
      daysLived: 0,
      eventsAttended: 0,
      eventsMissed: 0,
      friendshipsMade: 0,
      relationshipsStarted: 0,
      careersEntered: 0,
      businessesOwned: 0
    },

    lastSavedAt: null
  };

  let state = deepClone(DEFAULT_STATE);

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function isObject(value) {
    return value && typeof value === "object" && !Array.isArray(value);
  }

  function deepMerge(defaultValue, savedValue) {
    if (Array.isArray(defaultValue)) {
      return Array.isArray(savedValue) ? savedValue : deepClone(defaultValue);
    }

    if (!isObject(defaultValue)) {
      return savedValue === undefined ? defaultValue : savedValue;
    }

    const result = {};
    const savedObject = isObject(savedValue) ? savedValue : {};

    Object.keys(defaultValue).forEach((key) => {
      result[key] = deepMerge(defaultValue[key], savedObject[key]);
    });

    Object.keys(savedObject).forEach((key) => {
      if (!(key in result)) {
        result[key] = savedObject[key];
      }
    });

    return result;
  }

  function clamp(number, min, max) {
    return Math.max(min, Math.min(max, number));
  }

  function roundMoney(number) {
    return Math.round((Number(number) || 0) * 100) / 100;
  }

  function makeId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  function normalizeName(name) {
    return String(name || "").trim();
  }

  function dispatchWorldEvent(name, detail) {
    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
      window.dispatchEvent(new CustomEvent(`lifeunlocked:${name}`, { detail }));
    }
  }

  function autosave(reason) {
    state.lastSavedAt = new Date().toISOString();
    save();
    dispatchWorldEvent("autosave", { reason: reason || "world-change", state: getState() });
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      console.error("Life Unlocked world save failed:", error);
      return false;
    }
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        state = deepClone(DEFAULT_STATE);
        return getState();
      }

      const saved = JSON.parse(raw);
      state = deepMerge(DEFAULT_STATE, saved);
      state.version = WORLD_VERSION;
      return getState();
    } catch (error) {
      console.error("Life Unlocked world load failed:", error);
      state = deepClone(DEFAULT_STATE);
      return getState();
    }
  }

  function resetWorld() {
    state = deepClone(DEFAULT_STATE);
    autosave("reset-world");
    return getState();
  }

  function getState() {
    return deepClone(state);
  }

  function createCharacter(profile) {
    const incoming = profile || {};
    const name = normalizeName(incoming.name);

    if (!name) {
      return { ok: false, message: "Please enter a character name." };
    }

    const age = clamp(Number(incoming.age) || 18, 18, 65);

    state.character = deepMerge(state.character, {
      id: state.character.id || makeId("player"),
      name,
      age,
      birthdayMonth: clamp(Number(incoming.birthdayMonth) || 3, 1, 12),
      birthdayDay: clamp(Number(incoming.birthdayDay) || 1, 1, 31),
      gender: incoming.gender || "",
      customGender: incoming.customGender || "",
      appearance: incoming.appearance || {},
      relationshipPreferences: incoming.relationshipPreferences || {}
    });

    state.characterCreated = true;
    state.firstLaunch = false;

    addLifeHistory(`Created ${name} and began a new life in Bellmont.`);
    queueNotification(
      `Welcome to Bellmont, ${name}. Your life begins at the Willowmere Starter Apartment.`,
      "important",
      "world"
    );

    autosave("character-created");
    return { ok: true, character: deepClone(state.character) };
  }

  function markWelcomeSeen() {
    state.welcomeSeen = true;
    autosave("welcome-seen");
  }

  function updateCharacterProfile(changes) {
    state.character = deepMerge(state.character, changes || {});
    autosave("character-profile-updated");
    return deepClone(state.character);
  }

  function getMonthInfo(monthNumber) {
    return MONTHS[clamp(monthNumber, 1, 12) - 1];
  }

  function formatTime(hour, minute) {
    const h = ((hour % 24) + 24) % 24;
    const m = clamp(minute, 0, 59);
    const suffix = h >= 12 ? "PM" : "AM";
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    return `${displayHour}:${String(m).padStart(2, "0")} ${suffix}`;
  }

  function getDateLabel() {
    const month = getMonthInfo(state.clock.month);
    return `${WEEKDAYS[state.clock.weekdayIndex]}, ${month.name} ${state.clock.day}, Year ${state.clock.year}`;
  }

  function getDateTimeLabel() {
    return `${getDateLabel()} — ${formatTime(state.clock.hour, state.clock.minute)}`;
  }

  function getDayPart() {
    const h = state.clock.hour;
    if (h >= 5 && h < 12) return "Morning";
    if (h >= 12 && h < 17) return "Afternoon";
    if (h >= 17 && h < 22) return "Evening";
    return "Night";
  }

  function minutesFromClock(clock) {
    return clock.hour * 60 + clock.minute;
  }

  function advanceDateOneDay() {
    state.clock.day += 1;
    state.clock.weekdayIndex = (state.clock.weekdayIndex + 1) % 7;
    state.statistics.daysLived += 1;

    const monthInfo = getMonthInfo(state.clock.month);

    if (state.clock.day > monthInfo.days) {
      state.clock.day = 1;
      state.clock.month += 1;

      if (state.clock.month > 12) {
        state.clock.month = 1;
        state.clock.year += 1;
      }
    }

    handleBirthdayIfNeeded();
  }

  function advanceTime(minutes, options) {
    const opts = options || {};
    let remaining = Math.max(0, Math.round(Number(minutes) || 0));

    if (remaining === 0) {
      return { ok: true, minutesAdvanced: 0, clock: deepClone(state.clock) };
    }

    const startStamp = getDateTimeLabel();

    while (remaining > 0) {
      const currentMinuteOfDay = minutesFromClock(state.clock);
      const minutesUntilMidnight = 1440 - currentMinuteOfDay;
      const step = Math.min(remaining, minutesUntilMidnight);

      state.clock.minute += step;

      if (state.clock.minute >= 60) {
        state.clock.hour += Math.floor(state.clock.minute / 60);
        state.clock.minute %= 60;
      }

      remaining -= step;

      if (state.clock.hour >= 24) {
        state.clock.hour = 0;
        state.clock.minute = 0;
        advanceDateOneDay();
      }

      progressBackgroundActivities(step);
      updateNeedsFromTime(step);
      checkScheduledEvents();
      updateReminders();
    }

    updateQualityOfLife();

    if (!opts.silent) {
      queueNotification(
        `Bellmont time advanced from ${startStamp} to ${getDateTimeLabel()}.`,
        "normal",
        "time"
      );
    }

    autosave(opts.reason || "time-advanced");

    return {
      ok: true,
      minutesAdvanced: Math.max(0, Math.round(Number(minutes) || 0)),
      clock: deepClone(state.clock)
    };
  }

  function canSleep() {
    const minutes = minutesFromClock(state.clock);
    const earliestSleep = 18 * 60;
    const veryLowEnergy = state.needs.energy <= 20;

    if (minutes >= earliestSleep || veryLowEnergy) {
      return { ok: true };
    }

    return {
      ok: false,
      message: "It is still too early to end the day. Take a nap or continue your day first."
    };
  }

  function goToSleep() {
    const check = canSleep();
    if (!check.ok) return check;

    state.clock.dayEnded = true;

    advanceDateOneDay();
    state.clock.hour = 8;
    state.clock.minute = 0;
    state.clock.dayEnded = false;

    state.needs.energy = 100;
    state.needs.happiness = clamp(state.needs.happiness + 2, 0, 100);
    state.needs.hunger = clamp(state.needs.hunger - 8, 0, 100);
    state.needs.hygiene = clamp(state.needs.hygiene - 4, 0, 100);
    state.needs.bathroom = clamp(state.needs.bathroom - 8, 0, 100);

    checkScheduledEvents();
    updateReminders();

    queueNotification(
      `Good morning. It is now ${getDateTimeLabel()}.`,
      "important",
      "time"
    );

    autosave("sleep");
    return { ok: true, clock: deepClone(state.clock) };
  }

  function handleBirthdayIfNeeded() {
    if (
      state.clock.month === state.character.birthdayMonth &&
      state.clock.day === state.character.birthdayDay &&
      state.characterCreated
    ) {
      state.character.age += 1;
      addLifeHistory(`${state.character.name} turned ${state.character.age}.`);
      queueNotification(
        `Birthday today! ${state.character.name} is now ${state.character.age} years old.`,
        "important",
        "birthday"
      );

      if (state.character.age === 65) {
        queueNotification(
          "Retirement is now available. You may continue working, retire, or decide later.",
          "important",
          "career"
        );
      }
    }
  }

  function recordTransaction(type, amount, description, category, account) {
    state.money.transactions.unshift({
      id: makeId("txn"),
      type,
      amount: roundMoney(amount),
      description: description || "",
      category: category || "Other",
      account: account || "Personal Account",
      dateTime: getDateTimeLabel()
    });

    if (state.money.transactions.length > 500) {
      state.money.transactions.length = 500;
    }
  }

  function addPersonalMoney(amount, description, category) {
    const value = roundMoney(Math.max(0, Number(amount) || 0));
    state.money.personalAccount = roundMoney(state.money.personalAccount + value);
    recordTransaction("income", value, description || "Personal income", category || "Income", "Personal Account");
    autosave("personal-income");
    return state.money.personalAccount;
  }

  function spendPersonalMoney(amount, description, category) {
    const value = roundMoney(Math.max(0, Number(amount) || 0));

    if (state.money.personalAccount < value) {
      return {
        ok: false,
        message: `You need ${value} coins, but your Personal Account has ${state.money.personalAccount}.`
      };
    }

    state.money.personalAccount = roundMoney(state.money.personalAccount - value);
    recordTransaction("spending", -value, description || "Personal spending", category || "Spending", "Personal Account");
    autosave("personal-spending");

    return { ok: true, balance: state.money.personalAccount };
  }

  function transferToSavings(amount) {
    const value = roundMoney(Math.max(0, Number(amount) || 0));

    if (state.money.personalAccount < value) {
      return { ok: false, message: "Not enough money in the Personal Account." };
    }

    state.money.personalAccount = roundMoney(state.money.personalAccount - value);
    state.money.savingsAccount = roundMoney(state.money.savingsAccount + value);

    recordTransaction("transfer", -value, "Transfer to Savings", "Transfer", "Personal Account");
    recordTransaction("transfer", value, "Transfer from Personal Account", "Transfer", "Savings Account");

    autosave("transfer-to-savings");
    return { ok: true };
  }

  function transferFromSavings(amount) {
    const value = roundMoney(Math.max(0, Number(amount) || 0));

    if (state.money.savingsAccount < value) {
      return { ok: false, message: "Not enough money in Savings." };
    }

    state.money.savingsAccount = roundMoney(state.money.savingsAccount - value);
    state.money.personalAccount = roundMoney(state.money.personalAccount + value);

    recordTransaction("transfer", -value, "Transfer to Personal Account", "Transfer", "Savings Account");
    recordTransaction("transfer", value, "Transfer from Savings", "Transfer", "Personal Account");

    autosave("transfer-from-savings");
    return { ok: true };
  }

  function getFinancialSummary() {
    return {
      personalAccount: state.money.personalAccount,
      savingsAccount: state.money.savingsAccount,
      totalPersonalWealth: roundMoney(state.money.personalAccount + state.money.savingsAccount),
      recentTransactions: deepClone(state.money.transactions.slice(0, 20))
    };
  }

  function ensureCareer(careerId, displayName) {
    const id = String(careerId || "").trim();
    if (!id) return null;

    if (!state.careers[id]) {
      state.careers[id] = {
        id,
        displayName: displayName || id,
        active: true,
        careerFunds: 0,
        defaultPersonalProfitPercent: 20,
        locations: {},
        history: [],
        enteredAt: getDateTimeLabel()
      };
      state.statistics.careersEntered += 1;
    }

    return state.careers[id];
  }

  function setCareerProfitSplit(careerId, personalPercent) {
    const career = ensureCareer(careerId, careerId);
    const percent = clamp(Math.round(Number(personalPercent) || 0), 0, 100);
    career.defaultPersonalProfitPercent = percent;
    autosave("career-profit-split");
    return {
      personalPercent: percent,
      businessPercent: 100 - percent
    };
  }

  function addCareerFunds(careerId, amount, note) {
    const career = ensureCareer(careerId, careerId);
    const value = roundMoney(Math.max(0, Number(amount) || 0));
    career.careerFunds = roundMoney(career.careerFunds + value);
    career.history.unshift({
      id: makeId("careerTxn"),
      type: "career-funds-added",
      amount: value,
      note: note || "",
      dateTime: getDateTimeLabel()
    });
    autosave("career-funds-added");
    return career.careerFunds;
  }

  function spendCareerFunds(careerId, amount, note) {
    const career = ensureCareer(careerId, careerId);
    const value = roundMoney(Math.max(0, Number(amount) || 0));

    if (career.careerFunds < value) {
      return { ok: false, message: `Not enough ${career.displayName} Career Funds.` };
    }

    career.careerFunds = roundMoney(career.careerFunds - value);
    career.history.unshift({
      id: makeId("careerTxn"),
      type: "career-funds-spent",
      amount: -value,
      note: note || "",
      dateTime: getDateTimeLabel()
    });

    autosave("career-funds-spent");
    return { ok: true, balance: career.careerFunds };
  }

  function createBusinessLocation(careerId, locationData) {
    const career = ensureCareer(careerId, careerId);
    const incoming = locationData || {};
    const locationId = incoming.id || makeId(`${careerId}Location`);

    career.locations[locationId] = {
      id: locationId,
      name: incoming.name || `${career.displayName} Location`,
      area: incoming.area || "Bellmont",
      operatingBalance: roundMoney(Math.max(0, Number(incoming.operatingBalance) || 0)),
      owned: true,
      purchasedAt: getDateTimeLabel(),
      purchasePrice: roundMoney(Math.max(0, Number(incoming.purchasePrice) || 0)),
      metadata: incoming.metadata || {}
    };

    state.statistics.businessesOwned += 1;
    addLifeHistory(`Opened ${career.locations[locationId].name} in ${career.locations[locationId].area}.`);
    autosave("business-location-created");

    return deepClone(career.locations[locationId]);
  }

  function purchaseBusinessLocation(careerId, locationData, fundingSource) {
    const incoming = locationData || {};
    const price = roundMoney(Math.max(0, Number(incoming.purchasePrice) || 0));
    const source = fundingSource || "career";

    if (source === "career") {
      const result = spendCareerFunds(careerId, price, `Purchased ${incoming.name || "new location"}`);
      if (!result.ok) return result;
    } else if (source === "personal") {
      const result = spendPersonalMoney(price, `Purchased ${incoming.name || "new business"}`, "Business Purchase");
      if (!result.ok) return result;
    } else {
      return { ok: false, message: "Unknown business funding source." };
    }

    return {
      ok: true,
      location: createBusinessLocation(careerId, incoming)
    };
  }

  function addLocationOperatingFunds(careerId, locationId, amount, source) {
    const career = ensureCareer(careerId, careerId);
    const location = career.locations[locationId];

    if (!location || !location.owned) {
      return { ok: false, message: "Business location not found." };
    }

    const value = roundMoney(Math.max(0, Number(amount) || 0));
    const fundingSource = source || "career";

    if (fundingSource === "career") {
      const result = spendCareerFunds(careerId, value, `Funded ${location.name}`);
      if (!result.ok) return result;
    } else if (fundingSource === "personal") {
      const result = spendPersonalMoney(value, `Funded ${location.name}`, "Business Funding");
      if (!result.ok) return result;
    } else {
      return { ok: false, message: "Unknown funding source." };
    }

    location.operatingBalance = roundMoney(location.operatingBalance + value);
    autosave("location-operating-funds-added");
    return { ok: true, operatingBalance: location.operatingBalance };
  }

  function spendLocationOperatingFunds(careerId, locationId, amount, note) {
    const career = ensureCareer(careerId, careerId);
    const location = career.locations[locationId];

    if (!location || !location.owned) {
      return { ok: false, message: "Business location not found." };
    }

    const value = roundMoney(Math.max(0, Number(amount) || 0));

    if (location.operatingBalance < value) {
      return { ok: false, message: `${location.name} does not have enough operating funds.` };
    }

    location.operatingBalance = roundMoney(location.operatingBalance - value);
    career.history.unshift({
      id: makeId("careerTxn"),
      type: "location-expense",
      locationId,
      amount: -value,
      note: note || "",
      dateTime: getDateTimeLabel()
    });

    autosave("location-operating-expense");
    return { ok: true, operatingBalance: location.operatingBalance };
  }

  function distributeBusinessProfit(careerId, locationId, netProfit, personalPercentOverride) {
    const career = ensureCareer(careerId, careerId);
    const location = career.locations[locationId];

    if (!location || !location.owned) {
      return { ok: false, message: "Business location not found." };
    }

    const profit = roundMoney(Math.max(0, Number(netProfit) || 0));
    const personalPercent = clamp(
      personalPercentOverride === undefined
        ? career.defaultPersonalProfitPercent
        : Number(personalPercentOverride),
      0,
      100
    );

    const personalShare = roundMoney(profit * (personalPercent / 100));
    const businessShare = roundMoney(profit - personalShare);

    if (personalShare > 0) {
      addPersonalMoney(
        personalShare,
        `${career.displayName} Owner Pay — ${location.name}`,
        "Owner Pay"
      );
    }

    location.operatingBalance = roundMoney(location.operatingBalance + businessShare);

    career.history.unshift({
      id: makeId("careerTxn"),
      type: "profit-distribution",
      locationId,
      netProfit: profit,
      personalPercent,
      personalShare,
      businessShare,
      dateTime: getDateTimeLabel()
    });

    autosave("profit-distributed");

    return {
      ok: true,
      netProfit: profit,
      personalPercent,
      businessPercent: 100 - personalPercent,
      personalShare,
      businessShare
    };
  }

  function sellBusinessLocation(careerId, locationId, saleValue, options) {
    const opts = options || {};
    const career = ensureCareer(careerId, careerId);
    const location = career.locations[locationId];

    if (!location || !location.owned) {
      return { ok: false, message: "Business location not found." };
    }

    const value = roundMoney(Math.max(0, Number(saleValue) || 0));
    const remainingOperating = roundMoney(Math.max(0, location.operatingBalance));
    const finalExpenses = roundMoney(Math.max(0, Number(opts.finalExpenses) || 0));
    const settlement = roundMoney(Math.max(0, value + remainingOperating - finalExpenses));

    career.careerFunds = roundMoney(career.careerFunds + settlement);

    location.owned = false;
    location.soldAt = getDateTimeLabel();
    location.saleValue = value;
    location.operatingBalance = 0;

    career.history.unshift({
      id: makeId("careerTxn"),
      type: "location-sold",
      locationId,
      saleValue: value,
      remainingOperating,
      finalExpenses,
      settlementToCareerFunds: settlement,
      dateTime: getDateTimeLabel()
    });

    addLifeHistory(`Sold ${location.name}. The proceeds remained in ${career.displayName} Career Funds.`);
    autosave("business-location-sold");

    return {
      ok: true,
      settlement,
      careerFunds: career.careerFunds
    };
  }

  function exitCareerAndCashOut(careerId) {
    const career = ensureCareer(careerId, careerId);

    const stillOwned = Object.values(career.locations).filter((loc) => loc.owned);
    if (stillOwned.length > 0) {
      return {
        ok: false,
        message: "Sell or close all owned locations before cashing out of this career."
      };
    }

    const payout = roundMoney(Math.max(0, career.careerFunds));
    career.careerFunds = 0;
    career.active = false;
    career.exitedAt = getDateTimeLabel();

    if (payout > 0) {
      addPersonalMoney(payout, `${career.displayName} Career Cash-Out`, "Career Cash-Out");
    }

    addLifeHistory(`Left the ${career.displayName} career and transferred ${payout} coins to Personal Money.`);
    autosave("career-cashout");

    return { ok: true, payout };
  }

  function getCareerSummary(careerId) {
    const career = state.careers[careerId];
    return career ? deepClone(career) : null;
  }

  function updateNeedsFromTime(minutes) {
    const hours = Math.max(0, Number(minutes) || 0) / 60;

    state.needs.hunger = clamp(state.needs.hunger - (4 * hours), 0, 100);
    state.needs.energy = clamp(state.needs.energy - (3 * hours), 0, 100);
    state.needs.hygiene = clamp(state.needs.hygiene - (1.5 * hours), 0, 100);
    state.needs.bathroom = clamp(state.needs.bathroom - (3.5 * hours), 0, 100);

    if (
      state.needs.hunger < 25 ||
      state.needs.energy < 25 ||
      state.needs.hygiene < 20 ||
      state.needs.bathroom < 20
    ) {
      state.needs.happiness = clamp(state.needs.happiness - (1 * hours), 0, 100);
    }

    maybeQueueNeedReminders();
  }

  function adjustNeed(need, amount, reason) {
    if (!NEED_KEYS.includes(need)) {
      return { ok: false, message: "Unknown need." };
    }

    state.needs[need] = clamp(state.needs[need] + Number(amount || 0), 0, 100);

    if (reason) {
      queueNotification(reason, "normal", "needs");
    }

    autosave("need-adjusted");
    return { ok: true, value: state.needs[need] };
  }

  function getNeedLabel(value) {
    if (value >= 75) return "Good";
    if (value >= 50) return "Okay";
    if (value >= 30) return "Getting Low";
    if (value >= 15) return "Low";
    return "Very Low";
  }

  function getNeedsSummary() {
    const summary = {};
    NEED_KEYS.forEach((key) => {
      summary[key] = state.settings.detailedNeeds
        ? `${Math.round(state.needs[key])}%`
        : getNeedLabel(state.needs[key]);
    });
    return summary;
  }

  function maybeQueueNeedReminders() {
    const messages = {
      hunger: "Hunger is getting low. Consider having something to eat.",
      energy: "Energy is getting low. Consider resting, napping, or sleeping when appropriate.",
      hygiene: "Hygiene is getting low. A shower or bath may help.",
      bathroom: "Bathroom need is getting low. Consider using the bathroom."
    };

    Object.keys(messages).forEach((key) => {
      if (state.needs[key] <= 25) {
        addReminderOnce(`need-${key}`, messages[key], "needs");
      } else {
        removeReminderByKey(`need-${key}`);
      }
    });
  }

  function updateQualityOfLife() {
    const needsAverage =
      (state.needs.hunger +
        state.needs.energy +
        state.needs.hygiene +
        state.needs.bathroom +
        state.needs.happiness) / 5;

    const personalStability = state.money.personalAccount >= 500 ? 8 : state.money.personalAccount >= 100 ? 3 : -5;
    const savingsStability = state.money.savingsAccount >= 1000 ? 5 : 0;
    const relationshipBoost = countMeaningfulRelationships() * 1.5;

    state.qualityOfLife.score = clamp(
      Math.round((needsAverage * 0.65) + personalStability + savingsStability + relationshipBoost),
      0,
      100
    );

    const value = state.qualityOfLife.score;
    state.qualityOfLife.label =
      value >= 85 ? "Thriving" :
      value >= 70 ? "Comfortable" :
      value >= 50 ? "Stable" :
      value >= 30 ? "Strained" :
      "Difficult";
  }

  function xpNeededForSkillLevel(level) {
    return 100 + ((Math.max(1, level) - 1) * 75);
  }

  function addSkillXP(skill, amount, source) {
    if (!SKILL_KEYS.includes(skill)) {
      return { ok: false, message: "Unknown personal skill." };
    }

    const xpGain = Math.max(0, Math.round(Number(amount) || 0));
    const skillState = state.skills[skill];

    skillState.xp += xpGain;

    while (skillState.xp >= xpNeededForSkillLevel(skillState.level)) {
      skillState.xp -= xpNeededForSkillLevel(skillState.level);
      skillState.level += 1;

      queueNotification(
        `${formatSkillName(skill)} reached Level ${skillState.level}.`,
        "important",
        "skills"
      );

      addLifeHistory(`${state.character.name || "The player"} reached ${formatSkillName(skill)} Level ${skillState.level}.`);
    }

    if (source) {
      recordHobbyActivity(source);
    }

    autosave("skill-xp-added");
    return { ok: true, skill: deepClone(skillState) };
  }

  function formatSkillName(key) {
    const map = {
      cooking: "Cooking",
      fitness: "Fitness",
      knowledge: "Knowledge",
      creativity: "Creativity",
      music: "Music",
      gardening: "Gardening",
      socialConfidence: "Social Confidence"
    };
    return map[key] || key;
  }

  function recordHobbyActivity(activityName) {
    const key = String(activityName || "").trim();
    if (!key) return;

    state.hobbies.activityCounts[key] = (state.hobbies.activityCounts[key] || 0) + 1;

    if (
      state.hobbies.activityCounts[key] >= 8 &&
      !state.hobbies.favorite.includes(key)
    ) {
      state.hobbies.favorite.push(key);
      queueNotification(
        `Personal Discovery: ${key} has become one of ${state.character.name || "your character"}'s favorite hobbies.`,
        "normal",
        "hobby"
      );
    }
  }

  function startBackgroundActivity(activity) {
    const incoming = activity || {};
    const duration = Math.max(1, Math.round(Number(incoming.durationMinutes) || 0));

    if (!state.settings.backgroundLifeSimulation) {
      return { ok: false, message: "Background Life Simulation is turned off." };
    }

    const entry = {
      id: makeId("activity"),
      name: incoming.name || "Activity",
      remainingMinutes: duration,
      originalDurationMinutes: duration,
      skillRewards: incoming.skillRewards || {},
      needEffectsOnComplete: incoming.needEffectsOnComplete || {},
      happinessOnComplete: Number(incoming.happinessOnComplete) || 0,
      metadata: incoming.metadata || {},
      startedAt: getDateTimeLabel()
    };

    state.backgroundActivities.push(entry);

    queueNotification(
      `${entry.name} started in the background.`,
      "normal",
      "activity"
    );

    autosave("background-activity-started");
    return { ok: true, activity: deepClone(entry) };
  }

  function progressBackgroundActivities(minutes) {
    if (!state.settings.backgroundLifeSimulation) return;

    const completed = [];
    const delta = Math.max(0, Number(minutes) || 0);

    state.backgroundActivities.forEach((activity) => {
      activity.remainingMinutes = Math.max(0, activity.remainingMinutes - delta);
      if (activity.remainingMinutes <= 0) {
        completed.push(activity);
      }
    });

    completed.forEach((activity) => {
      completeBackgroundActivity(activity.id);
    });
  }

  function completeBackgroundActivity(activityId) {
    const index = state.backgroundActivities.findIndex((item) => item.id === activityId);
    if (index === -1) return { ok: false };

    const activity = state.backgroundActivities[index];

    Object.entries(activity.skillRewards || {}).forEach(([skill, xp]) => {
      if (SKILL_KEYS.includes(skill)) {
        addSkillXP(skill, xp, activity.name);
      }
    });

    Object.entries(activity.needEffectsOnComplete || {}).forEach(([need, amount]) => {
      if (NEED_KEYS.includes(need)) {
        state.needs[need] = clamp(state.needs[need] + Number(amount || 0), 0, 100);
      }
    });

    if (activity.happinessOnComplete) {
      state.needs.happiness = clamp(
        state.needs.happiness + activity.happinessOnComplete,
        0,
        100
      );
    }

    state.backgroundActivities.splice(index, 1);

    queueNotification(
      `Life Update: ${state.character.name || "Your character"} finished ${activity.name}.`,
      "normal",
      "activity"
    );

    autosave("background-activity-completed");
    return { ok: true, activity: deepClone(activity) };
  }

  const FIRST_NAMES = [
    "Aaliyah","Aaron","Abigail","Adrian","Aisha","Alex","Alexa","Amara","Amir","Andrea",
    "Anthony","Aria","Avery","Bailey","Benjamin","Bianca","Blake","Caleb","Cameron","Camila",
    "Carlos","Carmen","Charlotte","Chloe","Chris","Claire","Daniel","Darius","David","Delilah",
    "Elias","Elena","Elijah","Emerson","Emma","Ethan","Eva","Gabriel","Grace","Hailey",
    "Hannah","Harper","Hazel","Henry","Isabella","Isaiah","Jamal","James","Jasmine","Jason",
    "Jordan","Joseph","Josie","Kai","Kayla","Keira","Kennedy","Lena","Leo","Liam",
    "Lily","Lucas","Luis","Maya","Mia","Michael","Naomi","Natalie","Nathan","Nia",
    "Noah","Nora","Olivia","Omar","Parker","Priya","Quinn","Rafael","Riley","Ruby",
    "Samuel","Sofia","Sophia","Taylor","Theo","Tristan","Valentina","Victoria","Willow","Xavier",
    "Yara","Zachary","Zoe","Aiden","Alana","Amaya","Andre","Anika","Antonio","Ari",
    "Bella","Brianna","Cassidy","Cedric","Dahlia","Dante","Dominic","Eli","Esme","Felix",
    "Freya","Gianna","Hugo","Imani","Iris","Jade","Jonah","Julian","Kiana","Leila",
    "Lola","Marcus","Mateo","Mila","Nadia","Nico","Phoebe","Reese","Roman","Sabrina",
    "Sage","Sebastian","Sienna","Talia","Tessa","Vincent","Wesley","Zara","Zuri"
  ];

  const LAST_NAMES = [
    "Adams","Allen","Anderson","Bailey","Baker","Bell","Bennett","Brooks","Brown","Campbell",
    "Carter","Castillo","Chen","Clark","Coleman","Collins","Cooper","Cruz","Davis","Diaz",
    "Edwards","Evans","Foster","Garcia","Gomez","Gray","Green","Hall","Harris","Hayes",
    "Henderson","Hill","Howard","Jackson","James","Jenkins","Johnson","Jones","Khan","King",
    "Lee","Lewis","Lopez","Martin","Martinez","Miller","Mitchell","Moore","Morgan","Morris",
    "Murphy","Nelson","Nguyen","Ortiz","Parker","Patel","Perez","Phillips","Price","Ramirez",
    "Reed","Rivera","Roberts","Robinson","Rogers","Ross","Russell","Sanchez","Scott","Shah",
    "Singh","Smith","Stewart","Taylor","Thomas","Thompson","Torres","Turner","Walker","Ward",
    "Washington","Watson","White","Williams","Wilson","Wright","Young"
  ];

  const NPC_TRAITS = [
    "Friendly","Shy","Outgoing","Funny","Serious","Romantic","Independent",
    "Family-Oriented","Ambitious","Creative","Adventurous","Calm","Intellectual",
    "Spontaneous","Practical"
  ];

  const NPC_INTERESTS = [
    "Music","Cooking","Movies","Reading","Sports","Gaming","Art","Fashion","Travel",
    "Outdoors","Fitness","Animals","Food","Photography","Technology","Gardening",
    "History","Theatre","Community Events","Cars"
  ];

  function randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function sampleUnique(array, count) {
    const copy = array.slice();
    const result = [];
    while (copy.length && result.length < count) {
      const index = Math.floor(Math.random() * copy.length);
      result.push(copy.splice(index, 1)[0]);
    }
    return result;
  }

  function generateNPC(options) {
    const opts = options || {};
    let fullName = "";

    for (let attempts = 0; attempts < 25; attempts += 1) {
      fullName = `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`;
      const duplicate = Object.values(state.relationships.npcs).some((npc) => npc.name === fullName);
      if (!duplicate) break;
    }

    const id = makeId("npc");
    const npc = {
      id,
      name: opts.name || fullName,
      age: clamp(Number(opts.age) || (18 + Math.floor(Math.random() * 43)), 18, 80),
      gender: opts.gender || randomFrom(["Woman", "Man", "Nonbinary"]),
      occupation: opts.occupation || randomFrom([
        "Teacher","Nurse","Chef","Artist","Office Worker","Mechanic","Musician",
        "Retail Manager","Librarian","Designer","Technician","Accountant","Journalist",
        "Fitness Instructor","Photographer","City Employee"
      ]),
      traits: opts.traits || sampleUnique(NPC_TRAITS, 3),
      interests: opts.interests || sampleUnique(NPC_INTERESTS, 4),
      relationshipPreferences: opts.relationshipPreferences || "Open",
      familyGoals: opts.familyGoals || randomFrom([
        "Wants Children","Open to Children","Does Not Want Children","Undecided"
      ]),
      friendshipPoints: 0,
      romancePoints: 0,
      friendshipStage: "Stranger",
      romanceStage: "No Romance",
      currentStatus: "Available",
      discovered: {
        traits: false,
        interests: false,
        occupation: false,
        familyGoals: false
      },
      history: [],
      createdAt: getDateTimeLabel()
    };

    state.relationships.npcs[id] = npc;
    autosave("npc-generated");
    return deepClone(npc);
  }

  function friendshipStageFromPoints(points) {
    if (points >= 90) return "Best Friend";
    if (points >= 70) return "Close Friend";
    if (points >= 50) return "Good Friend";
    if (points >= 30) return "Friend";
    if (points >= 10) return "Acquaintance";
    return "Stranger";
  }

  function romanceStageFromPoints(points) {
    if (points >= 100) return "Married";
    if (points >= 85) return "Engaged";
    if (points >= 60) return "Partner";
    if (points >= 35) return "Dating";
    if (points >= 15) return "Romantic Interest";
    return "No Romance";
  }

  function adjustRelationship(npcId, changes, reason) {
    const npc = state.relationships.npcs[npcId];
    if (!npc) return { ok: false, message: "NPC not found." };

    const incoming = changes || {};
    npc.friendshipPoints = clamp(npc.friendshipPoints + Number(incoming.friendship || 0), 0, 100);
    npc.romancePoints = clamp(npc.romancePoints + Number(incoming.romance || 0), 0, 100);

    const previousFriendship = npc.friendshipStage;
    const previousRomance = npc.romanceStage;

    npc.friendshipStage = friendshipStageFromPoints(npc.friendshipPoints);
    npc.romanceStage = romanceStageFromPoints(npc.romancePoints);

    npc.history.unshift({
      dateTime: getDateTimeLabel(),
      friendshipChange: Number(incoming.friendship || 0),
      romanceChange: Number(incoming.romance || 0),
      reason: reason || ""
    });

    if (npc.friendshipStage !== previousFriendship) {
      queueNotification(
        `Relationship Update: ${npc.name} is now a ${npc.friendshipStage}.`,
        "normal",
        "relationship"
      );
    }

    if (npc.romanceStage !== previousRomance) {
      queueNotification(
        `Romance Update: ${npc.name} — ${npc.romanceStage}.`,
        "important",
        "relationship"
      );
    }

    if (previousFriendship === "Stranger" && npc.friendshipStage === "Friend") {
      state.statistics.friendshipsMade += 1;
    }

    if (previousRomance === "No Romance" && npc.romanceStage === "Dating") {
      state.statistics.relationshipsStarted += 1;
    }

    autosave("relationship-adjusted");
    return { ok: true, npc: deepClone(npc) };
  }

  function countMeaningfulRelationships() {
    return Object.values(state.relationships.npcs).filter(
      (npc) => npc.friendshipPoints >= 30 || npc.romancePoints >= 35
    ).length;
  }

  function getBellmontReputationLabel() {
    const value = state.bellmontStanding.reputation;
    if (value >= 1000) return "Bellmont Icon";
    if (value >= 600) return "Community Leader";
    if (value >= 300) return "Respected Resident";
    if (value >= 120) return "Known Around Town";
    if (value >= 30) return "Familiar Face";
    return "Newcomer";
  }

  function adjustBellmontStanding(reputationChange, influenceChange, reason) {
    state.bellmontStanding.reputation = Math.max(
      0,
      Math.round(state.bellmontStanding.reputation + Number(reputationChange || 0))
    );

    state.bellmontStanding.influence = Math.max(
      0,
      Math.round(state.bellmontStanding.influence + Number(influenceChange || 0))
    );

    if (reason) {
      queueNotification(
        `Bellmont Update: ${reason}`,
        "normal",
        "reputation"
      );
    }

    autosave("bellmont-standing-adjusted");

    return {
      reputation: state.bellmontStanding.reputation,
      reputationLabel: getBellmontReputationLabel(),
      influence: state.bellmontStanding.influence
    };
  }

  const PRIORITY_ORDER = { urgent: 3, important: 2, normal: 1, quiet: 0 };

  function queueNotification(message, priority, category, action) {
    const entry = {
      id: makeId("notice"),
      message: String(message || ""),
      priority: priority || "normal",
      category: category || "world",
      action: action || null,
      createdAt: getDateTimeLabel(),
      read: false
    };

    state.notifications.queue.push(entry);
    state.notifications.queue.sort(
      (a, b) => (PRIORITY_ORDER[b.priority] || 0) - (PRIORITY_ORDER[a.priority] || 0)
    );

    state.notifications.history.unshift(deepClone(entry));

    if (state.notifications.history.length > 300) {
      state.notifications.history.length = 300;
    }

    dispatchWorldEvent("notification", deepClone(entry));

    if (state.settings.browserNotificationsEnabled && priority !== "quiet") {
      sendBrowserNotification(entry.message);
    }

    return deepClone(entry);
  }

  function getNextNotification() {
    return state.notifications.queue.length
      ? deepClone(state.notifications.queue[0])
      : null;
  }

  function dismissNotification(notificationId) {
    const index = state.notifications.queue.findIndex((n) => n.id === notificationId);
    if (index === -1) return false;

    state.notifications.queue[index].read = true;
    state.notifications.queue.splice(index, 1);
    autosave("notification-dismissed");
    return true;
  }

  function addReminderOnce(key, message, category, due) {
    if (state.reminders.some((reminder) => reminder.key === key)) return;

    state.reminders.push({
      id: makeId("reminder"),
      key,
      message,
      category: category || "world",
      due: due || null,
      createdAt: getDateTimeLabel()
    });
  }

  function removeReminderByKey(key) {
    state.reminders = state.reminders.filter((reminder) => reminder.key !== key);
  }

  function updateReminders() {
    maybeQueueNeedReminders();

    state.events.upcoming.forEach((event) => {
      if (event.status !== "upcoming") return;

      const days = daysUntilDate(event.year, event.month, event.day);

      if (days === 1) {
        addReminderOnce(
          `event-tomorrow-${event.id}`,
          `Tomorrow: ${event.title}.`,
          "event",
          event.id
        );
      }

      if (days === 0) {
        addReminderOnce(
          `event-today-${event.id}`,
          `Today: ${event.title}.`,
          "event",
          event.id
        );
      }
    });
  }

  async function requestBrowserNotifications() {
    if (typeof Notification === "undefined") {
      return { ok: false, message: "Browser notifications are not available in this browser." };
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      state.settings.browserNotificationsEnabled = true;
      autosave("browser-notifications-enabled");
      return { ok: true, permission };
    }

    state.settings.browserNotificationsEnabled = false;
    autosave("browser-notifications-denied");
    return { ok: false, permission };
  }

  function sendBrowserNotification(message) {
    if (
      typeof Notification === "undefined" ||
      Notification.permission !== "granted"
    ) {
      return false;
    }

    try {
      new Notification("Life Unlocked", { body: String(message || "") });
      return true;
    } catch (error) {
      console.warn("Browser notification failed:", error);
      return false;
    }
  }

  function dateKey(year, month, day, eventKey) {
    return `${year}-${month}-${day}-${eventKey}`;
  }

  function daysUntilDate(year, month, day) {
    const current = absoluteDayNumber(state.clock.year, state.clock.month, state.clock.day);
    const target = absoluteDayNumber(year, month, day);
    return target - current;
  }

  function absoluteDayNumber(year, month, day) {
    let total = (Math.max(1, year) - 1) * 365;

    for (let m = 1; m < month; m += 1) {
      total += getMonthInfo(m).days;
    }

    total += day - 1;
    return total;
  }

  function addUpcomingEvent(event) {
    const incoming = deepClone(event);
    incoming.id = incoming.id || makeId("event");
    incoming.status = incoming.status || "upcoming";
    incoming.createdAt = incoming.createdAt || getDateTimeLabel();

    const duplicate = state.events.upcoming.some(
      (item) => item.uniqueKey && item.uniqueKey === incoming.uniqueKey
    );

    if (!duplicate) {
      state.events.upcoming.push(incoming);
      state.events.upcoming.sort(
        (a, b) =>
          absoluteDayNumber(a.year, a.month, a.day) -
          absoluteDayNumber(b.year, b.month, b.day)
      );
      autosave("upcoming-event-added");
    }

    return deepClone(incoming);
  }

  function checkScheduledEvents() {
    generateAnnualEventsForCurrentYear();

    const nowDate = absoluteDayNumber(state.clock.year, state.clock.month, state.clock.day);

    state.events.upcoming.forEach((event) => {
      const eventDate = absoluteDayNumber(event.year, event.month, event.day);

      if (event.status === "upcoming" && eventDate <= nowDate) {
        activateEvent(event.id);
      }
    });

    expirePastEvents();
  }

  function activateEvent(eventId) {
    const index = state.events.upcoming.findIndex((event) => event.id === eventId);
    if (index === -1) return { ok: false };

    const event = state.events.upcoming[index];
    event.status = "active";
    event.activatedAt = getDateTimeLabel();

    state.events.active.push(event);
    state.events.upcoming.splice(index, 1);

    queueNotification(
      `Life Event available: ${event.title}. Open Events to review your choices.`,
      event.priority || "important",
      "event",
      { type: "openEvent", eventId: event.id }
    );

    autosave("event-activated");
    return { ok: true, event: deepClone(event) };
  }

  function expirePastEvents() {
    const today = absoluteDayNumber(state.clock.year, state.clock.month, state.clock.day);

    const expired = state.events.active.filter((event) => {
      const expiry = event.expiresAfterDays == null ? 0 : event.expiresAfterDays;
      const eventDay = absoluteDayNumber(event.year, event.month, event.day);
      return today > eventDay + expiry && event.status === "active";
    });

    expired.forEach((event) => {
      resolveMissedEvent(event.id);
    });
  }

  function resolveMissedEvent(eventId) {
    const event = state.events.active.find((item) => item.id === eventId);
    if (!event) return { ok: false };

    const miss = event.missedConsequences || {};
    applyConsequences(miss, event, "missed");

    event.status = "missed";
    event.resolvedAt = getDateTimeLabel();
    event.selectedChoiceId = null;

    state.statistics.eventsMissed += 1;
    moveResolvedEvent(event);

    queueNotification(
      `Event missed: ${event.title}.`,
      event.commitmentLevel === "major" ? "important" : "normal",
      "event"
    );

    autosave("event-missed");
    return { ok: true };
  }

  function chooseEventOption(eventId, choiceId) {
    const event = state.events.active.find((item) => item.id === eventId);

    if (!event) {
      return { ok: false, message: "This event is no longer active." };
    }

    const choice = (event.choices || []).find((item) => item.id === choiceId);

    if (!choice) {
      return { ok: false, message: "Event choice not found." };
    }

    const affordability = canAffordConsequences(choice.consequences || {});
    if (!affordability.ok) return affordability;

    applyConsequences(choice.consequences || {}, event, "choice");

    event.status = "resolved";
    event.selectedChoiceId = choice.id;
    event.selectedChoiceLabel = choice.label;
    event.resolvedAt = getDateTimeLabel();

    if (choice.countsAsAttending) {
      state.statistics.eventsAttended += 1;
    }

    if (event.majorMemory && choice.countsAsAttending) {
      addLifeHistory(`${event.title}: ${choice.label}.`);
    }

    moveResolvedEvent(event);

    queueNotification(
      `Life Event complete: ${event.title}. You chose ${choice.label}.`,
      "normal",
      "event"
    );

    autosave("event-choice-resolved");
    return { ok: true, event: deepClone(event), choice: deepClone(choice) };
  }

  function canAffordConsequences(consequences) {
    const c = consequences || {};

    if (c.personalMoney && c.personalMoney < 0) {
      const cost = Math.abs(c.personalMoney);
      if (state.money.personalAccount < cost) {
        return { ok: false, message: `You need ${cost} personal coins for this choice.` };
      }
    }

    return { ok: true };
  }

  function applyConsequences(consequences, event, resolutionType) {
    const c = consequences || {};

    if (c.personalMoney > 0) {
      addPersonalMoney(c.personalMoney, event.title, "Life Event");
    } else if (c.personalMoney < 0) {
      spendPersonalMoney(Math.abs(c.personalMoney), event.title, "Life Event");
    }

    if (c.happiness) {
      state.needs.happiness = clamp(state.needs.happiness + Number(c.happiness), 0, 100);
    }

    if (c.reputation || c.influence) {
      adjustBellmontStanding(c.reputation || 0, c.influence || 0, event.title);
    }

    if (c.skillXP) {
      Object.entries(c.skillXP).forEach(([skill, amount]) => {
        if (SKILL_KEYS.includes(skill)) {
          addSkillXP(skill, amount, event.title);
        }
      });
    }

    if (c.relationship && c.relationship.npcId) {
      adjustRelationship(
        c.relationship.npcId,
        {
          friendship: c.relationship.friendship || 0,
          romance: c.relationship.romance || 0
        },
        `${event.title} — ${resolutionType}`
      );
    }

    if (c.timeMinutes) {
      advanceTime(c.timeMinutes, {
        silent: true,
        reason: `event-${event.id}`
      });
    }

    if (c.lifeHistory) {
      addLifeHistory(c.lifeHistory);
    }
  }

  function moveResolvedEvent(event) {
    state.events.active = state.events.active.filter((item) => item.id !== event.id);
    state.events.resolved.unshift(deepClone(event));

    if (state.events.resolved.length > 250) {
      state.events.resolved.length = 250;
    }

    removeReminderByKey(`event-tomorrow-${event.id}`);
    removeReminderByKey(`event-today-${event.id}`);
  }

  function getEventDisplay(eventId) {
    const event =
      state.events.active.find((item) => item.id === eventId) ||
      state.events.upcoming.find((item) => item.id === eventId) ||
      state.events.resolved.find((item) => item.id === eventId);

    if (!event) return null;

    const result = deepClone(event);

    if (!state.settings.showChoiceConsequences) {
      result.choices = (result.choices || []).map((choice) => ({
        id: choice.id,
        label: choice.label,
        description: choice.description || "",
        countsAsAttending: Boolean(choice.countsAsAttending)
      }));
    }

    return result;
  }

  function getTodayEvents() {
    return [
      ...state.events.active,
      ...state.events.upcoming.filter(
        (event) =>
          event.year === state.clock.year &&
          event.month === state.clock.month &&
          event.day === state.clock.day
      )
    ].map((event) => deepClone(event));
  }

  function getUpcomingEvents(limit) {
    return deepClone(state.events.upcoming.slice(0, limit || 20));
  }

  function generateAnnualEventsForCurrentYear() {
    const year = state.clock.year;

    const annual = [
      buildNewYearsEvent(year),
      buildWinterLightsEvent(year),
      buildSpringFestivalEvent(year),
      buildTasteOfBellmontEvent(year),
      buildSummerFairEvent(year),
      buildFoundersCelebrationEvent(year),
      buildHarvestFestivalEvent(year),
      buildHalloweenEvent(year),
      buildChristmasEvent(year)
    ];

    annual.forEach((event) => {
      const key = event.uniqueKey;
      if (!state.events.generatedKeys[key]) {
        state.events.generatedKeys[key] = true;
        addUpcomingEvent(event);
      }
    });
  }

  function standardEvent(data) {
    return {
      id: makeId("event"),
      uniqueKey: data.uniqueKey,
      title: data.title,
      description: data.description,
      category: data.category || "community",
      priority: data.priority || "normal",
      commitmentLevel: data.commitmentLevel || "optional",
      year: data.year,
      month: data.month,
      day: data.day,
      expiresAfterDays: data.expiresAfterDays == null ? 0 : data.expiresAfterDays,
      majorMemory: Boolean(data.majorMemory),
      choices: data.choices || [],
      missedConsequences: data.missedConsequences || {},
      status: "upcoming"
    };
  }

  function buildNewYearsEvent(year) {
    return standardEvent({
      uniqueKey: dateKey(year, 1, 1, "new-year"),
      title: "Bellmont New Year's Day",
      description: "A new year has begun in Bellmont.",
      category: "holiday",
      year, month: 1, day: 1,
      choices: [
        {
          id: "celebrate-town",
          label: "Join the Bellmont celebration",
          description: "Spend time celebrating with the community.",
          countsAsAttending: true,
          consequences: { personalMoney: -25, happiness: 3, reputation: 1, timeMinutes: 180 }
        },
        {
          id: "celebrate-friends",
          label: "Celebrate with friends",
          description: "Keep the day social and relaxed.",
          countsAsAttending: true,
          consequences: { happiness: 3, timeMinutes: 150, skillXP: { socialConfidence: 8 } }
        },
        {
          id: "quiet-day",
          label: "Have a quiet New Year's Day",
          description: "Enjoy a calm day at home.",
          countsAsAttending: false,
          consequences: { happiness: 1, timeMinutes: 90 }
        }
      ]
    });
  }

  function buildWinterLightsEvent(year) {
    return standardEvent({
      uniqueKey: dateKey(year, 2, 12, "winter-lights"),
      title: "Bellmont Winter Lights Festival",
      description: "Willowmere Square is filled with winter lights, food, music, and community activities.",
      category: "festival",
      year, month: 2, day: 12,
      choices: [
        {
          id: "attend",
          label: "Attend the festival",
          countsAsAttending: true,
          consequences: { personalMoney: -20, happiness: 3, reputation: 2, timeMinutes: 180 }
        },
        {
          id: "volunteer",
          label: "Volunteer at the festival",
          countsAsAttending: true,
          consequences: { happiness: 1, reputation: 4, influence: 2, timeMinutes: 240 }
        },
        {
          id: "skip",
          label: "Skip the festival",
          countsAsAttending: false,
          consequences: {}
        }
      ]
    });
  }

  function buildSpringFestivalEvent(year) {
    return standardEvent({
      uniqueKey: dateKey(year, 4, 17, "spring-festival"),
      title: "Bellmont Spring Festival",
      description: "A citywide spring celebration is taking place in Willowmere Square.",
      category: "festival",
      year, month: 4, day: 17,
      choices: [
        {
          id: "attend",
          label: "Attend the Spring Festival",
          countsAsAttending: true,
          consequences: { personalMoney: -15, happiness: 3, reputation: 2, timeMinutes: 180 }
        },
        {
          id: "community-booth",
          label: "Help at a community booth",
          countsAsAttending: true,
          consequences: { reputation: 4, influence: 2, happiness: 1, timeMinutes: 240 }
        },
        {
          id: "stay-home",
          label: "Stay home",
          countsAsAttending: false,
          consequences: {}
        }
      ]
    });
  }

  function buildTasteOfBellmontEvent(year) {
    return standardEvent({
      uniqueKey: dateKey(year, 6, 20, "taste-of-bellmont"),
      title: "Taste of Bellmont Festival",
      description: "Bellmont's restaurants, cafés, and residents gather for a citywide food festival.",
      category: "festival",
      year, month: 6, day: 20,
      majorMemory: true,
      choices: [
        {
          id: "attend-resident",
          label: "Attend as a resident",
          countsAsAttending: true,
          consequences: { personalMoney: -30, happiness: 3, reputation: 2, timeMinutes: 180 }
        },
        {
          id: "volunteer",
          label: "Volunteer",
          countsAsAttending: true,
          consequences: { happiness: 1, reputation: 4, influence: 2, timeMinutes: 240 }
        },
        {
          id: "skip",
          label: "Skip the festival",
          countsAsAttending: false,
          consequences: {}
        }
      ]
    });
  }

  function buildSummerFairEvent(year) {
    return standardEvent({
      uniqueKey: dateKey(year, 7, 18, "summer-fair"),
      title: "Bellmont Summer Fair",
      description: "A large summer fair brings food, entertainment, music, and community activities to Bellmont.",
      category: "festival",
      year, month: 7, day: 18,
      choices: [
        {
          id: "full-day",
          label: "Spend the afternoon at the fair",
          countsAsAttending: true,
          consequences: { personalMoney: -35, happiness: 4, reputation: 1, timeMinutes: 240 }
        },
        {
          id: "short-visit",
          label: "Make a short visit",
          countsAsAttending: true,
          consequences: { personalMoney: -15, happiness: 2, timeMinutes: 90 }
        },
        {
          id: "skip",
          label: "Skip the fair",
          countsAsAttending: false,
          consequences: {}
        }
      ]
    });
  }

  function buildFoundersCelebrationEvent(year) {
    return standardEvent({
      uniqueKey: dateKey(year, 8, 22, "founders"),
      title: "Bellmont Founder's Celebration",
      description: "Bellmont celebrates its history with community activities across the city.",
      category: "community",
      year, month: 8, day: 22,
      choices: [
        {
          id: "attend",
          label: "Attend the celebration",
          countsAsAttending: true,
          consequences: { happiness: 2, reputation: 3, timeMinutes: 180 }
        },
        {
          id: "volunteer",
          label: "Volunteer with organizers",
          countsAsAttending: true,
          consequences: { reputation: 5, influence: 3, timeMinutes: 240 }
        },
        {
          id: "skip",
          label: "Skip the celebration",
          countsAsAttending: false,
          consequences: {}
        }
      ]
    });
  }

  function buildHarvestFestivalEvent(year) {
    return standardEvent({
      uniqueKey: dateKey(year, 9, 26, "harvest"),
      title: "Bellmont Harvest Festival",
      description: "Markets, seasonal food, crafts, and community events fill Bellmont for the Harvest Festival.",
      category: "festival",
      year, month: 9, day: 26,
      choices: [
        {
          id: "market",
          label: "Visit the market and festival",
          countsAsAttending: true,
          consequences: { personalMoney: -20, happiness: 3, reputation: 1, timeMinutes: 150 }
        },
        {
          id: "craft",
          label: "Join a seasonal craft activity",
          countsAsAttending: true,
          consequences: { personalMoney: -10, happiness: 2, timeMinutes: 120, skillXP: { creativity: 12 } }
        },
        {
          id: "skip",
          label: "Skip the festival",
          countsAsAttending: false,
          consequences: {}
        }
      ]
    });
  }

  function buildHalloweenEvent(year) {
    return standardEvent({
      uniqueKey: dateKey(year, 10, 31, "halloween"),
      title: "Halloween in Bellmont",
      description: "Bellmont is celebrating Halloween with parties, decorations, and neighborhood events.",
      category: "holiday",
      year, month: 10, day: 31,
      choices: [
        {
          id: "community",
          label: "Join a community Halloween event",
          countsAsAttending: true,
          consequences: { personalMoney: -20, happiness: 3, reputation: 1, timeMinutes: 150 }
        },
        {
          id: "home",
          label: "Celebrate at home",
          countsAsAttending: true,
          consequences: { personalMoney: -10, happiness: 2, timeMinutes: 90 }
        },
        {
          id: "skip",
          label: "Treat it like a normal day",
          countsAsAttending: false,
          consequences: {}
        }
      ]
    });
  }

  function buildChristmasEvent(year) {
    return standardEvent({
      uniqueKey: dateKey(year, 12, 25, "christmas"),
      title: "Christmas Day",
      description: "Christmas has arrived in Bellmont. Choose how you want to celebrate.",
      category: "holiday",
      priority: "important",
      year, month: 12, day: 25,
      expiresAfterDays: 0,
      majorMemory: true,
      choices: [
        {
          id: "regular-gifts",
          label: "Buy Christmas presents",
          description: "Buy thoughtful gifts and celebrate traditionally.",
          countsAsAttending: true,
          consequences: {
            personalMoney: -100,
            happiness: 2,
            reputation: 1,
            timeMinutes: 180
          }
        },
        {
          id: "homemade-gifts",
          label: "Make homemade gifts",
          description: "Spend more time and less money creating gifts yourself.",
          countsAsAttending: true,
          consequences: {
            personalMoney: -20,
            happiness: 2,
            timeMinutes: 240,
            skillXP: { creativity: 15 }
          }
        },
        {
          id: "smaller-gifts",
          label: "Buy smaller gifts",
          description: "Keep the celebration affordable.",
          countsAsAttending: true,
          consequences: {
            personalMoney: -50,
            happiness: 1,
            timeMinutes: 150
          }
        },
        {
          id: "quiet-christmas",
          label: "Have a quiet Christmas",
          description: "Celebrate privately without buying gifts.",
          countsAsAttending: false,
          consequences: { happiness: 1, timeMinutes: 90 }
        }
      ],
      missedConsequences: {}
    });
  }

  function schedulePersonalEvent(data) {
    const incoming = data || {};

    return addUpcomingEvent(standardEvent({
      uniqueKey: incoming.uniqueKey || makeId("personalEventKey"),
      title: incoming.title || "Personal Event",
      description: incoming.description || "",
      category: incoming.category || "personal",
      priority: incoming.priority || "important",
      commitmentLevel: incoming.commitmentLevel || "personal",
      year: incoming.year || state.clock.year,
      month: incoming.month || state.clock.month,
      day: incoming.day || state.clock.day,
      expiresAfterDays: incoming.expiresAfterDays == null ? 0 : incoming.expiresAfterDays,
      majorMemory: Boolean(incoming.majorMemory),
      choices: incoming.choices || [],
      missedConsequences: incoming.missedConsequences || {}
    }));
  }

  const TRAVEL_METHODS = {
    walking: { label: "Walking", cost: 0, timeMultiplier: 1.5, fitnessXP: 3 },
    bicycle: { label: "Bicycle", cost: 0, timeMultiplier: 0.8, fitnessXP: 2 },
    bus: { label: "Bus", cost: 3, timeMultiplier: 1.0, fitnessXP: 0 },
    train: { label: "Train", cost: 5, timeMultiplier: 0.7, fitnessXP: 0 },
    taxi: { label: "Taxi", cost: 15, timeMultiplier: 0.5, fitnessXP: 0 },
    car: { label: "Car", cost: 4, timeMultiplier: 0.45, fitnessXP: 0 },
    moped: { label: "Moped", cost: 2, timeMultiplier: 0.55, fitnessXP: 0 }
  };

  function travel(destination, methodId, baseMinutes) {
    const method = TRAVEL_METHODS[methodId];
    if (!method) return { ok: false, message: "Unknown transportation method." };

    if (method.cost > 0) {
      const payment = spendPersonalMoney(
        method.cost,
        `${method.label} fare`,
        "Transportation"
      );
      if (!payment.ok) return payment;
    }

    const minutes = Math.max(
      1,
      Math.round((Number(baseMinutes) || 30) * method.timeMultiplier)
    );

    advanceTime(minutes, { silent: true, reason: "travel" });

    state.location = {
      area: destination.area || "Bellmont",
      place: destination.place || destination.name || "Destination"
    };

    if (method.fitnessXP) {
      addSkillXP("fitness", method.fitnessXP, method.label);
    }

    queueNotification(
      `Arrived at ${state.location.place} in ${state.location.area} by ${method.label}.`,
      "normal",
      "travel"
    );

    autosave("travel");
    return { ok: true, location: deepClone(state.location), minutes, cost: method.cost };
  }

  function setLocation(area, place) {
    state.location.area = area || state.location.area;
    state.location.place = place || state.location.place;
    autosave("location-changed");
  }

  function addLifeHistory(text, category) {
    const entry = {
      id: makeId("history"),
      text: String(text || ""),
      category: category || "life",
      date: getDateLabel(),
      dateTime: getDateTimeLabel()
    };

    state.lifeHistory.unshift(entry);

    if (state.lifeHistory.length > 500) {
      state.lifeHistory.length = 500;
    }

    return deepClone(entry);
  }

  function getLifeHistory(limit) {
    return deepClone(state.lifeHistory.slice(0, limit || 100));
  }

  function updateSettings(changes) {
    state.settings = deepMerge(state.settings, changes || {});
    autosave("settings-updated");
    return deepClone(state.settings);
  }

  function getPersonalStatus() {
    return {
      character: deepClone(state.character),
      dateTime: getDateTimeLabel(),
      dayPart: getDayPart(),
      location: deepClone(state.location),
      money: getFinancialSummary(),
      needs: getNeedsSummary(),
      qualityOfLife: deepClone(state.qualityOfLife),
      skills: deepClone(state.skills),
      hobbies: deepClone(state.hobbies),
      bellmontStanding: {
        reputation: state.bellmontStanding.reputation,
        reputationLabel: getBellmontReputationLabel(),
        influence: state.bellmontStanding.influence
      },
      relationships: {
        knownPeople: Object.keys(state.relationships.npcs).length,
        meaningfulRelationships: countMeaningfulRelationships()
      }
    };
  }

  function getWorldDashboard() {
    const todayEvents = getTodayEvents();
    return {
      heading: `Life Unlocked — ${state.character.name || "Bellmont"}`,
      dateTime: getDateTimeLabel(),
      dayPart: getDayPart(),
      location: deepClone(state.location),
      personalMoney: state.money.personalAccount,
      savings: state.money.savingsAccount,
      needs: getNeedsSummary(),
      qualityOfLife: deepClone(state.qualityOfLife),
      bellmontReputation: getBellmontReputationLabel(),
      influence: state.bellmontStanding.influence,
      activeEventCount: state.events.active.length,
      todayEvents,
      reminders: deepClone(state.reminders),
      nextNotification: getNextNotification(),
      backgroundActivities: deepClone(state.backgroundActivities)
    };
  }

  function reportCareerTime(minutes, source) {
    return advanceTime(minutes, {
      silent: true,
      reason: source || "career-activity"
    });
  }

  function reportCareerPersonalIncome(amount, description) {
    return addPersonalMoney(
      amount,
      description || "Career personal income",
      "Career Income"
    );
  }

  function reportLifeActivityResult(result) {
    const incoming = result || {};

    if (incoming.timeMinutes) {
      advanceTime(incoming.timeMinutes, {
        silent: true,
        reason: incoming.reason || "life-activity"
      });
    }

    if (incoming.needs) {
      Object.entries(incoming.needs).forEach(([need, amount]) => {
        if (NEED_KEYS.includes(need)) {
          state.needs[need] = clamp(state.needs[need] + Number(amount || 0), 0, 100);
        }
      });
    }

    if (incoming.skillXP) {
      Object.entries(incoming.skillXP).forEach(([skill, xp]) => {
        if (SKILL_KEYS.includes(skill)) {
          addSkillXP(skill, xp, incoming.activityName || "Life Activity");
        }
      });
    }

    if (incoming.happiness) {
      state.needs.happiness = clamp(state.needs.happiness + Number(incoming.happiness), 0, 100);
    }

    if (incoming.historyText) {
      addLifeHistory(incoming.historyText);
    }

    updateQualityOfLife();
    autosave("life-activity-result");

    return { ok: true };
  }

  load();
  generateAnnualEventsForCurrentYear();
  checkScheduledEvents();
  updateReminders();
  updateQualityOfLife();
  save();

  window.LifeUnlockedWorld = {
    VERSION: WORLD_VERSION,

    save,
    load,
    resetWorld,
    getState,

    markWelcomeSeen,
    createCharacter,
    updateCharacterProfile,

    getDateLabel,
    getDateTimeLabel,
    getDayPart,
    advanceTime,
    canSleep,
    goToSleep,

    addPersonalMoney,
    spendPersonalMoney,
    transferToSavings,
    transferFromSavings,
    getFinancialSummary,

    ensureCareer,
    setCareerProfitSplit,
    addCareerFunds,
    spendCareerFunds,
    createBusinessLocation,
    purchaseBusinessLocation,
    addLocationOperatingFunds,
    spendLocationOperatingFunds,
    distributeBusinessProfit,
    sellBusinessLocation,
    exitCareerAndCashOut,
    getCareerSummary,

    adjustNeed,
    getNeedsSummary,
    addSkillXP,
    startBackgroundActivity,
    completeBackgroundActivity,

    generateNPC,
    adjustRelationship,

    getBellmontReputationLabel,
    adjustBellmontStanding,

    queueNotification,
    getNextNotification,
    dismissNotification,
    requestBrowserNotifications,

    addUpcomingEvent,
    schedulePersonalEvent,
    checkScheduledEvents,
    chooseEventOption,
    getEventDisplay,
    getTodayEvents,
    getUpcomingEvents,
    generateAnnualEventsForCurrentYear,

    travel,
    setLocation,

    addLifeHistory,
    getLifeHistory,

    updateSettings,
    getPersonalStatus,
    getWorldDashboard,

    reportCareerTime,
    reportCareerPersonalIncome,
    reportLifeActivityResult
  };
})();
