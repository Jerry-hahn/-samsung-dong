import urllib.request
import urllib.parse
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

def test_endpoint(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://new.land.naver.com/'
    }
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            data = response.read().decode('utf-8')
            print(f"URL: {url} -> Status: {response.status}")
            print(data[:500])
            return True
    except Exception as e:
        print(f"URL: {url} -> Error: {e}")
        return False

if __name__ == "__main__":
    kw = urllib.parse.quote("은마아파트")
    
    # Try multiple common Naver Land search endpoints
    test_endpoint(f"https://new.land.naver.com/api/search?keyword={kw}")
    test_endpoint(f"https://new.land.naver.com/api/search/complexes?keyword={kw}")
    test_endpoint(f"https://m.land.naver.com/search/searchJson?query={kw}")
    test_endpoint(f"https://m.land.naver.com/api/search?keyword={kw}")
