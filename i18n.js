/* Auto-maintained bilingual strings for card-battle-game */
(function (global) {
  "use strict";

  const CARD_I18N = {
    zh: {
  "warrior": {
    "name": "守卫",
    "skill": "盾击 2：优先攻击正前方；若该格无角色则攻击最近一列，同距离优先右侧",
    "passiveDesc": "被动·分担：每名守卫各替一名友方（生命最低与次低，不含守卫）承受 50% 所受伤害"
  },
  "mage": {
    "name": "法师",
    "skill": "奥弹 5：攻击当前生命最低的敌方；同血优先右侧"
  },
  "assassin": {
    "name": "刺客",
    "skill": "刺杀 4：攻击当前生命最高的敌方；同血优先右侧",
    "passiveDesc": "被动·血刃：若目标当前生命不低于 50%，额外造成 2 点真实伤害"
  },
  "shadow_assassin": {
    "name": "暗影刺客",
    "skill": "刺杀 6：攻击当前生命最高的敌方；同血优先右侧",
    "passiveDesc": "被动·影刃：目标剩余生命超过 50%、75%、满血时，额外造成 3、5、7 点真实伤害（取最高档，不叠加）"
  },
  "guardian": {
    "name": "战士",
    "skill": "猛击 2：对场上每一名敌方造成 2 点伤害"
  },
  "ranger": {
    "name": "游侠",
    "skill": "连射 4：随机攻击一名敌方；有 50% 概率再随机攻击一次"
  },
  "young_dragon": {
    "name": "雏龙",
    "skill": "龙息 1：优先攻击正前方；若该格无角色则攻击最近一列，同距离优先右侧",
    "passiveDesc": "被动·蓄能：每次发动攻击后获得 1 灵药"
  },
  "priest": {
    "name": "牧师",
    "skill": "治疗 3：为一名己方回复 3 生命；优先当前生命≤5 者，否则按生命百分比最低（可含自己）"
  },
  "rage_dragon": {
    "name": "怒龙",
    "skill": "龙焰 1：优先攻击正前方；若该格无角色则攻击最近一列，同距离优先右侧",
    "passiveDesc": "被动·血怒：造成伤害等于自身已损失生命（至少为 1）；若击杀目标可再发动一次相同攻击（消耗 3 灵药）"
  },
  "mirror_mage": {
    "name": "镜像法师",
    "skill": "奥弹 7：攻击当前生命最低的敌方；同血优先右侧",
    "passiveDesc": "被动·反击：受到伤害后，随机攻击一名敌方"
  },
  "poison_witch": {
    "name": "毒巫",
    "skill": "毒咒 7：随机一名敌方，7 点真实伤害并施加中毒",
    "passiveDesc": "被动·毒咒：攻击为真实伤害；目标中毒（一回合）：治疗效力-80%，受击额外 +1"
  },
  "poison_assassin": {
    "name": "毒刺客",
    "skill": "毒刺 8：攻击生命最高敌方并施加中毒",
    "passiveDesc": "被动·毒刃：目标中毒（一回合）：治疗效力-80%，受击额外 +1"
  },
  "round_table_guardian": {
    "name": "圆桌守卫",
    "skill": "盾击 3：优先攻击正前方；若该格无角色则攻击最近一列，同距离优先右侧",
    "passiveDesc": "被动·圆桌：己方全体受到的伤害降低；场上 1/2/3/4 名圆桌守卫时分别为 30%/50%/70%/90%（单次受伤至少 1）"
  },
  "berserker": {
    "name": "狂战士",
    "skill": "猛击 2：对场上每一名敌方造成伤害；每名依次 +1（首名 2，第二 3，第三 4…）",
    "passiveDesc": "被动·嗜血：每次攻击后，回复本次攻击总伤害的 20%；对每名敌方依次递增 +1 伤害（从基础伤害起）"
  },
  "divine_archer": {
    "name": "神箭手",
    "skill": "连射 4：每次只射一箭；基础 3 箭，每箭后按目标血线判定是否再射一箭",
    "passiveDesc": "被动·连环：每射一箭后按该箭目标当前血线判定，>50% 则 20% 再射一箭，否则 40%"
  },
  "holy_priest": {
    "name": "神圣牧师",
    "skill": "圣疗 6：为两名己方各回复 6 生命；优先≤5 血者，否则按百分比最低（仅一名时只治疗一次）",
    "passiveDesc": "被动·神圣灵光：己方受到伤害时，使该己方回复 2 生命（每名神圣牧师每回合最多 4 次）"
  },
  "dark_priest": {
    "name": "黑暗牧师",
    "skill": "暗噬 5：对随机一名敌方造成 5 伤害，并为一名己方回复 5 生命（优先≤5 血，否则按百分比最低）",
    "passiveDesc": "被动·命换：回合开始时与敌方当前生命最高者交换生命；若己方已不低于对方则不交换（交换后不超过各自最大生命）"
  },
  "heal": {
    "name": "治疗术",
    "desc": "消耗 1 点灵药。使一名己方角色回复 6 点生命"
  },
  "buff": {
    "name": "战意",
    "desc": "消耗 1 点灵药。使一名己方角色下次攻击额外造成 3 点伤害"
  },
  "skip": {
    "name": "时间停滞",
    "desc": "消耗 3 点灵药。跳过敌方下一个回合（其无法出牌与攻击）"
  },
  "bolt": {
    "name": "闪电",
    "desc": "消耗 1 点灵药。对一名敌方角色造成 2 点伤害"
  },
  "ganyu": {
    "name": "灵药",
    "desc": "获得 2 点灵药。"
  },
  "recruit": {
    "name": "招募",
    "desc": "消耗 1 点灵药。从牌库抽取 2 张牌。"
  },
  "holy_light": {
    "name": "圣光",
    "desc": "消耗 4 点灵药。将我方场上所有角色恢复至满血。"
  }
},
    en: {
  "warrior": {
    "name": "Guard",
    "skill": "Shield Bash 2: Prefer the front column; if empty, nearest column, rightmost on ties",
    "passiveDesc": "Passive · Share: Each Guard absorbs 50% damage for one ally (lowest / 2nd-lowest HP, excluding Guards)"
  },
  "mage": {
    "name": "Mage",
    "skill": "Arcane Bolt 5: Attack the lowest-HP enemy; rightmost on ties"
  },
  "assassin": {
    "name": "Assassin",
    "skill": "Assassinate 4: Attack the highest-HP enemy; rightmost on ties",
    "passiveDesc": "Passive · Blood Blade: If the target is at ≥50% HP, deal +2 true damage"
  },
  "shadow_assassin": {
    "name": "Shadow Assassin",
    "skill": "Assassinate 6: Attack the highest-HP enemy; rightmost on ties",
    "passiveDesc": "Passive · Shadow Blade: Extra 3/5/7 true damage if target remaining HP is over 50%/75%/full (highest tier only)"
  },
  "guardian": {
    "name": "Warrior",
    "skill": "Slam 2: Deal 2 damage to every enemy on the board"
  },
  "ranger": {
    "name": "Ranger",
    "skill": "Volley 4: Attack a random enemy; 50% chance to attack again"
  },
  "young_dragon": {
    "name": "Hatchling",
    "skill": "Dragon Breath 1: Prefer the front column; if empty, nearest column, rightmost on ties",
    "passiveDesc": "Passive · Charge: Gain 1 Elixir after each attack"
  },
  "priest": {
    "name": "Priest",
    "skill": "Heal 3: Restore 3 HP to an ally; prioritize current HP ≤5, else lowest HP%"
  },
  "rage_dragon": {
    "name": "Rage Dragon",
    "skill": "Dragon Flame 1: Prefer the front column; if empty, nearest column, rightmost on ties",
    "passiveDesc": "Passive · Blood Rage: Damage equals missing HP (min 1); on kill, attack again for 3 Elixir"
  },
  "mirror_mage": {
    "name": "Mirror Mage",
    "skill": "Arcane Bolt 7: Attack the lowest-HP enemy; rightmost on ties",
    "passiveDesc": "Passive · Counter: After taking damage, attack a random enemy"
  },
  "poison_witch": {
    "name": "Poison Witch",
    "skill": "Hex 7: Random enemy, 7 true damage and Poison",
    "passiveDesc": "Passive · Hex: Attacks are true damage; Poison (1 turn): healing −80%, +1 damage when hit"
  },
  "poison_assassin": {
    "name": "Venom Assassin",
    "skill": "Venom Strike 8: Attack highest-HP enemy and apply Poison",
    "passiveDesc": "Passive · Venom Blade: Poison (1 turn): healing −80%, +1 damage when hit"
  },
  "round_table_guardian": {
    "name": "Round Table Guard",
    "skill": "Shield Bash 3: Prefer the front column; if empty, nearest column, rightmost on ties",
    "passiveDesc": "Passive · Round Table: Team damage reduction 30%/50%/70%/90% with 1/2/3/4 Round Table Guards (min 1 damage)"
  },
  "berserker": {
    "name": "Berserker",
    "skill": "Slam 2: Hit every enemy; damage ramps +1 per target (2, then 3, then 4…)",
    "passiveDesc": "Passive · Bloodlust: After attacking, heal for 20% of total damage dealt; damage ramps +1 per enemy"
  },
  "divine_archer": {
    "name": "Divine Archer",
    "skill": "Volley: One arrow at a time; 3 base shots, then check HP for extra shots",
    "passiveDesc": "Passive · Chain: After each shot, 20% chance to shoot again if target >50% HP, else 40%"
  },
  "holy_priest": {
    "name": "Holy Priest",
    "skill": "Holy Heal 6: Heal two allies for 6; prioritize HP ≤5, else lowest HP%",
    "passiveDesc": "Passive · Holy Aura: When an ally takes damage, heal them for 2 (max 4 times per Holy Priest each turn)"
  },
  "dark_priest": {
    "name": "Dark Priest",
    "skill": "Dark Bite 5: Deal 5 to a random enemy and heal an ally for 5",
    "passiveDesc": "Passive · Life Swap: At turn start, swap current HP with the highest-HP enemy if yours is lower"
  },
  "heal": {
    "name": "Healing",
    "desc": "Costs 1 Elixir. Restore 6 HP to an ally."
  },
  "buff": {
    "name": "Battle Fury",
    "desc": "Costs 1 Elixir. An ally deals +3 damage on their next attack."
  },
  "skip": {
    "name": "Time Stop",
    "desc": "Costs 3 Elixir. Skip the enemy's next turn."
  },
  "bolt": {
    "name": "Lightning",
    "desc": "Costs 1 Elixir. Deal 2 damage to an enemy."
  },
  "ganyu": {
    "name": "Potion of Elixir",
    "desc": "Gain 2 Elixir."
  },
  "recruit": {
    "name": "Recruit",
    "desc": "Costs 1 Elixir. Draw 2 cards."
  },
  "holy_light": {
    "name": "Holy Light",
    "desc": "Costs 4 Elixir. Fully heal all your units."
  }
},
  };

  const UI_I18N = {
    zh: {
  "title": "四格对决 · 卡牌构筑",
  "brand": "四格对决",
  "subtitle": "人机（AI）1v1 · 初始仅可布阵角色 · 掷硬币先后手 · 共用 20 张构筑（独立洗牌）",
  "deck_build_h2": "构筑卡组（已选 {n} / 20）",
  "deck_build_h2_prefix": "构筑卡组（已选 ",
  "deck_build_h2_suffix": " / 20）",
  "btn_fill_random": "随机填满",
  "btn_clear_deck": "清空",
  "carried_h2": "当前携带",
  "btn_start_battle": "开始对战",
  "side_enemy": "敌方 · 手牌 ",
  "side_player": "我方 · 手牌 ",
  "btn_confirm_turn": "确认结束回合",
  "btn_confirm_setup": "完成布阵",
  "btn_surrender": "投降",
  "over_title_default": "对局结束",
  "btn_back_deck": "返回构筑",
  "surrender_title": "确认投降？",
  "cancel": "取消",
  "confirm": "确认",
  "close": "关闭",
  "recall": "换位 / 下阵",
  "lang_to_en": "ENG",
  "lang_to_zh": "中文",
  "aria_holy_ops": "灵药与对局操作",
  "aria_battle_log": "战斗记录",
  "aria_player_hand": "我方手牌",
  "victory": "胜利",
  "defeat": "失败",
  "upgrade": "升级",
  "upgrade_of": "升级 · {name}",
  "tier2_hero": "二级英雄",
  "skill": "技能",
  "passive": "被动",
  "attack": "攻击 {n}",
  "hp_slash": "生命 {cur} / {max}",
  "hp_meta": "生命 {hp} · 伤害 {dmg}",
  "hp_only": "生命 {hp}",
  "hp_hand": "生命 {cur}/{max}",
  "poison_stat": "中毒：治疗效力降低，受击额外伤害",
  "poison": "中毒",
  "empty_slot": "空位",
  "empty": "空",
  "click_detail": "{name} · 点击查看详情",
  "bonus_next": "下次攻击额外 {n} 点伤害",
  "bonus_next_named": "「{name}」下次攻击额外 {n} 点伤害",
  "tier2_pool": " · 二级（需场上一级对应英雄+{n}灵药升级）",
  "tier2_hand": " · 二级（点场上一级对应英雄，{n}灵药）",
  "recruit_cost": " · 对战上场{n}灵药",
  "deck_hint_need_t1": "需至少包含一张一级英雄卡（如守卫、法师、刺客、战士、游侠、雏龙、牧师等）。",
  "turn_n": "回合 {n}",
  "turn_hw_mult": " · 每回合灵药×{n}",
  "win": "胜利",
  "lose": "失败",
  "win_msg": "击败次数 {n}/{max}",
  "lose_msg": "我方被击败 {n}/{max}",
  "goal_reached": " · 已达成{n}次击败",
  "enemy_cleared": " · 敌方场上已清空",
  "player_cleared": " · 我方场上已清空",
  "surrendered": "你选择投降。",
  "battle_start_log": "对局开始。请完成己方布阵（仅可将角色牌放置上场）。",
  "coin_flipping": "掷硬币中…",
  "you_first": "你获得先手",
  "enemy_first": "敌方先手",
  "enter_your_turn": "进入你的回合",
  "enemy_acts_first": "敌方先行动",
  "you_first_log": "你为先手。",
  "enemy_first_log": "敌方先手。",
  "ai_setup_done": "人机完成布阵。",
  "player_setup_done": "我方布阵完成。",
  "status_setup": "初始布阵 · 点击场上角色可查看技能与被动 · 仅可摆放角色牌 · 效果牌呈灰阶不可用 · 点手牌上场后再点手牌栏下阵 · 完成后掷硬币定先后手",
  "status_recall": "已选上场格：点另一有角色格可换位，点空位可移动，点手牌栏下阵；再点原格取消",
  "status_enemy_setup": "人机正在布阵…",
  "status_coin": "掷硬币决定先后手…",
  "status_pick_target": "请选择目标（场上卡牌）",
  "status_your_turn": "你的回合 · 点击场上单位可查看描述 · 选中手牌后点格子上阵或替换；弹窗内可换位/下阵",
  "status_skip_enemy": " · 下回合将跳过敌方",
  "status_resolving": "结算中…",
  "status_enemy_turn": "人机行动中，请稍候… · 可点击场上单位查看描述",
  "win_hint": "击败敌方 {e}/{max} · 我方被击败 {p}/{max} · ",
  "ally": "我方",
  "enemy": "敌方",
  "true_damage": "（真实伤害）",
  "rt_note": "（圆桌护佑 {a}→{b}）",
    "t1_fallback": "对应一级",
    "dmg_word": "伤害",
    "recalled_tag": " · 下阵"
  },
  en: {
  "title": "Four Slots · Deck Builder",
  "brand": "Four Slots",
  "subtitle": "1v1 vs AI · Deploy characters first · Coin toss for turn order · Shared 20-card pool (shuffled separately)",
  "deck_build_h2": "Build Deck ({n} / 20 selected)",
  "deck_build_h2_prefix": "Build Deck (",
  "deck_build_h2_suffix": " / 20 selected)",
  "btn_fill_random": "Fill Random",
  "btn_clear_deck": "Clear",
  "carried_h2": "Your Deck",
  "btn_start_battle": "Start Battle",
  "side_enemy": "Enemy · Hand ",
  "side_player": "You · Hand ",
  "btn_confirm_turn": "End Turn",
  "btn_confirm_setup": "Finish Setup",
  "btn_surrender": "Surrender",
  "over_title_default": "Match Over",
  "btn_back_deck": "Back to Deck",
  "surrender_title": "Surrender?",
  "cancel": "Cancel",
  "confirm": "Confirm",
  "close": "Close",
  "recall": "Swap / Recall",
  "lang_to_en": "ENG",
  "lang_to_zh": "中文",
  "aria_holy_ops": "Elixir and actions",
  "aria_battle_log": "Battle log",
  "aria_player_hand": "Your hand",
  "victory": "Victory",
  "defeat": "Defeat",
  "upgrade": "Upgrade",
  "upgrade_of": "Upgrade · {name}",
  "tier2_hero": "Tier-2 Hero",
  "skill": "Skill",
  "passive": "Passive",
  "attack": "ATK {n}",
  "hp_slash": "HP {cur} / {max}",
  "hp_meta": "HP {hp} · DMG {dmg}",
  "hp_only": "HP {hp}",
  "hp_hand": "HP {cur}/{max}",
  "poison_stat": "Poison: reduced healing, extra damage when hit",
  "poison": "Poison",
  "empty_slot": "Empty",
  "empty": "Empty",
  "click_detail": "{name} · Click for details",
  "bonus_next": "Next attack +{n} damage",
  "bonus_next_named": "“{name}” next attack +{n} damage",
  "tier2_pool": " · Tier-2 (needs matching Tier-1 on board + {n} Elixir)",
  "tier2_hand": " · Tier-2 (click matching Tier-1, {n} Elixir)",
  "recruit_cost": " · Deploy costs {n} Elixir",
  "deck_hint_need_t1": "Include at least one Tier-1 hero (Guard, Mage, Assassin, Warrior, Ranger, Hatchling, Priest, etc.).",
  "turn_n": "Turn {n}",
  "turn_hw_mult": " · Elixir ×{n}/turn",
  "win": "Victory",
  "lose": "Defeat",
  "win_msg": "Defeats {n}/{max}",
  "lose_msg": "Allies defeated {n}/{max}",
  "goal_reached": " · Reached {n} defeats",
  "enemy_cleared": " · Enemy board cleared",
  "player_cleared": " · Your board cleared",
  "surrendered": "You surrendered.",
  "battle_start_log": "Battle start. Deploy your characters (characters only).",
  "coin_flipping": "Flipping coin…",
  "you_first": "You go first",
  "enemy_first": "Enemy goes first",
  "enter_your_turn": "Your turn begins",
  "enemy_acts_first": "Enemy acts first",
  "you_first_log": "You go first.",
  "enemy_first_log": "Enemy goes first.",
  "ai_setup_done": "AI finished setup.",
  "player_setup_done": "Your setup is done.",
  "status_setup": "Setup · Click board units for skills · Characters only · Effect cards are grayed out · Play then recall from the hand bar · Coin toss after setup",
  "status_recall": "Slot selected: click another unit to swap, empty slot to move, hand bar to recall; click again to cancel",
  "status_enemy_setup": "AI is deploying…",
  "status_coin": "Coin toss for turn order…",
  "status_pick_target": "Choose a target on the board",
  "status_your_turn": "Your turn · Click units for details · Select a hand card then a slot; use the popup to swap/recall",
  "status_skip_enemy": " · Enemy's next turn will be skipped",
  "status_resolving": "Resolving…",
  "status_enemy_turn": "AI is acting… · You can still click units for details",
  "win_hint": "Enemy defeated {e}/{max} · Allies defeated {p}/{max} · ",
  "ally": "Ally",
  "enemy": "Enemy",
  "true_damage": " (true damage)",
  "rt_note": " (Round Table {a}→{b})",
  "t1_fallback": "matching Tier-1",
  "dmg_word": "DMG",
  "recalled_tag": " · Recalled"
},
  };

  const RULE_I18N = {
    zh: {
  "front_nearest_right": "正前→最近→右",
  "lowest_hp": "最低生命",
  "highest_hp": "最高生命",
  "rightmost": "最右",
  "leftmost": "最左",
  "all_enemies": "全体",
  "ranger_random": "随机一·50%追加",
  "three_random": "单箭随机",
  "priest_heal": "≤5血优先/否则百分比",
  "priest_heal_two": "双目标同上",
  "dark_priest_skill": "随机伤+治疗",
  "random_living_enemy": "随机敌方"
},
    en: {
  "front_nearest_right": "Front → nearest → right",
  "lowest_hp": "Lowest HP",
  "highest_hp": "Highest HP",
  "rightmost": "Rightmost",
  "leftmost": "Leftmost",
  "all_enemies": "All enemies",
  "ranger_random": "Random · 50% extra",
  "three_random": "Single random shot",
  "priest_heal": "≤5 HP first / else %",
  "priest_heal_two": "Two targets, same rule",
  "dark_priest_skill": "Random damage + heal",
  "random_living_enemy": "Random enemy"
},
  };

  const MSG_I18N = {
    zh: {
  "chain_shot_you": "「{name}」被动·连环：再射一箭！",
  "chain_shot_enemy": "敌方「{name}」被动·连环：再射一箭！",
  "rage_again_you": "「{name}」被动·血怒：再发动一次（消耗 {cost} 灵药）。",
  "rage_fail_you": "「{name}」击杀目标，但灵药不足 {cost}，无法追击。",
  "rage_again_enemy": "敌方「{name}」被动·血怒：再发动一次（消耗 {cost} 灵药）。",
  "rage_fail_enemy": "敌方「{name}」击杀目标，但灵药不足，无法追击。",
  "life_swap": "{my}「{a}」命换：与{opp}「{b}」交换当前生命（{ha}↔{hb}）。",
  "holy_aura": "「{priest}」神圣灵光：「{target}」回复 {n} 生命。",
  "share_dmg": "「{s}」为「{t}」分担 {half} 点伤害，实际受到 {rest} 点{note}（剩余 {hp}）。",
  "dmg_to_you": "敌方对「{name}」造成 {n} 点伤害{true}{rt}（剩余 {hp}）。",
  "dmg_to_enemy": "对敌方「{name}」造成 {n} 点伤害{true}{rt}（剩余 {hp}）。",
  "counter": "「{name}」反击：随机命中「{target}」。",
  "defeated": "{side}「{name}」被击败。",
  "heal_log": "「{a}」：「{b}」回复 {n} 生命。",
  "heal_log_enemy": "敌方「{a}」：「{b}」回复 {n} 生命。",
  "lifesteal_you": "「{name}」嗜血回复 {n} 生命。",
  "lifesteal_enemy": "敌方「{name}」嗜血回复 {n} 生命。",
  "ranger_extra_you": "「{name}」连射：再射一箭！",
  "ranger_extra_enemy": "敌方「{name}」连射：再射一箭！",
  "young_hw_you": "「{name}」雏龙：获得 1 灵药。",
  "young_hw_enemy": "敌方「{name}」雏龙：获得 1 灵药。",
  "ai_place": "人机在格 {slot} 放置「{name}」。",
  "ai_swap": "人机：换下「{old}」（{ohp}/{omax}），换上「{new}」（{nhp}/{nmax}）。",
  "ai_repo_swap": "人机：调整「{a}」与「{b}」的站位。",
  "ai_repo_move": "人机：「{name}」调整站位。",
  "ai_upgrade": "人机：将「{from}」升级为「{to}」（生命 {hp}/{max}）。",
  "enemy_skipped": "敌方本回合被跳过（时间停滞）。",
  "enemy_draw1": "敌方抽 1 张牌。",
  "you_skipped": "你方回合被跳过。",
  "you_draw1": "你抽 1 张牌。",
  "ai_heal": "人机：「{card}」·「{target}」回复生命。",
  "ai_buff": "人机：「{card}」强化「{target}」。",
  "ai_gain_hw": "人机：「{name}」获得 {n} 点灵药。",
  "ai_draw_n": "人机：「{name}」抽取 {n} 张牌。",
  "ai_holy_light": "人机：「{name}」：己方全体恢复至满血。",
  "ai_time_stop": "人机：「时间停滞」— 你下一回合将被跳过。",
  "hw_need": "灵药不足：需要 {need} 点灵药（当前 {cur}）。",
  "pick_heal": "请选择一名己方角色回复生命。",
  "pick_buff": "请选择一名己方角色获得战意。",
  "ganyu_full": "灵药已满，无法使用「灵药」。",
  "gain_hw": "「{name}」：获得 {n} 点灵药。",
  "recruit_empty": "牌库已空，无法使用「招募」。",
  "draw_n": "「{name}」：抽取 {n} 张牌。",
  "holy_light_none": "场上没有己方角色，无法使用「圣光」。",
  "hw_need_named": "灵药不足：「{name}」需要 {need} 点灵药（当前 {cur}）。",
  "holy_light_done": "「{name}」：{n} 名己方角色已恢复至满血。",
  "hw_need_skip": "灵药不足：时间停滞需要 {need} 点灵药（当前 {cur}）。",
  "time_stop_used": "已使用时间停滞：敌方下一回合将被跳过。",
  "pick_bolt": "请选择一名敌方场上的角色造成伤害。",
  "hw_resolve_fail": "灵药不足，无法结算「{name}」。",
  "heal_done": "「{name}」回复 {n} 点生命{cleared}。",
  "poison_cleared": "，中毒已解除",
  "recalled": "「{name}」已下阵（生命 {hp}/{max}）。",
  "moved_empty": "「{name}」已移至空位。",
  "swapped_pos": "「{a}」与「{b}」交换位置。",
  "no_t2_setup": "布阵阶段无法使用二级英雄（请仅摆放一级英雄）。",
  "hw_need_upgrade": "灵药不足：升级需要 {need} 点（当前 {cur}）。",
  "upgraded": "「{from}」已升级为「{to}」（生命 {hp}/{max}）。",
  "upgrade_only": "「{name}」只能升级场上的「{from}」。",
  "upgrade_or_recall": "「{name}」须升级场上对应的一级；从场上「下阵」回手牌的二级可再置于空位。",
  "no_t2_empty": "当前阶段无法将二级英雄置于空位。",
  "hw_need_deploy": "灵药不足：上场「{name}」需要 {need} 点（当前 {cur}）。",
  "deployed": "「{name}」上场。",
  "t2_bad_slot": "无法将二级英雄置于该格。",
  "replaced": "换下「{old}」（{ohp}/{omax}），换上「{new}」（{nhp}/{nmax}）。",
  "fx_life": "生命 {hp} · 伤害 {dmg}"
},
    en: {
  "chain_shot_you": "“{name}” Chain Shot: fires again!",
  "chain_shot_enemy": "Enemy “{name}” Chain Shot: fires again!",
  "rage_again_you": "“{name}” Blood Rage: attacks again (costs {cost} Elixir).",
  "rage_fail_you": "“{name}” killed the target, but not enough Elixir ({cost}) to chase.",
  "rage_again_enemy": "Enemy “{name}” Blood Rage: attacks again (costs {cost} Elixir).",
  "rage_fail_enemy": "Enemy “{name}” killed the target, but not enough Elixir to chase.",
  "life_swap": "{my} “{a}” Life Swap: swapped current HP with {opp} “{b}” ({ha}↔{hb}).",
  "holy_aura": "“{priest}” Holy Aura: “{target}” heals {n}.",
  "share_dmg": "“{s}” shares damage for “{t}”: takes {half}, target takes {rest}{note} (HP left {hp}).",
  "dmg_to_you": "Enemy deals {n} damage to “{name}”{true}{rt} (HP left {hp}).",
  "dmg_to_enemy": "Deal {n} damage to enemy “{name}”{true}{rt} (HP left {hp}).",
  "counter": "“{name}” counters: hits “{target}”.",
  "defeated": "{side} “{name}” was defeated.",
  "heal_log": "“{a}”: “{b}” heals {n}.",
  "heal_log_enemy": "Enemy “{a}”: “{b}” heals {n}.",
  "lifesteal_you": "“{name}” Bloodlust heals {n}.",
  "lifesteal_enemy": "Enemy “{name}” Bloodlust heals {n}.",
  "ranger_extra_you": "“{name}” Volley: fires again!",
  "ranger_extra_enemy": "Enemy “{name}” Volley: fires again!",
  "young_hw_you": "“{name}” Hatchling: gains 1 Elixir.",
  "young_hw_enemy": "Enemy “{name}” Hatchling: gains 1 Elixir.",
  "ai_place": "AI places “{name}” in slot {slot}.",
  "ai_swap": "AI: recalls “{old}” ({ohp}/{omax}), deploys “{new}” ({nhp}/{nmax}).",
  "ai_repo_swap": "AI: swaps “{a}” and “{b}”.",
  "ai_repo_move": "AI: repositions “{name}”.",
  "ai_upgrade": "AI: upgrades “{from}” into “{to}” (HP {hp}/{max}).",
  "enemy_skipped": "Enemy turn skipped (Time Stop).",
  "enemy_draw1": "Enemy draws 1 card.",
  "you_skipped": "Your turn was skipped.",
  "you_draw1": "You draw 1 card.",
  "ai_heal": "AI: “{card}” heals “{target}”.",
  "ai_buff": "AI: “{card}” buffs “{target}”.",
  "ai_gain_hw": "AI: “{name}” gains {n} Elixir.",
  "ai_draw_n": "AI: “{name}” draws {n} cards.",
  "ai_holy_light": "AI: “{name}” fully heals all allies.",
  "ai_time_stop": "AI: Time Stop — your next turn will be skipped.",
  "hw_need": "Not enough Elixir: need {need} (have {cur}).",
  "pick_heal": "Choose an ally to heal.",
  "pick_buff": "Choose an ally to gain Battle Fury.",
  "ganyu_full": "Elixir is full; cannot use Potion of Elixir.",
  "gain_hw": "“{name}”: gain {n} Elixir.",
  "recruit_empty": "Deck is empty; cannot use Recruit.",
  "draw_n": "“{name}”: draw {n} cards.",
  "holy_light_none": "No allies on the board; cannot use Holy Light.",
  "hw_need_named": "Not enough Elixir: “{name}” needs {need} (have {cur}).",
  "holy_light_done": "“{name}”: {n} allies fully healed.",
  "hw_need_skip": "Not enough Elixir: Time Stop needs {need} (have {cur}).",
  "time_stop_used": "Time Stop used: enemy's next turn will be skipped.",
  "pick_bolt": "Choose an enemy to damage.",
  "hw_resolve_fail": "Not enough Elixir to resolve “{name}”.",
  "heal_done": "“{name}” heals {n}{cleared}.",
  "poison_cleared": ", Poison cleared",
  "recalled": "“{name}” recalled (HP {hp}/{max}).",
  "moved_empty": "“{name}” moved to an empty slot.",
  "swapped_pos": "“{a}” swapped with “{b}”.",
  "no_t2_setup": "Tier-2 heroes cannot be used during setup (Tier-1 only).",
  "hw_need_upgrade": "Not enough Elixir: upgrade needs {need} (have {cur}).",
  "upgraded": "“{from}” upgraded into “{to}” (HP {hp}/{max}).",
  "upgrade_only": "“{name}” can only upgrade “{from}” on the board.",
  "upgrade_or_recall": "“{name}” must upgrade its Tier-1; a recalled Tier-2 may redeploy to an empty slot.",
  "no_t2_empty": "Cannot place a Tier-2 hero on an empty slot right now.",
  "hw_need_deploy": "Not enough Elixir: deploying “{name}” needs {need} (have {cur}).",
  "deployed": "“{name}” enters the field.",
  "t2_bad_slot": "Cannot place a Tier-2 hero on that slot.",
  "replaced": "Recall “{old}” ({ohp}/{omax}), deploy “{new}” ({nhp}/{nmax}).",
  "fx_life": "HP {hp} · DMG {dmg}"
},
  };

  const STORAGE_KEY = "cbg-lang";

  function readLang() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === "en" || v === "zh") return v;
    } catch (e) { /* ignore */ }
    return "zh";
  }

  let lang = readLang();

  function format(template, params) {
    if (template == null) return "";
    if (!params) return String(template);
    return String(template).replace(/\{(\w+)\}/g, (_, k) =>
      params[k] != null ? String(params[k]) : ""
    );
  }

  function t(key, params) {
    const pack = UI_I18N[lang] || UI_I18N.zh;
    const fallback = UI_I18N.zh;
    return format(pack[key] != null ? pack[key] : fallback[key], params);
  }

  function tm(key, params) {
    const pack = MSG_I18N[lang] || MSG_I18N.zh;
    const fallback = MSG_I18N.zh;
    return format(pack[key] != null ? pack[key] : fallback[key], params);
  }

  function cardText(tid) {
    const pack = CARD_I18N[lang] || CARD_I18N.zh;
    return pack[tid] || CARD_I18N.zh[tid] || {};
  }

  function ruleLabel(rule) {
    const pack = RULE_I18N[lang] || RULE_I18N.zh;
    return pack[rule] || RULE_I18N.zh[rule] || rule || "";
  }

  function getLang() {
    return lang;
  }

  function setLang(next) {
    lang = next === "en" ? "en" : "zh";
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) { /* ignore */ }
    return lang;
  }

  function toggleLang() {
    return setLang(lang === "zh" ? "en" : "zh");
  }

  global.GameI18n = {
    t,
    tm,
    cardText,
    ruleLabel,
    getLang,
    setLang,
    toggleLang,
    CARD_I18N,
  };
})(typeof window !== "undefined" ? window : globalThis);
