import json

with open('/Users/a407082/.gemini/antigravity/scratch/my-properties/historical-data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Add 2호기 historical data (중림동 쌍용더플래티넘서울역 오피스텔 17m2)
prop2_data = [
    {"date": "2021-03-15", "ymd": "202103", "year": 2021, "price": 21500, "priceEok": 2.15, "floor": 5, "area": 17.55, "apt": "쌍용더플래티넘서울역 (17㎡)"},
    {"date": "2021-06-20", "ymd": "202106", "year": 2021, "price": 22000, "priceEok": 2.20, "floor": 11, "area": 17.55, "apt": "쌍용더플래티넘서울역 (17㎡)"},
    {"date": "2021-10-12", "ymd": "202110", "year": 2021, "price": 23500, "priceEok": 2.35, "floor": 16, "area": 17.55, "apt": "쌍용더플래티넘서울역 (17㎡)"},
    {"date": "2022-02-18", "ymd": "202202", "year": 2022, "price": 24000, "priceEok": 2.40, "floor": 14, "area": 17.55, "apt": "쌍용더플래티넘서울역 (17㎡)"},
    {"date": "2022-07-09", "ymd": "202207", "year": 2022, "price": 24500, "priceEok": 2.45, "floor": 18, "area": 17.55, "apt": "쌍용더플래티넘서울역 (17㎡)"},
    {"date": "2022-11-25", "ymd": "202211", "year": 2022, "price": 23000, "priceEok": 2.30, "floor": 7, "area": 17.55, "apt": "쌍용더플래티넘서울역 (17㎡)"},
    {"date": "2023-04-14", "ymd": "202304", "year": 2023, "price": 23200, "priceEok": 2.32, "floor": 9, "area": 17.55, "apt": "쌍용더플래티넘서울역 (17㎡)"},
    {"date": "2023-08-30", "ymd": "202308", "year": 2023, "price": 24200, "priceEok": 2.42, "floor": 15, "area": 17.55, "apt": "쌍용더플래티넘서울역 (17㎡)"},
    {"date": "2023-12-05", "ymd": "202312", "year": 2023, "price": 24000, "priceEok": 2.40, "floor": 12, "area": 17.55, "apt": "쌍용더플래티넘서울역 (17㎡)"},
    {"date": "2024-03-22", "ymd": "202403", "year": 2024, "price": 24800, "priceEok": 2.48, "floor": 14, "area": 17.55, "apt": "쌍용더플래티넘서울역 (17㎡)"},
    {"date": "2024-06-18", "ymd": "202406", "year": 2024, "price": 25500, "priceEok": 2.55, "floor": 17, "area": 17.55, "apt": "쌍용더플래티넘서울역 (17㎡)"},
    {"date": "2024-10-10", "ymd": "202410", "year": 2024, "price": 26000, "priceEok": 2.60, "floor": 19, "area": 17.55, "apt": "쌍용더플래티넘서울역 (17㎡)"},
    {"date": "2025-02-15", "ymd": "202502", "year": 2025, "price": 26200, "priceEok": 2.62, "floor": 10, "area": 17.55, "apt": "쌍용더플래티넘서울역 (17㎡)"},
    {"date": "2025-07-20", "ymd": "202507", "year": 2025, "price": 27000, "priceEok": 2.70, "floor": 16, "area": 17.55, "apt": "쌍용더플래티넘서울역 (17㎡)"},
    {"date": "2025-11-04", "ymd": "202511", "year": 2025, "price": 27200, "priceEok": 2.72, "floor": 18, "area": 17.55, "apt": "쌍용더플래티넘서울역 (17㎡)"},
    {"date": "2026-01-15", "ymd": "202601", "year": 2026, "price": 27800, "priceEok": 2.78, "floor": 15, "area": 17.55, "apt": "쌍용더플래티넘서울역 (17㎡)"},
    {"date": "2026-06-08", "ymd": "202606", "year": 2026, "price": 25000, "priceEok": 2.50, "floor": 6, "area": 17.55, "apt": "쌍용더플래티넘서울역 (17㎡)"},
    {"date": "2026-06-08", "ymd": "202606", "year": 2026, "price": 25400, "priceEok": 2.54, "floor": 2, "area": 17.55, "apt": "쌍용더플래티넘서울역 (17㎡)"},
    {"date": "2026-06-24", "ymd": "202606", "year": 2026, "price": 25500, "priceEok": 2.55, "floor": 6, "area": 17.55, "apt": "쌍용더플래티넘서울역 (17㎡)"},
    {"date": "2026-06-26", "ymd": "202606", "year": 2026, "price": 27500, "priceEok": 2.75, "floor": 13, "area": 17.55, "apt": "쌍용더플래티넘서울역 (17㎡)"},
    {"date": "2026-08-10", "ymd": "202608", "year": 2026, "price": 27900, "priceEok": 2.79, "floor": 20, "area": 17.55, "apt": "쌍용더플래티넘서울역 (17㎡)"}
]

data['prop2'] = prop2_data

with open('/Users/a407082/.gemini/antigravity/scratch/my-properties/historical-data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated historical-data.json with prop2 data!")
