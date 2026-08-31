"""Update HTML files to use local doc/*.webp assets."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

GITHUB_PREFIXES = [
    "https://raw.githubusercontent.com/Delexoo/About-Me/refs/heads/main/doc/",
    "https://raw.githubusercontent.com/Delexoo/About-Me/main/doc/",
]

FAVICON_BLOCK = """  <link rel="icon" href="doc/favicon.ico" sizes="32x32">
  <link rel="icon" type="image/webp" href="doc/favicon-32.webp" sizes="32x32">
  <link rel="apple-touch-icon" href="doc/apple-touch-icon.webp">"""

ICON_MAP = {
    "FreeUniversityToolsLandingPage.png": "FreeUniversityTools.webp",
    "FreeUniversityToolsLandingPage.webp": "FreeUniversityTools.webp",
    "Capes%2B%2B.PNG": "CapesPlusPlus.webp",
    "Capes++.PNG": "CapesPlusPlus.webp",
    "Capes++.webp": "CapesPlusPlus.webp",
}

def to_webp_filename(name: str) -> str:
    if name in ICON_MAP:
        return ICON_MAP[name]
    base, ext = name.rsplit(".", 1) if "." in name else (name, "")
    if ext.lower() in ("png", "jpg", "jpeg"):
        return f"{base}.webp"
    return name


def rewrite_src(src: str) -> str:
    for prefix in GITHUB_PREFIXES:
        if src.startswith(prefix):
            src = "doc/" + src[len(prefix):]
    if src.startswith("doc/"):
        filename = src.split("doc/", 1)[1]
        filename = to_webp_filename(filename)
        return "doc/" + filename
    return src


def process_file(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    original = text

    for prefix in GITHUB_PREFIXES:
        text = text.replace(prefix, "doc/")

    # img src attributes
    def repl_img(match: re.Match) -> str:
        src = match.group(1)
        new_src = rewrite_src(src)
        return f'src="{new_src}"'

    text = re.sub(r'src="([^"]+)"', repl_img, text)

    # DOC_BASE
    text = text.replace(
        'window.DOC_BASE =\n      "https://raw.githubusercontent.com/Delexoo/About-Me/refs/heads/main/doc/";',
        'window.DOC_BASE = "doc/";',
    )

    if path.name == "index.html":
        text = text.replace(
            '<meta name="description" content="Delexo: projects, courses, journey, and more. Cybersecurity student, builder, creator.">',
            '<meta name="description" content="about delexo, explore the latest achievements, programs, courses, and more.">',
        )
        text = text.replace("<title>DELEXO</title>", "<title>delexo</title>")

    if "<link rel=\"icon\"" not in text and path.suffix == ".html":
        text = text.replace(
            "<link rel=\"stylesheet\" href=\"css/style.css\">",
            FAVICON_BLOCK + "\n  <link rel=\"stylesheet\" href=\"css/style.css\">",
        )

    if text != original:
        path.write_text(text, encoding="utf-8")
        print(f"updated {path.name}")


for html in ROOT.glob("*.html"):
    process_file(html)
