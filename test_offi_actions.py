import urllib.request
import urllib.parse
import ssl

ssl._create_default_https_context = ssl._create_unverified_context
service_key = 'et1c0c%2B43t0X3eju6DashSjMwMdM1ol2pY5NaIUmXt8mcLIErCt1uEMdOoPAt9U%2FrifRyoo9it44kJ5F7GLH7Q%3D%3D'

actions = [
    "getRTMSDataSvcOffiTradeDev",
    "getRTMSDataSvcOffiTrade",
    "getOffiTradeDev",
    "getOffiTrade"
]

headers = {'User-Agent': 'Mozilla/5.0'}

for act in actions:
    url = f"https://apis.data.go.kr/1613000/RTMSDataSvcOffiTradeDev/{act}?serviceKey={service_key}&LAWD_CD=11140&DEAL_YMD=202401&pageNo=1&numOfRows=10"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            print("SUCCESS:", act, resp.status)
            txt = resp.read().decode('utf-8')
            print(txt[:200])
    except Exception as e:
        print("FAIL:", act, e)
