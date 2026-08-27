#!/usr/bin/env python3
"""Render docs/demo-headers.gif from a captured terminal transcript."""
from __future__ import annotations

import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "demo-headers.gif"
TRANSCRIPT = ROOT / "docs" / "demo-headers-output.txt"

W, H = 920, 540
BG = (18, 18, 22)
FG = (220, 220, 220)
DIM = (120, 120, 130)
GREEN = (80, 200, 120)
YELLOW = (230, 200, 80)
CYAN = (100, 200, 230)
PAD = 20
LINE_H = 18
MAX_LINES = 26


def font(size: int = 14):
    for name in (
        r"C:\Windows\Fonts\consola.ttf",
        r"C:\Windows\Fonts\CascadiaMono.ttf",
        r"C:\Windows\Fonts\lucon.ttf",
    ):
        p = Path(name)
        if p.exists():
            return ImageFont.truetype(str(p), size)
    return ImageFont.load_default()


def color_for(line: str):
    s = line.strip()
    if s.startswith("==="):
        return CYAN
    if "PASS:" in s or "ACTIVE" in s:
        return GREEN
    if "zero ATL" in s:
        return DIM
    if "HTTP 402" in s:
        return YELLOW
    if s.startswith("->"):
        return GREEN if "ACTIVE" in s else DIM
    return FG


def clean_lines(raw: str) -> list[str]:
    lines: list[str] = []
    for line in raw.splitlines():
        if re.search(r"npm warn|CategoryInfo|FullyQualifiedError|node\.exe|\\\\|At line:", line):
            continue
        if line.strip().startswith(">"):
            continue
        if "demo:headers" in line and "tsx" in line:
            continue
        # normalize arrows / mojibake
        line = line.replace("ΓåÆ", "->").replace("→", "->").replace("\ufffd", "")
        lines.append(line.rstrip())
    # start at useful content
    for i, line in enumerate(lines):
        if line.startswith("Seller:"):
            lines = lines[i:]
            break
    while lines and not lines[0].strip():
        lines.pop(0)
    return lines


def render_frame(visible: list[str], fnt) -> Image.Image:
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, W, 28], fill=(40, 40, 48))
    draw.text((12, 7), "atl-x402-starter — npm run demo:headers", fill=DIM, font=fnt)
    y = 40
    for line in visible[-MAX_LINES:]:
        draw.text((PAD, y), line[:112], fill=color_for(line), font=fnt)
        y += LINE_H
    return img


def main():
    raw = TRANSCRIPT.read_text(encoding="utf-8", errors="replace")
    lines = clean_lines(raw)
    if not lines or not any("PASS:" in L for L in lines):
        raise SystemExit(f"bad transcript ({len(lines)} lines) — re-run demo:headers")

    fnt = font(14)
    frames: list[Image.Image] = []
    for i in range(1, len(lines) + 1):
        # slightly slower on section headers
        frames.append(render_frame(lines[:i], fnt))
        if lines[i - 1].startswith("==="):
            frames.append(frames[-1].copy())
    for _ in range(18):
        frames.append(frames[-1].copy())

    OUT.parent.mkdir(parents=True, exist_ok=True)
    frames[0].save(
        OUT,
        save_all=True,
        append_images=frames[1:],
        duration=110,
        loop=0,
        optimize=True,
    )
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes, {len(frames)} frames)")


if __name__ == "__main__":
    main()
