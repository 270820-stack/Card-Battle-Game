#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, render_card

if __name__ == "__main__":
    ensure_assets_dir()
    render_card("card-poison-assassin.png", "swamp", (54, 76, 48), (12, 20, 12), (126, 200, 106), "human", 112, figure_palette=((42, 48, 34), (66, 80, 54), (132, 184, 106)), pose="daggers", poison=True, shadow=True)
