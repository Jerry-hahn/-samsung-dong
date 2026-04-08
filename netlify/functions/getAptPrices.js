// 넷리파이 서버리스 함수 (CORS 우회 및 API 키 은닉 목적)
exports.handler = async function(event, context) {
    const serviceKey = 'et1c0c%2B43t0X3eju6DashSjMwMdM1ol2pY5NaIUmXt8mcLIErCt1uEMdOoPAt9U%2FrifRyoo9it44kJ5F7GLH7Q%3D%3D';
    
    // 60개월(5년)치 YYYYMM 배열 생성
    const monthsToFetch = [];
    let d = new Date();
    for (let i = 0; i < 60; i++) {
        const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`;
        monthsToFetch.push(ymd);
        d.setMonth(d.getMonth() - 1);
    }
    
    // 최신 공공데이터포털 HTTPS 주소 사용 (구버전 HTTP IP 차단 회피용)
    const baseUrl = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev?serviceKey=${serviceKey}&LAWD_CD=11680&pageNo=1&numOfRows=1000`;
    
    try {
        // 서버 봇 차단 방지를 위한 헤더
        const options = {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/xml, text/xml, */*; q=0.01'
            }
        };

        // 60개월 동시 요청 (Promise.allSettled 사용하여 일부 실패해도 전체가 터지지 않게 보호)
        const fetchPromises = monthsToFetch.map(ymd => fetch(`${baseUrl}&DEAL_YMD=${ymd}`, options));
        const results = await Promise.allSettled(fetchPromises);
        
        let xmlDataArray = [];
        for (const result of results) {
            if (result.status === 'fulfilled' && result.value.ok) {
                const text = await result.value.text();
                xmlDataArray.push(text);
            }
        }
        
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ xmls: xmlDataArray })
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.toString() }) };
    }
}
