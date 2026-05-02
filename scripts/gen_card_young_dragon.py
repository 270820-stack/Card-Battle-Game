#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, render_card

if __name__ == "__main__":
    ensure_assets_dir()
    render_card("card-young-dragon.png", "mountain", (120, 82, 52), (34, 18, 12), (222, 140, 82), "dragon", 107, body=(150, 88, 54), wing=(104, 58, 38))
