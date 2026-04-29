import urllib.request
import re
import urllib.parse
import json

def search_kakao(query):
    try:
        url = "https://m.map.kakao.com/actions/searchView?q=" + urllib.parse.quote(query)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = response.read().decode('utf-8')
            # Look for pointX and pointY which are WCONGNAMUL coordinates normally, 
            # or maybe lat lng in the JSON blocks
            # Look for 'lat' and 'lng'
            matches = re.search(r'"y":\s*([0-9.]+),\s*"x":\s*([0-9.]+)', data)
            if matches:
                print(f"{query} -> Lat: {matches.group(1)}, Lng: {matches.group(2)}")
            else:
                matches_daum = re.search(r'data-lat="([0-9.]+)"\s*data-lng="([0-9.]+)"', data)
                if matches_daum:
                    print(f"{query} -> Lat: {matches_daum.group(1)}, Lng: {matches_daum.group(2)}")
                else:
                    print(query, "No coord found")
    except Exception as e:
        print(query, e)

search_kakao("삼성동 월드타워아파트")
search_kakao("삼성동 우정에쉐르1")
search_kakao("강남구 선릉로130길 33")
search_kakao("삼성동 석탑아파트")
search_kakao("삼성동 삼성현대아파트")
search_kakao("삼성동 한솔아파트")
search_kakao("삼성동 푸른솔진흥아파트")
search_kakao("삼성동 CLK")
