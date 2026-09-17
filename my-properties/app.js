let rivalData = [];
let chartInstance = null;
let currentPair = '1';
let currentTab = 'overview';

// 기본 디폴트 ±10% 실거래 매칭 데이터셋 (Fetch 실패나 캐시 타임아웃 대비 100% 보장 Fallback)
let matchedData = {
    "prop1": {
        "name": "1호기 (역삼아이파크 11평)",
        "price": 115000,
        "range_min": 103500,
        "range_max": 126500,
        "matches": [
            { "apt": "행당 한진타운", "area": "전용 59.9㎡ (24평)", "dong": "성동구 행당동", "price": 112000, "priceStr": "11.20억", "date": "2026-03-04", "diff": "-2.6%" },
            { "apt": "잠실 갤러리아팰리스", "area": "전용 46.8㎡ (19평)", "dong": "송파구 잠실동", "price": 118000, "priceStr": "11.80억", "date": "2026-03-02", "diff": "+2.6%" },
            { "apt": "마포 래미안푸르지오", "area": "전용 59.9㎡ (24평)", "dong": "마포구 아현동", "price": 126000, "priceStr": "12.60억", "date": "2026-02-28", "diff": "+9.5%" },
            { "apt": "고덕 그라시움", "area": "전용 59.9㎡ (25평)", "dong": "강동구 고덕동", "price": 115000, "priceStr": "11.50억", "date": "2026-02-25", "diff": "0.0%" },
            { "apt": "목동 신시가지 5단지", "area": "전용 48.6㎡ (18평)", "dong": "양천구 목동", "price": 122000, "priceStr": "12.20억", "date": "2026-02-20", "diff": "+6.1%" },
            { "apt": "신길 래미안에스티움", "area": "전용 84.9㎡ (34평)", "dong": "영등포구 신길동", "price": 119500, "priceStr": "11.95억", "date": "2026-02-18", "diff": "+3.9%" }
        ]
    },
    "prop2": {
        "name": "2호기 (쌍용더플래티넘 17㎡)",
        "price": 27800,
        "range_min": 25000,
        "range_max": 30500,
        "matches": [
            { "apt": "공덕 디오빌 (오피스텔)", "area": "전용 20.4㎡ (10평)", "dong": "마포구 공덕동", "price": 26500, "priceStr": "2.65억", "date": "2026-03-05", "diff": "-4.7%" },
            { "apt": "디오빌 강남 (오피스텔)", "area": "전용 22.1㎡ (11평)", "dong": "강남구 역삼동", "price": 29800, "priceStr": "2.98억", "date": "2026-03-01", "diff": "+7.2%" },
            { "apt": "용산 아스테리움 (오피스텔)", "area": "전용 23.5㎡ (12평)", "dong": "용산구 한강로", "price": 30200, "priceStr": "3.02억", "date": "2026-02-27", "diff": "+8.6%" },
            { "apt": "신촌 푸르지오시티", "area": "전용 25.2㎡ (12평)", "dong": "서대문구 창천동", "price": 27000, "priceStr": "2.70억", "date": "2026-02-22", "diff": "-2.9%" },
            { "apt": "당산 삼성쉐르빌", "area": "전용 22.8㎡ (11평)", "dong": "영등포구 당산동", "price": 28500, "priceStr": "2.85억", "date": "2026-02-15", "diff": "+2.5%" }
        ]
    },
    "prop3": {
        "name": "3호기 (삼성동 한솔아파트 23평)",
        "price": 213000,
        "range_min": 191700,
        "range_max": 234300,
        "matches": [
            { "apt": "대치 현대아파트", "area": "전용 59.8㎡ (24평)", "dong": "강남구 대치동", "price": 228000, "priceStr": "22.80억", "date": "2026-03-05", "diff": "+7.0%" },
            { "apt": "삼성동 석탑아파트", "area": "전용 59.9㎡ (23평)", "dong": "강남구 삼성동", "price": 198000, "priceStr": "19.80억", "date": "2026-03-03", "diff": "-7.0%" },
            { "apt": "잠실 엘스", "area": "전용 59.9㎡ (25평)", "dong": "송파구 잠실동", "price": 218000, "priceStr": "21.80억", "date": "2026-02-28", "diff": "+2.3%" },
            { "apt": "e편한세상 옥수파크힐스", "area": "전용 59.9㎡ (24평)", "dong": "성동구 옥수동", "price": 192000, "priceStr": "19.20억", "date": "2026-02-26", "diff": "-9.9%" },
            { "apt": "반포 자이", "area": "전용 59.9㎡ (25평)", "dong": "서초구 반포동", "price": 232000, "priceStr": "23.20억", "date": "2026-02-20", "diff": "+8.9%" },
            { "apt": "마포 프레스티지 자이", "area": "전용 84.9㎡ (34평)", "dong": "마포구 염리동", "price": 208000, "priceStr": "20.80억", "date": "2026-02-15", "diff": "-2.3%" }
        ]
    }
};

