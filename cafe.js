"use strict";
(() => {
  const SAVE_KEY = "lifeUnlockedCafeV10";
  const VERSION = "10.1";

  const DIFFICULTIES = {
    beginner: { name: "Beginner", patience: null, arrivalSeconds: null },
    easy: { name: "Easy", patience: 60, arrivalSeconds: 18 },
    medium: { name: "Medium", patience: 45, arrivalSeconds: 15 },
    hard: { name: "Hard", patience: 30, arrivalSeconds: 12 },
    expert: { name: "Expert", patience: 20, arrivalSeconds: 10 }
  };

  const MENU = [
    { id: "coffee", name: "Coffee", price: 7, prepSeconds: 2 },
    { id: "tea", name: "Tea", price: 6, prepSeconds: 2 },
    { id: "hotChocolate", name: "Hot Chocolate", price: 8, prepSeconds: 3 },
    { id: "grilledCheese", name: "Grilled Cheese", price: 10, prepSeconds: 3 }
  ];

  const names = ["Tasha", "Tamara", "Mike", "Nadia", "Jordan", "Maya", "Jamal", "Sofia", "Kai", "Aaliyah"];

  const defaults = () => ({
    version: VERSION,
    businessMoney: 500,
    difficulty: "beginner",
    shift: { active: false, number: 1, workArea: "counter", served: 0, sales: 0 },
    customers: [],
    orders: []
  });

  class CafeGame {
    constructor() {
      this.state = defaults();
      this.patienceTimer = null;
      this.arrivalTimer = null;
      this.prepTimeouts = {};
      this.announcementQueue = [];
      this.announcementBusy = false;
      this.onStateChanged = null;
    }

    announce(message) {
      const text = String(message || "");
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
        this.announcementBusy = false;
        this.processAnnouncementQueue();
        return;
      }
      live.textContent = "";
      setTimeout(() => {
        live.textContent = text;
        const readingTime = Math.max(1400, Math.min(4200, 650 + text.length * 38));
        setTimeout(() => {
          this.announcementBusy = false;
          this.processAnnouncementQueue();
        }, readingTime);
      }, 30);
    }

    notifyStateChanged() {
      if (typeof this.onStateChanged === "function") {
        try { this.onStateChanged(); } catch (error) { console.error(error); }
      }
    }

    save() {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.state));
      return true;
    }

    load() {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      try {
        const parsed = JSON.parse(raw);
        this.state = {
          ...defaults(),
          ...parsed,
          shift: { ...defaults().shift, ...(parsed.shift || {}) },
          customers: Array.isArray(parsed.customers) ? parsed.customers : [],
          orders: Array.isArray(parsed.orders) ? parsed.orders : []
        };
        this.state.version = VERSION;

        this.state.orders = this.state.orders.filter(order =>
          this.state.customers.some(
            customer =>
              customer.id === order.customerId &&
              !customer.left &&
              !customer.served
          ) || order.status === "served"
        );

        this.save();
        return true;
      } catch {
        return false;
      }
    }

    reset() {
      this.stopTimers();
      this.announcementQueue = [];
      this.announcementBusy = false;
      localStorage.removeItem(SAVE_KEY);
      this.state = defaults();
      this.save();
    }

    setDifficulty(id) {
      if (!DIFFICULTIES[id]) return { ok: false, message: "Unknown difficulty." };
      if (this.state.shift.active) return { ok: false, message: "End the shift before changing difficulty." };
      this.state.difficulty = id;
      this.save();
      return { ok: true, message: `${DIFFICULTIES[id].name} selected.` };
    }

    startShift(workArea = "counter") {
      if (this.state.shift.active) return { ok: false, message: "A shift is already active." };
      this.state.customers = [];
      this.state.orders = [];
      this.state.shift = {
        active: true,
        number: this.state.shift.number,
        workArea,
        served: 0,
        sales: 0
      };
      this.startTimers();
      this.save();
      return { ok: true, message: `${workArea === "driveThru" ? "Drive-Thru" : "Café"} shift started.` };
    }

    endShift() {
      if (!this.state.shift.active) return { ok: false, message: "No active shift." };
      this.stopTimers();
      const result = {
        ok: true,
        served: this.state.shift.served,
        sales: this.state.shift.sales,
        message: `Shift ended. Customers served ${this.state.shift.served}. Sales ${this.state.shift.sales} coins.`
      };
      this.state.shift.active = false;
      this.state.shift.number += 1;
      this.state.customers = [];
      this.state.orders = [];
      this.save();
      return result;
    }

    ensureTimersForActiveShift() {
      if (this.state.shift.active && !this.patienceTimer && !this.arrivalTimer) {
        this.startTimers();
      }
    }

    startTimers() {
      this.stopTimers();
      this.patienceTimer = setInterval(() => this.tickPatience(), 1000);
      const difficulty = DIFFICULTIES[this.state.difficulty];
      if (difficulty.arrivalSeconds !== null) {
        this.arrivalTimer = setInterval(() => {
          if (!this.state.shift.active || this.getActiveCustomers().length >= 5) return;
          const result = this.addCustomer(true);
          if (result.ok) {
            this.announce(`${result.customer.name} arrived automatically.`);
            this.notifyStateChanged();
          }
        }, difficulty.arrivalSeconds * 1000);
      }
    }

    stopTimers() {
      if (this.patienceTimer) clearInterval(this.patienceTimer);
      if (this.arrivalTimer) clearInterval(this.arrivalTimer);
      this.patienceTimer = null;
      this.arrivalTimer = null;
      Object.keys(this.prepTimeouts).forEach(orderId => {
        clearTimeout(this.prepTimeouts[orderId]);
        delete this.prepTimeouts[orderId];
      });
    }

    stopPatienceTimer() {
      this.stopTimers();
    }

    tickPatience() {
      if (!this.state.shift.active) return;
      const seconds = DIFFICULTIES[this.state.difficulty].patience;
      if (seconds === null) return; // Beginner has no timer.

      this.state.customers.forEach(customer => {
        if (customer.served || customer.left) return;
        customer.patience -= 1;

        if (customer.patience === 10) {
          this.announce(`${customer.name} is getting impatient. 10 seconds remaining.`);
        }

        if (customer.patience <= 0) {
          customer.left = true;
          this.cancelOrdersForCustomer(customer.id);
          this.save();
          this.announce(`${customer.name} left the Café.`);
          this.notifyStateChanged();
        }
      });

      this.save();
    }

    addCustomer(automatic = false) {
      if (!this.state.shift.active) return { ok: false, message: "Start a shift first." };

      const seconds = DIFFICULTIES[this.state.difficulty].patience;
      const customer = {
        id: `customer-${Date.now()}-${Math.random()}`,
        name: names[Math.floor(Math.random() * names.length)],
        served: false,
        left: false,
        patience: seconds
      };

      this.state.customers.push(customer);
      this.save();
      return { ok: true, customer, message: `${customer.name} entered the Café.` };
    }

    getActiveCustomers() {
      return this.state.customers.filter(c => !c.served && !c.left);
    }

    getOrderForCustomer(customerId) {
      return this.state.orders.find(o => o.customerId === customerId && o.status !== "served") || null;
    }

    cancelOrdersForCustomer(customerId) {
      const cancelledIds = this.state.orders
        .filter(o => o.customerId === customerId && o.status !== "served")
        .map(o => o.id);

      cancelledIds.forEach(orderId => {
        if (this.prepTimeouts[orderId]) {
          clearTimeout(this.prepTimeouts[orderId]);
          delete this.prepTimeouts[orderId];
        }
      });

      if (cancelledIds.length) {
        this.state.orders = this.state.orders.filter(o => !cancelledIds.includes(o.id));
      }

      return cancelledIds.length;
    }

    takeOrder(customerId) {
      const customer = this.state.customers.find(c => c.id === customerId && !c.served && !c.left);
      if (!customer) return { ok: false, message: "Customer unavailable." };
      if (this.getOrderForCustomer(customerId)) return { ok: false, message: "Order already taken." };

      const item = MENU[Math.floor(Math.random() * MENU.length)];
      const order = {
        id: `order-${Date.now()}-${Math.random()}`,
        customerId: customer.id,
        customerName: customer.name,
        itemName: item.name,
        price: item.price,
        prepSeconds: item.prepSeconds,
        status: "waiting"
      };

      this.state.orders.push(order);

      const patience = DIFFICULTIES[this.state.difficulty].patience;
      if (patience !== null) customer.patience = patience;

      this.save();
      return { ok: true, order, message: `${customer.name} ordered ${item.name}.` };
    }

    prepareOrder(orderId) {
      const order = this.state.orders.find(o => o.id === orderId && o.status === "waiting");
      if (!order) return { ok: false, message: "No waiting order found." };

      order.status = "preparing";
      this.save();

      const timeoutId = setTimeout(() => {
        delete this.prepTimeouts[orderId];

        if (!this.state.shift.active) return;
        const stillThere = this.state.orders.find(o => o.id === orderId && o.status === "preparing");
        if (!stillThere) return;

        const customer = this.state.customers.find(
          c => c.id === stillThere.customerId && !c.left && !c.served
        );

        if (!customer) {
          this.cancelOrdersForCustomer(stillThere.customerId);
          this.save();
          this.notifyStateChanged();
          return;
        }

        stillThere.status = "ready";
        const patience = DIFFICULTIES[this.state.difficulty].patience;
        if (patience !== null) customer.patience = patience;
        this.save();
        this.announce(`${stillThere.customerName}'s ${stillThere.itemName} is ready to serve.`);
        this.notifyStateChanged();
      }, order.prepSeconds * 1000);

      this.prepTimeouts[orderId] = timeoutId;

      return { ok: true, message: `Preparing ${order.customerName}'s ${order.itemName}.` };
    }

    serveOrder(orderId) {
      const order = this.state.orders.find(o => o.id === orderId && o.status === "ready");
      if (!order) return { ok: false, message: "No ready order found." };

      const customer = this.state.customers.find(c => c.id === order.customerId && !c.left);
      if (!customer) return { ok: false, message: "Customer unavailable." };

      order.status = "served";
      customer.served = true;
      this.state.businessMoney += order.price;
      this.state.shift.served += 1;
      this.state.shift.sales += order.price;
      this.save();

      return { ok: true, message: `Served ${customer.name}. Earned ${order.price} coins.` };
    }

    firstCustomerNeedingOrder() {
      return this.getActiveCustomers().find(c => !this.getOrderForCustomer(c.id)) || null;
    }

    firstOrder(status) {
      return this.state.orders.find(o => {
        if (o.status !== status) return false;
        return this.state.customers.some(
          c => c.id === o.customerId && !c.left && !c.served
        );
      }) || null;
    }

    getStatus() {
      const active = this.getActiveCustomers().length;
      const waiting = this.state.orders.filter(o => o.status === "waiting").length;
      const preparing = this.state.orders.filter(o => o.status === "preparing").length;
      const ready = this.state.orders.filter(o => o.status === "ready").length;
      return `${active} active customers. ${waiting} waiting to prepare. ${preparing} preparing. ${ready} ready to serve.`;
    }
  }

  const cafe = new CafeGame();
  cafe.load();
  window.cafeGame = cafe;
  window.CAFE_DIFFICULTIES = DIFFICULTIES;
})();
