#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, render_card

if __name__ == "__main__":
    ensure_assets_dir()
    render_card("card-assassin.png", "castle", (74, 64, 72), (20, 16, 20), (172, 150, 110), "human", 103, figure_palette=((44, 32, 28), (76, 72, 74), (152, 132, 98)), pose="daggers", shadow=True)
