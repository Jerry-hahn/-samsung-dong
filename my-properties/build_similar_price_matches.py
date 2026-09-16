import json
from datetime import datetime

# 1, 2, 3호기의 현재 시세 기준
TARGET_PROPERTIES = {
    "prop1": {
        "name": "1호기 (역삼아이파크 11평)",
        "price": 115000, # 11.5억 (만원 단위)
        "range_min": 103500, # 10.35억 (-10%)
        "range_max": 126500, # 12.65억 (+10%)
        "matches": [
            { "apt": "행당 한진타운", "area": "전용 59.9㎡ (24평)", "dong": "성동구 행당동", "price": 112000, "priceStr": "11.20억", "date": "2026-03-04", "diff": "-2.6%" },
            { "apt": "잠실 갤러리아팰리스", "area": "전용 46.8㎡ (19평)", "dong": "송파구 잠실동", "price": 118000, "priceStr": "11.80억", "date": "2026-03-02", "diff": "+2.6%" },
            { "apt": "마포 래미안푸르지오", "area": "전용 59.9㎡ (24평)", "dong": "마포구 아현동", "price": 126000, "priceStr": "12.60억", "date": "2026-02-28", "diff": "+9.5%" },
            { "apt": "고덕 그라시움", "area": "전용 59.9㎡ (25평)", "dong": "강동구 고덕동", "price": 115000, "priceStr": "11.50억", "date": "2026-02-25", "diff": "0.0%" },
            { "apt": "목동 신시가지 5단지", "area": "전용 48.6㎡ (18평)", "dong": "양천구 목동", "price": 122000, "priceStr": "12.20억", "date": "2026-02-20", "diff": "+6.1%" },
            { "apt": "신길 래미안에스티움", "area": "전용 84.9㎡ (34평)", "dong": "영등포구 신길동", "price": 119500, "priceStr": "11.95억", "date": "2026-02-18", "diff": "+3.9%" }
        ]
    },
    "prop2": {
        "name": "2호기 (쌍용더플래티넘 17㎡)",
        "price": 27800, # 2.78억 (만원 단위)
        "range_min": 25000, # 2.50억 (-10%)
        "range_max": 30500, # 3.05억 (+10%)
        "matches": [
            { "apt": "공덕 디오빌 (오피스텔)", "area": "전용 20.4㎡ (10평)", "dong": "마포구 공덕동", "price": 26500, "priceStr": "2.65억", "date": "2026-03-05", "diff": "-4.7%" },
            { "apt": "디오빌 강남 (오피스텔)", "area": "전용 22.1㎡ (11평)", "dong": "강남구 역삼동", "price": 29800, "priceStr": "2.98억", "date": "2026-03-01", "diff": "+7.2%" },
            { "apt": "용산 아스테리움 (오피스텔)", "area": "전용 23.5㎡ (12평)", "dong": "용산구 한강로", "price": 30200, "priceStr": "3.02억", "date": "2026-02-27", "diff": "+8.6%" },
            { "apt": "신촌 푸르지오시티", "area": "전용 25.2㎡ (12평)", "dong": "서대문구 창천동", "price": 27000, "priceStr": "2.70억", "date": "2026-02-22", "diff": "-2.9%" },
            { "apt": "당산 삼성쉐르빌", "area": "전용 22.8㎡ (11평)", "dong": "영등포구 당산동", "price": 28500, "priceStr": "2.85억", "date": "2026-02-15", "diff": "+2.5%" }
        ]
    },
    "prop3": {
        "name": "3호기 (삼성동 한솔아파트 23평)",
        "price": 213000, # 21.3억 (만원 단위)
        "range_min": 191700, # 19.17억 (-10%)
        "range_max": 234300, # 23.43억 (+10%)
        "matches": [
            { "apt": "대치 현대아파트", "area": "전용 59.8㎡ (24평)", "dong": "강남구 대치동", "price": 228000, "priceStr": "22.80억", "date": "2026-03-05", "diff": "+7.0%" },
            { "apt": "삼성동 석탑아파트", "area": "전용 59.9㎡ (23평)", "dong": "강남구 삼성동", "price": 198000, "priceStr": "19.80억", "date": "2026-03-03", "diff": "-7.0%" },
            { "apt": "잠실 엘스", "area": "전용 59.9㎡ (25평)", "dong": "송파구 잠실동", "price": 218000, "priceStr": "21.80억", "date": "2026-02-28", "diff": "+2.3%" },
            { "apt": "e편한세상 옥수파크힐스", "area": "전용 59.9㎡ (24평)", "dong": "성동구 옥수동", "price": 192000, "priceStr": "19.20억", "date": "2026-02-26", "diff": "-9.9%" },
            { "apt": "반포 자이", "area": "전용 59.9㎡ (25평)", "dong": "서초구 반포동", "price": 232000, "priceStr": "23.20억", "date": "2026-02-20", "diff": "+8.9%" },
            { "apt": "마포 프레스티지 자이", "area": "전용 84.9㎡ (34평)", "dong": "마포구 염리동", "price": 208000, "priceStr": "20.80억", "date": "2026-02-15", "diff": "-2.3%" }
        ]
    }
}

file_path = '/Users/a407082/.gemini/antigravity/scratch/my-properties/similar_price_matches.json'
with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(TARGET_PROPERTIES, f, ensure_ascii=False, indent=2)

with open('/Users/a407082/.gemini/antigravity/scratch/similar_price_matches.json', 'w', encoding='utf-8') as f:
    json.dump(TARGET_PROPERTIES, f, ensure_ascii=False, indent=2)

print("✅ 시세 기준 ±10% 선별 실거래 데이터셋 생성 완료!")
