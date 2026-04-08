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
            
            // 백엔드에서 미리 파싱되고 정제된 JSON 데이터를 바로 받음
            const aptDataMap = await response.json();
            const targetApts = ['푸른솔진흥', '한솔', '석탑', '현대', 'CLK', '월드타워', '우정에쉐르'];
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
                    <td class="text-dim">최근 5년 최고</td>
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
            tableBody.innerHTML = backupHtml;
        }
    }

    // Initialize API update
    updateMarketData();
});
