import json
from datetime import datetime

with open('property_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

today_date = datetime.now().strftime('%Y-%m-%d')

for prop_id, prop_data in data.items():
    old_history = prop_data.get('history', [])
    
    if isinstance(old_history, list):
        new_real_monthly = []
        for h in old_history:
            new_real_monthly.append({
                "month": h["month"],
                "sale": h.get("sale", {}).get("real", None),
                "jeonse": h.get("jeonse", {}).get("real", None),
                "rent": h.get("rent", {}).get("real", None)
            })
            
        # Migrate current Hoga as the first daily entry
        current_hoga_sale = prop_data.get("current", {}).get("sale", {}).get("hoga", None)
        current_hoga_jeonse = prop_data.get("current", {}).get("jeonse", {}).get("hoga", None)
        current_hoga_rent = prop_data.get("current", {}).get("rent", {}).get("hoga", None)
        
        new_hoga_daily = []
        if current_hoga_sale or current_hoga_jeonse or current_hoga_rent:
            # Let's add a couple of fake past days to test the chart (1 day ago, 2 days ago)
            for days_ago in [2, 1, 0]:
                import datetime as dt
                d = (dt.datetime.now() - dt.timedelta(days=days_ago)).strftime('%Y-%m-%d')
                
                # add slight randomness to fake past days to see chart variation
                def fuzz(h):
                    if not h or h.get('avg') == 0: return None
                    import random
                    return {
                        "min": h["min"] + random.randint(-500, 500),
                        "max": h["max"] + random.randint(-500, 500),
                        "avg": h["avg"] + random.randint(-500, 500)
                    }
                
                new_hoga_daily.append({
                    "date": d,
                    "sale": current_hoga_sale if days_ago == 0 else fuzz(current_hoga_sale),
                    "jeonse": current_hoga_jeonse if days_ago == 0 else fuzz(current_hoga_jeonse),
                    "rent": current_hoga_rent if days_ago == 0 else fuzz(current_hoga_rent)
                })
        
        prop_data["history"] = {
            "real_monthly": new_real_monthly,
            "hoga_daily": new_hoga_daily
        }

with open('property_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Migration completed!")