// 각 보유 호기별 과거/현재 가격대 일치 아파트 비교 옵션 정의
const RIVAL_OPTIONS = {
    '1': [
        { id: 'p1', name: '1호기: 역삼아이파크 11평 (내물건)', color: '#f59e0b', default: true, isBase: true },
        { id: 'r1_hillstate', name: '삼성동 힐스테이트 2단지 15평', color: '#ef4444', default: true },
        { id: 'r1_haengdang', name: '성동구 행당 한진타운 24평 (현재 11.2억 동급)', color: '#ec4899', default: true },
        { id: 'r1_sindorim', name: '신도림 태영데시앙 24평 (20년전 1.85억 동급)', color: '#8b5cf6', default: true },
        { id: 'r1_nowon', name: '노원 중계 주공5단지 24평 (노도강 24평)', color: '#3b82f6', default: false }
    ],
    '2': [
        { id: 'p2', name: '2호기: 쌍용더플래티넘 17㎡ (내물건)', color: '#06b6d4', default: true, isBase: true },
        { id: 'r2_brown', name: '중림동 브라운스톤서울 25㎡', color: '#a855f7', default: true },
        { id: 'r2_gongdeok', name: '공덕 디오빌 20㎡ (20년전 1.1억 동급)', color: '#10b981', default: true },
        { id: 'r2_lexion', name: '서초 현대렉시온 26㎡', color: '#f59e0b', default: false }
    ],
    '3': [
        { id: 'p3', name: '3호기: 삼성동 한솔 23평 (내물건)', color: '#10b981', default: true, isBase: true },
        { id: 'r3_seoktap', name: '삼성동 석탑아파트 23평', color: '#64748b', default: true },
        { id: 'r3_daechi', name: '대치 현대아파트 24평', color: '#06b6d4', default: true },
        { id: 'r3_banpo_mido', name: '반포 미도1차 34평 (20년전 3.9억 동급)', color: '#ef4444', default: true },
        { id: 'r3_oxu', name: '옥수 e편한세상파크힐스 24평', color: '#a855f7', default: false }
    ]
};

let activeSelectedIds = new Set();

document.addEventListener('DOMContentLoaded', async () => {
    const cacheBuster = `?v=${Date.now()}`;

    // 1. Fetch Rival Dataset with Cache Buster
    try {
        const resp = await fetch('rival-comparison-2006-2026.json' + cacheBuster);
        if (resp.ok) rivalData = await resp.json();
    } catch (e) {
        console.error("Error loading rival dataset:", e);
    }

    // 2. Fetch Matched Dataset with Cache Buster
    try {
        const resp = await fetch('similar_price_matches.json' + cacheBuster);
        if (resp.ok) {
            const fetchedData = await resp.json();
            if (fetchedData && fetchedData.prop1) {
                matchedData = fetchedData;
            }
        }
    } catch (e) {
        console.error("Error loading matched dataset:", e);
    }

    // 3. Initialize Main Navigation Tab Handlers
    initMainTabs();

    // 4. Initialize Rival Selection Chips for pair 1
    initChipsForPair('1');

    // 5. Initialize Rival Chart
    initChart();

    // 6. Render Matched Cards for initial pair
    renderMatchedCards('1');

    // 7. Render Milestone Table
    renderMilestoneTable();

    // 8. Rival Pair Sub-Tab Switch
    const rTabs = document.querySelectorAll('#rivalPairTabs .r-tab-btn');
    rTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            rTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentPair = tab.getAttribute('data-pair');
            initChipsForPair(currentPair);
            updateChart();
            renderMatchedCards(currentPair);
        });
    });
});

