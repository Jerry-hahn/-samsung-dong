import json
import random
import os
from datetime import datetime, timedelta

def generate_mock_data():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    apt_list_path = os.path.join(base_dir, "data", "apt_list.json")
    history_path = os.path.join(base_dir, "data", "history.json")

    # Load representative apartments
    with open(apt_list_path, "r", encoding="utf-8") as f:
        apt_data = json.load(f)

    # Base price mapping in 10k KRW (만원)
    # 260,000 means 26억
    base_prices = {
        # Core High
        "강남구": {"base": 240000, "trend": 0.0015, "volatility": 0.002, "count": 60},
        "서초구": {"base": 270000, "trend": 0.0018, "volatility": 0.002, "count": 50},
        "용산구": {"base": 220000, "trend": 0.0012, "volatility": 0.003, "count": 40},
        "송파구": {"base": 190000, "trend": 0.0010, "volatility": 0.002, "count": 120},
        # Core Mid-High
        "성동구": {"base": 160000, "trend": 0.0008, "volatility": 0.003, "count": 45},
        "마포구": {"base": 150000, "trend": 0.0006, "volatility": 0.003, "count": 80},
        "광진구": {"base": 140000, "trend": 0.0005, "volatility": 0.003, "count": 35},
        "동작구": {"base": 130000, "trend": 0.0004, "volatility": 0.003, "count": 50},
        "양천구": {"base": 150000, "trend": 0.0007, "volatility": 0.002, "count": 75},
        "영등포구": {"base": 135000, "trend": 0.0005, "volatility": 0.003, "count": 65},
        # Mid Tier
        "강동구": {"base": 120000, "trend": 0.0002, "volatility": 0.004, "count": 110},
        "서대문구": {"base": 105000, "trend": -0.0001, "volatility": 0.003, "count": 55},
        "동대문구": {"base": 100000, "trend": 0.0001, "volatility": 0.003, "count": 70},
        "종로구": {"base": 125000, "trend": 0.0003, "volatility": 0.002, "count": 30},
        "중구": {"base": 110000, "trend": 0.0002, "volatility": 0.002, "count": 40},
        "강서구": {"base": 95000, "trend": -0.0002, "volatility": 0.003, "count": 90},
        "구로구": {"base": 85000, "trend": -0.0003, "volatility": 0.003, "count": 60},
        # Budget Tier
        "성북구": {"base": 80000, "trend": -0.0002, "volatility": 0.003, "count": 85},
        "관악구": {"base": 75000, "trend": -0.0004, "volatility": 0.004, "count": 65},
        "은평구": {"base": 78000, "trend": -0.0003, "volatility": 0.003, "count": 70},
        "노원구": {"base": 65000, "trend": -0.0006, "volatility": 0.004, "count": 130},
        "중랑구": {"base": 62000, "trend": -0.0004, "volatility": 0.003, "count": 50},
        "금천구": {"base": 68000, "trend": -0.0005, "volatility": 0.003, "count": 40},
        "강북구": {"base": 60000, "trend": -0.0007, "volatility": 0.004, "count": 45},
        "도봉구": {"base": 55000, "trend": -0.0008, "volatility": 0.004, "count": 55}
    }

    # Generate 30 days of data
    start_date = datetime.now() - timedelta(days=30)
    history = {}

    # Seed random for reproducible but realistic results
    random.seed(42)

    for day in range(31):
        current_date = start_date + timedelta(days=day)
        date_str = current_date.strftime("%Y-%m-%d")
        history[date_str] = {}

        for district, apts in apt_data.items():
            dist_config = base_prices[district]
            history[date_str][district] = []

            # We want prices to fluctuate, but walk continuously from the previous day's price
            # So let's store state
            for idx, apt in enumerate(apts):
                state_key = f"{district}_{apt['name']}"
                
                # If first day, set the base price
                if day == 0:
                    # Give some initial variance between the 3 apartments in the district
                    # e.g., Eunma is slightly cheaper than LDP
                    var_factor = 1.0 + (idx - 1) * 0.15 + random.uniform(-0.05, 0.05)
                    price = dist_config["base"] * var_factor
                else:
                    # Retrieve yesterday's price
                    yesterday_str = (current_date - timedelta(days=1)).strftime("%Y-%m-%d")
                    yesterday_data = history[yesterday_str][district][idx]
                    price = yesterday_data["lowestPrice"]
                    
                    # Apply daily fluctuation: trend + noise
                    change_rate = dist_config["trend"] + random.normalvariate(0, dist_config["volatility"])
                    price = price * (1.0 + change_rate)

                # Lowest price is rounded to nearest 500만원 (0.05억)
                lowest_price = round(price / 500) * 500
                # Average price is lowest_price + 3% to 7%
                avg_price = round(lowest_price * random.uniform(1.03, 1.07) / 500) * 500
                
                # Listing count fluctuates slightly
                count_var = int(dist_config["count"] * random.uniform(-0.1, 0.1))
                count = max(5, dist_config["count"] + count_var)

                history[date_str][district].append({
                    "name": apt["name"],
                    "complexNo": apt["complexNo"],
                    "size": apt["size"],
                    "lowestPrice": int(lowest_price),
                    "averagePrice": int(avg_price),
                    "listingCount": int(count)
                })

    # Save to history.json
    with open(history_path, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)

    print(f"Successfully generated 31 days of history data from {start_date.strftime('%Y-%m-%d')} to {datetime.now().strftime('%Y-%m-%d')} for {len(apt_data)} districts!")

if __name__ == "__main__":
    generate_mock_data()
