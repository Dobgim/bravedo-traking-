"""
Builds the WorldBridgeXpress logo files from the brand mark (the red slash
and "1" from the original logo) plus the company name.

  python tools/make-logo.py

Writes, at the same sizes as before so no layout changes:
  public/uploads/2026/02/logo.webp, logo-light.webp       722x206
  public/wp-content/themes/carryon/assets/img/logo.png, logo-light.png
  public/admin-icons/*.png                                 app icons
Needs Pillow and the Windows Bahnschrift font.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUB = ROOT / "public"
SRC_DARK = PUB / "uploads/2026/02/logo.webp"         # original artwork (mark source)
SRC_LIGHT = PUB / "uploads/2026/02/logo-light.webp"
MARK_CACHE = ROOT / "tools/brand-mark"               # mark cut out once, reused on reruns

NAVY = (27, 38, 140, 255)      # the blue of the original wordmark
WHITE = (255, 255, 255, 255)
RED = (254, 0, 11, 255)
BG = (17, 25, 78)              # admin navy #11194E
W, H = 722, 206
FONT = "C:/Windows/Fonts/bahnschrift.ttf"


def font(size, weight="Bold"):
    f = ImageFont.truetype(FONT, size)
    try:
        f.set_variation_by_name(weight)
    except Exception:
        pass
    return f


def cut_mark(src):
    """The red slash + "1" from the original logo, without the old text."""
    im = Image.open(src).convert("RGBA")
    mark = im.crop((0, 0, 243, H))
    px = mark.load()
    for y in range(H):
        for x in range(mark.width):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            red = r > 150 and g < 90 and b < 90
            # old "The" sits top-right of the mark, the old tagline bottom-right
            if (x >= 168 and y <= 100 and not red) or y >= 186:
                px[x, y] = (0, 0, 0, 0)
    return mark.crop(mark.getbbox())


def mark(variant):
    MARK_CACHE.mkdir(exist_ok=True)
    cached = MARK_CACHE / f"mark-{variant}.png"
    if not cached.exists():
        cut_mark(SRC_LIGHT if variant == "light" else SRC_DARK).save(cached)
    return Image.open(cached).convert("RGBA")


def fit(text, max_w, size, weight="Bold"):
    while size > 10:
        f = font(size, weight)
        if f.getbbox(text)[2] <= max_w:
            return f
        size -= 1
    return font(size, weight)


def logo(variant):
    ink = WHITE if variant == "light" else NAVY
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    m = mark(variant)
    scale = 140 / m.height
    m = m.resize((round(m.width * scale), 140), Image.LANCZOS)
    canvas.alpha_composite(m, (6, (H - m.height) // 2))

    d = ImageDraw.Draw(canvas)
    x = m.width + 26
    max_w = W - x - 6
    big = fit("WORLDBRIDGE", max_w, 96)
    l1 = big.getbbox("WORLDBRIDGE")
    small = fit("XPRESS", max_w, 72)
    l2 = small.getbbox("XPRESS")
    gap1 = 14
    block = (l1[3] - l1[1]) + gap1 + (l2[3] - l2[1])
    top = (H - block) // 2
    d.text((x - l1[0], top - l1[1]), "WORLDBRIDGE", font=big, fill=ink)
    y2 = top + (l1[3] - l1[1]) + gap1
    d.text((x - l2[0], y2 - l2[1]), "XPRESS", font=small, fill=RED)
    return canvas


def icon(size, safe):
    """Navy square with the light logo centred (safe = share of width used)."""
    im = Image.new("RGBA", (size, size), BG + (255,))
    lg = logo("light")
    w = round(size * safe)
    lg = lg.resize((w, round(lg.height * w / lg.width)), Image.LANCZOS)
    im.alpha_composite(lg, ((size - w) // 2, (size - lg.height) // 2))
    return im.convert("RGB")


if __name__ == "__main__":
    dark, light = logo("dark"), logo("light")
    dark.save(PUB / "uploads/2026/02/logo.webp", quality=92)
    light.save(PUB / "uploads/2026/02/logo-light.webp", quality=92)
    dark.save(PUB / "wp-content/themes/carryon/assets/img/logo.png", optimize=True)
    light.save(PUB / "wp-content/themes/carryon/assets/img/logo-light.png", optimize=True)
    icons = PUB / "admin-icons"
    icon(512, 0.86).save(icons / "icon-512.png", optimize=True)
    icon(192, 0.86).save(icons / "icon-192.png", optimize=True)
    icon(180, 0.86).save(icons / "apple-touch-icon.png", optimize=True)
    icon(512, 0.66).save(icons / "icon-maskable-512.png", optimize=True)
    print("logo files written")
