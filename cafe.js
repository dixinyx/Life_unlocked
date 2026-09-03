// Life Unlocked - Cafe Version 1.0
// Master cafe.js file
// This file is designed as the main controller for the cafe gameplay system.

// ============================================================
// 1. BASIC HELPERS
// ============================================================

const CafeHelpers = {
  randomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
  },

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  },

  roundCoins(value) {
    return Math.max(0, Math.round(value));
  },

  formatCoins(value) {
    return `${this.roundCoins(value).toLocaleString()} coins`;
  },

  now() {
    return Date.now();
  }
};

// ============================================================
// 2. RANDOM NAME POOLS
// ============================================================

const CAFE_FIRST_NAMES = [
  "Alex", "Taylor", "Jordan", "Morgan", "Casey", "Riley", "Avery", "Cameron",
  "Quinn", "Parker", "Rowan", "Sage", "Skyler", "Emerson", "Finley", "Dakota",
  "Hayden", "Kai", "River", "Phoenix", "Jamie", "Robin", "Reese", "Blake",
  "Drew", "Shawn", "Logan", "Emma", "Olivia", "Sophia", "Noah", "Ava",
  "Ethan", "Lucas", "Amelia", "Charlotte", "Mason", "Leo", "Mia", "Henry",
  "Ella", "Grace", "Benjamin", "Zoe", "Nathan", "Aria", "Julian", "Priya",
  "Mateo", "Aaliyah", "Malik", "Mei", "Diego", "Samira", "Andre", "Nadia",
  "Jamal", "Leila", "Hugo", "Imani", "Sofia", "Mateus", "Keisha", "Arjun"
];

const CAFE_LAST_NAMES = [
  "Bennett", "Morgan", "Lee", "Patel", "Williams", "Chen", "Thompson", "Garcia",
  "Johnson", "Brown", "Martinez", "Wilson", "Singh", "Nguyen", "Robinson",
  "Campbell", "Clarke", "Davis", "Lopez", "Martin", "Walker", "Lewis",
  "Anderson", "Taylor", "Thomas", "Moore", "Jackson", "White", "Harris",
  "Young", "King", "Wright", "Scott", "Green", "Baker", "Adams", "Nelson",
  "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Parker",
  "Evans", "Collins", "Stewart", "Morris", "Rogers", "Reed"
];

// ============================================================
// 3. MENU, RECIPES, PRICES, AND UNLOCKS
// ============================================================

const CAFE_MENU = {
  coffee: {
    id: "coffee",
    name: "Coffee",
    type: "drink",
    machine: "coffeeMachine",
    unlockLevel: 1,
    prepTime: 5,
    prices: { small: 5, medium: 7, large: 9 },
    costs: { small: 2, medium: 3, large: 4 }
  },

  icedCappuccino: {
    id: "icedCappuccino",
    name: "Iced Cappuccino",
    type: "drink",
    machine: "blender",
    unlockLevel: 4,
    prepTime: 8,
    prices: { small: 7, medium: 9, large: 11 },
    costs: { small: 3, medium: 4, large: 5 }
  },

  latte: {
    id: "latte",
    name: "Latte",
    type: "drink",
    machine: "espressoMachine",
    unlockLevel: 2,
    prepTime: 8,
    prices: { small: 7, medium: 9, large: 11 },
    costs: { small: 3, medium: 4, large: 5 }
  },

  hotChocolate: {
    id: "hotChocolate",
    name: "Hot Chocolate",
    type: "drink",
    machine: "hotDrinkStation",
    unlockLevel: 1,
    prepTime: 7,
    prices: { small: 6, medium: 8, large: 10 },
    costs: { small: 2, medium: 3, large: 4 }
  },

  fruitSmoothie: {
    id: "fruitSmoothie",
    name: "Fruit Smoothie",
    type: "drink",
    machine: "blender",
    unlockLevel: 4,
    prepTime: 10,
    prices: { small: 8, medium: 10, large: 12 },
    costs: { small: 4, medium: 5, large: 6 }
  },

  tea: {
    id: "tea",
    name: "Tea",
    type: "drink",
    machine: "hotDrinkStation",
    unlockLevel: 1,
    prepTime: 5,
    prices: { small: 4, medium: 6, large: 8 },
    costs: { small: 1, medium: 2, large: 3 }
  },

  mocha: {
    id: "mocha",
    name: "Mocha",
    type: "drink",
    machine: "espressoMachine",
    unlockLevel: 6,
    prepTime: 9,
    prices: { small: 8, medium: 10, large: 12 },
    costs: { small: 3, medium: 4, large: 5 }
  },

  cappuccino: {
    id: "cappuccino",
    name: "Cappuccino",
    type: "drink",
    machine: "espressoMachine",
    unlockLevel: 2,
    prepTime: 8,
    prices: { small: 7, medium: 9, large: 11 },
    costs: { small: 3, medium: 4, large: 5 }
  },

  candyCaneHotChocolate: {
    id: "candyCaneHotChocolate",
    name: "Candy Cane Hot Chocolate",
    type: "drink",
    machine: "hotDrinkStation",
    unlockLevel: 9,
    prepTime: 9,
    prices: { small: 8, medium: 10, large: 12 },
    costs: { small: 3, medium: 4, large: 5 }
  },

  pumpkinSpiceLatte: {
    id: "pumpkinSpiceLatte",
    name: "Pumpkin Spice Latte",
    type: "drink",
    machine: "espressoMachine",
    unlockLevel: 8,
    prepTime: 10,
    prices: { small: 9, medium: 11, large: 13 },
    costs: { small: 4, medium: 5, large: 6 }
  },

  confettiIcedCappuccino: {
    id: "confettiIcedCappuccino",
    name: "Confetti Iced Cappuccino",
    type: "drink",
    machine: "blender",
    unlockLevel: 7,
    prepTime: 10,
    prices: { small: 9, medium: 11, large: 13 },
    costs: { small: 4, medium: 5, large: 6 }
  },

  grilledCheese: {
    id: "grilledCheese",
    name: "Grilled Cheese",
    type: "grill",
    machine: "grill",
    unlockLevel: 1,
    prepTime: 10,
    price: 10,
    cost: 4
  },

  sandwich: {
    id: "sandwich",
    name: "Sandwich",
    type: "grill",
    machine: "grill",
    unlockLevel: 1,
    prepTime: 12,
    price: 12,
    cost: 5
  },

  chocolateChipMuffin: {
    id: "chocolateChipMuffin",
    name: "Chocolate Chip Muffin",
    type: "bakery",
    unlockLevel: 3,
    price: 6,
    batchSize: 6,
    batchCost: 12,
    bakeTime: 30
  },

  blueberryMuffin: {
    id: "blueberryMuffin",
    name: "Blueberry Muffin",
    type: "bakery",
    unlockLevel: 3,
    price: 6,
    batchSize: 6,
    batchCost: 12,
    bakeTime: 30
  },

  croissant: {
    id: "croissant",
    name: "Croissant",
    type: "bakery",
    unlockLevel: 3,
    price: 7,
    batchSize: 6,
    batchCost: 18,
    bakeTime: 45
  },

  cinnamonRoll: {
    id: "cinnamonRoll",
    name: "Cinnamon Roll",
    type: "bakery",
    unlockLevel: 5,
    price: 8,
    batchSize: 6,
    batchCost: 18,
    bakeTime: 45
  },

  chocolateDonut: {
    id: "chocolateDonut",
    name: "Chocolate Donut",
    type: "bakery",
    unlockLevel: 5,
    price: 6,
    batchSize: 8,
    batchCost: 20,
    bakeTime: 45
  },

  cheeseDanish: {
    id: "cheeseDanish",
    name: "Cheese Danish",
    type: "bakery",
    unlockLevel: 5,
    price: 8,
    batchSize: 6,
    batchCost: 18,
    bakeTime: 45
  },

  chocolateChipCookie: {
    id: "chocolateChipCookie",
    name: "Chocolate Chip Cookie",
    type: "bakery",
    unlockLevel: 3,
    price: 4,
    batchSize: 12,
    batchCost: 18,
    bakeTime: 30
  },

  peanutButterCookie: {
    id: "peanutButterCookie",
    name: "Peanut Butter Cookie",
    type: "bakery",
    unlockLevel: 3,
    price: 4,
    batchSize: 12,
    batchCost: 18,
    bakeTime: 30
  },

  oatmealCookie: {
    id: "oatmealCookie",
    name: "Oatmeal Cookie",
    type: "bakery",
    unlockLevel: 3,
    price: 4,
    batchSize: 12,
    batchCost: 18,
    bakeTime: 30
  }
};



// ============================================================
// 3A. SHIFT DIFFICULTIES AND ECONOMY
// ============================================================

const CAFE_DIFFICULTIES = {
  beginner: {
    id: "beginner",
    name: "Beginner",
    automaticCustomers: false,
    arrivalSeconds: null,
    earningsMultiplier: 1.00,
    patienceSeconds: null,
    description: "Relaxed play. You choose when each counter customer arrives."
  },
  easy: {
    id: "easy",
    name: "Easy",
    automaticCustomers: true,
    arrivalSeconds: 14,
    earningsMultiplier: 1.10,
    patienceSeconds: 60,
    description: "Customers arrive automatically at a relaxed pace. Earnings bonus: 10 percent."
  },
  medium: {
    id: "medium",
    name: "Medium",
    automaticCustomers: true,
    arrivalSeconds: 10,
    earningsMultiplier: 1.25,
    patienceSeconds: 45,
    description: "Customers arrive automatically at a steady pace. Earnings bonus: 25 percent."
  },
  hard: {
    id: "hard",
    name: "Hard",
    automaticCustomers: true,
    arrivalSeconds: 7,
    earningsMultiplier: 1.50,
    patienceSeconds: 30,
    description: "Customers arrive automatically at a fast pace. Earnings bonus: 50 percent."
  },
  expert: {
    id: "expert",
    name: "Expert",
    automaticCustomers: true,
    arrivalSeconds: 5,
    earningsMultiplier: 1.80,
    patienceSeconds: 20,
    description: "Customers arrive automatically very quickly. Earnings bonus: 80 percent."
  }
};

const CAFE_BASE_PRICE_MULTIPLIER = 1.5;

// ============================================================
// 4. SUPPLIES, PACKAGES, AND RECIPES
// ============================================================

const CAFE_SUPPLIES = {
  coffeeBeans: { name: "Coffee Beans", maxStock: 500, smallPack: 10, smallCost: 12, bulkPack: 25, bulkCost: 27 },
  milk: { name: "Milk", maxStock: 500, smallPack: 10, smallCost: 10, bulkPack: 25, bulkCost: 22 },
  teaBags: { name: "Tea Bags", maxStock: 500, smallPack: 10, smallCost: 8, bulkPack: 25, bulkCost: 18 },
  hotChocolateMix: { name: "Hot Chocolate Mix", maxStock: 500, smallPack: 10, smallCost: 10, bulkPack: 25, bulkCost: 22 },
  fruit: { name: "Fruit", maxStock: 500, smallPack: 10, smallCost: 14, bulkPack: 25, bulkCost: 31 },
  bread: { name: "Bread", maxStock: 500, smallPack: 10, smallCost: 8, bulkPack: 25, bulkCost: 18 },
  sandwichMeat: { name: "Sandwich Meat", maxStock: 500, smallPack: 10, smallCost: 14, bulkPack: 25, bulkCost: 31 },
  cheese: { name: "Cheese", maxStock: 500, smallPack: 10, smallCost: 11, bulkPack: 25, bulkCost: 24 },
  muffinMix: { name: "Muffin Mix", maxStock: 500, smallPack: 10, smallCost: 12, bulkPack: 25, bulkCost: 27 },
  chocolateChips: { name: "Chocolate Chips", maxStock: 500, smallPack: 10, smallCost: 9, bulkPack: 25, bulkCost: 20 },
  blueberries: { name: "Blueberries", maxStock: 500, smallPack: 10, smallCost: 12, bulkPack: 25, bulkCost: 27 },
  caramelSyrup: { name: "Caramel Syrup", maxStock: 500, smallPack: 10, smallCost: 10, bulkPack: 25, bulkCost: 22 },
  chocolateSyrup: { name: "Chocolate Syrup", maxStock: 500, smallPack: 10, smallCost: 10, bulkPack: 25, bulkCost: 22 },
  pastryDough: { name: "Pastry Dough", maxStock: 500, smallPack: 10, smallCost: 13, bulkPack: 25, bulkCost: 29 },
  cookieDough: { name: "Cookie Dough", maxStock: 500, smallPack: 10, smallCost: 11, bulkPack: 25, bulkCost: 24 },
  cinnamonFilling: { name: "Cinnamon Filling", maxStock: 500, smallPack: 10, smallCost: 9, bulkPack: 25, bulkCost: 20 },
  donutMix: { name: "Donut Mix", maxStock: 500, smallPack: 10, smallCost: 12, bulkPack: 25, bulkCost: 27 },
  danishFilling: { name: "Danish Filling", maxStock: 500, smallPack: 10, smallCost: 11, bulkPack: 25, bulkCost: 24 },
  specialtyFlavor: { name: "Specialty Flavor", maxStock: 500, smallPack: 10, smallCost: 12, bulkPack: 25, bulkCost: 27 },
  cups: { name: "Cups and Lids", maxStock: 500, smallPack: 20, smallCost: 8, bulkPack: 50, bulkCost: 18 }
};

const CAFE_RECIPES = {
  coffee: { coffeeBeans: 1, cups: 1 },
  icedCappuccino: { coffeeBeans: 1, milk: 1, cups: 1 },
  latte: { coffeeBeans: 1, milk: 1, cups: 1 },
  hotChocolate: { hotChocolateMix: 1, milk: 1, cups: 1 },
  fruitSmoothie: { fruit: 2, milk: 1, cups: 1 },
  tea: { teaBags: 1, cups: 1 },
  mocha: { coffeeBeans: 1, milk: 1, chocolateSyrup: 1, cups: 1 },
  cappuccino: { coffeeBeans: 1, milk: 1, cups: 1 },
  candyCaneHotChocolate: { hotChocolateMix: 1, milk: 1, specialtyFlavor: 1, cups: 1 },
  pumpkinSpiceLatte: { coffeeBeans: 1, milk: 1, specialtyFlavor: 1, cups: 1 },
  confettiIcedCappuccino: { coffeeBeans: 1, milk: 1, specialtyFlavor: 1, cups: 1 },

  grilledCheese: { bread: 2, cheese: 1 },
  sandwich: { bread: 2, sandwichMeat: 1, cheese: 1 },

  chocolateChipMuffin: { muffinMix: 6, chocolateChips: 3 },
  blueberryMuffin: { muffinMix: 6, blueberries: 3 },
  croissant: { pastryDough: 6 },
  cinnamonRoll: { pastryDough: 6, cinnamonFilling: 3 },
  chocolateDonut: { donutMix: 6, chocolateSyrup: 3 },
  cheeseDanish: { pastryDough: 6, danishFilling: 3 },
  chocolateChipCookie: { cookieDough: 12, chocolateChips: 3 },
  peanutButterCookie: { cookieDough: 12, specialtyFlavor: 3 },
  oatmealCookie: { cookieDough: 12, specialtyFlavor: 2 }
};

// ============================================================
// 4. MACHINES AND EQUIPMENT
// ============================================================

const MACHINE_DEFINITIONS = {
  coffeeMachine: {
    name: "Coffee Machine",
    unlockLevel: 1,
    baseCost: 100,
    maxCopies: 4
  },

  hotDrinkStation: {
    name: "Hot Drink Station",
    unlockLevel: 1,
    baseCost: 100,
    maxCopies: 4
  },

  grill: {
    name: "Grill",
    unlockLevel: 1,
    baseCost: 150,
    maxCopies: 4
  },

  espressoMachine: {
    name: "Espresso Machine",
    unlockLevel: 2,
    baseCost: 150,
    maxCopies: 4
  },

  oven: {
    name: "Oven",
    unlockLevel: 3,
    baseCost: 200,
    maxCopies: 4
  },

  blender: {
    name: "Blender",
    unlockLevel: 4,
    baseCost: 125,
    maxCopies: 4
  }
};


