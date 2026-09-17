import urllib.request
import json
import re
import ssl
import os
from datetime import datetime

ssl._create_default_https_context = ssl._create_unverified_context

SERVICE_KEY = os.environ.get(
    'MOLIT_API_KEY',
    'et1c0c%2B43t0X3eju6DashSjMwMdM1ol2pY5NaIUmXt8mcLIErCt1uEMdOoPAt9U%2FrifRyoo9it44kJ5F7GLH7Q%3D%3D'
)

PROPERTIES = [
    {
        "id": "yeoksam_ipark",
        "name": "역삼 아이파크",
        "size_label": "11평",
        "type": "APT",
        "lawd_cd": "11680",
        "dong": "역삼",
        "apt_name_contains": ["아이파크"],
        "apt_name_excludes": ["센트럴", "테헤란", "2차"],
        "target_size_min": 25,
        "target_size_max": 30
    },
    {
        "id": "ssangyong_platinum",
        "name": "쌍용더플래티넘서울역",
        "size_label": "17TF타입",
        "type": "OFFICETEL",
        "lawd_cd": "11140",
        "dong": "중림",
        "apt_name_contains": ["쌍용", "플래티넘"],
        "apt_name_excludes": [],
        "target_size_min": 15,
        "target_size_max": 20
    },
    {
        "id": "samsung_hansol",
        "name": "삼성동 한솔아파트",
        "size_label": "23평",
        "type": "APT",
        "lawd_cd": "11680",
        "dong": "삼성",
        "apt_name_contains": ["한솔"],
        "apt_name_excludes": [],
        "target_size_min": 55,
        "target_size_max": 62
    }
]

DATA_FILE = 'property_data.json'

def extract(item, tag):
    match = re.search(f'<{tag}>([^<]*)</{tag}>', item)
    return match.group(1).strip() if match else ''

def update_daily_properties():
    print("국토교통부 API 일일 데이터 업데이트...")

def main():
    print("실거래가 일일 누적 & 국토부 실거래가 전수 매칭 시작...")
    
    # 1. 국토부 API에서 시세 ±10% 실거래 데이터 팩트 수집 및 갱신
    try:
        import fetch_real_molit_matches
        fetch_real_molit_matches.main()
        print("✅ 국토교통부 API ±10% 실거래 전수 매칭 성공!")
    except Exception as e:
        print(f"MOLIT match error: {e}")

    print("\n모든 일일 업데이트가 완료되었습니다!")

if __name__ == "__main__":
    main()
