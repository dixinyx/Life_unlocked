
"use strict";
(() => {
  const SAVE_KEY = "lifeUnlockedHotelV10";
  const defaults = () => ({
    version: "10.0",
    careerStarted: false,
    role: "Bellhop",
    shift: { active: false, tasks: 0, guests: 0 }
  });

  class HotelGameClass {
    constructor() { this.state = defaults(); }

    save() {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.state));
      return true;
    }

    load() {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      try {
        this.state = { ...defaults(), ...JSON.parse(raw) };
        this.save();
        return true;
      } catch {
        return false;
      }
    }

    reset() {
      localStorage.removeItem(SAVE_KEY);
      this.state = defaults();
      this.save();
    }

    startCareer() {
      this.state.careerStarted = true;
      this.save();
      return { ok: true, message: "Hotel career started as Bellhop." };
    }

    startShift() {
      if (this.state.shift.active) return { ok: false, message: "Hotel shift already active." };
      this.state.shift = { active: true, tasks: 0, guests: 0 };
      this.save();
      return { ok: true, message: "Hotel shift started." };
    }

    performTask() {
      if (!this.state.shift.active) return { ok: false, message: "Start a Hotel shift first." };
      this.state.shift.tasks += 1;
      this.state.shift.guests += 1;
      this.save();
      return { ok: true, message: `Hotel task completed. Guests assisted ${this.state.shift.guests}.` };
    }

    endShift() {
      if (!this.state.shift.active) return { ok: false, message: "No active Hotel shift." };
      const result = { ok: true, message: `Hotel shift ended. Tasks ${this.state.shift.tasks}. Guests ${this.state.shift.guests}.` };
      this.state.shift.active = false;
      this.save();
      return result;
    }
  }

  const hotel = new HotelGameClass();
  hotel.load();
  window.HotelGame = hotel;
})();