const MACHINE_TIERS = [
  { id: "standard", name: "Standard", unlockLevel: 1, speedMultiplier: 1.00, capacityMultiplier: 1, upgradeCostMultiplier: 0 },
  { id: "deluxe", name: "Deluxe", unlockLevel: 5, speedMultiplier: 0.82, capacityMultiplier: 2, upgradeCostMultiplier: 3 },
  { id: "supreme", name: "Supreme", unlockLevel: 10, speedMultiplier: 0.65, capacityMultiplier: 4, upgradeCostMultiplier: 6 },
  { id: "turbo", name: "Turbo", unlockLevel: 15, speedMultiplier: 0.48, capacityMultiplier: 6, upgradeCostMultiplier: 10 },
  { id: "ultra", name: "Ultra", unlockLevel: 20, speedMultiplier: 0.32, capacityMultiplier: 10, upgradeCostMultiplier: 16 }
];

// ============================================================
// 5. EMPLOYEES
// ============================================================

const EMPLOYEE_ROLES = {
  cashier: {
    name: "Cashier",
    unlockLevel: 1,
    description: "Helps accept and process customer orders."
  },

  barista: {
    name: "Barista",
    unlockLevel: 2,
    description: "Helps prepare drinks."
  },

  baker: {
    name: "Baker",
    unlockLevel: 3,
    description: "Helps keep bakery items stocked."
  },

  driveThruWorker: {
    name: "Drive-Thru Worker",
    unlockLevel: 4,
    description: "Helps handle drive-thru customers."
  },

  cleaner: {
    name: "Cleaner",
    unlockLevel: 5,
    description: "Automatically cleans dining tables during active café shifts."
  },

  assistantManager: {
    name: "Assistant Manager",
    unlockLevel: 6,
    description: "Improves automation and idle operations."
  }
};

const EMPLOYEE_SKILLS = {
  beginner: {
    name: "Beginner",
    hiringCost: 50,
    wage: 10,
    speedMultiplier: 1
  },

  experienced: {
    name: "Experienced",
    hiringCost: 100,
    wage: 20,
    speedMultiplier: 0.8
  },

  skilled: {
    name: "Skilled",
    hiringCost: 150,
    wage: 30,
    speedMultiplier: 0.6
  }
};

// ============================================================
// 6. LOCATIONS
// ============================================================

const CAFE_LOCATIONS = [
  {
    id: "starter",
    name: "Starter Cafe",
    cost: 0,
    trafficMultiplier: 1,
    operatingCostMultiplier: 1,
    employeeCapacityBonus: 0,
    machineCapacityBonus: 0,
    description: "A small starter cafe with low traffic and simple operating costs."
  },
  {
    id: "smallTown",
    name: "Small Town Cafe",
    cost: 20000,
    trafficMultiplier: 1.1,
    operatingCostMultiplier: 1.05,
    employeeCapacityBonus: 1,
    machineCapacityBonus: 0,
    description: "A friendly small-town cafe with steady traffic and manageable expenses."
  },
  {
    id: "suburban",
    name: "Suburban Cafe",
    cost: 50000,
    trafficMultiplier: 1.25,
    operatingCostMultiplier: 1.1,
    employeeCapacityBonus: 2,
    machineCapacityBonus: 1,
    description: "A larger suburban cafe with moderate traffic and more room to grow."
  },
  {
    id: "city",
    name: "City Cafe",
    cost: 100000,
    trafficMultiplier: 1.45,
    operatingCostMultiplier: 1.2,
    employeeCapacityBonus: 3,
    machineCapacityBonus: 1,
    description: "A busy city cafe with strong customer traffic and higher operating costs."
  },
  {
    id: "downtown",
    name: "Downtown Cafe",
    cost: 250000,
    trafficMultiplier: 1.7,
    operatingCostMultiplier: 1.35,
    employeeCapacityBonus: 4,
    machineCapacityBonus: 2,
    description: "A very busy downtown cafe with strong earning potential."
  },
  {
    id: "metropolis",
    name: "Metropolis Cafe",
    cost: 500000,
    trafficMultiplier: 2,
    operatingCostMultiplier: 1.5,
    employeeCapacityBonus: 5,
    machineCapacityBonus: 2,
    description: "A major metropolitan cafe with extremely high traffic and high expenses."
  },
  {
    id: "luxuryDistrict",
    name: "Luxury District Cafe",
    cost: 1000000,
    trafficMultiplier: 2.25,
    operatingCostMultiplier: 1.7,
    employeeCapacityBonus: 6,
    machineCapacityBonus: 3,
    description: "An upscale cafe in a luxury district with premium business value."
  }
];

// ============================================================
// 7. DECORATION PACKAGES
// ============================================================

const DECORATION_PACKAGES = {
  basic: {
    name: "Basic Cafe Package",
    cost: 0,
    unlockLevel: 1,
    locationRequirement: "starter",
    businessValueBonus: 0,
    description: "A simple starter cafe setup."
  },

  cozy: {
    name: "Cozy Cafe Package",
    cost: 1000,
    unlockLevel: 2,
    businessValueBonus: 750,
    description: "A warm and comfortable cafe with relaxed neighborhood charm."
  },

  colorful: {
    name: "Colorful Cafe Package",
    cost: 2500,
    unlockLevel: 3,
    businessValueBonus: 1800,
    description: "A bright and playful cafe with an energetic dining-room feel."
  },

  rusticBakery: {
    name: "Rustic Bakery Package",
    cost: 5000,
    unlockLevel: 4,
    businessValueBonus: 3500,
    description: "A bakery-inspired cafe with a traditional and welcoming atmosphere."
  },

  modern: {
    name: "Modern Cafe Package",
    cost: 10000,
    unlockLevel: 5,
    businessValueBonus: 7000,
    description: "A clean and contemporary cafe with a polished city feel."
  },

  city: {
    name: "City Cafe Package",
    cost: 25000,
    unlockLevel: 6,
    locationRequirement: "city",
    businessValueBonus: 18000,
    description: "A stylish city-focused package designed for a busy urban cafe."
  },

  luxury: {
    name: "Luxury Cafe Package",
    cost: 50000,
    unlockLevel: 8,
    locationRequirement: "luxuryDistrict",
    businessValueBonus: 40000,
    description: "An upscale luxury package for a premium cafe."
  }
};

// ============================================================
// 8. LEVEL MILESTONES
// ============================================================

const LEVEL_MILESTONES = {
  2: ["Espresso Machine", "Latte", "Cappuccino"],
  3: [
    "Bakery",
    "Oven",
    "Chocolate Chip Muffin",
    "Blueberry Muffin",
    "Croissant",
    "Chocolate Chip Cookie",
    "Peanut Butter Cookie",
    "Oatmeal Cookie"
  ],
  4: ["Blender", "Fruit Smoothie", "Iced Cappuccino", "Drive-Thru"],
  5: ["Cinnamon Roll", "Chocolate Donut", "Cheese Danish"],
  6: ["Mocha", "Assistant Manager"],
  7: ["Confetti Iced Cappuccino"],
  8: ["Pumpkin Spice Latte"],
  9: ["Candy Cane Hot Chocolate"]
};

// ============================================================
// 9. SAVE KEY
// ============================================================

const CAFE_SAVE_KEY = "lifeUnlockedCafeV1";

// ============================================================
// 10. CAFE CONTROLLER
// ============================================================

class CafeGame {
  constructor() {
    this.state = this.createNewState();
  }

  createNewState() {
    return {
      version: "1.0",
      cafeName: "Life Unlocked Cafe",

      coins: 500,
      cafeLevel: 1,
      cafeXP: 0,
      lifetimeCustomersServed: 0,
      lifetimeTips: 0,

      currentLocationId: "starter",

      shift: {
        number: 1,
        active: false,
        workArea: "counter",
        difficulty: "beginner",
        customersServed: 0,
        specialCustomersServed: 0,
        sales: 0,
        tips: 0,
        costs: 0,
        goalRewardCollected: false,
        startedAt: null
      },

      customers: [],
      orders: [],

      machines: {
        coffeeMachine: { owned: 1, busy: 0, speedLevel: 0 },
        hotDrinkStation: { owned: 1, busy: 0, speedLevel: 0 },
        grill: { owned: 1, busy: 0, speedLevel: 0 },
        espressoMachine: { owned: 0, busy: 0, speedLevel: 0 },
        oven: { owned: 0, busy: 0, speedLevel: 0 },
        blender: { owned: 0, busy: 0, speedLevel: 0 }
      },

      bakeryStock: {
        chocolateChipMuffin: 0,
        blueberryMuffin: 0,
        croissant: 0,
        cinnamonRoll: 0,
        chocolateDonut: 0,
        cheeseDanish: 0,
        chocolateChipCookie: 0,
        peanutButterCookie: 0,
        oatmealCookie: 0
      },

      activeBakeJobs: [],

      bakeryIdle: {
        active: false,
        durationMinutes: 0,
        startedAt: null,
        endsAt: null,
        lastResult: null
      },

      supplies: {
        coffeeBeans: 25,
        milk: 25,
        teaBags: 20,
        hotChocolateMix: 20,
        fruit: 10,
        bread: 30,
        sandwichMeat: 20,
        cheese: 20,
        muffinMix: 12,
        chocolateChips: 8,
        blueberries: 8,
        caramelSyrup: 8,
        chocolateSyrup: 8,
        pastryDough: 12,
        cookieDough: 12,
        cinnamonFilling: 6,
        donutMix: 6,
        danishFilling: 6,
        specialtyFlavor: 6,
        cups: 50
      },

      shiftPrep: {
        lastVisitedAt: null,
        recommendedTargetBatches: 2
      },

      employees: [],

      diningRoom: {
        tables: [
          { id: "table-1", number: 1, status: "available", customerId: null },
          { id: "table-2", number: 2, status: "available", customerId: null },
          { id: "table-3", number: 3, status: "available", customerId: null },
          { id: "table-4", number: 4, status: "available", customerId: null }
        ]
      },

      settings: {
        hiringMode: "manual",
        employeeAssistance: true,
        shiftDifficulty: "beginner",
        inGameSpeechEnabled: false,
        inGameSpeechRate: 1.4,
        personalProfitPercent: 20,
        quieterArrivalAnnouncements: true,
        tutorialsSeen: {
          beginner: false,
          easy: false,
          medium: false,
          hard: false,
          expert: false
        }
      },

      upgrades: {
        customerCapacityLevel: 0,
        bakeryStorageLevel: 0,
        machineSpeedLevel: 0,
        idleTimeLevel: 0,
        cafeExpansionLevel: 1
      },

      ownedDecorations: ["basic"],
      currentDecoration: "basic",

      idle: {
        active: false,
        durationMinutes: 0,
        startedAt: null,
        endsAt: null,
        lastResult: null
      },

      driveThruUnlocked: false,
      driveThruLanes: 0,

      driveThruIdle: {
        active: false,
        durationMinutes: 0,
        startedAt: null,
        endsAt: null,
        lastResult: null
      },

      businessValue: 0,

      messages: []
    };
  }

  // ==========================================================
  // 11. ACCESSIBLE MESSAGE SYSTEM
  // ==========================================================

  announce(message) {
    const entry = {
      id: `${Date.now()}-${Math.random()}`,
      time: Date.now(),
      message
    };

    this.state.messages.push(entry);

    if (this.state.messages.length > 100) {
      this.state.messages.shift();
    }

    console.log(message);

    const liveRegion = typeof document !== "undefined"
      ? document.getElementById("cafe-live-region")
      : null;

    if (liveRegion) {
      liveRegion.textContent = message;
    }

    return message;
  }

  getRecentMessages(limit = 10) {
    return this.state.messages.slice(-limit).map(entry => entry.message);
  }

  // ==========================================================
  // 12. PROGRESSION AND UNLIMITED LEVELS
  // ==========================================================

  customersNeededForLevel(level) {
    if (level <= 1) return 0;

    const milestoneThresholds = {
      2: 15,
      3: 30,
      4: 50,
      5: 75,
      6: 100,
      7: 125,
      8: 150,
      9: 175,
      10: 200
    };

    if (milestoneThresholds[level]) {
      return milestoneThresholds[level];
    }

    return 200 + ((level - 10) * 50);
  }

  calculateLevelFromCustomers(customers) {
    let level = 1;

    while (customers >= this.customersNeededForLevel(level + 1)) {
      level += 1;

      if (level > 100000) {
        break;
      }
    }

    return level;
  }

  checkLevelUp() {
    const oldLevel = this.state.cafeLevel;
    const newLevel = this.calculateLevelFromCustomers(
      this.state.lifetimeCustomersServed
    );

    if (newLevel <= oldLevel) {
      return false;
    }

    for (let level = oldLevel + 1; level <= newLevel; level += 1) {
      this.state.cafeLevel = level;
      const reward = this.getLevelReward(level);
      this.state.coins += reward;

      this.applyLevelUnlocks(level);

      this.announce(
        `Cafe Level ${level} reached. Level reward: ${CafeHelpers.formatCoins(reward)}.`
      );
    }

    this.updateBusinessValue();
    return true;
  }

  getLevelReward(level) {
    if (level <= 10) {
      return 25 + (level * 15);
    }

    return 100 + (level * 10);
  }

  applyLevelUnlocks(level) {
    Object.entries(MACHINE_DEFINITIONS).forEach(([machineId, machine]) => {
      if (machine.unlockLevel === level && this.state.machines[machineId].owned === 0) {
        this.state.machines[machineId].owned = 1;
        this.announce(
          `${machine.name} unlocked. Your first ${machine.name} is free.`
        );
      }
    });

    if (level === 4) {
      this.state.driveThruUnlocked = true;
      this.state.driveThruLanes = 1;
      this.announce("Drive-thru unlocked. Your first drive-thru lane is free.");
    }

    if (LEVEL_MILESTONES[level]) {
      this.announce(
        `New unlocks: ${LEVEL_MILESTONES[level].join(", ")}.`
      );
    }
  }

  // ==========================================================
  // 12A. DIFFICULTY AND SHIFT ECONOMY
  // ==========================================================

  getDifficultyDefinition(difficultyId = null) {
    const id =
      difficultyId ||
      (this.state.shift.active
        ? this.state.shift.difficulty
        : this.state.settings.shiftDifficulty) ||
      "beginner";

    return CAFE_DIFFICULTIES[id] || CAFE_DIFFICULTIES.beginner;
  }

  setShiftDifficulty(difficultyId) {
    if (!CAFE_DIFFICULTIES[difficultyId]) {
      return this.announce("That difficulty was not found.");
    }

    if (this.state.shift.active) {
      return this.announce(
        "Finish the current shift before changing difficulty."
      );
    }

    this.state.settings.shiftDifficulty = difficultyId;
    this.save();

    const difficulty = this.getDifficultyDefinition(difficultyId);

    return this.announce(
      `${difficulty.name} difficulty selected. ${difficulty.description}`
    );
  }

  hasSeenDifficultyTutorial(difficultyId) {
    if (!CAFE_DIFFICULTIES[difficultyId]) return false;

    return Boolean(
      this.state.settings.tutorialsSeen &&
      this.state.settings.tutorialsSeen[difficultyId]
    );
  }

  markDifficultyTutorialSeen(difficultyId) {
    if (!CAFE_DIFFICULTIES[difficultyId]) {
      return this.announce("That tutorial could not be found.");
    }

    if (!this.state.settings.tutorialsSeen) {
      this.state.settings.tutorialsSeen = {};
    }

    this.state.settings.tutorialsSeen[difficultyId] = true;
    this.save();

    return true;
  }

