#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, render_card

if __name__ == "__main__":
    ensure_assets_dir()
    render_card("card-recruit.png", "castle", (124, 92, 66), (26, 18, 12), (208, 172, 114), "effect", 123, effect="recruit", primary=(214, 192, 156))
