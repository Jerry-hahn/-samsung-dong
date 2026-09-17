import urllib.request
import re
import ssl
import json
from datetime import datetime

ssl._create_default_https_context = ssl._create_unverified_context
service_key = 'et1c0c%2B43t0X3eju6DashSjMwMdM1ol2pY5NaIUmXt8mcLIErCt1uEMdOoPAt9U%2FrifRyoo9it44kJ5F7GLH7Q%3D%3D'

def extract(item, tag):
    match = re.search(f'<{tag}>([^<]*)</{tag}>', item)
    return match.group(1).strip() if match else ''

headers = {'User-Agent': 'Mozilla/5.0'}

years = [2021, 2022, 2023, 2024, 2025, 2026]

prop1_data = [] # 역삼아이파크 11평 (28.246m2)
prop3_data = [] # 삼성동한솔 23평 (58.57m2)

print("=== Fetching 2021-2026 Gangnam-gu Apt Trade (1호기 & 3호기) ===")
for y in years:
    for m in range(1, 13):
        ymd = f"{y}{m:02d}"
        if y == 2026 and m > 9: break
        url = f"https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev?serviceKey={service_key}&LAWD_CD=11680&DEAL_YMD={ymd}&pageNo=1&numOfRows=1000"
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req) as resp:
                xml = resp.read().decode('utf-8')
                items = xml.split('<item>')[1:]
                for item in items:
                    dong = extract(item, 'umdNm')
                    apt = extract(item, 'aptNm')
                    area = extract(item, 'excluUseAr')
                    price_str = extract(item, 'dealAmount').replace(',', '').strip()
                    floor = extract(item, 'floor')
                    day = extract(item, 'dealDay')
                    
                    if not price_str or not price_str.isdigit(): continue
                    price = int(price_str)
                    
                    # 1호기
                    if '역삼' in dong and ('역삼I\'PARK' in apt or '역삼아이파크' in apt or '아이파크' in apt):
                        try:
                            a = float(area)
                            if 25 <= a <= 31:
                                prop1_data.append({
                                    'date': f"{y}-{m:02d}-{int(day):02d}",
                                    'ymd': ymd,
                                    'year': y,
                                    'price': price, # 만원
                                    'priceEok': round(price / 10000, 2),
                                    'floor': int(floor) if floor.lstrip('-').isdigit() else 0,
                                    'area': a,
                                    'apt': '역삼아이파크 1차 (11평)'
                                })
                        except: pass

                    # 3호기
                    if '삼성' in dong and '한솔' in apt:
                        try:
                            a = float(area)
                            if 55 <= a <= 65:
                                prop3_data.append({
                                    'date': f"{y}-{m:02d}-{int(day):02d}",
                                    'ymd': ymd,
                                    'year': y,
                                    'price': price,
                                    'priceEok': round(price / 10000, 2),
                                    'floor': int(floor) if floor.lstrip('-').isdigit() else 0,
                                    'area': a,
                                    'apt': '삼성동한솔아파트 (23평)'
                                })
                        except: pass
        except Exception as e:
            pass

print(f"Prop1 (역삼아이파크 11평) count: {len(prop1_data)}")
print(f"Prop3 (삼성동한솔 23평) count: {len(prop3_data)}")

# Sort by date
prop1_data.sort(key=lambda x: x['date'])
prop3_data.sort(key=lambda x: x['date'])

output = {
    'prop1': prop1_data,
    'prop3': prop3_data
}

with open('/Users/a407082/.gemini/antigravity/scratch/my-properties/historical-data.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("Saved historical data to historical-data.json")
