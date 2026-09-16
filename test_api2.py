import urllib.request
import json
import ssl
import re

ssl._create_default_https_context = ssl._create_unverified_context

service_key = 'et1c0c%2B43t0X3eju6DashSjMwMdM1ol2pY5NaIUmXt8mcLIErCt1uEMdOoPAt9U%2FrifRyoo9it44kJ5F7GLH7Q%3D%3D'

def extract(item, tag):
    match = re.search(f'<{tag}>([^<]*)</{tag}>', item)
    return match.group(1).strip() if match else ''

# Test Jung-gu for Ssangyong
url_jung = f"https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev?serviceKey={service_key}&LAWD_CD=11140&DEAL_YMD=202401&pageNo=1&numOfRows=1000"
try:
    req = urllib.request.Request(url_jung)
    with urllib.request.urlopen(req) as response:
        xml = response.read().decode('utf-8')
        items = xml.split('<item>')[1:]
        for item in items:
            apt = extract(item, 'aptNm')
            dong = extract(item, 'umdNm')
            if '쌍용' in apt or '플래티넘' in apt:
                print(f"JUNG: {dong} {apt} - {extract(item, 'excluUseAr')}m2")
except Exception as e:
    print(e)

# Test Gangnam-gu for I'Park and Hansol
for ymd in ['202310', '202311', '202312', '202401', '202402']:
    url_gangnam = f"https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev?serviceKey={service_key}&LAWD_CD=11680&DEAL_YMD={ymd}&pageNo=1&numOfRows=1000"
    try:
        req = urllib.request.Request(url_gangnam)
        with urllib.request.urlopen(req) as response:
            xml = response.read().decode('utf-8')
            items = xml.split('<item>')[1:]
            for item in items:
                apt = extract(item, 'aptNm')
                dong = extract(item, 'umdNm')
                if ('역삼' in dong and '아이파크' in apt) or ('삼성' in dong and '한솔' in apt):
                    print(f"GANGNAM {ymd}: {dong} {apt} - {extract(item, 'excluUseAr')}m2")
    except Exception as e:
        print(e)
