#!/usr/bin/env python3
"""One-off: render card-back.png for battle UI."""
from __future__ import annotations

import math
import os

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "card-back.png")
W, H = 400, 560


def main() -> None:
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    px = img.load()

    for y in range(H):
        t = y / (H - 1)
        for x in range(W):
            u = x / (W - 1)
            # Dark purple-brown vignette
            cx, cy = 0.5, 0.42
            d = math.hypot(u - cx, (v := (y / H) - cy) * 1.1)
            base_r = int(18 + 22 * (1 - min(1.0, d * 1.35)))
            base_g = int(14 + 18 * (1 - min(1.0, d * 1.2)))
            base_b = int(28 + 32 * (1 - min(1.0, d * 1.25)))
            # subtle vertical sheen
            sheen = 0.06 * math.sin(u * math.pi * 2) * math.sin(t * math.pi)
            base_r = max(0, min(255, int(base_r + sheen * 40)))
            base_g = max(0, min(255, int(base_g + sheen * 35)))
            base_b = max(0, min(255, int(base_b + sheen * 45)))
            px[x, y] = (base_r, base_g, base_b, 255)

    draw = ImageDraw.Draw(img)

    # Outer frame
    margin = 10
    draw.rounded_rectangle(
        [margin, margin, W - margin, H - margin],
        radius=14,
        outline=(120, 95, 55, 255),
        width=3,
    )
    draw.rounded_rectangle(
        [margin + 5, margin + 5, W - margin - 5, H - margin - 5],
        radius=12,
        outline=(70, 58, 42, 200),
        width=1,
    )

    # Inner diamond / emblem area
    cx, cy = W // 2, int(H * 0.38)
    r = min(W, H) // 5
    pts = []
    for k in range(4):
        ang = math.pi / 2 * k - math.pi / 4
        pts.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
    draw.polygon(pts, outline=(95, 78, 48, 220), width=2)

    # Small inner diamond
    r2 = r * 0.55
    pts2 = []
    for k in range(4):
        ang = math.pi / 2 * k - math.pi / 4
        pts2.append((cx + r2 * math.cos(ang), cy + r2 * math.sin(ang)))
    draw.polygon(pts2, outline=(130, 105, 62, 160), width=1)

    # Bottom arc ornament
    for i in range(7):
        ax = W // 2 + (i - 3) * 28
        ay = int(H * 0.78)
        draw.ellipse([ax - 4, ay - 4, ax + 4, ay + 4], fill=(85, 70, 48, 180))

    img.save(OUT, "PNG", optimize=True)
    print("Wrote", OUT)


if __name__ == "__main__":
    main()
