import urllib.request
import urllib.error
import ssl

ssl._create_default_https_context = ssl._create_unverified_context
service_key = 'et1c0c%2B43t0X3eju6DashSjMwMdM1ol2pY5NaIUmXt8mcLIErCt1uEMdOoPAt9U%2FrifRyoo9it44kJ5F7GLH7Q%3D%3D'

url = f"https://apis.data.go.kr/1613000/RTMSDataSvcOffiTradeDev/getRTMSDataSvcOffiTradeDev?serviceKey={service_key}&LAWD_CD=11140&DEAL_YMD=202401&pageNo=1&numOfRows=10"
headers = {'User-Agent': 'Mozilla/5.0'}

try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        print(resp.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("HTTP Error Code:", e.code)
    print("HTTP Error Reason:", e.reason)
    print("Response Body:", e.read().decode('utf-8'))
except Exception as e:
    print(e)
