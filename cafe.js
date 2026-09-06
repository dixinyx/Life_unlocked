
"use strict";
(() => {
  const SAVE_KEY = "lifeUnlockedCafeV10";
  const VERSION = "10.8.2";

  const DIFFICULTIES = {
    beginner: { name: "Beginner", patience: null, arrivalSeconds: null },
    easy: { name: "Easy", patience: 60, arrivalSeconds: 18 },
    medium: { name: "Medium", patience: 45, arrivalSeconds: 15 },
    hard: { name: "Hard", patience: 30, arrivalSeconds: 12 },
    expert: { name: "Expert", patience: 20, arrivalSeconds: 10 }
  };

  const FIRST_NAMES = [
    "Aaliyah","Alex","Amara","Andre","Aria","Avery","Bianca","Caleb","Camila","Darius",
    "Elena","Ethan","Fatima","Gabriel","Hana","Hugo","Imani","Jamal","Jasmine","Jordan",
    "Kai","Keisha","Layla","Leo","Malik","Maya","Mateo","Nadia","Naomi","Noah","Olivia",
    "Priya","Riley","Samira","Sebastian","Sofia","Taylor","Tamara","Tasha","Yara","Zoe"
  ];

  const LAST_NAMES = [
    "Adams","Bennett","Brown","Campbell","Chen","Davis","Garcia","Harris","Jackson","Johnson",
    "Jones","Khan","Lee","Lewis","Lopez","Martin","Martinez","Morgan","Nguyen","Patel",
    "Phillips","Rivera","Robinson","Scott","Singh","Smith","Taylor","Thomas","Walker","Williams"
  ];

  const MENU = [
    { id:"coffee", name:"Coffee", price:7, prepSeconds:2, supply:{coffeeBeans:1,cups:1}, machine:"coffeeMachine" },
    { id:"tea", name:"Tea", price:6, prepSeconds:2, supply:{teaBags:1,cups:1}, machine:"hotDrinkStation" },
    { id:"hotChocolate", name:"Hot Chocolate", price:8, prepSeconds:3, supply:{hotChocolateMix:1,milk:1,cups:1}, machine:"hotDrinkStation" },
    { id:"latte", name:"Latte", price:9, prepSeconds:3, supply:{coffeeBeans:1,milk:1,cups:1}, machine:"coffeeMachine" },
    { id:"cappuccino", name:"Cappuccino", price:9, prepSeconds:3, supply:{coffeeBeans:1,milk:1,cups:1}, machine:"coffeeMachine" },
    { id:"icedCappuccino", name:"Iced Cappuccino", price:10, prepSeconds:3, supply:{coffeeBeans:1,milk:1,cups:1}, machine:"coffeeMachine" },
    { id:"mocha", name:"Mocha", price:10, prepSeconds:3, supply:{coffeeBeans:1,milk:1,hotChocolateMix:1,cups:1}, machine:"coffeeMachine" },
    { id:"fruitSmoothie", name:"Fruit Smoothie", price:10, prepSeconds:4, supply:{fruit:2,milk:1,cups:1}, machine:"hotDrinkStation" },
    { id:"grilledCheese", name:"Grilled Cheese", price:10, prepSeconds:3, supply:{bread:2,cheese:1}, machine:"grill" },
    { id:"sandwich", name:"Sandwich", price:12, prepSeconds:3, supply:{bread:2,cheese:1,sandwichMeat:1}, machine:"grill" },
    { id:"blueberryMuffin", name:"Blueberry Muffin", price:6, prepSeconds:2, bakery:true },
    { id:"chocolateChipMuffin", name:"Chocolate Chip Muffin", price:6, prepSeconds:2, bakery:true },
    { id:"croissant", name:"Croissant", price:7, prepSeconds:2, bakery:true },
    { id:"cinnamonRoll", name:"Cinnamon Roll", price:8, prepSeconds:2, bakery:true },
    { id:"chocolateDonut", name:"Chocolate Donut", price:6, prepSeconds:2, bakery:true },
    { id:"cheeseDanish", name:"Cheese Danish", price:8, prepSeconds:2, bakery:true },
    { id:"chocolateChipCookie", name:"Chocolate Chip Cookie", price:4, prepSeconds:1, bakery:true },
    { id:"peanutButterCookie", name:"Peanut Butter Cookie", price:4, prepSeconds:1, bakery:true },
    { id:"oatmealCookie", name:"Oatmeal Cookie", price:4, prepSeconds:1, bakery:true }
  ];

  const MENU_UNLOCK_LEVELS = {
    coffee:1, tea:1, hotChocolate:1, grilledCheese:1, sandwich:1,
    blueberryMuffin:1, chocolateChipMuffin:1,
    latte:2, chocolateChipCookie:2,
    cappuccino:3, croissant:3, chocolateDonut:3,
    fruitSmoothie:3,
    mocha:4, cinnamonRoll:4, peanutButterCookie:4, cheeseDanish:4,
    icedCappuccino:5, oatmealCookie:5
  };

  const MACHINE_REQUIREMENTS = {
    coffee:"coffeeMachine",
    latte:"espressoMachine", cappuccino:"espressoMachine",
    icedCappuccino:"espressoMachine", mocha:"espressoMachine",
    tea:"hotDrinkStation", hotChocolate:"hotDrinkStation",
    fruitSmoothie:"blender",
    grilledCheese:"grill", sandwich:"grill"
  };

  const SUPPLIES = {
    coffeeBeans:{name:"Coffee Beans",unitCost:4},
    cups:{name:"Cups and Lids",unitCost:2},
    teaBags:{name:"Tea Bags",unitCost:2},
    hotChocolateMix:{name:"Hot Chocolate Mix",unitCost:3},
    milk:{name:"Milk",unitCost:3},
    fruit:{name:"Fruit",unitCost:4},
    bread:{name:"Bread",unitCost:2},
    cheese:{name:"Cheese",unitCost:4},
    sandwichMeat:{name:"Sandwich Meat",unitCost:5},
    muffinMix:{name:"Muffin Mix",unitCost:3},
    blueberries:{name:"Blueberries",unitCost:4},
    chocolateChips:{name:"Chocolate Chips",unitCost:4},
    pastryDough:{name:"Pastry Dough",unitCost:3},
    cinnamonFilling:{name:"Cinnamon Filling",unitCost:2},
    donutMix:{name:"Donut Mix",unitCost:3},
    danishFilling:{name:"Danish Filling",unitCost:3},
    cookieDough:{name:"Cookie Dough",unitCost:3},
    peanutButter:{name:"Peanut Butter",unitCost:3},
    oats:{name:"Oats",unitCost:2}
  };

  const BAKERY = {
    blueberryMuffin:{name:"Blueberry Muffins",batch:6,minutes:2,recipe:{muffinMix:2,blueberries:2},unlockLevel:1},
    chocolateChipMuffin:{name:"Chocolate Chip Muffins",batch:6,minutes:2,recipe:{muffinMix:2,chocolateChips:2},unlockLevel:1},
    croissant:{name:"Croissants",batch:6,minutes:3,recipe:{pastryDough:3},unlockLevel:2},
    chocolateChipCookie:{name:"Chocolate Chip Cookies",batch:8,minutes:2,recipe:{cookieDough:2,chocolateChips:1},unlockLevel:2},
    peanutButterCookie:{name:"Peanut Butter Cookies",batch:8,minutes:2,recipe:{cookieDough:2,peanutButter:1},unlockLevel:2},
    oatmealCookie:{name:"Oatmeal Cookies",batch:8,minutes:2,recipe:{cookieDough:2,oats:1},unlockLevel:2},
    chocolateDonut:{name:"Chocolate Donuts",batch:6,minutes:3,recipe:{donutMix:2,chocolateChips:1},unlockLevel:3},
    cinnamonRoll:{name:"Cinnamon Rolls",batch:6,minutes:4,recipe:{pastryDough:3,cinnamonFilling:2},unlockLevel:4},
    cheeseDanish:{name:"Cheese Danish",batch:6,minutes:4,recipe:{pastryDough:3,danishFilling:2},unlockLevel:4}
  };

  const MACHINES = {
    espressoMachine:{name:"Espresso Machine",baseCost:300,unlockLevel:2},
    blender:{name:"Blender",baseCost:350,unlockLevel:3},
    coffeeMachine:{name:"Coffee Machine",unlockLevel:1,baseCost:150},
    hotDrinkStation:{name:"Hot Drink Station",unlockLevel:1,baseCost:150},
    grill:{name:"Grill",unlockLevel:1,baseCost:200},
    oven:{name:"Oven",unlockLevel:1,baseCost:250}
  };

  const MACHINE_TIERS = [
    {name:"Standard",speed:1,capacity:1,level:1,costMultiplier:0},
    {name:"Deluxe",speed:.80,capacity:2,level:5,costMultiplier:3},
    {name:"Supreme",speed:.60,capacity:4,level:10,costMultiplier:6},
    {name:"Turbo",speed:.40,capacity:7,level:15,costMultiplier:10},
    {name:"Ultra",speed:.25,capacity:10,level:20,costMultiplier:16}
  ];

  const EMPLOYEE_ROLES = {
    cleaner:{name:"Cleaner",shiftWage:20},
    baker:{name:"Baker",shiftWage:30},
    barista:{name:"Barista",shiftWage:25},
    driveThrough:{name:"Drive-Through Worker",shiftWage:30},
  };

  const SKILL_LEVELS = [
    {name:"Beginner",xp:0},
    {name:"Trained",xp:10},
    {name:"Skilled",xp:25},
    {name:"Experienced",xp:50},
    {name:"Expert",xp:90}
  ];

  const SPECIAL_TYPES = [
    {name:"Café Critic",tipMultiplier:2,rewardMultiplier:1.25},
    {name:"Business Customer",tipMultiplier:1.3,rewardMultiplier:1.15},
    {name:"Tourist",tipMultiplier:1.2,rewardMultiplier:1.10},
    {name:"Family Group",tipMultiplier:1.4,rewardMultiplier:1.20}
  ];

  const IDLE_DURATIONS = [
    {minutes:30, unlockLevel:1},
    {minutes:60, unlockLevel:3},
    {minutes:120, unlockLevel:6},
    {minutes:240, unlockLevel:10},
    {minutes:360, unlockLevel:15},
    {minutes:480, unlockLevel:20}
  ];

  function initialSupplies() {
    const out = {};
    Object.keys(SUPPLIES).forEach(id => out[id] = 500);
    return out;
  }

  function initialBakeryStock() {
    const out = {};
    Object.entries(BAKERY).forEach(([id,def]) => {
      out[id] = def.unlockLevel <= 1 ? 6 : 0;
    });
    return out;
  }

  function initialMachines() {
    const out = {};
    Object.keys(MACHINES).forEach(id => out[id] = { owned:0,tierIndex:0 });

    // Starter Café equipment.
    ["coffeeMachine","hotDrinkStation","grill","oven"].forEach(id => {
      if(out[id]) out[id].owned = 1;
    });

    return out;
  }

  function initialTables() {
    return Array.from({length:4},(_,i)=>({id:`table-${i+1}`,number:i+1,status:"available",customerId:null}));
  }

  function defaults() {
    return {
      version:VERSION,
      cafeName:"Life Unlocked Café",
      businessMoney:500,
      businessDebt:0,
      difficulty:"beginner",
      level:1,
      xp:0,
      ownerPayPercent:20,
      lastCustomerName:"",
      levelWarningAnnouncedFor:null,
      shift:{
        active:false,number:1,workArea:"counter",served:0,sales:0,tips:0,
        operatingCosts:0,payroll:0,specialServed:0,
        servicePaused:false,goalAnnounced:false
      },
      customers:[],
      orders:[],
      supplies:initialSupplies(),
      supplyCapacity:500,
      bakeryStock:initialBakeryStock(),
      bakeryJobs:[],
      machines:initialMachines(),
      tables:initialTables(),
      employees:[],
      selectedEmployeeIds:[],
      employeeCandidates:[],
      idle:{active:false,startAt:null,endAt:null,durationMinutes:0,selectedEmployeeIds:[]},
      settings:{gameVoice:false,voiceRate:1.4},
      statistics:{lifetimeCustomers:0,lifetimeSales:0,lifetimeTips:0}
    };
  }

  const LEVEL_THRESHOLDS = [0,50,100,175,275,400,550,725,925,1150,1400];

  function levelFromXp(xp) {
    let level=1;
    for(let i=1;i<LEVEL_THRESHOLDS.length;i++){
      if(xp>=LEVEL_THRESHOLDS[i]) level=i+1;
      else break;
    }
    return level;
  }

  function xpForNextLevel(level) {
    if(level>=LEVEL_THRESHOLDS.length) {
      return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length-1] + (level-LEVEL_THRESHOLDS.length+1)*300;
    }
    return LEVEL_THRESHOLDS[level];
  }

  class CafeGame {
    constructor() {
      this.state = defaults();
      this.patienceTimer = null;
      this.arrivalTimer = null;
      this.prepTimeouts = {};
      this.cleaningTimeouts = {};
      this.announcementQueue = [];
      this.announcementBusy = false;
      this.onStateChanged = null;
    }

    world() { return window.LifeUnlockedWorld || null; }

    economy() { return window.LifeUnlockedEconomy || null; }

    save() {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.state));
      return true;
    }

    load() {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) {
        this.refreshCandidates();
        this.save();
        return false;
      }
      try {
        const parsed = JSON.parse(raw);
        const base = defaults();
        this.state = {
          ...base,
          ...parsed,
          shift:{...base.shift,...(parsed.shift||{})},
          supplies:{...base.supplies,...(parsed.supplies||{})},
          bakeryStock:{...base.bakeryStock,...(parsed.bakeryStock||{})},
          machines:{...base.machines,...(parsed.machines||{})},
          settings:{...base.settings,...(parsed.settings||{})},
          statistics:{...base.statistics,...(parsed.statistics||{})},
          idle:{...base.idle,...(parsed.idle||{})},
          customers:Array.isArray(parsed.customers)?parsed.customers:[],
          orders:Array.isArray(parsed.orders)?parsed.orders:[],
          employees:Array.isArray(parsed.employees)?parsed.employees:[],
          selectedEmployeeIds:Array.isArray(parsed.selectedEmployeeIds)?parsed.selectedEmployeeIds:[],
          employeeCandidates:Array.isArray(parsed.employeeCandidates)?parsed.employeeCandidates:[],
          bakeryJobs:Array.isArray(parsed.bakeryJobs)?parsed.bakeryJobs:[],
          tables:Array.isArray(parsed.tables)&&parsed.tables.length?parsed.tables:base.tables
        };
        const previousVersion = String(parsed.version || "");

        // Repair old test saves that incorrectly granted locked machines at Level 1.
        if(this.state.level < 2 && this.state.machines.espressoMachine) {
          this.state.machines.espressoMachine.owned = 0;
        }
        if(this.state.level < 3 && this.state.machines.blender) {
          this.state.machines.blender.owned = 0;
        }

        this.state.version = VERSION;

        this.state.orders = this.state.orders.filter(order =>
          order.status === "served" ||
          this.state.customers.some(c => c.id===order.customerId && !c.left && !c.served)
        );

        if (!this.state.employeeCandidates.length) this.refreshCandidates();
        this.checkBakeryJobs();
        this.checkIdleShift();
        this.save();
        return true;
      } catch {
        return false;
      }
    }

    reset() {
      this.stopTimers();
      this.clearAnnouncements();
      localStorage.removeItem(SAVE_KEY);
      this.state = defaults();
      this.refreshCandidates();
      this.save();
    }

    speak(text) {
      if (!this.state.settings.gameVoice || !("speechSynthesis" in window)) return;
      try {
        window.speechSynthesis.cancel();
        if(typeof window.speechSynthesis.resume === "function") {
          window.speechSynthesis.resume();
        }
        const utterance = new SpeechSynthesisUtterance(String(text||""));
        utterance.rate = Number(this.state.settings.voiceRate)||1.4;
        window.speechSynthesis.speak(utterance);
      } catch {}
    }

    announce(message) {
      const text = String(message || "");
      this.speak(text);

      if (this.state.settings.gameVoice) {
        console.log(text);
        return text;
      }

      this.announcementQueue.push(text);
      this.processAnnouncementQueue();
      console.log(text);
      return text;
    }

    processAnnouncementQueue() {
      if (this.announcementBusy || !this.announcementQueue.length) return;
      this.announcementBusy = true;
      const text = this.announcementQueue.shift();
      const live = document.getElementById("cafe-live-region");

      if (!live) {
        this.announcementBusy=false;
        this.processAnnouncementQueue();
        return;
      }

      live.textContent="";
      setTimeout(()=>{
        live.textContent=text;
        const readingTime=Math.max(1400,Math.min(4200,650+text.length*38));
        setTimeout(()=>{
          if(live.textContent===text) live.textContent="";
          this.announcementBusy=false;
          this.processAnnouncementQueue();
        },readingTime);
      },30);
    }

    clearAnnouncements() {
      this.announcementQueue=[];
      this.announcementBusy=false;
      const live=document.getElementById("cafe-live-region");
      if(live) live.textContent="";
      if("speechSynthesis" in window) {
        try { window.speechSynthesis.cancel(); } catch {}
      }
    }

    notifyStateChanged() {
      if(typeof this.onStateChanged==="function") {
        try { this.onStateChanged(); } catch(error) { console.error(error); }
      }
    }

    setDifficulty(id) {
      if(!DIFFICULTIES[id]) return {ok:false,message:"Unknown difficulty."};
      if(this.state.shift.active) return {ok:false,message:"End the shift before changing difficulty."};
      this.state.difficulty=id; this.save();
      return {ok:true,message:`${DIFFICULTIES[id].name} selected.`};
    }

    setOwnerPayPercent(value) {
      const p=Math.max(0,Math.min(100,Math.round(Number(value)||0)));
      this.state.ownerPayPercent=p; this.save();
      return {ok:true,message:`Owner pay set to ${p} percent of net profit.`};
    }

    setGameVoice(enabled, rate) {
      this.state.settings.gameVoice=Boolean(enabled);
      this.state.settings.voiceRate=Math.max(.5,Math.min(3,Number(rate)||1.4));
      this.clearAnnouncements();
      this.save();
      if(this.state.settings.gameVoice) this.speak("Game Voice ready.");
      return {ok:true,message:`Game Voice ${enabled?"on":"off"}. Speech rate ${this.state.settings.voiceRate}.`};
    }

    pauseCustomerService() {
      if(!this.state.shift.active || this.state.shift.servicePaused) return false;
      this.state.shift.servicePaused=true;
      this.stopCustomerIntervals();
      this.save();
      return true;
    }

    resumeCustomerService() {
      if(!this.state.shift.active || !this.state.shift.servicePaused) return false;
      this.state.shift.servicePaused=false;
      this.startCustomerIntervals();
      this.save();
      return true;
    }

    startCustomerIntervals() {
      if(this.patienceTimer) clearInterval(this.patienceTimer);
      if(this.arrivalTimer) clearInterval(this.arrivalTimer);
      this.patienceTimer=setInterval(()=>this.tickPatience(),1000);
      const difficulty=DIFFICULTIES[this.state.difficulty];
      if(difficulty.arrivalSeconds!==null) {
        this.arrivalTimer=setInterval(()=>{
          if(!this.state.shift.active || this.state.shift.servicePaused || this.getActiveCustomers().length>=5) return;
          const result=this.addCustomer(true);
          if(result.ok) {
            this.announce(`${result.customer.name} arrived automatically.`);
            this.notifyStateChanged();
          }
        },difficulty.arrivalSeconds*1000);
      }
    }

    stopCustomerIntervals() {
      if(this.patienceTimer) clearInterval(this.patienceTimer);
      if(this.arrivalTimer) clearInterval(this.arrivalTimer);
      this.patienceTimer=null;
      this.arrivalTimer=null;
    }

    startShift(workArea="counter") {
      if(this.state.shift.active) return {ok:false,message:"A shift is already active."};
      if(this.state.idle.active) return {ok:false,message:"An Idle Shift is currently active."};

      this.state.customers=[];
      this.state.orders=[];
      this.state.tables.forEach(t=>{t.status="available";t.customerId=null;});
      this.state.shift={
        active:true,number:this.state.shift.number,workArea,served:0,sales:0,tips:0,
        operatingCosts:0,payroll:0,specialServed:0,
        servicePaused:false,goalAnnounced:false
      };

      this.startTimers();
      this.autoStartBakerIfNeeded();
      this.save();

      const staff=this.getSelectedEmployees().map(e=>`${e.name}, ${EMPLOYEE_ROLES[e.role].name}`).join("; ");
      return {ok:true,message:`${workArea==="driveThru"?"Drive-Thru":"Café"} shift started.${staff?` Staff working: ${staff}.`:" No employees selected."}`};
    }

    endShift() {
      if(!this.state.shift.active) return {ok:false,message:"No active shift."};

      this.stopTimers();
      this.clearAnnouncements();

      const employees=this.getSelectedEmployees();
      let payroll=0;
      employees.forEach(employee=>{
        payroll+=employee.shiftWage;
        employee.xp+=2;
        this.updateEmployeeSkill(employee);
      });

      this.state.shift.payroll=payroll;

      const economy=this.economy();
      const settled=economy
        ? economy.settleShift({
            businessBalance:this.state.businessMoney,
            grossSales:this.state.shift.sales,
            operatingCosts:this.state.shift.operatingCosts,
            employeeWages:payroll,
            tips:this.state.shift.tips,
            ownerPayPercent:this.state.ownerPayPercent,
            ownerPayReason:"Café owner pay"
          })
        : {
            businessBalance:this.state.businessMoney-payroll-this.state.shift.operatingCosts,
            grossSales:this.state.shift.sales,
            operatingCosts:this.state.shift.operatingCosts,
            employeeWages:payroll,
            tips:this.state.shift.tips,
            netProfit:Math.max(0,this.state.shift.sales-this.state.shift.operatingCosts-payroll),
            ownerPay:0,
            retainedProfit:Math.max(0,this.state.shift.sales-this.state.shift.operatingCosts-payroll),
            debt:Math.max(0,-(this.state.businessMoney-payroll-this.state.shift.operatingCosts))
          };

      this.state.businessMoney=settled.businessBalance;
      this.state.businessDebt=settled.debt;

      const summary={
        ok:true,
        served:this.state.shift.served,
        specialServed:this.state.shift.specialServed,
        sales:settled.grossSales,
        tips:settled.tips,
        operatingCosts:settled.operatingCosts,
        payroll:settled.employeeWages,
        netProfit:settled.netProfit,
        ownerPay:settled.ownerPay,
        retained:settled.retainedProfit,
        employeeSummary:employees.map(e=>`${e.name}: ${e.skillName}, ${e.xp} XP`)
      };

      this.state.shift.active=false;
      this.state.shift.number+=1;
      this.state.customers=[];
      this.state.orders=[];
      this.state.tables.forEach(t=>{t.status="available";t.customerId=null;});
      this.save();

      summary.message=`Shift ended. Customers served ${summary.served}. Sales ${summary.sales} coins. Tips to Personal Money ${summary.tips}. Operating costs ${summary.operatingCosts}. Employee wages ${summary.payroll}. Net profit ${summary.netProfit}. Owner pay ${summary.ownerPay}. Café retained ${summary.retained}.${this.state.businessDebt?` Café debt ${this.state.businessDebt}. Expansion purchases are restricted until debt is cleared.`:""}`;
      return summary;
    }

    ensureTimersForActiveShift() {
      if(this.state.shift.active && !this.state.shift.servicePaused && !this.patienceTimer && !this.arrivalTimer) {
        this.startCustomerIntervals();
      }
    }

    startTimers() {
      this.stopTimers();
      if(!this.state.shift.servicePaused) this.startCustomerIntervals();
    }

    stopTimers() {
      this.stopCustomerIntervals();

      Object.keys(this.prepTimeouts).forEach(orderId=>{
        clearTimeout(this.prepTimeouts[orderId]);
        delete this.prepTimeouts[orderId];
      });

      Object.keys(this.cleaningTimeouts).forEach(tableId=>{
        clearTimeout(this.cleaningTimeouts[tableId]);
        delete this.cleaningTimeouts[tableId];
      });
    }

    tickPatience() {
      if(!this.state.shift.active || this.state.shift.servicePaused) return;
      const seconds=DIFFICULTIES[this.state.difficulty].patience;
      if(seconds===null) return;

      this.state.customers.forEach(customer=>{
        if(customer.served||customer.left) return;
        customer.patience-=1;

        if(customer.patience===10) this.announce(`${customer.name} is getting impatient. 10 seconds remaining.`);
        if(customer.patience===5) this.announce(`${customer.name} has 5 seconds remaining.`);

        if(customer.patience<=0) {
          customer.left=true;
          this.cancelOrdersForCustomer(customer.id);
          this.dirtyCustomerTable(customer);
          this.save();
          this.announce(`${customer.name} left the Café.`);
          this.notifyStateChanged();
        }
      });
      this.save();
    }

    generateName() {
      let result="";
      for(let i=0;i<12;i++) {
        result=`${FIRST_NAMES[Math.floor(Math.random()*FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random()*LAST_NAMES.length)]}`;
        if(result!==this.state.lastCustomerName) break;
      }
      this.state.lastCustomerName=result;
      return result;
    }

    addCustomer(automatic=false) {
      if(!this.state.shift.active) return {ok:false,message:"Start a shift first."};

      const diff=DIFFICULTIES[this.state.difficulty];
      const special=Math.random()<.15 ? SPECIAL_TYPES[Math.floor(Math.random()*SPECIAL_TYPES.length)] : null;

      const customer={
        id:`customer-${Date.now()}-${Math.random()}`,
        name:this.generateName(),
        served:false,left:false,patience:diff.patience,
        special:special?special.name:null,
        tipMultiplier:special?special.tipMultiplier:1,
        rewardMultiplier:special?special.rewardMultiplier:1,
        tableId:null,dineIn:false
      };

      if(this.state.shift.workArea==="counter") {
        const table=this.state.tables.find(t=>t.status==="available");
        if(table) {
          table.status="occupied";
          table.customerId=customer.id;
          customer.tableId=table.id;
          customer.dineIn=true;
        }
      }

      this.state.customers.push(customer);
      this.save();

      const specialText=customer.special?` Special customer: ${customer.special}.`:"";
      let locationText="";
      if(this.state.shift.workArea==="driveThru") {
        locationText=`${customer.name} has arrived at the drive-through.`;
      } else if(customer.dineIn) {
        locationText=`${customer.name} has arrived at the café and is seated at Table ${this.getTableNumber(customer.tableId)}.`;
      } else {
        locationText=`${customer.name} has arrived at the café. No clean table is available, so this order will be takeaway.`;
      }
      return {ok:true,customer,message:`${locationText}${specialText}`};
    }

    getTableNumber(id) {
      const table=this.state.tables.find(t=>t.id===id);
      return table?table.number:"";
    }

    getActiveCustomers() {
      return this.state.customers.filter(c=>!c.served&&!c.left);
    }

    getOrderForCustomer(customerId) {
      return this.state.orders.find(o=>o.customerId===customerId&&o.status!=="served")||null;
    }

    cancelOrdersForCustomer(customerId) {
      const orders=this.state.orders.filter(o=>o.customerId===customerId&&o.status!=="served");

      orders.forEach(order=>{
        if(this.prepTimeouts[order.id]) {
          clearTimeout(this.prepTimeouts[order.id]);
          delete this.prepTimeouts[order.id];
        }
        if(order.bakeryReserved && order.itemId) {
          this.state.bakeryStock[order.itemId]=(this.state.bakeryStock[order.itemId]||0)+1;
        }
      });

      const ids=new Set(orders.map(o=>o.id));
      if(ids.size) this.state.orders=this.state.orders.filter(o=>!ids.has(o.id));
      return ids.size;
    }

    menuAvailable() {
      return MENU.filter(item=>{
        if(!this.isMenuItemUnlocked(item.id)) return false;
        if(item.bakery) return (this.state.bakeryStock[item.id]||0)>0;
        return Object.entries(item.supply||{}).every(([id,qty])=>(this.state.supplies[id]||0)>=qty);
      });
    }

    takeOrder(customerId) {
      const customer=this.state.customers.find(c=>c.id===customerId&&!c.served&&!c.left);
      if(!customer) return {ok:false,message:"Customer unavailable."};
      if(this.getOrderForCustomer(customerId)) return {ok:false,message:"Order already taken."};

      const available=this.menuAvailable();
      if(!available.length) return {ok:false,message:"Nothing is currently available to sell. Restock or bake first."};

      const item=available[Math.floor(Math.random()*available.length)];
      const order={
        id:`order-${Date.now()}-${Math.random()}`,
        customerId:customer.id,
        customerName:customer.name,
        itemId:item.id,
        itemName:item.name,
        price:Math.round(item.price*customer.rewardMultiplier),
        prepSeconds:item.prepSeconds,
        status:"waiting",
        bakeryReserved:false
      };

      if(item.bakery) {
        this.state.bakeryStock[item.id]-=1;
        order.bakeryReserved=true;
        if(this.state.bakeryStock[item.id]===0) this.announce(`${item.name} is now out of stock and unavailable for new orders.`);
      }

      this.state.orders.push(order);
      if(DIFFICULTIES[this.state.difficulty].patience!==null) customer.patience=DIFFICULTIES[this.state.difficulty].patience;
      this.save();
      return {ok:true,order,message:`${customer.name} ordered ${item.name}.`};
    }

    firstCustomerNeedingOrder() {
      return this.getActiveCustomers().find(c=>!this.getOrderForCustomer(c.id))||null;
    }

    firstOrder(status) {
      return this.state.orders.find(o=>{
        if(o.status!==status) return false;
        return this.state.customers.some(c=>c.id===o.customerId&&!c.left&&!c.served);
      })||null;
    }

    consumeSuppliesForOrder(order) {
      const item=MENU.find(i=>i.id===order.itemId);
      if(!item || item.bakery) return {ok:true};

      const missing=Object.entries(item.supply||{}).filter(([id,qty])=>(this.state.supplies[id]||0)<qty);
      if(missing.length) return {ok:false,message:`Missing ${missing.map(([id])=>SUPPLIES[id]?.name || id).join(", ")}.`};

      Object.entries(item.supply||{}).forEach(([id,qty])=>this.state.supplies[id]-=qty);
      this.state.shift.operatingCosts+=1;
      return {ok:true};
    }

    prepareOrder(orderId) {
      const order=this.state.orders.find(o=>o.id===orderId&&o.status==="waiting");
      if(!order) return {ok:false,message:"No waiting order found."};

      const stock=this.consumeSuppliesForOrder(order);
      if(!stock.ok) return stock;

      order.status="preparing";
      this.save();

      const barista=this.getSelectedEmployees().find(e=>e.role==="barista");
      let seconds=order.prepSeconds;
      if(barista) {
        const skillIndex=SKILL_LEVELS.findIndex(s=>s.name===barista.skillName);
        seconds=Math.max(1,Math.round(seconds*(1-(skillIndex*.08))));
        barista.taskXp=(barista.taskXp||0)+1;
      }

      const timeoutId=setTimeout(()=>{
        delete this.prepTimeouts[orderId];

        if(!this.state.shift.active) return;

        const current=this.state.orders.find(o=>o.id===orderId&&o.status==="preparing");
        if(!current) return;

        const customer=this.state.customers.find(c=>c.id===current.customerId&&!c.left&&!c.served);
        if(!customer) {
          this.cancelOrdersForCustomer(current.customerId);
          this.save();
          this.notifyStateChanged();
          return;
        }

        current.status="ready";
        if(DIFFICULTIES[this.state.difficulty].patience!==null) customer.patience=DIFFICULTIES[this.state.difficulty].patience;
        this.save();
        this.announce(`${current.customerName}'s ${current.itemName} is ready to serve.`);
        this.notifyStateChanged();
      },seconds*1000);

      this.prepTimeouts[orderId]=timeoutId;
      return {ok:true,message:`Preparing ${order.customerName}'s ${order.itemName}.`};
    }

    serveOrder(orderId) {
      const order=this.state.orders.find(o=>o.id===orderId&&o.status==="ready");
      if(!order) return {ok:false,message:"No ready order found."};

      const customer=this.state.customers.find(c=>c.id===order.customerId&&!c.left&&!c.served);
      if(!customer) return {ok:false,message:"Customer unavailable."};

      order.status="served";
      customer.served=true;

      this.state.businessMoney+=order.price;
      this.state.shift.sales+=order.price;
      this.state.shift.served+=1;
      this.state.statistics.lifetimeCustomers+=1;
      this.state.statistics.lifetimeSales+=order.price;

      if(customer.special) this.state.shift.specialServed+=1;

      const goal=this.customerGoalForLevel();
      if(!this.state.shift.goalAnnounced && this.state.shift.served>=goal) {
        this.state.shift.goalAnnounced=true;
        this.announce(`Customer goal reached. ${this.state.shift.served} of ${goal} customers served this shift.`);
      }

      let tip=0;
      if(Math.random()<.55) {
        tip=Math.max(1,Math.round(order.price*.10*customer.tipMultiplier));
        this.state.shift.tips+=tip;
        this.state.statistics.lifetimeTips+=tip;
        const economy=this.economy();
        if(economy) economy.addTipToPersonal(tip,`Tip from ${customer.name}`);
      }

      this.addCafeXp(customer.special?4:2);
      this.dirtyCustomerTable(customer);
      this.autoStartBakerIfNeeded();
      this.save();

      return {ok:true,message:`Served ${customer.name}. Earned ${order.price} Café coins.${tip?` Tip ${tip} Personal coins.`:""}`};
    }

    dirtyCustomerTable(customer) {
      if(!customer || !customer.tableId) return;
      const table=this.state.tables.find(t=>t.id===customer.tableId);
      if(!table) return;
      table.status="dirty";
      table.customerId=null;
      this.announce(`${customer.name} left Table ${table.number}. Table ${table.number} needs cleaning.`);

      const cleaner=this.getSelectedEmployees().find(e=>e.role==="cleaner");
      if(cleaner && this.state.shift.active) {
        const delay=Math.max(1000,3000-(SKILL_LEVELS.findIndex(s=>s.name===cleaner.skillName)*400));
        this.cleaningTimeouts[table.id]=setTimeout(()=>{
          delete this.cleaningTimeouts[table.id];
          if(!this.state.shift.active) return;
          table.status="available";
          cleaner.taskXp=(cleaner.taskXp||0)+1;
          this.save();
          this.announce(`${cleaner.name} cleaned Table ${table.number}.`);
          this.notifyStateChanged();
        },delay);
      }
    }

    cleanNextTable() {
      const table=this.state.tables.find(t=>t.status==="dirty");
      if(!table) return {ok:false,message:"No tables need cleaning right now."};
      table.status="available";
      this.save();
      this.notifyStateChanged();
      return {ok:true,message:`Table ${table.number} cleaned and available for the next café customer.`};
    }

    getStatus() {
      const active=this.getActiveCustomers().length;
      const waiting=this.state.orders.filter(o=>o.status==="waiting").length;
      const preparing=this.state.orders.filter(o=>o.status==="preparing").length;
      const ready=this.state.orders.filter(o=>o.status==="ready").length;
      const dirty=this.state.tables.filter(t=>t.status==="dirty").length;
      return `${active} active customers. ${waiting} waiting to prepare. ${preparing} preparing. ${ready} ready to serve. ${dirty} dirty tables. Café money ${this.state.businessMoney}.`;
    }

    getMostUrgent() {
      const ready=this.firstOrder("ready");
      if(ready) return `Serve ${ready.customerName}.`;
      const waiting=this.firstOrder("waiting");
      if(waiting) return `Prepare ${waiting.customerName}'s order.`;
      const customer=this.firstCustomerNeedingOrder();
      if(customer) return `Take ${customer.name}'s order.`;
      const preparing=this.firstOrder("preparing");
      if(preparing) return `${preparing.customerName}'s order is preparing.`;
      return "No customer currently needs attention.";
    }

    addCafeXp(amount) {
      const before=this.state.level;
      this.state.xp+=amount;
      this.state.level=levelFromXp(this.state.xp);

      if(this.state.level>before) {
        this.state.levelWarningAnnouncedFor=null;
        const rewards=this.claimLevelRewards();
        const expansion=this.getCafeExpansionInfo();
        const unlocked=MENU.filter(i=>this.menuUnlockLevel(i.id)===this.state.level).map(i=>i.name);
        const machineUnlocks=Object.values(MACHINES).filter(m=>m.unlockLevel===this.state.level).map(m=>m.name);
        const parts=[`Café Management Level ${this.state.level} reached.`];
        if(rewards.length) parts.push(rewards.join(" "));
        if(unlocked.length) parts.push(`New menu unlocks: ${unlocked.join(", ")}.`);
        if(machineUnlocks.length) parts.push(`New machine available to purchase: ${machineUnlocks.join(", ")}.`);
        if(expansion.nextMilestone) parts.push(`Coming later at Level ${expansion.nextMilestone.level}: ${expansion.nextMilestone.text}.`);
        this.announce(parts.join(" "));
        return;
      }

      const nextXp=xpForNextLevel(this.state.level);
      const remaining=Math.max(0,nextXp-this.state.xp);
      if(remaining<=10 && this.state.levelWarningAnnouncedFor!==this.state.level) {
        this.state.levelWarningAnnouncedFor=this.state.level;
        const nextLevel=this.state.level+1;
        const nextItems=MENU.filter(i=>this.menuUnlockLevel(i.id)===nextLevel).map(i=>i.name);
        const nextMachines=Object.values(MACHINES).filter(m=>m.unlockLevel===nextLevel).map(m=>m.name);
        const details=[];
        if(nextItems.length) details.push(`menu unlocks ${nextItems.join(", ")}`);
        if(nextMachines.length) details.push(`machine access ${nextMachines.join(", ")}`);
        this.announce(`Almost Café Level ${nextLevel}. ${remaining} XP remaining.${details.length?` Next level includes ${details.join(" and ")}.`:""}`);
      }
    }

    isMenuItemUnlocked(id) {
      const required=MENU_UNLOCK_LEVELS[id] || 1;
      if(this.state.level<required) return false;
      const machineId=MACHINE_REQUIREMENTS[id];
      if(machineId){
        const machine=this.state.machines[machineId];
        if(!machine || machine.owned<1) return false;
      }
      return true;
    }

    menuUnlockLevel(id) { return MENU_UNLOCK_LEVELS[id] || 1; }

    customerGoalForLevel(level=this.state.level) {
      return 10 + Math.max(0,level-1)*5;
    }

    customerGoalProgress() {
      const goal=this.customerGoalForLevel();
      const served=this.state.shift?.served || 0;
      return {served,goal,remaining:Math.max(0,goal-served)};
    }

    getCafeExpansionInfo() {
      const level=this.state.level;
      let maxTables=4;
      if(level>=10) maxTables=6;
      if(level>=20) maxTables=8;
      if(level>=35) maxTables=10;

      const milestones=[
        {level:2,text:"Latte and Chocolate Chip Cookie unlocks; larger orders begin gradually"},
        {level:3,text:"Cappuccino, Croissant, Chocolate Donut, Fruit Smoothie, and Blender access"},
        {level:4,text:"Mocha, Cinnamon Roll, Peanut Butter Cookie, and Cheese Danish unlocks"},
        {level:5,text:"Iced Cappuccino and Bake All unlock; combo orders become more important"},
        {level:8,text:"Smart Bake unlock; prepare for larger group customers"},
        {level:10,text:"Major Café expansion: 6-table capacity and more demanding service"},
        {level:20,text:"Major Café expansion: 8-table capacity"},
        {level:35,text:"Major Café expansion: 10-table capacity"}
      ];
      const next=milestones.find(m=>m.level>level) || null;
      return {maxTables,nextMilestone:next};
    }

    claimLevelRewards() {
      const rewards=[];
      for(let level=2;level<=this.state.level;level++){
        if(this.state.claimedLevelRewards.includes(level)) continue;
        const bonus=Math.min(1000,level*50);
        this.state.businessMoney+=bonus;
        this.state.claimedLevelRewards.push(level);
        rewards.push(`Level ${level} reward: ${bonus} Café coins.`);
      }
      if(rewards.length) this.save();
      return rewards;
    }

    getProgressSummary() {
      const nextXp=xpForNextLevel(this.state.level);
      const toNext=Math.max(0,nextXp-this.state.xp);
      return {
        level:this.state.level,
        xp:this.state.xp,
        nextXp,
        toNext,
        lifetimeCustomers:this.state.statistics.lifetimeCustomers,
        lifetimeSales:this.state.statistics.lifetimeSales,
        lifetimeTips:this.state.statistics.lifetimeTips,
        employees:this.state.employees.length,
        debt:this.state.businessDebt,
        businessMoney:this.state.businessMoney,
        cafeRating:this.state.cafeRating,
        expansion:this.getCafeExpansionInfo()
      };
    }

    restockQuote(id) {
      const current=this.state.supplies[id]||0;
      const target=this.state.supplyCapacity;
      const missing=Math.max(0,target-current);
      const unitCost=SUPPLIES[id]?.unitCost || 1;
      return {id,name:SUPPLIES[id]?.name || id,current,target,missing,unitCost,cost:missing*unitCost};
    }

    replenish(id) {
      const q=this.restockQuote(id);
      if(!q.name) return {ok:false,message:"Supply not found."};
      if(q.missing<=0) return {ok:false,message:`${q.name} is already full.`};
      if(this.state.businessMoney<q.cost) return {ok:false,message:`Need ${q.cost} Café coins to fill ${q.name}.`};

      this.state.businessMoney-=q.cost;
      this.state.supplies[id]=q.target;
      this.save();
      return {ok:true,message:`${q.name} replenished by ${q.missing}. Cost ${q.cost}. New stock ${q.target} of ${q.target}. Café money ${this.state.businessMoney}.`};
    }

    replenishAll() {
      let spent=0,count=0;
      Object.keys(SUPPLIES).forEach(id=>{
        const q=this.restockQuote(id);
        if(q.missing<=0 || this.state.businessMoney<q.cost) return;
        this.state.businessMoney-=q.cost;
        this.state.supplies[id]=q.target;
        spent+=q.cost;count+=1;
      });
      this.save();
      return {ok:count>0,message:count?`Replenished ${count} supply items. Cost ${spent}. Café money ${this.state.businessMoney}.`:"Nothing could be replenished."};
    }

    smartReplenish() {
      let spent=0,count=0;
      const trigger=this.state.supplyCapacity*.35;
      const target=Math.round(this.state.supplyCapacity*.70);

      Object.keys(SUPPLIES).forEach(id=>{
        const current=this.state.supplies[id]||0;
        if(current>=trigger) return;
        const qty=target-current;
        const unitCost=SUPPLIES[id]?.unitCost || 1;
        const cost=qty*unitCost;
        if(this.state.businessMoney<cost) return;
        this.state.businessMoney-=cost;
        this.state.supplies[id]=target;
        spent+=cost;count+=1;
      });

      this.save();
      return {ok:count>0,message:count?`Smart Replenish stocked ${count} low items. Cost ${spent}. Café money ${this.state.businessMoney}.`:"No critically low supplies needed replenishing."};
    }

    availableBakeryItems() {
      return Object.entries(BAKERY).filter(([id,def])=>def.unlockLevel<=this.state.level);
    }

    canBake(id) {
      const def=BAKERY[id];
      if(!def) return {ok:false,message:"Bakery item not found."};
      if(def.unlockLevel>this.state.level) return {ok:false,message:`${def.name} unlocks at Café Level ${def.unlockLevel}.`};
      if(this.state.bakeryJobs.some(job=>job.itemId===id)) return {ok:false,message:`${def.name} are already baking.`};

      const missing=Object.entries(def.recipe).filter(([sid,qty])=>(this.state.supplies[sid]||0)<qty);
      if(missing.length) return {ok:false,message:`Missing ${missing.map(([sid])=>SUPPLIES[sid]?.name || sid).join(", ")}.`};
      return {ok:true};
    }

    startBake(id, automatic=false) {
      const can=this.canBake(id);
      if(!can.ok) return can;

      const def=BAKERY[id];
      Object.entries(def.recipe).forEach(([sid,qty])=>this.state.supplies[sid]-=qty);

      const ovenTier=MACHINE_TIERS[this.state.machines.oven.tierIndex]||MACHINE_TIERS[0];
      const finishAt=Date.now()+Math.max(15000,def.minutes*60000*ovenTier.speed);

      this.state.bakeryJobs.push({
        id:`bake-${Date.now()}-${Math.random()}`,
        itemId:id,
        startedAt:Date.now(),
        finishAt,
        batch:def.batch,
        automatic
      });

      this.save();
      return {ok:true,message:`Started baking ${def.name}. Real-time completion in about ${Math.ceil((finishAt-Date.now())/60000)} minute${Math.ceil((finishAt-Date.now())/60000)===1?"":"s"}.`};
    }

    checkBakeryJobs() {
      const now=Date.now();
      const finished=this.state.bakeryJobs.filter(job=>job.finishAt<=now);

      finished.forEach(job=>{
        const def=BAKERY[job.itemId];
        const wasOut=(this.state.bakeryStock[job.itemId]||0)===0;
        this.state.bakeryStock[job.itemId]=(this.state.bakeryStock[job.itemId]||0)+job.batch;
        if(wasOut) this.announce(`${def.name} are back in stock.`);
        this.announce(`${def.name} finished baking. ${job.batch} added to bakery stock.`);

        const baker=this.getSelectedEmployees().find(e=>e.role==="baker");
        if(job.automatic && baker) baker.taskXp=(baker.taskXp||0)+1;
      });

      if(finished.length) {
        const ids=new Set(finished.map(j=>j.id));
        this.state.bakeryJobs=this.state.bakeryJobs.filter(j=>!ids.has(j.id));
        this.save();
        this.notifyStateChanged();
      }

      return finished.length;
    }

    bakeAll() {
      if(this.state.level<5) return {ok:false,message:"Bake All unlocks at Café Level 5."};
      let count=0;
      this.availableBakeryItems().forEach(([id])=>{
        const r=this.startBake(id,false);
        if(r.ok) count+=1;
      });
      return {ok:count>0,message:count?`Bake All started ${count} bakery batches.`:"No bakery batches could be started."};
    }

    smartBake() {
      if(this.state.level<8) return {ok:false,message:"Smart Bake unlocks at Café Level 8."};
      const candidates=this.availableBakeryItems()
        .filter(([id])=>!this.state.bakeryJobs.some(j=>j.itemId===id))
        .sort((a,b)=>(this.state.bakeryStock[a[0]]||0)-(this.state.bakeryStock[b[0]]||0));

      for(const [id] of candidates) {
        if((this.state.bakeryStock[id]||0)>=6) continue;
        const r=this.startBake(id,false);
        if(r.ok) return {ok:true,message:`Smart Bake selected ${BAKERY[id].name}.`};
      }
      return {ok:false,message:"Smart Bake found nothing that currently needs baking."};
    }

    autoStartBakerIfNeeded() {
      const baker=this.getSelectedEmployees().find(e=>e.role==="baker");
      if(!baker || !this.state.shift.active) return;

      const candidates=this.availableBakeryItems()
        .filter(([id])=>(this.state.bakeryStock[id]||0)<=2)
        .sort((a,b)=>(this.state.bakeryStock[a[0]]||0)-(this.state.bakeryStock[b[0]]||0));

      for(const [id] of candidates) {
        const r=this.startBake(id,true);
        if(r.ok) {
          this.announce(`${baker.name} started an automatic batch of ${BAKERY[id].name}.`);
          return;
        }
      }
    }

    machineTier(id) {
      const machine=this.state.machines[id];
      return MACHINE_TIERS[machine?machine.tierIndex:0]||MACHINE_TIERS[0];
    }

    machinePurchasePrice(id) {
      const def=MACHINES[id];
      const machine=this.state.machines[id];
      if(!def || !machine) return 0;
      return Math.round(def.baseCost*Math.max(1,machine.owned+1));
    }

    machineUpgradePrice(id) {
      const def=MACHINES[id];
      const machine=this.state.machines[id];
      if(!def || !machine) return 0;
      const next=MACHINE_TIERS[machine.tierIndex+1];
      return next ? def.baseCost*next.costMultiplier : 0;
    }

    buyMachine(id) {
      const def=MACHINES[id], machine=this.state.machines[id];
      if(!def || !machine) return {ok:false,message:"Machine not found."};
      if(machine.owned>=4) return {ok:false,message:`${def.name} capacity reached. Maximum 4 in this Café.`};
      if(this.state.level<def.unlockLevel) return {ok:false,message:`${def.name} unlocks at Café Level ${def.unlockLevel}.`};
      if(this.state.businessDebt>0) return {ok:false,message:"Machine purchases are unavailable while the Café is in debt."};
      const cost=this.machinePurchasePrice(id);
      if(this.state.businessMoney<cost) return {ok:false,message:`Need ${cost} Café coins to buy another ${def.name}.`};
      this.state.businessMoney-=cost;
      machine.owned+=1;
      this.save();
      return {ok:true,message:`Bought another ${def.name} for ${cost} Café coins. ${machine.owned} of 4 owned.`};
    }

    upgradeMachine(id) {
      const machine=this.state.machines[id];
      const def=MACHINES[id];
      if(!machine||!def) return {ok:false,message:"Machine not found."};

      const next=MACHINE_TIERS[machine.tierIndex+1];
      if(!next) return {ok:false,message:`${def.name} is already Ultra tier.`};
      if(this.state.level<next.level) return {ok:false,message:`${next.name} unlocks at Café Level ${next.level}.`};
      if(this.state.businessDebt>0) return {ok:false,message:"Machine upgrades are unavailable while the Café is in debt."};

      const cost=def.baseCost*next.costMultiplier;
      if(this.state.businessMoney<cost) return {ok:false,message:`Need ${cost} Café coins.`};

      this.state.businessMoney-=cost;
      machine.tierIndex+=1;
      this.save();
      return {ok:true,message:`${def.name} upgraded to ${next.name}.`};
    }

    candidatesByRole(role) {
      if(!role || role==="all") return this.state.employeeCandidates;
      return this.state.employeeCandidates.filter(candidate=>candidate.role===role);
    }

    refreshCandidates() {
      this.state.employeeCandidates=Array.from({length:4},()=>this.makeEmployeeCandidate());
      return this.state.employeeCandidates;
    }

    makeEmployeeCandidate() {
      const roles=Object.keys(EMPLOYEE_ROLES);
      const role=roles[Math.floor(Math.random()*roles.length)];
      const name=`${FIRST_NAMES[Math.floor(Math.random()*FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random()*LAST_NAMES.length)]}`;
      return {
        id:`candidate-${Date.now()}-${Math.random()}`,
        name,role,
        xp:0,skillName:"Beginner",
        shiftWage:EMPLOYEE_ROLES[role].shiftWage,
        managerEligible:false,
        promotedManager:false
      };
    }

    hireEmployee(candidateId) {
      if(this.state.businessMoney<100) return {ok:false,message:"You need 100 Café coins to hire an employee."};
      const index=this.state.employeeCandidates.findIndex(e=>e.id===candidateId);
      if(index<0) return {ok:false,message:"Candidate not found."};
      const employee=this.state.employeeCandidates.splice(index,1)[0];
      employee.id=`employee-${Date.now()}-${Math.random()}`;
      this.state.employees.push(employee);
      this.state.businessMoney-=100;
      this.refreshCandidates();
      this.save();
      return {ok:true,message:`Hired ${employee.name} as ${EMPLOYEE_ROLES[employee.role].name}. Shift wage ${employee.shiftWage} coins.`};
    }

    toggleEmployeeSelection(employeeId) {
      const employee=this.state.employees.find(e=>e.id===employeeId);
      if(!employee) return {ok:false,message:"Employee not found."};

      const selected=this.state.selectedEmployeeIds.includes(employeeId);
      if(selected) this.state.selectedEmployeeIds=this.state.selectedEmployeeIds.filter(id=>id!==employeeId);
      else this.state.selectedEmployeeIds.push(employeeId);

      this.save();
      return {ok:true,message:`${employee.name} ${selected?"removed from":"assigned to"} the next shift.`};
    }

    getSelectedEmployees() {
      return this.state.employees.filter(e=>this.state.selectedEmployeeIds.includes(e.id));
    }

    updateEmployeeSkill(employee) {
      employee.xp+=(employee.taskXp||0);
      employee.taskXp=0;

      let newSkill=SKILL_LEVELS[0].name;
      SKILL_LEVELS.forEach(level=>{if(employee.xp>=level.xp)newSkill=level.name;});
      const changed=newSkill!==employee.skillName;
      employee.skillName=newSkill;
      employee.managerEligible=newSkill==="Expert";

      if(changed) this.announce(`${employee.name} advanced to ${newSkill} ${EMPLOYEE_ROLES[employee.role].name}.`);
      if(employee.managerEligible&&!employee.promotedManager) this.announce(`${employee.name} is now eligible for promotion to Café Manager.`);
    }

    promoteManager(employeeId) {
      const employee=this.state.employees.find(e=>e.id===employeeId);
      if(!employee) return {ok:false,message:"Employee not found."};
      if(!employee.managerEligible) return {ok:false,message:`${employee.name} must reach Expert before becoming Manager.`};
      employee.promotedManager=true;
      employee.shiftWage+=25;
      this.save();
      return {ok:true,message:`${employee.name} promoted to Café Manager. New shift wage ${employee.shiftWage} coins.`};
    }

    idleOptions() {
      return IDLE_DURATIONS.filter(o=>o.unlockLevel<=this.state.level);
    }

    startIdleShift(minutes) {
      if(this.state.shift.active) return {ok:false,message:"End the active shift before starting Idle Mode."};
      if(this.state.idle.active) return {ok:false,message:"An Idle Shift is already running."};

      const option=this.idleOptions().find(o=>o.minutes===Number(minutes));
      if(!option) return {ok:false,message:"That Idle duration is not unlocked yet."};

      const staff=this.getSelectedEmployees();
      if(!staff.length) return {ok:false,message:"Select at least one employee before starting an Idle Shift."};

      this.state.idle={
        active:true,
        startAt:Date.now(),
        endAt:Date.now()+option.minutes*60000,
        durationMinutes:option.minutes,
        selectedEmployeeIds:staff.map(e=>e.id)
      };
      this.save();
      return {ok:true,message:`Idle Shift started for ${option.minutes<60?`${option.minutes} minutes`:`${option.minutes/60} hours`}.`};
    }

    checkIdleShift() {
      if(!this.state.idle.active) return {ok:false,message:"No Idle Shift is active."};
      if(Date.now()<this.state.idle.endAt) {
        const remaining=Math.ceil((this.state.idle.endAt-Date.now())/60000);
        return {ok:false,pending:true,message:`Idle Shift still running. About ${remaining} minutes remaining.`};
      }

      const minutes=this.state.idle.durationMinutes;
      const staff=this.state.employees.filter(e=>this.state.idle.selectedEmployeeIds.includes(e.id));
      const skillBonus=staff.reduce((sum,e)=>sum+SKILL_LEVELS.findIndex(s=>s.name===e.skillName)*.05,0);
      const baseCustomers=Math.max(1,Math.round(minutes/8));
      const customers=Math.max(1,Math.round(baseCustomers*(1+skillBonus)));
      const gross=customers*8;
      const payroll=staff.reduce((sum,e)=>sum+e.shiftWage,0);
      const operating=Math.round(customers*1.25);
      const net=Math.max(0,gross-payroll-operating);
      const ownerPay=Math.min(this.state.businessMoney+gross-payroll-operating,Math.round(net*this.state.ownerPayPercent/100));
      const employeeTipPool=Math.round(customers*.5);

      this.state.businessMoney+=gross;
      this.state.businessMoney-=payroll+operating;
      if(ownerPay>0) {
        this.state.businessMoney-=ownerPay;
        const economy=this.economy();
        if(economy) economy.addPersonalMoney(ownerPay,"Café Idle owner pay");
      }

      staff.forEach(e=>{e.xp+=Math.max(1,Math.round(minutes/30));this.updateEmployeeSkill(e);});
      this.addCafeXp(Math.max(2,Math.round(customers/3)));

      this.state.businessDebt=this.state.businessMoney<0?Math.abs(this.state.businessMoney):0;
      this.state.idle={active:false,startAt:null,endAt:null,durationMinutes:0,selectedEmployeeIds:[]};
      this.save();

      return {
        ok:true,
        customers,gross,payroll,operating,net,ownerPay,employeeTipPool,
        message:`Idle Shift complete. Customers served ${customers}. Gross sales ${gross}. Operating expenses ${operating}. Employee wages ${payroll}. Employee tip pool ${employeeTipPool}. Net profit ${net}. Owner pay ${ownerPay}. Café money ${this.state.businessMoney}.`
      };
    }
  }

  const cafe=new CafeGame();
  cafe.load();
  window.cafeGame=cafe;
  window.CAFE_DIFFICULTIES=DIFFICULTIES;
  window.CAFE_MENU=MENU;
  window.CAFE_SUPPLIES=SUPPLIES;
  window.CAFE_BAKERY=BAKERY;
  window.CAFE_MACHINES=MACHINES;
  window.CAFE_MENU_UNLOCK_LEVELS=MENU_UNLOCK_LEVELS;
  window.CAFE_MACHINE_REQUIREMENTS=MACHINE_REQUIREMENTS;
  window.CAFE_MACHINE_TIERS=MACHINE_TIERS;
  window.CAFE_EMPLOYEE_ROLES=EMPLOYEE_ROLES;
  window.CAFE_LEVEL_THRESHOLDS=LEVEL_THRESHOLDS;
})();
