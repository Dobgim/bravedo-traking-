"""
Draws the WorldBridgeXpress logo: a globe (world) with a red arc sweeping
over it like a bridge and ending in an arrow (express), next to the name.

  python tools/make-logo.py

Writes (same sizes as the files they replaced, so no layout changes):
  public/uploads/2026/02/wbx-logo.webp, wbx-logo-light.webp    722x206
  public/wp-content/themes/carryon/assets/img/wbx-logo.png, wbx-logo-light.png
  public/uploads/2026/02/wbx-favicon.png                        browser tab icon
  public/admin-icons/wbx-*.png                                  app icons
and tools/brand/ (mark + logo at large size, for photos and print).
Needs Pillow and the Windows Bahnschrift font.
"""
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / "public"
OUT_BRAND = ROOT / "tools/brand"

NAVY = (24, 36, 120, 255)
NAVY_BG = (17, 25, 78)          # admin / footer navy #11194E
WHITE = (255, 255, 255, 255)
RED = (254, 0, 11, 255)
W, H = 722, 206
FONT = "C:/Windows/Fonts/bahnschrift.ttf"
SS = 4                          # supersampling for smooth edges


def font(size, weight="Bold"):
    f = ImageFont.truetype(FONT, size)
    try:
        f.set_variation_by_name(weight)
    except Exception:
        pass
    return f


def mark(size, variant):
    """Square brand mark. variant 'dark' = navy globe (for light backgrounds),
    'light' = white globe (for navy backgrounds)."""
    S = size * SS
    globe_fill = NAVY if variant == "dark" else WHITE
    grid = WHITE if variant == "dark" else NAVY
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))

    cx, cy, r = S * 0.47, S * 0.53, S * 0.36
    # globe + grid, clipped to the circle
    globe = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    g = ImageDraw.Draw(globe)
    g.ellipse((cx - r, cy - r, cx + r, cy + r), fill=globe_fill)
    lw = max(2, round(S * 0.022))
    g.ellipse((cx - r * 0.42, cy - r, cx + r * 0.42, cy + r), outline=grid, width=lw)   # meridian
    g.line((cx, cy - r, cx, cy + r), fill=grid, width=lw)
    g.line((cx - r, cy, cx + r, cy), fill=grid, width=lw)                              # equator
    for k in (-0.5, 0.5):                                                               # latitudes
        y = cy + k * r
        half = math.sqrt(1 - k * k) * r
        g.line((cx - half, y, cx + half, y), fill=grid, width=lw)
    mask = Image.new("L", (S, S), 0)
    ImageDraw.Draw(mask).ellipse((cx - r, cy - r, cx + r, cy + r), fill=255)
    img.paste(globe, (0, 0), mask)

    # the bridge: a red arc over the globe, tilted, ending in an arrow head
    aw = round(S * 0.075)
    box = (S * 0.02, S * 0.30, S * 0.98, S * 1.02)
    start, end = 192, 318
    rx, ry = (box[2] - box[0]) / 2, (box[3] - box[1]) / 2
    ccx, ccy = (box[0] + box[2]) / 2, (box[1] + box[3]) / 2
    th = math.radians(end)
    ex = ccx + (rx - aw / 2) * math.cos(th)
    ey = ccy + (ry - aw / 2) * math.sin(th)
    tx, ty = -rx * math.sin(th), ry * math.cos(th)
    n = math.hypot(tx, ty); tx, ty = tx / n, ty / n
    px, py = -ty, tx

    def draw_arc(draw, color, grow):
        """The arc and its arrow head; grow > 0 draws a wider outline (the gap)."""
        b = (box[0] - grow, box[1] - grow, box[2] + grow, box[3] + grow)
        draw.arc(b, start - 2 * (grow > 0), end, fill=color, width=aw + 2 * grow)
        head = aw * 1.9 + grow * 2.2
        draw.polygon([
            (ex + tx * head, ey + ty * head),
            (ex + px * head * 0.62, ey + py * head * 0.62),
            (ex - px * head * 0.62, ey - py * head * 0.62),
        ], fill=color)

    arc = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    draw_arc(ImageDraw.Draw(arc), RED, 0)
    # a thin gap around the arc where it crosses the globe, so it reads as passing in front
    gap = Image.new("L", (S, S), 0)
    draw_arc(ImageDraw.Draw(gap), 255, round(S * 0.018))
    arc = arc.rotate(24, resample=Image.BICUBIC, center=(cx, cy))
    gap = gap.rotate(24, resample=Image.BICUBIC, center=(cx, cy))
    img = Image.composite(Image.new("RGBA", (S, S), (0, 0, 0, 0)), img, gap)
    img.alpha_composite(arc)
    return img.resize((size, size), Image.LANCZOS)


