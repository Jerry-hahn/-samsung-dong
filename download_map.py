import urllib.request
import re
import ssl
import json
import xml.etree.ElementTree as ET

ssl._create_default_https_context = ssl._create_unverified_context

url = "https://upload.wikimedia.org/wikipedia/commons/e/e0/Seoul_districts.svg"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        svg_content = response.read().decode('utf-8')
        print("Successfully downloaded SVG. Length:", len(svg_content))
        
        # Save raw SVG
        with open("seoul_raw.svg", "w", encoding="utf-8") as f:
            f.write(svg_content)
            
        # Parse SVG to extract paths
        # SVG names: we want to find out how the paths are structured (id, class, d)
        root = ET.fromstring(svg_content)
        # Register namespaces to parse correctly if needed
        namespaces = {'svg': 'http://www.w3.org/2000/svg'}
        
        paths = []
        for path in root.findall('.//{http://www.w3.org/2000/svg}path'):
            path_id = path.get('id')
            path_class = path.get('class')
            d = path.get('d')
            # also text or labels if any
            paths.append({
                "id": path_id,
                "class": path_class,
                "d": d
            })
            
        print("Found", len(paths), "paths in SVG.")
        for p in paths[:5]:
            print(f"ID: {p['id']}, Class: {p['class']}, d length: {len(p['d']) if p['d'] else 0}")
            
except Exception as e:
    print("Error:", e)
