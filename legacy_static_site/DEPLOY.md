# 🍯 HoneyBee Learning — Deployment Guide

## Live Site

**GitHub Pages**: https://bpsurya96.github.io/honeybee-learning/

**Repo**: https://github.com/bpsurya96/honeybee-learning (branch: `main`)

---

## Quick Start (Local)

```bash
bash serve.sh
```

Then open **http://localhost:8080** in your browser.

---

## Project Structure

```
honeybee_learning/
├── index.html              ← Main homepage
├── product.html            ← Product detail page
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

## Deploy Updates

Just push to `main` — GitHub Pages auto-deploys:

```bash
git add -A
git commit -m "Update products"
git push
```

Site updates within ~1 minute.

---

## GitHub Pages Setup (Already Done)

- Repo → **Settings** → **Pages**
- Source: **Deploy from a branch**
- Branch: **main**, folder **/ (root)**

---

## Custom Domain Setup

The domain **honeybeelearning.co.in** is now configured for this project.

### Configuration Done:
1. Created `CNAME` file in the repo root.
2. Deployment branch is `main`.

### DNS Steps (Verify at your Domain Provider):
To ensure the domain points correctly to GitHub Pages, check your DNS settings at the registrar (e.g., GoDaddy, Hostinger):

1. **A Records** (Point your base domain `honeybeelearning.co.in` to GitHub):
   - Type: `A`, Host: `@`, Value: `185.199.108.153`
   - Type: `A`, Host: `@`, Value: `185.199.109.153`
   - Type: `A`, Host: `@`, Value: `185.199.110.153`
   - Type: `A`, Host: `@`, Value: `185.199.111.153`

2. **CNAME Record** (Point `www` to your GitHub repo):
   - Type: `CNAME`, Host: `www`, Value: `bpsurya96.github.io`

### GitHub Settings:
1. Go to Repo → **Settings** → **Pages**
2. Your "Custom domain" should now show `honeybeelearning.co.in` (from the `CNAME` file).
3. **Wait for DNS check**: Once GitHub verifies it, ensure **"Enforce HTTPS"** is checked.

