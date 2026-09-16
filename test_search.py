import urllib.request
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

def test_search(keyword):
    encoded_keyword = urllib.parse.quote(keyword)
    url = f"https://m.land.naver.com/search/searchJson?keyword={encoded_keyword}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X)',
        'Accept': '*/*',
        'Referer': 'https://m.land.naver.com/'
    }
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            print(f"Keyword: {keyword}")
            print(json.dumps(data, indent=2, ensure_ascii=False)[:1000])
    except Exception as e:
        print(f"Error searching for {keyword}: {e}")

if __name__ == "__main__":
    test_search("은마아파트")
    test_search("반포자이")
