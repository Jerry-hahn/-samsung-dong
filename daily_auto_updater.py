import urllib.request
import re
import ssl
import json
import time
from datetime import datetime

ssl._create_default_https_context = ssl._create_unverified_context
service_key = 'et1c0c%2B43t0X3eju6DashSjMwMdM1ol2pY5NaIUmXt8mcLIErCt1uEMdOoPAt9U%2FrifRyoo9it44kJ5F7GLH7Q%3D%3D'

def extract(item, tag):
    match = re.search(f'<{tag}>([^<]*)</{tag}>', item)
    return match.group(1).strip() if match else ''

headers = {'User-Agent': 'Mozilla/5.0'}

def update_daily():
    now = datetime.now()
    ymd = now.strftime('%Y%m')
    year = now.year
    
    print(f"[{now.strftime('%Y-%m-%d %H:%M:%S')}] Daily Auto Update Check for {ymd}...")
    
    # 1. Fetch Gangnam-gu latest month transactions
    url_gangnam = f"https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev?serviceKey={service_key}&LAWD_CD=11680&DEAL_YMD={ymd}&pageNo=1&numOfRows=1000"
    
    new_prop1 = []
    new_prop3 = []
    
    try:
        req = urllib.request.Request(url_gangnam, headers=headers)
        with urllib.request.urlopen(req) as resp:
            xml = resp.read().decode('utf-8')
            items = xml.split('<item>')[1:]
            for item in items:
                dong = extract(item, 'umdNm')
                apt = extract(item, 'aptNm')
                area = extract(item, 'excluUseAr')
                price_str = extract(item, 'dealAmount').replace(',', '').strip()
                floor = extract(item, 'floor')
                day = extract(item, 'dealDay')
                
                if not price_str or not price_str.isdigit(): continue
                price = int(price_str)
                
                if '역삼' in dong and ('역삼I\'PARK' in apt or '역삼아이파크' in apt or '아이파크' in apt):
                    try:
                        if 25 <= float(area) <= 31:
                            new_prop1.append({
                                'date': f"{year}-{now.month:02d}-{int(day):02d}",
                                'year': year,
                                'price': price,
                                'priceEok': round(price / 10000, 2),
                                'floor': int(floor) if floor.lstrip('-').isdigit() else 0,
                                'area': float(area),
                                'apt': '역삼아이파크 1차 (11평)'
                            })
                    except: pass
                    
                if '삼성' in dong and '한솔' in apt:
                    try:
                        if 55 <= float(area) <= 65:
                            new_prop3.append({
                                'date': f"{year}-{now.month:02d}-{int(day):02d}",
                                'year': year,
                                'price': price,
                                'priceEok': round(price / 10000, 2),
                                'floor': int(floor) if floor.lstrip('-').isdigit() else 0,
                                'area': float(area),
                                'apt': '삼성동한솔아파트 (23평)'
                            })
                    except: pass
    except Exception as e:
        print("Daily check error:", e)
        
    print(f"Checked current month: found {len(new_prop1)} items for Prop1, {len(new_prop3)} items for Prop3.")

if __name__ == "__main__":
    update_daily()
