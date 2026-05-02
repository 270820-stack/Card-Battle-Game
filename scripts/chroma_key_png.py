#!/usr/bin/env python3
"""Chroma-key PNG + 去绿边/紫边（despill）+ 可选 alpha 收缩。"""
from __future__ import annotations

import argparse
import os

import numpy as np
from PIL import Image, ImageFilter


def hex_to_rgb(h: str) -> tuple[int, int, int]:
    h = h.strip().lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def edge_weight_from_alpha(a: np.ndarray) -> np.ndarray:
    af = a.astype(np.float32) / 255.0
    w = 1.0 - af
    return np.clip(np.power(w, 0.38), 0.0, 1.0)


def despill_green(rgb: np.ndarray, strength: np.ndarray) -> None:
    r = rgb[..., 0].astype(np.float32)
    g = rgb[..., 1].astype(np.float32)
    b = rgb[..., 2].astype(np.float32)
    spill = np.maximum(0.0, g - np.maximum(r, b))
    g = g - spill * (0.72 * strength)
    rgb[..., 0] = np.clip(r, 0, 255)
    rgb[..., 1] = np.clip(g, 0, 255)
    rgb[..., 2] = np.clip(b, 0, 255)


def despill_magenta_purple(rgb: np.ndarray, strength: np.ndarray) -> None:
    r = rgb[..., 0].astype(np.float32)
    g = rgb[..., 1].astype(np.float32)
    b = rgb[..., 2].astype(np.float32)
    mid_rb = (r + b) * 0.5
    spill = np.maximum(0.0, mid_rb - g)
    sub = spill * (0.55 * strength)
    r = r - sub * 0.55
    b = b - sub * 0.55
    g = g + sub * 0.12
    rgb[..., 0] = np.clip(r, 0, 255)
    rgb[..., 1] = np.clip(g, 0, 255)
    rgb[..., 2] = np.clip(b, 0, 255)


def chroma_key_process(
    src: str,
    out: str,
    key_rgb: tuple[int, int, int],
    tol: float,
    feather: float,
    despill_mode: str | None,
    erode_alpha: bool,
) -> None:
    im = Image.open(src).convert("RGBA")
    arr = np.array(im)
    rgb = arr[:, :, :3].astype(np.float32)
    key = np.array(key_rgb, dtype=np.float32)
    d = np.linalg.norm(rgb - key[None, None, :], axis=2)
    t0, t1 = float(tol), float(tol + feather)
    a = np.clip((d - t0) / (t1 - t0), 0.0, 1.0)
    new_a = (a * arr[:, :, 3].astype(np.float32)).astype(np.uint8)
    arr[:, :, 3] = new_a

    if despill_mode:
        w = edge_weight_from_alpha(arr[:, :, 3])
        if despill_mode == "green":
            despill_green(arr[:, :, :3], w)
        elif despill_mode == "magenta":
            despill_magenta_purple(arr[:, :, :3], w)

    if erode_alpha:
        a2 = arr[:, :, 3]
        im_a = Image.fromarray(a2, mode="L")
        im_a = im_a.filter(ImageFilter.MinFilter(3))
        arr[:, :, 3] = np.array(im_a, dtype=np.uint8)

    out_dir = os.path.dirname(os.path.abspath(out))
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)
    Image.fromarray(arr).save(out, optimize=True)
    print("Wrote", out)


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("src")
    p.add_argument("out")
    p.add_argument("--key", default="00ff00", help="hex RGB chroma")
    p.add_argument("--tol", type=float, default=62)
    p.add_argument("--feather", type=float, default=48)
    p.add_argument(
        "--despill",
        choices=("none", "green", "magenta"),
        default="green",
        help="绿幕用 green，洋红幕用 magenta；已合成图用 none",
    )
    p.add_argument("--no-erode", action="store_true", help="不做 alpha 1px 收缩")
    args = p.parse_args()
    mode = None if args.despill == "none" else args.despill
    chroma_key_process(
        args.src,
        args.out,
        hex_to_rgb(args.key),
        args.tol,
        args.feather,
        mode,
        erode_alpha=not args.no_erode,
    )


if __name__ == "__main__":
    main()
