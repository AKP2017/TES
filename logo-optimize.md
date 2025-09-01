Logo optimization instructions (PowerShell)

This repository references `./shibaroo-logo-256.png` in `index.html` but the 256px optimized asset isn't committed. Below are safe, copy-paste PowerShell commands to create it locally.

Prereqs (pick one):
- ImageMagick (magick) recommended: https://imagemagick.org
- Optional: pngquant for additional compression: https://pngquant.org

ImageMagick (create a 256×256 PNG):
magick convert .\shibaroo-logo.png -resize 256x256 -strip -quality 85 .\shibaroo-logo-256.png

If you have pngquant installed and want smaller file size (lossy but good):
magick convert .\shibaroo-logo.png -resize 256x256 -strip -quality 85 miff:- | pngquant --quality=60-80 --speed=1 --output .\shibaroo-logo-256.png --force -

Or directly with pngquant (if input is already 256px):
pngquant --quality=60-80 --speed=1 --output .\shibaroo-logo-256.png --force -- .\shibaroo-logo.png

Notes & recommendations:
- If you have an SVG source for the logo, prefer using the SVG directly in `index.html`. SVG is smaller and scales crisply across devices.
- The current `index.html` already uses `srcset` and references `shibaroo-logo-256.png 256w` for small viewports.
- After generating `shibaroo-logo-256.png`, commit it to the repo next to `shibaroo-logo.png` so `index.html`'s srcset will load the optimized image automatically.

If you want, I can commit the `shibaroo-logo-256.png` for you — upload the generated file here or run the commands and I will update the repo accordingly.
