#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, render_card

if __name__ == "__main__":
    ensure_assets_dir()
    render_card("card-dark-priest.png", "chapel", (88, 66, 82), (20, 14, 18), (176, 118, 174), "human", 117, figure_palette=((70, 54, 74), (108, 78, 94), (178, 122, 174)), pose="staff", shadow=True)
