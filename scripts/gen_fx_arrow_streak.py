#!/usr/bin/env python3
import os
import sys

_SCRIPTS = os.path.dirname(os.path.abspath(__file__))
if _SCRIPTS not in sys.path:
    sys.path.insert(0, _SCRIPTS)

from medieval_gen.core import ensure_assets_dir, gen_fx_arrow_streak

if __name__ == "__main__":
    ensure_assets_dir()
    gen_fx_arrow_streak()
