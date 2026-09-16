import urllib.request
import re
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

service_key = 'et1c0c%2B43t0X3eju6DashSjMwMdM1ol2pY5NaIUmXt8mcLIErCt1uEMdOoPAt9U%2FrifRyoo9it44kJ5F7GLH7Q%3D%3D'

def extract(item, tag):
    match = re.search(f'<{tag}>([^<]*)</{tag}>', item)
    return match.group(1).strip() if match else ''

def fetch(url):
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            xml = response.read().decode('utf-8')
            return xml.split('<item>')[1:]
    except Exception as e:
        return []

# Search 2023-2024 for Ssangyong in Jung-gu
for year in [2022, 2023, 2024]:
    for month in range(1, 13):
        ymd = f"{year}{month:02d}"
        url = f"https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev?serviceKey={service_key}&LAWD_CD=11140&DEAL_YMD={ymd}&pageNo=1&numOfRows=1000"
        for item in fetch(url):
            apt = extract(item, 'aptNm')
            dong = extract(item, 'umdNm')
            if '쌍용' in apt or '플래티넘' in apt:
                print(f"Found APT in {ymd}: {dong} {apt} - {extract(item, 'excluUseAr')}m2")

