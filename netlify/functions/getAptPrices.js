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
        
        const targetApts = ['푸른솔진흥', '한솔', '석탑', '현대', 'CLK', '월드타워', '우정에쉐르'];
        const aptDataMap = {};

        for (const result of results) {
            if (result.status === 'fulfilled' && result.value.ok) {
                const xmlStr = await result.value.text();
                
                // 브라우저 DOMParser 대신 정규식으로 안전하게 추출 (Lambda 환경)
                const items = xmlStr.split('<item>');
                items.shift();
                
                items.forEach(itemStr => {
                    const extract = (tag) => {
                        const match = itemStr.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
                        return match ? match[1].trim() : '';
                    };
                    
                    const dong = extract('umdNm');
                    const apiLAWD = extract('sggCd');
                    if (!dong.includes('삼성동') && apiLAWD !== '11680') return;
                    
                    const aptNm = extract('aptNm');
                    const price = extract('dealAmount');
                    const area = extract('excluUseAr');
                    const dealYear = extract('dealYear');
                    const dealMonth = extract('dealMonth');
                    const dealDay = extract('dealDay');
                    
                    targetApts.forEach(target => {
                        if (aptNm.includes(target)) {
                            const pyNum = Math.round(parseFloat(area) * 0.3025);
                            const key = `${target}_${pyNum}`; 
                            const dateVal = parseInt(`${dealYear}${dealMonth.padStart(2,'0')}${dealDay.padStart(2,'0')}`);
                            
                            if (!aptDataMap[key] || aptDataMap[key].dateVal < dateVal) {
                                let numPrice = parseInt(price.replace(/,/g, ''));
                                let formattedPrice = numPrice >= 10000 ? `${Math.floor(numPrice/10000)}억 ${numPrice%10000 > 0 ? (numPrice%10000 + '만') : ''}` : `${numPrice}만`;
                                
                                aptDataMap[key] = {
                                    apt: target,
                                    py: `${pyNum}평`,
                                    pyNum: pyNum,
                                    price: formattedPrice,
                                    dateVal: dateVal,
                                    dateStr: `${dealYear.slice(-2)}.${dealMonth}.${dealDay}`
                                };
                            }
                        }
                    });
                });
            }
        }
        
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(aptDataMap)
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.toString() }) };
    }
}
