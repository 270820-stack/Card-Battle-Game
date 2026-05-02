#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, render_card

if __name__ == "__main__":
    ensure_assets_dir()
    render_card("card-holy-priest.png", "chapel", (146, 126, 90), (30, 22, 16), (248, 220, 144), "human", 116, figure_palette=((202, 188, 146), (136, 108, 74), (244, 224, 160)), pose="staff", halo=True)
