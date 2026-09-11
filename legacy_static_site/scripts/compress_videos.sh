#!/bin/bash
# compress_videos.sh
# Compresses review videos from ~100MB down to ~5-10MB each
# Run: bash compress_videos.sh

INPUT_DIR="reviews/videos"
mkdir -p "${INPUT_DIR}/originals"

for f in "${INPUT_DIR}"/*.mp4; do
    filename=$(basename "$f")
    original="${INPUT_DIR}/originals/${filename}"
    
    # Skip already-compressed files
    if [[ "$filename" == *"_compressed"* ]]; then
        continue
    fi

    echo "📦 Compressing: $filename ..."
    
    # Backup original
    cp "$f" "$original"
    
    # Compress: H.264, 720p max, CRF 28 (good quality/size balance), AAC audio
    ffmpeg -i "$f" \
        -vf "scale='min(1280,iw)':'-2'" \
        -c:v libx264 \
        -crf 28 \
        -preset fast \
        -movflags +faststart \
        -c:a aac \
        -b:a 96k \
        -y \
        "${INPUT_DIR}/tmp_${filename}" 2>/dev/null

    if [ $? -eq 0 ]; then
        mv "${INPUT_DIR}/tmp_${filename}" "$f"
        before=$(du -sh "$original" | cut -f1)
        after=$(du -sh "$f" | cut -f1)
        echo "  ✅ $filename: $before → $after"
    else
        echo "  ❌ Failed to compress $filename"
        rm -f "${INPUT_DIR}/tmp_${filename}"
    fi
done

echo ""
echo "Done! Originals saved in: ${INPUT_DIR}/originals/"
