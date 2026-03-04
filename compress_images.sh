#!/bin/bash
# ═══════════════════════════════════════════════════
#  HoneyBee Learning — Image Compression Script
#  Run once after adding new images.
#  Usage: bash compress_images.sh
#
#  Installs: pngquant, jpegoptim (needs sudo once)
#  Then compresses all PNGs and JPGs in images/
# ═══════════════════════════════════════════════════

set -e

echo "🐝 HoneyBee Image Compressor"
echo "═══════════════════════════"

# ─── Install tools if missing ───
if ! command -v pngquant &>/dev/null; then
    echo "📦 Installing pngquant..."
    sudo apt-get install -y pngquant
fi

if ! command -v jpegoptim &>/dev/null; then
    echo "📦 Installing jpegoptim..."
    sudo apt-get install -y jpegoptim
fi

echo ""
echo "📊 BEFORE sizes:"
du -sh images/

# ─── Compress PNGs ───
echo ""
echo "🖼️  Compressing PNGs (target: ≤150KB each)..."
png_count=0
png_saved=0
find images -type f -iname "*.png" | while read -r file; do
    before=$(stat -c%s "$file")
    # pngquant: 65–80% quality, overwrite in place
    pngquant --quality=65-80 --skip-if-larger --force --ext .png "$file" 2>/dev/null || true
    after=$(stat -c%s "$file")
    saved=$(( (before - after) / 1024 ))
    if [ "$saved" -gt 0 ]; then
        echo "  ✅ $(basename "$file"): ${before}→${after} bytes (-${saved}KB)"
    fi
done

# ─── Compress JPEGs ───
echo ""
echo "📷  Compressing JPEGs (target: ≤80% quality)..."
find images -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) | while read -r file; do
    before=$(stat -c%s "$file")
    jpegoptim --max=80 --strip-all --quiet "$file" 2>/dev/null || true
    after=$(stat -c%s "$file")
    saved=$(( (before - after) / 1024 ))
    echo "  ✅ $(basename "$file"): -${saved}KB"
done

echo ""
echo "📊 AFTER sizes:"
du -sh images/

echo ""
echo "✅ Done! Now commit and push:"
echo "   git add images/"
echo "   git commit -m 'compress images for faster load'"
echo "   git push"
