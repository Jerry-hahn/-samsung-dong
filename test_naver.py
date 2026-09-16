import urllib.request
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

# 역삼 아이파크 hscpNo: 11116
url = "https://new.land.naver.com/api/articles/complex/11116?realEstateType=APT:ABYG:JGC&tradeType=A1&rentPriceMin=0&rentPriceMax=900000000&priceMin=0&priceMax=900000000&areaMin=0&areaMax=900000000&oldBuildYears&recentlyBuildYears&minHouseHoldCount&maxHouseHoldCount&showArticle=false&sameAddressGroup=false&minMaintenanceCost&maxMaintenanceCost&priceType=RETAIL&direction=&page=1&complexNo=11116&buildingNos=&areaNos=&type=list&order=prc"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
    'Referer': 'https://new.land.naver.com/complexes/11116'
}

try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode('utf-8'))
        print(f"Success! Found {len(data.get('articleList', []))} articles.")
        for item in data.get('articleList', [])[:3]:
            print(f"{item.get('articleName')} {item.get('areaName')} {item.get('dealOrWarrantPrc')}")
except Exception as e:
    print("Error:", e)

