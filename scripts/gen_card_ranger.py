#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, render_card

if __name__ == "__main__":
    ensure_assets_dir()
    render_card("card-ranger.png", "forest", (78, 96, 64), (18, 22, 16), (186, 160, 102), "human", 106, figure_palette=((72, 90, 56), (110, 86, 62), (196, 168, 104)), pose="bow")
