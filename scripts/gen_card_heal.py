#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, render_card

if __name__ == "__main__":
    ensure_assets_dir()
    render_card("card-heal.png", "chapel", (132, 110, 82), (24, 20, 16), (220, 198, 142), "effect", 118, effect="heal", primary=(134, 108, 78))
