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
    
    // 강남구(11680) 데이터 호출
    const baseUrl = `http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev?serviceKey=${serviceKey}&LAWD_CD=11680&pageNo=1&numOfRows=1000`;
    
    try {
        // 이번 달과 지난 달 데이터를 함께 요청하여 합침 (최근 실거래가 없을 수 있으므로)
        const [res1, res2] = await Promise.all([
            fetch(`${baseUrl}&DEAL_YMD=${DEAL_YMD_CURRENT}`),
            fetch(`${baseUrl}&DEAL_YMD=${DEAL_YMD_LAST}`)
        ]);
        
        const data1 = await res1.text();
        const data2 = await res2.text(); // 프론트엔드에서 파싱을 쉽게하기 위해 일단 두 결과를 배열(JSON)형태로 담아 보냄
        
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