function initMainTabs() {
    const navButtons = document.querySelectorAll('#mainNavTabs .nav-tab-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

function switchTab(tabId) {
    currentTab = tabId;
    
    const navButtons = document.querySelectorAll('#mainNavTabs .nav-tab-btn');
    navButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const views = document.querySelectorAll('.tab-view');
    views.forEach(v => v.classList.remove('active'));

    const targetView = document.getElementById(`view-${tabId}`);
    if (targetView) {
        targetView.classList.add('active');
    }

    if (tabId === 'chart' && chartInstance) {
        setTimeout(() => {
            chartInstance.resize();
            chartInstance.update();
        }, 50);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initChipsForPair(pair) {
    activeSelectedIds.clear();
    const options = RIVAL_OPTIONS[pair];
    options.forEach(opt => {
        if (opt.default) {
            activeSelectedIds.add(opt.id);
        }
    });

    renderChipsUI(pair);
}

function renderChipsUI(pair) {
    const container = document.getElementById('rivalChipsContainer');
    if (!container) return;

    const options = RIVAL_OPTIONS[pair];
    let html = '';

    options.forEach(opt => {
        const isChecked = activeSelectedIds.has(opt.id);
        const activeClass = isChecked ? 'active' : '';
        html += `
            <button class="chip-btn ${activeClass}" data-id="${opt.id}">
                <span class="dot" style="background-color: ${opt.color};"></span>
                <span>${opt.name}</span>
            </button>
        `;
    });

    container.innerHTML = html;

    container.querySelectorAll('.chip-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const opt = options.find(o => o.id === id);
            
            if (opt && opt.isBase) return;

            if (activeSelectedIds.has(id)) {
                activeSelectedIds.delete(id);
                btn.classList.remove('active');
            } else {
                activeSelectedIds.add(id);
                btn.classList.add('active');
            }

            updateChart();
        });
    });
}

function renderMatchedCards(pair) {
    const key = `prop${pair}`;
    const pData = matchedData[key];
    const banner = document.getElementById('matchRangeBanner');
    const grid = document.getElementById('matchedCardsGrid');

    if (!pData || !banner || !grid) return;

    banner.innerHTML = `
        <div class="rb-title">🎯 ${pData.name} 현재 시세 기준 매칭</div>
        <div class="rb-badge">±10% 범위: ${(pData.range_min / 10000).toFixed(2)}억 ~ ${(pData.range_max / 10000).toFixed(2)}억 원</div>
    `;

    let html = '';
    pData.matches.forEach(item => {
        const isDiffPlus = item.diff.startsWith('+');
        const diffColor = isDiffPlus ? 'color: var(--rose);' : 'color: var(--emerald);';

        html += `
            <div class="matched-card">
                <div>
                    <div class="mc-header">
                        <span class="mc-dong">${item.dong}</span>
                        <span class="mc-diff" style="${diffColor}">${item.diff}</span>
                    </div>
                    <h3 class="mc-title">${item.apt}</h3>
                    <div class="mc-area">${item.area}</div>
                </div>
                <div class="mc-price-row">
                    <div>
                        <div class="mc-price-lbl">최근 실거래가</div>
                        <div class="mc-price-val">${item.priceStr}</div>
                    </div>
                    <div class="mc-date">${item.date}</div>
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;
}

function initChart() {
    const canvas = document.getElementById('rivalComparisonChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: getChartConfig(currentPair),
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    labels: { color: '#94a3b8', font: { family: 'Inter', size: 12, weight: 'bold' } }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}억 원`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#64748b' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                },
                y: {
                    ticks: { color: '#64748b', callback: v => v + '억' },
                    grid: { color: 'rgba(255,255,255,0.05)' }
                }
            }
        }
    });
}

function getChartConfig(pair) {
    if (!rivalData || rivalData.length === 0) return { labels: [], datasets: [] };

    const years = rivalData.map(d => d.year + '년');
    const options = RIVAL_OPTIONS[pair];
    let datasets = [];

    if (pair === '1') {
        document.getElementById('rivalChartTitle').innerText = '📈 [1호기] 역삼아이파크 11평 vs 과거/현재 시세 일치 아파트 추이';
        document.getElementById('rivalChartSub').innerText = '20년 전 가격이 동일했던 아파트 & 현재 시세가 일치하는 마용성 24평과의 20개년 비교';
    } else if (pair === '2') {
        document.getElementById('rivalChartTitle').innerText = '📈 [2호기] 쌍용더플래티넘 17㎡ vs 주요 도심 오피스텔';
        document.getElementById('rivalChartSub').innerText = '서울역·공덕·강남 도심 직주근접 주요 오피스텔 20개년 시세 비교 (2006~2026년)';
    } else if (pair === '3') {
        document.getElementById('rivalChartTitle').innerText = '📈 [3호기] 삼성동 한솔 23평 vs 과거 동급/현재 주요 아파트';
        document.getElementById('rivalChartSub').innerText = '삼성동·대치동 인근 아파트 및 20년 전 가격 비슷했던 반포 미도1차와의 시세 격차 Divergence (2006~2026년)';
    }

    options.forEach(opt => {
        if (activeSelectedIds.has(opt.id)) {
            datasets.push({
                label: opt.name,
                data: rivalData.map(d => d[opt.id]),
                borderColor: opt.color,
                backgroundColor: opt.color + '1a',
                borderDash: opt.isBase ? [] : [4, 4],
                tension: 0.3,
                pointRadius: opt.isBase ? 5 : 3,
                borderWidth: opt.isBase ? 3 : 2
            });
        }
    });

    return { labels: years, datasets: datasets };
}

function updateChart() {
    if (!chartInstance) return;
    chartInstance.data = getChartConfig(currentPair);
    chartInstance.update();
}

function renderMilestoneTable() {
    const tbody = document.getElementById('rivalMilestoneTableBody');
    if (!tbody) return;
    if (!rivalData || rivalData.length === 0) return;

    let html = '';
    const reversed = [...rivalData].reverse();

    reversed.forEach(row => {
        html += `<tr>
            <td><strong>${row.year}년</strong></td>
            <td class="highlight-sale"><strong>${row.p1}억 원</strong></td>
            <td>${row.r1_hillstate}억 원</td>
            <td>${row.r1_haengdang}억 원</td>
            <td>${row.r1_sindorim}억 원</td>
            <td class="highlight-sale"><strong>${row.p2}억 원</strong></td>
            <td>${row.r2_brown}억 원</td>
            <td class="highlight-sale"><strong>${row.p3}억 원</strong></td>
            <td>${row.r3_seoktap}억 원</td>
        </tr>`;
    });

    tbody.innerHTML = html;
}
