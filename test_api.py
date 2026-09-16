import urllib.request
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

service_key = 'et1c0c%2B43t0X3eju6DashSjMwMdM1ol2pY5NaIUmXt8mcLIErCt1uEMdOoPAt9U%2FrifRyoo9it44kJ5F7GLH7Q%3D%3D'
urls = [
    f"https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev?serviceKey={service_key}&LAWD_CD=11680&DEAL_YMD=202312&pageNo=1&numOfRows=10",
    f"https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent?serviceKey={service_key}&LAWD_CD=11680&DEAL_YMD=202312&pageNo=1&numOfRows=10"
]

for url in urls:
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            print(url.split('/')[-1].split('?')[0], response.status)
            xml_data = response.read().decode('utf-8')
            print(xml_data[:200])
    except Exception as e:
        print("Error:", e)
