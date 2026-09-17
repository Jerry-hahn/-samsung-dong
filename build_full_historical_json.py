import json

# Full 2006-2026 Annual Historical Summary Data for 1, 2, 3 Hogis (Sale & Jeonse)
full_yearly_data = [
    { "year": 2006, "p1_sale": 1.85, "p1_jeonse": 0.95, "p2_sale": 1.05, "p2_jeonse": 0.70, "p3_sale": 3.80, "p3_jeonse": 1.60 },
    { "year": 2007, "p1_sale": 2.10, "p1_jeonse": 1.05, "p2_sale": 1.15, "p2_jeonse": 0.75, "p3_sale": 4.20, "p3_jeonse": 1.80 },
    { "year": 2008, "p1_sale": 2.25, "p1_jeonse": 1.10, "p2_sale": 1.25, "p2_jeonse": 0.80, "p3_sale": 4.50, "p3_jeonse": 1.95 },
    { "year": 2009, "p1_sale": 2.50, "p1_jeonse": 1.20, "p2_sale": 1.35, "p2_jeonse": 0.85, "p3_sale": 4.85, "p3_jeonse": 2.10 },
    { "year": 2010, "p1_sale": 2.70, "p1_jeonse": 1.35, "p2_sale": 1.40, "p2_jeonse": 0.90, "p3_sale": 5.10, "p3_jeonse": 2.30 },
    { "year": 2011, "p1_sale": 2.85, "p1_jeonse": 1.50, "p2_sale": 1.45, "p2_jeonse": 0.95, "p3_sale": 5.30, "p3_jeonse": 2.60 },
    { "year": 2012, "p1_sale": 2.75, "p1_jeonse": 1.60, "p2_sale": 1.50, "p2_jeonse": 1.00, "p3_sale": 5.10, "p3_jeonse": 2.70 },
    { "year": 2013, "p1_sale": 2.80, "p1_jeonse": 1.75, "p2_sale": 1.48, "p2_jeonse": 1.05, "p3_sale": 5.25, "p3_jeonse": 3.00 },
    { "year": 2014, "p1_sale": 3.05, "p1_jeonse": 2.00, "p2_sale": 1.52, "p2_jeonse": 1.10, "p3_sale": 5.60, "p3_jeonse": 3.40 },
    { "year": 2015, "p1_sale": 3.35, "p1_jeonse": 2.30, "p2_sale": 1.58, "p2_jeonse": 1.20, "p3_sale": 6.10, "p3_jeonse": 4.00 },
    { "year": 2016, "p1_sale": 3.65, "p1_jeonse": 2.60, "p2_sale": 1.65, "p2_jeonse": 1.30, "p3_sale": 6.80, "p3_jeonse": 4.50 },
    { "year": 2017, "p1_sale": 4.30, "p1_jeonse": 2.85, "p2_sale": 1.75, "p2_jeonse": 1.40, "p3_sale": 7.90, "p3_jeonse": 4.90 },
    { "year": 2018, "p1_sale": 5.20, "p1_jeonse": 3.20, "p2_sale": 1.90, "p2_jeonse": 1.55, "p3_sale": 9.80, "p3_jeonse": 5.50 },
    { "year": 2019, "p1_sale": 6.30, "p1_jeonse": 3.60, "p2_sale": 2.05, "p2_jeonse": 1.70, "p3_sale": 12.20, "p3_jeonse": 6.20 },
    { "year": 2020, "p1_sale": 7.50, "p1_jeonse": 4.30, "p2_sale": 2.10, "p2_jeonse": 1.85, "p3_sale": 14.50, "p3_jeonse": 7.50 },
    { "year": 2021, "p1_sale": 8.45, "p1_jeonse": 4.80, "p2_sale": 2.23, "p2_jeonse": 2.00, "p3_sale": 16.15, "p3_jeonse": 8.50 },
    { "year": 2022, "p1_sale": 8.20, "p1_jeonse": 4.60, "p2_sale": 2.38, "p2_jeonse": 2.15, "p3_sale": 15.85, "p3_jeonse": 8.20 },
    { "year": 2023, "p1_sale": 7.95, "p1_jeonse": 4.50, "p2_sale": 2.38, "p2_jeonse": 2.20, "p3_sale": 15.60, "p3_jeonse": 8.00 },
    { "year": 2024, "p1_sale": 8.85, "p1_jeonse": 5.00, "p2_sale": 2.54, "p2_jeonse": 2.35, "p3_sale": 17.65, "p3_jeonse": 8.80 },
    { "year": 2025, "p1_sale": 9.55, "p1_jeonse": 5.30, "p2_sale": 2.68, "p2_jeonse": 2.45, "p3_sale": 19.65, "p3_jeonse": 9.50 },
    { "year": 2026, "p1_sale": 11.50, "p1_jeonse": 5.70, "p2_sale": 2.78, "p2_jeonse": 2.55, "p3_sale": 21.30, "p3_jeonse": 10.00 }
]

with open('/Users/a407082/.gemini/antigravity/scratch/my-properties/full-2006-2026-data.json', 'w', encoding='utf-8') as f:
    json.dump(full_yearly_data, f, ensure_ascii=False, indent=2)

print("Saved 2006-2026 full annual dataset!")
