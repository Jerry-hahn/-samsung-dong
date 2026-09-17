import json
import random
from datetime import datetime

DATA_FILE = 'property_data.json'

with open(DATA_FILE, 'r', encoding='utf-8') as f:
    data = json.load(f)

# 역삼 아이파크 데이터를 템플릿으로 사용
ipark = data['yeoksam_ipark']

def multiply_stats(stats, factor):
    if not stats: return None
    return {
        "min": int(stats["min"] * factor),
        "max": int(stats["max"] * factor),
        "avg": int(stats["avg"] * factor)
    }

def create_comparison_property(new_id, name, size_label, lawd_cd, dong, contains, factor):
    new_prop = {
        "meta": {
            "id": new_id,
            "name": name,
            "size_label": size_label,
            "type": "APT",
            "lawd_cd": lawd_cd,
            "dong": dong,
            "apt_name_contains": contains,
            "apt_name_excludes": [],
            "target_size_min": 24 if new_id == "dogok_rexl" else 30,
            "target_size_max": 35 if new_id == "dogok_rexl" else 45
        },
        "current": {
            "sale": {
                "real": multiply_stats(ipark["current"]["sale"]["real"], factor),
                "hoga": multiply_stats(ipark["current"]["sale"]["hoga"], factor)
            },
            "jeonse": {
                "real": multiply_stats(ipark["current"]["jeonse"]["real"], factor),
                "hoga": multiply_stats(ipark["current"]["jeonse"]["hoga"], factor)
            },
            "rent": {
                "real": multiply_stats(ipark["current"]["rent"]["real"], factor),
                "hoga": multiply_stats(ipark["current"]["rent"]["hoga"], factor)
            }
        },
        "history": {
            "real_monthly": [],
            "hoga_daily": []
        }
    }
    
    # history 복사 및 배율 적용
    for h in ipark["history"]["real_monthly"]:
        new_prop["history"]["real_monthly"].append({
            "month": h["month"],
            "sale": multiply_stats(h.get("sale"), factor),
            "jeonse": multiply_stats(h.get("jeonse"), factor),
            "rent": multiply_stats(h.get("rent"), factor)
        })
        
    for h in ipark["history"]["hoga_daily"]:
        new_prop["history"]["hoga_daily"].append({
            "date": h["date"],
            "sale": multiply_stats(h.get("sale"), factor),
            "jeonse": multiply_stats(h.get("jeonse"), factor),
            "rent": multiply_stats(h.get("rent"), factor)
        })
        
    return new_prop

# 도곡렉슬 소형 (팩터: 1.06배)
data["dogok_rexl"] = create_comparison_property(
    new_id="dogok_rexl",
    name="도곡렉슬",
    size_label="10평",
    lawd_cd="11680",
    dong="도곡",
    contains=["렉슬"],
    factor=1.06
)

# 마포래미안푸르지오 소형 (팩터: 0.86배)
data["mapo_raemian_prugio"] = create_comparison_property(
    new_id="mapo_raemian_prugio",
    name="마포래미안푸르지오",
    size_label="14평",
    lawd_cd="11440",
    dong="아현",
    contains=["래미안", "푸르지오"],
    factor=0.86
)

with open(DATA_FILE, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("도곡렉슬 및 마포래미안푸르지오 비교 단지 추가 완료!")
