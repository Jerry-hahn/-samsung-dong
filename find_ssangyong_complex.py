import urllib.request
import urllib.parse
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://m.land.naver.com/'
}

kw = urllib.parse.quote("쌍용더플래티넘서울역")
search_url = f"https://m.land.naver.com/search/searchJson?query={kw}"

try:
    req = urllib.request.Request(search_url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        print("Search result:", json.dumps(res, ensure_ascii=False, indent=2)[:1000])
except Exception as e:
    print("Search Error:", e)
