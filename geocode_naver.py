import urllib.request
import json
import urllib.parse

def search_naver(query):
    try:
        url = "https://m.map.naver.com/search2/search.naver?query=" + urllib.parse.quote(query) + "&sm=sug&style=v5&page=1"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50'})
        with urllib.request.urlopen(req) as response:
            data = response.read().decode('utf-8')
            # Extract JSON from response if possible or just print
            if '"x":"' in data:
                # super hacky string split
                import re
                xs = re.findall(r'"x":"([^"]+)"', data)
                ys = re.findall(r'"y":"([^"]+)"', data)
                if xs and ys:
                    print(f"{query} -> Lat: {ys[0]}, Lng: {xs[0]}")
                else:
                    print(query, "No coord found")
            else:
                print(query, "No x/y found in response")
    except Exception as e:
        print(query, e)

search_naver("삼성동 월드타워아파트")
search_naver("삼성동 우정에쉐르1")
search_naver("삼성동 석탑아파트")
search_naver("삼성동 삼성현대아파트")
search_naver("삼성동 한솔아파트")
search_naver("삼성동 푸른솔진흥아파트")
search_naver("삼성동 CLK")
