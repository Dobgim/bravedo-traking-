"""
Puts the WorldBridgeXpress branding on the site photos that showed other
brands: the delivery truck (old logo) and the stack of boxes (printed
"IMPASTO" artwork). The old printing is removed with OpenCV inpainting and
the new logo is painted on. Originals are read from git history, so this can
be re-run after a logo change.

  python tools/rebrand-photos.py        (needs: pip install opencv-python-headless numpy)
"""
import subprocess
from io import BytesIO
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
UP = ROOT / "public/uploads/2026/03"
BRAND = ROOT / "tools/brand"
FONT = "C:/Windows/Fonts/bahnschrift.ttf"
NAVY = (24, 36, 120, 255)


def original(name):
    """The photo as first imported (before any rebranding)."""
    rel = f"Jordan2/thejordans-react/public/uploads/2026/03/{name}"
    data = subprocess.run(["git", "show", f"f953498:{rel}"], cwd=ROOT, capture_output=True, check=True).stdout
    return Image.open(BytesIO(data)).convert("RGB")


def font(size, weight="Bold"):
    f = ImageFont.truetype(FONT, size)
    try:
        f.set_variation_by_name(weight)
    except Exception:
        pass
    return f


def inpaint(img, mask, radius=6):
    arr = cv2.cvtColor(np.asarray(img), cv2.COLOR_RGB2BGR)
    out = cv2.inpaint(arr, mask, radius, cv2.INPAINT_TELEA)
    return Image.fromarray(cv2.cvtColor(out, cv2.COLOR_BGR2RGB))


def grow(mask, px):
    return cv2.dilate(mask, np.ones((px * 2 + 1, px * 2 + 1), np.uint8))


def paint(base, layer, opacity=0.96):
    """Composite like ink on a surface: keeps a little of the surface shading."""
    layer = layer.copy()
    a = np.asarray(layer.split()[3]).astype(float) * opacity
    layer.putalpha(Image.fromarray(a.astype(np.uint8)))
    out = base.convert("RGBA")
    out.alpha_composite(layer)
    return out.convert("RGB")


