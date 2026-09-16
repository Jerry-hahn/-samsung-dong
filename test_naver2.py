import urllib.request
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

url = "https://m.land.naver.com/complex/getComplexArticleList"
headers = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X)',
    'Accept': '*/*',
    'Referer': 'https://m.land.naver.com/'
}
params = "hscpNo=11116&tradTpCd=A1&order=prc&showR0=N"

try:
    req = urllib.request.Request(f"{url}?{params}", headers=headers)
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode('utf-8'))
        print(f"Success! Found {len(data.get('result', {}).get('list', []))} articles.")
        for item in data.get('result', {}).get('list', [])[:3]:
            print(f"{item.get('bildNm')} {item.get('spc2')} {item.get('prc')}")
except Exception as e:
    print("Error:", e)

