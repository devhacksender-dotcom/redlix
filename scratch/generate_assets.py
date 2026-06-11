import os
import urllib.request
from PIL import Image, ImageDraw, ImageFont

def make_assets():
    url = "https://ik.imagekit.io/dypkhqxip/logo__1_?updatedAt=1781048454786"
    logo_path = 'public/logo.png'
    
    print("Downloading new logo...")
    try:
        # User-Agent header is set to bypass standard bot detection filters if any
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req) as response:
            with open(logo_path, 'wb') as f:
                f.write(response.read())
        print("Successfully downloaded new logo to public/logo.png")
    except Exception as e:
        print(f"Error downloading new logo: {e}")
        if not os.path.exists(logo_path):
            print("Fallback: public/logo.png does not exist. Aborting.")
            return
        print("Using existing public/logo.png as fallback.")
        
    logo = Image.open(logo_path)
    
    # 1. Create favicon.ico
    print("Generating favicon.ico...")
    logo.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
    
    # 2. Create apple-touch-icon.png (180x180) in both root and icons/ folder
    print("Generating apple-touch-icon.png...")
    apple_icon = logo.resize((180, 180), Image.Resampling.LANCZOS)
    apple_icon.save('public/apple-touch-icon.png', format='PNG')
    os.makedirs('public/icons', exist_ok=True)
    apple_icon.save('public/icons/apple-touch-icon.png', format='PNG')
    
    # 3. Create PWA icons (192x192 and 512x512)
    print("Generating PWA icons...")
    icon_192 = logo.resize((192, 192), Image.Resampling.LANCZOS)
    icon_192.save('public/icons/icon-192.png', format='PNG')
    
    icon_512 = logo.resize((512, 512), Image.Resampling.LANCZOS)
    icon_512.save('public/icons/icon-512.png', format='PNG')
    
    # 4. Create og-image.png (1200x630)
    print("Generating og-image.png...")
    width, height = 1200, 630
    canvas = Image.new('RGBA', (width, height), (13, 13, 18, 255))
    draw = ImageDraw.Draw(canvas)
    
    # Draw linear gradient
    for y in range(height):
        r = int(8 + (26 - 8) * (y / height))
        g = int(8 + (26 - 8) * (y / height))
        b = int(10 + (34 - 10) * (y / height))
        draw.line([(0, y), (width, y)], fill=(r, g, b, 255))
        
    # Draw tech grid
    grid_spacing = 60
    for x in range(0, width, grid_spacing):
        draw.line([(x, 0), (x, height)], fill=(255, 255, 255, 8), width=1)
    for y in range(0, height, grid_spacing):
        draw.line([(0, y), (width, y)], fill=(255, 255, 255, 8), width=1)
        
    # Draw radial glow
    glow_center_x, glow_center_y = 230, 315
    glow_canvas = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_canvas)
    for r_glow in range(300, 0, -4):
        alpha = int(30 * (1.0 - (r_glow / 300.0)) ** 2)
        if alpha > 0:
            glow_draw.ellipse(
                [glow_center_x - r_glow, glow_center_y - r_glow, glow_center_x + r_glow, glow_center_y + r_glow],
                fill=(230, 30, 50, alpha)
            )
            
    canvas = Image.alpha_composite(canvas, glow_canvas)
    draw = ImageDraw.Draw(canvas)
    
    # Paste logo
    logo_size = 220
    logo_resized = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS).convert('RGBA')
    logo_x = glow_center_x - logo_size // 2
    logo_y = glow_center_y - logo_size // 2
    canvas.paste(logo_resized, (logo_x, logo_y), logo_resized)
    
    # Load fonts
    font_path = '/System/Library/Fonts/HelveticaNeue.ttc'
    try:
        title_font = ImageFont.truetype(font_path, 72, index=1)
    except Exception:
        try:
            title_font = ImageFont.truetype(font_path, 72)
        except Exception:
            title_font = ImageFont.load_default()
            
    try:
        subtitle_font = ImageFont.truetype(font_path, 32, index=0)
    except Exception:
        try:
            subtitle_font = ImageFont.truetype(font_path, 32)
        except Exception:
            subtitle_font = ImageFont.load_default()
            
    try:
        tag_font = ImageFont.truetype(font_path, 22, index=1)
    except Exception:
        try:
            tag_font = ImageFont.truetype(font_path, 22)
        except Exception:
            tag_font = ImageFont.load_default()

    text_x = 420
    draw.text((text_x, 205), "Redlix Studio", fill=(255, 255, 255, 255), font=title_font)
    draw.text((text_x, 305), "Independent Freelance Studio & IT Solutions", fill=(208, 210, 219, 255), font=subtitle_font)
    draw.text((text_x, 360), "HYDERABAD, INDIA  •  ESTD. 2026", fill=(230, 30, 50, 255), font=tag_font)
    
    final_img = canvas.convert('RGB')
    final_img.save('public/og-image.png', format='PNG')
    print("Successfully generated all assets!")

if __name__ == '__main__':
    make_assets()