  resetDifficultyTutorials() {
    this.state.settings.tutorialsSeen = {
      beginner: false,
      easy: false,
      medium: false,
      hard: false,
      expert: false
    };

    this.save();
    return this.announce("All café difficulty tutorials have been reset.");
  }

  getDifficultyEarningsMultiplier(difficultyId = null) {
    return this.getDifficultyDefinition(difficultyId).earningsMultiplier || 1;
  }

  getAutomaticCustomerIntervalMs() {
    const difficulty = this.getDifficultyDefinition();

    if (!difficulty.automaticCustomers || !difficulty.arrivalSeconds) {
      return null;
    }

    return difficulty.arrivalSeconds * 1000;
  }

  calculateMenuSalePrice(basePrice) {
    const adjustedBase = Math.max(
      1,
      Math.round(Number(basePrice || 0) * CAFE_BASE_PRICE_MULTIPLIER)
    );

    return Math.max(
      1,
      Math.round(
        adjustedBase * this.getDifficultyEarningsMultiplier()
      )
    );
  }

  // ==========================================================
  // 13. SHIFT SYSTEM
  // ==========================================================

  getShiftGoal(shiftNumber = this.state.shift.number) {
    if (shiftNumber <= 5) {
      return 10 + ((shiftNumber - 1) * 2);
    }

    if (shiftNumber === 6) {
      return 20;
    }

    return 20 + ((shiftNumber - 6) * 2);
  }

  getShiftGoalBonus(shiftNumber = this.state.shift.number) {
    let base;

    if (shiftNumber <= 5) {
      base = 50 + ((shiftNumber - 1) * 10);
    } else if (shiftNumber === 6) {
      base = 125;
    } else {
      base = 125 + ((shiftNumber - 6) * 10);

      if (shiftNumber % 5 === 0) {
        base += 50;
      }
    }

    return CafeHelpers.roundCoins(
      base * this.getDifficultyEarningsMultiplier()
    );
  }

  startShift(workArea = "counter") {
    if (this.state.shift.active) {
      return this.announce("A shift is already active.");
    }

    if (!["counter", "driveThru"].includes(workArea)) {
      return this.announce("That café work area is not available.");
    }

    if (workArea === "driveThru" && !this.state.driveThruUnlocked) {
      return this.announce("The drive-thru is still locked.");
    }

    if (
      workArea === "driveThru" &&
      this.state.driveThruIdle &&
      this.state.driveThruIdle.active
    ) {
      return this.announce(
        "Your drive-thru employee is already running the drive-thru in the background. End or collect that employee session before you personally work the drive-thru."
      );
    }

    this.state.shift.active = true;
    this.state.shift.workArea = workArea;
    this.state.shift.difficulty =
      this.state.settings.shiftDifficulty || "beginner";
    this.state.shift.customersServed = 0;
    this.state.shift.specialCustomersServed = 0;
    this.state.shift.sales = 0;
    this.state.shift.tips = 0;
    this.state.shift.costs = 0;
    this.state.shift.goalRewardCollected = false;
    this.state.shift.startedAt = CafeHelpers.now();

    const goal = this.getShiftGoal();
    const bonus = this.getShiftGoalBonus();

    this.save();

    const difficulty = this.getDifficultyDefinition();
    const areaName =
      workArea === "driveThru" ? "Drive-Thru" : "Café Counter";

    return this.announce(
      `${areaName} shift ${this.state.shift.number} started on ${difficulty.name} difficulty. Goal: serve ${goal} customers. Goal bonus: ${CafeHelpers.formatCoins(bonus)}. ${difficulty.automaticCustomers ? `Customers will arrive automatically about every ${difficulty.arrivalSeconds} seconds while your active work screen is open.` : "You control when customers arrive."} You may continue serving customers after the goal is complete.`
    );
  }

  checkShiftGoal() {
    if (!this.state.shift.active) return false;
    if (this.state.shift.goalRewardCollected) return false;

    const goal = this.getShiftGoal();

    if (this.state.shift.customersServed < goal) {
      return false;
    }

    const bonus = this.getShiftGoalBonus();

    this.state.coins += bonus;
    this.state.shift.sales += bonus;
    this.state.shift.goalRewardCollected = true;

    this.announce(
      `Shift goal complete. You served ${goal} customers and earned ${CafeHelpers.formatCoins(bonus)}. You can keep playing or end the shift whenever you want.`
    );

    this.updateBusinessValue();
    this.save();

    return true;
  }

  endShift() {
    if (!this.state.shift.active) {
      return this.announce("There is no active shift to end.");
    }

    const employeeWages = this.calculateActiveShiftEmployeeWages();
    const operatingCost = this.calculateLocationOperatingCost();

    this.state.shift.costs += employeeWages + operatingCost;
    this.state.coins = Math.max(
      0,
      this.state.coins - employeeWages - operatingCost
    );

    const profit = this.state.shift.sales - this.state.shift.costs;
    const split = this.getProfitSplit();
    const distributableProfit = Math.max(0, profit);
    const personalShare = Math.round(distributableProfit * (split.personalPercent / 100));
    const businessShare = distributableProfit - personalShare;

    if (personalShare > 0) {
      const deposited = this.depositPersonalIncome(
        personalShare,
        `Café owner pay from shift ${this.state.shift.number}`
      );
      if (deposited) {
        this.state.coins = Math.max(0, this.state.coins - personalShare);
      }
    }

    const summary = {
      shiftNumber: this.state.shift.number,
      workArea: this.state.shift.workArea || "counter",
      customersServed: this.state.shift.customersServed,
      specialCustomersServed: this.state.shift.specialCustomersServed || 0,
      sales: this.state.shift.sales,
      tips: this.state.shift.tips || 0,
      costs: this.state.shift.costs,
      wages: employeeWages,
      operatingCost,
      profit,
      personalPercent: split.personalPercent,
      businessPercent: split.businessPercent,
      personalShare,
      businessShare
    };

    const areaName =
      summary.workArea === "driveThru" ? "Drive-Thru" : "Café Counter";

    this.announce(
      `${areaName} shift ${summary.shiftNumber} ended. Customers served: ${summary.customersServed}. Special customers: ${summary.specialCustomersServed}. Sales: ${CafeHelpers.formatCoins(summary.sales)}. Tips to Personal Money: ${CafeHelpers.formatCoins(summary.tips)}. Costs: ${CafeHelpers.formatCoins(summary.costs)}. Net profit: ${CafeHelpers.formatCoins(summary.profit)}. Owner pay: ${CafeHelpers.formatCoins(summary.personalShare)}. Retained by Café: ${CafeHelpers.formatCoins(summary.businessShare)}.`
    );

    this.state.shift.number += 1;
    this.state.shift.active = false;
    this.state.shift.workArea = "counter";
    this.state.shift.customersServed = 0;
    this.state.shift.specialCustomersServed = 0;
    this.state.shift.sales = 0;
    this.state.shift.tips = 0;
    this.state.shift.costs = 0;
    this.state.shift.goalRewardCollected = false;
    this.state.shift.startedAt = null;

    this.updateBusinessValue();
    this.save();

    if (
      typeof window !== "undefined" &&
      window.LifeUnlockedWorld &&
      typeof window.LifeUnlockedWorld.reportCareerTime === "function"
    ) {
      window.LifeUnlockedWorld.reportCareerTime("cafe", 60, "Active café shift");
    }

    return summary;
  }

  // ==========================================================
  // 14. CUSTOMER TRAFFIC
  // ==========================================================

  getCustomerArrivalSeconds() {
    const level = this.state.cafeLevel;

    let min;
    let max;

    if (level <= 5) {
      min = 15;
      max = 20;
    } else if (level <= 10) {
      min = 12;
      max = 16;
    } else if (level <= 20) {
      min = 10;
      max = 14;
    } else {
      min = 8;
      max = 12;
    }

    const location = this.getCurrentLocation();
    const multiplier = location.trafficMultiplier || 1;

    min = Math.max(4, Math.round(min / multiplier));
    max = Math.max(min, Math.round(max / multiplier));

    return CafeHelpers.randomInt(min, max);
  }

  getCustomerCapacity() {
    const base = 5;
    return base + this.state.upgrades.customerCapacityLevel;
  }

  getCustomerPatienceMs() {
    const difficulty = this.getDifficultyDefinition();
    return difficulty.patienceSeconds
      ? difficulty.patienceSeconds * 1000
      : null;
  }

  updateCustomerPatience(activeWorkScreenOpen = true) {
    if (!this.state.shift.active) return [];

    const now = CafeHelpers.now();
    const departed = [];

    this.state.customers.forEach(customer => {
      if (customer.served || customer.patienceRemainingMs === null) {
        customer.patienceLastUpdatedAt = now;
        return;
      }

      if (!Number.isFinite(customer.patienceRemainingMs)) {
        customer.patienceRemainingMs = this.getCustomerPatienceMs();
      }

      if (!Number.isFinite(customer.patienceLastUpdatedAt)) {
        customer.patienceLastUpdatedAt = now;
      }

      if (!activeWorkScreenOpen) {
        customer.patienceLastUpdatedAt = now;
        return;
      }

      const elapsed = Math.max(0, now - customer.patienceLastUpdatedAt);
      customer.patienceRemainingMs -= elapsed;
      customer.patienceLastUpdatedAt = now;

      if (
        !customer.patienceWarningGiven &&
        customer.patienceRemainingMs > 0 &&
        customer.patienceRemainingMs <= 10000
      ) {
        customer.patienceWarningGiven = true;
        this.announce(
          `${customer.name} is getting impatient. About ${Math.ceil(customer.patienceRemainingMs / 1000)} seconds remaining.`
        );
      }

      if (customer.patienceRemainingMs <= 0) {
        departed.push(customer);
      }
    });

    departed.forEach(customer => {
      this.state.customers = this.state.customers.filter(
        item => item.id !== customer.id
      );

      this.state.orders = this.state.orders.filter(
        order => order.customerId !== customer.id
      );

      this.announce(
        `${customer.name} ran out of patience and left without paying.`
      );
    });

    if (departed.length > 0) this.save();

    return departed;
  }

  getCustomerPatienceText(customer) {
    if (!customer || customer.patienceRemainingMs === null) {
      return "No patience timer on Beginner.";
    }

    return `${Math.max(0, Math.ceil(customer.patienceRemainingMs / 1000))} seconds of patience remaining.`;
  }

  generateCustomer(source = "counter", options = {}) {
    if (!this.state.shift.active) {
      this.announce("Start a shift before receiving active customers.");
      return null;
    }

    if (this.state.customers.length >= this.getCustomerCapacity()) {
      this.announce("The cafe customer waiting area is currently full.");
      return null;
    }

    if (source === "driveThru" && !this.state.driveThruUnlocked) {
      this.announce("The drive-thru is not unlocked yet.");
      return null;
    }

    const activeWorkArea = this.state.shift.workArea || "counter";

    if (source !== activeWorkArea) {
      const activeName =
        activeWorkArea === "driveThru" ? "Drive-Thru" : "Café Counter";
      const requestedName =
        source === "driveThru" ? "Drive-Thru" : "Café Counter";

      this.announce(
        `You are currently working the ${activeName}. End that shift before personally switching to the ${requestedName}.`
      );
      return null;
    }

    const customer = {
      id: `customer-${Date.now()}-${Math.random()}`,
      name: this.generateRandomFullName(),
      source,
      arrivedAt: Date.now(),
      served: false
    };

    const special = this.getRandomSpecialCustomer();
    if (special) {
      customer.specialType = special.id;
      customer.specialLabel = special.name;
      customer.specialPriceMultiplier = special.priceMultiplier;
    }

    this.state.customers.push(customer);

    const seatingMessage = this.seatCustomerAutomatically(customer);
    const specialText = customer.specialLabel
      ? ` Special customer: ${customer.specialLabel}.`
      : "";
    const seatingText = seatingMessage ? ` ${seatingMessage}` : "";

    const arrivalMessage =
      `${source === "driveThru" ? "Drive-thru customer" : "Customer"} ${customer.name} has arrived.${specialText}${seatingText}`;

    if (!options.quietArrival || customer.specialLabel) {
      this.announce(arrivalMessage);
    } else {
      customer.arrivalMessage = arrivalMessage;
    }

    this.save();
    return customer;
  }

  generateRandomFullName() {
    return `${CafeHelpers.randomItem(CAFE_FIRST_NAMES)} ${CafeHelpers.randomItem(CAFE_LAST_NAMES)}`;
  }


  // ==========================================================
  // 14B. DINING ROOM, SPECIAL CUSTOMERS, OPTIONAL IN-GAME SPEECH
  // ==========================================================

  getDiningTables() {
    if (!this.state.diningRoom) this.state.diningRoom = { tables: [] };
    if (!Array.isArray(this.state.diningRoom.tables) || this.state.diningRoom.tables.length === 0) {
      this.state.diningRoom.tables = Array.from({ length: 4 }, (_, index) => ({
        id: `table-${index + 1}`,
        number: index + 1,
        status: "available",
        customerId: null
      }));
    }
    return this.state.diningRoom.tables;
  }

  getDiningRoomStatus() {
    const tables = this.getDiningTables();
    return {
      total: tables.length,
      available: tables.filter(table => table.status === "available").length,
      occupied: tables.filter(table => table.status === "occupied").length,
      needsCleaning: tables.filter(table => table.status === "needsCleaning").length,
      tables
    };
  }

  seatCustomerAutomatically(customer) {
    if (!customer || customer.source === "driveThru") return null;

    const table = this.getDiningTables().find(item => item.status === "available");
    if (!table) {
      customer.dineIn = false;
      customer.tableId = null;
      return `${customer.name} is takeout because no clean table is available.`;
    }

    table.status = "occupied";
    table.customerId = customer.id;
    customer.dineIn = true;
    customer.tableId = table.id;
    return `${customer.name} automatically sat at Table ${table.number}.`;
  }

  markTableNeedsCleaning(customer) {
    if (!customer || !customer.tableId) return;
    const table = this.getDiningTables().find(item => item.id === customer.tableId);
    if (!table) return;
    table.status = "needsCleaning";
    table.customerId = null;
  }

  cleanTable(tableId) {
    const table = this.getDiningTables().find(item => item.id === tableId);
    if (!table) return this.announce("Table not found.");
    if (table.status !== "needsCleaning") {
      return this.announce(`Table ${table.number} does not need cleaning.`);
    }
    table.status = "available";
    table.customerId = null;
    this.save();
    return this.announce(`Table ${table.number} cleaned and ready for customers.`);
  }

  cleanNextTable() {
    const table = this.getDiningTables().find(item => item.status === "needsCleaning");
    if (!table) return this.announce("No tables need cleaning.");
    return this.cleanTable(table.id);
  }

  hasActiveCleaner() {
    return this.state.employees.some(employee =>
      employee.roleId === "cleaner"
    );
  }

  runAutomaticCleaner() {
    if (!this.hasActiveCleaner()) return false;
    const table = this.getDiningTables().find(item => item.status === "needsCleaning");
    if (!table) return false;
    table.status = "available";
    table.customerId = null;
    this.announce(`Your Cleaner automatically cleaned Table ${table.number}.`);
    this.save();
    return true;
  }

  getRandomSpecialCustomer() {
    const roll = Math.random();
    if (roll < 0.05) return { id: "critic", name: "Café Critic", priceMultiplier: 1.35 };
    if (roll < 0.13) return { id: "office", name: "Office Group", priceMultiplier: 1.55 };
    if (roll < 0.21) return { id: "family", name: "Family Group", priceMultiplier: 1.40 };
    if (roll < 0.28) return { id: "tourist", name: "Tourist Group", priceMultiplier: 1.30 };
    if (roll < 0.35) return { id: "business", name: "Business Customer", priceMultiplier: 1.20 };
    return null;
  }

