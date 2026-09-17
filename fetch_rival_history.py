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

years = list(range(2006, 2027))

# Rival 1: 삼성동 힐스테이트 2단지 (강남구 삼성동)
# Rival 2: 중림동 브라운스톤서울 (중구 중림동)
# Rival 3: 삼성동 석탑아파트 (강남구 삼성동)

rival1_data = [] # 삼성동 힐스테이트 2단지
rival2_data = [] # 중림동 브라운스톤서울
rival3_data = [] # 삼성동 석탑아파트

print("=== Fetching Rival Data (2006 ~ 2026) ===")

# Fetch Gangnam-gu Apt Trade (LAWD_CD=11680)
for y in years:
    for m in range(1, 13):
        if y == 2026 and m > 9: break
        ymd = f"{y}{m:02d}"
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
                    
                    # 삼성동 힐스테이트 2단지 (15평/전용 38-40m2)
                    if '삼성' in dong and '힐스테이트' in apt and ('2' in apt or '2단지' in apt):
                        try:
                            a = float(area)
                            if 35 <= a <= 45:
                                rival1_data.append({
                                    'date': f"{y}-{m:02d}-{int(day):02d}",
                                    'year': y,
                                    'priceEok': round(price / 10000, 2),
                                    'floor': int(floor) if floor.lstrip('-').isdigit() else 0,
                                    'area': a,
                                    'apt': '삼성동 힐스테이트 2단지 (15평)'
                                })
                        except: pass

                    # 삼성동 석탑아파트 (전용 55-65m2)
                    if '삼성' in dong and '석탑' in apt:
                        try:
                            a = float(area)
                            if 55 <= a <= 65:
                                rival3_data.append({
                                    'date': f"{y}-{m:02d}-{int(day):02d}",
                                    'year': y,
                                    'priceEok': round(price / 10000, 2),
                                    'floor': int(floor) if floor.lstrip('-').isdigit() else 0,
                                    'area': a,
                                    'apt': '삼성동 석탑아파트 (23평)'
                                })
                        except: pass
        except Exception as e:
            pass

print(f"Rival 1 (삼성동 힐스테이트 2단지) count: {len(rival1_data)}")
print(f"Rival 3 (삼성동 석탑아파트) count: {len(rival3_data)}")

# Fetch Jung-gu Apt Trade (LAWD_CD=11140) for 브라운스톤서울
for y in years:
    for m in range(1, 13):
        if y == 2026 and m > 9: break
        ymd = f"{y}{m:02d}"
        url = f"https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev?serviceKey={service_key}&LAWD_CD=11140&DEAL_YMD={ymd}&pageNo=1&numOfRows=1000"
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
                    
                    if '중림' in dong and '브라운스톤' in apt:
                        try:
                            a = float(area)
                            if 30 <= a <= 60:
                                rival2_data.append({
                                    'date': f"{y}-{m:02d}-{int(day):02d}",
                                    'year': y,
                                    'priceEok': round(price / 10000, 2),
                                    'floor': int(floor) if floor.lstrip('-').isdigit() else 0,
                                    'area': a,
                                    'apt': '중림동 브라운스톤서울'
                                })
                        except: pass
        except Exception as e:
            pass

print(f"Rival 2 (중림동 브라운스톤서울) count: {len(rival2_data)}")

dataset = {
    'rival1': rival1_data,
    'rival2': rival2_data,
    'rival3': rival3_data
}

with open('/Users/a407082/.gemini/antigravity/scratch/my-properties/rival-historical-data.json', 'w', encoding='utf-8') as f:
    json.dump(dataset, f, ensure_ascii=False, indent=2)

print("Saved rival historical data!")
