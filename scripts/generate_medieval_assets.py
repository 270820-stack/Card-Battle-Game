#!/usr/bin/env python3
"""
已废弃：不再提供「一键生成全部资源」入口。

请按需单独运行 `scripts/` 下的生成器，每次只写一个 PNG，例如：

  python3 scripts/gen_table_background.py
  python3 scripts/gen_parchment_panel.py
  python3 scripts/gen_card_warrior.py

共享绘图逻辑在 `scripts/medieval_gen/core.py`。
"""
from __future__ import annotations

import sys


def main() -> None:
    sys.stderr.write(__doc__ or "")
    raise SystemExit(2)


if __name__ == "__main__":
    main()
