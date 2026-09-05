
"use strict";
(() => {
  const SAVE_KEY = "lifeUnlockedMasterV10";
  const VERSION = "10.0";

  const defaults = () => ({
    version: VERSION,
    player: {
      name: "",
      age: 18,
      gender: "Prefer Not to Say",
      pronouns: "They / Them",
      sexuality: "Prefer Not to Say",
      relationshipStatus: "Single",
      appearance: {
        skinTone: "Medium",
        hairLength: "Medium",
        hairColor: "Brown",
        eyeColor: "Brown",
        bodyShape: "Average",
        clothingStyle: "Casual"
      }
    },
    session: { setupComplete: false, createdAt: Date.now(), lastOpenedAt: Date.now() }
  });

  class LifeUnlockedGame {
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
          player: {
            ...defaults().player,
            ...(parsed.player || {}),
            appearance: {
              ...defaults().player.appearance,
              ...((parsed.player && parsed.player.appearance) || {})
            }
          },
          session: { ...defaults().session, ...(parsed.session || {}) }
        };
        this.state.version = VERSION;
        this.state.session.lastOpenedAt = Date.now();
        this.save();
        return true;
      } catch {
        return false;
      }
    }

    startNewGame(profile) {
      const next = defaults();
      next.player = {
        ...next.player,
        ...profile,
        appearance: { ...next.player.appearance, ...(profile.appearance || {}) }
      };
      next.session.setupComplete = true;
      this.state = next;
      this.save();
      return this.state;
    }

    reset() {
      localStorage.removeItem(SAVE_KEY);
      this.state = defaults();
    }
  }

  const game = new LifeUnlockedGame();
  game.load();
  window.lifeUnlockedGame = game;
  window.LIFE_UNLOCKED_VERSION = VERSION;
})();
