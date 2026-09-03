// Life Unlocked - Master Game Version 1.0
// Main game.js controller
// This file controls the overall Life Unlocked game and connects major systems.

// ============================================================
// 1. BASIC HELPERS
// ============================================================

const GameHelpers = {
  randomId(prefix = "id") {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  },

  roundCoins(value) {
    return Math.max(0, Math.round(Number(value) || 0));
  },

  formatCoins(value) {
    return `${this.roundCoins(value).toLocaleString()} coins`;
  },

  now() {
    return Date.now();
  },

  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
};

// ============================================================
// 2. GAME CONSTANTS
// ============================================================

const LIFE_UNLOCKED_VERSION = "1.0";
const MASTER_SAVE_KEY = "lifeUnlockedMasterV1";

const MAIN_SECTIONS = {
  mainMenu: {
    id: "mainMenu",
    name: "Life Unlocked Main Menu",
    available: true
  },

  cafe: {
    id: "cafe",
    name: "Cafe",
    available: true
  },

  home: {
    id: "home",
    name: "Home",
    available: false,
    futureFile: "house.js"
  },

  finances: {
    id: "finances",
    name: "Personal Finances",
    available: true
  },

  businesses: {
    id: "businesses",
    name: "Businesses",
    available: true
  },

  careers: {
    id: "careers",
    name: "Careers",
    available: false
  },

  transportation: {
    id: "transportation",
    name: "Transportation",
    available: false,
    futureFile: "transport.js"
  },

  shopping: {
    id: "shopping",
    name: "Shopping",
    available: false
  },

  playerStatus: {
    id: "playerStatus",
    name: "Player Status",
    available: true
  },

  notifications: {
    id: "notifications",
    name: "Notifications",
    available: true
  },

  settings: {
    id: "settings",
    name: "Settings",
    available: true
  },

  bank: {
    id: "bank",
    name: "Bank",
    available: false,
    futureFile: "bank.js"
  }
};

// ============================================================
// 3. BUSINESS AND CAREER REGISTRIES
// ============================================================

const BUSINESS_REGISTRY = {
  cafe: {
    id: "cafe",
    name: "Cafe",
    available: true,
    ownedByDefault: true,
    controllerGlobal: "cafeGame",
    futureFile: "cafe.js"
  },

  salon: {
    id: "salon",
    name: "Salon",
    available: false,
    ownedByDefault: false,
    futureFile: "salon.js"
  },

  hotel: {
    id: "hotel",
    name: "Hotel",
    available: false,
    ownedByDefault: false,
    futureFile: "hotel.js"
  },

  airline: {
    id: "airline",
    name: "Airline",
    available: false,
    ownedByDefault: false,
    futureFile: "airline.js"
  }
};

const CAREER_REGISTRY = {
  employeeCareer: {
    id: "employeeCareer",
    name: "Employee Career",
    available: false
  }
};

// ============================================================
// 4. MASTER GAME CONTROLLER
// ============================================================

class LifeUnlockedGame {
  constructor() {
    this.state = this.createNewState();
    this.connectedSystems = {};
  }

  createNewState() {
    return {
      version: LIFE_UNLOCKED_VERSION,

      player: {
        name: "Player",
        personalMoney: 1000,
        lifeLevel: 1,
        lifeXP: 0
      },

      navigation: {
        currentSection: "mainMenu",
        previousSection: null,
        history: []
      },

      currentActivity: {
        type: "mainMenu",
        label: "Life Unlocked Main Menu",
        startedAt: GameHelpers.now()
      },

      ownership: {
        businesses: ["cafe"],
        careers: []
      },

      unlocks: {
        cafe: true,
        finances: true,
        businesses: true,
        playerStatus: true,
        notifications: true,
        settings: true,
        home: false,
        careers: false,
        transportation: false,
        shopping: false,
        bank: false
      },

      statistics: {
        totalPersonalIncome: 0,
        totalPersonalExpenses: 0,
        totalCafeWithdrawals: 0,
        totalCafeInvestments: 0,
        totalLifeXPEarned: 0,
        daysPlayed: 1
      },

      transactions: [
        {
          id: GameHelpers.randomId("transaction"),
          time: GameHelpers.now(),
          type: "startingMoney",
          amount: 1000,
          description: "Starting personal money"
        }
      ],

      notifications: [],

      settings: {
        accessibleAnnouncements: true,
        autoSave: true,
        confirmLargeTransactions: true
      },

      session: {
        hasCompletedNewGameSetup: false,
        lastOpenedAt: null,
        createdAt: GameHelpers.now()
      }
    };
  }