  getInGameSpeechSettings() {
    return {
      enabled: Boolean(this.state.settings.inGameSpeechEnabled),
      rate: Number(this.state.settings.inGameSpeechRate || 1.4)
    };
  }

  setInGameSpeech(enabled, rate = 1.4) {
    this.state.settings.inGameSpeechEnabled = Boolean(enabled);
    this.state.settings.inGameSpeechRate = Math.max(0.5, Math.min(3, Number(rate) || 1.4));
    this.save();
    return this.announce(
      `In-game speech ${this.state.settings.inGameSpeechEnabled ? "on" : "off"}. Speech speed ${this.state.settings.inGameSpeechRate.toFixed(1)} times.`
    );
  }


  resetCustomerPatience(customerId, stage = "service") {
    const customer = this.state.customers.find(item => item.id === customerId);
    if (!customer || customer.patienceRemainingMs === null) return null;

    const fullPatience = this.getCustomerPatienceMs();
    if (!fullPatience) return null;

    customer.patienceRemainingMs = fullPatience;
    customer.patienceLastUpdatedAt = CafeHelpers.now();
    customer.patienceWarningGiven = false;

    const seconds = Math.ceil(fullPatience / 1000);
    const labels = {
      orderTaken: "Order taken",
      readyToServe: "Order ready"
    };

    this.announce(
      `${customer.name}: ${labels[stage] || "Service progress"}. Patience refreshed to ${seconds} seconds.`
    );

    return seconds;
  }

