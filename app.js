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
            const dataJson = await response.json();
            
            const parser = new DOMParser();
            const xml1 = parser.parseFromString(dataJson.xml1, "text/xml");
            const xml2 = parser.parseFromString(dataJson.xml2, "text/xml");
            
            const items1 = Array.from(xml1.getElementsByTagName('item'));
            const items2 = Array.from(xml2.getElementsByTagName('item'));
            const allItems = [...items1, ...items2];
            
            const targetApts = ['푸른솔진흥', '한솔', '석탑', '현대', 'CLK', '월드타워', '우정에쉐르'];
            const aptDataMap = {};
            targetApts.forEach(apt => aptDataMap[apt] = null);
            
            allItems.forEach(item => {
                const dong = item.getElementsByTagName('umdNm')[0]?.textContent?.trim() || '';
                const apiLAWD = item.getElementsByTagName('sggCd')[0]?.textContent?.trim() || '';
                // Check if it's Gangnam(11680) and Samsung-dong
                if (!dong.includes('삼성동') && apiLAWD !== '11680') return;
                
                const aptNm = item.getElementsByTagName('aptNm')[0]?.textContent?.trim() || '';
                const price = item.getElementsByTagName('dealAmount')[0]?.textContent?.trim() || '';
                const area = item.getElementsByTagName('excluUseAr')[0]?.textContent?.trim() || '';
                const dealYear = item.getElementsByTagName('dealYear')[0]?.textContent?.trim() || '';
                const dealMonth = item.getElementsByTagName('dealMonth')[0]?.textContent?.trim() || '';
                const dealDay = item.getElementsByTagName('dealDay')[0]?.textContent?.trim() || '';
                
                targetApts.forEach(target => {
                    if (aptNm.includes(target)) {
                        const py = Math.round(parseFloat(area) * 0.3025);
                        const dateVal = parseInt(`${dealYear}${dealMonth.padStart(2,'0')}${dealDay.padStart(2,'0')}`);
                        
                        if (!aptDataMap[target] || aptDataMap[target].dateVal < dateVal) {
                            let numPrice = parseInt(price.replace(/,/g, ''));
                            let formattedPrice = numPrice >= 10000 ? `${Math.floor(numPrice/10000)}억 ${numPrice%10000 > 0 ? (numPrice%10000 + '만') : ''}` : `${numPrice}만`;
                            
                            aptDataMap[target] = {
                                py: `${py}평`,
                                price: formattedPrice,
                                dateVal: dateVal,
                                dateStr: `${dealMonth}/${dealDay}`
                            };
                        }
                    }
                });
            });
            
            let htmlContent = '';
            targetApts.forEach(apt => {
                const info = aptDataMap[apt];
                if (info) {
                    htmlContent += `
                    <tr>
                        <td><div class="complex-name"><i class="ph-fill ph-building"></i> ${apt}</div></td>
                        <td>${info.py}</td>
                        <td><strong>${info.price}</strong></td>
                        <td><span class="data-up text-gold"><i class="ph ph-check-circle"></i> ${info.dateStr} 실거래반영</span></td>
                        <td class="text-dim">국토부 API 연동 완료</td>
                    </tr>`;
                } else {
                    htmlContent += `
                    <tr>
                        <td><div class="complex-name"><i class="ph-fill ph-building"></i> ${apt}</div></td>
                        <td colspan="4" class="text-dim">최근 2개월 내 국토부 실거래 내역 없음</td>
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
