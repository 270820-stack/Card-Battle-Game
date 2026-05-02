#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, render_card

if __name__ == "__main__":
    ensure_assets_dir()
    render_card("card-divine-archer.png", "forest", (96, 104, 72), (24, 26, 18), (228, 202, 124), "human", 115, figure_palette=((114, 124, 88), (134, 112, 82), (226, 198, 120)), pose="bow", halo=True)
