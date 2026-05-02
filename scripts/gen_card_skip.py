#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, render_card

if __name__ == "__main__":
    ensure_assets_dir()
    render_card("card-skip.png", "ruins", (84, 76, 92), (18, 14, 22), (176, 164, 126), "effect", 120, effect="skip", primary=(124, 104, 72))