  getPriorityCustomer() {
    const activeOrders = this.getActiveOrders();
    const candidates = this.state.customers
      .filter(customer => !customer.served)
      .map(customer => {
        const order = activeOrders.find(item => item.customerId === customer.id) || null;
        let priority = 4;
        let action = "Take order";

        if (order) {
          if (order.status === "ready") {
            priority = 1;
            action = "Serve";
          } else if (order.status === "waiting") {
            priority = 2;
            action = "Prepare";
          } else if (order.status === "preparing") {
            priority = 3;
            action = "Preparing";
          }
        }

        const remaining = customer.patienceRemainingMs === null
          ? Number.POSITIVE_INFINITY
          : Math.max(0, customer.patienceRemainingMs);

        return { customer, order, priority, action, remaining };
      });

    candidates.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.remaining - b.remaining;
    });

    return candidates[0] || null;
  }

  announcePriorityCustomer() {
    const item = this.getPriorityCustomer();

    if (!item) {
      return this.announce("No customer currently needs attention.");
    }

    const seconds = Number.isFinite(item.remaining)
      ? `${Math.ceil(item.remaining / 1000)} seconds remaining`
      : "no patience timer";

    const special = item.customer.specialLabel
      ? ` Special customer: ${item.customer.specialLabel}.`
      : "";

    return this.announce(
      `Most urgent: ${item.customer.name}. ${item.action}. ${seconds}.${special}`
    );
  }

  getTipAmount(order, customer) {
    const base = Math.max(1, Math.round(order.totalPrice * 0.08));
    const patience = customer && customer.patienceRemainingMs !== null
      ? Math.max(0, Number(customer.patienceRemainingMs || 0))
      : null;

    let multiplier = 1;
    if (customer && customer.specialType) multiplier += 0.5;
    if (patience !== null) {
      const full = this.getCustomerPatienceMs() || 1;
      const ratio = patience / full;
      if (ratio >= 0.75) multiplier += 0.5;
      else if (ratio < 0.25) multiplier *= 0.5;
    }

    const chance = customer && customer.specialType ? 0.75 : 0.55;
    if (Math.random() > chance) return 0;

    return Math.max(1, Math.round(base * multiplier));
  }

  depositPersonalIncome(amount, description) {
    const value = Math.max(0, Math.round(Number(amount) || 0));
    if (!value) return false;

    if (
      typeof window !== "undefined" &&
      window.LifeUnlockedWorld &&
      typeof window.LifeUnlockedWorld.reportCareerPersonalIncome === "function"
    ) {
      window.LifeUnlockedWorld.reportCareerPersonalIncome(
        value,
        description || "Café income"
      );
      return true;
    }

    return false;
  }

  getProfitSplit() {
    const personalPercent = Math.max(
      0,
      Math.min(100, Number(this.state.settings.personalProfitPercent ?? 20))
    );

    return {
      personalPercent,
      businessPercent: 100 - personalPercent
    };
  }

  setProfitSplit(personalPercent) {
    const personal = Math.max(0, Math.min(100, Number(personalPercent) || 0));
    this.state.settings.personalProfitPercent = personal;
    this.save();

    return this.announce(
      `Café owner pay set to ${personal}% Personal and ${100 - personal}% Business.`
    );
  }

  getMachineTier(machineId) {
    const machine = this.state.machines[machineId];
    if (!machine) return MACHINE_TIERS[0];
    const index = Math.max(0, Math.min(MACHINE_TIERS.length - 1, Number(machine.speedLevel || 0)));
    return MACHINE_TIERS[index];
  }

  getNextMachineTier(machineId) {
    const current = this.getMachineTier(machineId);
    const index = MACHINE_TIERS.findIndex(tier => tier.id === current.id);
    return MACHINE_TIERS[index + 1] || null;
  }

  getMachineEffectiveCapacity(machineId) {
    const machine = this.state.machines[machineId];
    if (!machine) return 0;
    const tier = this.getMachineTier(machineId);
    return Math.max(0, machine.owned * tier.capacityMultiplier);
  }

  getMachineTierUpgradeCost(machineId) {
    const definition = MACHINE_DEFINITIONS[machineId];
    const next = this.getNextMachineTier(machineId);
    if (!definition || !next) return null;
    return Math.max(1, Math.round(definition.baseCost * next.upgradeCostMultiplier));
  }

  upgradeMachineTier(machineId) {
    const machine = this.state.machines[machineId];
    const definition = MACHINE_DEFINITIONS[machineId];
    const next = this.getNextMachineTier(machineId);

    if (!machine || !definition) return this.announce("Machine not found.");
    if (!next) return this.announce(`${definition.name} is already Ultra tier.`);
    if (this.state.cafeLevel < next.unlockLevel) {
      return this.announce(
        `${next.name} ${definition.name} unlocks at Café Level ${next.unlockLevel}.`
      );
    }

    const cost = this.getMachineTierUpgradeCost(machineId);
    if (this.state.coins < cost) {
      return this.announce(
        `You need ${CafeHelpers.formatCoins(cost)} to upgrade ${definition.name} to ${next.name}.`
      );
    }

    this.state.coins -= cost;
    machine.speedLevel = Math.min(MACHINE_TIERS.length - 1, Number(machine.speedLevel || 0) + 1);
    this.updateBusinessValue();
    this.save();

    return this.announce(
      `${definition.name} upgraded to ${next.name}. Capacity is now ${this.getMachineEffectiveCapacity(machineId)} simultaneous item${this.getMachineEffectiveCapacity(machineId) === 1 ? "" : "s"}, with faster preparation.`
    );
  }

  // ==========================================================
  // 15. ORDERS
  // ==========================================================

  getUnlockedMenuItems() {
    return Object.values(CAFE_MENU).filter(item => {
      if (item.unlockLevel > this.state.cafeLevel) {
        return false;
      }

      if (item.type === "bakery") {
        return (this.state.bakeryStock[item.id] || 0) > 0;
      }

      const machine = item.machine
        ? this.state.machines[item.machine]
        : null;

      if (machine && machine.owned <= 0) {
        return false;
      }

      if (item.type === "drink") {
        return ["small", "medium", "large"].some(
          size => this.getMissingRecipeSupplies(item.id, size).length === 0
        );
      }

      return this.getMissingRecipeSupplies(item.id).length === 0;
    });
  }

  generateOrder(customerId) {
    const customer = this.state.customers.find(
      item => item.id === customerId
    );

    if (!customer) {
      this.announce("Customer not found.");
      return null;
    }

    const availableItems = this.getUnlockedMenuItems();

    if (availableItems.length === 0) {
      this.announce("No menu items are currently available.");
      return null;
    }

    const itemCount = customer.specialType
      ? (this.state.cafeLevel >= 5 && Math.random() < 0.45 ? 3 : 2)
      : (this.state.cafeLevel >= 5 && Math.random() < 0.25 ? 2 : 1);

    const items = [];

    for (let index = 0; index < itemCount; index += 1) {
      const menuItem = CafeHelpers.randomItem(availableItems);

      if (menuItem.type === "drink") {
        const availableSizes = ["small", "medium", "large"].filter(
          size => this.getMissingRecipeSupplies(menuItem.id, size).length === 0
        );

        if (availableSizes.length === 0) {
          continue;
        }

        const size = CafeHelpers.randomItem(availableSizes);

        items.push({
          itemId: menuItem.id,
          name: menuItem.name,
          type: menuItem.type,
          size,
          price: this.calculateMenuSalePrice(menuItem.prices[size]),
          cost: menuItem.costs[size],
          machine: menuItem.machine,
          prepTime: menuItem.prepTime,
          ready: false
        });
      } else if (menuItem.type === "grill") {
        items.push({
          itemId: menuItem.id,
          name: menuItem.name,
          type: menuItem.type,
          price: this.calculateMenuSalePrice(menuItem.price),
          cost: menuItem.cost,
          machine: menuItem.machine,
          prepTime: menuItem.prepTime,
          ready: false
        });
      } else {
        items.push({
          itemId: menuItem.id,
          name: menuItem.name,
          type: menuItem.type,
          price: this.calculateMenuSalePrice(menuItem.price),
          cost: 0,
          machine: null,
          prepTime: 0,
          ready: true
        });
      }
    }

    if (items.length === 0) {
      this.announce(
        `${customer.name} could not place an order because the needed menu items are unavailable. Restock supplies or prepare bakery food.`
      );
      return null;
    }

    const baseTotalPrice = items.reduce((sum, item) => sum + item.price, 0);
    const totalPrice = Math.round(
      baseTotalPrice * Number(customer.specialPriceMultiplier || 1)
    );
    const totalCost = items.reduce((sum, item) => sum + item.cost, 0);

    const order = {
      id: `order-${Date.now()}-${Math.random()}`,
      customerId,
      customerName: customer.name,
      source: customer.source,
      items,
      totalPrice,
      totalCost,
      status: items.every(item => item.ready) ? "ready" : "waiting",
      createdAt: Date.now(),
      servedAt: null
    };

    this.state.orders.push(order);
    this.resetCustomerPatience(customer.id, "orderTaken");

    const itemText = items.map(item => {
      if (item.type === "drink") {
        return `${item.size} ${item.name}`;
      }

      return item.name;
    }).join(" and ");

    this.announce(
      `${customer.name} orders ${itemText} for ${CafeHelpers.formatCoins(totalPrice)}.`
    );

    this.save();
    return order;
  }

  repeatCurrentOrder() {
    const activeOrders = this.getActiveOrders();

    if (activeOrders.length === 0) {
      return this.announce("There is no active order to repeat.");
    }

    const order = activeOrders[0];
    const itemText = order.items.map(item => {
      if (item.type === "drink") {
        return `${item.size} ${item.name}`;
      }

      return item.name;
    }).join(" and ");

    return this.announce(
      `${order.customerName}: ${itemText}. Total: ${CafeHelpers.formatCoins(order.totalPrice)}. Status: ${order.status}.`
    );
  }

  getActiveOrders() {
    return this.state.orders.filter(
      order => order.status !== "served"
    );
  }

  prepareOrder(orderId) {
    const order = this.state.orders.find(item => item.id === orderId);

    if (!order) {
      return this.announce("Order not found.");
    }

    if (order.status === "served") {
      return this.announce("That order has already been served.");
    }

    const unfinishedItem = order.items.find(
      item => !item.ready && !item.preparing
    );

    if (!unfinishedItem) {
      order.status = order.items.every(item => item.ready)
        ? "ready"
        : "preparing";

      return this.announce(
        order.status === "ready"
          ? `${order.customerName}'s order is ready to serve.`
          : `${order.customerName}'s order is already being prepared.`
      );
    }

    if (!unfinishedItem.machine) {
      unfinishedItem.ready = true;
      return this.prepareOrder(orderId);
    }

    const machineState = this.state.machines[unfinishedItem.machine];

    if (!machineState || machineState.owned <= 0) {
      return this.announce(
        `You do not own the machine needed for ${unfinishedItem.name}.`
      );
    }

    if (machineState.busy >= this.getMachineEffectiveCapacity(unfinishedItem.machine)) {
      return this.announce(
        `${MACHINE_DEFINITIONS[unfinishedItem.machine].name} is currently busy.`
      );
    }

    const missingSupplies = this.getMissingRecipeSupplies(
      unfinishedItem.itemId,
      unfinishedItem.size || null
    );

    if (missingSupplies.length > 0) {
      const missingText = missingSupplies
        .map(item => `${item.name}: need ${item.needed}, have ${item.available}`)
        .join("; ");

      return this.announce(
        `You cannot prepare ${unfinishedItem.name}. ${missingText}. Restock supplies first.`
      );
    }

    if (!this.consumeRecipeSupplies(
      unfinishedItem.itemId,
      unfinishedItem.size || null
    )) {
      return false;
    }

    machineState.busy += 1;
    unfinishedItem.preparing = true;

    const speedMultiplier = this.getBestEmployeeSpeedMultiplierForItem(
      unfinishedItem
    );

    const machineSpeedBonus = Math.min(
      0.5,
      this.state.upgrades.machineSpeedLevel * 0.05
    );

    const tier = this.getMachineTier(unfinishedItem.machine);

    const effectiveSeconds = Math.max(
      1,
      Math.round(
        unfinishedItem.prepTime *
        speedMultiplier *
        (1 - machineSpeedBonus) *
        tier.speedMultiplier
      )
    );

    order.status = "preparing";

    this.announce(
      `${unfinishedItem.name} is being prepared. Estimated time: ${effectiveSeconds} seconds.`
    );

    setTimeout(() => {
      unfinishedItem.ready = true;
      unfinishedItem.preparing = false;
      machineState.busy = Math.max(0, machineState.busy - 1);

      if (order.items.every(item => item.ready)) {
        order.status = "ready";
        this.resetCustomerPatience(order.customerId, "readyToServe");
        this.announce(`${order.customerName}'s order is ready to serve.`);
      } else {
        order.status = "waiting";
        this.announce(
          `${unfinishedItem.name} is ready. Another item in the order still needs preparation.`
        );
      }

      this.save();
    }, effectiveSeconds * 1000);

    this.save();
    return true;
  }

  serveOrder(orderId) {
    const order = this.state.orders.find(item => item.id === orderId);

    if (!order) {
      return this.announce("Order not found.");
    }

    if (order.status === "served") {
      return this.announce("That order has already been served.");
    }

    if (!order.items.every(item => item.ready)) {
      return this.announce("The order is not ready yet.");
    }

    for (const item of order.items) {
      if (item.type === "bakery") {
        const currentStock = this.state.bakeryStock[item.itemId] || 0;

        if (currentStock <= 0) {
          return this.announce(
            `${item.name} is out of stock. Bake another batch first.`
          );
        }
      }
    }

    for (const item of order.items) {
      if (item.type === "bakery") {
        this.state.bakeryStock[item.itemId] -= 1;
      }
    }

    order.status = "served";
    order.servedAt = Date.now();

    const customer = this.state.customers.find(
      item => item.id === order.customerId
    );

    if (customer) {
      customer.served = true;
      this.markTableNeedsCleaning(customer);
    }

    const tip = this.getTipAmount(order, customer);
    if (tip > 0) {
      this.state.shift.tips += tip;
      this.state.lifetimeTips += tip;
      this.depositPersonalIncome(tip, `Café tip from ${order.customerName}`);
    }

    this.state.coins += order.totalPrice;
    this.state.shift.sales += order.totalPrice;
    this.state.shift.customersServed += 1;
    if (customer && customer.specialType) {
      this.state.shift.specialCustomersServed += 1;
    }
    this.state.lifetimeCustomersServed += 1;

    this.state.customers = this.state.customers.filter(
      item => item.id !== order.customerId
    );

    this.announce(
      `${order.customerName} has been served. You received ${CafeHelpers.formatCoins(order.totalPrice)}. Customers served this shift: ${this.state.shift.customersServed} of ${this.getShiftGoal()}.`
    );

    this.runAutomaticCleaner();
    this.checkShiftGoal();
    this.checkLevelUp();
    this.updateBusinessValue();
    this.save();

    return true;
  }


  // ==========================================================
  // 16. SUPPLIES AND SHIFT PREP
  // ==========================================================

  getSupplyAmount(supplyId) {
    return Math.max(0, Number(this.state.supplies[supplyId] || 0));
  }

  getSupplyCapacity(supplyId) {
    const definition = CAFE_SUPPLIES[supplyId];
    return definition ? definition.maxStock : 0;
  }

  getSupplyRestockTarget(supplyId) {
    const definition = CAFE_SUPPLIES[supplyId];

    if (!definition) return 0;

    // Restock only to a practical working amount, not automatically to full storage.
    let target = 25 + (this.state.cafeLevel * 3);

    // Cups and lids are used by nearly every drink, so keep a little more on hand.
    if (supplyId === "cups") {
      target = Math.ceil(target * 1.5);
    }

    return Math.min(definition.maxStock, target);
  }

  isSupplyLow(supplyId) {
    const amount = this.getSupplyAmount(supplyId);
    const target = this.getSupplyRestockTarget(supplyId);
    const warningPoint = Math.max(8, Math.ceil(target * 0.25));

    return amount <= warningPoint;
  }

  getLowSupplies() {
    return Object.entries(CAFE_SUPPLIES)
      .filter(([supplyId]) => this.isSupplyLow(supplyId))
      .map(([supplyId, definition]) => ({
        id: supplyId,
        name: definition.name,
        amount: this.getSupplyAmount(supplyId),
        target: this.getSupplyRestockTarget(supplyId)
      }));
  }

  getProtectedCashReserve() {
    // Always leave a small emergency reserve so one restock cannot wipe out the café.
    return Math.max(20, Math.floor(this.state.coins * 0.15));
  }

  getSupplyRestockQuote(supplyId) {
    const definition = CAFE_SUPPLIES[supplyId];

    if (!definition) return null;

    const current = this.getSupplyAmount(supplyId);
    const target = this.getSupplyRestockTarget(supplyId);
    const amountNeeded = Math.max(0, target - current);
    const unitCost = definition.bulkCost / definition.bulkPack;
    const fullCost = Math.ceil(amountNeeded * unitCost);

    return {
      supplyId,
      name: definition.name,
      current,
      target,
      amountNeeded,
      unitCost,
      fullCost
    };
  }

  restockSupply(supplyId, silent = false) {
    const quote = this.getSupplyRestockQuote(supplyId);

    if (!quote) {
      if (!silent) this.announce("That supply could not be found.");
      return null;
    }

    if (quote.amountNeeded <= 0) {
      if (!silent) {
        this.announce(
          `${quote.name} already has enough stock for the current café level.`
        );
      }
      return {
        success: true,
        amountAdded: 0,
        cost: 0,
        targetReached: true
      };
    }

    const reserve = this.getProtectedCashReserve();
    const spendable = Math.max(0, this.state.coins - reserve);

    if (spendable <= 0) {
      if (!silent) {
        this.announce(
          `There is not enough safe spending money to restock ${quote.name}. The café is protecting ${CafeHelpers.formatCoins(reserve)} as emergency business money.`
        );
      }
      return {
        success: false,
        amountAdded: 0,
        cost: 0,
        targetReached: false
      };
    }

    const affordableUnits = Math.floor(spendable / quote.unitCost);
    const amountAdded = Math.min(quote.amountNeeded, affordableUnits);

    if (amountAdded <= 0) {
      if (!silent) {
        this.announce(
          `There is not enough safe spending money to restock ${quote.name} right now.`
        );
      }
      return {
        success: false,
        amountAdded: 0,
        cost: 0,
        targetReached: false
      };
    }

    const cost = Math.ceil(amountAdded * quote.unitCost);

    this.state.coins -= cost;
    this.state.supplies[supplyId] =
      this.getSupplyAmount(supplyId) + amountAdded;

    if (this.state.shift.active) {
      this.state.shift.costs += cost;
    }

    const targetReached =
      this.getSupplyAmount(supplyId) >= quote.target;

    if (!silent) {
      this.announce(
        `${quote.name} restocked. ${this.getSupplyAmount(supplyId)} servings are now available. Cost: ${CafeHelpers.formatCoins(cost)}. ${targetReached ? "Recommended stock reached." : "Partial restock completed while protecting emergency business money."}`
      );
    }

    this.save();

    return {
      success: true,
      amountAdded,
      cost,
      targetReached
    };
  }

  restockAllNeededSupplies() {
    const priority = [
      "coffeeBeans",
      "milk",
      "cups",
      "teaBags",
      "hotChocolateMix",
      "bread",
      "cheese",
      "sandwichMeat",
      "fruit",
      "muffinMix",
      "chocolateChips",
      "blueberries",
      "caramelSyrup",
      "chocolateSyrup",
      "pastryDough",
      "cookieDough",
      "cinnamonFilling",
      "donutMix",
      "danishFilling",
      "specialtyFlavor"
    ];

    const needed = priority.filter(
      supplyId =>
        CAFE_SUPPLIES[supplyId] &&
        this.isSupplyLow(supplyId)
    );

    if (needed.length === 0) {
      return this.announce("No supplies currently need restocking.");
    }

    const coinsBefore = this.state.coins;
    let totalAdded = 0;
    let suppliesRestocked = 0;

    for (const supplyId of needed) {
      const result = this.restockSupply(supplyId, true);

      if (result && result.success && result.amountAdded > 0) {
        totalAdded += result.amountAdded;
        suppliesRestocked += 1;
      }

      if (this.state.coins <= this.getProtectedCashReserve()) {
        break;
      }
    }

    const spent = Math.max(0, coinsBefore - this.state.coins);
    const remainingLow = this.getLowSupplies().length;

    this.save();

    if (suppliesRestocked === 0) {
      return this.announce(
        `No restock was purchased because the café is protecting its emergency business money. Current balance: ${CafeHelpers.formatCoins(this.state.coins)}.`
      );
    }

    this.announce(
      `Smart restock complete. ${suppliesRestocked} supplies were restocked with ${totalAdded} total servings for ${CafeHelpers.formatCoins(spent)}. Business money remaining: ${CafeHelpers.formatCoins(this.state.coins)}. ${remainingLow} supplies are still low or empty.`
    );

    return true;
  }

  getMenuAvailability() {
    const unlocked = Object.values(CAFE_MENU)
      .filter(item => item.unlockLevel <= this.state.cafeLevel);

    const available = [];
    const unavailable = [];

    unlocked.forEach(item => {
      let canSell = true;
      let reason = "";

      if (item.type === "bakery") {
        canSell = (this.state.bakeryStock[item.id] || 0) > 0;
        if (!canSell) reason = "No prepared stock";
      } else if (item.machine) {
        const machine = this.state.machines[item.machine];

        if (!machine || machine.owned <= 0) {
          canSell = false;
          reason = "Required machine not owned";
        }
      }

      if (canSell && item.type !== "bakery") {
        const sizes = item.type === "drink"
          ? ["small", "medium", "large"]
          : [null];

        canSell = sizes.some(
          size => this.getMissingRecipeSupplies(item.id, size).length === 0
        );

        if (!canSell) reason = "Required supplies are out of stock";
      }

      const entry = {
        id: item.id,
        name: item.name,
        available: canSell,
        reason
      };

      if (canSell) {
        available.push(entry);
      } else {
        unavailable.push(entry);
      }
    });

    return {
      available,
      unavailable,
      total: unlocked.length
    };
  }

  getRecipeRequirements(itemId, size = null) {
    const baseRecipe = CAFE_RECIPES[itemId];

    if (!baseRecipe) {
      return {};
    }

    let multiplier = 1;

    if (size === "large") {
      multiplier = 2;
    }

    const requirements = {};

    Object.entries(baseRecipe).forEach(([supplyId, amount]) => {
      requirements[supplyId] = amount * multiplier;
    });

    return requirements;
  }

  describeRecipeRequirements(itemId, size = null) {
    const requirements = this.getRecipeRequirements(itemId, size);
    const parts = Object.entries(requirements).map(([supplyId, amount]) => {
      const definition = CAFE_SUPPLIES[supplyId];
      return `${amount} ${definition ? definition.name : supplyId}`;
    });

    return parts.length > 0 ? parts.join(", ") : "No supplies required";
  }

  getMissingRecipeSupplies(itemId, size = null, stockOverride = null) {
    const requirements = this.getRecipeRequirements(itemId, size);
    const stock = stockOverride || this.state.supplies;

    return Object.entries(requirements)
      .filter(([supplyId, amount]) => Number(stock[supplyId] || 0) < amount)
      .map(([supplyId, amount]) => ({
        id: supplyId,
        name: CAFE_SUPPLIES[supplyId]
          ? CAFE_SUPPLIES[supplyId].name
          : supplyId,
        needed: amount,
        available: Number(stock[supplyId] || 0)
      }));
  }

  consumeRecipeSupplies(itemId, size = null) {
    const missing = this.getMissingRecipeSupplies(itemId, size);

    if (missing.length > 0) {
      const text = missing
        .map(item => `${item.name}: need ${item.needed}, have ${item.available}`)
        .join("; ");

      this.announce(`Not enough supplies. ${text}.`);
      return false;
    }

    const requirements = this.getRecipeRequirements(itemId, size);

    Object.entries(requirements).forEach(([supplyId, amount]) => {
      this.state.supplies[supplyId] = Math.max(
        0,
        this.getSupplyAmount(supplyId) - amount
      );
    });

    return true;
  }

  getPrepTarget(itemId) {
    const item = CAFE_MENU[itemId];

    if (!item || item.type !== "bakery") {
      return 0;
    }

    const targetBatches = Math.max(
      1,
      Number(this.state.shiftPrep.recommendedTargetBatches || 2)
    );

    return item.batchSize * targetBatches;
  }

  getPrepRecommendations() {
    return Object.values(CAFE_MENU)
      .filter(item => item.type === "bakery")
      .filter(item => item.unlockLevel <= this.state.cafeLevel)
      .map(item => ({
        itemId: item.id,
        name: item.name,
        stock: this.state.bakeryStock[item.id] || 0,
        target: this.getPrepTarget(item.id),
        needsPrep:
          (this.state.bakeryStock[item.id] || 0) < this.getPrepTarget(item.id)
      }));
  }

  startRecommendedPrep() {
    this.state.shiftPrep.lastVisitedAt = Date.now();

    if (this.state.cafeLevel < 3) {
      this.save();
      return this.announce(
        "Shift prep is available now for checking supplies. Bakery prep unlocks at Café Level 3."
      );
    }

    const oven = this.state.machines.oven;

    if (!oven || oven.owned <= 0) {
      return this.announce("Buy an oven before starting bakery prep.");
    }

    const openOvens = Math.max(0, oven.owned - oven.busy);

    if (openOvens <= 0) {
      return this.announce("All ovens are currently busy.");
    }

    const recommendations = this.getPrepRecommendations()
      .filter(item => item.needsPrep);

    if (recommendations.length === 0) {
      return this.announce("Recommended bakery prep is already complete.");
    }

    let started = 0;

    for (const recommendation of recommendations) {
      if (started >= openOvens) break;

      const result = this.bakeItem(recommendation.itemId);

      if (result && typeof result === "object") {
        started += 1;
      }
    }

    if (started === 0) {
      return this.announce(
        "No prep batches could be started. Check your supplies and bakery storage."
      );
    }

    const helperText = this.hasEmployeeRole("baker")
      ? " Your baker is helping with the prep."
      : "";

    this.announce(
      `${started} recommended prep ${started === 1 ? "batch" : "batches"} started.${helperText}`
    );

    this.save();
    return started;
  }

  simulateIdleSupplyUse(requestedCustomers, commit = false) {
    const supplyStock = { ...this.state.supplies };
    const bakeryStock = { ...this.state.bakeryStock };

    const menuItems = Object.values(CAFE_MENU)
      .filter(item => item.unlockLevel <= this.state.cafeLevel)
      .filter(item => {
        if (item.type === "bakery") {
          return (bakeryStock[item.id] || 0) > 0;
        }

        if (!item.machine) return true;

        const machine = this.state.machines[item.machine];
        return machine && machine.owned > 0;
      });

    if (menuItems.length === 0) {
      return {
        customersServed: 0,
        supplyStock,
        bakeryStock,
        suppliesUsed: 0
      };
    }

    let served = 0;
    let suppliesUsed = 0;

    for (let customerIndex = 0; customerIndex < requestedCustomers; customerIndex += 1) {
      let servedThisCustomer = false;

      for (let attempt = 0; attempt < menuItems.length; attempt += 1) {
        const item = menuItems[(customerIndex + attempt) % menuItems.length];

        if (item.type === "bakery") {
          if ((bakeryStock[item.id] || 0) > 0) {
            bakeryStock[item.id] -= 1;
            servedThisCustomer = true;
            break;
          }

          continue;
        }

        const requirements = this.getRecipeRequirements(
          item.id,
          item.type === "drink" ? "medium" : null
        );

        const enough = Object.entries(requirements).every(
          ([supplyId, amount]) => Number(supplyStock[supplyId] || 0) >= amount
        );

        if (!enough) {
          continue;
        }

        Object.entries(requirements).forEach(([supplyId, amount]) => {
          supplyStock[supplyId] -= amount;
          suppliesUsed += amount;
        });

        servedThisCustomer = true;
        break;
      }

      if (!servedThisCustomer) {
        break;
      }

      served += 1;
    }

    if (commit) {
      this.state.supplies = supplyStock;
      this.state.bakeryStock = bakeryStock;
    }

    return {
      customersServed: served,
      supplyStock,
      bakeryStock,
      suppliesUsed
    };
  }

  // ==========================================================
  // 17. BAKING
  // ==========================================================

  getBakeryStorageCapacity() {
    return 60 + (this.state.upgrades.bakeryStorageLevel * 20);
  }

  getTotalBakeryStock() {
    return Object.values(this.state.bakeryStock)
      .reduce((sum, amount) => sum + amount, 0);
  }

  bakeItem(itemId) {
    const item = CAFE_MENU[itemId];

    if (!item || item.type !== "bakery") {
      return this.announce("That item is not a bakery item.");
    }

    if (item.unlockLevel > this.state.cafeLevel) {
      return this.announce(`${item.name} is still locked.`);
    }

    const oven = this.state.machines.oven;

    if (oven.owned <= 0) {
      return this.announce("You do not own an oven yet.");
    }

    if (oven.busy >= oven.owned) {
      return this.announce("All ovens are currently busy.");
    }

    if (
      this.getTotalBakeryStock() + item.batchSize >
      this.getBakeryStorageCapacity()
    ) {
      return this.announce("There is not enough bakery storage space.");
    }

    const missingSupplies = this.getMissingRecipeSupplies(item.id);

    if (missingSupplies.length > 0) {
      const missingText = missingSupplies
        .map(supply => `${supply.name}: need ${supply.needed}, have ${supply.available}`)
        .join("; ");

      return this.announce(
        `You cannot bake ${item.name}. ${missingText}. Restock supplies first.`
      );
    }

    if (!this.consumeRecipeSupplies(item.id)) {
      return false;
    }

    oven.busy += 1;

    const bakerMultiplier = this.getBestEmployeeSpeedMultiplier("baker");
    const machineSpeedBonus = Math.min(
      0.5,
      this.state.upgrades.machineSpeedLevel * 0.05
    );

    const effectiveSeconds = Math.max(
      1,
      Math.round(
        item.bakeTime *
        bakerMultiplier *
        (1 - machineSpeedBonus)
      )
    );

    const bakeJob = {
      id: `bake-${Date.now()}-${Math.random()}`,
      itemId,
      itemName: item.name,
      batchSize: item.batchSize,
      endsAt: Date.now() + (effectiveSeconds * 1000)
    };

    this.state.activeBakeJobs.push(bakeJob);

    this.announce(
      `${item.name} started baking. Batch size: ${item.batchSize}. Estimated time: ${effectiveSeconds} seconds.`
    );

    setTimeout(() => {
      this.state.bakeryStock[itemId] += item.batchSize;
      this.state.machines.oven.busy = Math.max(
        0,
        this.state.machines.oven.busy - 1
      );

      this.state.activeBakeJobs = this.state.activeBakeJobs.filter(
        job => job.id !== bakeJob.id
      );

      this.announce(
        `${item.name} finished baking. ${item.batchSize} added to bakery stock.`
      );

      this.save();
    }, effectiveSeconds * 1000);

    this.save();
    return bakeJob;
  }

  // ==========================================================
  // 17. EMPLOYEE HIRING
  // ==========================================================

  getEmployeeCapacity() {
    const levelCapacity = Math.min(
      6,
      Math.max(1, this.state.cafeLevel)
    );

    const locationBonus = this.getCurrentLocation().employeeCapacityBonus || 0;
    const expansionBonus = Math.max(
      0,
      this.state.upgrades.cafeExpansionLevel - 1
    );

    return levelCapacity + locationBonus + expansionBonus;
  }

  getUnlockedEmployeeRoles() {
    return Object.entries(EMPLOYEE_ROLES)
      .filter(([, role]) => role.unlockLevel <= this.state.cafeLevel)
      .map(([id, role]) => ({ id, ...role }));
  }

  generateApplicants(roleId, count = 3) {
    const role = EMPLOYEE_ROLES[roleId];

    if (!role) {
      this.announce("Employee role not found.");
      return [];
    }

    if (role.unlockLevel > this.state.cafeLevel) {
      this.announce(`${role.name} is still locked.`);
      return [];
    }

    const skillIds = Object.keys(EMPLOYEE_SKILLS);

    const applicants = Array.from({ length: count }, () => {
      const skillId = CafeHelpers.randomItem(skillIds);
      const skill = EMPLOYEE_SKILLS[skillId];

      return {
        id: `applicant-${Date.now()}-${Math.random()}`,
        name: this.generateRandomFullName(),
        roleId,
        roleName: role.name,
        skillId,
        skillName: skill.name,
        hiringCost: skill.hiringCost,
        wage: skill.wage
      };
    });

    return applicants;
  }

  hireEmployee(applicant) {
    if (!applicant) {
      return this.announce("No applicant was selected.");
    }

    if (this.state.employees.length >= this.getEmployeeCapacity()) {
      return this.announce("Your cafe has reached its current employee limit.");
    }

    if (this.state.coins < applicant.hiringCost) {
      return this.announce(
        `You need ${CafeHelpers.formatCoins(applicant.hiringCost)} to hire ${applicant.name}.`
      );
    }

    this.state.coins -= applicant.hiringCost;

    const employee = {
      id: `employee-${Date.now()}-${Math.random()}`,
      name: applicant.name,
      roleId: applicant.roleId,
      roleName: applicant.roleName,
      skillId: applicant.skillId,
      skillName: applicant.skillName,
      wage: applicant.wage
    };

    this.state.employees.push(employee);

    this.announce(
      `${employee.name} was hired as ${employee.roleName}. Skill: ${employee.skillName}. Wage: ${CafeHelpers.formatCoins(employee.wage)} per active shift.`
    );

    this.updateBusinessValue();
    this.save();

    return employee;
  }

  autoHire(roleId) {
    const applicants = this.generateApplicants(roleId, 3);

    if (applicants.length === 0) return null;

    const affordable = applicants
      .filter(applicant => applicant.hiringCost <= this.state.coins)
      .sort((a, b) => b.hiringCost - a.hiringCost);

    if (affordable.length === 0) {
      return this.announce("No generated applicants are currently affordable.");
    }

    return this.hireEmployee(affordable[0]);
  }

  fireEmployee(employeeId) {
    const employee = this.state.employees.find(
      item => item.id === employeeId
    );

    if (!employee) {
      return this.announce("Employee not found.");
    }

    this.state.employees = this.state.employees.filter(
      item => item.id !== employeeId
    );

    this.announce(`${employee.name} is no longer employed at the cafe.`);
    this.updateBusinessValue();
    this.save();

    return true;
  }

  getBestEmployeeSpeedMultiplier(roleId) {
    const matchingEmployees = this.state.employees.filter(
      employee => employee.roleId === roleId
    );

    if (matchingEmployees.length === 0) {
      return 1;
    }

    return Math.min(
      ...matchingEmployees.map(
        employee => EMPLOYEE_SKILLS[employee.skillId].speedMultiplier
      )
    );
  }

  getBestEmployeeSpeedMultiplierForItem(item) {
    if (!this.state.settings.employeeAssistance) {
      return 1;
    }

    if (item.type === "drink") {
      return this.getBestEmployeeSpeedMultiplier("barista");
    }

    if (item.type === "grill") {
      return this.getBestEmployeeSpeedMultiplier("cashier");
    }

    return 1;
  }

  calculateActiveShiftEmployeeWages() {
    const backgroundWorkerId =
      this.state.driveThruIdle && this.state.driveThruIdle.active
        ? this.getAssignedDriveThruEmployeeId()
        : null;

    return this.state.employees.reduce(
      (sum, employee) =>
        employee.id === backgroundWorkerId
          ? sum
          : sum + employee.wage,
      0
    );
  }

  // ==========================================================
  // 17B. EMPLOYEE-RUN BAKERY
  // ==========================================================

  getBakerEmployees() {
    return this.state.employees.filter(employee => employee.roleId === "baker");
  }

  getAssignedBaker() {
    const bakers = this.getBakerEmployees();
    if (bakers.length === 0) return null;

    return [...bakers].sort((a, b) => {
      const aSkill = EMPLOYEE_SKILLS[a.skillId] || EMPLOYEE_SKILLS.beginner;
      const bSkill = EMPLOYEE_SKILLS[b.skillId] || EMPLOYEE_SKILLS.beginner;
      return aSkill.speedMultiplier - bSkill.speedMultiplier;
    })[0];
  }

  startBakeryIdle(durationMinutes = 30) {
    if (this.state.bakeryIdle.active) {
      return this.announce("A baker is already working in the background.");
    }

    const baker = this.getAssignedBaker();
    if (!baker) {
      return this.announce(
        "Hire a Baker before starting Employee-Run Bakery."
      );
    }

    if ((this.state.machines.oven?.owned || 0) < 1) {
      return this.announce("You need an oven before a baker can work.");
    }

    const allowed = this.getAvailableIdleDurations();
    if (!allowed.includes(durationMinutes)) {
      return this.announce("That bakery operating time is not unlocked.");
    }

    const startedAt = Date.now();
    this.state.bakeryIdle = {
      active: true,
      durationMinutes,
      startedAt,
      endsAt: startedAt + durationMinutes * 60000,
      lastResult: null
    };

    this.announce(
      `${baker.name} started working in the bakery for ${this.formatMinutes(durationMinutes)}. The baker will automatically make available pastries while you work elsewhere.`
    );
    this.save();
    return true;
  }

  calculateBakeryIdleResult() {
    if (!this.state.bakeryIdle.active) return null;

    const elapsedMinutes = Math.max(
      0,
      Math.min(
        Date.now() - this.state.bakeryIdle.startedAt,
        this.state.bakeryIdle.endsAt - this.state.bakeryIdle.startedAt
      ) / 60000
    );

    const baker = this.getAssignedBaker();
    if (!baker || elapsedMinutes <= 0) return null;

    const skill = EMPLOYEE_SKILLS[baker.skillId] || EMPLOYEE_SKILLS.beginner;
    const batchesPerHour =
      skill.speedMultiplier <= 0.6 ? 6 :
      skill.speedMultiplier <= 0.8 ? 5 : 4;

    return {
      elapsedMinutes: Math.round(elapsedMinutes),
      batches: Math.max(1, Math.floor((elapsedMinutes / 60) * batchesPerHour)),
      bakerName: baker.name
    };
  }

  collectBakeryIdle() {
    if (!this.state.bakeryIdle.active) {
      return this.announce("There is no Employee-Run Bakery session to collect.");
    }

    if (Date.now() < this.state.bakeryIdle.endsAt) {
      const remaining = Math.ceil(
        (this.state.bakeryIdle.endsAt - Date.now()) / 60000
      );
      return this.announce(
        `The baker is still working. About ${this.formatMinutes(remaining)} remaining.`
      );
    }

    const result = this.calculateBakeryIdleResult();
    if (!result) return this.announce("No bakery result is available.");

    const unlocked = Object.values(CAFE_MENU).filter(
      item => item.type === "bakery" && this.state.cafeLevel >= item.unlockLevel
    );

    let batchesMade = 0;
    let itemsMade = 0;

    for (let i = 0; i < result.batches; i += 1) {
      const candidates = unlocked
        .filter(item => this.canMakeMenuItem(item.id, null, true))
        .sort(
          (a, b) =>
            (this.state.bakeryStock[a.id] || 0) -
            (this.state.bakeryStock[b.id] || 0)
        );

      const item = candidates[0];
      if (!item) break;

      const capacityRemaining =
        this.getBakeryStorageCapacity() - this.getTotalBakeryStock();
      if (capacityRemaining <= 0) break;

      if (!this.consumeSuppliesForMenuItem(item.id, null, true)) break;

      const made = Math.min(item.batchSize, capacityRemaining);
      this.state.bakeryStock[item.id] =
        (this.state.bakeryStock[item.id] || 0) + made;
      batchesMade += 1;
      itemsMade += made;
    }

    this.state.bakeryIdle = {
      active: false,
      durationMinutes: 0,
      startedAt: null,
      endsAt: null,
      lastResult: {
        bakerName: result.bakerName,
        batchesMade,
        itemsMade
      }
    };

    this.announce(
      `Employee-Run Bakery complete. ${result.bakerName} made ${batchesMade} batches, adding ${itemsMade} pastries to bakery stock.`
    );
    this.save();
    return this.state.bakeryIdle.lastResult;
  }

  // ==========================================================
  // 18. MACHINES
  // ==========================================================

  getMachinePurchaseCost(machineId) {
    const definition = MACHINE_DEFINITIONS[machineId];
    const state = this.state.machines[machineId];

    if (!definition || !state) {
      return null;
    }

    if (state.owned === 0) {
      return 0;
    }

    return definition.baseCost * state.owned;
  }

  buyMachine(machineId) {
    const definition = MACHINE_DEFINITIONS[machineId];
    const machine = this.state.machines[machineId];

    if (!definition || !machine) {
      return this.announce("Machine not found.");
    }

    if (definition.unlockLevel > this.state.cafeLevel) {
      return this.announce(`${definition.name} is still locked.`);
    }

    const locationMachineBonus =
      this.getCurrentLocation().machineCapacityBonus || 0;

    const copyLimit =
      definition.maxCopies +
      locationMachineBonus +
      Math.max(0, this.state.upgrades.cafeExpansionLevel - 1);

    if (machine.owned >= copyLimit) {
      return this.announce(
        `You have reached the current limit for ${definition.name}.`
      );
    }

    if (machine.owned === 0) {
      machine.owned = 1;
      this.announce(
        `${definition.name} unlocked. Your first one is free.`
      );
      this.save();
      return true;
    }

    const cost = this.getMachinePurchaseCost(machineId);

    if (this.state.coins < cost) {
      return this.announce(
        `You need ${CafeHelpers.formatCoins(cost)} to buy another ${definition.name}.`
      );
    }

    this.state.coins -= cost;
    machine.owned += 1;

    this.announce(
      `You purchased another ${definition.name} for ${CafeHelpers.formatCoins(cost)}. You now own ${machine.owned}.`
    );

    this.updateBusinessValue();
    this.save();

    return true;
  }

  // ==========================================================
  // 19. DRIVE-THRU
  // ==========================================================

  getDriveThruEmployees() {
    return this.state.employees.filter(
      employee => employee.roleId === "driveThruWorker"
    );
  }

  getAssignedDriveThruEmployeeId() {
    const workers = this.getDriveThruEmployees();

    if (workers.length === 0) return null;

    const best = [...workers].sort((a, b) => {
      const aSkill = EMPLOYEE_SKILLS[a.skillId] || EMPLOYEE_SKILLS.beginner;
      const bSkill = EMPLOYEE_SKILLS[b.skillId] || EMPLOYEE_SKILLS.beginner;
      return aSkill.speedMultiplier - bSkill.speedMultiplier;
    })[0];

    return best ? best.id : null;
  }

  getAssignedDriveThruEmployee() {
    const id = this.getAssignedDriveThruEmployeeId();

    return id
      ? this.state.employees.find(employee => employee.id === id) || null
      : null;
  }

  getDriveThruEmployeeRate() {
    if (!this.state.driveThruUnlocked) return 0;

    const employee = this.getAssignedDriveThruEmployee();
    if (!employee) return 0;

    const skill =
      EMPLOYEE_SKILLS[employee.skillId] || EMPLOYEE_SKILLS.beginner;

    const skillMultiplier =
      skill.speedMultiplier <= 0.6
        ? 1.35
        : skill.speedMultiplier <= 0.8
          ? 1.18
          : 1;

    const laneMultiplier =
      1 + Math.max(0, this.state.driveThruLanes - 1) * 0.35;

    const locationMultiplier =
      this.getCurrentLocation().trafficMultiplier || 1;

    return Math.max(
      1,
      Math.round(
        18 *
        skillMultiplier *
        laneMultiplier *
        locationMultiplier
      )
    );
  }

  startDriveThruIdle(durationMinutes = 30) {
    if (!this.state.driveThruUnlocked) {
      return this.announce("The drive-thru is still locked.");
    }

    if (
      this.state.shift.active &&
      (this.state.shift.workArea || "counter") === "driveThru"
    ) {
      return this.announce(
        "You are already personally working the drive-thru. The drive-thru employee cannot run a separate background drive-thru session at the same time."
      );
    }

    if (this.state.driveThruIdle.active) {
      return this.announce(
        "A drive-thru employee session is already running."
      );
    }

    const employee = this.getAssignedDriveThruEmployee();

    if (!employee) {
      return this.announce(
        "Hire a Drive-Thru Worker before starting background drive-thru operations."
      );
    }

    const allowed = this.getAvailableIdleDurations();

    if (!allowed.includes(durationMinutes)) {
      return this.announce(
        "That drive-thru employee operating time is not unlocked yet."
      );
    }

    const startedAt = Date.now();

    this.state.driveThruIdle = {
      active: true,
      durationMinutes,
      startedAt,
      endsAt: startedAt + (durationMinutes * 60 * 1000),
      lastResult: null
    };

    this.announce(
      `${employee.name} started working the drive-thru in the background for ${this.formatMinutes(durationMinutes)}. You can personally work a Café Counter shift while the drive-thru continues.`
    );

    this.save();
    return true;
  }

  calculateDriveThruIdleResult() {
    if (!this.state.driveThruIdle.active) {
      return null;
    }

    const now = Date.now();
    const elapsedMs = Math.max(
      0,
      Math.min(
        now - this.state.driveThruIdle.startedAt,
        this.state.driveThruIdle.endsAt -
          this.state.driveThruIdle.startedAt
      )
    );

    const elapsedMinutes = elapsedMs / 60000;

    if (elapsedMinutes <= 0) {
      return null;
    }

    const employee = this.getAssignedDriveThruEmployee();
    const customersPerHour = this.getDriveThruEmployeeRate();

    const customersServed = Math.max(
      0,
      Math.floor((elapsedMinutes / 60) * customersPerHour)
    );

    const averageSale = this.getAverageUnlockedSalePrice();
    const grossSales = CafeHelpers.roundCoins(
      customersServed * averageSale
    );

    const ingredientCosts = CafeHelpers.roundCoins(
      grossSales * 0.30
    );

    const employeeCosts = employee
      ? CafeHelpers.roundCoins(
          employee.wage * Math.max(0.5, elapsedMinutes / 60)
        )
      : 0;

    const totalCosts = ingredientCosts + employeeCosts;
    const profit = Math.max(0, grossSales - totalCosts);

    return {
      elapsedMinutes: Math.round(elapsedMinutes),
      customersPerHour,
      customersServed,
      grossSales,
      ingredientCosts,
      employeeCosts,
      totalCosts,
      profit,
      employeeName: employee ? employee.name : "Drive-Thru Worker"
    };
  }

  collectDriveThruIdle() {
    if (!this.state.driveThruIdle.active) {
      return this.announce(
        "There is no background drive-thru employee session to collect."
      );
    }

    if (Date.now() < this.state.driveThruIdle.endsAt) {
      const remaining = Math.ceil(
        (this.state.driveThruIdle.endsAt - Date.now()) / 60000
      );

      return this.announce(
        `The drive-thru employee is still working. Time remaining: ${this.formatMinutes(remaining)}.`
      );
    }

    const result = this.calculateDriveThruIdleResult();

    if (!result) {
      return this.announce("No drive-thru result is available.");
    }

    this.state.coins += result.profit;
    this.state.lifetimeCustomersServed += result.customersServed;

    this.state.driveThruIdle = {
      active: false,
      durationMinutes: 0,
      startedAt: null,
      endsAt: null,
      lastResult: {
        ...result,
        credited: true
      }
    };

    this.announce(
      `Background drive-thru complete. ${result.employeeName} served ${result.customersServed} customers. Sales: ${CafeHelpers.formatCoins(result.grossSales)}. Costs: ${CafeHelpers.formatCoins(result.totalCosts)}. Profit added to the café: ${CafeHelpers.formatCoins(result.profit)}.`
    );

    this.checkLevelUp();
    this.updateBusinessValue();
    this.save();

    return result;
  }

  buyDriveThruLane() {
    if (!this.state.driveThruUnlocked) {
      return this.announce("The drive-thru is still locked.");
    }

    const current = this.state.driveThruLanes;
    const cost = 300 * current;

    if (this.state.coins < cost) {
      return this.announce(
        `You need ${CafeHelpers.formatCoins(cost)} to add another drive-thru lane.`
      );
    }

    this.state.coins -= cost;
    this.state.driveThruLanes += 1;

    this.announce(
      `You purchased drive-thru lane ${this.state.driveThruLanes} for ${CafeHelpers.formatCoins(cost)}.`
    );

    this.updateBusinessValue();
    this.save();

    return true;
  }

  // ==========================================================
  // 20. UPGRADES
  // ==========================================================

  getUpgradeCost(type) {
    const level = this.state.upgrades[type];

    if (level === undefined) {
      return null;
    }

    const baseCosts = {
      customerCapacityLevel: 250,
      bakeryStorageLevel: 300,
      machineSpeedLevel: 500,
      idleTimeLevel: 750,
      cafeExpansionLevel: 5000
    };

    const base = baseCosts[type];

    if (!base) return null;

    if (type === "cafeExpansionLevel") {
      return base * level;
    }

    return base * (level + 1);
  }

  buyUpgrade(type) {
    if (this.state.upgrades[type] === undefined) {
      return this.announce("Upgrade type not found.");
    }

    if (type === "machineSpeedLevel" &&
        this.state.upgrades.machineSpeedLevel >= 10) {
      return this.announce(
        "Machine speed is already at the Version 1.0 maximum."
      );
    }

    const cost = this.getUpgradeCost(type);

    if (this.state.coins < cost) {
      return this.announce(
        `You need ${CafeHelpers.formatCoins(cost)} for this upgrade.`
      );
    }

    this.state.coins -= cost;
    this.state.upgrades[type] += 1;

    this.announce(
      `${this.getUpgradeDisplayName(type)} upgraded to level ${this.state.upgrades[type]} for ${CafeHelpers.formatCoins(cost)}.`
    );

    this.updateBusinessValue();
    this.save();

    return true;
  }

  getUpgradeDisplayName(type) {
    const names = {
      customerCapacityLevel: "Customer Capacity",
      bakeryStorageLevel: "Bakery Storage",
      machineSpeedLevel: "Machine Speed",
      idleTimeLevel: "Idle Operating Time",
      cafeExpansionLevel: "Cafe Expansion"
    };

    return names[type] || type;
  }

  // ==========================================================
  // 21. IDLE OPERATING TIME
  // ==========================================================

  getAvailableIdleDurations() {
    const level = this.state.upgrades.idleTimeLevel;

    const durations = [30];

    if (level >= 1 || this.state.cafeLevel >= 2) durations.push(60);
    if (level >= 2 || this.state.cafeLevel >= 4) durations.push(120);
    if (level >= 3 || this.state.cafeLevel >= 6) durations.push(240);
    if (level >= 4 || this.state.cafeLevel >= 8) durations.push(360);
    if (level >= 5 || this.state.cafeLevel >= 10) durations.push(480);

    return [...new Set(durations)].sort((a, b) => a - b);
  }

  startIdleCafe(durationMinutes) {
    if (this.state.idle.active) {
      return this.announce("An idle cafe session is already running.");
    }

    const allowed = this.getAvailableIdleDurations();

    if (!allowed.includes(durationMinutes)) {
      return this.announce(
        "That idle operating time is not unlocked yet."
      );
    }

    if (this.state.employees.length === 0) {
      return this.announce(
        "Hire at least one employee before starting idle cafe operations."
      );
    }

    const startedAt = Date.now();

    this.state.idle = {
      active: true,
      durationMinutes,
      startedAt,
      endsAt: startedAt + (durationMinutes * 60 * 1000),
      lastResult: null
    };

    this.announce(
      `Idle cafe operations started for ${this.formatMinutes(durationMinutes)}. Your employees will keep the idle cafe running in the background. You may also play a regular active shift while the idle timer continues.`
    );

    this.save();
    return true;
  }

  getIdleCustomersPerHour() {
    const location = this.getCurrentLocation();

    // Idle mode has no fixed customer-count cap. Customers continue to be
    // simulated for the full selected duration. Better staffing, skills,
    // machines, locations, drive-thru lanes, and cafe levels increase throughput.
    let baseRate = 36 + (this.state.cafeLevel * 4);

    const roleBonuses = {
      cashier: 0.25,
      barista: 0.20,
      baker: 0.10,
      driveThruWorker: this.state.driveThruUnlocked ? 0.18 : 0,
      cleaner: 0.08,
      assistantManager: 0.22
    };

    let employeeBonus = 0;

    this.state.employees.forEach(employee => {
      employeeBonus += roleBonuses[employee.roleId] || 0;

      const skill = EMPLOYEE_SKILLS[employee.skillId];
      if (skill) {
        if (employee.skillId === "experienced") employeeBonus += 0.05;
        if (employee.skillId === "skilled") employeeBonus += 0.10;
      }
    });

    const machineCount = Object.values(this.state.machines)
      .reduce((sum, machine) => sum + machine.owned, 0);

    const machineMultiplier = 1 + (machineCount * 0.03);
    const staffingMultiplier = 1 + employeeBonus;
    const driveThruMultiplier = this.state.driveThruUnlocked
      ? 1 + (this.state.driveThruLanes * 0.08)
      : 1;

    const decoration = DECORATION_PACKAGES[this.state.currentDecoration];
    const decorationMultiplier =
      decoration && decoration.businessValueBonus > 0
        ? 1.03
        : 1;

    return Math.max(
      1,
      Math.floor(
        baseRate *
        staffingMultiplier *
        machineMultiplier *
        location.trafficMultiplier *
        driveThruMultiplier *
        decorationMultiplier
      )
    );
  }

  calculateIdleResult() {
    if (!this.state.idle.active) {
      return null;
    }

    const now = Date.now();
    const elapsedMs = Math.min(
      Math.max(0, now - this.state.idle.startedAt),
      this.state.idle.endsAt - this.state.idle.startedAt
    );

    const elapsedMinutes = Math.max(0, elapsedMs / 60000);

    if (elapsedMinutes <= 0) {
      return null;
    }

    const customersPerHour = this.getIdleCustomersPerHour();

    // There is intentionally no fixed customer-count cap.
    // Actual service is now limited by time, staffing, machines, and stocked supplies.
    const requestedCustomers = Math.max(
      1,
      Math.floor((elapsedMinutes / 60) * customersPerHour)
    );

    const supplyResult = this.simulateIdleSupplyUse(
      requestedCustomers,
      false
    );

    const customersServed = supplyResult.customersServed;

    const averageSale = this.getAverageUnlockedSalePrice();
    const grossSales = CafeHelpers.roundCoins(
      customersServed * averageSale
    );

    // Supplies are paid for when purchased, so idle collection does not
    // charge ingredient costs a second time.
    const ingredientCosts = 0;

    const employeeHourlyCost = this.state.employees.reduce(
      (sum, employee) => sum + (employee.wage / 2),
      0
    );

    const employeeCosts = CafeHelpers.roundCoins(
      employeeHourlyCost * (elapsedMinutes / 60)
    );

    const locationCosts = CafeHelpers.roundCoins(
      this.calculateLocationOperatingCost() *
      Math.max(0.5, elapsedMinutes / 60)
    );

    const totalCosts =
      ingredientCosts +
      employeeCosts +
      locationCosts;

    const profit = Math.max(
      0,
      grossSales - totalCosts
    );

    return {
      elapsedMinutes: Math.round(elapsedMinutes),
      customersPerHour,
      customersServed,
      grossSales,
      ingredientCosts,
      employeeCosts,
      locationCosts,
      totalCosts,
      profit,
      requestedCustomers,
      suppliesUsed: supplyResult.suppliesUsed,
      credited: false,
      completedAt: this.state.idle.endsAt
    };
  }

  finishIdleCafeSession() {
    if (!this.state.idle.active) {
      return this.state.idle.lastResult || null;
    }

    const now = Date.now();

    if (now < this.state.idle.endsAt) {
      return null;
    }

    const result = this.calculateIdleResult();

    if (!result) {
      return null;
    }

    // Commit exactly the supply use represented by the completed result.
    const committedSupplyResult = this.simulateIdleSupplyUse(
      result.requestedCustomers || result.customersServed,
      true
    );

    result.customersServed = committedSupplyResult.customersServed;
    result.suppliesUsed = committedSupplyResult.suppliesUsed;

    const averageSale = this.getAverageUnlockedSalePrice();
    result.grossSales = CafeHelpers.roundCoins(
      result.customersServed * averageSale
    );
    result.totalCosts =
      result.employeeCosts +
      result.locationCosts;
    result.profit = Math.max(
      0,
      result.grossSales - result.totalCosts
    );

    this.state.idle.active = false;
    this.state.idle.lastResult = result;
    this.state.idle.startedAt = null;
    this.state.idle.endsAt = null;
    this.state.idle.durationMinutes = 0;

    this.announce(
      `Idle cafe session complete. ${result.customersServed} customers were served. Gross sales: ${CafeHelpers.formatCoins(result.grossSales)}. Total expenses: ${CafeHelpers.formatCoins(result.totalCosts)}. Profit ready to collect: ${CafeHelpers.formatCoins(result.profit)}.`
    );

    this.save();
    return result;
  }

  collectIdleCafe() {
    if (this.state.idle.active) {
      const now = Date.now();

      if (now < this.state.idle.endsAt) {
        return this.announce(
          `Idle cafe operations are still running. Time remaining: ${this.formatMinutes(Math.ceil((this.state.idle.endsAt - now) / 60000))}.`
        );
      }

      this.finishIdleCafeSession();
    }

    const result = this.state.idle.lastResult;

    if (!result) {
      return this.announce("There is no completed idle cafe session to collect.");
    }

    // Old Version 1.0 results were already credited at the moment they were
    // created. Mark those legacy results as collected so upgrading this file
    // cannot accidentally pay the same session twice.
    if (result.credited === undefined) {
      result.credited = true;
      this.save();
      return this.announce(
        "This earlier idle cafe result was already added to your cafe balance."
      );
    }

    if (result.credited) {
      return this.announce("These idle cafe earnings have already been collected.");
    }

    const coinsBefore = this.state.coins;

    this.state.coins += result.profit;
    this.state.lifetimeCustomersServed += result.customersServed;
    result.credited = true;
    result.collectedAt = Date.now();
    result.coinsBefore = coinsBefore;
    result.coinsAfter = this.state.coins;

    this.checkLevelUp();
    this.updateBusinessValue();
    this.save();

    this.announce(
      `Idle cafe earnings collected. ${result.customersServed} customers served. Sales: ${CafeHelpers.formatCoins(result.grossSales)}. Expenses: ${CafeHelpers.formatCoins(result.totalCosts)}. Profit collected: ${CafeHelpers.formatCoins(result.profit)}. Cafe balance: ${CafeHelpers.formatCoins(this.state.coins)}.`
    );

    return result;
  }

  hasEmployeeRole(roleId) {
    return this.state.employees.some(
      employee => employee.roleId === roleId
    );
  }

  getAverageUnlockedSalePrice() {
    const items = Object.values(CAFE_MENU).filter(
      item => item.unlockLevel <= this.state.cafeLevel
    );

    if (items.length === 0) return 5;

    const prices = items.map(item => {
      if (item.type === "drink") {
        return item.prices.medium;
      }

      return item.price;
    });

    return prices.reduce((sum, price) => sum + price, 0) / prices.length;
  }

  formatMinutes(minutes) {
    const rounded = Math.max(0, Math.round(minutes));

    if (rounded < 60) {
      return `${rounded} minutes`;
    }

    const hours = Math.floor(rounded / 60);
    const remaining = rounded % 60;

    if (remaining === 0) {
      return `${hours} ${hours === 1 ? "hour" : "hours"}`;
    }

    return `${hours} ${hours === 1 ? "hour" : "hours"} ${remaining} minutes`;
  }

  // ==========================================================
  // 22. LOCATIONS
  // ==========================================================

  getCurrentLocation() {
    return CAFE_LOCATIONS.find(
      location => location.id === this.state.currentLocationId
    ) || CAFE_LOCATIONS[0];
  }

  getNextLocation() {
    const currentIndex = CAFE_LOCATIONS.findIndex(
      location => location.id === this.state.currentLocationId
    );

    if (currentIndex < 0 || currentIndex >= CAFE_LOCATIONS.length - 1) {
      return null;
    }

    return CAFE_LOCATIONS[currentIndex + 1];
  }

  getLocationProgress() {
    const next = this.getNextLocation();

    if (!next) {
      return {
        complete: true,
        message: "All current Version 1.0 cafe locations have been purchased."
      };
    }

    const remaining = Math.max(
      0,
      next.cost - this.state.coins
    );

    return {
      complete: false,
      nextLocation: next.name,
      cost: next.cost,
      currentCoins: this.state.coins,
      remaining,
      canAfford: this.state.coins >= next.cost
    };
  }

  buyNextLocation() {
    const next = this.getNextLocation();

    if (!next) {
      return this.announce(
        "There is no additional Version 1.0 cafe location to purchase."
      );
    }

    if (this.state.coins < next.cost) {
      const remaining = next.cost - this.state.coins;

      return this.announce(
        `${next.name} costs ${CafeHelpers.formatCoins(next.cost)}. You need ${CafeHelpers.formatCoins(remaining)} more.`
      );
    }

    this.state.coins -= next.cost;
    this.state.currentLocationId = next.id;

    this.announce(
      `${next.name} purchased for ${CafeHelpers.formatCoins(next.cost)}. Your cafe has moved to the new location.`
    );

    this.updateBusinessValue();
    this.save();

    return next;
  }

  calculateLocationOperatingCost() {
    const location = this.getCurrentLocation();

    const base = 10;
    return CafeHelpers.roundCoins(
      base * location.operatingCostMultiplier
    );
  }

  // ==========================================================
  // 23. DECORATIONS
  // ==========================================================

  canUseDecoration(decorationId) {
    const decoration = DECORATION_PACKAGES[decorationId];

    if (!decoration) return false;

    if (decoration.unlockLevel > this.state.cafeLevel) {
      return false;
    }

    if (decoration.locationRequirement) {
      const requiredIndex = CAFE_LOCATIONS.findIndex(
        location => location.id === decoration.locationRequirement
      );

      const currentIndex = CAFE_LOCATIONS.findIndex(
        location => location.id === this.state.currentLocationId
      );

      if (currentIndex < requiredIndex) {
        return false;
      }
    }

    return true;
  }

  buyDecoration(decorationId) {
    const decoration = DECORATION_PACKAGES[decorationId];

    if (!decoration) {
      return this.announce("Decoration package not found.");
    }

    if (this.state.ownedDecorations.includes(decorationId)) {
      return this.announce(
        `You already own the ${decoration.name}.`
      );
    }

    if (!this.canUseDecoration(decorationId)) {
      return this.announce(
        `${decoration.name} is still locked.`
      );
    }

    if (this.state.coins < decoration.cost) {
      return this.announce(
        `You need ${CafeHelpers.formatCoins(decoration.cost)} to buy the ${decoration.name}.`
      );
    }

    this.state.coins -= decoration.cost;
    this.state.ownedDecorations.push(decorationId);

    this.announce(
      `${decoration.name} purchased for ${CafeHelpers.formatCoins(decoration.cost)}.`
    );

    this.updateBusinessValue();
    this.save();

    return true;
  }

  applyDecoration(decorationId) {
    if (!this.state.ownedDecorations.includes(decorationId)) {
      return this.announce("You do not own that decoration package.");
    }

    const decoration = DECORATION_PACKAGES[decorationId];

    if (!decoration) {
      return this.announce("Decoration package not found.");
    }

    this.state.currentDecoration = decorationId;

    this.announce(
      `${decoration.name} applied. ${decoration.description}`
    );

    this.save();
    return true;
  }

  // ==========================================================
  // 24. BUSINESS VALUE
  // ==========================================================

  updateBusinessValue() {
    let value = 1000;

    value += this.state.cafeLevel * 500;
    value += this.state.lifetimeCustomersServed * 5;

    const locationIndex = CAFE_LOCATIONS.findIndex(
      location => location.id === this.state.currentLocationId
    );

    if (locationIndex >= 0) {
      value += CAFE_LOCATIONS[locationIndex].cost;
    }

    Object.entries(this.state.machines).forEach(([machineId, machine]) => {
      const definition = MACHINE_DEFINITIONS[machineId];

      if (definition) {
        value += machine.owned * definition.baseCost;
      }
    });

    value += this.state.employees.length * 250;

    value += this.state.upgrades.customerCapacityLevel * 300;
    value += this.state.upgrades.bakeryStorageLevel * 350;
    value += this.state.upgrades.machineSpeedLevel * 600;
    value += this.state.upgrades.idleTimeLevel * 800;
    value += this.state.upgrades.cafeExpansionLevel * 3000;

    this.state.ownedDecorations.forEach(decorationId => {
      const decoration = DECORATION_PACKAGES[decorationId];

      if (decoration) {
        value += decoration.businessValueBonus || 0;
      }
    });

    this.state.businessValue = CafeHelpers.roundCoins(value);

    return this.state.businessValue;
  }

  // ==========================================================
  // 25. CAFE STATUS
  // ==========================================================

  getCafeStatus() {
    const location = this.getCurrentLocation();
    const nextLevelCustomers =
      this.customersNeededForLevel(this.state.cafeLevel + 1);

    const levelRemaining = Math.max(
      0,
      nextLevelCustomers - this.state.lifetimeCustomersServed
    );

    const locationProgress = this.getLocationProgress();

    return {
      cafeName: this.state.cafeName,
      cafeLevel: this.state.cafeLevel,
      coins: this.state.coins,
      location: location.name,
      currentShift: this.state.shift.number,
      shiftActive: this.state.shift.active,
      shiftCustomers: this.state.shift.customersServed,
      shiftGoal: this.getShiftGoal(),
      lifetimeCustomers: this.state.lifetimeCustomersServed,
      customersUntilNextLevel: levelRemaining,
      employees: this.state.employees.length,
      employeeCapacity: this.getEmployeeCapacity(),
      customerCapacity: this.getCustomerCapacity(),
      bakeryStock: this.getTotalBakeryStock(),
      bakeryCapacity: this.getBakeryStorageCapacity(),
      businessValue: this.state.businessValue,
      nextLocation: locationProgress.complete
        ? null
        : locationProgress.nextLocation,
      nextLocationCost: locationProgress.complete
        ? null
        : locationProgress.cost,
      coinsNeededForNextLocation: locationProgress.complete
        ? null
        : locationProgress.remaining
    };
  }

  getCafeStatusText() {
    const status = this.getCafeStatus();

    const lines = [
      `${status.cafeName}.`,
      `Cafe Level: ${status.cafeLevel}.`,
      `Location: ${status.location}.`,
      `Coins: ${CafeHelpers.formatCoins(status.coins)}.`,
      `Current Shift: ${status.currentShift}.`,
      `Shift status: ${status.shiftActive ? "Active" : "Not active"}.`,
      `Customers served this shift: ${status.shiftCustomers} of ${status.shiftGoal}.`,
      `Lifetime customers served: ${status.lifetimeCustomers}.`,
      `Customers until next cafe level: ${status.customersUntilNextLevel}.`,
      `Employees: ${status.employees} of ${status.employeeCapacity}.`,
      `Customer waiting capacity: ${status.customerCapacity}.`,
      `Bakery stock: ${status.bakeryStock} of ${status.bakeryCapacity}.`,
      `Business Value: ${CafeHelpers.formatCoins(status.businessValue)}.`
    ];

    if (status.nextLocation) {
      lines.push(
        `Next location: ${status.nextLocation}. Cost: ${CafeHelpers.formatCoins(status.nextLocationCost)}. You need ${CafeHelpers.formatCoins(status.coinsNeededForNextLocation)} more.`
      );
    }

    return lines.join(" ");
  }

  // ==========================================================
  // 26. SETTINGS
  // ==========================================================

  setHiringMode(mode) {
    if (!["manual", "automatic"].includes(mode)) {
      return this.announce(
        "Hiring mode must be manual or automatic."
      );
    }

    this.state.settings.hiringMode = mode;

    this.announce(`Hiring mode changed to ${mode}.`);
    this.save();

    return true;
  }

  setEmployeeAssistance(enabled) {
    this.state.settings.employeeAssistance = Boolean(enabled);

    this.announce(
      `Employee assistance ${enabled ? "enabled" : "disabled"}.`
    );

    this.save();
    return true;
  }

  // ==========================================================
  // 27. SAVE AND LOAD
  // ==========================================================

  save() {
    if (typeof localStorage === "undefined") {
      return false;
    }

    try {
      localStorage.setItem(
        CAFE_SAVE_KEY,
        JSON.stringify(this.state)
      );

      return true;
    } catch (error) {
      console.error("Cafe save failed:", error);
      return false;
    }
  }

  load() {
    if (typeof localStorage === "undefined") {
      return false;
    }

    try {
      const raw = localStorage.getItem(CAFE_SAVE_KEY);

      if (!raw) {
        return false;
      }

      const saved = JSON.parse(raw);

      this.state = this.mergeState(
        this.createNewState(),
        saved
      );

      this.restoreTimedState();
      this.updateBusinessValue();

      return true;
    } catch (error) {
      console.error("Cafe load failed:", error);
      return false;
    }
  }

  mergeState(defaultState, savedState) {
    const merged = {
      ...defaultState,
      ...savedState
    };

    merged.shift = {
      ...defaultState.shift,
      ...(savedState.shift || {})
    };

    merged.machines = {
      ...defaultState.machines,
      ...(savedState.machines || {})
    };

    Object.keys(defaultState.machines).forEach(machineId => {
      merged.machines[machineId] = {
        ...defaultState.machines[machineId],
        ...((savedState.machines || {})[machineId] || {})
      };
    });

    merged.bakeryStock = {
      ...defaultState.bakeryStock,
      ...(savedState.bakeryStock || {})
    };

    merged.supplies = {
      ...defaultState.supplies,
      ...(savedState.supplies || {})
    };

    merged.shiftPrep = {
      ...defaultState.shiftPrep,
      ...(savedState.shiftPrep || {})
    };

    merged.settings = {
      ...defaultState.settings,
      ...(savedState.settings || {})
    };

    merged.diningRoom = {
      ...defaultState.diningRoom,
      ...(savedState.diningRoom || {}),
      tables: Array.isArray(savedState.diningRoom?.tables)
        ? savedState.diningRoom.tables
        : defaultState.diningRoom.tables
    };

    merged.upgrades = {
      ...defaultState.upgrades,
      ...(savedState.upgrades || {})
    };

    merged.idle = {
      ...defaultState.idle,
      ...(savedState.idle || {})
    };

    merged.driveThruIdle = {
      ...defaultState.driveThruIdle,
      ...(savedState.driveThruIdle || {})
    };

    merged.bakeryIdle = {
      ...defaultState.bakeryIdle,
      ...(savedState.bakeryIdle || {})
    };

    if (!Array.isArray(merged.customers)) merged.customers = [];
    if (!Array.isArray(merged.orders)) merged.orders = [];
    if (!Array.isArray(merged.employees)) merged.employees = [];
    if (!Array.isArray(merged.activeBakeJobs)) merged.activeBakeJobs = [];
    if (!Array.isArray(merged.ownedDecorations)) merged.ownedDecorations = ["basic"];
    if (!Array.isArray(merged.messages)) merged.messages = [];

    if (!CAFE_DIFFICULTIES[merged.settings.shiftDifficulty]) {
      merged.settings.shiftDifficulty = "beginner";
    }

    const savedTutorials =
      savedState &&
      savedState.settings &&
      savedState.settings.tutorialsSeen
        ? savedState.settings.tutorialsSeen
        : {};

    merged.settings.tutorialsSeen = {
      beginner: Boolean(savedTutorials.beginner),
      easy: Boolean(savedTutorials.easy),
      medium: Boolean(savedTutorials.medium),
      hard: Boolean(savedTutorials.hard),
      expert: Boolean(savedTutorials.expert)
    };

    if (!CAFE_DIFFICULTIES[merged.shift.difficulty]) {
      merged.shift.difficulty = merged.settings.shiftDifficulty;
    }

    if (!["counter", "driveThru"].includes(merged.shift.workArea)) {
      merged.shift.workArea = "counter";
    }

    return merged;
  }

  restoreTimedState() {
    this.state.machines.oven.busy = 0;

    const now = Date.now();
    const restoredJobs = [];

    for (const job of this.state.activeBakeJobs) {
      const item = CAFE_MENU[job.itemId];

      if (!item) continue;

      if (job.endsAt <= now) {
        this.state.bakeryStock[job.itemId] =
          (this.state.bakeryStock[job.itemId] || 0) +
          job.batchSize;

        this.announce(
          `${job.itemName} finished baking while you were away. ${job.batchSize} added to stock.`
        );
      } else {
        restoredJobs.push(job);
        this.state.machines.oven.busy += 1;

        const remainingMs = job.endsAt - now;

        setTimeout(() => {
          this.state.bakeryStock[job.itemId] += job.batchSize;
          this.state.machines.oven.busy = Math.max(
            0,
            this.state.machines.oven.busy - 1
          );

          this.state.activeBakeJobs = this.state.activeBakeJobs.filter(
            itemJob => itemJob.id !== job.id
          );

          this.announce(
            `${job.itemName} finished baking. ${job.batchSize} added to stock.`
          );

          this.save();
        }, remainingMs);
      }
    }

    this.state.activeBakeJobs = restoredJobs;

    Object.values(this.state.machines).forEach(machine => {
      if (machine !== this.state.machines.oven) {
        machine.busy = 0;
      }
    });

    const nowForPatience = CafeHelpers.now();
    this.state.customers.forEach(customer => {
      if (customer.patienceRemainingMs === undefined) {
        customer.patienceRemainingMs = this.getCustomerPatienceMs();
      }
      customer.patienceLastUpdatedAt = nowForPatience;
      customer.patienceWarningGiven = Boolean(customer.patienceWarningGiven);
    });

    this.state.orders.forEach(order => {
      if (order.status === "preparing") {
        order.items.forEach(item => {
          if (item.preparing) {
            item.preparing = false;
            item.ready = false;
          }
        });

        order.status = order.items.every(item => item.ready)
          ? "ready"
          : "waiting";
      }
    });
  }

  resetCafe() {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(CAFE_SAVE_KEY);
    }

    this.state = this.createNewState();
    this.updateBusinessValue();

    this.announce("Cafe progress has been reset.");
    this.save();

    return true;
  }

  // ==========================================================
  // 28. INITIALIZATION
  // ==========================================================

  initialize() {
    const loaded = this.load();

    if (!loaded) {
      this.state = this.createNewState();
      this.updateBusinessValue();
      this.save();
      this.announce(
        "Welcome to Life Unlocked Cafe. Your Starter Cafe is ready."
      );
    } else {
      this.announce(
        `Welcome back to Life Unlocked Cafe. You are Cafe Level ${this.state.cafeLevel}.`
      );

      if (
        this.state.idle.active &&
        Date.now() >= this.state.idle.endsAt
      ) {
        this.announce(
          "Your idle cafe session is complete and ready to collect."
        );
      }

      if (
        this.state.driveThruIdle &&
        this.state.driveThruIdle.active &&
        Date.now() >= this.state.driveThruIdle.endsAt
      ) {
        this.announce(
          "Your background drive-thru employee session is complete and ready to collect."
        );
      }

      if (
        this.state.bakeryIdle &&
        this.state.bakeryIdle.active &&
        Date.now() >= this.state.bakeryIdle.endsAt
      ) {
        this.announce(
          "Your Employee-Run Bakery session is complete and ready to collect."
        );
      }
    }

    return this.state;
  }
}

