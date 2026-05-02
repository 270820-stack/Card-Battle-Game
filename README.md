# Card Battle Game · 四格对决
##**Demo URL:** **https://270820-stack.github.io/Card-Battle-Game/**  

## Overview (English)

**Card Battle Game** (Chinese title: *四格对决*) is a browser-based, medieval-themed **1v1 card battler** against an AI opponent. You build a **20-card deck** from a shared pool, deploy characters on a **2×4 lane board**, manage **Holy Water** (elixir-style resource), play character and effect cards, and resolve combat with skills, passives, and **tier‑2 hero upgrades**. The UI uses parchment-style panels, wooden trays, and procedural / PNG assets—no build step required; open `index.html` locally or serve the folder with any static server.

### Features

- **Deck building**: pick exactly 20 cards; random fill helper; shared pool with the AI (separate shuffled decks).
- **Battle flow**: setup phase (characters only), **coin toss** for first player, alternating turns with hand, board, and battle log.
- **Holy Water**: per-turn gain; character recruit costs; **tier‑2 upgrades** consume Holy Water when upgrading a matching tier‑1 on the board.
- **Audio & VFX**: Web Audio SFX (`sfx.js`); tier‑2 entrance sounds per hero; upgrade overlay with optional **MP4** (`assets/tier2-upgrade.mp4`, regenerable via `scripts/gen_tier2_upgrade_video.sh` if `ffmpeg` is installed).
- **Asset toolchain**: Python scripts under `scripts/` generate individual PNGs; heavy vendored deps stay out of Git (see `.gitignore`).

---

## 简介（中文）

**四格对决**是一款在浏览器中运行的**中世纪风格**的**人机 1v1 卡牌对战**小游戏。你需要从公用卡池里**构筑恰好 20 张牌**，与对方（AI）各自独立洗牌；场上为**四格一排 × 双方两排**的阵地，通过 **圣水** 费用上场角色、打出效果牌，并利用**二级英雄升级**等机制取胜。界面为木桌、木托盘、羊皮纸战报等视觉风格；**无需打包**，本地双击 `index.html` 或用任意静态服务器打开根目录即可游玩。

### 主要玩法

- **构筑**：必须选满 20 张；支持一键随机填满；与 AI 共用卡池但**独立牌堆**。
- **对战节奏**：布阵阶段仅可放角色；**掷硬币**决定先后手；回合交替，战报在右侧羊皮纸区域展示。
- **圣水**：每回合增长；上场与**二级升级**会消耗圣水（二级需场上对应一级英雄）。
- **音效与特效**：`sfx.js` 程序化音效；二级登场/升级有独立反馈与全屏短片层。
- **资源生成**：`scripts/` 下多个 `gen_*.py` 可单独生成 PNG；`.deps/`、`.vendor/` 已忽略不入库。

---


## How to run · 如何运行

### English

1. Clone or download this repository.
2. Open **`index.html`** in a modern browser (Chrome, Firefox, Safari, Edge), **or**
3. From the project root, run a static server, for example:
   ```bash
   python3 -m http.server 8080
   ```
   Then visit `http://localhost:8080`.

Some browsers restrict `file://` for media or audio; if anything misbehaves, prefer the local server.

### 中文

1. 克隆或下载本仓库。  
2. 用较新的浏览器**直接打开** `index.html`，**或**在项目根目录执行：  
   ```bash
   python3 -m http.server 8080
   ```  
   浏览器访问 `http://localhost:8080`。  

若音频或视频在 `file://` 下异常，请改用本地 HTTP 服务。

---

## Project layout · 项目结构

| Path | Description (EN) | 说明（中文） |
|------|------------------|---------------|
| `index.html` | Entry page | 入口页面 |
| `game.js` | Core game logic, UI binding | 核心逻辑与界面 |
| `styles.css` | Layout & theme | 样式与布局 |
| `sfx.js` | Web Audio SFX | Web Audio 音效 |
| `assets/` | Images, tier‑2 upgrade video | 图片与升级短片等 |
| `scripts/` | Generators, helpers, `medieval_gen/` | 资源生成脚本与库 |

---

## Regenerating assets · 资源再生

### English

- Per-asset generators: run `scripts/gen_<name>.py` (executable on Unix) from project root, or `python3 scripts/gen_<name>.py`.
- **`tier2-upgrade.mp4`**: requires [ffmpeg](https://ffmpeg.org/); run `./scripts/gen_tier2_upgrade_video.sh`.
- The deprecated one-shot `generate_medieval_assets.py` only prints instructions; use individual `gen_*.py` scripts instead.

### 中文

- 单个资源：在项目根目录执行对应的 `scripts/gen_*.py`。  
- **升级短片** `assets/tier2-upgrade.mp4`：需安装 **ffmpeg**，运行 `scripts/gen_tier2_upgrade_video.sh`。  
- `generate_medieval_assets.py` 已废弃，请改用各独立 `gen_*.py`。

---

## Requirements · 环境要求

- **Play the game**: any current desktop or mobile browser with JavaScript enabled.  
- **Regenerate PNG/MP4**: Python 3 + Pillow / NumPy where scripts need them; ffmpeg optional for video.

**游玩**：现代浏览器即可。  
**重新生成素材**：部分脚本依赖 Python 3 与图中库；短片依赖 ffmpeg（可选）。

