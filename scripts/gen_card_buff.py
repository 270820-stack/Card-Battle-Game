#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, render_card

if __name__ == "__main__":
    ensure_assets_dir()
    render_card("card-buff.png", "castle", (126, 84, 54), (24, 18, 12), (220, 168, 86), "effect", 119, effect="buff", primary=(136, 94, 58))
