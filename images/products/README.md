# 📸 Product Images Guide

## Folder Structure

Each product has its own folder named by **product ID** (from `data/products.json`):

```
images/products/
├── 0/          ← Bhagavad Gita Activity Book
│   ├── 1.jpg   ← Main image (shown on cards)
│   ├── 2.jpg   ← Gallery image 2
│   ├── 3.jpg   ← Gallery image 3
│   └── ...     ← Add as many as you want
│
├── 1/          ← Dino Theme Activity Book
│   ├── 1.jpg
│   ├── 2.jpg
│   └── ...
│
├── 2/          ← Alphabet Flashcards
│   ├── 1.jpg
│   └── ...
│
└── 3/          ← Krishna Theme Activity Book
    ├── 1.jpg
    └── ...
```

## How to Add/Update Images

1. Drop your images into the product's folder (e.g., `images/products/0/`)
2. Name them `1.jpg`, `2.jpg`, `3.jpg` etc. (any format: `.jpg`, `.png`, `.webp`)
3. Update `data/products.json`:
   - Set `"image"` to the main image path (e.g., `"images/products/0/1.jpg"`)
   - Set `"images"` array with all gallery image paths

## Tips
- Keep images under **500KB** each for fast loading
- Use **.webp** format for best compression
- First image (`1.jpg`) is the main/cover image
- Videos can also be placed in product folders
