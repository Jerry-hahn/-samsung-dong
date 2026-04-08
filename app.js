// Initialize AOS Plugin
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        once: true,
        offset: 50,
        duration: 800,
        easing: 'ease-in-out',
    });

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.add('scrolled'); // actually we want glassmorphism always or partially? let's make it toggle
            navbar.classList.remove('scrolled');
            if(window.scrollY > 50) {
                 navbar.classList.add('scrolled');
            }
        }
    });
    
    // Ensure accurate initial state
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }

    // Modal Logic
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const modals = document.querySelectorAll('.modal-overlay');
    const closeButtons = document.querySelectorAll('.modal-close');

    // Open Modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const targetId = trigger.getAttribute('data-modal-target');
            const targetModal = document.getElementById(targetId);
            if (targetModal) {
                targetModal.classList.add('active');
                document.body.classList.add('modal-open');
            }
        });
    });

    // Close Modal via button
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = btn.closest('.modal-overlay');
            if (modal) {
                modal.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });
    });

    // Close Modal by clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.classList.remove('modal-open');
            }
        });
    });

    // Real-Time API Linkage
    async function updateMarketData() {
        const tableBody = document.getElementById('live-data-body');
        if (!tableBody) return;

        // Show loading state
        const backupHtml = tableBody.innerHTML;
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:3rem;"><i class="ph ph-spinner ph-spin" style="font-size:2rem; color:var(--primary);"></i><br>국토부 공공데이터 API 실시간 연동 중...</td></tr>`;

        try {
            const response = await fetch('/.netlify/functions/getAptPrices');
            if (!response.ok) throw new Error('API fetch failed');
            const parser = new DOMParser();
            const allItems = [];
            
            // 60개월치 모든 XML 파싱 후 아이템 합치기
            if (dataJson.xmls && dataJson.xmls.length > 0) {
                dataJson.xmls.forEach(xmlStr => {
                    const doc = parser.parseFromString(xmlStr, "text/xml");
                    const items = Array.from(doc.getElementsByTagName('item'));
                    allItems.push(...items);
                });
            }
            
            const targetApts = ['푸른솔진흥', '한솔', '석탑', '현대', 'CLK', '월드타워', '우정에쉐르'];
            const aptDataMap = {};
            
            allItems.forEach(item => {
                const dong = item.getElementsByTagName('umdNm')[0]?.textContent?.trim() || '';
                const apiLAWD = item.getElementsByTagName('sggCd')[0]?.textContent?.trim() || '';
                if (!dong.includes('삼성동') && apiLAWD !== '11680') return;
                
                const aptNm = item.getElementsByTagName('aptNm')[0]?.textContent?.trim() || '';
                const price = item.getElementsByTagName('dealAmount')[0]?.textContent?.trim() || '';
                const area = item.getElementsByTagName('excluUseAr')[0]?.textContent?.trim() || '';
                const dealYear = item.getElementsByTagName('dealYear')[0]?.textContent?.trim() || '';
                const dealMonth = item.getElementsByTagName('dealMonth')[0]?.textContent?.trim() || '';
                const dealDay = item.getElementsByTagName('dealDay')[0]?.textContent?.trim() || '';
                
                targetApts.forEach(target => {
                    if (aptNm.includes(target)) {
                        const pyNum = Math.round(parseFloat(area) * 0.3025);
                        const key = `${target}_${pyNum}`; // 아파트명 + 평형 조합으로 식별
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
            
            let htmlContent = '';
            
            // 찾은 평형들을 고유 단지 순서 & 평형 크기 순서로 정렬
            const foundKeys = Object.keys(aptDataMap).sort((a,b) => {
                const aptA = aptDataMap[a].apt;
                const aptB = aptDataMap[b].apt;
                if (aptA !== aptB) {
                    return targetApts.indexOf(aptA) - targetApts.indexOf(aptB);
                }
                return aptDataMap[a].pyNum - aptDataMap[b].pyNum; // 같은 아파트면 평수 작은 것부터
            });

            // 매물이 있는 단지들 출력
            foundKeys.forEach(key => {
                const info = aptDataMap[key];
                htmlContent += `
                <tr>
                    <td><div class="complex-name"><i class="ph-fill ph-building"></i> ${info.apt}</div></td>
                    <td>${info.py}</td>
                    <td><strong>${info.price}</strong></td>
                    <td><span class="data-up text-gold"><i class="ph ph-check-circle"></i> ${info.dateStr} 실거래</span></td>
                    <td class="text-dim">최근 5년 기준</td>
                </tr>`;
            });

            // 단 한 건도 없는 단지들 출력
            targetApts.forEach(apt => {
                const hasTrade = foundKeys.some(k => aptDataMap[k].apt === apt);
                if (!hasTrade) {
                    htmlContent += `
                    <tr>
                        <td><div class="complex-name"><i class="ph-fill ph-building"></i> ${apt}</div></td>
                        <td colspan="4" class="text-dim">최근 5년(60개월) 내 실거래 없음</td>
                    </tr>`;
                }
            });
            tableBody.innerHTML = htmlContent;
            
        } catch(err) {
            console.error('API Local Fallback:', err);
            // Revert to static mock UI if not run via Netlify / missing function access
            tableBody.innerHTML = backupHtml;
        }
    }

    // Initialize API update
    updateMarketData();
});
