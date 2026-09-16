import urllib.request
import re
import ssl
import json

ssl._create_default_https_context = ssl._create_unverified_context
service_key = 'et1c0c%2B43t0X3eju6DashSjMwMdM1ol2pY5NaIUmXt8mcLIErCt1uEMdOoPAt9U%2FrifRyoo9it44kJ5F7GLH7Q%3D%3D'
lawd_cd = '11680'

def extract(item, tag):
    match = re.search(f'<{tag}>([^<]*)</{tag}>', item)
    return match.group(1).strip() if match else ''

headers = {'User-Agent': 'Mozilla/5.0'}

print("=== All transactions in 역삼동 (2026) with area <= 50m2 ===")
for month in range(1, 10):
    ymd = f"2026{month:02d}"
    url = f"https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev?serviceKey={service_key}&LAWD_CD={lawd_cd}&DEAL_YMD={ymd}&pageNo=1&numOfRows=1000"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            xml = response.read().decode('utf-8')
            items = xml.split('<item>')[1:]
            for item in items:
                dong = extract(item, 'umdNm')
                apt = extract(item, 'aptNm')
                area = extract(item, 'excluUseAr')
                if '역삼' in dong:
                    try:
                        a = float(area)
                        if a <= 50:
                            print(f"{ymd} | {dong} | {apt} | {area}m2 ({round(a*0.3025,1)}평) | {extract(item, 'floor')}층 | {extract(item, 'dealAmount')}만원")
                    except:
                        pass
    except Exception as e:
        print(e)
