#!/usr/bin/env python3
"""Shared library for `scripts/gen_*.py` (one asset per command)."""
from __future__ import annotations

import math
import os
import random
from typing import Iterable

from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ASSETS = os.path.join(ROOT, "assets")


def ensure_assets_dir() -> None:
    os.makedirs(ASSETS, exist_ok=True)



def clamp(v: float, lo: float = 0, hi: float = 255) -> int:
    return int(max(lo, min(hi, v)))


def mix(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return tuple(clamp(a[i] * (1 - t) + b[i] * t) for i in range(3))


def tint(color: tuple[int, int, int], delta: int) -> tuple[int, int, int]:
    return tuple(clamp(c + delta) for c in color)


def make_gradient(size: tuple[int, int], top: tuple[int, int, int], bottom: tuple[int, int, int]) -> Image.Image:
    w, h = size
    img = Image.new("RGBA", size)
    px = img.load()
    for y in range(h):
        t = y / max(1, h - 1)
        row = mix(top, bottom, t)
        for x in range(w):
            px[x, y] = (*row, 255)
    return img


def add_noise(img: Image.Image, seed: int, amount: float = 16, blur: float = 0.7) -> Image.Image:
    rnd = random.Random(seed)
    w, h = img.size
    noise = Image.new("L", (w, h))
    px = noise.load()
    for y in range(h):
        for x in range(w):
            px[x, y] = clamp(128 + rnd.gauss(0, amount))
    noise = noise.filter(ImageFilter.GaussianBlur(blur))
    colored = Image.merge("RGBA", (noise, noise, noise, Image.new("L", (w, h), 42)))
    return Image.alpha_composite(img.convert("RGBA"), colored)


def add_vignette(img: Image.Image, strength: float = 0.22) -> Image.Image:
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    px = overlay.load()
    for y in range(h):
        vy = (y / h - 0.5) * 2
        for x in range(w):
            vx = (x / w - 0.5) * 2
            d = math.sqrt(vx * vx + vy * vy)
            a = clamp(max(0.0, min(1.0, (d - 0.2) / 0.95)) * strength * 255)
            px[x, y] = (15, 8, 4, a)
    return Image.alpha_composite(img.convert("RGBA"), overlay)


def add_bokeh(img: Image.Image, seed: int, palette: Iterable[tuple[int, int, int]], count: int = 24) -> Image.Image:
    rnd = random.Random(seed)
    w, h = img.size
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    colors = list(palette)
    for _ in range(count):
        radius = rnd.randint(max(24, w // 20), max(60, w // 9))
        x = rnd.randint(-radius, w + radius)
        y = rnd.randint(-radius, int(h * 0.72))
        fill = colors[rnd.randrange(len(colors))]
        alpha = rnd.randint(18, 42)
        draw.ellipse([x - radius, y - radius, x + radius, y + radius], fill=(*fill, alpha))
    layer = layer.filter(ImageFilter.GaussianBlur(radius=max(10, w * 0.015)))
    return Image.alpha_composite(img.convert("RGBA"), layer)


def add_glow(base: Image.Image, center: tuple[float, float], radius: float, color: tuple[int, int, int], alpha: int = 160) -> None:
    w, h = base.size
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    cx, cy = center
    draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill=(*color, alpha))
    layer = layer.filter(ImageFilter.GaussianBlur(radius=radius * 0.35))
    base.alpha_composite(layer)


def draw_ground(draw: ImageDraw.ImageDraw, w: int, h: int, color: tuple[int, int, int], roughness: float, seed: int) -> None:
    rnd = random.Random(seed)
    pts = [(0, h)]
    horizon = h * 0.76
    step = max(20, w // 18)
    for x in range(0, w + step, step):
        y = horizon + math.sin(x * 0.009 + seed) * roughness + rnd.randint(-18, 18)
        pts.append((x, y))
    pts.append((w, h))
    draw.polygon(pts, fill=color)


def draw_castle(draw: ImageDraw.ImageDraw, w: int, h: int, color: tuple[int, int, int]) -> None:
    base = int(h * 0.73)
    draw.rectangle([w * 0.18, base, w * 0.82, h], fill=color)
    towers = [
        (0.22, 0.17, 0.12),
        (0.39, 0.22, 0.14),
        (0.58, 0.24, 0.14),
        (0.74, 0.18, 0.12),
    ]
    for cx, tw, th in towers:
        left = int(w * (cx - tw / 2))
        right = int(w * (cx + tw / 2))
        top = int(base - h * th)
        draw.rectangle([left, top, right, base], fill=color)
        battlement_w = max(8, (right - left) // 5)
        for x in range(left, right, battlement_w * 2):
            draw.rectangle([x, top - battlement_w // 2, min(right, x + battlement_w), top], fill=color)
    gate_w = int(w * 0.12)
    draw.rounded_rectangle([w // 2 - gate_w // 2, base - h * 0.08, w // 2 + gate_w // 2, h], radius=gate_w // 2, fill=tint(color, -28))


def draw_forest(draw: ImageDraw.ImageDraw, w: int, h: int, color: tuple[int, int, int], seed: int) -> None:
    rnd = random.Random(seed)
    base = int(h * 0.76)
    for _ in range(22):
        x = rnd.randint(-20, w + 20)
        tree_h = rnd.randint(int(h * 0.12), int(h * 0.27))
        half = rnd.randint(18, 46)
        draw.polygon([(x, base - tree_h), (x - half, base), (x + half, base)], fill=color)
        draw.rectangle([x - max(2, half // 8), base, x + max(2, half // 8), base + tree_h * 0.24], fill=tint(color, -20))


def draw_chapel(draw: ImageDraw.ImageDraw, w: int, h: int, color: tuple[int, int, int]) -> None:
    base = int(h * 0.76)
    draw.rectangle([w * 0.23, base - h * 0.16, w * 0.77, base + h * 0.02], fill=color)
    draw.polygon([(w * 0.18, base - h * 0.16), (w * 0.5, base - h * 0.31), (w * 0.82, base - h * 0.16)], fill=tint(color, 6))
    draw.rectangle([w * 0.47, base - h * 0.38, w * 0.53, base - h * 0.16], fill=color)
    draw.rectangle([w * 0.49, base - h * 0.44, w * 0.51, base - h * 0.32], fill=color)
    draw.rectangle([w * 0.45, base - h * 0.39, w * 0.55, base - h * 0.37], fill=color)
    draw.rounded_rectangle([w * 0.44, base - h * 0.08, w * 0.56, base + h * 0.02], radius=int(w * 0.02), fill=tint(color, -20))


def draw_ruins(draw: ImageDraw.ImageDraw, w: int, h: int, color: tuple[int, int, int], seed: int) -> None:
    rnd = random.Random(seed)
    base = int(h * 0.76)
    for _ in range(10):
        x = rnd.randint(0, w)
        pillar_w = rnd.randint(max(10, w // 40), max(18, w // 26))
        pillar_h = rnd.randint(int(h * 0.12), int(h * 0.24))
        draw.rectangle([x, base - pillar_h, x + pillar_w, base], fill=color)
        draw.polygon([(x - 8, base - pillar_h), (x + pillar_w + 6, base - pillar_h - 8), (x + pillar_w, base - pillar_h), (x, base - pillar_h + 5)], fill=tint(color, 16))


def draw_mountains(draw: ImageDraw.ImageDraw, w: int, h: int, color: tuple[int, int, int]) -> None:
    peaks = [(0.16, 0.32), (0.38, 0.24), (0.61, 0.28), (0.84, 0.21)]
    for cx, height in peaks:
        base = h * 0.82
        half = w * 0.18
        draw.polygon([(w * cx, base - h * height), (w * cx - half, base), (w * cx + half, base)], fill=color)


def draw_swamp(draw: ImageDraw.ImageDraw, w: int, h: int, color: tuple[int, int, int], seed: int) -> None:
    rnd = random.Random(seed)
    base = int(h * 0.79)
    draw.rounded_rectangle([0, base, w, h], radius=0, fill=color)
    for _ in range(42):
        x = rnd.randint(0, w)
        reed_h = rnd.randint(int(h * 0.05), int(h * 0.12))
        draw.line([(x, base), (x + rnd.randint(-10, 10), base - reed_h)], fill=tint(color, 36), width=rnd.randint(2, 4))


def render_background(size: tuple[int, int], top: tuple[int, int, int], bottom: tuple[int, int, int], accent: tuple[int, int, int], scene: str, seed: int) -> Image.Image:
    w, h = size
    img = make_gradient(size, top, bottom)
    img = add_bokeh(img, seed, [accent, tint(accent, -16), tint(accent, 20)], count=30)
    draw = ImageDraw.Draw(img)
    draw_ground(draw, w, h, tint(bottom, -26), h * 0.035, seed)
    scene_color = tint(bottom, -58)
    if scene == "castle":
        draw_castle(draw, w, h, scene_color)
    elif scene == "forest":
        draw_forest(draw, w, h, scene_color, seed)
    elif scene == "chapel":
        draw_chapel(draw, w, h, scene_color)
    elif scene == "ruins":
        draw_ruins(draw, w, h, scene_color, seed)
    elif scene == "mountain":
        draw_mountains(draw, w, h, scene_color)
    elif scene == "swamp":
        draw_swamp(draw, w, h, scene_color, seed)
    add_glow(img, (w * 0.5, h * 0.34), w * 0.18, accent, 120)
    img = add_noise(img, seed + 100, amount=18)
    return add_vignette(img, 0.24)


def character_shadow(layer: Image.Image, cx: float, foot_y: float, scale: float) -> None:
    draw = ImageDraw.Draw(layer)
    draw.ellipse([cx - 92 * scale, foot_y - 10 * scale, cx + 92 * scale, foot_y + 26 * scale], fill=(0, 0, 0, 120))
    layer.alpha_composite(layer.filter(ImageFilter.GaussianBlur(radius=max(4, int(12 * scale)))))


def draw_human(
    base: Image.Image,
    palette: tuple[tuple[int, int, int], tuple[int, int, int], tuple[int, int, int]],
    accent: tuple[int, int, int],
    pose: str,
    seed: int,
    halo: bool = False,
    poison: bool = False,
    shadow: bool = False,
) -> None:
    w, h = base.size
    cx = w * 0.5
    foot = h * 0.84
    scale = min(w / 768, h / 1024)
    cloak, armor, trim = palette

    shadow_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow_layer)
    sdraw.polygon(
        [
            (cx, foot - 300 * scale),
            (cx - 120 * scale, foot - 30 * scale),
            (cx + 120 * scale, foot - 30 * scale),
        ],
        fill=(0, 0, 0, 150),
    )
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(radius=14 * scale))
    base.alpha_composite(shadow_layer)

    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    if halo:
        draw.ellipse([cx - 122 * scale, foot - 390 * scale, cx + 122 * scale, foot - 144 * scale], fill=(*accent, 92))
    draw.polygon(
        [
            (cx, foot - 310 * scale),
            (cx - 104 * scale, foot - 22 * scale),
            (cx + 104 * scale, foot - 22 * scale),
        ],
        fill=(*cloak, 235),
    )
    draw.rounded_rectangle(
        [cx - 54 * scale, foot - 260 * scale, cx + 54 * scale, foot - 56 * scale],
        radius=int(18 * scale),
        fill=(*armor, 248),
    )
    draw.rectangle([cx - 78 * scale, foot - 232 * scale, cx + 78 * scale, foot - 208 * scale], fill=(*trim, 220))
    draw.ellipse([cx - 40 * scale, foot - 380 * scale, cx + 40 * scale, foot - 300 * scale], fill=(224, 194, 160, 255))
    draw.polygon(
        [(cx - 48 * scale, foot - 336 * scale), (cx, foot - 412 * scale), (cx + 48 * scale, foot - 336 * scale)],
        fill=(*tint(cloak, -10), 255),
    )
    draw.rectangle([cx - 18 * scale, foot - 58 * scale, cx - 2 * scale, foot + 12 * scale], fill=(*tint(armor, -12), 255))
    draw.rectangle([cx + 2 * scale, foot - 58 * scale, cx + 18 * scale, foot + 12 * scale], fill=(*tint(armor, -12), 255))
    draw.rectangle([cx - 92 * scale, foot - 240 * scale, cx - 44 * scale, foot - 212 * scale], fill=(*armor, 245))
    draw.rectangle([cx + 44 * scale, foot - 240 * scale, cx + 92 * scale, foot - 212 * scale], fill=(*armor, 245))

    if pose == "shield":
        shield = [(cx + 78 * scale, foot - 250 * scale), (cx + 134 * scale, foot - 204 * scale), (cx + 118 * scale, foot - 108 * scale), (cx + 74 * scale, foot - 70 * scale), (cx + 30 * scale, foot - 106 * scale), (cx + 38 * scale, foot - 216 * scale)]
        draw.polygon(shield, fill=(122, 104, 88, 255), outline=(*tint(trim, 28), 255))
        draw.line([(cx - 124 * scale, foot - 300 * scale), (cx - 168 * scale, foot + 18 * scale)], fill=(*trim, 255), width=max(3, int(8 * scale)))
        draw.polygon([(cx - 178 * scale, foot - 332 * scale), (cx - 110 * scale, foot - 316 * scale), (cx - 146 * scale, foot - 286 * scale)], fill=(*accent, 255))
    elif pose == "staff":
        draw.line([(cx + 126 * scale, foot - 318 * scale), (cx + 96 * scale, foot + 6 * scale)], fill=(*tint(trim, -22), 255), width=max(4, int(10 * scale)))
        draw.ellipse([cx + 88 * scale, foot - 362 * scale, cx + 164 * scale, foot - 286 * scale], fill=(*accent, 214))
    elif pose == "daggers":
        draw.line([(cx - 138 * scale, foot - 290 * scale), (cx - 70 * scale, foot - 154 * scale)], fill=(*trim, 255), width=max(4, int(8 * scale)))
        draw.line([(cx + 138 * scale, foot - 290 * scale), (cx + 70 * scale, foot - 154 * scale)], fill=(*trim, 255), width=max(4, int(8 * scale)))
        draw.polygon([(cx - 146 * scale, foot - 304 * scale), (cx - 118 * scale, foot - 338 * scale), (cx - 96 * scale, foot - 288 * scale)], fill=(*accent, 255))
        draw.polygon([(cx + 146 * scale, foot - 304 * scale), (cx + 118 * scale, foot - 338 * scale), (cx + 96 * scale, foot - 288 * scale)], fill=(*accent, 255))
    elif pose == "hammer":
        draw.line([(cx - 132 * scale, foot - 324 * scale), (cx - 46 * scale, foot - 108 * scale)], fill=(*trim, 255), width=max(4, int(10 * scale)))
        draw.rectangle([cx - 174 * scale, foot - 360 * scale, cx - 104 * scale, foot - 322 * scale], fill=(*accent, 255))
    elif pose == "bow":
        draw.arc([cx - 164 * scale, foot - 332 * scale, cx - 10 * scale, foot - 64 * scale], start=296, end=70, fill=(*trim, 255), width=max(4, int(8 * scale)))
        draw.line([(cx - 42 * scale, foot - 308 * scale), (cx - 128 * scale, foot - 86 * scale)], fill=(226, 216, 188, 220), width=max(2, int(3 * scale)))
        draw.line([(cx + 26 * scale, foot - 268 * scale), (cx + 176 * scale, foot - 306 * scale)], fill=(*accent, 255), width=max(4, int(7 * scale)))
    elif pose == "banner":
        draw.line([(cx - 132 * scale, foot - 340 * scale), (cx - 132 * scale, foot + 8 * scale)], fill=(*trim, 255), width=max(4, int(8 * scale)))
        draw.polygon([(cx - 128 * scale, foot - 332 * scale), (cx + 34 * scale, foot - 290 * scale), (cx - 128 * scale, foot - 222 * scale)], fill=(*accent, 240))
    elif pose == "chalice":
        draw.polygon([(cx - 54 * scale, foot - 296 * scale), (cx + 54 * scale, foot - 296 * scale), (cx + 28 * scale, foot - 220 * scale), (cx - 28 * scale, foot - 220 * scale)], fill=(*accent, 240))
        draw.rectangle([cx - 9 * scale, foot - 220 * scale, cx + 9 * scale, foot - 150 * scale], fill=(*trim, 240))
        draw.ellipse([cx - 44 * scale, foot - 152 * scale, cx + 44 * scale, foot - 116 * scale], fill=(*trim, 225))
    elif pose == "hourglass":
        draw.line([(cx - 58 * scale, foot - 316 * scale), (cx + 58 * scale, foot - 316 * scale)], fill=(*trim, 255), width=max(4, int(8 * scale)))
        draw.line([(cx - 58 * scale, foot - 132 * scale), (cx + 58 * scale, foot - 132 * scale)], fill=(*trim, 255), width=max(4, int(8 * scale)))
        draw.polygon([(cx - 52 * scale, foot - 308 * scale), (cx + 52 * scale, foot - 308 * scale), (cx, foot - 224 * scale)], fill=(*accent, 200))
        draw.polygon([(cx, foot - 224 * scale), (cx - 52 * scale, foot - 140 * scale), (cx + 52 * scale, foot - 140 * scale)], fill=(*tint(accent, -16), 220))

    if poison:
        for ox, oy, rr in [(-118, -286, 22), (-150, -242, 16), (126, -278, 18), (82, -330, 14)]:
            draw.ellipse([cx + ox * scale - rr * scale, foot + oy * scale - rr * scale, cx + ox * scale + rr * scale, foot + oy * scale + rr * scale], fill=(92, 162, 98, 120))

    if shadow:
        veil = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        vdraw = ImageDraw.Draw(veil)
        vdraw.polygon([(cx - 176 * scale, foot - 214 * scale), (cx + 176 * scale, foot - 332 * scale), (cx + 136 * scale, foot - 18 * scale), (cx - 148 * scale, foot - 56 * scale)], fill=(48, 28, 62, 70))
        veil = veil.filter(ImageFilter.GaussianBlur(radius=14 * scale))
        layer.alpha_composite(veil)

    layer = layer.filter(ImageFilter.GaussianBlur(radius=0.5))
    base.alpha_composite(layer)


def draw_dragon(base: Image.Image, body: tuple[int, int, int], wing: tuple[int, int, int], fire: tuple[int, int, int], seed: int) -> None:
    w, h = base.size
    scale = min(w / 768, h / 1024)
    cx = w * 0.52
    cy = h * 0.56
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.polygon([(cx - 150 * scale, cy + 40 * scale), (cx - 34 * scale, cy - 110 * scale), (cx + 110 * scale, cy - 86 * scale), (cx + 180 * scale, cy + 18 * scale), (cx + 70 * scale, cy + 162 * scale), (cx - 92 * scale, cy + 126 * scale)], fill=(*body, 244))
    draw.polygon([(cx - 236 * scale, cy - 22 * scale), (cx - 86 * scale, cy - 212 * scale), (cx - 18 * scale, cy + 8 * scale)], fill=(*wing, 228))
    draw.polygon([(cx + 32 * scale, cy - 18 * scale), (cx + 212 * scale, cy - 192 * scale), (cx + 148 * scale, cy + 38 * scale)], fill=(*wing, 228))
    draw.polygon([(cx + 120 * scale, cy - 118 * scale), (cx + 194 * scale, cy - 146 * scale), (cx + 160 * scale, cy - 54 * scale)], fill=(*tint(body, -10), 255))
    draw.polygon([(cx + 174 * scale, cy - 138 * scale), (cx + 206 * scale, cy - 172 * scale), (cx + 196 * scale, cy - 124 * scale)], fill=(*tint(fire, 24), 255))
    draw.polygon([(cx + 184 * scale, cy - 122 * scale), (cx + 250 * scale, cy - 106 * scale), (cx + 192 * scale, cy - 64 * scale)], fill=(*fire, 224))
    draw.ellipse([cx + 144 * scale, cy - 120 * scale, cx + 158 * scale, cy - 104 * scale], fill=(255, 240, 210, 255))
    draw.ellipse([cx - 30 * scale, cy + 152 * scale, cx + 36 * scale, cy + 174 * scale], fill=(0, 0, 0, 110))
    layer = layer.filter(ImageFilter.GaussianBlur(radius=0.7))
    base.alpha_composite(layer)


def draw_effect_icon(base: Image.Image, kind: str, primary: tuple[int, int, int], accent: tuple[int, int, int], seed: int) -> None:
    w, h = base.size
    scale = min(w / 768, h / 1024)
    cx = w * 0.5
    cy = h * 0.53
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)

    if kind == "heal":
        draw.polygon([(cx - 92 * scale, cy + 80 * scale), (cx - 32 * scale, cy - 128 * scale), (cx + 40 * scale, cy - 108 * scale), (cx + 92 * scale, cy + 80 * scale)], fill=(*primary, 238))
        draw.ellipse([cx - 58 * scale, cy - 84 * scale, cx + 58 * scale, cy + 8 * scale], fill=(*accent, 160))
        draw.rectangle([cx - 16 * scale, cy - 42 * scale, cx + 16 * scale, cy + 48 * scale], fill=(240, 235, 214, 255))
        draw.rectangle([cx - 58 * scale, cy - 6 * scale, cx + 58 * scale, cy + 26 * scale], fill=(240, 235, 214, 255))
    elif kind == "buff":
        draw.line([(cx - 132 * scale, cy - 180 * scale), (cx - 132 * scale, cy + 150 * scale)], fill=(*tint(primary, -40), 255), width=max(6, int(10 * scale)))
        draw.polygon([(cx - 124 * scale, cy - 176 * scale), (cx + 120 * scale, cy - 116 * scale), (cx - 124 * scale, cy - 18 * scale)], fill=(*accent, 240))
        draw.line([(cx - 108 * scale, cy - 104 * scale), (cx + 42 * scale, cy - 72 * scale)], fill=(248, 232, 190, 180), width=max(4, int(8 * scale)))
    elif kind == "skip":
        draw.rectangle([cx - 80 * scale, cy - 176 * scale, cx + 80 * scale, cy - 148 * scale], fill=(*primary, 255))
        draw.rectangle([cx - 80 * scale, cy + 148 * scale, cx + 80 * scale, cy + 176 * scale], fill=(*primary, 255))
        draw.polygon([(cx - 72 * scale, cy - 144 * scale), (cx + 72 * scale, cy - 144 * scale), (cx, cy - 24 * scale)], fill=(*accent, 220))
        draw.polygon([(cx, cy - 24 * scale), (cx - 72 * scale, cy + 144 * scale), (cx + 72 * scale, cy + 144 * scale)], fill=(*tint(accent, -18), 220))
    elif kind == "bolt":
        pts = [(cx - 34 * scale, cy - 192 * scale), (cx + 18 * scale, cy - 88 * scale), (cx - 10 * scale, cy - 86 * scale), (cx + 72 * scale, cy + 84 * scale), (cx + 10 * scale, cy + 80 * scale), (cx + 38 * scale, cy + 198 * scale), (cx - 82 * scale, cy + 24 * scale), (cx - 20 * scale, cy + 28 * scale)]
        draw.polygon(pts, fill=(*accent, 245))
    elif kind == "ganyu":
        draw.ellipse([cx - 134 * scale, cy - 60 * scale, cx + 134 * scale, cy + 46 * scale], fill=(*primary, 210))
        for offset in (-92, -44, 6, 56, 108):
            draw.line([(cx + offset * scale, cy + 18 * scale), (cx + (offset - 18) * scale, cy + 160 * scale)], fill=(*accent, 235), width=max(4, int(7 * scale)))
        draw.ellipse([cx - 102 * scale, cy - 20 * scale, cx - 14 * scale, cy + 72 * scale], fill=(*primary, 220))
        draw.ellipse([cx - 28 * scale, cy - 58 * scale, cx + 82 * scale, cy + 62 * scale], fill=(*primary, 220))
    elif kind == "recruit":
        draw.rectangle([cx - 118 * scale, cy - 136 * scale, cx + 64 * scale, cy + 118 * scale], fill=(*primary, 230))
        draw.line([(cx - 92 * scale, cy - 90 * scale), (cx + 24 * scale, cy - 90 * scale)], fill=(*tint(primary, -54), 220), width=max(3, int(5 * scale)))
        draw.line([(cx - 92 * scale, cy - 44 * scale), (cx + 24 * scale, cy - 44 * scale)], fill=(*tint(primary, -54), 220), width=max(3, int(5 * scale)))
        draw.line([(cx - 92 * scale, cy + 2 * scale), (cx + 24 * scale, cy + 2 * scale)], fill=(*tint(primary, -54), 220), width=max(3, int(5 * scale)))
        draw.polygon([(cx + 20 * scale, cy - 34 * scale), (cx + 150 * scale, cy - 8 * scale), (cx + 126 * scale, cy + 140 * scale), (cx + 42 * scale, cy + 122 * scale)], fill=(*accent, 240))
    elif kind == "holy_light":
        draw.rectangle([cx - 46 * scale, cy - 130 * scale, cx + 46 * scale, cy + 136 * scale], fill=(*primary, 235))
        draw.rectangle([cx - 92 * scale, cy - 20 * scale, cx + 92 * scale, cy + 28 * scale], fill=(*primary, 235))
        for angle in range(0, 360, 30):
            rad = math.radians(angle)
            draw.line([(cx, cy - 26 * scale), (cx + math.cos(rad) * 198 * scale, cy - 26 * scale + math.sin(rad) * 198 * scale)], fill=(*accent, 175), width=max(4, int(8 * scale)))

    layer = layer.filter(ImageFilter.GaussianBlur(radius=0.6))
    base.alpha_composite(layer)


def add_card_frame(base: Image.Image, accent: tuple[int, int, int]) -> None:
    w, h = base.size
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    inset = int(min(w, h) * 0.035)
    draw.rounded_rectangle([inset, inset, w - inset, h - inset], radius=int(w * 0.04), outline=(*accent, 180), width=max(4, w // 128))
    draw.rounded_rectangle([inset + 12, inset + 12, w - inset - 12, h - inset - 12], radius=int(w * 0.03), outline=(*tint(accent, -26), 110), width=max(2, w // 220))
    arch = [(w * 0.28, h * 0.16), (w * 0.5, h * 0.08), (w * 0.72, h * 0.16), (w * 0.72, h * 0.24), (w * 0.28, h * 0.24)]
    draw.line(arch + [arch[0]], fill=(*tint(accent, 18), 90), width=max(2, w // 260))
    for x, y in [(w * 0.18, h * 0.18), (w * 0.82, h * 0.18), (w * 0.18, h * 0.82), (w * 0.82, h * 0.82)]:
        rr = w * 0.05
        draw.ellipse([x - rr, y - rr, x + rr, y + rr], outline=(*tint(accent, 10), 110), width=max(2, w // 220))
    layer = layer.filter(ImageFilter.GaussianBlur(radius=0.3))
    base.alpha_composite(layer)


def save(img: Image.Image, filename: str) -> None:
    out = os.path.join(ASSETS, filename)
    img.save(out, "PNG", optimize=True)
    print("Wrote", out)


def render_card(filename: str, scene: str, top: tuple[int, int, int], bottom: tuple[int, int, int], accent: tuple[int, int, int], kind: str, seed: int, figure_palette: tuple[tuple[int, int, int], tuple[int, int, int], tuple[int, int, int]] | None = None, **kwargs) -> None:
    img = render_background((768, 1024), top, bottom, accent, scene, seed)
    if kind == "dragon":
        draw_dragon(img, kwargs["body"], kwargs["wing"], accent, seed)
    elif kind == "effect":
        draw_effect_icon(img, kwargs["effect"], kwargs["primary"], accent, seed)
    else:
        draw_human(img, figure_palette or ((70, 50, 42), (110, 96, 84), (184, 154, 94)), accent, kwargs.get("pose", "shield"), seed, halo=kwargs.get("halo", False), poison=kwargs.get("poison", False), shadow=kwargs.get("shadow", False))
    add_card_frame(img, tint(accent, -12))
    save(img, filename)


def gen_table_background() -> None:
    w, h = 1920, 1080
    img = Image.new("RGB", (w, h))
    px = img.load()
    rnd = random.Random(7)
    for y in range(h):
        for x in range(w):
            band = math.sin(x * 0.012) * 18 + math.sin(y * 0.008 + x * 0.003) * 12
            grain = rnd.gauss(0, 6)
            r = int(52 + band * 0.4 + grain)
            g = int(38 + band * 0.35 + grain * 0.9)
            b = int(24 + band * 0.25 + grain * 0.7)
            u, v = (x / w - 0.5) * 2, (y / h - 0.5) * 2
            vig = 1.0 - 0.28 * (u * u + v * v) ** 0.5
            r = max(0, min(255, int(r * vig)))
            g = max(0, min(255, int(g * vig)))
            b = max(0, min(255, int(b * vig)))
            px[x, y] = (r, g, b)
    img = img.filter(ImageFilter.GaussianBlur(radius=0.4))
    save(img, "table-background.png")


def gen_wood_tray_left() -> None:
    w, h = 180, 900
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    px = img.load()
    rnd = random.Random(11)
    for y in range(h):
        for x in range(w):
            gx = math.sin(y * 0.04 + x * 0.08) * 25
            gy = rnd.gauss(0, 5)
            edge = 1.0 - abs(x / (w - 1) - 0.5) * 0.35
            r = int((48 + gx * 0.3 + gy) * edge)
            g = int((32 + gx * 0.25 + gy * 0.9) * edge)
            b = int((18 + gx * 0.2 + gy * 0.7) * edge)
            px[x, y] = (max(0, min(255, r)), max(0, min(255, g)), max(0, min(255, b)), 255)
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle([6, 6, w - 7, h - 7], radius=14, outline=(95, 72, 42, 255), width=3)
    draw.rounded_rectangle([10, 10, w - 11, h - 11], radius=12, outline=(40, 28, 18, 200), width=1)
    for i in range(3):
        draw.line([(14 + i, 20), (14 + i, h - 20)], fill=(120, 95, 65, 40), width=1)
    save(img, "wood-tray-left.png")


def gen_parchment() -> None:
    w, h = 480, 1100
    img = Image.new("RGB", (w, h))
    px = img.load()
    rnd = random.Random(99)
    for y in range(h):
        for x in range(w):
            cx = (x / w - 0.5) * 2
            cy = (y / h - 0.5) * 2
            edge = 1.0 - 0.22 * (cx * cx + cy * cy) ** 0.5
            n = rnd.gauss(0, 4)
            r = int((218 + n) * edge)
            g = int((198 + n * 0.9) * edge)
            b = int((165 + n * 0.7) * edge)
            px[x, y] = (max(0, min(255, r)), max(0, min(255, g)), max(0, min(255, b)))
    img = img.filter(ImageFilter.GaussianBlur(radius=0.35))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle([8, 8, w - 9, h - 9], radius=8, outline=(120, 95, 62), width=2)
    draw.rounded_rectangle([12, 12, w - 13, h - 13], radius=6, outline=(180, 155, 120), width=1)
    save(img, "parchment-panel.png")


def gen_arena_mat() -> None:
    w, h = 920, 720
    img = Image.new("RGB", (w, h))
    px = img.load()
    rnd = random.Random(3)
    for y in range(h):
        for x in range(w):
            felt = math.sin(x * 0.02) * 4 + math.sin(y * 0.025) * 4 + rnd.gauss(0, 3)
            r = int(32 + felt * 0.4)
            g = int(48 + felt * 0.5)
            b = int(36 + felt * 0.35)
            u = (x / w - 0.5) * 2
            v = (y / h - 0.5) * 2
            vig = 1.0 - 0.12 * (u * u + v * v) ** 0.5
            px[x, y] = (
                max(0, min(255, int(r * vig))),
                max(0, min(255, int(g * vig))),
                max(0, min(255, int(b * vig))),
            )
    draw = ImageDraw.Draw(img)
    m = 18
    draw.rounded_rectangle([m, m, w - m - 1, h - m - 1], radius=20, outline=(110, 88, 48), width=4)
    draw.rounded_rectangle([m + 4, m + 4, w - m - 5, h - m - 5], radius=16, outline=(65, 52, 32), width=2)
    for t in range(0, 360, 14):
        rad = math.radians(t)
        cx, cy = w / 2 + (w / 2 - m - 8) * math.cos(rad), h / 2 + (h / 2 - m - 8) * math.sin(rad)
        draw.ellipse([cx - 2, cy - 2, cx + 2, cy + 2], fill=(95, 78, 48))
    save(img, "arena-mat.png")


def draw_rune_line(draw: ImageDraw.ImageDraw, x1: float, y1: float, x2: float, y2: float, fill: tuple[int, int, int, int], width: int = 2) -> None:
    draw.line([(x1, y1), (x2, y2)], fill=fill, width=width)


def gen_card_back_gold() -> None:
    w, h = 400, 560
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    px = img.load()
    for y in range(h):
        for x in range(w):
            u = x / (w - 1)
            v = y / (h - 1)
            cx, cy = 0.5, 0.45
            d = math.hypot(u - cx, (v - cy) * 1.05)
            gold = 1.0 - d * 0.55
            r = int(185 * gold + 40 * (1 - gold))
            g = int(140 * gold + 35 * (1 - gold))
            b = int(48 * gold + 20 * (1 - gold))
            sheen = 0.08 * math.sin(u * math.pi * 3) * math.sin(v * math.pi * 2)
            r = max(0, min(255, int(r + sheen * 80)))
            g = max(0, min(255, int(g + sheen * 60)))
            b = max(0, min(255, int(b + sheen * 25)))
            px[x, y] = (r, g, b, 255)
    draw = ImageDraw.Draw(img)
    margin = 12
    draw.rounded_rectangle(
        [margin, margin, w - margin - 1, h - margin - 1],
        radius=10,
        outline=(95, 70, 28, 255),
        width=3,
    )
    draw.rounded_rectangle(
        [margin + 4, margin + 4, w - margin - 5, h - margin - 5],
        radius=8,
        outline=(220, 175, 80, 180),
        width=1,
    )
    rune_color = (110, 75, 22, 255)
    thin = 2
    cx, cy = w / 2, h * 0.38
    r = min(w, h) * 0.22
    for k in range(8):
        a0 = k * math.pi / 4
        a1 = a0 + math.pi / 8
        x1, y1 = cx + r * math.cos(a0), cy + r * math.sin(a0) * 0.85
        x2, y2 = cx + r * 0.55 * math.cos(a1), cy + r * 0.55 * math.sin(a1) * 0.85
        draw_rune_line(draw, x1, y1, x2, y2, rune_color, thin)
    for s in (0.65, 0.45):
        rr = r * s
        pts = []
        for k in range(4):
            ang = math.pi / 2 * k - math.pi / 4
            pts.append((cx + rr * math.cos(ang), cy + rr * math.sin(ang) * 0.9))
        draw.polygon(pts, outline=rune_color, width=2)
    rnd = random.Random(5)
    for _ in range(42):
        x = margin + 20 + rnd.random() * (w - 2 * margin - 40)
        y = margin + 80 + rnd.random() * (h - 2 * margin - 200)
        ln = 6 + rnd.random() * 14
        ang = rnd.random() * math.pi * 2
        x2 = x + ln * math.cos(ang)
        y2 = y + ln * math.sin(ang)
        draw_rune_line(draw, x, y, x2, y2, (85 + rnd.randint(0, 25), 60 + rnd.randint(0, 20), 18, 255), 1)
    cy2 = h * 0.78
    draw.ellipse([cx - 38, cy2 - 38, cx + 38, cy2 + 38], outline=rune_color, width=2)
    draw.ellipse([cx - 22, cy2 - 22, cx + 22, cy2 + 22], outline=(140, 105, 40, 200), width=1)
    for i in range(6):
        ang = i * math.pi / 3
        x1 = cx + 30 * math.cos(ang)
        y1 = cy2 + 30 * math.sin(ang)
        x2 = cx + 22 * math.cos(ang)
        y2 = cy2 + 22 * math.sin(ang)
        draw_rune_line(draw, x1, y1, x2, y2, rune_color, 2)
    save(img, "card-back.png")


def gen_medieval_card_frame() -> None:
    w, h = 512, 768
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle([10, 10, w - 11, h - 11], radius=26, outline=(138, 106, 64, 255), width=10)
    draw.rounded_rectangle([26, 26, w - 27, h - 27], radius=20, outline=(66, 48, 28, 220), width=4)
    draw.arc([w * 0.18, h * 0.08, w * 0.82, h * 0.38], start=182, end=358, fill=(205, 174, 110, 120), width=6)
    for x, y in [(70, 72), (w - 70, 72), (70, h - 72), (w - 70, h - 72)]:
        draw.ellipse([x - 26, y - 26, x + 26, y + 26], outline=(186, 154, 96, 135), width=5)
        draw.ellipse([x - 10, y - 10, x + 10, y + 10], fill=(94, 70, 42, 180))
    img = img.filter(ImageFilter.GaussianBlur(radius=0.2))
    save(img, "medieval-card-frame.png")


def gen_fx_hit_cracks() -> None:
    w, h = 360, 480
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    center = (w * 0.5, h * 0.42)
    rnd = random.Random(17)
    for angle in range(0, 360, 24):
        rad = math.radians(angle + rnd.randint(-8, 8))
        dist = rnd.randint(80, 200)
        x2 = center[0] + math.cos(rad) * dist
        y2 = center[1] + math.sin(rad) * dist
        draw.line([center, (x2, y2)], fill=(34, 22, 16, 210), width=3)
        for branch in (0.28, 0.54, 0.72):
            bx = center[0] + (x2 - center[0]) * branch
            by = center[1] + (y2 - center[1]) * branch
            brad = rad + math.radians(rnd.randint(-46, 46))
            blen = rnd.randint(18, 58)
            draw.line([(bx, by), (bx + math.cos(brad) * blen, by + math.sin(brad) * blen)], fill=(52, 34, 26, 180), width=2)
    img = img.filter(ImageFilter.GaussianBlur(radius=0.3))
    save(img, "fx-hit-cracks.png")


def gen_fx_arrow_streak() -> None:
    w, h = 512, 64
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle([0, h * 0.28, w * 0.82, h * 0.72], radius=14, fill=(192, 154, 86, 210))
    draw.polygon([(w * 0.72, h * 0.18), (w, h * 0.5), (w * 0.72, h * 0.82)], fill=(238, 210, 146, 240))
    for i in range(8):
        x = i * w * 0.1
        draw.line([(x, h * 0.5), (x + 40, h * 0.5)], fill=(255, 240, 202, 70), width=2)
    img = img.filter(ImageFilter.GaussianBlur(radius=1.1))
    save(img, "fx-arrow-streak.png")


def gen_fx_lightning_bolt() -> None:
    w, h = 220, 260
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    pts = [(92, 8), (144, 92), (118, 92), (176, 188), (134, 188), (152, 252), (40, 126), (90, 126)]
    draw.polygon(pts, fill=(255, 228, 140, 240))
    glow = img.filter(ImageFilter.GaussianBlur(radius=18))
    glow = ImageChops.multiply(glow, Image.new("RGBA", (w, h), (255, 220, 170, 255)))
    img = Image.alpha_composite(glow, img)
    save(img, "fx-lightning-bolt.png")


def gen_fx_mage_orb() -> None:
    w, h = 180, 180
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    for r, a in [(74, 48), (58, 80), (42, 150), (24, 220)]:
        draw.ellipse([w / 2 - r, h / 2 - r, w / 2 + r, h / 2 + r], fill=(148, 120, 92, a))
    draw.ellipse([w * 0.36, h * 0.3, w * 0.48, h * 0.42], fill=(255, 246, 218, 120))
    img = img.filter(ImageFilter.GaussianBlur(radius=0.8))
    save(img, "fx-mage-orb.png")


def gen_fx_warrior_slash() -> None:
    w, h = 320, 320
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    for offset, alpha in [(-24, 90), (0, 180), (22, 120)]:
        draw.polygon([(36, 230 + offset), (130, 126 + offset), (286, 76 + offset), (220, 166 + offset), (286, 126 + offset), (122, 248 + offset)], fill=(236, 214, 170, alpha))
    img = img.filter(ImageFilter.GaussianBlur(radius=1.0))
    save(img, "fx-warrior-slash.png")


def gen_fx_guardian_slam() -> None:
    w, h = 360, 360
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    center = (w / 2, h / 2)
    for r, a in [(48, 180), (96, 110), (142, 72)]:
        draw.ellipse([center[0] - r, center[1] - r, center[0] + r, center[1] + r], outline=(178, 146, 96, a), width=12)
    for angle in range(0, 360, 22):
        rad = math.radians(angle)
        draw.line([center, (center[0] + math.cos(rad) * 152, center[1] + math.sin(rad) * 152)], fill=(226, 200, 144, 70), width=6)
    img = img.filter(ImageFilter.GaussianBlur(radius=1.2))
    save(img, "fx-guardian-slam.png")


