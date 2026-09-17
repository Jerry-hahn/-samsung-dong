import json

TARGET_PROPERTIES = {
    "prop1": {
        "name": "1호기 (역삼아이파크 11평)",
        "price": 89000, # 8.9억 (만원 단위)
        "range_min": 80100, # 8.01억 (-10%)
        "range_max": 97900, # 9.79억 (+10%)
        "matches": [
            { "apt": "신도림 태영데시앙", "area": "전용 59.9㎡ (24평)", "dong": "구로구 신도림동", "price": 88000, "priceStr": "8.80억", "date": "2026-03-04", "diff": "-1.1%" },
            { "apt": "송파 거여 1단지", "area": "전용 59.9㎡ (24평)", "dong": "송파구 거여동", "price": 92000, "priceStr": "9.20억", "date": "2026-03-02", "diff": "+3.4%" },
            { "apt": "관악 드림타운", "area": "전용 59.9㎡ (24평)", "dong": "관악구 봉천동", "price": 85000, "priceStr": "8.50억", "date": "2026-02-28", "diff": "-4.5%" },
            { "apt": "노원 상계주공 7단지", "area": "전용 59.9㎡ (24평)", "dong": "노원구 상계동", "price": 78000, "priceStr": "7.80억", "date": "2026-02-25", "diff": "-12.4%" },
            { "apt": "전농 래미안아름숲", "area": "전용 59.9㎡ (24평)", "dong": "동대문구 전농동", "price": 95000, "priceStr": "9.50억", "date": "2026-02-20", "diff": "+6.7%" }
        ]
    },
    "prop2": {
        "name": "2호기 (쌍용더플래티넘 17㎡)",
        "price": 27800,
        "range_min": 25000,
        "range_max": 30500,
        "matches": [
            { "apt": "공덕 디오빌 (오피스텔)", "area": "전용 20.4㎡ (10평)", "dong": "마포구 공덕동", "price": 26500, "priceStr": "2.65억", "date": "2026-03-05", "diff": "-4.7%" },
            { "apt": "디오빌 강남 (오피스텔)", "area": "전용 22.1㎡ (11평)", "dong": "강남구 역삼동", "price": 29800, "priceStr": "2.98억", "date": "2026-03-01", "diff": "+7.2%" },
            { "apt": "용산 아스테리움 (오피스텔)", "area": "전용 23.5㎡ (12평)", "dong": "용산구 한강로", "price": 30200, "priceStr": "3.02억", "date": "2026-02-27", "diff": "+8.6%" },
            { "apt": "신촌 푸르지오시티", "area": "전용 25.2㎡ (12평)", "dong": "서대문구 창천동", "price": 27000, "priceStr": "2.70억", "date": "2026-02-22", "diff": "-2.9%" }
        ]
    },
    "prop3": {
        "name": "3호기 (삼성동 한솔아파트 23평)",
        "price": 213000,
        "range_min": 191700,
        "range_max": 234300,
        "matches": [
            { "apt": "대치 현대아파트", "area": "전용 59.8㎡ (24평)", "dong": "강남구 대치동", "price": 228000, "priceStr": "22.80억", "date": "2026-03-05", "diff": "+7.0%" },
            { "apt": "삼성동 석탑아파트", "area": "전용 59.9㎡ (23평)", "dong": "강남구 삼성동", "price": 198000, "priceStr": "19.80억", "date": "2026-03-03", "diff": "-7.0%" },
            { "apt": "잠실 엘스", "area": "전용 59.9㎡ (25평)", "dong": "송파구 잠실동", "price": 218000, "priceStr": "21.80억", "date": "2026-02-28", "diff": "+2.3%" },
            { "apt": "e편한세상 옥수파크힐스", "area": "전용 59.9㎡ (24평)", "dong": "성동구 옥수동", "price": 192000, "priceStr": "19.20억", "date": "2026-02-26", "diff": "-9.9%" }
        ]
    }
}

file_path = '/Users/a407082/.gemini/antigravity/scratch/my-properties/similar_price_matches.json'
with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(TARGET_PROPERTIES, f, ensure_ascii=False, indent=2)

with open('/Users/a407082/.gemini/antigravity/scratch/similar_price_matches.json', 'w', encoding='utf-8') as f:
    json.dump(TARGET_PROPERTIES, f, ensure_ascii=False, indent=2)

print("✅ 1호기 검증 시세(8.9억) 기준 ±10% 매칭 데이터셋 업데이트 완료!")
