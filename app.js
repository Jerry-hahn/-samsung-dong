const complexData = {
    'complex-world-tower': { 
        name: '월드타워', households: '46세대', far: '402.04%', area: '1,666㎡', 
        strategy: '학동로변 최북단 입지로, 통합 개발 시 상업 및 업무 시설 배치의 핵심 관문 역할을 수행합니다.' 
    },
    'complex-clk': { 
        name: 'CLK', households: '12세대', far: '295.14%', area: '592.5㎡', 
        strategy: '소규모 단지이나 석탑/한솔 사이의 연결 고리로, 필지 합병을 통한 용적률 인센티브 확보의 필수 요충지입니다.' 
    },
    'complex-seoktap': { 
        name: '석탑', households: '139세대', far: '298.34%', area: '3,859.7㎡', 
        strategy: '중심부 L자형 필지로, 통합 시 커뮤니티 광장 및 대규모 조경 공간의 핵심부로 전환되어 단지 품격을 결정합니다.' 
    },
    'complex-hansol': { 
        name: '한솔', households: '263세대', far: '270.0%', area: '3,745.5㎡', 
        strategy: '동측 강남구청역 방향의 대규모 단지로, 통합 시 역세권 접근성을 극대화하는 주거 주동 배치의 중심축이 됩니다.' 
    },
    'complex-pureunsol': { 
        name: '푸른솔진흥', households: '61세대', far: '244.31%', area: '2,131㎡', 
        strategy: '최동단 독립 필지로, 통합 개발 시 숲세권 프라이빗 동 또는 특화 평형 배치를 통해 희소 가치를 창출합니다.' 
    },
    'complex-hyundai': { 
        name: '현대', households: '396세대', far: '307.07%', area: '6,303.4㎡', 
        strategy: '최남단 대규모 필지로, 선릉로와 주거지를 잇는 랜드마크 주동 배치가 가능하며 통합 단지의 규모감을 완성합니다.' 
    },
    'complex-woojung': { 
        name: '우정에쉐르', households: '40세대', far: '296.84%', area: '1,120㎡', 
        strategy: '남서측 진입로에 위치하여 통합 단지의 시그니처 게이트 및 연도형 상가 배치를 통한 가치 상승이 기대됩니다.' 
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const sites = document.querySelectorAll('.complex-site');
    const sheet = document.getElementById('bottom-sheet');
    const sheetTitle = document.getElementById('sheet-title');
    const valHouseholds = document.getElementById('val-households');
    const valFar = document.getElementById('val-far');
    const valArea = document.getElementById('val-area');
    const valStrategy = document.getElementById('val-strategy');
    const sheetTrigger = document.getElementById('sheet-trigger');

    // Bottom Sheet Interaction Logic
    let isSheetOpen = false;

    const toggleSheet = (forceState) => {
        isSheetOpen = forceState !== undefined ? forceState : !isSheetOpen;
        if (isSheetOpen) {
            sheet.classList.remove('sheet-closed');
            sheet.classList.add('sheet-open');
        } else {
            sheet.classList.add('sheet-closed');
            sheet.classList.remove('sheet-open');
        }
    };

    sheetTrigger.addEventListener('click', () => toggleSheet());

    // Site Click Handler
    sites.forEach(site => {
        site.addEventListener('click', (e) => {
            const rawId = site.id;
            // Handle multi-part sites like Hyundai
            const complexId = rawId.includes('hyundai') ? 'complex-hyundai' : rawId;
            const data = complexData[complexId];

            if (!data) return;

            // Update Active Class for all parts of the complex
            sites.forEach(s => s.classList.remove('active'));
            if (complexId === 'complex-hyundai') {
                document.querySelectorAll('[id*="hyundai"]').forEach(s => s.classList.add('active'));
            } else {
                site.classList.add('active');
            }

            // Update UI
            sheetTitle.textContent = data.name;
            valHouseholds.textContent = data.households;
            valFar.textContent = data.far;
            valArea.textContent = data.area;
            valStrategy.textContent = data.strategy;

            // Open Sheet automatically on selection
            toggleSheet(true);

            // Haptic Feedback (Mobile fallback)
            if (window.navigator.vibrate) window.navigator.vibrate(10);
        });
    });

    // Close sheet when clicking on map background
    document.getElementById('blueprint-svg').addEventListener('click', (e) => {
        if (e.target.tagName !== 'path') {
            toggleSheet(false);
            sites.forEach(s => s.classList.remove('active'));
        }
    });

    // Swipe Logic for Bottom Sheet (Simple touch tracking)
    let touchStartY = 0;
    sheetTrigger.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    sheetTrigger.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        if (touchStartY - touchEndY > 50) {
            toggleSheet(true); // Swipe Up
        } else if (touchEndY - touchStartY > 50) {
            toggleSheet(false); // Swipe Down
        }
    // Counter Animations
    const animateCounter = (el, target, duration = 2000) => {
        let start = 0;
        constステップ = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const current = (progress * target).toFixed(target % 1 === 0 ? 0 : 1);
            el.textContent = current;
            if (progress < 1) {
                window.requestAnimationFrame(ステップ);
            }
        };
        window.requestAnimationFrame(ステップ);
    };

    const counterEl = document.querySelector('.counter');
    if (counterEl) animateCounter(counterEl, 68.4);

    const visitorEl = document.getElementById('live-visitors');
    if (visitorEl) {
        animateCounter(visitorEl, 846);
        // Randomly fluctuate visitors
        setInterval(() => {
            const current = parseInt(visitorEl.textContent);
            const delta = Math.floor(Math.random() * 5) - 2;
            visitorEl.textContent = Math.max(800, current + delta);
        }, 3000);
    }
});
