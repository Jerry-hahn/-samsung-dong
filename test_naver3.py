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
        print(response.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
