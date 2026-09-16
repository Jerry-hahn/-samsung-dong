import urllib.request
import urllib.parse
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
        download_url = None
        for item in content:
            if item['name'] == '서울특별시_시군구_경계.svg':
                download_url = item['download_url']
                break
        
        if download_url:
            print("Original download URL:", download_url)
            # Quote the URL to avoid ascii encode errors
            parsed_url = urllib.parse.urlparse(download_url)
            quoted_path = urllib.parse.quote(parsed_url.path)
            safe_url = urllib.parse.urlunparse((
                parsed_url.scheme,
                parsed_url.netloc,
                quoted_path,
                parsed_url.params,
                parsed_url.query,
                parsed_url.fragment
            ))
            print("Quoted download URL:", safe_url)
            
            req2 = urllib.request.Request(safe_url, headers=headers)
            with urllib.request.urlopen(req2) as response2:
                svg_content = response2.read().decode('utf-8')
                with open("seoul_simple.svg", "w", encoding="utf-8") as f:
                    f.write(svg_content)
                print("Successfully saved to seoul_simple.svg!")
                print("First 1500 characters of the SVG:")
                print(svg_content[:1500])
        else:
            print("Could not find 서울특별시_시군구_경계.svg in the contents list.")
except Exception as e:
    print("Error:", e)
