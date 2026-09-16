import urllib.request
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

url = "https://api.github.com/repos/statgarten/maps/contents/svg/simple"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        content = json.loads(response.read().decode('utf-8'))
        print("Files in svg/simple/ directory:")
        for item in content:
            if item['type'] == 'file':
                print(f"File: {item['name']}, Size: {item['size']} bytes")
except Exception as e:
    print("Error:", e)
