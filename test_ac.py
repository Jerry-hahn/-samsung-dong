import urllib.request
import urllib.parse
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

def test_ac(keyword):
    encoded_keyword = urllib.parse.quote(keyword)
    url = f"https://ac.land.naver.com/ac?q={encoded_keyword}&r_format=json&r_enc=UTF-8&r_unicode=0&t_kcond=1&q_enc=UTF-8&st=100"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://new.land.naver.com/'
    }
    
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            print("Success for", keyword)
            print(json.dumps(data, indent=2, ensure_ascii=False))
    except Exception as e:
        print("Error for", keyword, ":", e)

if __name__ == "__main__":
    test_ac("은마아파트")
