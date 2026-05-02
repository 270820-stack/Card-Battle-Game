#!/usr/bin/env python3
"""
对已抠底的 wood / parchment PNG 做去绿边/紫边：
- 按透明度加权做绿幕/洋红幕去溢色（despill）
- 可选对 alpha 做 1px 收缩，去掉残留半透明彩边
"""
from __future__ import annotations

import os

import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, "assets")


def despill_green(rgb: np.ndarray, strength: np.ndarray) -> np.ndarray:
    """strength: 0..1 per pixel, higher = more correction (usually edge)."""
    r = rgb[..., 0].astype(np.float32)
    g = rgb[..., 1].astype(np.float32)
    b = rgb[..., 2].astype(np.float32)
    spill = np.maximum(0.0, g - np.maximum(r, b))
    g = g - spill * (0.72 * strength)
    rgb_out = np.stack(
        [r, g, b],
        axis=-1,
    )
    return np.clip(rgb_out, 0, 255).astype(np.uint8)


def despill_magenta_purple(rgb: np.ndarray, strength: np.ndarray) -> np.ndarray:
    """洋红幕残留多为粉紫：压低 R、B 相对 G 的过量。"""
    r = rgb[..., 0].astype(np.float32)
    g = rgb[..., 1].astype(np.float32)
    b = rgb[..., 2].astype(np.float32)
    mid_rb = (r + b) * 0.5
    spill = np.maximum(0.0, mid_rb - g)
    sub = spill * (0.55 * strength)
    r = r - sub * 0.55
    b = b - sub * 0.55
    g = g + sub * 0.12
    rgb_out = np.stack([r, g, b], axis=-1)
    return np.clip(rgb_out, 0, 255).astype(np.uint8)


def edge_weight_from_alpha(a: np.ndarray) -> np.ndarray:
    """半透明与近透明区域更需要去溢色。"""
    af = a.astype(np.float32) / 255.0
    w = 1.0 - af
    return np.clip(np.power(w, 0.38), 0.0, 1.0)


def erode_alpha_once(a: np.ndarray) -> np.ndarray:
    im = Image.fromarray(a, mode="L")
    im = im.filter(ImageFilter.MinFilter(3))
    return np.array(im, dtype=np.uint8)


def process_file(
    name: str,
    mode: str,
    erode: bool = True,
) -> None:
    path = os.path.join(ASSETS, name)
    im = Image.open(path).convert("RGBA")
    arr = np.array(im)
    rgb = arr[:, :, :3].copy()
    a = arr[:, :, 3]
    w = edge_weight_from_alpha(a)
    if mode == "green":
        rgb = despill_green(rgb, w)
    elif mode == "magenta":
        rgb = despill_magenta_purple(rgb, w)
    else:
        raise ValueError(mode)
    arr[:, :, :3] = rgb
    if erode:
        arr[:, :, 3] = erode_alpha_once(arr[:, :, 3])
    Image.fromarray(arr).save(path, optimize=True)
    print("Refined", path)


def main() -> None:
    process_file("wood-tray-left.png", "green", erode=True)
    process_file("parchment-panel.png", "magenta", erode=True)


if __name__ == "__main__":
    main()