// ============================================================
// 29. CREATE THE MAIN CAFE GAME OBJECT
// ============================================================

const cafeGame = new CafeGame();

// Automatically initialize if this file is loaded in a browser.
if (typeof window !== "undefined") {
  window.cafeGame = cafeGame;
  cafeGame.initialize();
}

// ============================================================
// 30. OPTIONAL EXAMPLES FOR INDEX.HTML BUTTONS
// ============================================================
//
// These are examples of functions your index.html can call later.
//
// cafeGame.startShift();
//
// const customer = cafeGame.generateCustomer("counter");
// const order = cafeGame.generateOrder(customer.id);
// cafeGame.prepareOrder(order.id);
// cafeGame.serveOrder(order.id);
//
// cafeGame.bakeItem("chocolateChipMuffin");
//
// const applicants = cafeGame.generateApplicants("barista");
// cafeGame.hireEmployee(applicants[0]);
//
// cafeGame.buyMachine("espressoMachine");
// cafeGame.buyUpgrade("customerCapacityLevel");
//
// cafeGame.buyDecoration("cozy");
// cafeGame.applyDecoration("cozy");
//
// cafeGame.buyNextLocation();
//
// cafeGame.startIdleCafe(30);
// cafeGame.collectIdleCafe();
//
// console.log(cafeGame.getCafeStatusText());
//
// ============================================================
// END OF LIFE UNLOCKED CAFE VERSION 1.0
// ============================================================
