(function () {
  "use strict";

  // The mark, palette and motion family identify a card even during a fast volley.
  const signatures = {
    warrior: ["⬡", "#ffc179", "ward"],
    mage: ["✧", "#9cc5ff", "spell"],
    assassin: ["╱", "#ff626b", "cut"],
    shadow_assassin: ["☾", "#bb89ff", "cut"],
    guardian: ["✷", "#ff9a58", "ward"],
    ranger: ["➶", "#bbeb97", "arrow"],
    young_dragon: ["✦", "#ffbc59", "breath"],
    priest: ["✚", "#a9efd5", "spell"],
    rage_dragon: ["♨", "#ff6341", "breath"],
    mirror_mage: ["◈", "#9bf5ff", "spell"],
    poison_witch: ["☠", "#bcf063", "spell"],
    poison_assassin: ["✕", "#89ff8c", "cut"],
    round_table_guardian: ["✥", "#ffe18c", "ward"],
    berserker: ["⚔", "#ff7360", "cut"],
    divine_archer: ["✵", "#ffe7a0", "arrow"],
    holy_priest: ["✙", "#fff0a3", "spell"],
    dark_priest: ["◐", "#df8eff", "spell"],
    heal: ["✚", "#84ffc2", "spell"],
    buff: ["⚔", "#ffad6d", "cut"],
    skip: ["⌛︎", "#accbff", "ward"],
    bolt: ["ϟ", "#b9e8ff", "arrow"],
    ganyu: ["♦", "#84e6ff", "spell"],
    recruit: ["⚑", "#ffcb8b", "ward"],
    holy_light: ["☀", "#fff3ae", "spell"],
  };

  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  function point(side, slot) {
    const node = document.getElementById(`${side}-slot-${slot}`);
    if (!node) return null;
    const rect = node.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  function place(kind, x, y, color) {
    const node = document.createElement("div");
    node.className = "battle-fx " + kind;
    node.style.left = x + "px";
    node.style.top = y + "px";
    node.style.setProperty("--fx-ink", color);
    document.getElementById("fx-layer").appendChild(node);
    return node;
  }

  function burst(id, location, mode = "impact") {
    if (!location || !signatures[id]) return;
    const [mark, color, family] = signatures[id];
    const node = place(`battle-fx-burst battle-fx--${family} battle-fx--${mode}`,
      location.x, location.y, color);
    const sigil = document.createElement("span");
    sigil.className = "battle-fx-mark";
    sigil.textContent = mark;
    node.appendChild(sigil);

    if (!motionQuery.matches) {
      const particles = mode === "upgrade" ? 18 : 9;
      for (let i = 0; i < particles; i++) {
        const spark = document.createElement("i");
        const angle = i * Math.PI * 2 / particles + 0.2;
        const distance = 33 + (i % 4) * 13;
        spark.style.setProperty("--dx", Math.cos(angle) * distance + "px");
        spark.style.setProperty("--dy", Math.sin(angle) * distance + "px");
        spark.style.setProperty("--rot", angle + "rad");
        spark.style.setProperty("--lag", (i % 3) * 28 + "ms");
        node.appendChild(spark);
      }
    }

    setTimeout(() => node.remove(), mode === "upgrade" ? 1100 : 680);
  }

  function defeat(id, side, slot) {
    const location = point(side, slot);
    if (!location) return;
    if (!motionQuery.matches) {
      const token = place("battle-fx-fallen", location.x, location.y, signatures[id][1]);
      token.style.backgroundImage = 'url("assets/card-' + id.replaceAll("_", "-") + '.png")';
      setTimeout(() => token.remove(), 620);
    }
    burst(id, location, "defeat");
  }

  async function travel(id, from, to) {
    if (!from || !to || motionQuery.matches) return;
    const [mark, color, family] = signatures[id];
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    if (Math.hypot(dx, dy) < 2) return;
    const node = place(`battle-fx-travel battle-fx--${family}`, from.x, from.y, color);
    node.textContent = mark;
    node.style.setProperty("--heading", Math.atan2(dy, dx) + "rad");
    try {
      await node.animate([
        { transform: "translate(-50%, -50%) scale(.5)", opacity: .45 },
        { transform: `translate(calc(-50% + ${dx * .3}px), calc(-50% + ${dy * .3}px)) scale(1)`, opacity: 1, offset: .35 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(.8)`, opacity: .9 },
      ], { duration: family === "breath" ? 340 : 240, easing: "ease-in" }).finished;
    } finally {
      node.remove();
    }
  }

  window.BattleFX = { point, burst, defeat, travel };
})();
