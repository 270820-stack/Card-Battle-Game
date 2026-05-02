#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, render_card

if __name__ == "__main__":
    ensure_assets_dir()
    render_card("card-mage.png", "ruins", (78, 70, 98), (26, 22, 34), (180, 158, 112), "human", 102, figure_palette=((74, 56, 118), (110, 112, 134), (214, 188, 120)), pose="staff")
