"""Convert doc/ raster images to optimized WebP and generate favicons."""
from __future__ import annotations

import io
import os
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DOC = ROOT / "doc"

SKIP_EXT = {".mp3", ".webp", ".ico", ".svg", ".gif"}
RASTER_EXT = {".png", ".jpg", ".jpeg"}

# Max edge length by filename pattern (first match wins)
SIZE_RULES: list[tuple[str, int]] = [
    ("badge-", 44),
    ("verified", 32),
    ("favicon", 512),
    ("beats-app-icon", 152),
    ("FreeUniversityTools", 152),
    ("CapesPlusPlus", 152),
    ("discordpfp", 160),
    ("Stripe", 64),
    ("Venmo", 64),
    ("Cashapp", 64),
    ("Spotify", 152),
    ("Discord", 152),
    ("Github", 152),
    ("Instagram", 64),
    ("D.png", 152),
    ("icon.png", 152),
    ("Loading", 256),
    ("ServerlyLandingPage", 152),
    ("FreeUniversityToolsLandingPage", 152),
    ("SecurelyLogo", 152),
    ("Porsche", 800),
    ("hero-hallway", 1200),
    ("course-card", 480),
    ("B-Roll", 480),
    ("Bundle", 480),
    ("Clips", 480),
    ("MASTER", 480),
    ("Terabyte", 480),
    ("Viral", 480),
    ("Luxurious", 480),
    ("100k", 480),
    ("30,000", 480),
    ("1400", 480),
    ("18 ", 480),
]


def max_edge_for(path: Path) -> int:
    name = path.name
    for pattern, size in SIZE_RULES:
        if pattern in name:
            return size
  # default for unknown images
    return 960


def resize_if_needed(img: Image.Image, max_edge: int) -> Image.Image:
    w, h = img.size
    if max(w, h) <= max_edge:
        return img
    if w >= h:
        new_w = max_edge
        new_h = round(h * max_edge / w)
    else:
        new_h = max_edge
        new_w = round(w * max_edge / h)
    return img.resize((new_w, new_h), Image.Resampling.LANCZOS)


def save_webp(img: Image.Image, dest: Path, quality: int = 82) -> int:
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA")
    # Flatten alpha onto white for photos that will display on light UI
    if img.mode == "RGBA" and dest.stem not in (
        "discordpfp",
        "beats-app-icon",
        "badge-hypesquad-bravery",
        "badge-legacy-username",
        "badge-orbs-apprentice",
        "badge-quest-completed",
        "badge-gifting-luminary",
        "verified",
        "favicon",
        "CapesPlusPlus",
    ):
        bg = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[3])
        img = bg
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "WEBP", quality=quality, method=6)
    return dest.stat().st_size


def convert_ico_to_png(ico_path: Path, png_path: Path, size: int = 256) -> None:
    with Image.open(ico_path) as ico:
        best = ico
        if hasattr(ico, "n_frames"):
            sizes = []
            for i in range(ico.n_frames):
                ico.seek(i)
                sizes.append((ico.size[0], i))
            largest = max(sizes, key=lambda x: x[0])[1]
            ico.seek(largest)
            best = ico.copy()
        else:
            best = ico.copy()
        if best.mode != "RGBA":
            best = best.convert("RGBA")
        best = resize_if_needed(best, size)
        best.save(png_path, "PNG")


def prepare_favicon_source(img: Image.Image) -> Image.Image:
    """Drop the black square matte so the white circle reads as round in tabs."""
    img = img.convert("RGBA")
    pixels = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if r < 40 and g < 40 and b < 40:
                pixels[x, y] = (0, 0, 0, 0)
    return img


def save_webp_icon(img: Image.Image, dest: Path, quality: int = 90) -> int:
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "WEBP", quality=quality, method=6)
    return dest.stat().st_size


def make_favicons(source: Path) -> None:
    with Image.open(source) as src:
        img = prepare_favicon_source(src)
        sizes = {
            "favicon-32.webp": 32,
            "favicon-192.webp": 192,
            "apple-touch-icon.webp": 180,
        }
        for name, edge in sizes.items():
            icon = resize_if_needed(img.copy(), edge)
            save_webp_icon(icon, DOC / name)
        icon32 = resize_if_needed(img.copy(), 32)
        icon16 = resize_if_needed(img.copy(), 16)
        icon32.save(DOC / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32)])


def main() -> None:
    # Capes++ from ICO
    ico_src = DOC / "CapesPlusPlus-source.ico"
    if ico_src.exists():
        convert_ico_to_png(ico_src, DOC / "CapesPlusPlus.png")

    # Favicons from source
    fav_src = DOC / "favicon-source.png"
    if fav_src.exists():
        make_favicons(fav_src)

    converted = 0
    saved_bytes = 0

    for path in sorted(DOC.iterdir()):
        if not path.is_file():
            continue
        ext = path.suffix.lower()
        if ext not in RASTER_EXT:
            continue
        if path.name.endswith("-source.png") or path.name == "favicon-source.png":
            continue

        try:
            with Image.open(path) as img:
                img = img.copy()
                max_edge = max_edge_for(path)
                img = resize_if_needed(img, max_edge)
                webp_path = path.with_suffix(".webp")
                orig_size = path.stat().st_size
                new_size = save_webp(img, webp_path)
                if new_size < orig_size:
                    saved_bytes += orig_size - new_size
                converted += 1
                print(f"OK {path.name} -> {webp_path.name} ({orig_size} -> {new_size})")
        except Exception as exc:
            print(f"SKIP {path.name}: {exc}")

    print(f"Converted {converted} images, saved ~{saved_bytes // 1024} KB vs originals")


if __name__ == "__main__":
    main()
