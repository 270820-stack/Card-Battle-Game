#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, render_card

if __name__ == "__main__":
    ensure_assets_dir()
    render_card("card-round-table-guardian.png", "castle", (118, 86, 54), (36, 22, 14), (222, 184, 114), "human", 113, figure_palette=((124, 72, 50), (138, 120, 108), (212, 184, 122)), pose="shield", halo=True)
