#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, render_card

if __name__ == "__main__":
    ensure_assets_dir()
    render_card("card-berserker.png", "mountain", (126, 70, 42), (36, 18, 12), (232, 136, 84), "human", 114, figure_palette=((126, 56, 42), (146, 98, 84), (214, 144, 92)), pose="hammer")
