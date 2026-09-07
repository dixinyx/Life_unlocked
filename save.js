
"use strict";
(() => {
  const MASTER_KEY = "lifeUnlockedUnifiedSaveV10";
  const SAVE_FORMAT = 1;
  const BUILD = "10.8.6";

  let attached = false;
  let saving = false;
  let lastScreen = "main";

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function modules() {
    return {
      game: window.lifeUnlockedGame || null,
      world: window.LifeUnlockedWorld || null,
      cafe: window.cafeGame || null,
      hotel: window.HotelGame || null
    };
  }

  function hasCharacter() {
    return Boolean(window.lifeUnlockedGame &&
      window.lifeUnlockedGame.state &&
      window.lifeUnlockedGame.state.session &&
      window.lifeUnlockedGame.state.session.setupComplete);
  }

  function snapshot() {
    const m = modules();
    return {
      saveFormat: SAVE_FORMAT,
      build: BUILD,
      savedAt: Date.now(),
      ui: { lastScreen },
      game: m.game ? clone(m.game.state) : null,
      world: m.world ? clone(m.world.state) : null,
      cafe: m.cafe ? clone(m.cafe.state) : null,
      hotel: m.hotel ? clone(m.hotel.state) : null
    };
  }

  function saveAll() {
    if (saving) return false;
    try {
      saving = true;
      localStorage.setItem(MASTER_KEY, JSON.stringify(snapshot()));
      return true;
    } catch (error) {
      console.error("Unified save failed", error);
      return false;
    } finally {
      saving = false;
    }
  }

  function restoreAll() {
    const raw = localStorage.getItem(MASTER_KEY);
    if (!raw) return false;

    try {
      const data = JSON.parse(raw);
      const m = modules();

      if (data.game && m.game) m.game.state = clone(data.game);
      if (data.world && m.world) m.world.state = clone(data.world);
      if (data.cafe && m.cafe) m.cafe.state = clone(data.cafe);
      if (data.hotel && m.hotel) m.hotel.state = clone(data.hotel);
      if (data.ui && data.ui.lastScreen) lastScreen = data.ui.lastScreen;

      // Synchronize the existing per-module saves so older builds remain recoverable.
      if (m.game) m.game.save();
      if (m.world) m.world.save();
      if (m.cafe) m.cafe.save();
      if (m.hotel) m.hotel.save();

      return true;
    } catch (error) {
      console.error("Unified restore failed", error);
      return false;
    }
  }

  function migrateExistingSaves() {
    if (localStorage.getItem(MASTER_KEY)) return false;

    // Existing modules already loaded their old Version 10 save keys.
    // If a character exists, capture that state as the first unified save.
    if (hasCharacter()) {
      saveAll();
      return true;
    }
    return false;
  }

  function wrapSave(object) {
    if (!object || typeof object.save !== "function" || object.__unifiedSaveWrapped) return;

    const original = object.save.bind(object);
    object.save = function(...args) {
      const result = original(...args);
      saveAll();
      return result;
    };
    object.__unifiedSaveWrapped = true;
  }

  function attachAutosave() {
    if (attached) return;
    attached = true;

    const m = modules();
    Object.values(m).forEach(wrapSave);

    window.addEventListener("pagehide", saveAll);
    window.addEventListener("beforeunload", saveAll);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") saveAll();
    });

    // Safety checkpoint. Ordinary gameplay saves still happen immediately.
    setInterval(saveAll, 15000);
  }

  function bootstrap() {
    const restored = restoreAll();
    if (!restored) migrateExistingSaves();
    attachAutosave();
    saveAll();
    return hasCharacter();
  }

  function resetMaster() {
    localStorage.removeItem(MASTER_KEY);
  }

  function setLastScreen(name) {
    if (name && name !== "welcome" && name !== "new-game") {
      lastScreen = name;
      saveAll();
    }
  }

  function getLastScreen() {
    return lastScreen;
  }

  window.LifeUnlockedSave = {
    bootstrap,
    saveAll,
    restoreAll,
    resetMaster,
    setLastScreen,
    getLastScreen,
    hasCharacter,
    key: MASTER_KEY,
    build: BUILD
  };
})();