  // ==========================================================
  // 5. ACCESSIBLE MESSAGE AND NOTIFICATION SYSTEM
  // ==========================================================

  announce(message, addNotification = false) {
    console.log(message);

    if (addNotification) {
      this.addNotification(message);
    }

    if (
      this.state.settings.accessibleAnnouncements &&
      typeof document !== "undefined"
    ) {
      const liveRegion = document.getElementById("game-live-region");

      if (liveRegion) {
        liveRegion.textContent = message;
      }
    }

    return message;
  }

  addNotification(message, type = "general") {
    const notification = {
      id: GameHelpers.randomId("notification"),
      time: GameHelpers.now(),
      type,
      message,
      read: false
    };

    this.state.notifications.push(notification);

    if (this.state.notifications.length > 200) {
      this.state.notifications.shift();
    }

    this.autoSave();
    return notification;
  }

  getUnreadNotificationCount() {
    return this.state.notifications.filter(item => !item.read).length;
  }

  getNotifications() {
    return [...this.state.notifications].reverse();
  }

  markNotificationRead(notificationId) {
    const notification = this.state.notifications.find(
      item => item.id === notificationId
    );

    if (!notification) {
      return this.announce("Notification not found.");
    }

    notification.read = true;
    this.autoSave();
    return true;
  }

  markAllNotificationsRead() {
    this.state.notifications.forEach(item => {
      item.read = true;
    });

    this.autoSave();
    return true;
  }

  // ==========================================================
  // 6. PLAYER SETUP
  // ==========================================================

  setPlayerName(name) {
    const cleaned = String(name || "").trim();

    if (!cleaned) {
      return this.announce("Please enter a player name.");
    }

    this.state.player.name = cleaned;
    this.autoSave();

    return this.announce(`Player name set to ${cleaned}.`);
  }

  completeNewGameSetup(name = "Player") {
    this.setPlayerName(name);

    this.state.session.hasCompletedNewGameSetup = true;
    this.state.navigation.currentSection = "mainMenu";
    this.state.currentActivity = {
      type: "mainMenu",
      label: "Life Unlocked Main Menu",
      startedAt: GameHelpers.now()
    };

    this.addNotification(
      "Your cafe is ready. Open the Cafe section to begin your first shift.",
      "tutorial"
    );

    this.autoSave();

    return this.announce(
      `Welcome to Life Unlocked, ${this.state.player.name}. Your first cafe is ready.`
    );
  }

  // ==========================================================
  // 7. PERSONAL MONEY
  // ==========================================================

  getPersonalMoney() {
    return this.state.player.personalMoney;
  }

  canAffordPersonal(amount) {
    const cleanAmount = GameHelpers.roundCoins(amount);
    return this.state.player.personalMoney >= cleanAmount;
  }

  addPersonalMoney(amount, description = "Personal income", type = "income") {
    const cleanAmount = GameHelpers.roundCoins(amount);

    if (cleanAmount <= 0) {
      return this.announce("The amount must be greater than zero.");
    }

    this.state.player.personalMoney += cleanAmount;
    this.state.statistics.totalPersonalIncome += cleanAmount;

    this.recordTransaction({
      type,
      amount: cleanAmount,
      description
    });

    this.autoSave();
    return cleanAmount;
  }

  spendPersonalMoney(amount, description = "Personal expense", type = "expense") {
    const cleanAmount = GameHelpers.roundCoins(amount);

    if (cleanAmount <= 0) {
      return this.announce("The amount must be greater than zero.");
    }

    if (!this.canAffordPersonal(cleanAmount)) {
      return this.announce(
        `You need ${GameHelpers.formatCoins(cleanAmount)}. You currently have ${GameHelpers.formatCoins(this.state.player.personalMoney)}.`
      );
    }

    this.state.player.personalMoney -= cleanAmount;
    this.state.statistics.totalPersonalExpenses += cleanAmount;

    this.recordTransaction({
      type,
      amount: -cleanAmount,
      description
    });

    this.autoSave();
    return true;
  }

