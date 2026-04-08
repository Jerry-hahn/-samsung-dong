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
        
        const targetApts = ['한솔', '푸른솔', '현대', '석탑', '우정', 'CLK', '월드타워'];
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
                    
                    // 정밀 필터링: 유저가 명시한 명칭과 실거래 데이터상의 명칭 매칭
                    targetApts.forEach(target => {
                        let isMatch = false;
                        if (target === '푸른솔') {
                            if (aptNm.includes('푸른솔') || aptNm.includes('진흥')) isMatch = true;
                        } else if (target === '우정') {
                            if (aptNm.includes('우정') || aptNm.includes('에쉐르')) isMatch = true;
                        } else if (target === '현대') {
                            // 삼성로104길 23 (삼성동 16-2) 현대아파트만 필터링
                            if (aptNm === '현대' || aptNm === '삼성현대') isMatch = true;
                        } else if (aptNm.includes(target)) {
                            isMatch = true;
                        }

                        if (isMatch) {
                            // 면적(m2) -> 일반적인 공급평형 근사치 계산 로직
                            const m2 = parseFloat(area);
                            let pyNum = 0;
                            if (m2 < 50) pyNum = 18;
                            else if (m2 < 70) pyNum = 25; // 전용 59 -> 공급 25
                            else if (m2 < 100) pyNum = 33; // 전용 84 -> 공급 33
                            else pyNum = Math.round(m2 * 0.3025 * 1.3); // 그 외 대략적 보정

                            const key = `${target}_${pyNum}`; 
                            const dateVal = parseInt(`${dealYear}${dealMonth.padStart(2,'0')}${dealDay.padStart(2,'0')}`);
                            
                            if (!aptDataMap[key] || aptDataMap[key].dateVal < dateVal) {
                                let numPrice = parseInt(price.replace(/,/g, ''));
                                let formattedPrice = numPrice >= 10000 ? `${(numPrice/10000).toFixed(1)}억` : `${numPrice}만`;
                                
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
