#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, render_card

if __name__ == "__main__":
    ensure_assets_dir()
    render_card("card-shadow-assassin.png", "ruins", (60, 48, 82), (14, 10, 22), (164, 128, 186), "human", 104, figure_palette=((42, 28, 60), (62, 56, 88), (132, 112, 154)), pose="daggers", shadow=True)