  recordTransaction({ type, amount, description }) {
    const transaction = {
      id: GameHelpers.randomId("transaction"),
      time: GameHelpers.now(),
      type,
      amount: Number(amount) || 0,
      description: description || "Transaction"
    };

    this.state.transactions.push(transaction);

    if (this.state.transactions.length > 500) {
      this.state.transactions.shift();
    }

    return transaction;
  }

  getTransactionHistory(limit = 50) {
    return this.state.transactions.slice(-limit).reverse();
  }

  // ==========================================================
  // 8. LIFE LEVEL AND LIFE XP
  // ==========================================================

  xpNeededForLifeLevel(level) {
    if (level <= 1) return 0;

    return 100 + ((level - 2) * 75);
  }

  totalXPRequiredForLevel(level) {
    if (level <= 1) return 0;

    let total = 0;

    for (let current = 2; current <= level; current += 1) {
      total += this.xpNeededForLifeLevel(current);
    }

    return total;
  }

  calculateLifeLevelFromXP(totalXP) {
    let level = 1;

    while (
      totalXP >= this.totalXPRequiredForLevel(level + 1) &&
      level < 100000
    ) {
      level += 1;
    }

    return level;
  }

  awardLifeXP(amount, reason = "Life progress") {
    const cleanAmount = GameHelpers.roundCoins(amount);

    if (cleanAmount <= 0) {
      return false;
    }

    const oldLevel = this.state.player.lifeLevel;

    this.state.player.lifeXP += cleanAmount;
    this.state.statistics.totalLifeXPEarned += cleanAmount;

    const newLevel = this.calculateLifeLevelFromXP(
      this.state.player.lifeXP
    );

    if (newLevel > oldLevel) {
      this.state.player.lifeLevel = newLevel;

      this.announce(
        `Life Level ${newLevel} reached.`,
        true
      );
    }

    this.addNotification(
      `${reason}. You earned ${cleanAmount} Life XP.`,
      "progress"
    );

    this.autoSave();
    return true;
  }

  getLifeXPProgress() {
    const currentLevel = this.state.player.lifeLevel;
    const currentLevelStart = this.totalXPRequiredForLevel(currentLevel);
    const nextLevelStart = this.totalXPRequiredForLevel(currentLevel + 1);

    return {
      lifeLevel: currentLevel,
      totalXP: this.state.player.lifeXP,
      xpIntoCurrentLevel:
        this.state.player.lifeXP - currentLevelStart,
      xpNeededForNextLevel:
        nextLevelStart - currentLevelStart,
      xpRemaining:
        Math.max(0, nextLevelStart - this.state.player.lifeXP)
    };
  }

  // ==========================================================
  // 9. NAVIGATION
  // ==========================================================

  canOpenSection(sectionId) {
    const section = MAIN_SECTIONS[sectionId];

    if (!section) return false;

    if (section.available) return true;

    return Boolean(this.state.unlocks[sectionId]);
  }

  openSection(sectionId) {
    const section = MAIN_SECTIONS[sectionId];

    if (!section) {
      return this.announce("That section does not exist.");
    }

    if (!this.canOpenSection(sectionId)) {
      return this.openComingSoon(sectionId);
    }

    const current = this.state.navigation.currentSection;

    if (current !== sectionId) {
      this.state.navigation.previousSection = current;

      this.state.navigation.history.push(current);

      if (this.state.navigation.history.length > 30) {
        this.state.navigation.history.shift();
      }
    }

    this.state.navigation.currentSection = sectionId;

    this.state.currentActivity = {
      type: sectionId,
      label: section.name,
      startedAt: GameHelpers.now()
    };

    this.autoSave();

    return this.announce(`${section.name} opened.`);
  }

  goBack() {
    const previous = this.state.navigation.history.pop();

    if (!previous) {
      return this.openSection("mainMenu");
    }

    this.state.navigation.previousSection =
      this.state.navigation.currentSection;

    this.state.navigation.currentSection = previous;

    const section = MAIN_SECTIONS[previous];

    this.state.currentActivity = {
      type: previous,
      label: section ? section.name : previous,
      startedAt: GameHelpers.now()
    };

    this.autoSave();

    return this.announce(
      section ? `${section.name} opened.` : "Previous section opened."
    );
  }

  goToMainMenu() {
    return this.openSection("mainMenu");
  }

