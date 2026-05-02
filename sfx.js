/**
 * 程序化合成音效（Web Audio API），无外部资源；首次交互后解锁播放。
 */
(function (global) {
  "use strict";

  var masterGain = null;
  var ctx = null;
  var noiseBuf = null;
  var unlocked = false;

  function getCtx() {
    if (!ctx) {
      var AC = global.AudioContext || global.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.22;
      masterGain.connect(ctx.destination);
    }
    return ctx;
  }

  function resume() {
    var c = getCtx();
    if (!c) return Promise.resolve();
    if (c.state === "suspended") return c.resume();
    return Promise.resolve();
  }

  function unlockOnce() {
    if (unlocked) return;
    unlocked = true;
    resume();
  }

  ["pointerdown", "keydown", "touchstart"].forEach(function (ev) {
    document.addEventListener(ev, unlockOnce, { capture: true, passive: true });
  });

  function now() {
    var c = getCtx();
    return c ? c.currentTime : 0;
  }

  function envOut(g, t0, peak, dur, curve) {
    var c = getCtx();
    if (!c) return;
    g.gain.cancelScheduledValues(t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + (curve || 0.012));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  }

  function tone(freq, dur, type, peak, freqEnd) {
    var c = getCtx();
    if (!c || !masterGain) return;
    var t0 = now();
    var osc = c.createOscillator();
    var g = c.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, t0);
    if (freqEnd != null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), t0 + dur * 0.95);
    }
    envOut(g, t0, peak || 0.2, dur, 0.015);
    osc.connect(g);
    g.connect(masterGain);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  function getNoiseBuffer() {
    var c = getCtx();
    if (!c || noiseBuf) return noiseBuf;
    var len = (c.sampleRate * 0.1) | 0;
    var buf = c.createBuffer(1, len, c.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    noiseBuf = buf;
    return buf;
  }

  function noiseHit(strength) {
    var c = getCtx();
    if (!c || !masterGain) return;
    var buf = getNoiseBuffer();
    if (!buf) return;
    var t0 = now();
    var src = c.createBufferSource();
    src.buffer = buf;
    var bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1800 + (strength || 5) * 40;
    bp.Q.value = 1.2;
    var g = c.createGain();
    envOut(g, t0, 0.14 + Math.min(0.12, (strength || 5) * 0.008), 0.09, 0.005);
    src.connect(bp);
    bp.connect(g);
    g.connect(masterGain);
    src.start(t0);
    src.stop(t0 + 0.1);
    tone(55 + (strength || 0) * 3, 0.11, "sine", 0.11, 32);
  }

  var GameSFX = {
    resume: resume,

    uiTap: function () {
      tone(660, 0.045, "sine", 0.09, 440);
    },

    /** 构筑：加入卡组 */
    deckAdd: function () {
      tone(520, 0.05, "triangle", 0.07, 380);
    },

    /** 效果牌飞向中央 */
    effectCast: function () {
      var c = getCtx();
      if (!c || !masterGain) return;
      var t0 = now();
      var osc = c.createOscillator();
      var g = c.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, t0);
      osc.frequency.exponentialRampToValueAtTime(220, t0 + 0.14);
      envOut(g, t0, 0.12, 0.16, 0.02);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(t0);
      osc.stop(t0 + 0.18);
    },

    cardLand: function () {
      tone(95, 0.08, "triangle", 0.14, 48);
      tone(180, 0.05, "sine", 0.05, 90);
    },

    hit: function (amount) {
      var n = typeof amount === "number" && amount > 0 ? Math.min(amount, 25) : 8;
      noiseHit(n);
    },

    heal: function () {
      var c = getCtx();
      if (!c || !masterGain) return;
      tone(784, 0.12, "sine", 0.1, 784);
      var t0 = c.currentTime + 0.07;
      var osc = c.createOscillator();
      var g = c.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(988, t0);
      envOut(g, t0, 0.09, 0.15, 0.012);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(t0);
      osc.stop(t0 + 0.18);
    },

    coin: function () {
      var c = getCtx();
      if (!c || !masterGain) return;
      var t0 = now();
      [1420, 1980].forEach(function (f, i) {
        var osc = c.createOscillator();
        var g = c.createGain();
        osc.type = "sine";
        osc.frequency.value = f;
        envOut(g, t0 + i * 0.045, 0.1, 0.22 - i * 0.04, 0.01);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(t0 + i * 0.045);
        osc.stop(t0 + i * 0.045 + 0.28);
      });
    },

    paper: function () {
      noiseHit(3);
    },

    turnEnd: function () {
      var c = getCtx();
      if (!c || !masterGain) return;
      var t0 = now();
      var osc = c.createOscillator();
      var g = c.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(300, t0);
      osc.frequency.exponentialRampToValueAtTime(120, t0 + 0.18);
      envOut(g, t0, 0.09, 0.2, 0.025);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(t0);
      osc.stop(t0 + 0.22);
    },

    battleStart: function () {
      tone(392, 0.15, "sine", 0.06, 330);
    },

    fanfareWin: function () {
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
        setTimeout(function () {
          tone(f, 0.18, "triangle", 0.1 - i * 0.015, f * 0.98);
        }, i * 95);
      });
    },

    fanfareLose: function () {
      [392, 349.23, 293.66, 246.94].forEach(function (f, i) {
        setTimeout(function () {
          tone(f, 0.22, "sine", 0.08, f * 0.95);
        }, i * 110);
      });
    },

    /**
     * 二级英雄从手牌飞入格子落地时：每张卡一种简短音色（Web Audio 合成，无外部文件）。
     * @param {string} templateId
     */
    tier2Entrance: function (templateId) {
      var id = String(templateId || "");
      function stagger(freqs, gap, type, peak) {
        freqs.forEach(function (f, i) {
          setTimeout(function () {
            tone(f, 0.15, type || "sine", peak != null ? peak : 0.1, f * 0.94);
          }, i * (gap || 72));
        });
      }
      var map = {
        shadow_assassin: function () {
          stagger([146, 196, 262], 85, "triangle", 0.11);
        },
        poison_assassin: function () {
          stagger([185, 233, 311], 78, "sawtooth", 0.07);
        },
        mirror_mage: function () {
          stagger([523, 659, 784, 988], 65, "sine", 0.095);
        },
        poison_witch: function () {
          stagger([207, 277, 349, 415], 70, "triangle", 0.085);
        },
        rage_dragon: function () {
          noiseHit(9);
          setTimeout(function () {
            tone(73, 0.22, "sawtooth", 0.1, 55);
          }, 40);
        },
        round_table_guardian: function () {
          stagger([330, 415, 494, 587], 80, "triangle", 0.1);
        },
        berserker: function () {
          stagger([110, 165, 220, 277], 68, "square", 0.065);
        },
        divine_archer: function () {
          stagger([660, 880, 990, 1175], 58, "sine", 0.09);
        },
        holy_priest: function () {
          stagger([784, 988, 1175, 1319], 75, "sine", 0.088);
        },
        dark_priest: function () {
          stagger([220, 261, 311, 349], 88, "sine", 0.075);
        },
      };
      var fn = map[id];
      if (fn) {
        fn();
        return;
      }
      var h = 0;
      for (var i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
      h = Math.abs(h);
      var base = 220 + (h % 200);
      stagger([base, base * 1.22, base * 1.48], 76, "sine", 0.09);
    },

    /**
     * T1→T2 升级时约 2 秒短片配套氛围（与画面 fx-tier2-upgrade 同步）。
     */
    tier2UpgradeReveal: function () {
      var c = getCtx();
      if (!c || !masterGain) return;
      var t0 = now();
      var chord = [196, 247, 311, 392, 494, 587];
      chord.forEach(function (f, i) {
        setTimeout(function () {
          tone(f, 0.42 + i * 0.04, "sine", 0.055 - i * 0.004, f * 1.03);
        }, i * 100);
      });
      setTimeout(function () {
        tone(880, 0.45, "triangle", 0.07, 523);
      }, 900);
      setTimeout(function () {
        tone(1046, 0.35, "sine", 0.05, 784);
      }, 1400);
    },
  };

  global.GameSFX = GameSFX;
})(typeof window !== "undefined" ? window : this);
