function Replace-BrokenEmojis {
    param($Path)
    $text = [IO.File]::ReadAllText($Path, [System.Text.Encoding]::UTF8)
    
    # page.tsx
    $text = $text -replace 'emoji: "ðŸ¦ ",', 'emoji: "🦁",'
    $text = $text -replace 'emoji: "ðŸ ‹",', 'emoji: "🐳",'
    $text = $text -replace 'emoji: "ðŸ§šâ€ â™€ï¸ ",', 'emoji: "🧚‍♀️",'
    $text = $text -replace 'text-3xl">ðŸ– ï¸ <', 'text-3xl">🖍️<'
    $text = $text -replace 'icon="ðŸ  "', 'icon="🐝"'
    $text = $text -replace 'icon: "ðŸ–¨ï¸ "', 'icon: "🖨️"'
    $text = $text -replace 'text-4xl mb-4">ðŸ †<', 'text-4xl mb-4">🏆<'
    
    # Header.tsx
    $text = $text -replace 'duration-300">ðŸ  <', 'duration-300">🐝<'
    $text = $text -replace 'text-3xl">ðŸ  <', 'text-3xl">🐝<'
    
    # ProductDetailClient.tsx
    $text = $text -replace 'Box\? ðŸŽ ', 'Box? 🎁'

    [IO.File]::WriteAllText($Path, $text, [System.Text.Encoding]::UTF8)
}

Replace-BrokenEmojis "src/app/page.tsx"
Replace-BrokenEmojis "src/components/layout/Header.tsx"
Replace-BrokenEmojis "src/app/products/[id]/ProductDetailClient.tsx"
