import urllib.request
import urllib.parse
import re
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

service_key_raw = 'et1c0c+43t0X3eju6DashSjMwMdM1ol2pY5NaIUmXt8mcLIErCt1uEMdOoPAt9U/rifRyoo9it44kJ5F7GLH7Q=='
service_key_enc = urllib.parse.quote(service_key_raw)

endpoints = [
    f"https://apis.data.go.kr/1613000/RTMSDataSvcOffiTrade/getRTMSDataSvcOffiTrade?serviceKey={service_key_enc}&LAWD_CD=11140&DEAL_YMD=202401",
    f"https://apis.data.go.kr/1613000/RTMSDataSvcOffiTradeDev/getRTMSDataSvcOffiTradeDev?serviceKey={service_key_enc}&LAWD_CD=11140&DEAL_YMD=202401",
    f"https://apis.data.go.kr/1613000/RTMSDataSvcOffiTrade/getRTMSDataSvcOffiTrade?serviceKey={service_key_raw}&LAWD_CD=11140&DEAL_YMD=202401",
    f"https://apis.data.go.kr/1613000/RTMSDataSvcOffiTradeDev/getRTMSDataSvcOffiTradeDev?serviceKey={service_key_raw}&LAWD_CD=11140&DEAL_YMD=202401",
]

headers = {'User-Agent': 'Mozilla/5.0'}

for ep in endpoints:
    try:
        req = urllib.request.Request(ep, headers=headers)
        with urllib.request.urlopen(req) as resp:
            print(ep[:70], "STATUS:", resp.status)
            txt = resp.read().decode('utf-8')
            print(txt[:300])
    except Exception as e:
        print(ep[:70], "ERROR:", e)
