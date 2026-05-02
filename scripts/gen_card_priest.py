#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, render_card

if __name__ == "__main__":
    ensure_assets_dir()
    render_card("card-priest.png", "chapel", (118, 104, 76), (28, 22, 16), (210, 182, 132), "human", 108, figure_palette=((154, 142, 118), (116, 92, 64), (206, 180, 128)), pose="staff", halo=True)
