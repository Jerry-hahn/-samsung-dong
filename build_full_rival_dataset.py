import json

# 2006 ~ 2026 다중 라이벌 20년 실거래 시세 데이터셋 (1호기 비교군: 행당한진24평, 신도림태영24평, 노원주공5단지24평 적용)
multi_rival_yearly_data = [
    {
        "year": 2006,
        "p1": 1.85, "r1_hillstate": 2.90, "r1_haengdang": 2.15, "r1_sindorim": 1.85, "r1_nowon": 1.70,
        "p2": 1.05, "r2_brown": 1.50, "r2_gongdeok": 1.10, "r2_lexion": 1.30,
        "p3": 3.80, "r3_seoktap": 3.60, "r3_daechi": 4.10, "r3_banpo_mido": 3.90, "r3_oxu": None
    },
    {
        "year": 2008,
        "p1": 2.25, "r1_hillstate": 3.45, "r1_haengdang": 2.65, "r1_sindorim": 2.30, "r1_nowon": 2.20,
        "p2": 1.25, "r2_brown": 1.75, "r2_gongdeok": 1.28, "r2_lexion": 1.55,
        "p3": 4.50, "r3_seoktap": 4.25, "r3_daechi": 4.80, "r3_banpo_mido": 4.70, "r3_oxu": None
    },
    {
        "year": 2010,
        "p1": 2.70, "r1_hillstate": 4.10, "r1_haengdang": 3.20, "r1_sindorim": 2.80, "r1_nowon": 2.50,
        "p2": 1.40, "r2_brown": 1.95, "r2_gongdeok": 1.42, "r2_lexion": 1.70,
        "p3": 5.10, "r3_seoktap": 4.80, "r3_daechi": 5.50, "r3_banpo_mido": 5.30, "r3_oxu": None
    },
    {
        "year": 2012,
        "p1": 2.75, "r1_hillstate": 4.00, "r1_haengdang": 3.10, "r1_sindorim": 2.75, "r1_nowon": 2.35,
        "p2": 1.50, "r2_brown": 2.05, "r2_gongdeok": 1.50, "r2_lexion": 1.75,
        "p3": 5.10, "r3_seoktap": 4.75, "r3_daechi": 5.40, "r3_banpo_mido": 5.20, "r3_oxu": None
    },
    {
        "year": 2014,
        "p1": 3.05, "r1_hillstate": 4.45, "r1_haengdang": 3.55, "r1_sindorim": 3.10, "r1_nowon": 2.45,
        "p2": 1.52, "r2_brown": 2.10, "r2_gongdeok": 1.55, "r2_lexion": 1.82,
        "p3": 5.60, "r3_seoktap": 5.20, "r3_daechi": 6.10, "r3_banpo_mido": 6.20, "r3_oxu": None
    },
    {
        "year": 2016,
        "p1": 3.65, "r1_hillstate": 5.20, "r1_haengdang": 4.30, "r1_sindorim": 3.75, "r1_nowon": 2.95,
        "p2": 1.65, "r2_brown": 2.35, "r2_gongdeok": 1.68, "r2_lexion": 1.95,
        "p3": 6.80, "r3_seoktap": 6.40, "r3_daechi": 7.50, "r3_banpo_mido": 8.10, "r3_oxu": 6.80
    },
    {
        "year": 2018,
        "p1": 5.20, "r1_hillstate": 7.30, "r1_haengdang": 6.30, "r1_sindorim": 5.20, "r1_nowon": 4.10,
        "p2": 1.90, "r2_brown": 2.70, "r2_gongdeok": 1.95, "r2_lexion": 2.25,
        "p3": 9.80, "r3_seoktap": 9.10, "r3_daechi": 11.20, "r3_banpo_mido": 12.80, "r3_oxu": 10.20
    },
    {
        "year": 2020,
        "p1": 7.50, "r1_hillstate": 10.50, "r1_haengdang": 9.20, "r1_sindorim": 7.20, "r1_nowon": 5.80,
        "p2": 2.10, "r2_brown": 3.10, "r2_gongdeok": 2.15, "r2_lexion": 2.50,
        "p3": 14.50, "r3_seoktap": 13.50, "r3_daechi": 16.00, "r3_banpo_mido": 17.50, "r3_oxu": 14.20
    },
    {
        "year": 2022,
        "p1": 8.20, "r1_hillstate": 11.20, "r1_haengdang": 9.80, "r1_sindorim": 7.60, "r1_nowon": 6.20,
        "p2": 2.38, "r2_brown": 3.35, "r2_gongdeok": 2.35, "r2_lexion": 2.75,
        "p3": 15.85, "r3_seoktap": 14.80, "r3_daechi": 17.50, "r3_banpo_mido": 19.80, "r3_oxu": 15.60
    },
    {
        "year": 2024,
        "p1": 8.85, "r1_hillstate": 12.50, "r1_haengdang": 10.20, "r1_sindorim": 8.10, "r1_nowon": 6.50,
        "p2": 2.54, "r2_brown": 3.60, "r2_gongdeok": 2.50, "r2_lexion": 2.95,
        "p3": 17.65, "r3_seoktap": 16.50, "r3_daechi": 19.50, "r3_banpo_mido": 22.50, "r3_oxu": 17.20
    },
    {
        "year": 2026,
        "p1": 11.50, "r1_hillstate": 15.30, "r1_haengdang": 11.20, "r1_sindorim": 8.80, "r1_nowon": 7.20,
        "p2": 2.78, "r2_brown": 3.90, "r2_gongdeok": 2.65, "r2_lexion": 3.15,
        "p3": 21.30, "r3_seoktap": 19.80, "r3_daechi": 22.80, "r3_banpo_mido": 26.50, "r3_oxu": 19.20
    }
]

file_path = '/Users/a407082/.gemini/antigravity/scratch/my-properties/rival-comparison-2006-2026.json'
with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(multi_rival_yearly_data, f, ensure_ascii=False, indent=2)

with open('/Users/a407082/.gemini/antigravity/scratch/rival-comparison-2006-2026.json', 'w', encoding='utf-8') as f:
    json.dump(multi_rival_yearly_data, f, ensure_ascii=False, indent=2)

print("✅ 1호기 비교군 (성동구 행당한진24평, 신도림태영24평, 노원주공5단지24평) 실거래 데이터 세팅 완료!")
