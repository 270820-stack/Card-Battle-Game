(function () {
  "use strict";

  function playSfx(method, arg) {
    try {
      if (typeof GameSFX !== "undefined" && typeof GameSFX[method] === "function") {
        GameSFX[method](arg);
      }
    } catch (e) {
      /* ignore */
    }
  }

  const CARD_POOL = {
    warrior: {
      type: "character",
      name: "守卫",
      hp: 30,
      damage: 2,
      targetRule: "front_nearest_right",
      passive: "shareDamage",
      skill:
        "盾击 2：优先攻击正前方；若该格无角色则攻击最近一列，同距离优先右侧",
      passiveDesc:
        "被动·分担：每名守卫各替一名友方（生命最低与次低，不含守卫）承受 50% 所受伤害",
    },
    mage: {
      type: "character",
      name: "法师",
      hp: 18,
      damage: 5,
      targetRule: "lowest_hp",
      skill: "奥弹 5：攻击当前生命最低的敌方；同血优先右侧",
    },
    assassin: {
      type: "character",
      name: "刺客",
      hp: 20,
      damage: 4,
      targetRule: "highest_hp",
      passive: "assassinBlood",
      skill: "刺杀 4：攻击当前生命最高的敌方；同血优先右侧",
      passiveDesc:
        "被动·血刃：若目标当前生命不低于 50%，额外造成 2 点真实伤害",
    },
    shadow_assassin: {
      type: "character",
      tier: 2,
      upgradesFrom: "assassin",
      upgradeHolyWaterCost: 10,
      name: "暗影刺客",
      hp: 20,
      damage: 6,
      targetRule: "highest_hp",
      passive: "shadowAssassinBlood",
      skill: "刺杀 6：攻击当前生命最高的敌方；同血优先右侧",
      passiveDesc:
        "被动·影刃：目标剩余生命超过 50%、75%、满血时，额外造成 3、5、7 点真实伤害（取最高档，不叠加）",
    },
    guardian: {
      type: "character",
      name: "战士",
      hp: 25,
      damage: 2,
      targetRule: "all_enemies",
      skill: "猛击 2：对场上每一名敌方造成 2 点伤害",
    },
    ranger: {
      type: "character",
      name: "游侠",
      hp: 15,
      damage: 4,
      targetRule: "ranger_random",
      skill: "连射 4：随机攻击一名敌方；有 50% 概率再随机攻击一次",
    },
    young_dragon: {
      type: "character",
      name: "幼龙",
      hp: 10,
      damage: 1,
      targetRule: "front_nearest_right",
      passive: "youngDragonHw",
      skill:
        "龙息 1：优先攻击正前方；若该格无角色则攻击最近一列，同距离优先右侧",
      passiveDesc: "被动·蓄能：每次发动攻击后获得 1 圣水",
    },
    priest: {
      type: "character",
      name: "牧师",
      hp: 15,
      damage: 0,
      targetRule: "priest_heal",
      skill:
        "治疗 3：为一名己方回复 3 生命；优先当前生命≤5 者，否则按生命百分比最低（可含自己）",
    },
    rage_dragon: {
      type: "character",
      tier: 2,
      upgradesFrom: "young_dragon",
      upgradeHolyWaterCost: 7,
      name: "怒龙",
      hp: 23,
      damage: 1,
      targetRule: "front_nearest_right",
      passive: "rageDragon",
      skill:
        "龙焰 1：优先攻击正前方；若该格无角色则攻击最近一列，同距离优先右侧",
      passiveDesc:
        "被动·血怒：造成伤害等于自身已损失生命（至少为 1）；若击杀目标可再发动一次相同攻击（消耗 3 圣水）",
    },
    mirror_mage: {
      type: "character",
      tier: 2,
      upgradesFrom: "mage",
      upgradeHolyWaterCost: 10,
      name: "镜像法师",
      hp: 25,
      damage: 7,
      targetRule: "lowest_hp",
      skill: "奥弹 7：攻击当前生命最低的敌方；同血优先右侧",
      passive: "counterStrike",
      passiveDesc: "被动·反击：受到伤害后，随机攻击一名敌方",
    },
    poison_witch: {
      type: "character",
      tier: 2,
      upgradesFrom: "mage",
      upgradeHolyWaterCost: 10,
      name: "毒巫",
      hp: 23,
      damage: 7,
      targetRule: "random_living_enemy",
      passive: "poisonOnHit",
      skill: "毒咒 7：随机一名敌方，7 点真实伤害并施加中毒",
      passiveDesc:
        "被动·毒咒：攻击为真实伤害；目标中毒（一回合）：治疗效力-80%，受击额外 +1",
    },
    poison_assassin: {
      type: "character",
      tier: 2,
      upgradesFrom: "assassin",
      upgradeHolyWaterCost: 9,
      name: "毒刺客",
      hp: 21,
      damage: 8,
      targetRule: "highest_hp",
      passive: "poisonOnHit",
      skill: "毒刺 8：攻击生命最高敌方并施加中毒",
      passiveDesc:
        "被动·毒刃：目标中毒（一回合）：治疗效力-80%，受击额外 +1",
    },
    round_table_guardian: {
      type: "character",
      tier: 2,
      upgradesFrom: "warrior",
      upgradeHolyWaterCost: 10,
      name: "圆桌守卫",
      hp: 45,
      damage: 3,
      targetRule: "front_nearest_right",
      passive: "roundTableDamageReduction",
      skill:
        "盾击 3：优先攻击正前方；若该格无角色则攻击最近一列，同距离优先右侧",
      passiveDesc:
        "被动·圆桌：己方全体受到的伤害降低；场上 1/2/3/4 名圆桌守卫时分别为 30%/50%/70%/90%（单次受伤至少 1）",
    },
    berserker: {
      type: "character",
      tier: 2,
      upgradesFrom: "guardian",
      upgradeHolyWaterCost: 7,
      name: "狂战士",
      hp: 25,
      damage: 3,
      targetRule: "all_enemies",
      skill:
        "猛击 3：对场上每一名敌方造成伤害；每名依次 +1（首名 3，第二 4，第三 5…）",
      passive: "lifesteal30",
      passiveDesc:
        "被动·嗜血：每次攻击后，回复本次攻击总伤害的 30%；对每名敌方依次递增 +1 伤害（从基础伤害起）",
    },
    divine_archer: {
      type: "character",
      tier: 2,
      upgradesFrom: "ranger",
      upgradeHolyWaterCost: 12,
      name: "神箭手",
      hp: 20,
      damage: 5,
      targetRule: "three_random",
      skill:
        "连射 4：每次只射一箭；基础 3 箭，每箭后按目标血线判定是否再射一箭",
      passive: "repeatAttack30",
      passiveDesc:
        "被动·连环：每射一箭后按该箭目标当前血线判定，>50% 则 20% 再射一箭，否则 40%",
    },
    holy_priest: {
      type: "character",
      tier: 2,
      upgradesFrom: "priest",
      upgradeHolyWaterCost: 12,
      name: "神圣牧师",
      hp: 19,
      damage: 0,
      targetRule: "priest_heal_two",
      passive: "holyPriestReactive",
      skill:
        "圣疗 6：为两名己方各回复 6 生命；优先≤5 血者，否则按百分比最低（仅一名时只治疗一次）",
      passiveDesc:
        "被动·神圣灵光：己方受到伤害时，使该己方回复 2 生命（每名神圣牧师每回合最多 4 次）",
    },
    dark_priest: {
      type: "character",
      tier: 2,
      upgradesFrom: "priest",
      upgradeHolyWaterCost: 12,
      name: "黑暗牧师",
      hp: 19,
      damage: 0,
      targetRule: "dark_priest_skill",
      passive: "darkPriestSwap",
      skill:
        "暗噬 5：对随机一名敌方造成 5 伤害，并为一名己方回复 5 生命（优先≤5 血，否则按百分比最低）",
      passiveDesc:
        "被动·命换：回合开始时与敌方当前生命最高者交换生命；若己方已不低于对方则不交换（交换后不超过各自最大生命）",
    },
    heal: {
      type: "effect",
      name: "治疗术",
      desc: "消耗 1 点圣水。使一名己方角色回复 6 点生命",
      effect: "heal",
      value: 6,
    },
    buff: {
      type: "effect",
      name: "战意",
      desc: "消耗 1 点圣水。使一名己方角色下次攻击额外造成 3 点伤害",
      effect: "buff",
      value: 3,
    },
    skip: {
      type: "effect",
      name: "时间停滞",
      desc: "消耗 3 点圣水。跳过敌方下一个回合（其无法出牌与攻击）",
      effect: "skip",
    },
    bolt: {
      type: "effect",
      name: "闪电",
      desc: "消耗 1 点圣水。对一名敌方角色造成 2 点伤害",
      effect: "damage",
      value: 2,
    },
    ganyu: {
      type: "effect",
      name: "甘雨",
      desc: "获得 2 点圣水。",
      effect: "gain_holy_water",
      value: 2,
    },
    recruit: {
      type: "effect",
      name: "招募",
      desc: "消耗 1 点圣水。从牌库抽取 2 张牌。",
      effect: "draw_cards",
      value: 2,
    },
    holy_light: {
      type: "effect",
      name: "圣光",
      desc: "消耗 4 点圣水。将我方场上所有角色恢复至满血。",
      effect: "heal_all_full",
    },
  };

  const POOL_ORDER = [
    "warrior",
    "mage",
    "assassin",
    "shadow_assassin",
    "guardian",
    "ranger",
    "young_dragon",
    "priest",
    "rage_dragon",
    "mirror_mage",
    "poison_witch",
    "poison_assassin",
    "round_table_guardian",
    "berserker",
    "divine_archer",
    "holy_priest",
    "dark_priest",
    "heal",
    "buff",
    "skip",
    "bolt",
    "ganyu",
    "recruit",
    "holy_light",
  ];

  const HOLY_WATER_PER_TURN = 1;
  const HOLY_WATER_MAX = 25;

  /** 累计击败对方角色达此数即胜（可换将累加，与场上 4 格无关）。 */
  const WIN_DEFEAT_COUNT = 6;

  /** 甘雨免费；时间停滞 3、圣光 4；其余效果牌均为 1 */
  function holyWaterCost(def) {
    if (!def || def.type !== "effect") return 0;
    if (def.effect === "gain_holy_water") return 0;
    if (def.effect === "skip") return 3;
    if (def.effect === "heal_all_full") return 4;
    if (def.effect === "buff") return 0;
    return 1;
  }

  /** 一级角色从手牌上场时额外消耗的圣水（仅对战回合结算，布阵阶段免费） */
  function recruitHolyWaterCost(def) {
    if (!def || def.type !== "character" || def.tier) return 0;
    return def.recruitHolyWaterCost || 0;
  }

  /** 第几次「回合开始领圣水」（双方轮流各计一次）；≥8 为 2 倍，≥15 为 3 倍。 */
  function holyWaterGainAmountForTurn() {
    const n = battle.turnCount || 0;
    if (n >= 15) return HOLY_WATER_PER_TURN * 5;
    if (n >= 10) return HOLY_WATER_PER_TURN * 3;
    if (n >= 5) return HOLY_WATER_PER_TURN * 2;
    return HOLY_WATER_PER_TURN;
  }

  function gainHolyWater(side) {
    if (!battle) return;
    battle.turnCount = (battle.turnCount || 0) + 1;
    const gain = holyWaterGainAmountForTurn();
    if (side === "player") {
      battle.playerHolyWater = Math.min(
        HOLY_WATER_MAX,
        battle.playerHolyWater + gain
      );
    } else {
      battle.enemyHolyWater = Math.min(
        HOLY_WATER_MAX,
        battle.enemyHolyWater + gain
      );
    }
  }

  function updateHolyWaterPanel() {
    const pNum = document.getElementById("player-hw-num");
    const eNum = document.getElementById("enemy-hw-num");
    if (!pNum || !eNum) return;
    const pw = battle ? battle.playerHolyWater : 0;
    const ew = battle ? battle.enemyHolyWater : 0;
    pNum.textContent = String(pw);
    eNum.textContent = String(ew);
  }

  function updateTurnCounter() {
    const el = document.getElementById("turn-counter");
    if (!el) return;
    if (!battle) {
      el.textContent = "";
      return;
    }
    const n = battle.turnCount || 0;
    const mult =
      n >= 15 ? 5 : n >= 10 ? 3 : n >= 5 ? 2 : 1;
    let text = `回合 ${n}`;
    if (mult > 1) text += ` · 每回合圣水×${mult}`;
    el.textContent = text;
  }

  const TARGET_RULE_LABELS = {
    front_nearest_right: "正前→最近→右",
    lowest_hp: "最低生命",
    highest_hp: "最高生命",
    rightmost: "最右",
    leftmost: "最左",
    all_enemies: "全体",
    ranger_random: "随机一·50%追加",
    three_random: "单箭随机",
    priest_heal: "≤5血优先/否则百分比",
    priest_heal_two: "双目标同上",
    dark_priest_skill: "随机伤+治疗",
    random_living_enemy: "随机敌方",
  };

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /** 中毒：治疗量按 healMul（默认 0.2）；受击在 applyDamageWithShare 中加 extraOnHit。 */
  function healGainAfterPoison(c, baseHeal) {
    if (!c || c.hp <= 0) return 0;
    if (c.poison && c.poison.healMul != null) {
      return Math.max(0, Math.floor(baseHeal * c.poison.healMul + 1e-9));
    }
    return baseHeal;
  }

  function applyPoisonDebuff(victim, victimIsOnPlayerBoard, turns) {
    if (!victim || victim.hp <= 0) return;
    const n = Math.max(1, turns | 0);
    victim.poison = {
      healMul: 0.2,
      extraOnHit: 1,
      turnsLeft: n,
      clearAfterPlayerPhase: victimIsOnPlayerBoard,
      clearAfterEnemyPhase: !victimIsOnPlayerBoard,
    };
  }

  function clearPoisonAfterPlayerAttackPhase() {
    if (!battle) return;
    for (let i = 0; i < 4; i++) {
      const c = battle.playerBoard[i];
      if (!c || !c.poison || !c.poison.clearAfterPlayerPhase) continue;
      const left = (c.poison.turnsLeft != null ? c.poison.turnsLeft : 1) - 1;
      if (left <= 0) delete c.poison;
      else c.poison.turnsLeft = left;
    }
  }

  function clearPoisonAfterEnemyAttackPhase() {
    if (!battle) return;
    for (let i = 0; i < 4; i++) {
      const c = battle.enemyBoard[i];
      if (!c || !c.poison || !c.poison.clearAfterEnemyPhase) continue;
      const left = (c.poison.turnsLeft != null ? c.poison.turnsLeft : 1) - 1;
      if (left <= 0) delete c.poison;
      else c.poison.turnsLeft = left;
    }
  }

  let uidSeq = 1;

  function uid() {
    return "c" + uidSeq++;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function shuffleInPlace(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
  }

  function getChar(templateId) {
    return CARD_POOL[templateId];
  }

  /** 二级英雄：兼容 tier 为数字或字符串，避免误判为一级导致无法升级。 */
  function isTier2HeroDef(def) {
    return !!(def && def.type === "character" && Number(def.tier) === 2);
  }

  function playerBoardHasEmptySlot() {
    if (!battle) return false;
    for (let i = 0; i < 4; i++) {
      const c = battle.playerBoard[i];
      if (!c || c.hp <= 0) return true;
    }
    return false;
  }

  function playerBoardHasTier1ForUpgrade(upgradesFrom) {
    if (!battle || !upgradesFrom) return false;
    for (let i = 0; i < 4; i++) {
      const c = battle.playerBoard[i];
      if (c && c.hp > 0 && c.templateId === upgradesFrom) return true;
    }
    return false;
  }

  /** 当前对战回合内，手牌中该二级是否至少有一种合法操作（升级 / 下阵空位再上场）。 */
  function isTier2HandCardPlayable(h, def) {
    if (!battle || !def || !isTier2HeroDef(def)) return true;
    if (battle.phase !== "player") return true;
    const upCost = def.upgradeHolyWaterCost || 0;
    const hasEmpty = playerBoardHasEmptySlot();
    const hasMatch = playerBoardHasTier1ForUpgrade(def.upgradesFrom);
    const canAfford = battle.playerHolyWater >= upCost;
    if (h.recalledFromBoard) {
      if (hasEmpty) return true;
      if (hasMatch && canAfford) return true;
      return false;
    }
    return hasMatch && canAfford;
  }

  const TIER1_HERO_IDS = [
    "warrior",
    "mage",
    "assassin",
    "guardian",
    "ranger",
    "young_dragon",
    "priest",
  ];

  function deckHasTierOneHero(templateIds) {
    return templateIds.some((tid) => {
      const d = getChar(tid);
      return d && d.type === "character" && !d.tier;
    });
  }

  function tier2ForTier1Hero(t1) {
    const priestOrder = ["holy_priest", "dark_priest"];
    if (t1 === "priest") {
      for (const tid of priestOrder) {
        const d = CARD_POOL[tid];
        if (
          d &&
          d.type === "character" &&
          d.tier === 2 &&
          d.upgradesFrom === t1
        ) {
          return tid;
        }
      }
    }
    for (const tid of Object.keys(CARD_POOL)) {
      const d = CARD_POOL[tid];
      if (
        d &&
        d.type === "character" &&
        d.tier === 2 &&
        d.upgradesFrom === t1
      ) {
        return tid;
      }
    }
    return null;
  }

  /** 人机针对每种「玩家用过的一级英雄」：该概率下仍与玩家相同，否则换为另一随机一级。 */
  const ENEMY_MATCH_PLAYER_TIER1_CHANCE = 0.45;

  /**
   * 人机卡组：凡与玩家卡组中出现过的一级英雄，按概率保留与玩家一致；
   * 否则整副牌中该一级统一换成另一随机一级，二级英雄同步换绑。
   */
  function diversifyEnemyDeckTemplates(playerCarried) {
    const playerTier1Set = new Set();
    for (const tid of playerCarried) {
      const d = getChar(tid);
      if (d && d.type === "character" && !d.tier) playerTier1Set.add(tid);
    }
    const tier1Repl = {};
    for (const t1 of playerTier1Set) {
      if (Math.random() < ENEMY_MATCH_PLAYER_TIER1_CHANCE) {
        tier1Repl[t1] = t1;
        continue;
      }
      const prefer = TIER1_HERO_IDS.filter(
        (x) => x !== t1 && !playerTier1Set.has(x)
      );
      let alt;
      if (prefer.length) {
        alt = prefer[(Math.random() * prefer.length) | 0];
      } else {
        const rest = TIER1_HERO_IDS.filter((x) => x !== t1);
        alt = rest[(Math.random() * rest.length) | 0];
      }
      tier1Repl[t1] = alt;
    }
    return playerCarried.map((tid) => {
      const def = getChar(tid);
      if (!def) return tid;
      if (def.type === "character" && !def.tier) {
        return tier1Repl[tid] != null ? tier1Repl[tid] : tid;
      }
      if (def.type === "character" && def.tier === 2 && def.upgradesFrom) {
        const newT1 = tier1Repl[def.upgradesFrom];
        if (newT1 == null) return tid;
        const t2 = tier2ForTier1Hero(newT1);
        return t2 != null ? t2 : tid;
      }
      return tid;
    });
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function showScreen(id) {
    document.querySelectorAll(".screen").forEach((s) => {
      s.classList.toggle("active", s.id === id);
    });
    if (id !== "screen-battle") {
      const sur = document.getElementById("btn-surrender");
      if (sur) sur.disabled = true;
      closeSurrenderConfirm();
      closeBoardCardDetail();
    }
  }

  function pushLog(line) {
    if (!battle) return;
    battle.log.push(line);
  }

  /** 场上所有一级守卫（shareDamage）格下标，按列序。 */
  function findShareDamageWarriorSlots(board) {
    const slots = [];
    for (let i = 0; i < 4; i++) {
      const c = board[i];
      if (!c || c.hp <= 0) continue;
      const def = getChar(c.templateId);
      if (def.passive === "shareDamage") slots.push(i);
    }
    return slots.sort((a, b) => a - b);
  }

  /** 场上所有圆桌守卫（roundTableDamageReduction）格下标，按列序。 */
  function findRoundTableGuardianSlots(board) {
    const slots = [];
    for (let i = 0; i < 4; i++) {
      const c = board[i];
      if (!c || c.hp <= 0) continue;
      const def = getChar(c.templateId);
      if (def.passive === "roundTableDamageReduction") slots.push(i);
    }
    return slots.sort((a, b) => a - b);
  }

  /** 不含守卫格时，生命最低的第 k 名友方（用于与每名守卫一一配对）。 */
  function protectedSlotsForWarriors(board, warriorSlots) {
    const gSet = new Set(warriorSlots);
    const items = [];
    for (let i = 0; i < 4; i++) {
      if (gSet.has(i)) continue;
      const c = board[i];
      if (!c || c.hp <= 0) continue;
      items.push({ i, hp: c.hp });
    }
    items.sort((a, b) => a.hp - b.hp || a.i - b.i);
    return items.map((x) => x.i);
  }

  /**
   * 神箭手追击：按该箭命中格上的单位当前 hp/maxHp 判定；
   * 该格已空（被击倒）视为 0% 血线 →65%。
   */
  function divineArcherRepeatChanceFromTarget(foeBoard, lastHitSlot) {
    if (lastHitSlot == null || lastHitSlot < 0 || lastHitSlot > 3) return 0.4;
    const c = foeBoard[lastHitSlot];
    if (!c || c.hp <= 0) return 0.4;
    const r = c.hp / c.maxHp;
    return r > 0.5 ? 0.2 : 0.4;
  }

  /** 神箭手：基础 3 支单箭；每箭后判定是否 +1 支；总箭数上限防极端长链。 */
  const DIVINE_ARCHER_BASE_SHOTS = 3;
  const DIVINE_ARCHER_MAX_ARROWS_PER_ATTACK = 24;

  async function executeDivineArcherVolleyPlayer(slotIndex, tid, dmg) {
    const attacker = battle.playerBoard[slotIndex];
    if (!attacker || attacker.hp <= 0) return;
    let pending = DIVINE_ARCHER_BASE_SHOTS;
    let arrowsShot = 0;
    while (pending > 0 && arrowsShot < DIVINE_ARCHER_MAX_ARROWS_PER_ATTACK) {
      const living = livingEnemySlots();
      const valid = living.filter(
        (j) => battle.enemyBoard[j] && battle.enemyBoard[j].hp > 0
      );
      if (!valid.length) return;
      const j = valid[(Math.random() * valid.length) | 0];
      pending--;
      arrowsShot++;
      await delay(350);
      await playAttackVfx(tid, "player", slotIndex, "enemy", j, dmg);
      await dealDamageToEnemySlot(j, dmg);
      await removeDead(battle.enemyBoard, true);
      renderBattle();
      if (playerWinCondition()) return;

      const chaseP = divineArcherRepeatChanceFromTarget(battle.enemyBoard, j);
      if (Math.random() < chaseP) {
        const att = battle.playerBoard[slotIndex];
        if (!att || att.hp <= 0) return;
        pending++;
        pushLog(`「${att.name}」被动·连环：再射一箭！`);
        await delay(400);
      }
    }
  }

  async function executeDivineArcherVolleyEnemy(slotIndex, tid, dmg) {
    const attacker = battle.enemyBoard[slotIndex];
    if (!attacker || attacker.hp <= 0) return;
    let pending = DIVINE_ARCHER_BASE_SHOTS;
    let arrowsShot = 0;
    while (pending > 0 && arrowsShot < DIVINE_ARCHER_MAX_ARROWS_PER_ATTACK) {
      const living = livingPlayerSlots();
      const valid = living.filter(
        (j) => battle.playerBoard[j] && battle.playerBoard[j].hp > 0
      );
      if (!valid.length) return;
      const j = valid[(Math.random() * valid.length) | 0];
      pending--;
      arrowsShot++;
      await delay(350);
      await playAttackVfx(tid, "enemy", slotIndex, "player", j, dmg);
      await dealDamageToPlayerSlot(j, dmg);
      await removeDead(battle.playerBoard, false);
      renderBattle();
      if (enemyWinCondition()) return;

      const chaseP = divineArcherRepeatChanceFromTarget(battle.playerBoard, j);
      if (Math.random() < chaseP) {
        const att = battle.enemyBoard[slotIndex];
        if (!att || att.hp <= 0) return;
        pending++;
        pushLog(`敌方「${att.name}」被动·连环：再射一箭！`);
        await delay(400);
      }
    }
  }

  function rageDragonStrikeDamage(c, extraBonus) {
    if (!c || c.hp <= 0) return 0;
    const lost = Math.max(0, c.maxHp - c.hp);
    return Math.max(1, lost) + (extraBonus || 0);
  }

  const RAGE_DRAGON_FOLLOWUP_COST = 3;

  async function executeRageDragonStrikePlayer(slotIndex, tid, extra) {
    const def = getChar(tid);
    const rule = def.targetRule || "front_nearest_right";
    for (let hit = 0; hit < 2; hit++) {
      const att = battle.playerBoard[slotIndex];
      if (!att || att.hp <= 0) return;
      const target = pickTargetByRule(slotIndex, battle.enemyBoard, rule);
      if (target == null) return;
      const bonus = hit === 0 ? extra : 0;
      const dmg = rageDragonStrikeDamage(att, bonus);
      await delay(560);
      await playAttackVfx(tid, "player", slotIndex, "enemy", target, dmg);
      await dealDamageToEnemySlot(target, dmg);
      await removeDead(battle.enemyBoard, true);
      renderBattle();
      if (playerWinCondition()) return;
      const killed = !battle.enemyBoard[target];
      if (hit === 0) {
        if (killed && battle.playerHolyWater >= RAGE_DRAGON_FOLLOWUP_COST) {
          battle.playerHolyWater -= RAGE_DRAGON_FOLLOWUP_COST;
          pushLog(
            `「${att.name}」被动·血怒：再发动一次（消耗 ${RAGE_DRAGON_FOLLOWUP_COST} 圣水）。`
          );
          renderBattle();
          await delay(400);
          continue;
        }
        if (killed && battle.playerHolyWater < RAGE_DRAGON_FOLLOWUP_COST) {
          pushLog(
            `「${att.name}」击杀目标，但圣水不足 ${RAGE_DRAGON_FOLLOWUP_COST}，无法追击。`
          );
        }
      }
      return;
    }
  }

  async function executeRageDragonStrikeEnemy(slotIndex, tid, extra) {
    const def = getChar(tid);
    const rule = def.targetRule || "front_nearest_right";
    for (let hit = 0; hit < 2; hit++) {
      const att = battle.enemyBoard[slotIndex];
      if (!att || att.hp <= 0) return;
      const target = pickTargetByRule(slotIndex, battle.playerBoard, rule);
      if (target == null) return;
      const bonus = hit === 0 ? extra : 0;
      const dmg = rageDragonStrikeDamage(att, bonus);
      await delay(680);
      await playAttackVfx(tid, "enemy", slotIndex, "player", target, dmg);
      await dealDamageToPlayerSlot(target, dmg);
      await removeDead(battle.playerBoard, false);
      renderBattle();
      if (enemyWinCondition()) return;
      const killed = !battle.playerBoard[target];
      if (hit === 0) {
        if (killed && battle.enemyHolyWater >= RAGE_DRAGON_FOLLOWUP_COST) {
          battle.enemyHolyWater -= RAGE_DRAGON_FOLLOWUP_COST;
          pushLog(
            `敌方「${att.name}」被动·血怒：再发动一次（消耗 ${RAGE_DRAGON_FOLLOWUP_COST} 圣水）。`
          );
          renderBattle();
          await delay(400);
          continue;
        }
        if (killed && battle.enemyHolyWater < RAGE_DRAGON_FOLLOWUP_COST) {
          pushLog(`敌方「${att.name}」击杀目标，但圣水不足，无法追击。`);
        }
      }
      return;
    }
  }

  function pickTargetByRule(attackerSlot, targetBoard, rule) {
    const living = [];
    for (let j = 0; j < 4; j++) {
      if (targetBoard[j] && targetBoard[j].hp > 0) living.push(j);
    }
    if (!living.length) return null;

    if (rule === "lowest_hp") {
      let best = living[0];
      let bestHp = targetBoard[best].hp;
      for (const j of living) {
        const hp = targetBoard[j].hp;
        if (hp < bestHp || (hp === bestHp && j > best)) {
          best = j;
          bestHp = hp;
        }
      }
      return best;
    }

    if (rule === "highest_hp") {
      let best = living[0];
      let bestHp = targetBoard[best].hp;
      for (const j of living) {
        const hp = targetBoard[j].hp;
        if (hp > bestHp || (hp === bestHp && j > best)) {
          best = j;
          bestHp = hp;
        }
      }
      return best;
    }

    if (rule === "random_living_enemy") {
      return living[(Math.random() * living.length) | 0];
    }

    if (rule === "rightmost") {
      return Math.max(...living);
    }

    if (rule === "leftmost") {
      return Math.min(...living);
    }

    if (targetBoard[attackerSlot] && targetBoard[attackerSlot].hp > 0) {
      return attackerSlot;
    }
    let best = null;
    let bestD = 999;
    for (const j of living) {
      const d = Math.abs(j - attackerSlot);
      if (d < bestD || (d === bestD && j > best)) {
        bestD = d;
        best = j;
      }
    }
    return best;
  }

  function hpRatio(c) {
    if (!c || !c.maxHp) return 0;
    return c.hp / c.maxHp;
  }

  function assassinTier1TrueBonusFromTarget(target) {
    return hpRatio(target) >= 0.5 ? 2 : 0;
  }

  /** 取最高档：满血 7，>75% 为 5，>50% 为 3。 */
  function shadowAssassinTrueBonusFromTarget(target) {
    const r = hpRatio(target);
    if (r >= 1) return 7;
    if (r > 0.75) return 5;
    if (r > 0.5) return 3;
    return 0;
  }

  async function dealAssassinSingleHit(
    attackerSlot,
    tid,
    targetSlot,
    playerVictim,
    baseDmg
  ) {
    const fromSide = playerVictim ? "enemy" : "player";
    const toSide = playerVictim ? "player" : "enemy";
    const targetBoard = playerVictim ? battle.playerBoard : battle.enemyBoard;
    const t = targetBoard[targetSlot];
    if (!t || t.hp <= 0) return;
    let trueBonus = 0;
    if (tid === "assassin") trueBonus = assassinTier1TrueBonusFromTarget(t);
    else if (tid === "shadow_assassin")
      trueBonus = shadowAssassinTrueBonusFromTarget(t);

    await playAttackVfx(
      tid,
      fromSide,
      attackerSlot,
      toSide,
      targetSlot,
      baseDmg + trueBonus
    );
    if (playerVictim) {
      await dealDamageToPlayerSlot(targetSlot, baseDmg, false);
      await removeDead(battle.playerBoard, false);
      if (trueBonus > 0) {
        const t2 = battle.playerBoard[targetSlot];
        if (t2 && t2.hp > 0) {
          await dealDamageToPlayerSlot(targetSlot, trueBonus, true);
          await removeDead(battle.playerBoard, false);
        }
      }
    } else {
      await dealDamageToEnemySlot(targetSlot, baseDmg, false);
      await removeDead(battle.enemyBoard, true);
      if (trueBonus > 0) {
        const t2 = battle.enemyBoard[targetSlot];
        if (t2 && t2.hp > 0) {
          await dealDamageToEnemySlot(targetSlot, trueBonus, true);
          await removeDead(battle.enemyBoard, true);
        }
      }
    }
  }

  function livingEnemySlots() {
    const r = [];
    for (let j = 0; j < 4; j++) {
      if (battle.enemyBoard[j] && battle.enemyBoard[j].hp > 0) r.push(j);
    }
    return r;
  }

  function livingPlayerSlots() {
    const r = [];
    for (let j = 0; j < 4; j++) {
      if (battle.playerBoard[j] && battle.playerBoard[j].hp > 0) r.push(j);
    }
    return r;
  }

  /** 玩家场上当前生命最低的一列（用于人机铺场对准「正前方」残血）。 */
  function enemyPlayerLowestHpColumn() {
    let best = null;
    let bestHp = Infinity;
    for (let i = 0; i < 4; i++) {
      const c = battle.playerBoard[i];
      if (c && c.hp > 0 && c.hp < bestHp) {
        bestHp = c.hp;
        best = i;
      }
    }
    return best;
  }

  function pickBestEmptySlotForEnemy(lowestPlayerCol, emptySlots) {
    if (!emptySlots.length) return null;
    if (lowestPlayerCol == null) return emptySlots[0];
    let best = emptySlots[0];
    let bestD = Math.abs(best - lowestPlayerCol);
    for (const s of emptySlots) {
      const d = Math.abs(s - lowestPlayerCol);
      if (d < bestD || (d === bestD && s > best)) {
        best = s;
        bestD = d;
      }
    }
    return best;
  }

  function enemyCombatScoreFromDef(def) {
    return def.damage * 3 + def.hp;
  }

  function enemyCombatScoreFromBoard(c) {
    if (!c || c.hp <= 0) return -1e9;
    return c.damage * 3 + c.hp;
  }

  function pickTwoRandomDistinct(indices) {
    if (indices.length <= 1) return indices.slice();
    const a = indices.slice();
    shuffleInPlace(a);
    return [a[0], a[1]];
  }

  function attachHolyPriestReactiveFields(obj, templateId) {
    const d = getChar(templateId);
    if (d && d.passive === "holyPriestReactive") {
      obj.holyPriestReactiveLeft = 4;
    }
  }

  /** 牧师链治疗选位：若有当前生命≤5 的己方则优先（同档按绝对血量从低到高）；否则按 hp/maxHp 从低到高。 */
  const PRIEST_HEAL_PRIORITY_HP = 5;

  function pickLowestHpAllySlots(board, count) {
    const slots = [];
    for (let i = 0; i < 4; i++) {
      const c = board[i];
      if (!c || c.hp <= 0) continue;
      const ratio = c.maxHp > 0 ? c.hp / c.maxHp : 0;
      const crit = c.hp <= PRIEST_HEAL_PRIORITY_HP;
      slots.push({ i, hp: c.hp, ratio, crit });
    }
    slots.sort((a, b) => {
      if (a.crit !== b.crit) return a.crit ? -1 : 1;
      if (a.crit && b.crit) {
        if (a.hp !== b.hp) return a.hp - b.hp;
        return b.i - a.i;
      }
      if (a.ratio !== b.ratio) return a.ratio - b.ratio;
      if (a.hp !== b.hp) return a.hp - b.hp;
      return b.i - a.i;
    });
    const out = [];
    for (let k = 0; k < slots.length && out.length < count; k++) {
      out.push(slots[k].i);
    }
    return out;
  }

  function resetHolyPriestReactiveBoard(board) {
    for (let i = 0; i < 4; i++) {
      const c = board[i];
      if (!c || c.hp <= 0) continue;
      const def = getChar(c.templateId);
      if (def.passive === "holyPriestReactive") {
        c.holyPriestReactiveLeft = 4;
      }
    }
  }

  /** 回合开始时：黑暗牧师与对方场上当前生命最高者交换当前生命（己方已不低于对方则不换）。 */
  function applyDarkPriestTurnStart(isPlayerTurn) {
    if (!battle) return;
    const myBoard = isPlayerTurn ? battle.playerBoard : battle.enemyBoard;
    const oppBoard = isPlayerTurn ? battle.enemyBoard : battle.playerBoard;
    const myTag = isPlayerTurn ? "我方" : "敌方";
    const oppTag = isPlayerTurn ? "敌方" : "我方";
    for (let i = 0; i < 4; i++) {
      const c = myBoard[i];
      if (!c || c.hp <= 0) continue;
      const def = getChar(c.templateId);
      if (def.passive !== "darkPriestSwap") continue;
      let best = -1;
      let bestHp = -1;
      for (let j = 0; j < 4; j++) {
        const e = oppBoard[j];
        if (!e || e.hp <= 0) continue;
        if (e.hp > bestHp || (e.hp === bestHp && j > best)) {
          bestHp = e.hp;
          best = j;
        }
      }
      if (best < 0) continue;
      const enemy = oppBoard[best];
      if (c.hp >= enemy.hp) continue;
      const hpA = c.hp;
      const hpB = enemy.hp;
      c.hp = Math.min(c.maxHp, hpB);
      enemy.hp = Math.min(enemy.maxHp, hpA);
      pushLog(
        `${myTag}「${c.name}」命换：与${oppTag}「${enemy.name}」交换当前生命（${hpA}↔${hpB}）。`
      );
      renderBattle();
    }
  }

  async function holyPriestPassiveAfterDamage(board, affectedSlots) {
    const uniq = [];
    for (const s of affectedSlots) {
      if (uniq.indexOf(s) < 0) uniq.push(s);
    }
    for (const slot of uniq) {
      const victim = board[slot];
      if (!victim || victim.hp <= 0) continue;
      for (let p = 0; p < 4; p++) {
        const hp = board[p];
        if (!hp || hp.hp <= 0) continue;
        const def = getChar(hp.templateId);
        if (def.passive !== "holyPriestReactive") continue;
        if (hp.holyPriestReactiveLeft == null) hp.holyPriestReactiveLeft = 4;
        if (hp.holyPriestReactiveLeft <= 0) continue;
        hp.holyPriestReactiveLeft--;
        const hg = healGainAfterPoison(victim, 2);
        victim.hp = Math.min(victim.maxHp, victim.hp + hg);
        pushLog(
          `「${hp.name}」神圣灵光：「${victim.name}」回复 ${hg} 生命。`
        );
        renderBattle();
        await delay(200);
      }
    }
  }

  /** 圆桌守卫数量（1～4）→ 全队伤害减免比例。 */
  const ROUND_TABLE_DR_BY_COUNT = [0, 0.3, 0.5, 0.7, 0.9];

  /** @param {boolean} [trueDamage] 真实伤害：不吃圆桌护佑与一级守卫分担（如刺客被动追加）。 */
  function applyDamageWithShare(board, targetSlot, amount, victimIsPlayer, trueDamage) {
    const c = board[targetSlot];
    if (!c || c.hp <= 0) return [];

    let incoming = amount;
    if (c.poison && c.poison.extraOnHit && incoming > 0) {
      incoming += c.poison.extraOnHit;
    }

    let effectiveAmount = incoming;
    let rtCount = 0;

    if (!trueDamage) {
      rtCount = findRoundTableGuardianSlots(board).length;
      if (rtCount > 0 && incoming > 0) {
        const n = Math.min(rtCount, 4);
        const rate = ROUND_TABLE_DR_BY_COUNT[n];
        const mult = Math.max(0, 1 - rate);
        effectiveAmount = Math.floor(incoming * mult + 1e-9);
        if (effectiveAmount < 1) effectiveAmount = 1;
      }

      const warriorSlots = findShareDamageWarriorSlots(board);
      if (warriorSlots.length) {
        const protectedSlots = protectedSlotsForWarriors(board, warriorSlots);
        for (let k = 0; k < warriorSlots.length && k < protectedSlots.length; k++) {
          const gs = warriorSlots[k];
          const prot = protectedSlots[k];
          if (prot !== targetSlot || gs === targetSlot) continue;
          const half = (effectiveAmount / 2) | 0;
          const rest = effectiveAmount - half;
          board[gs].hp -= half;
          c.hp -= rest;
          const sName = board[gs].name;
          const tName = c.name;
          const rtNoteWar =
            rtCount > 0 && incoming !== effectiveAmount
              ? `（圆桌护佑 ${incoming}→${effectiveAmount}）`
              : "";
          pushLog(
            `「${sName}」为「${tName}」分担 ${half} 点伤害，实际受到 ${rest} 点${rtNoteWar}（剩余 ${Math.max(
              0,
              c.hp
            )}）。`
          );
          return [gs, targetSlot];
        }
      }
    }

    c.hp -= effectiveAmount;
    const trueNote = trueDamage ? "（真实伤害）" : "";
    const rtNote =
      !trueDamage && rtCount > 0 && incoming !== effectiveAmount
        ? `（圆桌护佑 ${incoming}→${effectiveAmount}）`
        : "";
    if (victimIsPlayer) {
      pushLog(
        `敌方对「${c.name}」造成 ${effectiveAmount} 点伤害${trueNote}${rtNote}（剩余 ${Math.max(
          0,
          c.hp
        )}）。`
      );
    } else {
      pushLog(
        `对敌方「${c.name}」造成 ${effectiveAmount} 点伤害${trueNote}${rtNote}（剩余 ${Math.max(
          0,
          c.hp
        )}）。`
      );
    }
    return [targetSlot];
  }

  let counterStrikeDepth = 0;

  async function processCounterStrikes(board, affectedSlots, victimIsPlayerBoard) {
    if (counterStrikeDepth >= 5) return;
    const uniq = [];
    for (const s of affectedSlots) {
      if (uniq.indexOf(s) < 0) uniq.push(s);
    }
    for (const slot of uniq) {
      const c = board[slot];
      if (!c || c.hp <= 0) continue;
      const def = getChar(c.templateId);
      if (def.passive !== "counterStrike") continue;

      const living = victimIsPlayerBoard ? livingEnemySlots() : livingPlayerSlots();
      if (!living.length) continue;

      counterStrikeDepth++;
      try {
        const target = living[(Math.random() * living.length) | 0];
        const fromSide = victimIsPlayerBoard ? "player" : "enemy";
        const toSide = victimIsPlayerBoard ? "enemy" : "player";
        const extra = c.bonusDamage || 0;
        c.bonusDamage = 0;
        const dmg = c.damage + extra;
        await delay(280);
        await playAttackVfx(c.templateId, fromSide, slot, toSide, target, dmg);
        pushLog(
          `「${c.name}」反击：随机命中「${
            victimIsPlayerBoard ? battle.enemyBoard[target].name : battle.playerBoard[target].name
          }」。`
        );
        if (victimIsPlayerBoard) {
          await dealDamageToEnemySlot(target, dmg);
        } else {
          await dealDamageToPlayerSlot(target, dmg);
        }
        await removeDead(battle.enemyBoard, true);
        await removeDead(battle.playerBoard, false);
        renderBattle();
        if (playerWinCondition()) return;
        if (enemyWinCondition()) return;
      } finally {
        counterStrikeDepth--;
      }
    }
  }

  function animPlayerSlot(slotIndex, className) {
    const elSlot = document.getElementById("player-slot-" + slotIndex);
    if (!elSlot) return;
    elSlot.classList.remove("anim-hit", "anim-enter", "anim-attack", "anim-effect");
    void elSlot.offsetWidth;
    elSlot.classList.add(className);
    setTimeout(() => elSlot.classList.remove(className), 620);
  }

  function animEnemySlot(slotIndex, className) {
    const elSlot = document.getElementById("enemy-slot-" + slotIndex);
    if (!elSlot) return;
    elSlot.classList.remove("anim-hit", "anim-enter", "anim-attack", "anim-effect");
    void elSlot.offsetWidth;
    elSlot.classList.add(className);
    setTimeout(() => elSlot.classList.remove(className), 620);
  }

  function hitFlash(toSide, toSlot) {
    if (toSide === "player") animPlayerSlot(toSlot, "anim-hit");
    else animEnemySlot(toSlot, "anim-hit");
  }

  function getFxLayer() {
    return document.getElementById("fx-layer");
  }

  /**
   * T1→T2 升级：约 2 秒全屏短片（assets/tier2-upgrade.mp4，由 scripts/gen_tier2_upgrade_video.sh 生成）+ CSS 叠加。
   */
  function playTier2UpgradeEffect(slotIndex, side, templateId) {
    const layer = getFxLayer();
    if (!layer) return;
    const slotId =
      side === "player" ? "player-slot-" + slotIndex : "enemy-slot-" + slotIndex;
    const slotEl = document.getElementById(slotId);
    let cx = window.innerWidth * 0.5;
    let cy = window.innerHeight * 0.42;
    if (slotEl) {
      const r = slotEl.getBoundingClientRect();
      cx = r.left + r.width / 2;
      cy = r.top + r.height / 2;
    }
    const tid =
      templateId && /^[a-z][a-z0-9_]*$/i.test(String(templateId))
        ? String(templateId)
        : "generic";
    const wrap = el("div", "fx-tier2-upgrade fx-tier2-upgrade--" + tid);
    wrap.setAttribute("aria-hidden", "true");
    wrap.dataset.tier2Id = tid;
    wrap.style.setProperty("--fx-x", cx + "px");
    wrap.style.setProperty("--fx-y", cy + "px");
    const vid = document.createElement("video");
    vid.className = "fx-tier2-upgrade-video";
    vid.src = "assets/tier2-upgrade.mp4";
    vid.muted = true;
    vid.setAttribute("playsinline", "");
    vid.setAttribute("webkit-playsinline", "");
    vid.setAttribute("aria-hidden", "true");
    const motif = el("div", "fx-tier2-upgrade-motif");
    const vignette = el("div", "fx-tier2-upgrade-vignette");
    const beams = el("div", "fx-tier2-upgrade-beams");
    const pulse = el("div", "fx-tier2-upgrade-pulse");
    const def = getChar(templateId);
    const label = el("div", "fx-tier2-upgrade-label");
    label.textContent = def ? "升级 · " + def.name : "升级";
    wrap.appendChild(vid);
    wrap.appendChild(motif);
    wrap.appendChild(vignette);
    wrap.appendChild(beams);
    wrap.appendChild(pulse);
    wrap.appendChild(label);
    layer.appendChild(wrap);
    vid.play().catch(function () {
      /* 自动播放被拦截时仍保留 CSS 层 */
    });
    playSfx("tier2UpgradeReveal");
    window.setTimeout(() => {
      wrap.remove();
    }, 2000);
  }

  /** 用于飞行动画的临时手牌 DOM（与场上手牌样式一致） */
  function buildVfxHandCard(h) {
    const def = getChar(h.templateId);
    const isT2 =
      def && def.type === "character" && Number(def.tier) === 2;
    const card = el(
      "div",
      "hand-card " +
        (def.type === "effect" ? "is-effect" : "is-character") +
        (isT2 ? " tier-2" : "")
    );
    card.dataset.tid = h.templateId;
    const thumb = el("div", "card-thumb");
    thumb.setAttribute("aria-hidden", "true");
    const hwCost = holyWaterCost(def);
    const recCost = recruitHolyWaterCost(def);
    if (hwCost > 0) {
      thumb.appendChild(el("span", "holy-water-badge", String(hwCost)));
    } else if (isT2 && def.upgradeHolyWaterCost > 0) {
      thumb.appendChild(
        el("span", "holy-water-badge", String(def.upgradeHolyWaterCost))
      );
    } else if (recCost > 0) {
      thumb.appendChild(el("span", "holy-water-badge", String(recCost)));
    }
    const text = el("div", "card-text");
    text.appendChild(el("div", "name", def.name));
    const meta = el("div", "meta");
    meta.textContent =
      def.type === "character"
        ? `生命 ${def.hp} · 伤害 ${def.damage}`
        : def.desc || "";
    text.appendChild(meta);
    card.appendChild(thumb);
    card.appendChild(text);
    return card;
  }

  function flyHandCardFromRectToRect(rStart, rEnd, h, flyOpts) {
    return new Promise((resolve) => {
      if (!rStart || rStart.width < 4 || !rEnd || rEnd.width < 4) {
        resolve();
        return;
      }
      const clone = buildVfxHandCard(h);
      clone.classList.add("fx-fly-deploy");
      clone.style.left = rStart.left + "px";
      clone.style.top = rStart.top + "px";
      clone.style.width = rStart.width + "px";
      clone.style.minHeight = rStart.height + "px";
      const layer = getFxLayer();
      (layer || document.body).appendChild(clone);

      const dx =
        rEnd.left +
        rEnd.width / 2 -
        (rStart.left + rStart.width / 2);
      const dy =
        rEnd.top +
        rEnd.height / 2 -
        (rStart.top + rStart.height / 2);

      const anim = clone.animate(
        [
          { transform: "translate(0,0) scale(1)" },
          {
            transform: `translate(${dx * 0.88}px,${dy * 0.88}px) scale(1.1)`,
            offset: 0.55,
          },
          {
            transform: `translate(${dx}px,${dy}px) scale(1)`,
            offset: 1,
          },
        ],
        { duration: 560, easing: "cubic-bezier(0.25, 0.86, 0.36, 1.2)" }
      );
      anim.onfinish = () => {
        clone.remove();
        const flyDef = h && h.templateId ? getChar(h.templateId) : null;
        if (flyOpts && flyOpts.tier2Upgrade) {
          /* 升级短片的音效由 tier2UpgradeReveal 统一播放 */
        } else if (flyDef && flyDef.tier === 2) {
          playSfx("tier2Entrance", h.templateId);
        } else {
          playSfx("cardLand");
        }
        resolve();
      };
    });
  }

  function flyHandCardToSlot(fromRect, side, slotIndex, h, flyOpts) {
    const sid =
      (side === "player" ? "player" : "enemy") + "-slot-" + slotIndex;
    const slotEl = document.getElementById(sid);
    if (!slotEl) return Promise.resolve();
    const toRect = slotEl.getBoundingClientRect();
    return flyHandCardFromRectToRect(fromRect, toRect, h, flyOpts);
  }

  function flyRectToPlayerHandDock(fromRect, handRect, prev) {
    return new Promise((resolve) => {
      if (!fromRect || !handRect || fromRect.width < 4) {
        resolve();
        return;
      }
      const h = { uid: "fx", templateId: prev.templateId };
      const clone = buildVfxHandCard(h);
      clone.classList.add("fx-fly-deploy");
      clone.style.left = fromRect.left + "px";
      clone.style.top = fromRect.top + "px";
      clone.style.width = fromRect.width + "px";
      clone.style.minHeight = fromRect.height + "px";
      const layer = getFxLayer();
      (layer || document.body).appendChild(clone);
      const endLeft =
        handRect.left + handRect.width / 2 - fromRect.width / 2;
      const endTop = handRect.bottom - fromRect.height - 6;
      const dx = endLeft - fromRect.left;
      const dy = endTop - fromRect.top;
      const anim = clone.animate(
        [
          { transform: "translate(0,0) scale(1)" },
          {
            transform: `translate(${dx * 0.88}px,${dy * 0.88}px) scale(0.95)`,
            offset: 0.55,
          },
          {
            transform: `translate(${dx}px,${dy}px) scale(0.82)`,
            offset: 1,
          },
        ],
        { duration: 540, easing: "cubic-bezier(0.25, 0.85, 0.35, 1.15)" }
      );
      anim.onfinish = () => {
        clone.remove();
        playSfx("cardLand");
        resolve();
      };
    });
  }

  function getPlayerHandCardRect(uidStr) {
    const node = document.querySelector(
      '[data-huid="' + String(uidStr).replace(/"/g, "") + '"]'
    );
    return node ? node.getBoundingClientRect() : null;
  }

  function getEnemyHandCardRect(uidStr) {
    const node = document.querySelector(
      '[data-ehuid="' + String(uidStr).replace(/"/g, "") + '"]'
    );
    return node ? node.getBoundingClientRect() : null;
  }


  function vfxImpactBurst(x, y) {
    const d = el("div", "fx-hit-burst");
    d.style.left = x + "px";
    d.style.top = y + "px";
    const layer = getFxLayer();
    if (layer) layer.appendChild(d);
    else document.body.appendChild(d);
    setTimeout(() => d.remove(), 560);
  }

  function vfxDamageFloat(x, y, amount) {
    const d = el("div", "fx-dmg");
    d.textContent = "-" + amount;
    d.style.left = x + "px";
    d.style.top = y + "px";
    const layer = getFxLayer();
    if (layer) layer.appendChild(d);
    else document.body.appendChild(d);
    setTimeout(() => d.remove(), 980);
  }

  function vfxSlotCracks(toSide, toSlot) {
    const slotEl = document.getElementById(
      `${toSide === "player" ? "player" : "enemy"}-slot-${toSlot}`
    );
    if (!slotEl) return;
    const overlay = el("div", "fx-slot-cracks");
    overlay.setAttribute("aria-hidden", "true");
    if (slotEl.firstChild) slotEl.insertBefore(overlay, slotEl.firstChild);
    else slotEl.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("fx-slot-cracks--show"));
    setTimeout(() => {
      if (overlay.parentNode) overlay.remove();
    }, 620);
  }

  function playHitImpact(toSide, toSlot, x2, y2, damageAmount) {
    hitFlash(toSide, toSlot);
    vfxSlotCracks(toSide, toSlot);
    vfxImpactBurst(x2, y2);
    if (damageAmount != null && damageAmount > 0) vfxDamageFloat(x2, y2, damageAmount);
    if (damageAmount != null && damageAmount > 0) playSfx("hit", damageAmount);
  }

  function vfxArrowLine(x1, y1, x2, y2) {
    return new Promise((resolve) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dist = Math.hypot(dx, dy) || 1;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const wrap = el("div", "fx-arrow-wrap");
      wrap.style.left = x1 + "px";
      wrap.style.top = y1 + "px";
      wrap.style.transform = "rotate(" + angle + "deg)";
      const bar = el("div", "fx-arrow-bar");
      bar.style.setProperty("--dist", dist + "px");
      wrap.appendChild(bar);
      const layer = getFxLayer();
      if (layer) layer.appendChild(wrap);
      else document.body.appendChild(wrap);
      requestAnimationFrame(() => bar.classList.add("fx-arrow-bar--fired"));
      setTimeout(() => {
        wrap.remove();
        resolve();
      }, 650);
    });
  }

  function vfxOrbFly(x1, y1, x2, y2) {
    return new Promise((resolve) => {
      const o = el("div", "fx-orb");
      o.style.left = x1 + "px";
      o.style.top = y1 + "px";
      o.style.setProperty("--tx", x2 - x1 + "px");
      o.style.setProperty("--ty", y2 - y1 + "px");
      const layer = getFxLayer();
      if (layer) layer.appendChild(o);
      else document.body.appendChild(o);
      requestAnimationFrame(() => o.classList.add("fx-orb--moving"));
      setTimeout(() => {
        o.remove();
        resolve();
      }, 720);
    });
  }

  function vfxWarriorCardLeap(r1, x1, y1, x2, y2) {
    return new Promise((resolve) => {
      const g = el("div", "fx-card-ghost");
      g.innerHTML = "<span class=\"fx-card-ghost-inner\">⚔</span>";
      const w = Math.min(r1.width - 8, 72);
      const h = Math.min(r1.height - 8, 96);
      g.style.left = x1 - w / 2 + "px";
      g.style.top = y1 - h / 2 + "px";
      g.style.width = w + "px";
      g.style.height = h + "px";
      g.style.setProperty("--tx", x2 - x1 + "px");
      g.style.setProperty("--ty", y2 - y1 + "px");
      const layer = getFxLayer();
      if (layer) layer.appendChild(g);
      else document.body.appendChild(g);
      requestAnimationFrame(() => g.classList.add("fx-card-ghost--leap"));
      setTimeout(() => {
        g.remove();
        resolve();
      }, 760);
    });
  }

  function vfxGuardianImpact(x2, y2) {
    return new Promise((resolve) => {
      const slam = el("div", "fx-guardian-slam");
      slam.style.left = x2 + "px";
      slam.style.top = y2 + "px";
      const layer = getFxLayer();
      if (layer) layer.appendChild(slam);
      else document.body.appendChild(slam);
      setTimeout(() => {
        slam.remove();
        resolve();
      }, 720);
    });
  }

  function vfxLightningStrikeInstant(x2, y2) {
    return new Promise((resolve) => {
      const d = el("div", "fx-lightning-strike");
      d.setAttribute("aria-hidden", "true");
      d.style.left = x2 + "px";
      d.style.top = y2 + "px";
      const layer = getFxLayer();
      if (layer) layer.appendChild(d);
      else document.body.appendChild(d);
      requestAnimationFrame(() => d.classList.add("fx-lightning-strike--hit"));
      setTimeout(() => {
        d.remove();
        resolve();
      }, 300);
    });
  }

  async function vfxLightningFromCenterToSlot(toSide, toSlot, damageAmount) {
    const toEl = document.getElementById(`${toSide === "player" ? "player" : "enemy"}-slot-${toSlot}`);
    if (!toEl) return;
    const r2 = toEl.getBoundingClientRect();
    const x2 = r2.left + r2.width / 2;
    const y2 = r2.top + r2.height / 2;
    await vfxLightningStrikeInstant(x2, y2);
    playHitImpact(toSide, toSlot, x2, y2, damageAmount);
    await delay(120);
  }

  async function playAttackVfx(templateId, fromSide, fromSlot, toSide, toSlot, damageAmount) {
    const fromEl = document.getElementById(`${fromSide === "player" ? "player" : "enemy"}-slot-${fromSlot}`);
    const toEl = document.getElementById(`${toSide === "player" ? "player" : "enemy"}-slot-${toSlot}`);
    if (!fromEl || !toEl) {
      await delay(500);
      return;
    }
    const r1 = fromEl.getBoundingClientRect();
    const r2 = toEl.getBoundingClientRect();
    const x1 = r1.left + r1.width / 2;
    const y1 = r1.top + r1.height / 2;
    const x2 = r2.left + r2.width / 2;
    const y2 = r2.top + r2.height / 2;

    if (fromSide === "player") animPlayerSlot(fromSlot, "anim-attack");
    else animEnemySlot(fromSlot, "anim-attack");

    if (templateId === "ranger" || templateId === "divine_archer")
      await vfxArrowLine(x1, y1, x2, y2);
    else if (
      templateId === "mage" ||
      templateId === "mirror_mage" ||
      templateId === "poison_witch" ||
      templateId === "poison_assassin" ||
      templateId === "assassin" ||
      templateId === "shadow_assassin"
    )
      await vfxOrbFly(x1, y1, x2, y2);
    else if (templateId === "guardian" || templateId === "berserker")
      await vfxGuardianImpact(x2, y2);
    else if (templateId === "rage_dragon" || templateId === "young_dragon")
      await vfxOrbFly(x1, y1, x2, y2);
    else if (
      templateId === "priest" ||
      templateId === "holy_priest" ||
      templateId === "dark_priest"
    )
      await vfxOrbFly(x1, y1, x2, y2);
    else await vfxWarriorCardLeap(r1, x1, y1, x2, y2);

    playHitImpact(toSide, toSlot, x2, y2, damageAmount);
    await delay(160);
  }

  async function playHealVfx(fromSide, fromSlot, toSide, toSlot) {
    const fromEl = document.getElementById(
      `${fromSide === "player" ? "player" : "enemy"}-slot-${fromSlot}`
    );
    const toEl = document.getElementById(
      `${toSide === "player" ? "player" : "enemy"}-slot-${toSlot}`
    );
    if (!fromEl || !toEl) {
      await delay(400);
      return;
    }
    const r1 = fromEl.getBoundingClientRect();
    const r2 = toEl.getBoundingClientRect();
    const x1 = r1.left + r1.width / 2;
    const y1 = r1.top + r1.height / 2;
    const x2 = r2.left + r2.width / 2;
    const y2 = r2.top + r2.height / 2;
    if (fromSide === "player") animPlayerSlot(fromSlot, "anim-attack");
    else animEnemySlot(fromSlot, "anim-attack");
    await vfxOrbFly(x1, y1, x2, y2);
    if (toSide === "player") animPlayerSlot(toSlot, "anim-effect");
    else animEnemySlot(toSlot, "anim-effect");
    playSfx("heal");
    await delay(160);
  }

  function effectFlyToCenter(h) {
    return new Promise((resolve) => {
      const uid = String(h.uid).replace(/"/g, "");
      const node = document.querySelector('[data-huid="' + uid + '"]');
      const enemyNode = document.querySelector('[data-ehuid="' + uid + '"]');
      let r = null;
      if (node) r = node.getBoundingClientRect();
      else if (enemyNode) r = enemyNode.getBoundingClientRect();
      if (!r || r.width < 4) {
        r = {
          left: window.innerWidth / 2 - 52,
          top: window.innerHeight / 2 - 74,
          width: 104,
          height: 148,
        };
      }
      const clone = buildVfxHandCard(h);
      clone.classList.add("fx-effect-v2-center");
      clone.style.left = r.left + "px";
      clone.style.top = r.top + "px";
      clone.style.width = r.width + "px";
      clone.style.minHeight = r.height + "px";
      clone.appendChild(el("div", "fx-effect-spark-rise"));
      const layer = getFxLayer();
      (layer || document.body).appendChild(clone);
      playSfx("effectCast");

      const cx = window.innerWidth / 2 - r.width / 2;
      const cy = window.innerHeight / 2 - r.height / 2;
      const dx = cx - r.left;
      const dy = cy - r.top;

      const anim = clone.animate(
        [
          {
            transform: "translate(0,0) scale(1) rotate(0deg)",
            opacity: 1,
          },
          {
            transform:
              "translate(" +
              dx * 0.55 +
              "px," +
              dy * 0.55 +
              "px) scale(1.1) rotate(-8deg)",
            opacity: 1,
            offset: 0.2,
          },
          {
            transform:
              "translate(" +
              dx +
              "px," +
              dy +
              "px) scale(1.2) rotate(-11deg)",
            opacity: 1,
            offset: 0.42,
          },
          {
            transform:
              "translate(" +
              dx +
              "px," +
              dy +
              "px) scale(1.2) rotate(-11deg)",
            opacity: 1,
            offset: 0.78,
          },
          {
            transform:
              "translate(" +
              dx +
              "px," +
              dy +
              "px) scale(1.2) rotate(-11deg)",
            opacity: 0,
            offset: 1,
          },
        ],
        { duration: 1180, easing: "cubic-bezier(0.22, 0.82, 0.2, 1)" }
      );
      anim.onfinish = () => {
        clone.remove();
        resolve();
      };
    });
  }

  let carried = [];
  let battle = null;
  let selectedHandUid = null;
  /** 已点选场上格、等待点击手牌栏确认下阵；null 表示未处于该流程 */
  let pendingRecallSlotIndex = null;
  let pendingEffect = null;
  let boardDetailSide = null;
  let boardDetailSlotIndex = null;

  function boardCardDetailCanOpen() {
    if (pendingEffect) return false;
    if (selectedHandUid) {
      const h = handByUid(selectedHandUid);
      if (h && getChar(h.templateId).type === "character") return false;
    }
    if (pendingRecallSlotIndex !== null) return false;
    return true;
  }

  function closeBoardCardDetail() {
    const ov = document.getElementById("board-card-detail");
    if (ov) ov.setAttribute("aria-hidden", "true");
    boardDetailSide = null;
    boardDetailSlotIndex = null;
  }

  function openBoardCardDetail(side, slotIndex) {
    if (!battle) return;
    const board = side === "player" ? battle.playerBoard : battle.enemyBoard;
    const c = board[slotIndex];
    if (!c || c.hp <= 0) return;
    const def = getChar(c.templateId);
    if (!def || def.type !== "character") return;

    boardDetailSide = side;
    boardDetailSlotIndex = slotIndex;

    const ov = document.getElementById("board-card-detail");
    const thumb = document.getElementById("board-card-detail-thumb");
    const nameEl = document.getElementById("board-card-detail-name");
    const tagsEl = document.getElementById("board-card-detail-tags");
    const statsEl = document.getElementById("board-card-detail-stats");
    const skillEl = document.getElementById("board-card-detail-skill");
    const passiveEl = document.getElementById("board-card-detail-passive");
    const extraEl = document.getElementById("board-card-detail-extra");
    const actionsEl = document.getElementById("board-card-detail-actions");
    if (
      !ov ||
      !thumb ||
      !nameEl ||
      !tagsEl ||
      !statsEl ||
      !skillEl ||
      !passiveEl ||
      !extraEl
    )
      return;

    thumb.className =
      "board-card-detail-thumb" + (Number(def.tier) === 2 ? " tier-2" : "");
    thumb.dataset.tid = c.templateId;

    nameEl.textContent = c.name;

    tagsEl.innerHTML = "";
    const tagBits = [];
    if (def.tier) {
      const sp = document.createElement("span");
      sp.className = "board-card-detail-tag";
      sp.textContent = "二级英雄";
      tagsEl.appendChild(sp);
    }
    const tr = TARGET_RULE_LABELS[def.targetRule] || def.targetRule;
    if (tr) {
      const sp = document.createElement("span");
      sp.className = "board-card-detail-tag";
      sp.textContent = tr;
      tagsEl.appendChild(sp);
    }

    const atk = (c.damage || 0) + (c.bonusDamage || 0);
    statsEl.innerHTML = "";
    statsEl.appendChild(
      el("div", "board-card-detail-stat-line", `攻击 ${atk}`)
    );
    statsEl.appendChild(
      el("div", "board-card-detail-stat-line", `生命 ${c.hp} / ${c.maxHp}`)
    );
    if (c.poison) {
      statsEl.appendChild(
        el(
          "div",
          "board-card-detail-stat-line board-card-detail-stat-line--poison",
          "中毒：治疗效力降低，受击额外伤害"
        )
      );
    }

    skillEl.innerHTML = "";
    if (def.skill) {
      skillEl.appendChild(el("div", "board-card-detail-label", "技能"));
      skillEl.appendChild(el("p", "board-card-detail-text", def.skill));
    }

    passiveEl.innerHTML = "";
    if (def.passiveDesc) {
      passiveEl.appendChild(el("div", "board-card-detail-label", "被动"));
      passiveEl.appendChild(el("p", "board-card-detail-text", def.passiveDesc));
    }

    extraEl.innerHTML = "";
    if (c.bonusDamage) {
      extraEl.appendChild(
        el(
          "div",
          "board-card-detail-extra-note",
          `下次攻击额外 ${c.bonusDamage} 点伤害`
        )
      );
    }

    const playerCanAct = battle.phase === "player" || battle.phase === "setup";
    const showRecall =
      side === "player" &&
      playerCanAct &&
      battle.phase !== "resolving" &&
      battle.phase !== "enemy_setup" &&
      battle.phase !== "coin" &&
      battle.phase !== "over" &&
      battle.phase !== "enemy";
    if (actionsEl) actionsEl.hidden = !showRecall;

    ov.setAttribute("aria-hidden", "false");
  }

  function handlePlayerSlotClick(slotIndex) {
    if (boardCardDetailCanOpen()) {
      openBoardCardDetail("player", slotIndex);
      return;
    }
    const canAct = battle && (battle.phase === "player" || battle.phase === "setup");
    if (!canAct) return;
    void placeOrSwapPlayer(slotIndex);
  }

  function handleEnemySlotClick(slotIndex) {
    if (pendingEffect && pendingEffect.type === "damage") {
      void applyPendingToEnemySlot(slotIndex);
      return;
    }
    if (boardCardDetailCanOpen()) openBoardCardDetail("enemy", slotIndex);
  }

  function makeDeck(templateIds) {
    return shuffle(
      templateIds.map((tid) => ({
        uid: uid(),
        templateId: tid,
      }))
    );
  }

  function drawCards(deck, hand, n) {
    for (let i = 0; i < n && deck.length; i++) {
      hand.push(deck.pop());
    }
  }

  /** 布阵可放置：一级英雄（非二级）。起手保证手牌里至少有一张。 */
  function isPlacableTier1HeroCard(h) {
    const d = getChar(h.templateId);
    return d && d.type === "character" && !d.tier;
  }

  /**
   * 若手牌中没有任何可上场的一级英雄，则从牌库换入一张一级英雄：
   * 优先用手牌中的效果牌交换，否则用手牌中的二级英雄交换。
   */
  function ensureAtLeastOneTier1HeroInHand(hand, deck) {
    if (hand.some(isPlacableTier1HeroCard)) return;

    let deckT1Idx = -1;
    for (let i = 0; i < deck.length; i++) {
      const d = getChar(deck[i].templateId);
      if (d && d.type === "character" && !d.tier) {
        deckT1Idx = i;
        break;
      }
    }
    if (deckT1Idx < 0) return;

    const handEffectIdx = hand.findIndex(
      (h) => getChar(h.templateId).type === "effect"
    );
    if (handEffectIdx >= 0) {
      const tmp = hand[handEffectIdx];
      hand[handEffectIdx] = deck[deckT1Idx];
      deck[deckT1Idx] = tmp;
      return;
    }

    const handTier2Idx = hand.findIndex((h) => {
      const d = getChar(h.templateId);
      return d && d.type === "character" && d.tier;
    });
    if (handTier2Idx < 0) return;
    const tmp = hand[handTier2Idx];
    hand[handTier2Idx] = deck[deckT1Idx];
    deck[deckT1Idx] = tmp;
  }

  function handByUid(uidStr) {
    return battle.playerHand.find((h) => h.uid === uidStr);
  }

  function removeHandCard(uidStr) {
    const i = battle.playerHand.findIndex((h) => h.uid === uidStr);
    if (i >= 0) battle.playerHand.splice(i, 1);
  }

  /** 从手牌上场时：若手牌实例带下过场的 hp，则保留；否则满血（人机/玩家共用） */
  function hpWhenPlacingFromHand(h, def) {
    const maxHp = def.hp;
    return typeof h.hp === "number" && h.hp > 0 ? Math.min(h.hp, maxHp) : maxHp;
  }

  async function removeDead(board, isEnemy) {
    if (!battle) return;
    board.forEach((c, i) => {
      if (c && c.hp <= 0) {
        pushLog(`${isEnemy ? "敌方" : "我方"}「${c.name}」被击败。`);
        if (isEnemy) battle.enemyDefeatCount++;
        else battle.playerDefeatCount++;
        board[i] = null;
      }
    });
  }

  async function dealDamageToEnemySlot(slotIndex, amount, trueDamage) {
    const affected = applyDamageWithShare(
      battle.enemyBoard,
      slotIndex,
      amount,
      false,
      trueDamage
    );
    await holyPriestPassiveAfterDamage(battle.enemyBoard, affected);
    await processCounterStrikes(battle.enemyBoard, affected, false);
  }

  async function dealDamageToPlayerSlot(slotIndex, amount, trueDamage) {
    const affected = applyDamageWithShare(
      battle.playerBoard,
      slotIndex,
      amount,
      true,
      trueDamage
    );
    await holyPriestPassiveAfterDamage(battle.playerBoard, affected);
    await processCounterStrikes(battle.playerBoard, affected, true);
  }

  function enemyWiped() {
    return !battle.enemyBoard.some((c) => c && c.hp > 0);
  }

  function playerWiped() {
    return !battle.playerBoard.some((c) => c && c.hp > 0);
  }

  function playerWinCondition() {
    return battle.enemyDefeatCount >= WIN_DEFEAT_COUNT || enemyWiped();
  }

  function enemyWinCondition() {
    return battle.playerDefeatCount >= WIN_DEFEAT_COUNT || playerWiped();
  }

  async function executePriestFamilyAttackPlayer(attSlot, tid) {
    const board = battle.playerBoard;
    const att = board[attSlot];
    if (!att || att.hp <= 0) return;

    if (tid === "priest") {
      const targets = pickLowestHpAllySlots(board, 1);
      if (!targets.length) return;
      const t = targets[0];
      const ally = board[t];
      await playHealVfx("player", attSlot, "player", t);
      const g3 = healGainAfterPoison(ally, 3);
      ally.hp = Math.min(ally.maxHp, ally.hp + g3);
      pushLog(`「${att.name}」：「${ally.name}」回复 ${g3} 生命。`);
      renderBattle();
      await delay(200);
      return;
    }

    if (tid === "holy_priest") {
      const targets = pickLowestHpAllySlots(board, 2);
      const uniq = [];
      for (const t of targets) {
        if (uniq.indexOf(t) < 0) uniq.push(t);
      }
      for (const t of uniq) {
        const ally = board[t];
        if (!ally || ally.hp <= 0) continue;
        await playHealVfx("player", attSlot, "player", t);
        const g6 = healGainAfterPoison(ally, 6);
        ally.hp = Math.min(ally.maxHp, ally.hp + g6);
        pushLog(`「${att.name}」：「${ally.name}」回复 ${g6} 生命。`);
        renderBattle();
        await delay(200);
      }
      return;
    }

    if (tid === "dark_priest") {
      const foes = livingEnemySlots();
      if (foes.length) {
        const j = foes[(Math.random() * foes.length) | 0];
        await playAttackVfx(tid, "player", attSlot, "enemy", j, 5);
        await dealDamageToEnemySlot(j, 5);
        await removeDead(battle.enemyBoard, true);
        renderBattle();
        if (playerWinCondition()) return;
      }
      const allies = pickLowestHpAllySlots(board, 1);
      if (!allies.length) return;
      const t = allies[0];
      const ally = board[t];
      await playHealVfx("player", attSlot, "player", t);
      const g5 = healGainAfterPoison(ally, 5);
      ally.hp = Math.min(ally.maxHp, ally.hp + g5);
      pushLog(`「${att.name}」：「${ally.name}」回复 ${g5} 生命。`);
      renderBattle();
      await delay(200);
    }
  }

  async function executePriestFamilyAttackEnemy(attSlot, tid) {
    const board = battle.enemyBoard;
    const att = board[attSlot];
    if (!att || att.hp <= 0) return;

    if (tid === "priest") {
      const targets = pickLowestHpAllySlots(board, 1);
      if (!targets.length) return;
      const t = targets[0];
      const ally = board[t];
      await playHealVfx("enemy", attSlot, "enemy", t);
      const eg3 = healGainAfterPoison(ally, 3);
      ally.hp = Math.min(ally.maxHp, ally.hp + eg3);
      pushLog(`敌方「${att.name}」：「${ally.name}」回复 ${eg3} 生命。`);
      renderBattle();
      await delay(200);
      return;
    }

    if (tid === "holy_priest") {
      const targets = pickLowestHpAllySlots(board, 2);
      const uniq = [];
      for (const t of targets) {
        if (uniq.indexOf(t) < 0) uniq.push(t);
      }
      for (const t of uniq) {
        const ally = board[t];
        if (!ally || ally.hp <= 0) continue;
        await playHealVfx("enemy", attSlot, "enemy", t);
        const eg6 = healGainAfterPoison(ally, 6);
        ally.hp = Math.min(ally.maxHp, ally.hp + eg6);
        pushLog(`敌方「${att.name}」：「${ally.name}」回复 ${eg6} 生命。`);
        renderBattle();
        await delay(200);
      }
      return;
    }

    if (tid === "dark_priest") {
      const foes = livingPlayerSlots();
      if (foes.length) {
        const j = foes[(Math.random() * foes.length) | 0];
        await playAttackVfx(tid, "enemy", attSlot, "player", j, 5);
        await dealDamageToPlayerSlot(j, 5);
        await removeDead(battle.playerBoard, false);
        renderBattle();
        if (enemyWinCondition()) return;
      }
      const allies = pickLowestHpAllySlots(board, 1);
      if (!allies.length) return;
      const t = allies[0];
      const ally = board[t];
      await playHealVfx("enemy", attSlot, "enemy", t);
      const eg5 = healGainAfterPoison(ally, 5);
      ally.hp = Math.min(ally.maxHp, ally.hp + eg5);
      pushLog(`敌方「${att.name}」：「${ally.name}」回复 ${eg5} 生命。`);
      renderBattle();
      await delay(200);
    }
  }

  /**
   * 单格普攻结算（我方 / 敌方共用）。
   * @param {boolean} attackerIsPlayer true：我方攻击敌方
   */
  async function resolveOneAttackerSlotAttack(i, attackerIsPlayer) {
    const ab = attackerIsPlayer ? battle.playerBoard : battle.enemyBoard;
    const fb = attackerIsPlayer ? battle.enemyBoard : battle.playerBoard;
    const leadDelay = attackerIsPlayer ? 560 : 680;
    const volleyDelay = 350;
    const rangerChance = attackerIsPlayer ? 0.5 : 0.3;
    const fromSide = attackerIsPlayer ? "player" : "enemy";
    const toSide = attackerIsPlayer ? "enemy" : "player";
    const livingFoes = attackerIsPlayer ? livingEnemySlots : livingPlayerSlots;
    const win = attackerIsPlayer ? playerWinCondition : enemyWinCondition;

    async function dealToFoe(slot, amt) {
      if (attackerIsPlayer) await dealDamageToEnemySlot(slot, amt);
      else await dealDamageToPlayerSlot(slot, amt);
    }

    async function removeDeadFoes() {
      if (attackerIsPlayer) await removeDead(battle.enemyBoard, true);
      else await removeDead(battle.playerBoard, false);
    }

    let c = ab[i];
    if (!c || c.hp <= 0) return;
    const def = getChar(c.templateId);
    const tid = c.templateId;
    const rule = def.targetRule || "front_nearest_right";
    const extra = c.bonusDamage || 0;
    c.bonusDamage = 0;
    const dmg = c.damage + extra;

    if (tid === "divine_archer" && rule === "three_random") {
      await delay(leadDelay);
      if (attackerIsPlayer) await executeDivineArcherVolleyPlayer(i, tid, dmg);
      else await executeDivineArcherVolleyEnemy(i, tid, dmg);
      return;
    }

    if (tid === "rage_dragon" && def.passive === "rageDragon") {
      await delay(leadDelay);
      if (attackerIsPlayer) await executeRageDragonStrikePlayer(i, tid, extra);
      else await executeRageDragonStrikeEnemy(i, tid, extra);
      return;
    }

    if (
      tid === "priest" ||
      tid === "holy_priest" ||
      tid === "dark_priest"
    ) {
      await delay(leadDelay);
      if (attackerIsPlayer) await executePriestFamilyAttackPlayer(i, tid);
      else await executePriestFamilyAttackEnemy(i, tid);
      return;
    }

    c = ab[i];
    if (!c || c.hp <= 0) return;

    await delay(leadDelay);
    if (tid === "poison_witch") {
      const j = pickTargetByRule(i, fb, "random_living_enemy");
      if (j != null) {
        await delay(volleyDelay);
        await playAttackVfx(tid, fromSide, i, toSide, j, dmg);
        if (attackerIsPlayer) {
          await dealDamageToEnemySlot(j, dmg, true);
          const v = battle.enemyBoard[j];
          if (v && v.hp > 0) applyPoisonDebuff(v, false, 1);
        } else {
          await dealDamageToPlayerSlot(j, dmg, true);
          const v = battle.playerBoard[j];
          if (v && v.hp > 0) applyPoisonDebuff(v, true, 1);
        }
        await removeDeadFoes();
        renderBattle();
        if (win()) return;
      }
    } else if (tid === "poison_assassin") {
      const target = pickTargetByRule(i, fb, rule);
      if (target != null) {
        await playAttackVfx(tid, fromSide, i, toSide, target, dmg);
        await dealToFoe(target, dmg);
        const v = fb[target];
        if (v && v.hp > 0) applyPoisonDebuff(v, !attackerIsPlayer, 2);
        await removeDeadFoes();
        renderBattle();
        if (win()) return;
      }
    } else if (rule === "all_enemies") {
      const living = livingFoes();
      let totalDamage = 0;
      let rampIdx = 0;
      for (let k = 0; k < living.length; k++) {
        const j = living[k];
        if (!fb[j] || fb[j].hp <= 0) continue;
        const hitDmg = tid === "berserker" ? dmg + rampIdx : dmg;
        rampIdx++;
        await delay(volleyDelay);
        await playAttackVfx(tid, fromSide, i, toSide, j, hitDmg);
        await dealToFoe(j, hitDmg);
        totalDamage += hitDmg;
        await removeDeadFoes();
        renderBattle();
        if (win()) return;
      }
          if (def.passive === "lifesteal30" && totalDamage > 0) {
            const healRaw = (totalDamage * 0.3) | 0;
            if (healRaw > 0) {
              c = ab[i];
              if (c && c.hp > 0) {
                const heal = healGainAfterPoison(c, healRaw);
                c.hp = Math.min(c.maxHp, c.hp + heal);
                if (attackerIsPlayer)
                  pushLog(`「${c.name}」嗜血回复 ${heal} 生命。`);
                else pushLog(`敌方「${c.name}」嗜血回复 ${heal} 生命。`);
                renderBattle();
              }
            }
          }
    } else if (rule === "ranger_random") {
      const attName = ab[i] && ab[i].name;
      const bonusShot = Math.random() < rangerChance;
      for (let shot = 0; shot < 2; shot++) {
        if (shot === 1 && !bonusShot) break;
        if (shot === 1 && attName) {
          pushLog(
            attackerIsPlayer
              ? `「${attName}」连射：再射一箭！`
              : `敌方「${attName}」连射：再射一箭！`
          );
          renderBattle();
          await delay(280);
        }
        const living = livingFoes();
        if (!living.length) break;
        const j = living[(Math.random() * living.length) | 0];
        await delay(volleyDelay);
        await playAttackVfx(tid, fromSide, i, toSide, j, dmg);
        await dealToFoe(j, dmg);
        await removeDeadFoes();
        renderBattle();
        if (win()) return;
      }
    } else if (tid === "assassin" || tid === "shadow_assassin") {
      const target = pickTargetByRule(i, fb, rule);
      if (target != null) {
        await dealAssassinSingleHit(i, tid, target, !attackerIsPlayer, dmg);
        renderBattle();
        if (win()) return;
      }
    } else {
      const target = pickTargetByRule(i, fb, rule);
      if (target != null) {
        await playAttackVfx(tid, fromSide, i, toSide, target, dmg);
        await dealToFoe(target, dmg);
        await removeDeadFoes();
        renderBattle();
        if (win()) return;
      }
    }

    if (tid === "young_dragon" && def.passive === "youngDragonHw") {
      const att = ab[i];
      if (att && att.hp > 0) {
        if (attackerIsPlayer) {
          battle.playerHolyWater = Math.min(
            HOLY_WATER_MAX,
            battle.playerHolyWater + 1
          );
          pushLog(`「${att.name}」幼龙：获得 1 圣水。`);
        } else {
          battle.enemyHolyWater = Math.min(
            HOLY_WATER_MAX,
            battle.enemyHolyWater + 1
          );
          pushLog(`敌方「${att.name}」幼龙：获得 1 圣水。`);
        }
        renderBattle();
      }
    }
  }

  async function resolvePlayerAttacksAnimated() {
    for (let i = 0; i < 4; i++) {
      await resolveOneAttackerSlotAttack(i, true);
    }
    clearPoisonAfterPlayerAttackPhase();
  }

  async function resolveEnemyAttacksAnimated() {
    for (let i = 0; i < 4; i++) {
      await resolveOneAttackerSlotAttack(i, false);
    }
    clearPoisonAfterEnemyAttackPhase();
  }

  function endGame(won, options) {
    const surrender = options && options.surrender;
    battle.phase = "over";
    playSfx(won ? "fanfareWin" : "fanfareLose");
    showScreen("screen-over");
    document.getElementById("over-title").textContent = won ? "胜利" : "失败";
    const reachedEnemyGoal = battle.enemyDefeatCount >= WIN_DEFEAT_COUNT;
    const empty = enemyWiped();
    const reachedPlayerGoal = battle.playerDefeatCount >= WIN_DEFEAT_COUNT;
    const pEmpty = playerWiped();
    let msg;
    if (won) {
      msg =
        `击败次数 ${battle.enemyDefeatCount}/${WIN_DEFEAT_COUNT}` +
        (reachedEnemyGoal ? ` · 已达成${WIN_DEFEAT_COUNT}次击败` : "") +
        (empty ? " · 敌方场上已清空" : "");
    } else if (surrender) {
      msg = "你选择投降。";
    } else {
      msg =
        `我方被击败 ${battle.playerDefeatCount}/${WIN_DEFEAT_COUNT}` +
        (reachedPlayerGoal ? ` · 已达成${WIN_DEFEAT_COUNT}次击败` : "") +
        (pEmpty ? " · 我方场上已清空" : "");
    }
    document.getElementById("over-msg").textContent = msg;
  }

  function renderDeckBuilder() {
    const pool = document.getElementById("pool-grid");
    const list = document.getElementById("carried-list");
    const countEl = document.getElementById("deck-count");
    const btnStart = document.getElementById("btn-start-battle");
    pool.innerHTML = "";
    list.innerHTML = "";

    countEl.textContent = String(carried.length);
    const canStart =
      carried.length === 20 && deckHasTierOneHero(carried);
    btnStart.disabled = !canStart;
    const hintEl = document.getElementById("deck-hint");
    if (hintEl) {
      if (carried.length === 20 && !deckHasTierOneHero(carried)) {
        hintEl.textContent =
          "需至少包含一张一级英雄卡（如守卫、法师、刺客、战士、游侠、幼龙、牧师等）。";
        hintEl.classList.add("deck-hint--warn");
      } else {
        hintEl.textContent = "";
        hintEl.classList.remove("deck-hint--warn");
      }
    }

    POOL_ORDER.forEach((tid) => {
      const def = CARD_POOL[tid];
      const card = el(
        "button",
        "pool-card " +
          (def.type === "character" ? "character" : "effect") +
          (def.tier === 2 ? " tier-2" : "")
      );
      card.type = "button";
      card.dataset.tid = tid;
      const thumb = el("div", "card-thumb");
      thumb.setAttribute("aria-hidden", "true");
      const hw = holyWaterCost(def);
      const recPool = recruitHolyWaterCost(def);
      if (hw > 0) {
        thumb.appendChild(el("span", "holy-water-badge", String(hw)));
      } else if (def.tier === 2 && def.upgradeHolyWaterCost > 0) {
        thumb.appendChild(el("span", "holy-water-badge", String(def.upgradeHolyWaterCost)));
      } else if (recPool > 0) {
        thumb.appendChild(el("span", "holy-water-badge", String(recPool)));
      }
      const text = el("div", "card-text");
      const name = el("div", "name", def.name);
      const meta = el("div", "meta");
      if (def.type === "character") {
        const tag = TARGET_RULE_LABELS[def.targetRule] || def.targetRule || "";
        let line = `生命 ${def.hp} · 伤害 ${def.damage} · ${tag}`;
        if (def.passiveDesc) line += ` · ${def.passiveDesc}`;
        if (def.tier === 2)
          line += ` · 二级（需场上一级对应英雄+${def.upgradeHolyWaterCost || 0}圣水升级）`;
        else if (recPool > 0) line += ` · 对战上场${recPool}圣水`;
        meta.textContent = line;
      } else {
        meta.textContent = def.desc;
      }
      text.appendChild(name);
      text.appendChild(meta);
      card.appendChild(thumb);
      card.appendChild(text);
      card.addEventListener("click", () => {
        if (carried.length >= 20) return;
        playSfx("deckAdd");
        carried.push(tid);
        renderDeckBuilder();
      });
      pool.appendChild(card);
    });

    carried.forEach((tid, idx) => {
      const def = CARD_POOL[tid];
      const row = el("span", "chip");
      row.appendChild(document.createTextNode(def.name));
      const rm = el("button", "remove", "×");
      rm.addEventListener("click", () => {
        carried.splice(idx, 1);
        renderDeckBuilder();
      });
      row.appendChild(rm);
      list.appendChild(row);
    });
  }

  function initBattle() {
    closeBoardCardDetail();
    const playerDeck = makeDeck(carried);
    const enemyDeck = makeDeck(diversifyEnemyDeckTemplates(carried));
    const playerHand = [];
    const enemyHand = [];
    drawCards(playerDeck, playerHand, 5);
    drawCards(enemyDeck, enemyHand, 5);
    ensureAtLeastOneTier1HeroInHand(playerHand, playerDeck);
    ensureAtLeastOneTier1HeroInHand(enemyHand, enemyDeck);

    battle = {
      phase: "setup",
      playerDeck,
      enemyDeck,
      playerHand,
      enemyHand,
      playerBoard: [null, null, null, null],
      enemyBoard: [null, null, null, null],
      playerDiscard: [],
      enemyDiscard: [],
      log: ["对局开始。请完成己方布阵（仅可将角色牌放置上场）。"],
      enemyDefeatCount: 0,
      playerDefeatCount: 0,
      skipEnemyNext: false,
      skipPlayerNext: false,
      firstPlayer: "player",
      playerHolyWater: 0,
      enemyHolyWater: 0,
      turnCount: 0,
    };
    selectedHandUid = null;
    pendingRecallSlotIndex = null;
    pendingEffect = null;
    renderBattle();
    playSfx("battleStart");
  }

  async function runCoinFlip() {
    battle.phase = "coin";
    renderBattle();
    const overlay = document.getElementById("coin-overlay");
    const line1 = document.getElementById("coin-line1");
    const line2 = document.getElementById("coin-line2");
    overlay.setAttribute("aria-hidden", "false");
    line1.textContent = "掷硬币中…";
    line2.textContent = "";
    await delay(900);
    const playerFirst = Math.random() < 0.5;
    playSfx("coin");
    battle.firstPlayer = playerFirst ? "player" : "enemy";
    line1.textContent = playerFirst ? "你获得先手" : "敌方先手";
    line2.textContent = playerFirst ? "进入你的回合" : "敌方先行动";
    await delay(1400);
    overlay.setAttribute("aria-hidden", "true");
    if (playerFirst) {
      battle.phase = "player";
      gainHolyWater("player");
      resetHolyPriestReactiveBoard(battle.playerBoard);
      applyDarkPriestTurnStart(true);
      pushLog("你为先手。");
    } else {
      battle.phase = "enemy";
      pushLog("敌方先手。");
      renderBattle();
      await runEnemyTurn();
    }
    renderBattle();
  }

  async function runEnemySetup() {
    battle.phase = "enemy_setup";
    renderBattle();
    await delay(600);
    const handChars = battle.enemyHand
      .map((h) => ({ h, def: getChar(h.templateId) }))
      .filter((x) => x.def.type === "character" && !x.def.tier);
    handChars.sort(
      (a, b) => enemyCombatScoreFromDef(b.def) - enemyCombatScoreFromDef(a.def)
    );

    const lowCol = enemyPlayerLowestHpColumn();
    let ci = 0;
    while (ci < handChars.length) {
      const empty = [];
      for (let i = 0; i < 4; i++) {
        if (!battle.enemyBoard[i] || battle.enemyBoard[i].hp <= 0) empty.push(i);
      }
      if (!empty.length) break;
      const slot = pickBestEmptySlotForEnemy(lowCol, empty);
      const pick = handChars[ci].h;
      ci++;
      const def = getChar(pick.templateId);
      const hi = battle.enemyHand.indexOf(pick);
      if (hi < 0) continue;
      renderBattle();
      const rect = getEnemyHandCardRect(pick.uid);
      if (rect) await flyHandCardToSlot(rect, "enemy", slot, pick);
      else await delay(380);
      battle.enemyHand.splice(hi, 1);
      const hpP = hpWhenPlacingFromHand(pick, def);
      const placed = {
        templateId: pick.templateId,
        name: def.name,
        hp: hpP,
        maxHp: def.hp,
        damage: def.damage,
        bonusDamage: 0,
      };
      attachHolyPriestReactiveFields(placed, pick.templateId);
      battle.enemyBoard[slot] = placed;
      pushLog(`人机在格 ${slot + 1} 放置「${def.name}」。`);
      renderBattle();
    }
    await enemyTryRepositionIfBeneficial();
    pushLog("人机完成布阵。");
    await runCoinFlip();
  }

  function confirmSetup() {
    if (!battle || battle.phase !== "setup") return;
    pendingRecallSlotIndex = null;
    playSfx("paper");
    pushLog("我方布阵完成。");
    battle.phase = "enemy_setup";
    renderBattle();
    void runEnemySetup();
  }

  async function confirmPlayerTurn() {
    if (!battle || battle.phase !== "player") return;
    pendingRecallSlotIndex = null;
    playSfx("turnEnd");
    battle.phase = "resolving";
    renderBattle();
    await resolvePlayerAttacksAnimated();
    await removeDead(battle.enemyBoard, true);
    await removeDead(battle.playerBoard, false);
    renderBattle();
    if (enemyWinCondition()) {
      endGame(false);
      return;
    }
    if (playerWinCondition()) {
      endGame(true);
      return;
    }
    renderBattle();
    battle.phase = "enemy";
    renderBattle();
    await delay(400);
    await runEnemyTurn();
  }

  async function tryEnemySwapIfBeneficial() {
    await delay(500);
    const empty = [];
    for (let i = 0; i < 4; i++) {
      if (!battle.enemyBoard[i] || battle.enemyBoard[i].hp <= 0) empty.push(i);
    }
    if (empty.length) return;

    const chars = battle.enemyHand.filter((h) => {
      const d = getChar(h.templateId);
      return d.type === "character" && !d.tier;
    });
    if (!chars.length) return;

    let bestHand = null;
    let bestHS = -1;
    for (const h of chars) {
      const def = getChar(h.templateId);
      const s = enemyCombatScoreFromDef(def);
      if (s > bestHS) {
        bestHS = s;
        bestHand = h;
      }
    }
    if (!bestHand) return;

    let worstSlot = -1;
    let worstS = Infinity;
    for (let i = 0; i < 4; i++) {
      const c = battle.enemyBoard[i];
      if (!c || c.hp <= 0) continue;
      const s = enemyCombatScoreFromBoard(c);
      if (s < worstS) {
        worstS = s;
        worstSlot = i;
      }
    }
    if (worstSlot < 0) return;

    const worst = battle.enemyBoard[worstSlot];
    const defNew = getChar(bestHand.templateId);
    const newS = enemyCombatScoreFromDef(defNew);
    const ratio = worst.hp / worst.maxHp;
    const improved = newS > worstS + 3;
    const injuredReplace = ratio <= 0.32 && defNew.hp >= worst.hp;
    if (!improved && !injuredReplace) return;

    const rwNew = recruitHolyWaterCost(defNew);
    if (rwNew > 0 && battle.enemyHolyWater < rwNew) return;

    const hi = battle.enemyHand.indexOf(bestHand);
    if (hi < 0) return;
    renderBattle();
    const rectSwap = getEnemyHandCardRect(bestHand.uid);
    if (rectSwap) await flyHandCardToSlot(rectSwap, "enemy", worstSlot, bestHand);
    else await delay(320);
    battle.enemyHand.splice(hi, 1);
    if (rwNew > 0) battle.enemyHolyWater -= rwNew;
    const hpFromHand = hpWhenPlacingFromHand(bestHand, defNew);
    const repl = {
      templateId: bestHand.templateId,
      name: defNew.name,
      hp: hpFromHand,
      maxHp: defNew.hp,
      damage: defNew.damage,
      bonusDamage: 0,
    };
    attachHolyPriestReactiveFields(repl, bestHand.templateId);
    battle.enemyBoard[worstSlot] = repl;
    battle.enemyHand.push({
      uid: uid(),
      templateId: worst.templateId,
      hp: worst.hp,
      maxHp: worst.maxHp,
    });
    pushLog(
      `人机：换下「${worst.name}」（${worst.hp}/${worst.maxHp}），换上「${defNew.name}」（${hpFromHand}/${defNew.hp}）。`
    );
    renderBattle();
    if (!rectSwap) animEnemySlot(worstSlot, "anim-enter");
  }

  /** 与玩家「待下阵」换位/移空位对称：在有利时调整己方站位（对准玩家残血列） */
  async function enemyTryRepositionIfBeneficial() {
    await delay(450);
    const lowCol = enemyPlayerLowestHpColumn();
    if (lowCol == null) return;

    function slotValue(slotIndex, c) {
      if (!c || c.hp <= 0) return 0;
      const dist = Math.abs(slotIndex - lowCol);
      const face = 1 / (1 + dist * 0.35);
      return enemyCombatScoreFromBoard(c) * face;
    }

    function boardScore() {
      let s = 0;
      for (let i = 0; i < 4; i++) {
        s += slotValue(i, battle.enemyBoard[i]);
      }
      return s;
    }

    const base = boardScore();
    const MIN_GAIN = 2;

    let bestGain = -Infinity;
    let bestOp = null;

    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        const a = battle.enemyBoard[i];
        const b = battle.enemyBoard[j];
        if (!a || !b || a.hp <= 0 || b.hp <= 0) continue;
        battle.enemyBoard[i] = b;
        battle.enemyBoard[j] = a;
        const g = boardScore() - base;
        battle.enemyBoard[i] = a;
        battle.enemyBoard[j] = b;
        if (g > bestGain) {
          bestGain = g;
          bestOp = { type: "swap", i, j };
        }
      }
    }

    const empty = [];
    const filled = [];
    for (let i = 0; i < 4; i++) {
      if (!battle.enemyBoard[i] || battle.enemyBoard[i].hp <= 0) empty.push(i);
      else filled.push(i);
    }
    for (const from of filled) {
      const mover = battle.enemyBoard[from];
      for (const to of empty) {
        battle.enemyBoard[to] = mover;
        battle.enemyBoard[from] = null;
        const g = boardScore() - base;
        battle.enemyBoard[from] = mover;
        battle.enemyBoard[to] = null;
        if (g > bestGain) {
          bestGain = g;
          bestOp = { type: "move", from, to };
        }
      }
    }

    if (!bestOp || bestGain < MIN_GAIN) return;

    if (bestOp.type === "swap") {
      const i = bestOp.i;
      const j = bestOp.j;
      const a = battle.enemyBoard[i];
      const b = battle.enemyBoard[j];
      battle.enemyBoard[i] = b;
      battle.enemyBoard[j] = a;
      pushLog(`人机：调整「${b.name}」与「${a.name}」的站位。`);
      renderBattle();
      animEnemySlot(i, "anim-enter");
      animEnemySlot(j, "anim-enter");
    } else {
      const { from, to } = bestOp;
      const mover = battle.enemyBoard[from];
      battle.enemyBoard[to] = mover;
      battle.enemyBoard[from] = null;
      pushLog(`人机：「${mover.name}」调整站位。`);
      renderBattle();
      animEnemySlot(to, "anim-enter");
    }
  }

  const ENEMY_TIER2_UPGRADES = [
    { tier2: "shadow_assassin", from: "assassin", cost: 10 },
    { tier2: "poison_assassin", from: "assassin", cost: 9 },
    { tier2: "mirror_mage", from: "mage", cost: 10 },
    { tier2: "poison_witch", from: "mage", cost: 10 },
    { tier2: "round_table_guardian", from: "warrior", cost: 7 },
    { tier2: "berserker", from: "guardian", cost: 7 },
    { tier2: "divine_archer", from: "ranger", cost: 8 },
    { tier2: "rage_dragon", from: "young_dragon", cost: 7 },
    { tier2: "holy_priest", from: "priest", cost: 11 },
    { tier2: "dark_priest", from: "priest", cost: 12 },
  ];

  async function enemyTryTier2Upgrades() {
    await delay(500);
    for (const u of ENEMY_TIER2_UPGRADES) {
      const hand = battle.enemyHand.find((h) => h.templateId === u.tier2);
      if (!hand) continue;
      if (battle.enemyHolyWater < u.cost) continue;
      const def = getChar(u.tier2);
      for (let i = 0; i < 4; i++) {
        const c = battle.enemyBoard[i];
        if (!c || c.hp <= 0) continue;
        if (c.templateId !== u.from) continue;
        renderBattle();
        const rectT2 = getEnemyHandCardRect(hand.uid);
        if (rectT2)
          await flyHandCardToSlot(rectT2, "enemy", i, hand, {
            tier2Upgrade: true,
          });
        else await delay(380);
        battle.enemyHolyWater -= u.cost;
        const oldMax = c.maxHp;
        const newHp = Math.min(def.hp, c.hp + (def.hp - oldMax));
        const hi = battle.enemyHand.indexOf(hand);
        if (hi < 0) continue;
        battle.enemyHand.splice(hi, 1);
        battle.enemyDiscard.push(hand);
        const upgraded = {
          templateId: u.tier2,
          name: def.name,
          hp: newHp,
          maxHp: def.hp,
          damage: def.damage,
          bonusDamage: 0,
        };
        attachHolyPriestReactiveFields(upgraded, u.tier2);
        battle.enemyBoard[i] = upgraded;
        pushLog(
          `人机：将「${getChar(u.from).name}」升级为「${def.name}」（生命 ${newHp}/${def.hp}）。`
        );
        renderBattle();
        requestAnimationFrame(() => {
          playTier2UpgradeEffect(i, "enemy", u.tier2);
        });
        if (!rectT2) animEnemySlot(i, "anim-enter");
        return;
      }
    }
  }

  async function runEnemyTurn() {
    if (!battle || battle.phase !== "enemy") return;
    if (battle.skipEnemyNext) {
      battle.skipEnemyNext = false;
      pushLog("敌方本回合被跳过（时间停滞）。");
      await delay(500);
      if (!startPlayerTurnFromEnemy()) return;
      return;
    }

    await delay(500);
    gainHolyWater("enemy");
    resetHolyPriestReactiveBoard(battle.enemyBoard);
    applyDarkPriestTurnStart(false);
    if (battle.enemyDeck.length) {
      battle.enemyHand.push(battle.enemyDeck.pop());
      pushLog("敌方抽 1 张牌。");
    }
    renderBattle();

    const lowCol = enemyPlayerLowestHpColumn();
    for (let t = 0; t < 2; t++) {
      await delay(500);
      const chars = battle.enemyHand.filter((h) => {
        const d = getChar(h.templateId);
        if (d.type !== "character" || d.tier) return false;
        const rw = recruitHolyWaterCost(d);
        if (rw > 0 && battle.enemyHolyWater < rw) return false;
        return true;
      });
      if (!chars.length) break;
      const empty = [];
      for (let i = 0; i < 4; i++) {
        if (!battle.enemyBoard[i] || battle.enemyBoard[i].hp <= 0) empty.push(i);
      }
      if (!empty.length) break;
      let bestH = chars[0];
      let bestS = -1;
      for (const h of chars) {
        const d = getChar(h.templateId);
        const s = enemyCombatScoreFromDef(d);
        if (s > bestS) {
          bestS = s;
          bestH = h;
        }
      }
      const slot = pickBestEmptySlotForEnemy(lowCol, empty);
      const def = getChar(bestH.templateId);
      const hi = battle.enemyHand.indexOf(bestH);
      if (hi < 0) break;
      const rwPl = recruitHolyWaterCost(def);
      if (rwPl > 0 && battle.enemyHolyWater < rwPl) break;
      renderBattle();
      const rectPl = getEnemyHandCardRect(bestH.uid);
      if (rectPl) await flyHandCardToSlot(rectPl, "enemy", slot, bestH);
      else await delay(380);
      if (rwPl > 0) battle.enemyHolyWater -= rwPl;
      battle.enemyHand.splice(hi, 1);
      const hpPl = hpWhenPlacingFromHand(bestH, def);
      const placed = {
        templateId: bestH.templateId,
        name: def.name,
        hp: hpPl,
        maxHp: def.hp,
        damage: def.damage,
        bonusDamage: 0,
      };
      attachHolyPriestReactiveFields(placed, bestH.templateId);
      battle.enemyBoard[slot] = placed;
      pushLog(`人机在格 ${slot + 1} 放置「${def.name}」。`);
      renderBattle();
    }

    await tryEnemySwapIfBeneficial();

    await enemyTryRepositionIfBeneficial();

    await enemyTryTier2Upgrades();

    await delay(500);
    await tryEnemyEffects();

    battle.phase = "resolving";
    renderBattle();
    await delay(300);
    await resolveEnemyAttacksAnimated();
    await removeDead(battle.playerBoard, false);
    renderBattle();
    if (enemyWinCondition()) {
      endGame(false);
      return;
    }
    renderBattle();

    if (!startPlayerTurnFromEnemy()) return;
  }

  function startPlayerTurnFromEnemy() {
    if (battle.skipPlayerNext) {
      battle.skipPlayerNext = false;
      pushLog("你方回合被跳过。");
      battle.phase = "enemy";
      renderBattle();
      void runEnemyTurn();
      return false;
    }
    gainHolyWater("player");
    resetHolyPriestReactiveBoard(battle.playerBoard);
    applyDarkPriestTurnStart(true);
    if (battle.playerDeck.length) {
      battle.playerHand.push(battle.playerDeck.pop());
      pushLog("你抽 1 张牌。");
    }
    battle.phase = "player";
    renderBattle();
    return true;
  }

  async function tryEnemyEffects() {
    const hand = battle.enemyHand;
    const board = battle.enemyBoard;
    const foes = livingPlayerSlots();
    const allies = [];
    for (let i = 0; i < 4; i++) {
      if (board[i] && board[i].hp > 0) allies.push(i);
    }

    for (let iter = 0; iter < 8; iter++) {
      await delay(500);
      let best = null;
      let bestScore = -1;
      const pAlive = livingPlayerSlots().length;
      const eAlive = allies.length;
      hand.forEach((h, idx) => {
        const def = getChar(h.templateId);
        if (def.type !== "effect") return;
        let s = 8;
        if (def.effect === "heal" && allies.length) {
          if (battle.enemyHolyWater < holyWaterCost(def)) return;
          s += 16;
          let minRatio = 2;
          for (const j of allies) {
            const c = board[j];
            const r = c.hp / c.maxHp;
            if (r < minRatio) minRatio = r;
          }
          if (minRatio < 0.45) s += 22;
          if (minRatio < 0.28) s += 14;
        }
        if (def.effect === "buff" && allies.length) {
          if (battle.enemyHolyWater < holyWaterCost(def)) return;
          s += 16;
          let maxDmg = 0;
          for (const j of allies) {
            if (board[j].damage > maxDmg) maxDmg = board[j].damage;
          }
          if (maxDmg >= 4) s += 12;
        }
        if (def.effect === "damage" && foes.length) {
          if (battle.enemyHolyWater < holyWaterCost(def)) return;
          s += 18;
          let minHp = Infinity;
          for (const j of foes) {
            const hp = battle.playerBoard[j].hp;
            if (hp < minHp) minHp = hp;
          }
          if (minHp <= def.value + 2) s += 28;
          if (minHp <= 6) s += 14;
        }
        if (def.effect === "gain_holy_water") {
          if (battle.enemyHolyWater >= HOLY_WATER_MAX) return;
          if (battle.enemyHolyWater < holyWaterCost(def)) return;
          s += 14;
          if (battle.enemyHolyWater < 5) s += 16;
        }
        if (def.effect === "draw_cards") {
          if (battle.enemyHolyWater < holyWaterCost(def)) return;
          if (!battle.enemyDeck.length) return;
          s += 15;
          if (battle.enemyDeck.length >= 2) s += 12;
        }
        if (def.effect === "heal_all_full") {
          const cost = holyWaterCost(def);
          if (battle.enemyHolyWater < cost) return;
          if (!allies.length) return;
          let need = 0;
          for (const j of allies) {
            if (board[j].hp < board[j].maxHp) need++;
          }
          if (!need) return;
          s += 22 + need * 10;
        }
        if (def.effect === "skip") {
          if (battle.enemyHolyWater < holyWaterCost(def)) return;
          s += 8;
          if (pAlive >= eAlive + 1) s += 20;
          for (const j of foes) {
            const c = battle.playerBoard[j];
            if (c && c.hp <= c.maxHp * 0.38) s += 14;
          }
        }
        if (s > bestScore) {
          bestScore = s;
          best = { h, idx, def };
        }
      });
      if (!best || bestScore < 14) break;

      const h = best.h;
      const def = best.def;
      renderBattle();
      await delay(40);
      await effectFlyToCenter(h);
      const hi = battle.enemyHand.indexOf(h);
      if (hi < 0) break;
      if (def.effect === "heal" && allies.length) {
        const hwc = holyWaterCost(def);
        if (battle.enemyHolyWater < hwc) break;
        battle.enemyHolyWater -= hwc;
        let t = allies[0];
        let bestR = board[t].hp / board[t].maxHp;
        for (const j of allies) {
          const r = board[j].hp / board[j].maxHp;
          if (r < bestR) {
            bestR = r;
            t = j;
          }
        }
        const eg = healGainAfterPoison(board[t], def.value);
        board[t].hp = Math.min(board[t].maxHp, board[t].hp + eg);
        pushLog(`人机：「${def.name}」·「${board[t].name}」回复生命。`);
        battle.enemyHand.splice(hi, 1);
        battle.enemyDiscard.push(h);
        animEnemySlot(t, "anim-effect");
      } else if (def.effect === "buff" && allies.length) {
        const hwc = holyWaterCost(def);
        if (battle.enemyHolyWater < hwc) break;
        battle.enemyHolyWater -= hwc;
        let t = allies[0];
        let maxD = board[t].damage;
        for (const j of allies) {
          if (board[j].damage > maxD) {
            maxD = board[j].damage;
            t = j;
          }
        }
        board[t].bonusDamage = (board[t].bonusDamage || 0) + def.value;
        pushLog(`人机：「${def.name}」强化「${board[t].name}」。`);
        battle.enemyHand.splice(hi, 1);
        battle.enemyDiscard.push(h);
        animEnemySlot(t, "anim-effect");
      } else if (def.effect === "gain_holy_water") {
        const hwc = holyWaterCost(def);
        if (battle.enemyHolyWater < hwc) break;
        if (battle.enemyHolyWater >= HOLY_WATER_MAX) break;
        battle.enemyHolyWater -= hwc;
        battle.enemyHolyWater = Math.min(
          HOLY_WATER_MAX,
          battle.enemyHolyWater + def.value
        );
        pushLog(`人机：「${def.name}」获得 ${def.value} 点圣水。`);
        battle.enemyHand.splice(hi, 1);
        battle.enemyDiscard.push(h);
      } else if (def.effect === "draw_cards") {
        const hwc = holyWaterCost(def);
        if (battle.enemyHolyWater < hwc) break;
        if (!battle.enemyDeck.length) break;
        battle.enemyHolyWater -= hwc;
        let n = 0;
        for (let i = 0; i < def.value && battle.enemyDeck.length; i++) {
          battle.enemyHand.push(battle.enemyDeck.pop());
          n++;
        }
        pushLog(`人机：「${def.name}」抽取 ${n} 张牌。`);
        battle.enemyHand.splice(hi, 1);
        battle.enemyDiscard.push(h);
      } else if (def.effect === "heal_all_full") {
        const hwc = holyWaterCost(def);
        if (battle.enemyHolyWater < hwc) break;
        if (!allies.length) break;
        let need = false;
        for (const j of allies) {
          if (board[j].hp < board[j].maxHp) need = true;
        }
        if (!need) break;
        battle.enemyHolyWater -= hwc;
        for (const j of allies) {
          board[j].hp = board[j].maxHp;
          animEnemySlot(j, "anim-effect");
        }
        pushLog(`人机：「${def.name}」：己方全体恢复至满血。`);
        battle.enemyHand.splice(hi, 1);
        battle.enemyDiscard.push(h);
      } else if (def.effect === "skip") {
        const hwc = holyWaterCost(def);
        if (battle.enemyHolyWater < hwc) break;
        battle.enemyHolyWater -= hwc;
        battle.skipPlayerNext = true;
        pushLog("人机：「时间停滞」— 你下一回合将被跳过。");
        battle.enemyHand.splice(hi, 1);
        battle.enemyDiscard.push(h);
      } else if (def.effect === "damage" && foes.length) {
        const hwc = holyWaterCost(def);
        if (battle.enemyHolyWater < hwc) break;
        battle.enemyHolyWater -= hwc;
        let t = foes[0];
        let minHp = battle.playerBoard[t].hp;
        for (const j of foes) {
          const hp = battle.playerBoard[j].hp;
          if (hp < minHp) {
            minHp = hp;
            t = j;
          }
        }
        await vfxLightningFromCenterToSlot("player", t, def.value);
        await dealDamageToPlayerSlot(t, def.value);
        await removeDead(battle.playerBoard, false);
        battle.enemyHand.splice(hi, 1);
        battle.enemyDiscard.push(h);
        if (enemyWinCondition()) {
          renderBattle();
          endGame(false);
          return;
        }
      } else {
        break;
      }
      renderBattle();
    }
  }

  function renderBattle() {
    if (!battle) return;

    document.getElementById("player-hand-count").textContent = String(battle.playerHand.length);
    document.getElementById("enemy-hand-count").textContent = String(battle.enemyHand.length);

    const status = document.getElementById("battle-status");
    const inPrep =
      battle.phase === "setup" ||
      battle.phase === "enemy_setup" ||
      battle.phase === "coin";
    const winHint = inPrep
      ? ""
      : `击败敌方 ${battle.enemyDefeatCount}/${WIN_DEFEAT_COUNT} · 我方被击败 ${battle.playerDefeatCount}/${WIN_DEFEAT_COUNT} · `;
    if (battle.phase === "setup") {
      status.textContent =
        pendingRecallSlotIndex !== null
          ? "已选上场格：点另一有角色格可换位，点空位可移动，点手牌栏下阵；再点原格取消"
          : "初始布阵 · 点击场上角色可查看技能与被动 · 仅可摆放角色牌 · 效果牌呈灰阶不可用 · 点手牌上场后再点手牌栏下阵 · 完成后掷硬币定先后手";
    } else if (battle.phase === "enemy_setup") {
      status.textContent = "人机正在布阵…";
    } else if (battle.phase === "coin") {
      status.textContent = "掷硬币决定先后手…";
    } else if (battle.phase === "player") {
      let t = pendingEffect
        ? "请选择目标（场上卡牌）"
        : pendingRecallSlotIndex !== null
          ? "已选上场格：点另一有角色格可换位，点空位可移动，点手牌栏下阵；再点原格取消"
          : "你的回合 · 点击场上单位可查看描述 · 选中手牌后点格子上阵或替换；弹窗内可换位/下阵";
      if (battle.skipEnemyNext) t += " · 下回合将跳过敌方";
      status.textContent = winHint + t;
    } else if (battle.phase === "resolving") {
      status.textContent = winHint + "结算中…";
    } else {
      status.textContent =
        winHint + "人机行动中，请稍候… · 可点击场上单位查看描述";
    }

    const logEl = document.getElementById("battle-log");
    logEl.innerHTML = "";
    battle.log.slice(-12).forEach((line) => {
      logEl.appendChild(el("div", "line", line));
    });

    const pBoard = document.getElementById("player-board");
    const eBoard = document.getElementById("enemy-board");
    pBoard.innerHTML = "";
    eBoard.innerHTML = "";

    const playerCanAct = battle.phase === "player" || battle.phase === "setup";

    for (let i = 0; i < 4; i++) {
      const slot = el("div", "slot");
      slot.id = "player-slot-" + i;
      const c = battle.playerBoard[i];
      if (c && c.hp > 0) {
        slot.classList.add("filled", "slot--token");
        slot.dataset.tid = c.templateId;
        slot.title = `${c.name} · 点击查看详情`;
        const frame = el("div", "slot-token-frame");
        const art = el("div", "slot-art slot-art--token");
        art.setAttribute("aria-hidden", "true");
        const atkVal = (c.damage || 0) + (c.bonusDamage || 0);
        const stats = el("div", "slot-token-stats");
        stats.appendChild(el("span", "slot-token-atk", String(atkVal)));
        stats.appendChild(el("span", "slot-token-hp", String(c.hp)));
        frame.appendChild(art);
        frame.appendChild(stats);
        slot.appendChild(frame);
        if (pendingRecallSlotIndex === i) {
          slot.classList.add("recall-pending");
        }
        slot.addEventListener("click", () => handlePlayerSlotClick(i));
        if (c.poison) {
          slot.classList.add("slot-poisoned");
          const skull = el("img", "slot-poison-skull");
          skull.src = "assets/fx-poison-skull.png";
          skull.alt = "";
          skull.decoding = "async";
          skull.setAttribute("aria-hidden", "true");
          skull.title = "中毒";
          slot.appendChild(skull);
        }
      } else {
        slot.classList.add("empty-hint");
        slot.textContent = "空位";
        if (playerCanAct && selectedHandUid) {
          const h = handByUid(selectedHandUid);
          if (h && getChar(h.templateId).type === "character") {
            slot.addEventListener("click", () => placeOrSwapPlayer(i));
          }
        }
        if (
          playerCanAct &&
          pendingRecallSlotIndex !== null &&
          !selectedHandUid &&
          !pendingEffect
        ) {
          slot.addEventListener("click", () => placeOrSwapPlayer(i));
        }
        if (playerCanAct && pendingEffect && (pendingEffect.type === "heal" || pendingEffect.type === "buff")) {
          slot.classList.add("disabled");
        }
      }
      pBoard.appendChild(slot);
    }

    for (let i = 0; i < 4; i++) {
      const slot = el("div", "slot");
      slot.id = "enemy-slot-" + i;
      const c = battle.enemyBoard[i];
      if (c && c.hp > 0) {
        slot.classList.add("filled", "slot--token");
        slot.dataset.tid = c.templateId;
        slot.title = `${c.name} · 点击查看详情`;
        const frame = el("div", "slot-token-frame");
        const art = el("div", "slot-art slot-art--token");
        art.setAttribute("aria-hidden", "true");
        const atkVal = (c.damage || 0) + (c.bonusDamage || 0);
        const stats = el("div", "slot-token-stats");
        stats.appendChild(el("span", "slot-token-atk", String(atkVal)));
        stats.appendChild(el("span", "slot-token-hp", String(c.hp)));
        frame.appendChild(art);
        frame.appendChild(stats);
        slot.appendChild(frame);
        slot.addEventListener("click", () => handleEnemySlotClick(i));
        if (c.poison) {
          slot.classList.add("slot-poisoned");
          const skull = el("img", "slot-poison-skull");
          skull.src = "assets/fx-poison-skull.png";
          skull.alt = "";
          skull.decoding = "async";
          skull.setAttribute("aria-hidden", "true");
          skull.title = "中毒";
          slot.appendChild(skull);
        }
      } else {
        slot.classList.add("empty-hint");
        slot.textContent = "空";
      }
      eBoard.appendChild(slot);
    }

    const handEl = document.getElementById("player-hand");
    handEl.innerHTML = "";
    handEl.className = "hand hand--fan";
    const handN = battle.playerHand.length;
    battle.playerHand.forEach((h, i) => {
      const def = getChar(h.templateId);
      const isT2 = def && def.type === "character" && Number(def.tier) === 2;
      const card = el(
        "div",
        "hand-card " +
          (def.type === "effect" ? "is-effect" : "is-character") +
          (isT2 ? " tier-2" : "")
      );
      card.dataset.huid = h.uid;
      card.dataset.tid = h.templateId;
      const thumb = el("div", "card-thumb");
      thumb.setAttribute("aria-hidden", "true");
      const hwCost = holyWaterCost(def);
      const recCost = recruitHolyWaterCost(def);
      if (hwCost > 0) {
        thumb.appendChild(el("span", "holy-water-badge", String(hwCost)));
      } else if (isT2 && def.upgradeHolyWaterCost > 0) {
        thumb.appendChild(el("span", "holy-water-badge", String(def.upgradeHolyWaterCost)));
      } else if (recCost > 0) {
        thumb.appendChild(el("span", "holy-water-badge", String(recCost)));
      }
      const text = el("div", "card-text");
      text.appendChild(el("div", "name", def.name));
      const meta = el("div", "meta");
      if (def.type === "character") {
        const tag = TARGET_RULE_LABELS[def.targetRule] || "";
        const hpLine =
          typeof h.hp === "number" && h.hp > 0
            ? `生命 ${h.hp}/${h.maxHp != null ? h.maxHp : def.hp}`
            : `生命 ${def.hp}`;
        let line = `${hpLine} · 伤害 ${def.damage}` + (tag ? ` · ${tag}` : "");
        if (def.passiveDesc) line += ` · ${def.passiveDesc}`;
        if (Number(def.tier) === 2)
          line += ` · 二级（点场上一级对应英雄，${def.upgradeHolyWaterCost || 0}圣水）`;
        else if (recCost > 0) line += ` · 对战上场${recCost}圣水`;
        if (h.recalledFromBoard) line += " · 下阵";
        meta.textContent = line;
      } else {
        meta.textContent = def.desc;
      }
      text.appendChild(meta);
      card.appendChild(thumb);
      card.appendChild(text);

      const costLocked =
        battle.phase === "player" &&
        def.type === "effect" &&
        hwCost > 0 &&
        battle.playerHolyWater < hwCost;
      const recruitLocked =
        battle.phase === "player" &&
        def.type === "effect" &&
        def.effect === "draw_cards" &&
        battle.playerDeck.length === 0;
      const holyLightLocked =
        battle.phase === "player" &&
        def.type === "effect" &&
        def.effect === "heal_all_full" &&
        livingPlayerSlots().length === 0;
      const gainHwLocked =
        battle.phase === "player" &&
        def.type === "effect" &&
        def.effect === "gain_holy_water" &&
        battle.playerHolyWater >= HOLY_WATER_MAX;
      const effectLocked =
        (battle.phase === "setup" && def.type === "effect") ||
        costLocked ||
        recruitLocked ||
        holyLightLocked ||
        gainHwLocked;
      const tier2SetupLocked =
        battle.phase === "setup" &&
        def.type === "character" &&
        Number(def.tier) === 2;
      const characterRecruitLocked =
        battle.phase === "player" &&
        def.type === "character" &&
        !def.tier &&
        recCost > 0 &&
        battle.playerHolyWater < recCost;
      const characterLocked =
        tier2SetupLocked || characterRecruitLocked;

      let tier2Bw = false;
      if (isT2) {
        if (battle.phase === "setup") tier2Bw = true;
        else if (battle.phase === "player") tier2Bw = !isTier2HandCardPlayable(h, def);
        else if (!playerCanAct) tier2Bw = true;
      }
      if (tier2Bw) card.classList.add("tier2-muted");

      const maxTilt = 21;
      const rot =
        handN <= 1 ? 0 : ((i / (handN - 1)) - 0.5) * 2 * maxTilt;
      const fanY =
        handN <= 1
          ? 0
          : (0.25 - Math.pow(i / (handN - 1) - 0.5, 2)) * 36;
      card.style.setProperty("--fan-rot", rot + "deg");
      card.style.setProperty("--fan-y", -fanY + "px");
      const center = (handN - 1) / 2;
      card.style.zIndex = String(20 + Math.round(12 - Math.abs(i - center) * 2.2));

      if (!playerCanAct || effectLocked || characterLocked) {
        card.classList.add("disabled");
      } else {
        if (selectedHandUid === h.uid) card.classList.add("selected");
        card.addEventListener("click", () => {
          if (def.type === "effect") {
            void playEffectCard(h);
          } else {
            selectedHandUid = selectedHandUid === h.uid ? null : h.uid;
            pendingRecallSlotIndex = null;
            pendingEffect = null;
            renderBattle();
          }
        });
      }
      handEl.appendChild(card);
    });

    handEl.classList.toggle("pending-recall", pendingRecallSlotIndex !== null);

    const enemyHandEl = document.getElementById("enemy-hand");
    if (enemyHandEl) {
      enemyHandEl.innerHTML = "";
      enemyHandEl.className = "hand hand--fan hand--enemy";
      const ehN = battle.enemyHand.length;
      battle.enemyHand.forEach((h, i) => {
        const card = el("div", "hand-card hand-card--back");
        card.dataset.ehuid = h.uid;
        card.setAttribute("aria-hidden", "true");
        card.appendChild(el("div", "card-back-face"));
        /* 上方扇形：以上边为轴，旋转取反 + translateY 向下拱向战场（朝向对方一侧） */
        const maxTilt = 21;
        const rot =
          ehN <= 1 ? 0 : ((i / (ehN - 1)) - 0.5) * 2 * maxTilt;
        const fanY =
          ehN <= 1
            ? 0
            : (0.25 - Math.pow(i / (ehN - 1) - 0.5, 2)) * 36;
        card.style.setProperty("--fan-rot", -rot + "deg");
        card.style.setProperty("--fan-y", fanY + "px");
        const center = (ehN - 1) / 2;
        card.style.zIndex = String(20 + Math.round(12 - Math.abs(i - center) * 2.2));
        enemyHandEl.appendChild(card);
      });
    }

    const btnConfirm = document.getElementById("btn-confirm");
    btnConfirm.textContent = battle.phase === "setup" ? "完成布阵" : "确认结束回合";
    btnConfirm.disabled =
      !playerCanAct ||
      battle.phase === "coin" ||
      battle.phase === "enemy_setup" ||
      battle.phase === "resolving";

    const btnSurrender = document.getElementById("btn-surrender");
    if (btnSurrender) {
      const ph = battle.phase;
      btnSurrender.disabled =
        ph === "over" ||
        ph === "enemy_setup" ||
        ph === "resolving";
    }

    updateHolyWaterPanel();
    updateTurnCounter();
  }

  async function playEffectCard(h) {
    const def = getChar(h.templateId);
    if (def.type !== "effect") return;
    if (def.effect === "heal") {
      if (battle.playerHolyWater < holyWaterCost(def)) {
        pushLog(
          `圣水不足：需要 ${holyWaterCost(def)} 点圣水（当前 ${battle.playerHolyWater}）。`
        );
        renderBattle();
        return;
      }
      pendingRecallSlotIndex = null;
      pendingEffect = { type: "heal", card: h, value: def.value };
      pushLog("请选择一名己方角色回复生命。");
    } else if (def.effect === "buff") {
      if (battle.playerHolyWater < holyWaterCost(def)) {
        pushLog(
          `圣水不足：需要 ${holyWaterCost(def)} 点圣水（当前 ${battle.playerHolyWater}）。`
        );
        renderBattle();
        return;
      }
      pendingRecallSlotIndex = null;
      pendingEffect = { type: "buff", card: h, value: def.value };
      pushLog("请选择一名己方角色获得战意。");
    } else if (def.effect === "gain_holy_water") {
      if (battle.playerHolyWater >= HOLY_WATER_MAX) {
        pushLog("圣水已满，无法使用「甘雨」。");
        renderBattle();
        return;
      }
      await effectFlyToCenter(h);
      battle.playerHolyWater = Math.min(
        HOLY_WATER_MAX,
        battle.playerHolyWater + def.value
      );
      removeHandCard(h.uid);
      battle.playerDiscard.push(h);
      pushLog(`「${def.name}」：获得 ${def.value} 点圣水。`);
      pendingEffect = null;
      pendingRecallSlotIndex = null;
      selectedHandUid = null;
      renderBattle();
      return;
    } else if (def.effect === "draw_cards") {
      const dc = holyWaterCost(def);
      if (battle.playerHolyWater < dc) {
        pushLog(
          `圣水不足：需要 ${dc} 点圣水（当前 ${battle.playerHolyWater}）。`
        );
        renderBattle();
        return;
      }
      if (!battle.playerDeck.length) {
        pushLog("牌库已空，无法使用「招募」。");
        renderBattle();
        return;
      }
      battle.playerHolyWater -= dc;
      await effectFlyToCenter(h);
      let n = 0;
      for (let i = 0; i < def.value && battle.playerDeck.length; i++) {
        battle.playerHand.push(battle.playerDeck.pop());
        n++;
      }
      removeHandCard(h.uid);
      battle.playerDiscard.push(h);
      pushLog(`「${def.name}」：抽取 ${n} 张牌。`);
      pendingEffect = null;
      pendingRecallSlotIndex = null;
      selectedHandUid = null;
      renderBattle();
      return;
    } else if (def.effect === "heal_all_full") {
      if (livingPlayerSlots().length === 0) {
        pushLog("场上没有己方角色，无法使用「圣光」。");
        renderBattle();
        return;
      }
      const cost = holyWaterCost(def);
      if (battle.playerHolyWater < cost) {
        pushLog(
          `圣水不足：「${def.name}」需要 ${cost} 点圣水（当前 ${battle.playerHolyWater}）。`
        );
        renderBattle();
        return;
      }
      battle.playerHolyWater -= cost;
      await effectFlyToCenter(h);
      let healed = 0;
      for (let i = 0; i < 4; i++) {
        const c = battle.playerBoard[i];
        if (c && c.hp > 0) {
          c.hp = c.maxHp;
          healed++;
          animPlayerSlot(i, "anim-effect");
        }
      }
      removeHandCard(h.uid);
      battle.playerDiscard.push(h);
      pushLog(`「${def.name}」：${healed} 名己方角色已恢复至满血。`);
      pendingEffect = null;
      pendingRecallSlotIndex = null;
      selectedHandUid = null;
      renderBattle();
      return;
    } else if (def.effect === "skip") {
      const cost = holyWaterCost(def);
      if (battle.playerHolyWater < cost) {
        pushLog(
          `圣水不足：时间停滞需要 ${cost} 点圣水（当前 ${battle.playerHolyWater}）。`
        );
        renderBattle();
        return;
      }
      battle.playerHolyWater -= cost;
      await effectFlyToCenter(h);
      battle.skipEnemyNext = true;
      removeHandCard(h.uid);
      battle.playerDiscard.push(h);
      pushLog("已使用时间停滞：敌方下一回合将被跳过。");
      pendingEffect = null;
      pendingRecallSlotIndex = null;
      selectedHandUid = null;
      renderBattle();
      return;
    } else if (def.effect === "damage") {
      if (battle.playerHolyWater < holyWaterCost(def)) {
        pushLog(
          `圣水不足：需要 ${holyWaterCost(def)} 点圣水（当前 ${battle.playerHolyWater}）。`
        );
        renderBattle();
        return;
      }
      pendingRecallSlotIndex = null;
      pendingEffect = { type: "damage", card: h, value: def.value };
      pushLog("请选择一名敌方场上的角色造成伤害。");
    }
    selectedHandUid = null;
    pendingRecallSlotIndex = null;
    renderBattle();
  }

  async function applyPendingToPlayerSlot(slotIndex) {
    if (!pendingEffect) return;
    const c = battle.playerBoard[slotIndex];
    if (!c || c.hp <= 0) return;
    const h = pendingEffect.card;
    const d = getChar(h.templateId);
    const cost = holyWaterCost(d);
    if (battle.playerHolyWater < cost) {
      pushLog(`圣水不足，无法结算「${d.name}」。`);
      return;
    }
    battle.playerHolyWater -= cost;
    await effectFlyToCenter(h);
    if (pendingEffect.type === "heal") {
      const hadPoison = !!c.poison;
      if (hadPoison) delete c.poison;
      const base = pendingEffect.value;
      const g = hadPoison ? base : healGainAfterPoison(c, base);
      c.hp = Math.min(c.maxHp, c.hp + g);
      pushLog(
        hadPoison
          ? `「${c.name}」回复 ${g} 点生命，中毒已解除。`
          : `「${c.name}」回复 ${g} 点生命。`
      );
    } else if (pendingEffect.type === "buff") {
      c.bonusDamage = (c.bonusDamage || 0) + pendingEffect.value;
      pushLog(`「${c.name}」下次攻击额外 ${pendingEffect.value} 点伤害。`);
    }
    removeHandCard(h.uid);
    battle.playerDiscard.push(h);
    pendingEffect = null;
    renderBattle();
    animPlayerSlot(slotIndex, "anim-effect");
  }

  async function applyPendingToEnemySlot(slotIndex) {
    if (!pendingEffect || pendingEffect.type !== "damage") return;
    const c = battle.enemyBoard[slotIndex];
    if (!c || c.hp <= 0) return;
    const h = pendingEffect.card;
    const d = getChar(h.templateId);
    const cost = holyWaterCost(d);
    if (battle.playerHolyWater < cost) {
      pushLog(`圣水不足，无法结算「${d.name}」。`);
      return;
    }
    battle.playerHolyWater -= cost;
    await effectFlyToCenter(h);
    await vfxLightningFromCenterToSlot("enemy", slotIndex, pendingEffect.value);
    await dealDamageToEnemySlot(slotIndex, pendingEffect.value);
    removeHandCard(h.uid);
    battle.playerDiscard.push(h);
    pendingEffect = null;
    await removeDead(battle.enemyBoard, true);
    if (playerWinCondition()) {
      endGame(true);
      return;
    }
    renderBattle();
  }

  async function recallSlotToHand(slotIndex) {
    const prev = battle.playerBoard[slotIndex];
    if (!prev || prev.hp <= 0) return;
    const slotEl = document.getElementById("player-slot-" + slotIndex);
    const fromRect = slotEl ? slotEl.getBoundingClientRect() : null;
    const handEl = document.getElementById("player-hand");
    const handRect = handEl ? handEl.getBoundingClientRect() : null;
    if (fromRect && handRect) {
      await flyRectToPlayerHandDock(fromRect, handRect, prev);
    }
    battle.playerHand.push({
      uid: uid(),
      templateId: prev.templateId,
      hp: prev.hp,
      maxHp: prev.maxHp,
      recalledFromBoard: true,
    });
    battle.playerBoard[slotIndex] = null;
    pushLog(`「${prev.name}」已下阵（生命 ${prev.hp}/${prev.maxHp}）。`);
    renderBattle();
  }

  async function placeOrSwapPlayer(slotIndex) {
    if (pendingEffect) {
      if (pendingEffect.type === "damage") {
        return;
      }
      void applyPendingToPlayerSlot(slotIndex);
      return;
    }

    if (selectedHandUid) {
      pendingRecallSlotIndex = null;
    }

    const prev = battle.playerBoard[slotIndex];

    // 无手牌选中：先点格进入「待下阵/换位」态，再点手牌栏下阵；期间可换位或移到空位
    if (!selectedHandUid) {
      const from = pendingRecallSlotIndex;

      if (from !== null) {
        const mover = battle.playerBoard[from];
        if (!mover || mover.hp <= 0) {
          pendingRecallSlotIndex = null;
          renderBattle();
          return;
        }
        if (slotIndex === from) {
          pendingRecallSlotIndex = null;
          renderBattle();
          return;
        }
        if (!prev || prev.hp <= 0) {
          const elFrom = document.getElementById("player-slot-" + from);
          const elTo = document.getElementById("player-slot-" + slotIndex);
          const rFrom = elFrom ? elFrom.getBoundingClientRect() : null;
          const rEnd = elTo ? elTo.getBoundingClientRect() : null;
          pendingRecallSlotIndex = null;
          pushLog(`「${mover.name}」已移至空位。`);
          if (rFrom && rEnd) {
            await flyHandCardFromRectToRect(rFrom, rEnd, {
              uid: "mv",
              templateId: mover.templateId,
            });
          }
          battle.playerBoard[slotIndex] = mover;
          battle.playerBoard[from] = null;
          renderBattle();
          return;
        }
        const elFrom = document.getElementById("player-slot-" + from);
        const elTo = document.getElementById("player-slot-" + slotIndex);
        const rA = elFrom ? elFrom.getBoundingClientRect() : null;
        const rB = elTo ? elTo.getBoundingClientRect() : null;
        const cA = battle.playerBoard[from];
        const cB = battle.playerBoard[slotIndex];
        pendingRecallSlotIndex = null;
        pushLog(`「${mover.name}」与「${prev.name}」交换位置。`);
        if (rA && rB) {
          await Promise.all([
            flyHandCardFromRectToRect(rA, rB, {
              uid: "sw1",
              templateId: cA.templateId,
            }),
            flyHandCardFromRectToRect(rB, rA, {
              uid: "sw2",
              templateId: cB.templateId,
            }),
          ]);
        }
        battle.playerBoard[from] = cB;
        battle.playerBoard[slotIndex] = cA;
        renderBattle();
        return;
      }

      if (!prev || prev.hp <= 0) return;
      pendingRecallSlotIndex = slotIndex;
      renderBattle();
      return;
    }

    const h = handByUid(selectedHandUid);
    if (!h) return;
    const def = getChar(h.templateId);
    if (!def || def.type !== "character") return;

    if (isTier2HeroDef(def)) {
      if (battle.phase === "setup") {
        pushLog("布阵阶段无法使用二级英雄（请仅摆放一级英雄）。");
        renderBattle();
        return;
      }
      const canUpgrade =
        prev &&
        prev.hp > 0 &&
        prev.templateId === def.upgradesFrom;

      if (canUpgrade) {
        const upCost = def.upgradeHolyWaterCost || 0;
        if (battle.playerHolyWater < upCost) {
          pushLog(`圣水不足：升级需要 ${upCost} 点（当前 ${battle.playerHolyWater}）。`);
          renderBattle();
          return;
        }
        const fromRect = getPlayerHandCardRect(h.uid);
        await flyHandCardToSlot(fromRect, "player", slotIndex, h, {
          tier2Upgrade: true,
        });
        battle.playerHolyWater -= upCost;
        const oldMax = prev.maxHp;
        const newHp = Math.min(def.hp, prev.hp + (def.hp - oldMax));
        const upgradedP = {
          templateId: h.templateId,
          name: def.name,
          hp: newHp,
          maxHp: def.hp,
          damage: def.damage,
          bonusDamage: 0,
        };
        attachHolyPriestReactiveFields(upgradedP, h.templateId);
        battle.playerBoard[slotIndex] = upgradedP;
        removeHandCard(h.uid);
        battle.playerDiscard.push(h);
        pushLog(`「${getChar(def.upgradesFrom).name}」已升级为「${def.name}」（生命 ${newHp}/${def.hp}）。`);
        selectedHandUid = null;
        renderBattle();
        requestAnimationFrame(() => {
          playTier2UpgradeEffect(slotIndex, "player", h.templateId);
        });
        return;
      }
      if (prev && prev.hp > 0 && prev.templateId !== def.upgradesFrom) {
        const fromDef = getChar(def.upgradesFrom);
        pushLog(
          `「${def.name}」只能升级场上的「${fromDef ? fromDef.name : "对应一级"}」。`
        );
        renderBattle();
        return;
      }
      if (!prev || prev.hp <= 0) {
        if (!h.recalledFromBoard) {
          pushLog(
            `「${def.name}」须升级场上对应的一级；从场上「下阵」回手牌的二级可再置于空位。`
          );
          renderBattle();
          return;
        }
        if (battle.phase !== "player") {
          pushLog("当前阶段无法将二级英雄置于空位。");
          renderBattle();
          return;
        }
        const rw = recruitHolyWaterCost(def);
        if (rw > 0 && battle.playerHolyWater < rw) {
          pushLog(
            `圣水不足：上场「${def.name}」需要 ${rw} 点（当前 ${battle.playerHolyWater}）。`
          );
          renderBattle();
          return;
        }
        const fromRect = getPlayerHandCardRect(h.uid);
        await flyHandCardToSlot(fromRect, "player", slotIndex, h);
        if (rw > 0) battle.playerHolyWater -= rw;
        const hpFromHand = hpWhenPlacingFromHand(h, def);
        const redeploy = {
          templateId: h.templateId,
          name: def.name,
          hp: hpFromHand,
          maxHp: def.hp,
          damage: def.damage,
          bonusDamage: 0,
        };
        attachHolyPriestReactiveFields(redeploy, h.templateId);
        battle.playerBoard[slotIndex] = redeploy;
        removeHandCard(h.uid);
        pushLog(`「${def.name}」上场。`);
        selectedHandUid = null;
        renderBattle();
        return;
      }
      pushLog("无法将二级英雄置于该格。");
      renderBattle();
      return;
    }

    const rw = recruitHolyWaterCost(def);
    if (battle.phase === "player" && rw > 0) {
      if (battle.playerHolyWater < rw) {
        pushLog(
          `圣水不足：上场「${def.name}」需要 ${rw} 点（当前 ${battle.playerHolyWater}）。`
        );
        renderBattle();
        return;
      }
    }

    const fromRect = getPlayerHandCardRect(h.uid);
    const slotRectOld = document.getElementById("player-slot-" + slotIndex);
    const rSlot = slotRectOld ? slotRectOld.getBoundingClientRect() : null;
    const handDock = document.getElementById("player-hand");
    const rHandDock = handDock ? handDock.getBoundingClientRect() : null;

    const maxHp = def.hp;
    const hpFromHand = hpWhenPlacingFromHand(h, def);
    const newChar = {
      templateId: h.templateId,
      name: def.name,
      hp: hpFromHand,
      maxHp,
      damage: def.damage,
      bonusDamage: 0,
    };

    if (prev && prev.hp > 0 && rSlot && rHandDock) {
      await Promise.all([
        flyRectToPlayerHandDock(rSlot, rHandDock, prev),
        flyHandCardFromRectToRect(fromRect, rSlot, h),
      ]);
    } else {
      await flyHandCardToSlot(fromRect, "player", slotIndex, h);
    }

    if (battle.phase === "player" && rw > 0) {
      battle.playerHolyWater -= rw;
    }
    attachHolyPriestReactiveFields(newChar, h.templateId);
    battle.playerBoard[slotIndex] = newChar;
    removeHandCard(h.uid);
    if (prev && prev.hp > 0) {
      battle.playerHand.push({
        uid: uid(),
        templateId: prev.templateId,
        hp: prev.hp,
        maxHp: prev.maxHp,
        recalledFromBoard: true,
      });
      pushLog(
        `换下「${prev.name}」（${prev.hp}/${prev.maxHp}），换上「${def.name}」（${hpFromHand}/${maxHp}）。`
      );
    } else {
      pushLog(`「${def.name}」上场。`);
    }
    selectedHandUid = null;
    renderBattle();
  }

  document.getElementById("btn-fill-random").addEventListener("click", () => {
    carried = [];
    for (let i = 0; i < 20; i++) {
      carried.push(POOL_ORDER[(Math.random() * POOL_ORDER.length) | 0]);
    }
    if (!deckHasTierOneHero(carried)) {
      carried[(Math.random() * 20) | 0] =
        TIER1_HERO_IDS[(Math.random() * TIER1_HERO_IDS.length) | 0];
    }
    renderDeckBuilder();
  });

  document.getElementById("btn-clear-deck").addEventListener("click", () => {
    carried = [];
    renderDeckBuilder();
  });

  document.getElementById("btn-start-battle").addEventListener("click", () => {
    if (carried.length !== 20 || !deckHasTierOneHero(carried)) return;
    showScreen("screen-battle");
    initBattle();
  });

  document.getElementById("btn-confirm").addEventListener("click", () => {
    if (battle && battle.phase === "setup") {
      confirmSetup();
    } else {
      void confirmPlayerTurn();
    }
  });

  function openSurrenderConfirm() {
    const ov = document.getElementById("surrender-overlay");
    if (ov) ov.setAttribute("aria-hidden", "false");
  }

  function closeSurrenderConfirm() {
    const ov = document.getElementById("surrender-overlay");
    if (ov) ov.setAttribute("aria-hidden", "true");
  }

  function playerSurrender() {
    closeSurrenderConfirm();
    if (!battle || battle.phase === "over") return;
    pushLog("你选择投降。");
    endGame(false, { surrender: true });
  }

  document.getElementById("btn-surrender").addEventListener("click", () => {
    if (!battle) return;
    const ph = battle.phase;
    if (ph === "over" || ph === "enemy_setup" || ph === "resolving") return;
    openSurrenderConfirm();
  });

  document.getElementById("btn-surrender-cancel").addEventListener("click", () => {
    closeSurrenderConfirm();
  });

  document.getElementById("btn-surrender-ok").addEventListener("click", () => {
    playerSurrender();
  });

  document.getElementById("surrender-overlay").addEventListener("click", (e) => {
    if (e.target && e.target.id === "surrender-overlay") closeSurrenderConfirm();
  });

  document.getElementById("btn-back-deck").addEventListener("click", () => {
    battle = null;
    closeBoardCardDetail();
    showScreen("screen-deck");
    renderDeckBuilder();
  });

  (function bindBoardCardDetailUi() {
    const root = document.getElementById("board-card-detail");
    const recallBtn = document.getElementById("board-card-detail-recall");
    const closeBtn = document.querySelector(".board-card-detail-close");
    const panel = document.querySelector(".board-card-detail-panel");
    if (root) {
      root.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("board-card-detail-backdrop")) {
          closeBoardCardDetail();
        }
      });
    }
    if (closeBtn) closeBtn.addEventListener("click", () => closeBoardCardDetail());
    if (panel) {
      panel.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }
    if (recallBtn) {
      recallBtn.addEventListener("click", () => {
        if (
          boardDetailSide === "player" &&
          boardDetailSlotIndex !== null &&
          battle
        ) {
          pendingRecallSlotIndex = boardDetailSlotIndex;
          closeBoardCardDetail();
          renderBattle();
        }
      });
    }
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const ov = document.getElementById("board-card-detail");
      if (ov && ov.getAttribute("aria-hidden") === "false") closeBoardCardDetail();
    });
  })();

  document.getElementById("player-hand").addEventListener(
    "click",
    (e) => {
      if (pendingRecallSlotIndex === null) return;
      if (!battle) return;
      e.preventDefault();
      e.stopPropagation();
      const pi = pendingRecallSlotIndex;
      pendingRecallSlotIndex = null;
      void (async () => {
        await recallSlotToHand(pi);
      })();
    },
    true
  );

  renderDeckBuilder();
})();
