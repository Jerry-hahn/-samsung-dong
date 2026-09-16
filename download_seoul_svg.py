import urllib.request
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

url = "https://raw.githubusercontent.com/statgarten/maps/master/svg/simple/%E1%84%89%E1%85%A5%E1%84%8B%E1%85%AE%E1%86%AF%E1%84%90%E1%85%B3%E1%86%A8%E1%84%87%E1%85%A5%E1%86%AF%E1%84%89%E1%85%B5_%E1%84%89%E1%85%B5%E1%84%80%E1%85%AE%E1%86%AB%E1%84%80%E1%85%AE_%E1%84%80%E1%85%A5%E1%86%BC%E1%84%80%E1%85%A8.svg"
# Note: %E1%84%89%E1%85%A5%E1%84%8B%E1%85%AE%E1%86%AF%E1%84%90%E1%85%B3%E1%86%A8%E1%84%87%E1%85%A5%E1%86%AF%E1%84%89%E1%85%B5_%E1%84%89%E1%85%B5%E1%84%80%E1%85%AE%E1%86%AB%E1%84%80%E1%85%AE_%E1%84%80%E1%85%A5%E1%86%BC%E1%84%80%E1%85%A8.svg is url encoded for 서울특별시_시군구_경계.svg
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        svg_content = response.read().decode('utf-8')
        print("Downloaded simplified SVG. Length:", len(svg_content))
        print("First 1500 chars:")
        print(svg_content[:1500])
        # Save it locally
        with open("seoul_simple.svg", "w", encoding="utf-8") as f:
            f.write(svg_content)
except Exception as e:
    print("Error:", e)
