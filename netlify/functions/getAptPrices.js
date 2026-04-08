// 넷리파이 서버리스 함수 (CORS 우회 및 API 키 은닉 목적)
exports.handler = async function(event, context) {
    const serviceKey = 'et1c0c%2B43t0X3eju6DashSjMwMdM1ol2pY5NaIUmXt8mcLIErCt1uEMdOoPAt9U%2FrifRyoo9it44kJ5F7GLH7Q%3D%3D';
    
    // 현재 날짜 기준으로 이번 달과 지난 달 데이터를 가져오기 위한 날짜 계산
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    let lastMonth = date.getMonth();
    let lastYear = year;
    if (lastMonth === 0) {
        lastMonth = 12;
        lastYear -= 1;
    }
    const lastMonthStr = String(lastMonth).padStart(2, '0');
    
    const DEAL_YMD_CURRENT = `${year}${month}`;
    const DEAL_YMD_LAST = `${lastYear}${lastMonthStr}`;
    
    // 최신 공공데이터포털 HTTPS 주소 사용 (구버전 HTTP IP 차단 회피용)
    const baseUrl = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev?serviceKey=${serviceKey}&LAWD_CD=11680&pageNo=1&numOfRows=1000`;
    
    try {
        // 서버 봇(봇 차단) 방지를 위한 헤더 추가
        const options = {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/xml, text/xml, */*; q=0.01'
            }
        };

        const [res1, res2] = await Promise.all([
            fetch(`${baseUrl}&DEAL_YMD=${DEAL_YMD_CURRENT}`, options),
            fetch(`${baseUrl}&DEAL_YMD=${DEAL_YMD_LAST}`, options)
        ]);
        
        const data1 = await res1.text();
        const data2 = await res2.text();
        
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" // 개발 테스트용 개방
            },
            body: JSON.stringify({ xml1: data1, xml2: data2 })
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.toString() }) };
    }
}
