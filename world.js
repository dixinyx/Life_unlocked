
"use strict";
(() => {
  const SAVE_KEY = "lifeUnlockedWorldV10";
  const VERSION = "10.0";

  const defaults = () => ({
    version: VERSION,
    character: { name: "", age: 18 },
    money: { personal: 1000, savings: 0 },
    date: { year: 1, month: 9, day: 1, minutes: 480 },
    location: { area: "Willowmere", place: "Willowmere Starter Apartment" }
  });

  function timeLabel(minutes) {
    let h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const ap = h >= 12 ? "PM" : "AM";
    h %= 12;
    if (h === 0) h = 12;
    return `${h}:${String(m).padStart(2, "0")} ${ap}`;
  }

  class WorldGame {
    constructor() { this.state = defaults(); }

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
          money: { ...defaults().money, ...(parsed.money || {}) },
          date: { ...defaults().date, ...(parsed.date || {}) },
          location: { ...defaults().location, ...(parsed.location || {}) }
        };
        this.state.version = VERSION;
        this.save();
        return true;
      } catch {
        return false;
      }
    }

    reset(profile = {}) {
      this.state = defaults();
      this.state.character.name = profile.name || "";
      this.state.character.age = Number(profile.age) || 18;
      this.save();
    }

    getDateTimeLabel() {
      const d = this.state.date;
      return `Year ${d.year}, ${d.month}/${d.day}, ${timeLabel(d.minutes)}`;
    }

    advanceTime(minutes) {
      this.state.date.minutes += Math.max(0, Number(minutes) || 0);
      while (this.state.date.minutes >= 1440) {
        this.state.date.minutes -= 1440;
        this.state.date.day += 1;
        if (this.state.date.day > 30) {
          this.state.date.day = 1;
          this.state.date.month += 1;
          if (this.state.date.month > 12) {
            this.state.date.month = 1;
            this.state.date.year += 1;
          }
        }
      }
      this.save();
    }

    addPersonalMoney(amount) {
      this.state.money.personal += Math.max(0, Math.round(Number(amount) || 0));
      this.save();
    }
  }

  const world = new WorldGame();
  world.load();
  window.LifeUnlockedWorld = world;
})();
