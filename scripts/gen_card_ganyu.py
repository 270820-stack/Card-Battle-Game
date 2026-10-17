#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, render_card

if __name__ == "__main__":
    ensure_assets_dir()
    render_card(
        "card-ganyu.png",
        "chapel",
        (78, 48, 96),
        (22, 14, 28),
        (186, 120, 230),
        "effect",
        122,
        effect="ganyu",
        primary=(118, 72, 168),
    )
