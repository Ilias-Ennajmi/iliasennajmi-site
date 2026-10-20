"""Engraving PNG -> two-color SVG (ink + red accent), cropped to content.

Usage: py -3 vectorize.py in.png out.svg [--ink-threshold 110] [--size 1024]
The ink layer is everything dark; the red layer is anything clearly red.
Fills are plain hex so the site's CSS can recolor them per theme/strand.
"""
import sys, argparse
import numpy as np
from PIL import Image, ImageFilter
import potrace

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('out')
ap.add_argument('--ink-threshold', type=int, default=120)
ap.add_argument('--size', type=int, default=1024)
ap.add_argument('--turd', type=int, default=6)
ap.add_argument('--smooth', type=float, default=1.0)
a = ap.parse_args()

im = Image.open(a.src).convert('RGB')
if max(im.size) != a.size:
    im = im.resize((a.size, int(a.size * im.size[1] / im.size[0])), Image.LANCZOS)
im = im.filter(ImageFilter.GaussianBlur(a.smooth * 0.6))
arr = np.asarray(im).astype(int)
r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
lum = (0.299 * r + 0.587 * g + 0.114 * b)
red = (r > 120) & (r - g > 60) & (r - b > 60)
ink = (lum < a.ink_threshold) & ~red

def trace(mask):
    bmp = potrace.Bitmap(~mask.astype(bool))  # potracer: True = background
    path = bmp.trace(turdsize=a.turd, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.0, opticurve=True, opttolerance=0.9)
    parts = []
    for curve in path:
        s = curve.start_point
        d = [f'M{s.x:.0f} {s.y:.0f}']
        for seg in curve:
            if seg.is_corner:
                c, e = seg.c, seg.end_point
                d.append(f'L{c.x:.0f} {c.y:.0f}L{e.x:.0f} {e.y:.0f}')
            else:
                c1, c2, e = seg.c1, seg.c2, seg.end_point
                d.append(f'C{c1.x:.0f} {c1.y:.0f} {c2.x:.0f} {c2.y:.0f} {e.x:.0f} {e.y:.0f}')
        d.append('Z'); parts.append(''.join(d))
    return ''.join(parts)

ink_d = trace(ink)
red_d = trace(red) if red.any() else ''
ys, xs = np.where(ink | red)
if len(xs) == 0: sys.exit('empty image')
pad = 12
x0, y0, x1, y1 = max(0, xs.min() - pad), max(0, ys.min() - pad), min(arr.shape[1], xs.max() + pad), min(arr.shape[0], ys.max() + pad)
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0} {y0} {x1 - x0} {y1 - y0}" fill-rule="evenodd">'
       f'<path class="ink" fill="#1e1d19" d="{ink_d}"/>'
       + (f'<path class="red" fill="#d92e1c" d="{red_d}"/>' if red_d else '') + '</svg>')
open(a.out, 'w', encoding='utf-8').write(svg)
print(f'{a.out}: {len(svg)//1024} KB, ink {int(ink.sum())} px, red {int(red.sum())} px, box {x1-x0}x{y1-y0}')
