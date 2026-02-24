# 🍯 HoneyBee Learning — Deployment Guide

## Quick Start (Local)

Run the site locally on your machine:

```bash
bash serve.sh
```

Then open **http://localhost:8080** in your browser.

To use a different port:
```bash
bash serve.sh 3000
```

---

## Project Structure

```
honeybee_learning/
├── index.html              ← Main homepage
├── product.html            ← Product detail page
├── CNAME                   ← Custom domain config
├── serve.sh                ← Local dev server
│
├── css/
│   ├── style.css           ← Shared styles (all pages)
│   └── product.css         ← Product page specific styles
│
├── js/
│   ├── app.js              ← Homepage logic (loads JSON, renders cards)
│   └── product.js          ← Product page logic (gallery, reviews)
│
├── data/                   ← ⭐ EDIT THESE TO CHANGE CONTENT
│   ├── products.json       ← Learning products (title, price, images, desc)
│   ├── return-gifts.json   ← Return gift combos (name, price, items)
│   └── reviews.json        ← Customer reviews (text, photos, videos)
│
├── images/
│   └── products/           ← Product photos (local fallbacks)
│
└── reviews/
    ├── photos/             ← Customer review photos
    ├── videos/             ← Customer review videos
    └── README.md           ← Guide for adding reviews
```

---

## How to Update Content

### Change Product Details
Edit `data/products.json` — each product has:
- `title`, `price`, `mrp` — name and pricing
- `image` — main display image URL
- `images` — gallery images array
- `shortDesc` — card description on homepage
- `fullDesc` — detailed description on product page
- `tags` — feature tags shown on cards
- `badge` / `badgeType` — label like "Best Seller"

### Change Return Gift Combos
Edit `data/return-gifts.json` — each combo has:
- `name`, `emoji`, `price` — display info
- `items` — list of what's included
- `category` — filter category (under50, under100, under200, premium)
- `hasCandy` — whether candy preference is shown in order form

### Add/Edit Customer Reviews
Edit `data/reviews.json`:
- **Text reviews**: Add to the `text` array
- **Photo reviews**: Save image to `reviews/photos/`, add entry to `photos` array
- **Video reviews**: Save video to `reviews/videos/`, add entry to `videos` array

---

## Free Deployment to the Internet

### Option 1: GitHub Pages (Recommended — 100% Free Forever)

1. **Create a GitHub account** if you don't have one: https://github.com/signup

2. **Create a new repository** on GitHub:
   - Go to https://github.com/new
   - Name it `honeybee-learning`
   - Keep it **Public**
   - Click **Create repository**

3. **Push your code to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/honeybee-learning.git
   git branch -M main
   git push -u origin main
   ```

4. **Enable GitHub Pages**:
   - Go to your repo → **Settings** → **Pages**
   - Under "Source", select **Deploy from a branch**
   - Choose **main** branch, folder **/ (root)**
   - Click **Save**

5. **Your site will be live at**:
   ```
   https://YOUR_USERNAME.github.io/honeybee-learning/
   ```

6. **Future updates** — just push:
   ```bash
   git add -A
   git commit -m "Update products"
   git push
   ```

### Option 2: Netlify (Drag & Drop)

1. Go to https://app.netlify.com/drop
2. Drag your entire folder into the browser
3. Done!

---

## Custom Domain (Optional)

If you buy a domain (e.g., `honeybeelearning.in` — ~₹99-199/year):

1. In your DNS provider, add:
   - `A` record → `185.199.108.153`
   - `A` record → `185.199.109.153`
   - `CNAME` for `www` → `YOUR_USERNAME.github.io`

2. In GitHub Pages settings, enter your custom domain

3. Enable "Enforce HTTPS"