  openComingSoon(sectionId) {
    const section = MAIN_SECTIONS[sectionId];

    if (!section) {
      return this.announce("That section is not available.");
    }

    return this.announce(
      `${section.name} is coming in a future Life Unlocked update.`
    );
  }

  // ==========================================================
  // 10. CURRENT ACTIVITY
  // ==========================================================

  getCurrentActivity() {
    return { ...this.state.currentActivity };
  }

  setCurrentActivity(type, label) {
    this.state.currentActivity = {
      type,
      label: label || type,
      startedAt: GameHelpers.now()
    };

    this.autoSave();
    return true;
  }

  // ==========================================================
  // 11. SYSTEM CONNECTORS
  // ==========================================================

  connectSystem(systemId, controller) {
    if (!systemId || !controller) {
      return false;
    }

    this.connectedSystems[systemId] = controller;
    return true;
  }

  disconnectSystem(systemId) {
    delete this.connectedSystems[systemId];
    return true;
  }

  getConnectedSystem(systemId) {
    if (this.connectedSystems[systemId]) {
      return this.connectedSystems[systemId];
    }

    if (
      typeof window !== "undefined" &&
      systemId === "cafe" &&
      window.cafeGame
    ) {
      this.connectedSystems.cafe = window.cafeGame;
      return window.cafeGame;
    }

    if (
      typeof globalThis !== "undefined" &&
      systemId === "cafe" &&
      globalThis.cafeGame
    ) {
      this.connectedSystems.cafe = globalThis.cafeGame;
      return globalThis.cafeGame;
    }

    return null;
  }

  // ==========================================================
  // 12. CAFE CONNECTION
  // ==========================================================

  getCafeController() {
    return this.getConnectedSystem("cafe");
  }

  openCafe() {
    const cafe = this.getCafeController();

    if (!cafe) {
      return this.announce(
        "The cafe system is not connected yet. Make sure cafe.js is loaded."
      );
    }

    this.openSection("cafe");
    return cafe;
  }

  getCafeSummary() {
    const cafe = this.getCafeController();

    if (!cafe) {
      return {
        connected: false,
        message: "Cafe system is not connected."
      };
    }

    if (typeof cafe.getCafeStatus === "function") {
      return {
        connected: true,
        status: cafe.getCafeStatus()
      };
    }

    return {
      connected: true,
      message: "Cafe connected, but status information is unavailable."
    };
  }

  // ==========================================================
  // 13. MONEY TRANSFERS BETWEEN PLAYER AND CAFE
  // ==========================================================

  withdrawFromCafe(amount) {
    const cafe = this.getCafeController();
    const cleanAmount = GameHelpers.roundCoins(amount);

    if (!cafe || !cafe.state) {
      return this.announce(
        "The cafe system is not connected."
      );
    }

    if (cleanAmount <= 0) {
      return this.announce("Enter an amount greater than zero.");
    }

    if (cafe.state.coins < cleanAmount) {
      return this.announce(
        `The cafe does not have enough money. Cafe balance: ${GameHelpers.formatCoins(cafe.state.coins)}.`
      );
    }

    cafe.state.coins -= cleanAmount;
    this.state.player.personalMoney += cleanAmount;

    this.state.statistics.totalCafeWithdrawals += cleanAmount;
    this.state.statistics.totalPersonalIncome += cleanAmount;

    this.recordTransaction({
      type: "cafeWithdrawal",
      amount: cleanAmount,
      description: "Owner withdrawal from cafe"
    });

    if (typeof cafe.updateBusinessValue === "function") {
      cafe.updateBusinessValue();
    }

    if (typeof cafe.save === "function") {
      cafe.save();
    }

    this.addNotification(
      `${GameHelpers.formatCoins(cleanAmount)} transferred from your cafe to personal money.`,
      "finance"
    );

    this.autoSave();

    return this.announce(
      `Withdrawal complete. Personal money: ${GameHelpers.formatCoins(this.state.player.personalMoney)}. Cafe balance: ${GameHelpers.formatCoins(cafe.state.coins)}.`
    );
  }

