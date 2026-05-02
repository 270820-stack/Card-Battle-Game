#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, render_card

if __name__ == "__main__":
    ensure_assets_dir()
    render_card("card-bolt.png", "ruins", (74, 78, 96), (18, 18, 28), (255, 214, 116), "effect", 121, effect="bolt", primary=(120, 112, 88))
