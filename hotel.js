/*
Life Unlocked - Hotel
hotel.js
Version 1.0

Purpose:
- Self-contained Hotel career/business system for Life Unlocked.
- Designed to be saved now and connected to game.js/index.html later.
- Accessible text-first design: concise summaries, predictable actions, no visual-only state.

Version 1.0 systems:
Career/XP, employee path, ownership, properties, guests, reservations, rooms,
housekeeping, guest requests, hiring, equipment, supplies, upgrades, reputation,
events, active shifts, idle operations, finances, reports, achievements,
statistics, accessibility announcements, and save/load.
*/

(function (global) {
  "use strict";

  const HOTEL_VERSION = "1.0";
  const SAVE_KEY = "lifeUnlockedHotelV1";

  const CONFIG = Object.freeze({
    startingLevel: 1,
    startingXP: 0,
    startingReputationLevel: 1,
    startingReputationXP: 0,
    startingPersonalMoneyFallback: 1000,
    firstPropertyPrice: 20000,
    starterOperatingFund: 2000,
    starterRooms: 4,
    starterStaffCapacity: 3,
    defaultIdleMinutes: 30,
    shiftGuestGoal: 8,
    shiftGoalBonus: 150,
    maxRecentNames: 20,
    maxNotifications: 50
  });

  const CAREER_ROLES = Object.freeze([
    { id: "bellhop", name: "Bellhop", wage: 25, unlockLevel: 1 },
    { id: "front_desk_agent", name: "Front Desk Agent", wage: 40, unlockLevel: 2 },
    { id: "supervisor", name: "Supervisor", wage: 65, unlockLevel: 4 },
    { id: "assistant_manager", name: "Assistant Manager", wage: 90, unlockLevel: 6 },
    { id: "hotel_manager", name: "Hotel Manager", wage: 125, unlockLevel: 8 },
    { id: "general_manager", name: "General Manager", wage: 175, unlockLevel: 10 }
  ]);

  const EMPLOYEE_ROLES = Object.freeze([
    { id: "housekeeper", name: "Housekeeper", unlockLevel: 1 },
    { id: "front_desk_agent", name: "Front Desk Agent", unlockLevel: 1 },
    { id: "bellhop", name: "Bellhop", unlockLevel: 2 },
    { id: "maintenance_worker", name: "Maintenance Worker", unlockLevel: 4 },
    { id: "supervisor", name: "Supervisor", unlockLevel: 5 },
    { id: "hotel_manager", name: "Hotel Manager", unlockLevel: 7 }
  ]);

  const SKILLS = Object.freeze({
    beginner: { name: "Beginner", hireCost: 100, wage: 18, speed: 1.0 },
    experienced: { name: "Experienced", hireCost: 225, wage: 26, speed: 1.2 },
    skilled: { name: "Skilled", hireCost: 400, wage: 36, speed: 1.45 }
  });

  const PROPERTY_TIERS = Object.freeze([
    { id: "bnb", name: "Bed & Breakfast", unlockLevel: 2, price: 20000, baseRooms: 4, maxRooms: 8, staffCapacity: 3, baseRate: 120 },
    { id: "motel", name: "Motel", unlockLevel: 5, price: 60000, baseRooms: 10, maxRooms: 20, staffCapacity: 7, baseRate: 150 },
    { id: "inn", name: "Inn", unlockLevel: 8, price: 120000, baseRooms: 16, maxRooms: 30, staffCapacity: 10, baseRate: 190 },
    { id: "three_star", name: "3-Star Hotel", unlockLevel: 12, price: 275000, baseRooms: 30, maxRooms: 60, staffCapacity: 18, baseRate: 260 },
    { id: "four_star", name: "4-Star Hotel", unlockLevel: 18, price: 600000, baseRooms: 55, maxRooms: 100, staffCapacity: 30, baseRate: 350 },
    { id: "five_star", name: "5-Star Hotel", unlockLevel: 25, price: 1250000, baseRooms: 90, maxRooms: 160, staffCapacity: 45, baseRate: 500 },
    { id: "luxury_resort", name: "Luxury Resort", unlockLevel: 35, price: 3000000, baseRooms: 150, maxRooms: 300, staffCapacity: 75, baseRate: 750 }
  ]);

  const ROOM_TYPES = Object.freeze({
    standard: { name: "Standard Room", rateMultiplier: 1.0, unlockLevel: 1 },
    deluxe: { name: "Deluxe Room", rateMultiplier: 1.35, unlockLevel: 7 },
    suite: { name: "Suite", rateMultiplier: 1.8, unlockLevel: 9 },
    luxury_suite: { name: "Luxury Suite", rateMultiplier: 2.5, unlockLevel: 15 }
  });

  const LOCATIONS = Object.freeze([
    { id: "small_town", name: "Small Town", demand: 0.9, cost: 0.9 },
    { id: "highway", name: "Highway Area", demand: 1.0, cost: 0.95 },
    { id: "downtown", name: "Downtown", demand: 1.2, cost: 1.15 },
    { id: "airport", name: "Airport District", demand: 1.25, cost: 1.15 },
    { id: "tourist", name: "Tourist Area", demand: 1.3, cost: 1.2 },
    { id: "luxury", name: "Luxury District", demand: 1.45, cost: 1.4 }
  ]);

  const SUPPLY_DEFS = Object.freeze({
    towels: { name: "Towels", starter: 40, unitCost: 4, useChance: 0.85 },
    sheetSets: { name: "Sheet Sets", starter: 20, unitCost: 8, useChance: 0.75 },
    pillowcaseSets: { name: "Pillowcase Sets", starter: 20, unitCost: 5, useChance: 0.7 },
    blankets: { name: "Blankets", starter: 12, unitCost: 10, useChance: 0.15 },
    toiletPaper: { name: "Toilet Paper", starter: 40, unitCost: 2, useChance: 0.8 },
    toiletries: { name: "Toiletries", starter: 40, unitCost: 3, useChance: 0.75 },
    tissues: { name: "Tissues", starter: 20, unitCost: 2, useChance: 0.35 },
    cleaningSupplies: { name: "Cleaning Supplies", starter: 30, unitCost: 6, useChance: 0.8 }
  });

  const EQUIPMENT_DEFS = Object.freeze({
    laundry: { name: "Laundry Equipment", starter: true, unlockLevel: 1, baseCost: 900, effect: "housekeeping" },
    cleaning: { name: "Cleaning Equipment", starter: true, unlockLevel: 1, baseCost: 700, effect: "housekeeping" },
    frontDesk: { name: "Front Desk Computer System", starter: true, unlockLevel: 1, baseCost: 1000, effect: "frontDesk" },
    iceMachine: { name: "Ice Machine", starter: false, unlockLevel: 4, baseCost: 1400, effect: "guestSatisfaction" },
    vendingMachine: { name: "Vending Machine", starter: false, unlockLevel: 5, baseCost: 1800, effect: "passiveRevenue" },
    maintenance: { name: "Maintenance Equipment", starter: false, unlockLevel: 6, baseCost: 2200, effect: "maintenance" }
  });

  const UPGRADE_DEFS = Object.freeze({
    roomCapacity: { name: "Room Capacity", baseCost: 1500, max: 20 },
    roomQuality: { name: "Room Quality", baseCost: 1200, max: 20 },
    cleaningSpeed: { name: "Cleaning Speed", baseCost: 900, max: 20 },
    frontDeskSpeed: { name: "Front Desk Speed", baseCost: 900, max: 20 },
    staffCapacity: { name: "Staff Capacity", baseCost: 1300, max: 20 },
    idleOperatingTime: { name: "Idle Operating Time", baseCost: 1800, max: 5 }
  });

  const IDLE_OPTIONS = Object.freeze([30, 60, 120, 240, 360, 480]);

  const GUEST_TYPES = Object.freeze([
    "Solo Traveler", "Couple", "Family", "Business Traveler", "Tourist"
  ]);

  const FIRST_NAMES = Object.freeze([
    "Aaliyah","Aaron","Abigail","Adam","Adanna","Adrian","Aisha","Alejandro","Alex","Amara",
    "Amir","Ana","Andre","Anika","Antonio","Aria","Asha","Ashley","Ava","Benjamin","Bianca",
    "Blake","Brandon","Brianna","Caleb","Camila","Cameron","Carlos","Carmen","Charlotte","Chloe",
    "Chris","Christian","Christopher","Claire","Daniel","Daniela","Darius","David","Deepa","Diego",
    "Dominique","Dylan","Elena","Elijah","Elizabeth","Ella","Emily","Emma","Ethan","Eva","Fatima",
    "Felipe","Gabriela","Gabriel","Grace","Hannah","Haruto","Hassan","Hector","Henry","Imani",
    "Isabella","Isaiah","Ivan","Jack","Jackson","Jade","Jamal","James","Jasmine","Javier","Jayden",
    "Jennifer","Jordan","Joseph","Joshua","Julia","Kai","Kareem","Karina","Katherine","Keisha",
    "Kenji","Kevin","Layla","Leah","Leo","Liam","Lily","Lucas","Lucia","Luis","Madison","Malik",
    "Marcus","Maria","Mariana","Mateo","Maya","Mei","Michael","Miguel","Mina","Mohammed","Naomi",
    "Natalia","Nathan","Nicholas","Nicole","Noah","Nia","Olivia","Omar","Oscar","Parker","Priya",
    "Rafael","Raj","Rebecca","Riley","Rosa","Ryan","Sabrina","Samuel","Sara","Sebastian","Sofia",
    "Sophia","Taylor","Thomas","Tyler","Valentina","Vanessa","Victor","Victoria","William","Xavier",
    "Yara","Yusuf","Zoe","Zuri","Akira","Alessandra","Ali","Amari","Anaya","Arjun","Ayana","Bao",
    "Celeste","Cesar","Chioma","Dante","Dev","Eden","Elias","Emilio","Esme","Farah","Gianna",
    "Hana","Hugo","Idris","Ines","Jalen","Jamila","Jin","Joaquin","Kiana","Leila","Lorenzo",
    "Luca","Malachi","Mariam","Nadia","Nasir","Neha","Niko","Noor","Penelope","Phoenix","Rina",
    "Rowan","Salma","Santiago","Sasha","Serena","Tariq","Tiana","Tobias","Valeria","Wesley",
    "Xiomara","Yasmin","Yuki","Zara","Zion","Zain","Avery"
  ]);

  const SURNAMES = Object.freeze([
    "Anderson","Ahmed","Alvarez","Baker","Bennett","Brooks","Brown","Campbell","Carter","Chen",
    "Clark","Collins","Davis","Diaz","Edwards","Evans","Garcia","Gonzalez","Green","Hall","Harris",
    "Hernandez","Hill","Jackson","James","Johnson","Jones","Kelly","King","Lee","Lewis","Lopez",
    "Martin","Martinez","Miller","Mitchell","Moore","Morgan","Morris","Murphy","Nelson","Parker",
    "Patel","Perez","Phillips","Price","Ramirez","Reed","Richardson","Rivera","Roberts","Robinson",
    "Rodriguez","Ross","Sanchez","Scott","Smith","Stewart","Taylor","Thomas","Thompson","Turner",
    "Walker","White","Williams","Wilson","Wright","Young","Adams","Alexander","Allen","Bailey",
    "Bell","Bryant","Butler","Cooper","Cox","Foster","Gray","Griffin","Howard","Hughes","Jenkins",
    "Long","Perry","Powell","Russell","Simmons","Ward","Watson","Wood","Barnes","Coleman",
    "Henderson","Patterson","Reynolds","Stevens","Wallace","Washington","Okafor","Adeyemi","Mensah",
    "Boateng","Diallo","Kamara","Traore","Ndlovu","Mbeki","Dlamini","Abara","Chukwu","Eze","Okeke",
    "Ogunleye","Balogun","Adebayo","Osei","Asante","Kone","Rahman","Khan","Ali","Hussain",
    "Siddiqui","Malik","Mahmoud","Haddad","Farah","Saleh","Nasser","Khalil","Mansour","Saeed",
    "Aziz","Qureshi","Sharma","Singh","Kapoor","Mehta","Gupta","Desai","Iyer","Nair","Reddy","Rao",
    "Joshi","Chandra","Mukherjee","Banerjee","Tanaka","Nakamura","Sato","Suzuki","Yamamoto",
    "Kobayashi","Ito","Watanabe","Takahashi","Kim","Park","Choi","Jung","Kang","Lim","Nguyen",
    "Tran","Pham","Le","Hoang","Wang","Zhang","Liu","Li","Huang","Wu","Lin","Zhao","Xu","Sun",
    "Tremblay","Gagnon","Bouchard","Roy","Fortin","Pelletier","Girard","Lefebvre","Moreau","Dubois",
    "Laurent","Rossi","Romano","Bianchi","Ricci","Esposito","Costa","Silva","Pereira","Santos"
  ]);

  const EVENT_DEFS = Object.freeze([
    { id: "festival", name: "Local Festival", text: "Local festival demand has increased bookings.", demandBonus: 0.25 },
    { id: "conference", name: "Business Conference", text: "A business conference is bringing additional travelers.", demandBonus: 0.2 },
    { id: "sports", name: "Sports Tournament", text: "A sports tournament is increasing local hotel demand.", demandBonus: 0.2 },
    { id: "tour_group", name: "Tour Group", text: "A tour group is looking for rooms.", demandBonus: 0.15 },
    { id: "wedding", name: "Wedding Party", text: "A wedding party is requesting a group stay.", demandBonus: 0.2 },
    { id: "vip", name: "VIP Guest", text: "A VIP guest opportunity is available.", demandBonus: 0.1 },
    { id: "maintenance", name: "Maintenance Issue", text: "A room needs routine maintenance.", demandBonus: 0 },
    { id: "staffing", name: "Busy Housekeeping", text: "Housekeeping is unusually busy today.", demandBonus: 0 }
  ]);

  function now() { return Date.now(); }
  function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function money(n) { return Math.round(Number(n) || 0); }
  function uid(prefix) { return prefix + "_" + now().toString(36) + "_" + Math.random().toString(36).slice(2, 8); }

  function getRole(id) { return CAREER_ROLES.find(r => r.id === id) || CAREER_ROLES[0]; }
  function getPropertyTier(id) { return PROPERTY_TIERS.find(p => p.id === id) || PROPERTY_TIERS[0]; }
  function getLocation(id) { return LOCATIONS.find(l => l.id === id) || LOCATIONS[0]; }

  function xpNeededForLevel(level) {
    return Math.round(100 * Math.pow(Math.max(1, level - 1), 1.28));
  }

  function reputationXPNeeded(level) {
    return Math.round(125 * Math.pow(Math.max(1, level), 1.2));
  }

  function createSupplies() {
    const result = {};
    Object.entries(SUPPLY_DEFS).forEach(([id, def]) => { result[id] = def.starter; });
    return result;
  }

  function createEquipment() {
    const result = {};
    Object.entries(EQUIPMENT_DEFS).forEach(([id, def]) => {
      result[id] = { owned: !!def.starter, level: def.starter ? 1 : 0 };
    });
    return result;
  }

  function createUpgrades() {
    const result = {};
    Object.keys(UPGRADE_DEFS).forEach(id => { result[id] = 0; });
    return result;
  }

  function createRoom(number, type = "standard") {
    return {
      id: uid("room"),
      number,
      type,
      status: "ready",
      guestId: null,
      reservedForGuestId: null,
      needsMaintenance: false,
      lifetimeStays: 0,
      lifetimeRevenue: 0
    };
  }

  function createProperty(tierId = "bnb", name = "Maple Street Bed & Breakfast", locationId = "small_town") {
    const tier = getPropertyTier(tierId);
    const rooms = [];
    for (let i = 1; i <= tier.baseRooms; i++) rooms.push(createRoom(i));
    return {
      id: uid("property"),
      name,
      tierId,
      locationId,
      active: false,
      automated: false,
      businessBalance: tierId === "bnb" ? CONFIG.starterOperatingFund : 0,
      rooms,
      employees: [],
      supplies: createSupplies(),
      equipment: createEquipment(),
      upgrades: createUpgrades(),
      guests: [],
      reservations: [],
      requests: [],
      idle: null,
      lifetimeGuests: 0,
      lifetimeRevenue: 0,
      lifetimeExpenses: 0,
      lifetimeProfit: 0,
      highestOccupancy: 0,
      operatingPeriods: 0,
      createdAt: now()
    };
  }

  function initialState() {
    return {
      version: HOTEL_VERSION,
      initialized: true,
      career: {
        level: CONFIG.startingLevel,
        xp: CONFIG.startingXP,
        reputationLevel: CONFIG.startingReputationLevel,
        reputationXP: CONFIG.startingReputationXP,
        employeeRoleId: "bellhop",
        employeePathStarted: false,
        ownerPathStarted: false,
        promotionAvailable: null
      },
      personalMoneyFallback: CONFIG.startingPersonalMoneyFallback,
      ownedProperties: [],
      activePropertyId: null,
      currentShift: null,
      applicants: [],
      recentNames: [],
      notifications: [],
      settings: {
        eventsEnabled: true,
        announcementDetail: "summary",
        autoHire: false,
        autoRestock: false,
        autoRestockThreshold: 10,
        ownerPayPercent: 25
      },
      statistics: {
        activeShifts: 0,
        employeeShifts: 0,
        guestsAssisted: 0,
        guestsServed: 0,
        totalTips: 0,
        totalWages: 0,
        totalHotelRevenue: 0,
        totalHotelExpenses: 0,
        totalHotelProfit: 0,
        propertiesPurchased: 0,
        propertiesSold: 0,
        employeesHired: 0,
        achievementsUnlocked: 0,
        longestIdleMinutes: 0
      },
      achievements: {},
      lastReport: null,
      lastSavedAt: now()
    };
  }

  let state = initialState();

  // ---------------------------------------------------------------------------
  // ACCESSIBILITY / ANNOUNCEMENTS
  // ---------------------------------------------------------------------------

  function announce(message, priority = "normal") {
    const entry = { id: uid("note"), message: String(message), priority, time: now() };
    state.notifications.unshift(entry);
    state.notifications = state.notifications.slice(0, CONFIG.maxNotifications);

    try {
      if (typeof document !== "undefined") {
        const region = document.getElementById("hotel-live-region") ||
                       document.getElementById("live-region") ||
                       document.getElementById("status-message");
        if (region) region.textContent = entry.message;
      }
    } catch (_) {}

    return entry.message;
  }

  function getNotifications(limit = 10) {
    return state.notifications.slice(0, Math.max(1, limit));
  }

  function clearNotifications() {
    state.notifications = [];
    save();
    return "Hotel notifications cleared.";
  }

  // ---------------------------------------------------------------------------
  // SHARED PERSONAL MONEY CONNECTION
  // ---------------------------------------------------------------------------

  function getPersonalMoney() {
    try {
      if (global.LifeUnlockedGame && typeof global.LifeUnlockedGame.getPersonalMoney === "function") {
        return money(global.LifeUnlockedGame.getPersonalMoney());
      }
    } catch (_) {}
    return money(state.personalMoneyFallback);
  }

  function changePersonalMoney(amount) {
    const delta = money(amount);
    try {
      if (global.LifeUnlockedGame && typeof global.LifeUnlockedGame.changePersonalMoney === "function") {
        return global.LifeUnlockedGame.changePersonalMoney(delta);
      }
    } catch (_) {}
    state.personalMoneyFallback = Math.max(0, money(state.personalMoneyFallback + delta));
    save();
    return state.personalMoneyFallback;
  }

  // ---------------------------------------------------------------------------
  // NAMES / GUEST CREATION
  // ---------------------------------------------------------------------------

  function randomName() {
    let full = "";
    let tries = 0;
    do {
      full = pick(FIRST_NAMES) + " " + pick(SURNAMES);
      tries++;
    } while (state.recentNames.includes(full) && tries < 15);
    state.recentNames.unshift(full);
    state.recentNames = state.recentNames.slice(0, CONFIG.maxRecentNames);
    return full;
  }

  function createGuest(options = {}) {
    return {
      id: uid("guest"),
      name: options.name || randomName(),
      type: options.type || pick(GUEST_TYPES),
      nights: options.nights || rand(1, 3),
      roomType: options.roomType || "standard",
      checkedIn: false,
      checkedOut: false,
      roomId: null,
      requestsCompleted: 0,
      createdAt: now()
    };
  }

  // ---------------------------------------------------------------------------
  // CAREER LEVEL / XP / REPUTATION
  // ---------------------------------------------------------------------------

  function addHotelXP(amount) {
    state.career.xp += Math.max(0, money(amount));
    let leveled = false;
    while (state.career.xp >= xpNeededForLevel(state.career.level + 1)) {
      state.career.xp -= xpNeededForLevel(state.career.level + 1);
      state.career.level++;
      leveled = true;
      announce("Hotel Level increased to " + state.career.level + ".", "important");
      checkPromotion();
    }
    checkAchievements();
    save();
    return { level: state.career.level, xp: state.career.xp, leveled };
  }

  function addReputationXP(amount) {
    state.career.reputationXP += Math.max(0, money(amount));
    let leveled = false;
    while (state.career.reputationXP >= reputationXPNeeded(state.career.reputationLevel)) {
      state.career.reputationXP -= reputationXPNeeded(state.career.reputationLevel);
      state.career.reputationLevel++;
      leveled = true;
      announce("Hotel Reputation increased to Level " + state.career.reputationLevel + ".", "important");
    }
    save();
    return { level: state.career.reputationLevel, xp: state.career.reputationXP, leveled };
  }

  function checkPromotion() {
    const currentIndex = CAREER_ROLES.findIndex(r => r.id === state.career.employeeRoleId);
    const next = CAREER_ROLES[currentIndex + 1];
    if (next && state.career.level >= next.unlockLevel) {
      state.career.promotionAvailable = next.id;
      announce("Promotion available: " + next.name + ". You may accept it now or later.", "important");
    }
  }

  function acceptPromotion() {
    if (!state.career.promotionAvailable) return "No hotel promotion is currently available.";
    const role = getRole(state.career.promotionAvailable);
    state.career.employeeRoleId = role.id;
    state.career.promotionAvailable = null;
    save();
    return announce("Promotion accepted. Your hotel employee role is now " + role.name + ".", "important");
  }

  function startEmployeePath() {
    state.career.employeePathStarted = true;
    state.career.employeeRoleId = state.career.employeeRoleId || "bellhop";
    save();
    return announce("Hotel employee career started as Bellhop.");
  }

  // ---------------------------------------------------------------------------
  // PROPERTY OWNERSHIP
  // ---------------------------------------------------------------------------

  function listPropertyOpportunities() {
    return PROPERTY_TIERS.map(t => ({
      id: t.id,
      name: t.name,
      price: t.price,
      unlockLevel: t.unlockLevel,
      unlocked: state.career.level >= t.unlockLevel
    }));
  }

  function buyProperty(tierId = "bnb", options = {}) {
    const tier = getPropertyTier(tierId);
    if (state.career.level < tier.unlockLevel) {
      return { ok: false, message: tier.name + " unlocks at Hotel Level " + tier.unlockLevel + "." };
    }
    if (getPersonalMoney() < tier.price) {
      return { ok: false, message: "You need " + tier.price + " coins to purchase " + tier.name + "." };
    }

    changePersonalMoney(-tier.price);
    const property = createProperty(
      tier.id,
      options.name || ("My " + tier.name),
      options.locationId || "small_town"
    );

    if (tier.id !== "bnb") property.businessBalance = Math.round(tier.price * 0.08);

    state.ownedProperties.push(property);
    state.statistics.propertiesPurchased++;
    state.career.ownerPathStarted = true;

    if (!state.activePropertyId) setActiveProperty(property.id);

    save();
    announce(tier.name + " purchased. It has been added to My Hotels.", "important");
    return { ok: true, property };
  }

  function sellProperty(propertyId) {
    const property = getProperty(propertyId);
    if (!property) return { ok: false, message: "Hotel property not found." };

    const tier = getPropertyTier(property.tierId);
    const saleValue = Math.round(tier.price * 0.65 + property.businessBalance * 0.75);
    changePersonalMoney(saleValue);

    state.ownedProperties = state.ownedProperties.filter(p => p.id !== propertyId);
    state.statistics.propertiesSold++;

    if (state.activePropertyId === propertyId) {
      state.activePropertyId = state.ownedProperties[0]?.id || null;
      if (state.activePropertyId) getProperty(state.activePropertyId).active = true;
    }

    save();
    announce(property.name + " sold for " + saleValue + " coins. Hotel career progress was not reset.", "important");
    return { ok: true, saleValue };
  }

  function getProperty(id = state.activePropertyId) {
    return state.ownedProperties.find(p => p.id === id) || null;
  }

  function setActiveProperty(propertyId) {
    const property = getProperty(propertyId);
    if (!property) return { ok: false, message: "Hotel property not found." };

    state.ownedProperties.forEach(p => {
      p.active = p.id === propertyId;
      if (p.id !== propertyId && p.employees.length > 0) p.automated = true;
    });
    state.activePropertyId = propertyId;
    save();
    return { ok: true, message: property.name + " is now your active hotel workplace." };
  }

  // ---------------------------------------------------------------------------
  // ROOMS / RESERVATIONS / CHECK-IN / CHECKOUT
  // ---------------------------------------------------------------------------

  function roomRate(property, room) {
    const tier = getPropertyTier(property.tierId);
    const location = getLocation(property.locationId);
    const type = ROOM_TYPES[room.type] || ROOM_TYPES.standard;
    const quality = 1 + property.upgrades.roomQuality * 0.06;
    const reputation = 1 + (state.career.reputationLevel - 1) * 0.015;
    return Math.max(25, Math.round(tier.baseRate * location.demand * type.rateMultiplier * quality * reputation));
  }

  function availableRooms(property, type = null) {
    return property.rooms.filter(r =>
      (r.status === "ready" || r.status === "available") &&
      !r.needsMaintenance &&
      (!type || r.type === type)
    );
  }

  function createReservation(propertyId = state.activePropertyId, options = {}) {
    const property = getProperty(propertyId);
    if (!property) return { ok: false, message: "No hotel property selected." };

    const guest = createGuest(options);
    let room = availableRooms(property, guest.roomType)[0] || availableRooms(property)[0];
    if (!room) return { ok: false, message: "No rooms are currently available for this reservation." };

    guest.roomType = room.type;
    property.guests.push(guest);
    room.status = "reserved";
    room.reservedForGuestId = guest.id;

    const reservation = {
      id: uid("reservation"),
      guestId: guest.id,
      roomId: room.id,
      nights: guest.nights,
      status: "reserved",
      createdAt: now()
    };
    property.reservations.push(reservation);
    save();
    return { ok: true, reservation, guest, room };
  }

  function checkInReservation(propertyId, reservationId) {
    const property = getProperty(propertyId);
    if (!property) return { ok: false, message: "Hotel property not found." };
    const reservation = property.reservations.find(r => r.id === reservationId);
    if (!reservation || reservation.status !== "reserved") return { ok: false, message: "Reservation is not available for check-in." };

    const guest = property.guests.find(g => g.id === reservation.guestId);
    const room = property.rooms.find(r => r.id === reservation.roomId);
    if (!guest || !room) return { ok: false, message: "Reservation information is incomplete." };

    guest.checkedIn = true;
    guest.roomId = room.id;
    room.status = "occupied";
    room.guestId = guest.id;
    room.reservedForGuestId = null;
    reservation.status = "checked_in";

    save();
    return { ok: true, message: guest.name + " checked into Room " + room.number + "." };
  }

  function checkoutGuest(propertyId, guestId) {
    const property = getProperty(propertyId);
    if (!property) return { ok: false, message: "Hotel property not found." };
    const guest = property.guests.find(g => g.id === guestId);
    if (!guest || !guest.checkedIn || guest.checkedOut) return { ok: false, message: "Guest is not available for checkout." };

    const room = property.rooms.find(r => r.id === guest.roomId);
    if (!room) return { ok: false, message: "Guest room not found." };

    const revenue = roomRate(property, room) * guest.nights;
    property.businessBalance += revenue;
    property.lifetimeRevenue += revenue;
    property.lifetimeGuests++;
    room.lifetimeRevenue += revenue;
    room.lifetimeStays++;

    guest.checkedOut = true;
    room.status = "needs_cleaning";
    room.guestId = null;

    state.statistics.guestsServed++;
    state.statistics.totalHotelRevenue += revenue;

    addHotelXP(25 + guest.nights * 5);
    addReputationXP(8 + guest.requestsCompleted * 2);

    consumeRoomSupplies(property);
    save();

    return { ok: true, revenue, message: guest.name + " checked out. Room " + room.number + " now needs cleaning." };
  }

  function cleanRoom(propertyId, roomId, automatic = false) {
    const property = getProperty(propertyId);
    if (!property) return { ok: false, message: "Hotel property not found." };
    const room = property.rooms.find(r => r.id === roomId);
    if (!room || room.status !== "needs_cleaning") return { ok: false, message: "That room does not need cleaning." };

    if (property.supplies.cleaningSupplies <= 0) {
      return { ok: false, message: "Cleaning supplies are empty. Restock supplies before cleaning this room." };
    }

    property.supplies.cleaningSupplies--;
    room.status = "ready";
    if (!automatic) addHotelXP(10);
    save();
    return { ok: true, message: "Room " + room.number + " is clean and ready for a new guest." };
  }

  function consumeRoomSupplies(property) {
    Object.entries(SUPPLY_DEFS).forEach(([id, def]) => {
      if (Math.random() <= def.useChance && property.supplies[id] > 0) property.supplies[id]--;
    });
    checkSupplyWarnings(property);
  }

  function occupancy(property) {
    if (!property || !property.rooms.length) return 0;
    const occupied = property.rooms.filter(r => r.status === "occupied").length;
    const percent = Math.round((occupied / property.rooms.length) * 100);
    property.highestOccupancy = Math.max(property.highestOccupancy, percent);
    return percent;
  }

  // ---------------------------------------------------------------------------
  // GUEST REQUESTS
  // ---------------------------------------------------------------------------

  function generateGuestRequest(propertyId = state.activePropertyId) {
    const property = getProperty(propertyId);
    if (!property) return { ok: false, message: "No hotel property selected." };
    const checkedIn = property.guests.filter(g => g.checkedIn && !g.checkedOut);
    if (!checkedIn.length) return { ok: false, message: "There are no checked-in guests requesting assistance." };

    const guest = pick(checkedIn);
    const types = [
      { id: "towels", text: "fresh towels", xp: 20 },
      { id: "toiletries", text: "extra toiletries", xp: 20 },
      { id: "luggage", text: "luggage assistance", xp: 25 },
      { id: "ice", text: "ice", xp: 15 },
      { id: "transport", text: "transportation assistance", xp: 25 }
    ];
    const type = pick(types);
    const request = {
      id: uid("request"),
      guestId: guest.id,
      type: type.id,
      text: type.text,
      xp: type.xp,
      status: "waiting",
      createdAt: now()
    };
    property.requests.push(request);
    save();
    return { ok: true, request, message: guest.name + " needs " + type.text + "." };
  }

  function completeGuestRequest(propertyId, requestId, mode = "player") {
    const property = getProperty(propertyId);
    if (!property) return { ok: false, message: "Hotel property not found." };
    const request = property.requests.find(r => r.id === requestId);
    if (!request || request.status !== "waiting") return { ok: false, message: "Guest request is not available." };

    const guest = property.guests.find(g => g.id === request.guestId);
    request.status = "completed";
    if (guest) guest.requestsCompleted++;

    const tip = mode === "player" ? rand(5, 20) : 0;
    if (mode === "player") {
      addHotelXP(request.xp);
      changePersonalMoney(tip);
      state.statistics.guestsAssisted++;
      state.statistics.totalTips += tip;
    }
    addReputationXP(4);
    save();

    return {
      ok: true,
      tip,
      message: mode === "player"
        ? "Guest request completed. You earned " + request.xp + " Hotel XP and a " + tip + "-coin tip."
        : "Guest request completed automatically."
    };
  }

  // ---------------------------------------------------------------------------
  // EMPLOYEE HIRING
  // ---------------------------------------------------------------------------

  function generateApplicants(roleId = "housekeeper") {
    const role = EMPLOYEE_ROLES.find(r => r.id === roleId);
    if (!role) return { ok: false, message: "Unknown hotel employee role." };
    if (state.career.level < role.unlockLevel) return { ok: false, message: role.name + " unlocks at Hotel Level " + role.unlockLevel + "." };

    const skillIds = Object.keys(SKILLS);
    state.applicants = Array.from({ length: 3 }, () => {
      const skillId = pick(skillIds);
      const skill = SKILLS[skillId];
      return {
        id: uid("applicant"),
        name: randomName(),
        roleId,
        skillId,
        hireCost: skill.hireCost,
        wage: skill.wage,
        speed: skill.speed
      };
    });
    save();
    return { ok: true, applicants: state.applicants };
  }

  function staffCapacity(property) {
    const tier = getPropertyTier(property.tierId);
    return tier.staffCapacity + property.upgrades.staffCapacity;
  }

  function hireApplicant(applicantId, propertyId = state.activePropertyId) {
    const property = getProperty(propertyId);
    if (!property) return { ok: false, message: "No hotel property selected." };
    const applicant = state.applicants.find(a => a.id === applicantId);
    if (!applicant) return { ok: false, message: "Applicant not found." };
    if (property.employees.length >= staffCapacity(property)) return { ok: false, message: "This hotel has reached its current staff capacity." };
    if (property.businessBalance < applicant.hireCost) return { ok: false, message: "The hotel business balance does not have enough coins to hire this applicant." };

    property.businessBalance -= applicant.hireCost;
    const employee = {
      id: uid("employee"),
      name: applicant.name,
      roleId: applicant.roleId,
      skillId: applicant.skillId,
      wage: applicant.wage,
      speed: applicant.speed,
      experience: 0,
      active: true
    };
    property.employees.push(employee);
    state.statistics.employeesHired++;
    state.applicants = [];
    save();

    const role = EMPLOYEE_ROLES.find(r => r.id === employee.roleId);
    return { ok: true, employee, message: employee.name + " was hired as " + role.name + "." };
  }

  function fireEmployee(employeeId, propertyId = state.activePropertyId) {
    const property = getProperty(propertyId);
    if (!property) return { ok: false, message: "No hotel property selected." };
    const employee = property.employees.find(e => e.id === employeeId);
    if (!employee) return { ok: false, message: "Employee not found." };
    property.employees = property.employees.filter(e => e.id !== employeeId);
    save();
    return { ok: true, message: employee.name + " is no longer employed at this hotel." };
  }

  function employeeSummary(propertyId = state.activePropertyId) {
    const property = getProperty(propertyId);
    if (!property) return [];
    return EMPLOYEE_ROLES.map(role => ({
      role: role.name,
      count: property.employees.filter(e => e.roleId === role.id).length
    })).filter(x => x.count > 0);
  }

  // ---------------------------------------------------------------------------
  // SUPPLIES / INVENTORY
  // ---------------------------------------------------------------------------

  function supplyStatus(propertyId = state.activePropertyId) {
    const property = getProperty(propertyId);
    if (!property) return [];
    return Object.entries(SUPPLY_DEFS).map(([id, def]) => ({
      id, name: def.name, quantity: property.supplies[id], unitCost: def.unitCost
    }));
  }

  function restockSupply(supplyId, quantity = 10, propertyId = state.activePropertyId) {
    const property = getProperty(propertyId);
    const def = SUPPLY_DEFS[supplyId];
    if (!property || !def) return { ok: false, message: "Supply item not found." };
    quantity = Math.max(1, money(quantity));
    const cost = quantity * def.unitCost;
    if (property.businessBalance < cost) return { ok: false, message: "The hotel business balance does not have enough coins for this restock." };
    property.businessBalance -= cost;
    property.supplies[supplyId] += quantity;
    recordExpense(property, cost);
    save();
    return { ok: true, cost, message: def.name + " restocked by " + quantity + " units." };
  }

  function restockAll(propertyId = state.activePropertyId, target = 40) {
    const property = getProperty(propertyId);
    if (!property) return { ok: false, message: "No hotel property selected." };
    let totalCost = 0;
    const plan = [];
    Object.entries(SUPPLY_DEFS).forEach(([id, def]) => {
      const need = Math.max(0, target - property.supplies[id]);
      if (need) {
        const cost = need * def.unitCost;
        plan.push({ id, need, cost });
        totalCost += cost;
      }
    });
    if (property.businessBalance < totalCost) return { ok: false, message: "The hotel needs " + totalCost + " coins to complete this full restock." };
    plan.forEach(item => { property.supplies[item.id] += item.need; });
    property.businessBalance -= totalCost;
    recordExpense(property, totalCost);
    save();
    return { ok: true, cost: totalCost, message: "Hotel supplies restocked. Cost: " + totalCost + " coins." };
  }

  function checkSupplyWarnings(property) {
    const low = Object.entries(SUPPLY_DEFS)
      .filter(([id]) => property.supplies[id] <= 5)
      .map(([, def]) => def.name);
    if (low.length) announce("Supply warning: " + low.join(", ") + " running low.", "important");
  }

  // ---------------------------------------------------------------------------
  // EQUIPMENT / MACHINES
  // ---------------------------------------------------------------------------

  function equipmentStatus(propertyId = state.activePropertyId) {
    const property = getProperty(propertyId);
    if (!property) return [];
    return Object.entries(EQUIPMENT_DEFS).map(([id, def]) => ({
      id,
      name: def.name,
      owned: property.equipment[id].owned,
      level: property.equipment[id].level,
      unlocked: state.career.level >= def.unlockLevel
    }));
  }

  function buyEquipment(equipmentId, propertyId = state.activePropertyId) {
    const property = getProperty(propertyId);
    const def = EQUIPMENT_DEFS[equipmentId];
    if (!property || !def) return { ok: false, message: "Equipment not found." };
    if (state.career.level < def.unlockLevel) return { ok: false, message: def.name + " unlocks at Hotel Level " + def.unlockLevel + "." };
    if (property.equipment[equipmentId].owned) return { ok: false, message: def.name + " is already owned." };
    if (property.businessBalance < def.baseCost) return { ok: false, message: "The hotel business balance does not have enough coins." };
    property.businessBalance -= def.baseCost;
    property.equipment[equipmentId] = { owned: true, level: 1 };
    recordExpense(property, def.baseCost);
    save();
    return { ok: true, message: def.name + " purchased." };
  }

  function upgradeEquipment(equipmentId, propertyId = state.activePropertyId) {
    const property = getProperty(propertyId);
    const def = EQUIPMENT_DEFS[equipmentId];
    if (!property || !def || !property.equipment[equipmentId]?.owned) return { ok: false, message: "You must own this equipment before upgrading it." };
    const current = property.equipment[equipmentId].level;
    const cost = Math.round(def.baseCost * (1 + current * 0.75));
    if (property.businessBalance < cost) return { ok: false, message: "The hotel needs " + cost + " coins for this equipment upgrade." };
    property.businessBalance -= cost;
    property.equipment[equipmentId].level++;
    recordExpense(property, cost);
    save();
    return { ok: true, cost, message: def.name + " upgraded to Level " + property.equipment[equipmentId].level + "." };
  }

  // ---------------------------------------------------------------------------
  // HOTEL UPGRADES
  // ---------------------------------------------------------------------------

  function upgradeCost(id, property) {
    const def = UPGRADE_DEFS[id];
    const current = property.upgrades[id] || 0;
    return Math.round(def.baseCost * Math.pow(1.55, current));
  }

  function buyUpgrade(id, propertyId = state.activePropertyId) {
    const property = getProperty(propertyId);
    const def = UPGRADE_DEFS[id];
    if (!property || !def) return { ok: false, message: "Hotel upgrade not found." };
    const current = property.upgrades[id] || 0;
    if (current >= def.max) return { ok: false, message: def.name + " is at the current Version 1.0 upgrade limit." };
    const cost = upgradeCost(id, property);
    if (property.businessBalance < cost) return { ok: false, message: "The hotel needs " + cost + " coins for this upgrade." };

    if (id === "roomCapacity") {
      const tier = getPropertyTier(property.tierId);
      if (property.rooms.length >= tier.maxRooms) return { ok: false, message: "This property has reached its room capacity limit." };
      property.rooms.push(createRoom(property.rooms.length + 1));
    }

    property.businessBalance -= cost;
    property.upgrades[id]++;
    recordExpense(property, cost);
    save();
    return { ok: true, cost, message: def.name + " upgraded to Level " + property.upgrades[id] + "." };
  }

  function unlockedIdleMinutes(property) {
    const level = clamp(property.upgrades.idleOperatingTime || 0, 0, IDLE_OPTIONS.length - 1);
    return IDLE_OPTIONS[level];
  }

  // ---------------------------------------------------------------------------
  // ACTIVE SHIFT
  // ---------------------------------------------------------------------------

  function startShift(mode = "employee", propertyId = state.activePropertyId) {
    if (state.currentShift?.active) return { ok: false, message: "A hotel shift is already active." };

    if (mode === "owner" && !getProperty(propertyId)) {
      return { ok: false, message: "You need an owned hotel property for an owner shift." };
    }

    if (mode === "employee") state.career.employeePathStarted = true;

    state.currentShift = {
      id: uid("shift"),
      active: true,
      mode,
      propertyId: mode === "owner" ? propertyId : null,
      startedAt: now(),
      guestsAssisted: 0,
      tasksCompleted: 0,
      tips: 0,
      revenue: 0,
      xp: 0,
      goalReached: false
    };
    state.statistics.activeShifts++;
    save();
    return { ok: true, message: "Hotel shift started." };
  }

  function performShiftTask() {
    const shift = state.currentShift;
    if (!shift?.active) return { ok: false, message: "Start a hotel shift first." };

    const taskNames = ["Carry luggage", "Deliver fresh towels", "Assist a guest", "Help at the front desk", "Prepare a room update"];
    const task = pick(taskNames);
    const xp = rand(12, 25);
    const tip = rand(5, 20);

    shift.tasksCompleted++;
    shift.guestsAssisted++;
    shift.xp += xp;
    shift.tips += tip;

    addHotelXP(xp);
    changePersonalMoney(tip);
    state.statistics.guestsAssisted++;
    state.statistics.totalTips += tip;

    let bonus = 0;
    if (!shift.goalReached && shift.guestsAssisted >= CONFIG.shiftGuestGoal) {
      shift.goalReached = true;
      bonus = CONFIG.shiftGoalBonus;
      changePersonalMoney(bonus);
      announce("Hotel shift goal reached. Bonus: " + bonus + " coins. You may continue working or end the shift.", "important");
    }

    save();
    return { ok: true, task, xp, tip, bonus, message: task + " completed. Earned " + xp + " Hotel XP and a " + tip + "-coin tip." };
  }

  function endShift() {
    const shift = state.currentShift;
    if (!shift?.active) return { ok: false, message: "There is no active hotel shift." };

    let wage = 0;
    if (shift.mode === "employee") {
      const role = getRole(state.career.employeeRoleId);
      wage = role.wage;
      changePersonalMoney(wage);
      state.statistics.employeeShifts++;
      state.statistics.totalWages += wage;
    }

    shift.active = false;
    const report = {
      type: "active_shift",
      role: shift.mode === "employee" ? getRole(state.career.employeeRoleId).name : "Owner",
      guestsAssisted: shift.guestsAssisted,
      tasksCompleted: shift.tasksCompleted,
      tips: shift.tips,
      wage,
      xp: shift.xp,
      goalReached: shift.goalReached,
      endedAt: now()
    };
    state.lastReport = report;
    save();

    return { ok: true, report, message: "Hotel shift ended. Guests assisted: " + report.guestsAssisted + ". Tips: " + report.tips + " coins. Wage: " + wage + " coins." };
  }

  // ---------------------------------------------------------------------------
  // IDLE OPERATIONS
  // ---------------------------------------------------------------------------

  function essentialStaffing(property) {
    const housekeepers = property.employees.filter(e => e.roleId === "housekeeper").length;
    const frontDesk = property.employees.filter(e => e.roleId === "front_desk_agent").length;
    return {
      housekeepers,
      frontDesk,
      adequate: housekeepers >= 1 && frontDesk >= 1,
      message: housekeepers < 1 ? "Hire at least one Housekeeper." :
               frontDesk < 1 ? "Hire at least one Front Desk Agent." :
               "Essential staffing is ready."
    };
  }

  function startIdleOperation(minutes, propertyId = state.activePropertyId) {
    const property = getProperty(propertyId);
    if (!property) return { ok: false, message: "No hotel property selected." };
    if (property.idle?.active) return { ok: false, message: "This hotel is already operating automatically." };

    const allowed = unlockedIdleMinutes(property);
    minutes = money(minutes);
    if (!IDLE_OPTIONS.includes(minutes) || minutes > allowed) {
      return { ok: false, message: "This hotel currently supports idle operation up to " + allowed + " minutes." };
    }

    const staffing = essentialStaffing(property);
    if (!staffing.adequate) return { ok: false, message: "Hotel cannot begin automatic operation. " + staffing.message };

    property.idle = {
      active: true,
      startTime: now(),
      durationMinutes: minutes,
      endTime: now() + minutes * 60000
    };
    property.automated = true;
    state.statistics.longestIdleMinutes = Math.max(state.statistics.longestIdleMinutes, minutes);
    save();

    return { ok: true, message: property.name + " will operate automatically for " + minutes + " minutes." };
  }

  function simulateIdle(property, minutes) {
    const tier = getPropertyTier(property.tierId);
    const location = getLocation(property.locationId);
    const staffing = essentialStaffing(property);
    const roomCount = property.rooms.length;
    const periods = Math.max(1, Math.round(minutes / 30));

    let guests = 0;
    let roomRevenue = 0;
    let vendingRevenue = 0;
    let wages = 0;
    let supplyCosts = 0;
    let reputationXP = 0;
    let hotelXP = 0;

    const demand = clamp(0.45 + state.career.reputationLevel * 0.02 + (location.demand - 1), 0.35, 0.95);
    const averageRate = Math.round(tier.baseRate * location.demand * (1 + property.upgrades.roomQuality * 0.05));

    for (let p = 0; p < periods; p++) {
      const possibleGuests = Math.max(1, Math.round(roomCount * demand));
      const thisPeriodGuests = rand(Math.max(1, Math.floor(possibleGuests * 0.5)), possibleGuests);
      guests += thisPeriodGuests;
      roomRevenue += thisPeriodGuests * averageRate;

      Object.entries(SUPPLY_DEFS).forEach(([id, def]) => {
        const used = Math.min(property.supplies[id], Math.round(thisPeriodGuests * def.useChance * 0.25));
        property.supplies[id] -= used;
      });
    }

    if (property.equipment.vendingMachine?.owned) {
      vendingRevenue = Math.round(guests * (3 + property.equipment.vendingMachine.level));
    }

    wages = property.employees.reduce((sum, e) => sum + e.wage * periods, 0);
    hotelXP = Math.round(guests * 6 + periods * 10);
    reputationXP = Math.round(guests * 2);

    if (!staffing.adequate) {
      roomRevenue = Math.round(roomRevenue * 0.65);
      reputationXP = Math.round(reputationXP * 0.6);
    }

    if (state.settings.autoRestock) {
      Object.entries(SUPPLY_DEFS).forEach(([id, def]) => {
        if (property.supplies[id] <= state.settings.autoRestockThreshold) {
          const quantity = 40 - property.supplies[id];
          const cost = quantity * def.unitCost;
          if (property.businessBalance + roomRevenue - wages - supplyCosts >= cost) {
            property.supplies[id] += quantity;
            supplyCosts += cost;
          }
        }
      });
    }

    const revenue = roomRevenue + vendingRevenue;
    const expenses = wages + supplyCosts;
    const profit = revenue - expenses;

    property.businessBalance = Math.max(0, property.businessBalance + profit);
    property.lifetimeGuests += guests;
    property.lifetimeRevenue += revenue;
    property.lifetimeExpenses += expenses;
    property.lifetimeProfit += profit;
    property.operatingPeriods++;

    state.statistics.guestsServed += guests;
    state.statistics.totalHotelRevenue += revenue;
    state.statistics.totalHotelExpenses += expenses;
    state.statistics.totalHotelProfit += profit;

    addHotelXP(hotelXP);
    addReputationXP(reputationXP);
    checkSupplyWarnings(property);

    return {
      guests,
      averageOccupancy: Math.min(100, Math.round((guests / Math.max(1, roomCount * periods)) * 100)),
      roomRevenue,
      vendingRevenue,
      revenue,
      employeeWages: wages,
      supplyCosts,
      expenses,
      profit,
      hotelXP,
      reputationXP
    };
  }

  function collectIdleReport(propertyId = state.activePropertyId, force = false) {
    const property = getProperty(propertyId);
    if (!property || !property.idle?.active) return { ok: false, message: "This hotel does not have an active idle operation." };

    const current = now();
    if (!force && current < property.idle.endTime) {
      const remaining = Math.ceil((property.idle.endTime - current) / 60000);
      return { ok: false, message: "Idle operation is still active for about " + remaining + " more minutes." };
    }

    const minutes = property.idle.durationMinutes;
    const results = simulateIdle(property, minutes);
    property.idle.active = false;
    property.automated = false;

    const report = {
      type: "idle",
      propertyId: property.id,
      propertyName: property.name,
      minutes,
      ...results,
      completedAt: now()
    };
    state.lastReport = report;
    save();

    return {
      ok: true,
      report,
      message: property.name + " completed " + minutes + " minutes of automatic operation. Guests served: " + results.guests + ". Profit: " + results.profit + " coins."
    };
  }

  function processCompletedIdleOperations() {
    const reports = [];
    state.ownedProperties.forEach(property => {
      if (property.idle?.active && now() >= property.idle.endTime) {
        const result = collectIdleReport(property.id, true);
        if (result.ok) reports.push(result.report);
      }
    });
    return reports;
  }

  // ---------------------------------------------------------------------------
  // FINANCES
  // ---------------------------------------------------------------------------

  function recordExpense(property, amount) {
    amount = Math.max(0, money(amount));
    property.lifetimeExpenses += amount;
    property.lifetimeProfit -= amount;
    state.statistics.totalHotelExpenses += amount;
    state.statistics.totalHotelProfit -= amount;
  }

  function ownerWithdrawal(amount, propertyId = state.activePropertyId) {
    const property = getProperty(propertyId);
    if (!property) return { ok: false, message: "No hotel property selected." };
    amount = Math.max(1, money(amount));
    if (property.businessBalance < amount) return { ok: false, message: "The hotel business balance does not have enough coins." };
    property.businessBalance -= amount;
    changePersonalMoney(amount);
    save();
    return { ok: true, amount, message: amount + " coins transferred from " + property.name + " to Personal Money." };
  }

  function ownerPayByPercent(propertyId = state.activePropertyId, percent = state.settings.ownerPayPercent) {
    const property = getProperty(propertyId);
    if (!property) return { ok: false, message: "No hotel property selected." };
    percent = clamp(Number(percent) || 0, 0, 100);
    const amount = Math.floor(property.businessBalance * (percent / 100));
    if (amount <= 0) return { ok: false, message: "There are no coins available for this owner payment." };
    return ownerWithdrawal(amount, propertyId);
  }

  function personalInvestment(amount, propertyId = state.activePropertyId) {
    const property = getProperty(propertyId);
    if (!property) return { ok: false, message: "No hotel property selected." };
    amount = Math.max(1, money(amount));
    if (getPersonalMoney() < amount) return { ok: false, message: "You do not have enough Personal Money for this investment." };
    changePersonalMoney(-amount);
    property.businessBalance += amount;
    save();
    return { ok: true, amount, message: amount + " coins invested into " + property.name + "." };
  }

  // ---------------------------------------------------------------------------
  // EVENTS / GROUP BOOKINGS
  // ---------------------------------------------------------------------------

  function generateEvent(propertyId = state.activePropertyId) {
    if (!state.settings.eventsEnabled) return { ok: false, message: "Hotel events are turned off." };
    const property = getProperty(propertyId);
    if (!property) return { ok: false, message: "No hotel property selected." };

    const event = { ...pick(EVENT_DEFS), idInstance: uid("event") };
    if (event.id === "maintenance") {
      const room = pick(property.rooms);
      room.needsMaintenance = true;
      room.status = room.status === "occupied" ? room.status : "maintenance";
    }
    save();
    return { ok: true, event, message: event.name + ": " + event.text };
  }

  function createGroupReservation(propertyId = state.activePropertyId, groupType = "Wedding Party") {
    const property = getProperty(propertyId);
    if (!property) return { ok: false, message: "No hotel property selected." };

    const available = availableRooms(property);
    const requested = Math.min(available.length, rand(3, Math.max(3, Math.min(10, available.length))));
    if (available.length < 3) return { ok: false, message: "Not enough rooms are currently available for a group reservation." };

    const estimatedRevenue = available.slice(0, requested).reduce((sum, room) => sum + roomRate(property, room) * 2, 0);
    return {
      ok: true,
      offer: {
        id: uid("group"),
        groupType,
        roomsRequested: requested,
        nights: 2,
        estimatedRevenue
      },
      message: groupType + " requests " + requested + " rooms for 2 nights. Estimated revenue: " + estimatedRevenue + " coins."
    };
  }

  // ---------------------------------------------------------------------------
  // ACHIEVEMENTS / STATISTICS
  // ---------------------------------------------------------------------------

  const ACHIEVEMENTS = Object.freeze([
    { id: "first_shift", name: "First Shift", test: () => state.statistics.activeShifts >= 1, coins: 100, xp: 25 },
    { id: "first_guest", name: "First Guest", test: () => state.statistics.guestsServed >= 1, coins: 100, xp: 25 },
    { id: "first_property", name: "Hotelier", test: () => state.statistics.propertiesPurchased >= 1, coins: 250, xp: 50 },
    { id: "first_employee", name: "Growing Team", test: () => state.statistics.employeesHired >= 1, coins: 150, xp: 30 },
    { id: "guests_25", name: "Getting Busy", test: () => state.statistics.guestsServed >= 25, coins: 500, xp: 100 },
    { id: "guests_100", name: "Hospitality Builder", test: () => state.statistics.guestsServed >= 100, coins: 1000, xp: 200 },
    { id: "guests_1000", name: "Hospitality Pro", test: () => state.statistics.guestsServed >= 1000, coins: 5000, xp: 750 }
  ]);

  function checkAchievements() {
    const unlockedNow = [];
    ACHIEVEMENTS.forEach(a => {
      if (!state.achievements[a.id] && a.test()) {
        state.achievements[a.id] = { unlockedAt: now(), name: a.name };
        state.statistics.achievementsUnlocked++;
        changePersonalMoney(a.coins);
        state.career.xp += a.xp; // Avoid recursive achievement checking.
        unlockedNow.push(a);
        announce("Achievement unlocked: " + a.name + ". Reward: " + a.coins + " coins and " + a.xp + " Hotel XP.", "important");
      }
    });
    return unlockedNow;
  }

  function getStatistics() {
    return JSON.parse(JSON.stringify({
      career: state.career,
      statistics: state.statistics,
      propertiesOwned: state.ownedProperties.length,
      personalMoney: getPersonalMoney()
    }));
  }

  // ---------------------------------------------------------------------------
  // SUMMARIES / REPORTS
  // ---------------------------------------------------------------------------

  function hotelSummary(propertyId = state.activePropertyId) {
    const property = getProperty(propertyId);
    if (!property) {
      const role = getRole(state.career.employeeRoleId);
      return {
        ownership: "No hotel property owned or selected.",
        careerLevel: state.career.level,
        careerXP: state.career.xp,
        employeeRole: role.name,
        personalMoney: getPersonalMoney()
      };
    }

    const occupied = property.rooms.filter(r => r.status === "occupied").length;
    const cleaning = property.rooms.filter(r => r.status === "needs_cleaning").length;
    const maintenance = property.rooms.filter(r => r.needsMaintenance || r.status === "maintenance").length;

    return {
      property: property.name,
      propertyTier: getPropertyTier(property.tierId).name,
      location: getLocation(property.locationId).name,
      hotelLevel: state.career.level,
      reputationLevel: state.career.reputationLevel,
      roomsOccupied: occupied,
      roomsTotal: property.rooms.length,
      occupancyPercent: occupancy(property),
      roomsNeedingCleaning: cleaning,
      roomsNeedingMaintenance: maintenance,
      employees: property.employees.length,
      staffCapacity: staffCapacity(property),
      businessBalance: property.businessBalance,
      personalMoney: getPersonalMoney(),
      status: property.idle?.active ? "Operating Automatically" : property.active ? "Active Workplace" : "Not Active"
    };
  }

  function businessReport(propertyId = state.activePropertyId) {
    const property = getProperty(propertyId);
    if (!property) return null;
    return {
      property: property.name,
      lifetimeGuests: property.lifetimeGuests,
      lifetimeRevenue: property.lifetimeRevenue,
      lifetimeExpenses: property.lifetimeExpenses,
      lifetimeProfit: property.lifetimeProfit,
      businessBalance: property.businessBalance,
      highestOccupancy: property.highestOccupancy,
      operatingPeriods: property.operatingPeriods,
      supplies: supplyStatus(property.id),
      employees: employeeSummary(property.id)
    };
  }

  function allBusinessSummary() {
    const properties = state.ownedProperties.map(p => ({
      id: p.id,
      name: p.name,
      tier: getPropertyTier(p.tierId).name,
      balance: p.businessBalance,
      status: p.idle?.active ? "Operating Automatically" : p.active ? "Active Workplace" : p.automated ? "Automated" : "Closed",
      occupancy: occupancy(p)
    }));
    return {
      properties,
      totalHotelBusinessBalances: properties.reduce((s, p) => s + p.balance, 0),
      personalMoney: getPersonalMoney()
    };
  }

  // ---------------------------------------------------------------------------
  // SETTINGS
  // ---------------------------------------------------------------------------

  function updateSetting(name, value) {
    if (!(name in state.settings)) return { ok: false, message: "Unknown hotel setting." };
    state.settings[name] = value;
    save();
    return { ok: true, message: "Hotel setting updated: " + name + "." };
  }

  // ---------------------------------------------------------------------------
  // SAVE / LOAD / RESET
  // ---------------------------------------------------------------------------

  function save() {
    state.lastSavedAt = now();
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(SAVE_KEY, JSON.stringify(state));
        return true;
      }
    } catch (_) {}
    return false;
  }

  function load() {
    try {
      if (typeof localStorage !== "undefined") {
        const raw = localStorage.getItem(SAVE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          state = Object.assign(initialState(), parsed);
          state.settings = Object.assign(initialState().settings, parsed.settings || {});
          state.statistics = Object.assign(initialState().statistics, parsed.statistics || {});
          state.career = Object.assign(initialState().career, parsed.career || {});
          processCompletedIdleOperations();
          return true;
        }
      }
    } catch (_) {}
    return false;
  }

  function exportSave() {
    return JSON.stringify(state, null, 2);
  }

  function importSave(json) {
    try {
      const parsed = JSON.parse(json);
      if (!parsed || typeof parsed !== "object") throw new Error("Invalid hotel save.");
      state = Object.assign(initialState(), parsed);
      save();
      return { ok: true, message: "Hotel save imported." };
    } catch (error) {
      return { ok: false, message: "Hotel save could not be imported: " + error.message };
    }
  }

  function resetHotel() {
    state = initialState();
    try {
      if (typeof localStorage !== "undefined") localStorage.removeItem(SAVE_KEY);
    } catch (_) {}
    save();
    return "Hotel Version 1.0 progress reset.";
  }

  // ---------------------------------------------------------------------------
  // PUBLIC API
  // ---------------------------------------------------------------------------

  const HotelGame = {
    version: HOTEL_VERSION,
    config: CONFIG,
    constants: {
      careerRoles: CAREER_ROLES,
      employeeRoles: EMPLOYEE_ROLES,
      skills: SKILLS,
      propertyTiers: PROPERTY_TIERS,
      roomTypes: ROOM_TYPES,
      locations: LOCATIONS,
      supplies: SUPPLY_DEFS,
      equipment: EQUIPMENT_DEFS,
      upgrades: UPGRADE_DEFS,
      idleOptions: IDLE_OPTIONS
    },

    getState: () => state,
    getPersonalMoney,
    changePersonalMoney,

    announce,
    getNotifications,
    clearNotifications,

    startEmployeePath,
    acceptPromotion,
    addHotelXP,
    addReputationXP,

    listPropertyOpportunities,
    buyProperty,
    sellProperty,
    getProperty,
    setActiveProperty,

    createGuest,
    createReservation,
    checkInReservation,
    checkoutGuest,
    cleanRoom,
    occupancy,
    hotelSummary,

    generateGuestRequest,
    completeGuestRequest,

    generateApplicants,
    hireApplicant,
    fireEmployee,
    employeeSummary,

    supplyStatus,
    restockSupply,
    restockAll,

    equipmentStatus,
    buyEquipment,
    upgradeEquipment,
    buyUpgrade,
    unlockedIdleMinutes,

    startShift,
    performShiftTask,
    endShift,

    essentialStaffing,
    startIdleOperation,
    collectIdleReport,
    processCompletedIdleOperations,

    ownerWithdrawal,
    ownerPayByPercent,
    personalInvestment,

    generateEvent,
    createGroupReservation,

    checkAchievements,
    getStatistics,
    businessReport,
    allBusinessSummary,

    updateSetting,
    save,
    load,
    exportSave,
    importSave,
    resetHotel
  };

  global.HotelGame = HotelGame;

  // Load existing Hotel V1.0 data when possible.
  load();

  if (typeof module !== "undefined" && module.exports) {
    module.exports = HotelGame;
  }

})(typeof window !== "undefined" ? window : globalThis);
