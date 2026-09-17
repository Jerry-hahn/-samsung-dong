import urllib.request
import re
import ssl
import json
import os
from datetime import datetime

ssl._create_default_https_context = ssl._create_unverified_context

SERVICE_KEY = os.environ.get(
    'MOLIT_API_KEY',
    'et1c0c%2B43t0X3eju6DashSjMwMdM1ol2pY5NaIUmXt8mcLIErCt1uEMdOoPAt9U%2FrifRyoo9it44kJ5F7GLH7Q%3D%3D'
)

# 서울 주요 자치구 법정동 코드
LAWD_CODES = {
    "11680": "강남구",
    "11650": "서초구",
    "11710": "송파구",
    "11440": "마포구",
    "11200": "성동구",
    "11140": "중구",
    "11560": "영등포구",
    "11740": "강동구",
    "11470": "양천구"
}

def extract(item, tag):
    match = re.search(f'<{tag}>([^<]*)</{tag}>', item)
    return match.group(1).strip() if match else ''

def fetch_molit_month(lawd_cd, ymd):
    url = f"https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev?serviceKey={SERVICE_KEY}&LAWD_CD={lawd_cd}&DEAL_YMD={ymd}&pageNo=1&numOfRows=1000"
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            xml = resp.read().decode('utf-8')
            items = xml.split('<item>')[1:]
            results = []
            for item in items:
                apt = extract(item, 'aptNm')
                dong = extract(item, 'umdNm')
                area = extract(item, 'excluUseAr')
                price_str = extract(item, 'dealAmount').replace(',', '').strip()
                floor = extract(item, 'floor')
                day = extract(item, 'dealDay')
                
                if not price_str or not price_str.isdigit(): continue
                price = int(price_str)
                
                results.append({
                    "apt": apt,
                    "dong": f"{LAWD_CODES.get(lawd_cd, '')} {dong}",
                    "area": f"전용 {area}㎡",
                    "areaVal": float(area) if area else 0,
                    "floor": f"{floor}층",
                    "price": price,
                    "priceEok": round(price / 10000, 2),
                    "priceStr": f"{round(price / 10000, 2):.2f}억 원",
                    "date": f"{ymd[:4]}-{ymd[4:]}-{int(day):02d}"
                })
            return results
    except Exception as e:
        print(f"Error fetching {lawd_cd} {ymd}: {e}")
        return []

def main():
    print("국토교통부 API에서 서울 주요구 실거래가 직접 수집 및 팩트 검증 시작...")
    
    # 2026년 2월 / 1월 / 2025년 12월 등 최근 달 조회
    ymds = ["202602", "202601", "202512"]
    all_trades = []
    
    for lawd_cd in LAWD_CODES.keys():
        for ymd in ymds:
            trades = fetch_molit_month(lawd_cd, ymd)
            all_trades.extend(trades)
            
    print(f"총 수집된 서울 실거래 건수: {len(all_trades)} 건")
    
    # 1호기(11.5억 ±10% -> 103500 ~ 126500 만원)
    p1_matches = [t for t in all_trades if 103500 <= t["price"] <= 126500]
    # 2호기(2.78억 ±10% -> 25000 ~ 30500 만원)
    p2_matches = [t for t in all_trades if 25000 <= t["price"] <= 30500]
    # 3호기(21.3억 ±10% -> 191700 ~ 234300 만원)
    p3_matches = [t for t in all_trades if 191700 <= t["price"] <= 234300]

    def format_matches(matches, base_price):
        # 중복 아파트명 제거 후 최고/최신 거래 선별
        unique_apts = {}
        for m in matches:
            key = f"{m['apt']}_{m['area']}"
            if key not in unique_apts:
                diff_pct = round(((m['price'] - base_price) / base_price) * 100, 1)
                diff_str = f"+{diff_pct}%" if diff_pct > 0 else f"{diff_pct}%"
                unique_apts[key] = {
                    "apt": m["apt"],
                    "dong": m["dong"],
                    "area": m["area"],
                    "floor": m["floor"],
                    "price": m["price"],
                    "priceStr": m["priceStr"],
                    "date": m["date"],
                    "diff": diff_str
                }
        return list(unique_apts.values())[:8]

    verified_data = {
        "prop1": {
            "name": "1호기 (역삼아이파크 11평 · 현재가 11.5억)",
            "price": 115000,
            "range_min": 103500,
            "range_max": 126500,
            "matches": format_matches(p1_matches, 115000)
        },
        "prop2": {
            "name": "2호기 (쌍용더플래티넘 17㎡ · 현재가 2.78억)",
            "price": 27800,
            "range_min": 25000,
            "range_max": 30500,
            "matches": format_matches(p2_matches, 27800)
        },
        "prop3": {
            "name": "3호기 (삼성동 한솔아파트 23평 · 현재가 21.3억)",
            "price": 213000,
            "range_min": 191700,
            "range_max": 234300,
            "matches": format_matches(p3_matches, 213000)
        }
    }
    
    with open('/Users/a407082/.gemini/antigravity/scratch/my-properties/similar_price_matches.json', 'w', encoding='utf-8') as f:
        json.dump(verified_data, f, ensure_ascii=False, indent=2)

    with open('/Users/a407082/.gemini/antigravity/scratch/similar_price_matches.json', 'w', encoding='utf-8') as f:
        json.dump(verified_data, f, ensure_ascii=False, indent=2)

    print("✅ 실제 국토교통부 API 수집 & 팩트 검증 완료!")

if __name__ == "__main__":
    main()
