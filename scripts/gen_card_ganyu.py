#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, render_card

if __name__ == "__main__":
    ensure_assets_dir()
    render_card("card-ganyu.png", "chapel", (92, 100, 112), (22, 24, 34), (172, 204, 232), "effect", 122, effect="ganyu", primary=(120, 132, 146))
