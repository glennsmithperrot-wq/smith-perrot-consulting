#!/usr/bin/env python3
"""Validate local links and required files for the Smith-Perrot Consulting static site."""
from html.parser import HTMLParser
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
HTML_FILES = ["index.html", "blog.html"]
REQUIRED_FILES = [
    "index.html",
    "blog.html",
    "style.css",
    "script.js",
    "assets/spc-logo.svg",
    "assets/glenn-smith-perrot-suit-portrait-light-bg.jpg",
]

class RefParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []
        self.ids = set()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.add(attrs["id"])
        for key in ("href", "src"):
            if key in attrs:
                self.refs.append(attrs[key])

errors = []

def ok(message):
    print(f"✓ {message}")

def fail(message):
    errors.append(message)
    print(f"✗ {message}")

for file in REQUIRED_FILES:
    if (ROOT / file).exists():
        ok(f"Found {file}")
    else:
        fail(f"Missing required file: {file}")

parsers = {}
for html_file in HTML_FILES:
    path = ROOT / html_file
    if not path.exists():
        continue
    parser = RefParser()
    parser.feed(path.read_text(encoding="utf-8"))
    parsers[html_file] = parser

for html_file, parser in parsers.items():
    for ref in parser.refs:
        if ref.startswith(("http://", "https://", "mailto:", "tel:", "//")):
            continue
        if ref.startswith("#"):
            anchor = ref[1:]
            if anchor not in parser.ids:
                fail(f"{html_file} links to missing section #{anchor}")
            continue

        target, _, anchor = ref.partition("#")
        target_path = ROOT / (target or html_file)
        if not target_path.exists():
            fail(f"{html_file} references missing local file: {ref}")
            continue

        if anchor and target.endswith(".html"):
            target_parser = RefParser()
            target_parser.feed(target_path.read_text(encoding="utf-8"))
            if anchor not in target_parser.ids:
                fail(f"{html_file} links to missing section {ref}")

css_path = ROOT / "style.css"
if css_path.exists():
    css = css_path.read_text(encoding="utf-8")
    open_braces = css.count("{")
    close_braces = css.count("}")
    if open_braces == close_braces:
        ok("CSS braces are balanced")
    else:
        fail(f"CSS brace mismatch: {open_braces} opening, {close_braces} closing")

# Basic HTML parser check for syntax-level readability.
for html_file in HTML_FILES:
    path = ROOT / html_file
    if path.exists():
        try:
            RefParser().feed(path.read_text(encoding="utf-8"))
            ok(f"Parsed {html_file}")
        except Exception as exc:
            fail(f"Could not parse {html_file}: {exc}")

if errors:
    print("\nSite check failed. Fix the issues above before deploying.")
    sys.exit(1)

print("\nSite check passed. The project is ready for GitHub and Vercel.")
