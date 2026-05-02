#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, render_card

if __name__ == "__main__":
    ensure_assets_dir()
    render_card("card-guardian.png", "mountain", (106, 80, 58), (34, 24, 16), (198, 164, 98), "human", 105, figure_palette=((114, 70, 46), (134, 118, 98), (202, 172, 108)), pose="hammer")
