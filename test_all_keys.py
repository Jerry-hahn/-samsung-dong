import urllib.request
import urllib.parse
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

raw_key = 'et1c0c+43t0X3eju6DashSjMwMdM1ol2pY5NaIUmXt8mcLIErCt1uEMdOoPAt9U/rifRyoo9it44kJ5F7GLH7Q=='
enc_key = 'et1c0c%2B43t0X3eju6DashSjMwMdM1ol2pY5NaIUmXt8mcLIErCt1uEMdOoPAt9U%2FrifRyoo9it44kJ5F7GLH7Q%3D%3D'

test_keys = [raw_key, enc_key]
test_services = [
    ("RTMSDataSvcOffiTrade", "getRTMSDataSvcOffiTrade"),
    ("RTMSDataSvcOffiTradeDev", "getRTMSDataSvcOffiTradeDev"),
    ("RTMSDataSvcOffiRent", "getRTMSDataSvcOffiRent"),
    ("RTMSDataSvcAptTrade", "getRTMSDataSvcAptTrade"),
    ("RTMSDataSvcAptTradeDev", "getRTMSDataSvcAptTradeDev"),
    ("RTMSDataSvcAptRent", "getRTMSDataSvcAptRent"),
    ("1613000/RTMSDataSvcOffiTrade", "getRTMSDataSvcOffiTrade"),
]

headers = {'User-Agent': 'Mozilla/5.0'}

for key in test_keys:
    for svc, act in test_services:
        url = f"https://apis.data.go.kr/1613000/{svc}/{act}?serviceKey={key}&LAWD_CD=11140&DEAL_YMD=202401"
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req) as resp:
                data = resp.read().decode('utf-8')
                print(f"SUCCESS | {svc} | key_len={len(key)} | status={resp.status}")
                if "SERVICE_KEY_IS_NOT_REGISTERED_ERROR" in data:
                    print("  -> KEY NOT REGISTERED")
                else:
                    print("  -> DATA:", data[:100])
        except Exception as e:
            pass
