#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, render_card

if __name__ == "__main__":
    ensure_assets_dir()
    render_card("card-mirror-mage.png", "ruins", (84, 78, 108), (24, 18, 34), (180, 196, 226), "human", 110, figure_palette=((82, 70, 120), (104, 112, 136), (176, 190, 214)), pose="staff")
