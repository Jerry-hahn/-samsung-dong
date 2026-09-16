import urllib.request
import re
import ssl
import json

ssl._create_default_https_context = ssl._create_unverified_context
service_key = 'et1c0c%2B43t0X3eju6DashSjMwMdM1ol2pY5NaIUmXt8mcLIErCt1uEMdOoPAt9U%2FrifRyoo9it44kJ5F7GLH7Q%3D%3D'

def extract(item, tag):
    match = re.search(f'<{tag}>([^<]*)</{tag}>', item)
    return match.group(1).strip() if match else ''

headers = {'User-Agent': 'Mozilla/5.0'}

print("=== Fetching Apt Rent (2026) for Gangnam-gu (Yeoksam I'Park & Samseong Hansol) ===")
# LAWD_CD = 11680 (강남구)
gangnam_rent = []
for month in range(1, 10):
    ymd = f"2026{month:02d}"
    url = f"https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent?serviceKey={service_key}&LAWD_CD=11680&DEAL_YMD={ymd}&pageNo=1&numOfRows=1000"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            xml = resp.read().decode('utf-8')
            items = xml.split('<item>')[1:]
            for item in items:
                dong = extract(item, 'umdNm')
                apt = extract(item, 'aptNm')
                area = extract(item, 'excluUseAr')
                deposit = extract(item, 'depositAmount')
                monthly = extract(item, 'monthlyAmount')
                floor = extract(item, 'floor')
                
                # Check 1호기 (역삼I'PARK 28.246m2)
                if '역삼' in dong and ('역삼I\'PARK' in apt or '역삼아이파크' in apt or '아이파크' in apt):
                    try:
                        if 25 <= float(area) <= 30:
                            gangnam_rent.append({
                                'prop': '1호기 (역삼아이파크 11평)',
                                'ymd': ymd,
                                'day': extract(item, 'dealDay'),
                                'floor': floor,
                                'deposit': deposit,
                                'monthly': monthly,
                                'area': area
                            })
                    except: pass
                # Check 3호기 (삼성동 한솔 58.57m2)
                if '삼성' in dong and '한솔' in apt:
                    try:
                        if 55 <= float(area) <= 65:
                            gangnam_rent.append({
                                'prop': '3호기 (삼성동한솔 23평)',
                                'ymd': ymd,
                                'day': extract(item, 'dealDay'),
                                'floor': floor,
                                'deposit': deposit,
                                'monthly': monthly,
                                'area': area
                            })
                    except: pass
    except Exception as e:
        print(f"Error {ymd}: {e}")

print("Gangnam rent count:", len(gangnam_rent))
print(json.dumps(gangnam_rent, ensure_ascii=False, indent=2))
