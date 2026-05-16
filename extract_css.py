import os
import re

files = [
    'shop-by-age.html',
    'themes.html',
    'return-gifts-page.html',
    'school-orders.html',
    'contact.html',
    'reusable-books.html',
    'name-books.html',
    'combos.html',
    'reviews.html'
]

os.makedirs('css/pages', exist_ok=True)

for file in files:
    if not os.path.exists(file):
        continue
    with open(file, 'r') as f:
        content = f.read()

    # Extract style block
    style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
    if style_match:
        css_content = style_match.group(1).strip()
        css_filename = file.replace('.html', '.css')
        
        with open(f'css/pages/{css_filename}', 'w') as f:
            f.write(css_content)
        
        # Replace <style>...</style> with <link rel="stylesheet" href="css/pages/...">
        new_content = content[:style_match.start()] + f'<link rel="stylesheet" href="css/pages/{css_filename}">' + content[style_match.end():]
        
        with open(file, 'w') as f:
            f.write(new_content)
        print(f"Extracted CSS from {file} to css/pages/{css_filename}")
