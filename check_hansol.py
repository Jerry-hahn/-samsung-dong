import urllib.request
import re
import ssl
import json

ssl._create_default_https_context = ssl._create_unverified_context

service_key = 'et1c0c%2B43t0X3eju6DashSjMwMdM1ol2pY5NaIUmXt8mcLIErCt1uEMdOoPAt9U%2FrifRyoo9it44kJ5F7GLH7Q%3D%3D'
lawd_cd = '11680' # 강남구

def extract(item, tag):
    match = re.search(f'<{tag}>([^<]*)</{tag}>', item)
    return match.group(1).strip() if match else ''

def fetch_trade_all_2026():
    results = []
    headers = {'User-Agent': 'Mozilla/5.0'}
    for month in range(1, 13):
        ymd = f"2026{month:02d}"
        url = f"https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev?serviceKey={service_key}&LAWD_CD={lawd_cd}&DEAL_YMD={ymd}&pageNo=1&numOfRows=1000"
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req) as response:
                xml_data = response.read().decode('utf-8')
                items = xml_data.split('<item>')[1:]
                for item in items:
                    dong = extract(item, 'umdNm')
                    apt = extract(item, 'aptNm')
                    if '삼성' in dong and '한솔' in apt:
                        results.append({
                            'ymd': ymd,
                            'dealYear': extract(item, 'dealYear'),
                            'dealMonth': extract(item, 'dealMonth'),
                            'dealDay': extract(item, 'dealDay'),
                            'dong': dong,
                            'apt': apt,
                            'price': extract(item, 'dealAmount'),
                            'area': extract(item, 'excluUseAr'),
                            'floor': extract(item, 'floor'),
                            'buildYear': extract(item, 'buildYear')
                        })
        except Exception as e:
            print(f"Error for {ymd}: {e}")
    return results

data = fetch_trade_all_2026()
print(json.dumps(data, ensure_ascii=False, indent=2))
