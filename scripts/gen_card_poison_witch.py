#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, render_card

if __name__ == "__main__":
    ensure_assets_dir()
    render_card("card-poison-witch.png", "swamp", (70, 86, 56), (18, 28, 18), (124, 188, 108), "human", 111, figure_palette=((68, 58, 48), (96, 78, 62), (166, 206, 112)), pose="staff", poison=True)
