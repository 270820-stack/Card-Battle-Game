#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, render_card

if __name__ == "__main__":
    ensure_assets_dir()
    render_card("card-rage-dragon.png", "mountain", (132, 52, 38), (42, 12, 10), (248, 132, 74), "dragon", 109, body=(176, 54, 42), wing=(116, 30, 26))
