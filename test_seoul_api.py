import urllib.request
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

# Seoul Open Data API for Real Estate Transactions
# Service: tbLnOpendataRtmsV (서울시 부동산 실거래가 정보)
# Format: http://openapi.seoul.go.kr:8088/(KEY)/json/tbLnOpendataRtmsV/1/1000/2026/11140/

url = "http://openapi.seoul.go.kr:8088/sample/json/tbLnOpendataRtmsV/1/1000/2026/11140/"
headers = {'User-Agent': 'Mozilla/5.0'}

try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        rows = data.get('tbLnOpendataRtmsV', {}).get('row', [])
        print("Fetched rows count for 2026 Jung-gu:", len(rows))
        
        matches = []
        for r in rows:
            # BLDG_NM (건물명), CGG_NM (자치구명), STDG_NM (법정동명), ARCH_AREA (전용면적), THING_CHG (건물용도)
            bldg = r.get('BLDG_NM', '')
            dong = r.get('STDG_NM', '')
            area = r.get('ARCH_AREA', 0)
            use = r.get('BLDG_USG', '')
            
            if '중림' in dong and ('쌍용' in bldg or '플래티넘' in bldg or '서울역' in bldg):
                matches.append(r)
                
        print(f"Matches for Ssangyong Platinum in 2026: {len(matches)}")
        for m in matches:
            print(f"{m.get('DEAL_YMD')} | {m.get('BLDG_NM')} | {m.get('BLDG_USG')} | {m.get('ARCH_AREA')}m2 | {m.get('FLR')}층 | {m.get('THING_AMT')}만원")
except Exception as e:
    print("Error:", e)