  investInCafe(amount) {
    const cafe = this.getCafeController();
    const cleanAmount = GameHelpers.roundCoins(amount);

    if (!cafe || !cafe.state) {
      return this.announce(
        "The cafe system is not connected."
      );
    }

    if (cleanAmount <= 0) {
      return this.announce("Enter an amount greater than zero.");
    }

    if (this.state.player.personalMoney < cleanAmount) {
      return this.announce(
        `You do not have enough personal money. Personal balance: ${GameHelpers.formatCoins(this.state.player.personalMoney)}.`
      );
    }

    this.state.player.personalMoney -= cleanAmount;
    cafe.state.coins += cleanAmount;

    this.state.statistics.totalCafeInvestments += cleanAmount;
    this.state.statistics.totalPersonalExpenses += cleanAmount;

    this.recordTransaction({
      type: "cafeInvestment",
      amount: -cleanAmount,
      description: "Personal investment into cafe"
    });

    if (typeof cafe.updateBusinessValue === "function") {
      cafe.updateBusinessValue();
    }

    if (typeof cafe.save === "function") {
      cafe.save();
    }

    this.addNotification(
      `${GameHelpers.formatCoins(cleanAmount)} invested from personal money into your cafe.`,
      "finance"
    );

    this.autoSave();

    return this.announce(
      `Investment complete. Personal money: ${GameHelpers.formatCoins(this.state.player.personalMoney)}. Cafe balance: ${GameHelpers.formatCoins(cafe.state.coins)}.`
    );
  }

  // ==========================================================
  // 14. BUSINESS AND CAREER REGISTRY
  // ==========================================================

  getOwnedBusinesses() {
    return this.state.ownership.businesses
      .map(id => BUSINESS_REGISTRY[id])
      .filter(Boolean);
  }

  ownsBusiness(businessId) {
    return this.state.ownership.businesses.includes(businessId);
  }

  registerBusinessOwnership(businessId) {
    const business = BUSINESS_REGISTRY[businessId];

    if (!business) {
      return this.announce("Business type not found.");
    }

    if (this.ownsBusiness(businessId)) {
      return this.announce(
        `You already own ${business.name}.`
      );
    }

    this.state.ownership.businesses.push(businessId);

    this.addNotification(
      `${business.name} added to your businesses.`,
      "business"
    );

    this.autoSave();
    return true;
  }

  getAvailableCareers() {
    return Object.values(CAREER_REGISTRY).filter(
      career => career.available
    );
  }

  // ==========================================================
  // 15. SIMPLE UNLOCK MANAGER
  // ==========================================================

  unlockSection(sectionId, message = null) {
    if (!(sectionId in this.state.unlocks)) {
      return false;
    }

    if (this.state.unlocks[sectionId]) {
      return true;
    }

    this.state.unlocks[sectionId] = true;

    const section = MAIN_SECTIONS[sectionId];

    this.addNotification(
      message || `${section ? section.name : sectionId} unlocked.`,
      "unlock"
    );

    this.autoSave();
    return true;
  }

  // ==========================================================
  // 16. PLAYER STATUS
  // ==========================================================

  getPlayerStatus() {
    const xp = this.getLifeXPProgress();
    const cafe = this.getCafeSummary();

    return {
      playerName: this.state.player.name,
      personalMoney: this.state.player.personalMoney,
      lifeLevel: this.state.player.lifeLevel,
      lifeXP: this.state.player.lifeXP,
      xpRemaining: xp.xpRemaining,
      currentSection: this.state.navigation.currentSection,
      currentActivity: this.state.currentActivity.label,
      ownedBusinesses: this.getOwnedBusinesses().map(item => item.name),
      unreadNotifications: this.getUnreadNotificationCount(),
      cafeConnected: cafe.connected,
      cafeStatus: cafe.connected ? cafe.status : null
    };
  }

  getPlayerStatusText() {
    const status = this.getPlayerStatus();

    const lines = [
      `${status.playerName}.`,
      `Personal money: ${GameHelpers.formatCoins(status.personalMoney)}.`,
      `Life Level: ${status.lifeLevel}.`,
      `Life XP: ${status.lifeXP}.`,
      `XP until next Life Level: ${status.xpRemaining}.`,
      `Current activity: ${status.currentActivity}.`,
      `Businesses owned: ${status.ownedBusinesses.length > 0 ? status.ownedBusinesses.join(", ") : "None"}.`,
      `Unread notifications: ${status.unreadNotifications}.`
    ];

    if (status.cafeConnected && status.cafeStatus) {
      lines.push(
        `Cafe Level: ${status.cafeStatus.cafeLevel}.`
      );

      lines.push(
        `Cafe business money: ${GameHelpers.formatCoins(status.cafeStatus.coins)}.`
      );

      lines.push(
        `Cafe business value: ${GameHelpers.formatCoins(status.cafeStatus.businessValue)}.`
      );
    } else {
      lines.push("Cafe system is not currently connected.");
    }

    return lines.join(" ");
  }

