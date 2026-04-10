import urllib.request
import json
import re
from datetime import datetime, timedelta

def fetch_data():
    service_key = 'et1c0c%2B43t0X3eju6DashSjMwMdM1ol2pY5NaIUmXt8mcLIErCt1uEMdOoPAt9U%2FrifRyoo9it44kJ5F7GLH7Q%3D%3D'
    base_url = f"https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev?serviceKey={service_key}&LAWD_CD=11680&pageNo=1&numOfRows=1000"
    
    target_apts = ['한솔', '푸른솔', '현대', '석탑', '우정', 'CLK', '월드타워']
    all_transactions = []
    
    # 60 months (5 years)
    current_date = datetime.now()
    months = []
    for i in range(60):
        months.append(current_date.strftime('%Y%m'))
        # Subtract roughly 30 days
        current_date = current_date.replace(day=1) - timedelta(days=1)
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }

    print(f"Starting data fetch for {len(months)} months...")
    
    for ymd in months:
        url = f"{base_url}&DEAL_YMD={ymd}"
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req) as response:
                xml_data = response.read().decode('utf-8')
                
                # Split by <item>
                items = xml_data.split('<item>')[1:]
                for item in items:
                    def extract(tag):
                        match = re.search(f'<{tag}>([^<]*)</{tag}>', item)
                        return match.group(1).strip() if match else ''
                    
                    apt_nm = extract('aptNm')
                    price = extract('dealAmount')
                    area = extract('excluUseAr')
                    deal_year = extract('dealYear')
                    deal_month = extract('dealMonth')
                    deal_day = extract('dealDay')
                    dong = extract('umdNm')
                    
                    if '삼성동' not in dong:
                        continue
                        
                    for target in target_apts:
                        is_match = False
                        if target == '푸른솔':
                            if '푸른솔' in apt_nm or '진흥' in apt_nm: is_match = True
                        elif target == '우정':
                            if '우정' in apt_nm or '에쉐르' in apt_nm: is_match = True
                        elif target == '현대':
                            if apt_nm == '현대' or apt_nm == '삼성현대': is_match = True
                        elif target in apt_nm:
                            is_match = True
                            
                        if is_match:
                            try:
                                m2 = float(area)
                                if m2 < 50: py_num = 18
                                elif m2 < 70: py_num = 25
                                elif m2 < 100: py_num = 33
                                else: py_num = round(m2 * 0.3025 * 1.3)
                                
                                num_price = int(price.replace(',', ''))
                                formatted_price = f"{num_price/10000:.1f}억" if num_price >= 10000 else f"{num_price}만"
                                
                                all_transactions.append({
                                    "apt": target,
                                    "py": f"{py_num}평",
                                    "price": formatted_price,
                                    "year": deal_year,
                                    "dateVal": int(f"{deal_year}{deal_month.zfill(2)}{deal_day.zfill(2)}"),
                                    "dateStr": f"{deal_year[2:]}.{deal_month}.{deal_day}"
                                })
                            except:
                                continue
            print(f"Processed {ymd}...")
        except Exception as e:
            print(f"Error fetching {ymd}: {e}")

    # Write to JSON
    with open('realtime-data.json', 'w', encoding='utf-8') as f:
        json.dump(all_transactions, f, ensure_ascii=False, indent=2)
    
    print(f"Completed! Total {len(all_transactions)} transactions saved to realtime-data.json")

if __name__ == "__main__":
    fetch_data()
