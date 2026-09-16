import json

scraped_hoga = {
  "yeoksam_ipark": {
    "sale": {"min": 1100000000, "max": 1400000000},
    "jeonse": {"min": 450000000, "max": 500000000},
    "rent": {"min": 20000000, "max": 300000000}
  },
  "ssangyong_platinum": {
    "sale": {"min": 255000000, "max": 290000000},
    "jeonse": {"min": 0, "max": 0},
    "rent": {"min": 0, "max": 0}
  },
  "samsung_hansol": {
    "sale": {"min": 2090000000, "max": 2200000000},
    "jeonse": {"min": 745000000, "max": 750000000},
    "rent": {"min": 0, "max": 0}
  }
}

with open('property_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for prop_id, hoga_data in scraped_hoga.items():
    if prop_id in data:
        # Patch Current Hoga
        for t in ['sale', 'jeonse', 'rent']:
            if data[prop_id]["current"][t] and "hoga" in data[prop_id]["current"][t]:
                data[prop_id]["current"][t]["hoga"]["min"] = hoga_data[t]["min"] // 10000 # Convert to man won
                data[prop_id]["current"][t]["hoga"]["max"] = hoga_data[t]["max"] // 10000
                data[prop_id]["current"][t]["hoga"]["avg"] = (hoga_data[t]["min"] + hoga_data[t]["max"]) // 20000

with open('property_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Injected real Naver Hoga data into property_data.json!")
