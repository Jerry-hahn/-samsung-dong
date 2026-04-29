from PIL import Image
import sys

img_path = sys.argv[1]
try:
    with Image.open(img_path) as img:
        print(f"Format: {img.format}")
        print(f"Size: {img.size}")
        print(f"Mode: {img.mode}")
        # If wide panorama:
        if img.size[0] > img.size[1] * 2:
            print("Image is very wide (likely a panorama).")
            # Let's crop the center frame or try to split it into 7 logic.
except Exception as e:
    print(f"Error: {e}")
