import urllib.request
import re
import ssl
import json

ssl._create_default_https_context = ssl._create_unverified_context
service_key = 'et1c0c%2B43t0X3eju6DashSjMwMdM1ol2pY5NaIUmXt8mcLIErCt1uEMdOoPAt9U%2FrifRyoo9it44kJ5F7GLH7Q%3D%3D'
lawd_cd = '11140' # 서울시 중구

def extract(item, tag):
    match = re.search(f'<{tag}>([^<]*)</{tag}>', item)
    return match.group(1).strip() if match else ''

headers = {'User-Agent': 'Mozilla/5.0'}

results = []
print("=== Fetching Officetel Trade for 중림동 쌍용더플래티넘서울역 (2026) ===")

for month in range(1, 13):
    ymd = f"2026{month:02d}"
    url = f"https://apis.data.go.kr/1613000/RTMSDataSvcOffiTrade/getRTMSDataSvcOffiTrade?serviceKey={service_key}&LAWD_CD={lawd_cd}&DEAL_YMD={ymd}&pageNo=1&numOfRows=1000"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            xml_data = response.read().decode('utf-8')
            items = xml_data.split('<item>')[1:]
            for item in items:
                dong = extract(item, 'umdNm')
                offi = extract(item, 'offiNm')
                area = extract(item, 'excluUseAr')
                if ('중림' in dong or dong == '') and ('쌍용' in offi or '플래티넘' in offi or '서울역' in offi):
                    try:
                        a = float(area)
                        # Check around 17m2 (16.0 ~ 19.9 m2)
                        if 16.0 <= a <= 20.0:
                            results.append({
                                'ymd': ymd,
                                'dealYear': extract(item, 'dealYear'),
                                'dealMonth': extract(item, 'dealMonth'),
                                'dealDay': extract(item, 'dealDay'),
                                'dong': dong,
                                'offi': offi,
                                'price': extract(item, 'dealAmount'),
                                'area': area,
                                'floor': extract(item, 'floor'),
                                'buildYear': extract(item, 'buildYear')
                            })
                    except Exception as e:
                        print(e)
    except Exception as e:
        print(f"Error {ymd}: {e}")

print(json.dumps(results, ensure_ascii=False, indent=2))
