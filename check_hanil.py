import urllib.request
import re
import ssl
import json
from datetime import datetime

ssl._create_default_https_context = ssl._create_unverified_context

service_key = 'et1c0c%2B43t0X3eju6DashSjMwMdM1ol2pY5NaIUmXt8mcLIErCt1uEMdOoPAt9U%2FrifRyoo9it44kJ5F7GLH7Q%3D%3D'
lawd_cd = '11680' # 강남구

def extract(item, tag):
    match = re.search(f'<{tag}>([^<]*)</{tag}>', item)
    return match.group(1).strip() if match else ''

def fetch_trade(ymd):
    url = f"https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev?serviceKey={service_key}&LAWD_CD={lawd_cd}&DEAL_YMD={ymd}&pageNo=1&numOfRows=1000"
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            xml_data = response.read().decode('utf-8')
            items = xml_data.split('<item>')[1:]
            results = []
            for item in items:
                dong = extract(item, 'umdNm')
                apt = extract(item, 'aptNm')
                if '삼성' in dong and '한일' in apt:
                    results.append({
                        'ymd': ymd,
                        'dong': dong,
                        'apt': apt,
                        'price': extract(item, 'dealAmount'),
                        'area': extract(item, 'excluUseAr'),
                        'floor': extract(item, 'floor'),
                        'day': extract(item, 'dealDay'),
                        'buildYear': extract(item, 'buildYear')
                    })
            return results
    except Exception as e:
        print(f"Error for {ymd}: {e}")
        return []

# Test recent 6 months up to Sept 2026 (or 2024/2025/2026 depending on data availability)
ymds = ['202609', '202608', '202607', '202606', '202605', '202604', '202401', '202312']
found = []
for ymd in ymds:
    res = fetch_trade(ymd)
    if res:
        found.extend(res)

print(json.dumps(found, ensure_ascii=False, indent=2))