  getMainMenuSummary() {
    const unread = this.getUnreadNotificationCount();

    return [
      "Life Unlocked Main Menu.",
      `Personal money: ${GameHelpers.formatCoins(this.state.player.personalMoney)}.`,
      `Life Level: ${this.state.player.lifeLevel}.`,
      unread > 0
        ? `${unread} unread notification${unread === 1 ? "" : "s"}.`
        : "No unread notifications."
    ].join(" ");
  }

  // ==========================================================
  // 17. SETTINGS
  // ==========================================================

  setAccessibleAnnouncements(enabled) {
    this.state.settings.accessibleAnnouncements = Boolean(enabled);
    this.autoSave();

    return this.announce(
      `Accessible announcements ${enabled ? "enabled" : "disabled"}.`
    );
  }

  setAutoSave(enabled) {
    this.state.settings.autoSave = Boolean(enabled);

    if (enabled) {
      this.saveMasterGame();
    }

    return this.announce(
      `Automatic saving ${enabled ? "enabled" : "disabled"}.`
    );
  }

  setConfirmLargeTransactions(enabled) {
    this.state.settings.confirmLargeTransactions = Boolean(enabled);
    this.autoSave();

    return this.announce(
      `Large transaction confirmations ${enabled ? "enabled" : "disabled"}.`
    );
  }

  // ==========================================================
  // 18. SAVE AND LOAD
  // ==========================================================

  autoSave() {
    if (this.state.settings.autoSave) {
      this.saveMasterGame();

      const cafe = this.getCafeController();

      if (cafe && typeof cafe.save === "function") {
        cafe.save();
      }
    }
  }

  saveMasterGame() {
    if (typeof localStorage === "undefined") {
      return false;
    }

    try {
      this.state.session.lastOpenedAt = GameHelpers.now();

      localStorage.setItem(
        MASTER_SAVE_KEY,
        JSON.stringify(this.state)
      );

      return true;
    } catch (error) {
      console.error("Life Unlocked master save failed:", error);
      return false;
    }
  }

  saveGame() {
    const masterSaved = this.saveMasterGame();
    const cafe = this.getCafeController();

    let cafeSaved = true;

    if (cafe && typeof cafe.save === "function") {
      cafeSaved = cafe.save();
    }

    if (masterSaved && cafeSaved !== false) {
      return this.announce("Life Unlocked saved.");
    }

    return this.announce(
      "The game could not save all progress."
    );
  }

  loadMasterGame() {
    if (typeof localStorage === "undefined") {
      return false;
    }

    try {
      const raw = localStorage.getItem(MASTER_SAVE_KEY);

      if (!raw) {
        return false;
      }

      const saved = JSON.parse(raw);

      this.state = this.mergeState(
        this.createNewState(),
        saved
      );

      this.state.session.lastOpenedAt = GameHelpers.now();

      return true;
    } catch (error) {
      console.error("Life Unlocked master load failed:", error);
      return false;
    }
  }

  mergeState(defaultState, savedState) {
    const merged = {
      ...defaultState,
      ...savedState
    };

    merged.player = {
      ...defaultState.player,
      ...(savedState.player || {})
    };

    merged.navigation = {
      ...defaultState.navigation,
      ...(savedState.navigation || {})
    };

    if (!Array.isArray(merged.navigation.history)) {
      merged.navigation.history = [];
    }

    merged.currentActivity = {
      ...defaultState.currentActivity,
      ...(savedState.currentActivity || {})
    };

    merged.ownership = {
      ...defaultState.ownership,
      ...(savedState.ownership || {})
    };

    if (!Array.isArray(merged.ownership.businesses)) {
      merged.ownership.businesses = ["cafe"];
    }

    if (!Array.isArray(merged.ownership.careers)) {
      merged.ownership.careers = [];
    }

    merged.unlocks = {
      ...defaultState.unlocks,
      ...(savedState.unlocks || {})
    };

    merged.statistics = {
      ...defaultState.statistics,
      ...(savedState.statistics || {})
    };

    merged.settings = {
      ...defaultState.settings,
      ...(savedState.settings || {})
    };

    merged.session = {
      ...defaultState.session,
      ...(savedState.session || {})
    };

    if (!Array.isArray(merged.transactions)) {
      merged.transactions = [];
    }

    if (!Array.isArray(merged.notifications)) {
      merged.notifications = [];
    }

    return merged;
  }

