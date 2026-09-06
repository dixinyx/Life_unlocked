
"use strict";
(() => {
  const VERSION = "10.7";

  class EconomySystem {
    constructor() {
      this.defaultOwnerPayPercent = 20;
    }

    world() {
      return window.LifeUnlockedWorld || null;
    }

    addPersonalMoney(amount, reason = "Income") {
      const world = this.world();
      if (!world) return 0;
      return world.addPersonalMoney(Math.max(0, Math.round(Number(amount) || 0)), reason);
    }

    spendPersonalMoney(amount, reason = "Expense") {
      const world = this.world();
      if (!world) return { ok: false, message: "Personal Money system is unavailable." };
      return world.spendPersonalMoney(Math.max(0, Math.round(Number(amount) || 0)), reason);
    }

    addTipToPersonal(amount, reason = "Tip") {
      const value = Math.max(0, Math.round(Number(amount) || 0));
      if (value > 0) this.addPersonalMoney(value, reason);
      return value;
    }

    settleShift({
      businessBalance = 0,
      grossSales = 0,
      operatingCosts = 0,
      employeeWages = 0,
      tips = 0,
      ownerPayPercent = this.defaultOwnerPayPercent,
      ownerPayReason = "Business owner pay"
    } = {}) {
      const gross = Math.max(0, Math.round(Number(grossSales) || 0));
      const operating = Math.max(0, Math.round(Number(operatingCosts) || 0));
      const wages = Math.max(0, Math.round(Number(employeeWages) || 0));
      const tipAmount = Math.max(0, Math.round(Number(tips) || 0));
      const percent = Math.max(0, Math.min(100, Math.round(Number(ownerPayPercent) || 0)));

      let balance = Number(businessBalance || 0);
      balance -= operating;
      balance -= wages;

      const netProfit = Math.max(0, gross - operating - wages);
      const ownerPay = Math.max(0, Math.min(balance, Math.round(netProfit * percent / 100)));

      if (ownerPay > 0) {
        balance -= ownerPay;
        this.addPersonalMoney(ownerPay, ownerPayReason);
      }

      const debt = balance < 0 ? Math.abs(balance) : 0;

      return {
        businessBalance: balance,
        grossSales: gross,
        operatingCosts: operating,
        employeeWages: wages,
        tips: tipAmount,
        netProfit,
        ownerPay,
        retainedProfit: Math.max(0, netProfit - ownerPay),
        debt
      };
    }

    simpleSummary(result, businessName = "Business") {
      return `${businessName} finances. Sales ${result.grossSales} coins. Expenses ${result.operatingCosts} coins. Employee wages ${result.employeeWages} coins. Tips ${result.tips} Personal coins. Net profit ${result.netProfit} coins. Owner pay ${result.ownerPay} coins. Business balance ${result.businessBalance} coins.${result.debt ? ` Debt ${result.debt} coins.` : ""}`;
    }
  }

  window.LifeUnlockedEconomy = new EconomySystem();
  window.LIFE_UNLOCKED_ECONOMY_VERSION = VERSION;
})();
