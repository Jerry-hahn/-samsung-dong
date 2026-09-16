import urllib.request
import urllib.parse
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

service_key = 'et1c0c%2B43t0X3eju6DashSjMwMdM1ol2pY5NaIUmXt8mcLIErCt1uEMdOoPAt9U%2FrifRyoo9it44kJ5F7GLH7Q%3D%3D'

endpoints = [
    f"https://apis.data.go.kr/1613000/RTMSDataSvcOffiTradeDev/getRTMSDataSvcOffiTradeDev?serviceKey={service_key}&LAWD_CD=11140&DEAL_YMD=202401&pageNo=1&numOfRows=10",
    f"https://apis.data.go.kr/1613000/RTMSDataSvcOffiTrade/getRTMSDataSvcOffiTrade?serviceKey={service_key}&LAWD_CD=11140&DEAL_YMD=202401&pageNo=1&numOfRows=10",
    f"https://apis.data.go.kr/1613000/RTMSDataSvcOffiRent/getRTMSDataSvcOffiRent?serviceKey={service_key}&LAWD_CD=11140&DEAL_YMD=202401&pageNo=1&numOfRows=10",
    f"https://apis.data.go.kr/1613000/RTMSDataSvcRHTradeDev/getRTMSDataSvcRHTradeDev?serviceKey={service_key}&LAWD_CD=11140&DEAL_YMD=202401&pageNo=1&numOfRows=10",
    f"https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev?serviceKey={service_key}&LAWD_CD=11140&DEAL_YMD=202401&pageNo=1&numOfRows=10",
    f"https://apis.data.go.kr/1613000/RTMSDataSvcNrgTrade/getRTMSDataSvcNrgTrade?serviceKey={service_key}&LAWD_CD=11140&DEAL_YMD=202401&pageNo=1&numOfRows=10"
]

headers = {'User-Agent': 'Mozilla/5.0'}

for ep in endpoints:
    try:
        req = urllib.request.Request(ep, headers=headers)
        with urllib.request.urlopen(req) as resp:
            print("SUCCESS:", ep.split('/')[4], resp.status)
            txt = resp.read().decode('utf-8')
            print(txt[:150])
    except Exception as e:
        print("FAIL:", ep.split('/')[4], e)