def truck():
    img = original("h4-5.webp")
    arr = np.asarray(img).astype(int)
    h, w = arr.shape[:2]
    spread = arr.max(2) - arr.min(2)
    mask = np.zeros((h, w), np.uint8)
    # old logo: anything coloured or dark on the white panel
    x0, y0, x1, y1 = 84, 172, 414, 265
    region = (spread[y0:y1, x0:x1] > 30) | (arr[y0:y1, x0:x1].max(2) < 175)
    mask[y0:y1, x0:x1][region] = 255
    # small "Global Procurement Partners" line
    x0, y0, x1, y1 = 324, 368, 422, 387
    mask[y0:y1, x0:x1][arr[y0:y1, x0:x1].max(2) < 190] = 255
    img = inpaint(img, grow(mask, 3))

    logo = Image.open(BRAND / "logo-dark-2888.png")
    lw = 330
    logo = logo.resize((lw, round(logo.height * lw / logo.width)), Image.LANCZOS)
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    layer.alpha_composite(logo, (88, 218 - logo.height // 2))
    d = ImageDraw.Draw(layer)
    f = font(9, "SemiBold")
    text = "worldbridgexpress.com"
    tw = f.getbbox(text)[2]
    d.text((417 - tw, 373), text, font=f, fill=NAVY)
    return paint(img, layer)


# The four printed faces of the stacked boxes: top-left, top-right,
# bottom-right, bottom-left (the bottom box runs off the photo).
BOX_FACES = [
    [(139, 45), (261, 33), (257, 123), (130, 135)],
    [(152, 141), (261, 131), (233, 261), (113, 250)],
    [(97, 259), (207, 263), (180, 355), (69, 341)],
    [(79, 345), (199, 361), (186, 445), (47, 432)],
]


def cardboard(img, faces):
    """Each face refilled with plain cardboard: the brown of the box itself,
    smoothed (so the cream printing disappears but the lighting stays), with a
    little grain."""
    arr = np.asarray(img).astype(np.float32)
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
    brown = (((r - b) > 45) & (r > 110) & (r < 240)).astype(np.float32)
    k = (41, 41)
    num = cv2.GaussianBlur(arr * brown[..., None], k, 0)
    den = cv2.GaussianBlur(brown, k, 0)[..., None]
    smooth = num / np.maximum(den, 1e-3)
    rng = np.random.default_rng(7)
    grain = rng.normal(0, 2.2, arr.shape[:2])[..., None]
    plain = np.clip(smooth + grain, 0, 255)
    face_mask = np.zeros(arr.shape[:2], np.uint8)
    for f in faces:
        cv2.fillPoly(face_mask, [np.int32(f)], 255)
    soft = cv2.GaussianBlur(face_mask, (3, 3), 0).astype(np.float32)[..., None] / 255
    out = arr * (1 - soft) + plain * soft
    return Image.fromarray(out.astype(np.uint8))


def place_on_box(img, corners, scale=0.8):
    """Paint the logo onto one box face given its four corners
    (top-left, top-right, bottom-right, bottom-left), centred with a margin."""
    face_w = np.hypot(*np.subtract(corners[1], corners[0]))
    face_h = np.hypot(*np.subtract(corners[3], corners[0]))
    # shrink first (smooth), so the perspective warp only reshapes it
    logo = Image.open(BRAND / "logo-dark-2888.png")
    target = max(8, round(face_w * scale))
    logo = logo.resize((target, round(logo.height * target / logo.width)), Image.LANCZOS)
    lw, lh = logo.size
    # the face is taller than the logo: pad the logo's box so it keeps its
    # proportions and sits in the middle of the face
    full_w = lw / scale
    full_h = full_w * face_h / face_w
    px, py = (full_w - lw) / 2, max(0.0, (full_h - lh) / 2)
    src = np.float32([[-px, -py], [lw + px, -py], [lw + px, lh + py], [-px, lh + py]])
    m = cv2.getPerspectiveTransform(src, np.float32(corners))
    warped = cv2.warpPerspective(np.asarray(logo), m, img.size, flags=cv2.INTER_LINEAR, borderValue=(0, 0, 0, 0))
    return paint(img, Image.fromarray(warped), opacity=0.9)


def boxes():
    img = cardboard(original("h4-8-1.webp"), BOX_FACES)
    for face in BOX_FACES:
        img = place_on_box(img, face)
    return img


def mono_mark(size):
    """The globe mark as a one-colour silhouette (grid lines cut out), alpha only."""
    m = Image.open(BRAND / "mark-1024.png").convert("RGBA").resize((size, size), Image.LANCZOS)
    arr = np.asarray(m).astype(np.float32)
    whiteness = np.clip((arr[..., :3].min(2) - 150) / 105, 0, 1)   # the white grid lines
    return (arr[..., 3] / 255) * (1 - whiteness)


def watermark(name, out_name):
    """Old faint/solid brand-mark decorations redrawn with the new mark: same
    canvas, same place, same colour and opacity."""
    rel = f"Jordan2/thejordans-react/public/uploads/2026/03/{name}"
    data = subprocess.run(["git", "show", f"f953498:{rel}"], cwd=ROOT, capture_output=True, check=True).stdout
    old = Image.open(BytesIO(data)).convert("RGBA")
    a = np.asarray(old)[..., 3]
    ys, xs = np.nonzero(a)
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    color = tuple(int(v) for v in np.asarray(old)[ys[len(ys) // 2], xs[len(xs) // 2], :3])
    peak = int(a.max())
    size = int(min(x1 - x0, y1 - y0) * 1.08)
    alpha = mono_mark(size)
    out = np.zeros((old.height, old.width, 4), np.uint8)
    out[..., :3] = color
    cx, cy = (x0 + x1) // 2, (y0 + y1) // 2
    ox, oy = cx - size // 2, cy - size // 2
    sx0, sy0 = max(0, -ox), max(0, -oy)
    dx0, dy0 = max(0, ox), max(0, oy)
    w = min(size - sx0, old.width - dx0)
    h = min(size - sy0, old.height - dy0)
    out[dy0:dy0 + h, dx0:dx0 + w, 3] = (alpha[sy0:sy0 + h, sx0:sx0 + w] * peak).astype(np.uint8)
    img = Image.fromarray(out)
    path = UP / out_name
    img.save(path, quality=90) if path.suffix == ".webp" else img.save(path, optimize=True)


WATERMARKS = {
    "bggg.png": "bggg-wbx.png",
    "lg.png": "lg-wbx.png",
    "qttt.png": "qttt-wbx.png",
    "h4-7-1.webp": "h4-7-1-wbx.webp",
}


if __name__ == "__main__":
    for old_name, new_name in WATERMARKS.items():
        watermark(old_name, new_name)
    t = truck()
    t.save(UP / "h4-5-wbx.webp", quality=88)
    b = boxes()
    b.save(UP / "h4-8-1-wbx.webp", quality=88)
    print("photos written")
