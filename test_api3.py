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
        print(f"Error for {url}: {e}")
        return []

# Test Yeoksam I'Park over more months
for ymd in ['202301', '202302', '202303', '202304', '202305']:
    url = f"https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev?serviceKey={service_key}&LAWD_CD=11680&DEAL_YMD={ymd}&pageNo=1&numOfRows=1000"
    for item in fetch(url):
        apt = extract(item, 'aptNm')
        dong = extract(item, 'umdNm')
        if '역삼' in dong and '아이파크' in apt and '센트럴' not in apt and '테헤란' not in apt:
            print(f"APT: {dong} {apt} - {extract(item, 'excluUseAr')}m2")

# Test Officetel for Ssangyong
# Jung-gu is 11140
for ymd in ['202301', '202401', '202402', '202403']:
    url = f"https://apis.data.go.kr/1613000/RTMSDataSvcOffiTrade/getRTMSDataSvcOffiTrade?serviceKey={service_key}&LAWD_CD=11140&DEAL_YMD={ymd}"
    for item in fetch(url):
        offi = extract(item, 'offiNm')
        dong = extract(item, 'umdNm')
        if '쌍용' in offi or '플래티넘' in offi:
            print(f"OFFI: {dong} {offi} - {extract(item, 'excluUseAr')}m2")