def fit(text, max_w, size, weight="Bold"):
    while size > 10:
        f = font(size, weight)
        if f.getbbox(text)[2] <= max_w:
            return f
        size -= 1
    return font(size, weight)


def wordmark(variant, scale=1):
    """Logo on a transparent 722x206 canvas (times scale)."""
    w, h = W * scale, H * scale
    ink = WHITE if variant == "light" else NAVY
    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    m = mark(round(196 * scale), variant)
    canvas.alpha_composite(m, (0, (h - m.height) // 2))

    d = ImageDraw.Draw(canvas)
    x = m.width + round(14 * scale)
    max_w = w - x - round(6 * scale)
    big = fit("WORLDBRIDGE", max_w, 96 * scale)
    l1 = big.getbbox("WORLDBRIDGE")
    small = fit("XPRESS", max_w, round(66 * scale))
    l2 = small.getbbox("XPRESS")
    gap = round(16 * scale)
    block = (l1[3] - l1[1]) + gap + (l2[3] - l2[1])
    top = (h - block) // 2
    d.text((x - l1[0], top - l1[1]), "WORLDBRIDGE", font=big, fill=ink)
    y2 = top + (l1[3] - l1[1]) + gap
    d.text((x - l2[0], y2 - l2[1]), "XPRESS", font=small, fill=RED)
    # speed lines after XPRESS
    lx = x + (l2[2] - l2[0]) + round(16 * scale)
    lh = max(2, round(5 * scale))
    for i, frac in enumerate((0.62, 0.44, 0.26)):
        ly = y2 + round((10 + i * 17) * scale)
        length = round((max_w - (lx - x)) * frac)
        if length > 0:
            d.rounded_rectangle((lx, ly, lx + length, ly + lh), radius=lh // 2, fill=ink)
    return canvas


def icon(size, safe, with_name=True):
    im = Image.new("RGBA", (size, size), NAVY_BG + (255,))
    if with_name:
        lg = wordmark("light", 2)
        w = round(size * safe)
        lg = lg.resize((w, round(lg.height * w / lg.width)), Image.LANCZOS)
    else:
        lg = mark(round(size * safe), "light")
    im.alpha_composite(lg, ((size - lg.width) // 2, (size - lg.height) // 2))
    return im.convert("RGB")


if __name__ == "__main__":
    dark, light = wordmark("dark"), wordmark("light")
    dark.save(PUB / "uploads/2026/02/wbx-logo.webp", quality=92)
    light.save(PUB / "uploads/2026/02/wbx-logo-light.webp", quality=92)
    dark.save(PUB / "wp-content/themes/carryon/assets/img/wbx-logo.png", optimize=True)
    light.save(PUB / "wp-content/themes/carryon/assets/img/wbx-logo-light.png", optimize=True)
    mark(64, "dark").save(PUB / "uploads/2026/02/wbx-favicon.png", optimize=True)

    icons = PUB / "admin-icons"
    icon(512, 0.86).save(icons / "wbx-icon-512.png", optimize=True)
    icon(192, 0.86).save(icons / "wbx-icon-192.png", optimize=True)
    icon(180, 0.62, with_name=False).save(icons / "wbx-apple-touch-icon.png", optimize=True)
    icon(512, 0.5, with_name=False).save(icons / "wbx-icon-maskable-512.png", optimize=True)

    OUT_BRAND.mkdir(exist_ok=True)
    mark(1024, "dark").save(OUT_BRAND / "mark-1024.png")
    wordmark("dark", 4).save(OUT_BRAND / "logo-dark-2888.png")
    wordmark("light", 4).save(OUT_BRAND / "logo-light-2888.png")
    print("logo files written")
