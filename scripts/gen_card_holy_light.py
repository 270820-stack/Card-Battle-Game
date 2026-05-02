#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, render_card

if __name__ == "__main__":
    ensure_assets_dir()
    render_card("card-holy-light.png", "chapel", (150, 130, 90), (28, 22, 16), (250, 228, 150), "effect", 124, effect="holy_light", primary=(222, 198, 132))
