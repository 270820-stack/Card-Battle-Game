#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, render_card

if __name__ == "__main__":
    ensure_assets_dir()
    render_card("card-warrior.png", "castle", (122, 88, 56), (38, 24, 14), (212, 178, 110), "human", 101, figure_palette=((110, 62, 48), (126, 110, 96), (196, 164, 96)), pose="shield")
