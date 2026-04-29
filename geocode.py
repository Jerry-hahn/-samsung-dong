import urllib.request
import json

addresses = [
    "서울특별시 강남구 학동로 408",
    "서울특별시 강남구 선릉로130길 33",
    "서울특별시 강남구 학동로 412",
    "서울특별시 강남구 학동로64길 7",
    "서울특별시 강남구 학동로 420",
    "서울특별시 강남구 삼성동 59-21"
]

for addr in addresses:
    try:
        url = "https://nominatim.openstreetmap.org/search?q=" + urllib.parse.quote(addr) + "&format=json"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            if data:
                print(addr, data[0]['lat'], data[0]['lon'])
            else:
                print(addr, "Not found")
    except Exception as e:
        print(addr, e)