  // ==========================================================
  // 19. NEW GAME AND RESET
  // ==========================================================

  startNewGame(playerName = "Player") {
    this.state = this.createNewState();

    this.completeNewGameSetup(playerName);

    const cafe = this.getCafeController();

    if (cafe && typeof cafe.resetCafe === "function") {
      cafe.resetCafe();
    }

    this.saveGame();

    return this.state;
  }

  resetMasterProgress() {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(MASTER_SAVE_KEY);
    }

    this.state = this.createNewState();

    this.announce("Life Unlocked master progress has been reset.");
    return true;
  }

  // ==========================================================
  // 20. VERSION MANAGER
  // ==========================================================

  getVersion() {
    return this.state.version;
  }

  isSaveVersionCurrent() {
    return this.state.version === LIFE_UNLOCKED_VERSION;
  }

  // ==========================================================
  // 21. MAIN INITIALIZATION
  // ==========================================================

  initialize() {
    const loaded = this.loadMasterGame();

    this.tryAutoConnectCafe();

    if (!loaded) {
      this.state = this.createNewState();
      this.saveMasterGame();

      return this.announce(
        "Welcome to Life Unlocked. Start a new game to begin."
      );
    }

    if (!this.state.session.hasCompletedNewGameSetup) {
      return this.announce(
        "Life Unlocked loaded. New game setup is not complete."
      );
    }

    const unread = this.getUnreadNotificationCount();

    return this.announce(
      `Welcome back, ${this.state.player.name}. Personal money: ${GameHelpers.formatCoins(this.state.player.personalMoney)}. Life Level ${this.state.player.lifeLevel}. ${unread} unread notification${unread === 1 ? "" : "s"}.`
    );
  }

  tryAutoConnectCafe() {
    const cafe = this.getCafeController();

    if (!cafe) {
      return false;
    }

    this.connectedSystems.cafe = cafe;
    return true;
  }
}

// ============================================================
// 22. CREATE THE MASTER GAME OBJECT
// ============================================================

const lifeUnlockedGame = new LifeUnlockedGame();

// ============================================================
// 23. BROWSER CONNECTION
// ============================================================

if (typeof window !== "undefined") {
  window.lifeUnlockedGame = lifeUnlockedGame;

  if (window.cafeGame) {
    lifeUnlockedGame.connectSystem("cafe", window.cafeGame);
  }

  lifeUnlockedGame.initialize();
}

// ============================================================
// 24. OPTIONAL EXAMPLES FOR INDEX.HTML BUTTONS
// ============================================================
//
// New game:
// lifeUnlockedGame.startNewGame("Player Name");
//
// Main menu:
// lifeUnlockedGame.goToMainMenu();
//
// Open cafe:
// lifeUnlockedGame.openCafe();
//
// Open finances:
// lifeUnlockedGame.openSection("finances");
//
// Player status:
// console.log(lifeUnlockedGame.getPlayerStatusText());
//
// Main menu summary:
// console.log(lifeUnlockedGame.getMainMenuSummary());
//
// Transfer cafe money to personal money:
// lifeUnlockedGame.withdrawFromCafe(500);
//
// Invest personal money into cafe:
// lifeUnlockedGame.investInCafe(500);
//
// Save:
// lifeUnlockedGame.saveGame();
//
// Back:
// lifeUnlockedGame.goBack();
//
// ============================================================
// 25. FUTURE FILE CONNECTIONS
// ============================================================
//
// These systems are intentionally NOT built inside game.js:
//
// bank.js
// house.js
// transport.js
// salon.js
// hotel.js
// airline.js
//
// Each future system should control its own gameplay and connect
// back to this master controller.
//
// ============================================================
// END OF LIFE UNLOCKED MASTER GAME VERSION 1.0
// ============================================================
