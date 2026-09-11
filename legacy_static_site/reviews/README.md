# 📸 Customer Reviews — Upload Guide

## Folder Structure

```
reviews/
├── photos/     ← Put customer review photos here
├── videos/     ← Put customer review videos here
└── README.md   ← This file
```

## How to Add Reviews

### 1. Text Reviews
Edit `product.html` and add entries to the `reviews.text` array:
```js
{name:"Parent Name", loc:"Area, Chennai", stars:5, text:"Review text here...", avatar:"👩"}
```

### 2. Photo Reviews
1. Save the image file to `reviews/photos/` (e.g., `review1.jpg`)
2. Edit `product.html` and add to the `reviews.photos` array:
```js
{img:"reviews/photos/review1.jpg", name:"Parent Name", stars:5, text:"Short review"}
```

### 3. Video Reviews
1. Save the video file to `reviews/videos/` (e.g., `review1.mp4`)
2. Edit `product.html` and add to the `reviews.videos` array:
```js
{video:"reviews/videos/review1.mp4", name:"Parent Name", stars:5, text:"Short review"}
```

## Tips
- **Photos**: Use `.jpg` or `.png`, ideally under 500KB each
- **Videos**: Use `.mp4` format, ideally under 10MB each
- **Stars**: Use 1–5 for the star rating
- **Avatar emojis**: 👩 👨 👩‍💼 👨‍👧 👩‍🏫 👩‍🦱 etc.
