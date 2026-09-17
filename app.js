let matchedHistoricalData = {};
let similarPriceMatches = {};
let chartInstance = null;
let currentPair = '1';
let currentTab = 'overview';

document.addEventListener('DOMContentLoaded', async () => {
    const cacheBuster = `?v=${Date.now()}`;

    // 1. Fetch 20-Year Matched Historical Trajectory Dataset
    try {
        const resp = await fetch('matched_historical_data.json' + cacheBuster);
        if (resp.ok) matchedHistoricalData = await resp.json();
    } catch (e) {
        console.error("Error loading matched historical data:", e);
    }

    // 2. Fetch Real MOLIT API ±10% Matched Transactions Dataset
    try {
        const resp = await fetch('similar_price_matches.json' + cacheBuster);
        if (resp.ok) similarPriceMatches = await resp.json();
    } catch (e) {
        console.error("Error loading similar price matches:", e);
    }

    initMainTabs();
    initMyAssetsChart();
    initChipsForPair('1');
    initChart();
    renderStories('1');
    renderRealMolitCards('1');
    renderMilestoneTable();

    const rTabs = document.querySelectorAll('#rivalPairTabs .r-tab-btn');
    rTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            rTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentPair = tab.getAttribute('data-pair');
            initChipsForPair(currentPair);
            updateChart();
            renderStories(currentPair);
            renderRealMolitCards(currentPair);
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

    if (tabId === 'matched-rival' && chartInstance) {
        setTimeout(() => {
            chartInstance.resize();
            chartInstance.update();
        }, 50);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initChipsForPair(pair) {

    const key = `prop${pair}`;
    const pGroup = matchedHistoricalData[key];
    if (!pGroup) return;

    let html = '';
    pGroup.items.forEach(opt => {
        html += `
            <span class="chip-btn active" style="cursor: default;">
                <span class="dot" style="background-color: ${opt.color};"></span>
                <span>${opt.name}</span>
            </span>
        `;
    });

    const container = document.getElementById('matchedChipsContainer');
    if (container) container.innerHTML = html;
}

function initChart() {
    const canvas = document.getElementById('matchedTrajectoryChart');
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
    const key = `prop${pair}`;
    const pGroup = matchedHistoricalData[key];

    if (!pGroup) return { labels: [], datasets: [] };

    const years = pGroup.years.map(y => y + '년');
    document.getElementById('matchedChartTitle').innerText = `📈 [${pGroup.name}] 20개년(2006~2026) 시세 궤적 & 역전 차트`;
    document.getElementById('matchedChartSub').innerText = `현재 시세 밴드(${pGroup.rangeStr}) 내 검증된 아파트들의 20년간 시세 형성 과정 및 교차점 분석`;

    let datasets = [];
    pGroup.items.forEach(opt => {
        datasets.push({
            label: opt.name,
            data: opt.data,
            borderColor: opt.color,
            backgroundColor: opt.color + '1a',
            borderDash: opt.isBase ? [] : [4, 4],
            tension: 0.3,
            pointRadius: opt.isBase ? 5 : 4,
            borderWidth: opt.isBase ? 4 : 2
        });
    });

    return { labels: years, datasets: datasets };
}

function updateChart() {
    if (!chartInstance) return;
    chartInstance.data = getChartConfig(currentPair);
    chartInstance.update();
}

function renderRealMolitCards(pair) {
    const key = `prop${pair}`;
    const pData = similarPriceMatches[key];
    const grid = document.getElementById('realMolitGrid');

    if (!pData || !grid) return;

    let html = '';
    pData.matches.forEach(item => {
        const isPlus = item.diff.startsWith('+');
        const diffColor = isPlus ? 'color: var(--rose);' : 'color: var(--emerald);';

        html += `
            <div class="matched-card">
                <div>
                    <div class="mc-header">
                        <span class="mc-dong">🏛️ ${item.dong} (${item.floor})</span>
                        <span class="mc-diff" style="${diffColor}">기준가 대비 ${item.diff}</span>
                    </div>
                    <h3 class="mc-title">${item.apt}</h3>
                    <div class="mc-area">${item.area}</div>
                </div>
                <div class="mc-price-row">
                    <div>
                        <div class="mc-price-lbl">국토부 실거래가</div>
                        <div class="mc-price-val">${item.priceStr}</div>
                    </div>
                    <div class="mc-date">📅 ${item.date}</div>
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;
}

function renderStories(pair) {
    const grid = document.getElementById('matchedStoriesGrid');
    if (!grid) return;

    const key = `prop${pair}`;
    const pGroup = matchedHistoricalData[key];
    if (!pGroup) return;

    let html = '';
    pGroup.items.forEach(opt => {
        if (opt.isBase || !opt.story) return;

        const val2006 = opt.data[0] ? `${opt.data[0]}억` : '분양전';
        const val2026 = `${opt.data[opt.data.length - 1]}억`;

        html += `
            <div class="div-card border-gold">
                <div class="div-header">
                    <span class="div-badge gold-bg">20년 궤적 스토리</span>
                    <h3>${opt.name}</h3>
                </div>
                <div class="div-body">
                    <div class="div-comparison-box">
                        <div class="c-item">
                            <span class="year-lbl">2006년 당시</span>
                            <div class="val-group"><span>${val2006}</span></div>
                        </div>
                        <div class="arrow-divider">➔</div>
                        <div class="c-item">
                            <span class="year-lbl">2026년 현재 (±10% 동급)</span>
                            <div class="val-group"><span class="text-gold">${val2026}</span></div>
                        </div>
                    </div>
                    <p class="div-desc">
                        💡 <strong>역전 & 궤적 인사이트:</strong> ${opt.story}
                    </p>
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;
}

function renderMilestoneTable() {
    const tbody = document.getElementById('rivalMilestoneTableBody');
    if (!tbody) return;

    const p1 = matchedHistoricalData.prop1;
    if (!p1) return;

    let html = '';
    const years = p1.years;

    for (let i = years.length - 1; i >= 0; i--) {
        const year = years[i];
        const v_p1 = p1.items[0].data[i];
        const v_haengdang = p1.items[1].data[i] || '-';
        const v_mapu = p1.items[2].data[i] || '-';

        const p2 = matchedHistoricalData.prop2;
        const v_p2 = p2.items[0].data[i];
        const v_gongdeok = p2.items[1].data[i] || '-';

        const p3 = matchedHistoricalData.prop3;
        const v_p3 = p3.items[0].data[i];
        const v_jamsil = p3.items[1].data[i] || '-';
        const v_banpo = p3.items[4].data[i] || '-';

        html += `<tr>
            <td><strong>${year}년</strong></td>
            <td class="highlight-sale"><strong>${v_p1}억 원</strong></td>
            <td>${v_haengdang !== '-' ? v_haengdang + '억' : '-'}</td>
            <td>${v_mapu !== '-' ? v_mapu + '억' : '-'}</td>
            <td class="highlight-sale"><strong>${v_p2}억 원</strong></td>
            <td>${v_gongdeok !== '-' ? v_gongdeok + '억' : '-'}</td>
            <td class="highlight-sale"><strong>${v_p3}억 원</strong></td>
            <td>${v_jamsil !== '-' ? v_jamsil + '억' : '-'}</td>
            <td><strong style="color: var(--rose);">${v_banpo !== '-' ? v_banpo + '억' : '-'}</strong></td>
        </tr>`;
    }

    tbody.innerHTML = html;
}

let myAssetsChartInstance = null;

function initMyAssetsChart() {
    const canvas = document.getElementById('myAssetsChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    myAssetsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1호기 (역삼아이파크 11평)', '2호기 (쌍용더플래티넘 17㎡)', '3호기 (삼성동한솔 23평)'],
            datasets: [
                {
                    label: '현재 매매 시세 (억 원)',
                    data: [11.5, 2.78, 21.3],
                    backgroundColor: ['rgba(245, 158, 11, 0.85)', 'rgba(6, 182, 212, 0.85)', 'rgba(16, 185, 129, 0.85)'],
                    borderRadius: 6
                },
                {
                    label: '승계 보증금 (억 원)',
                    data: [5.7, 2.55, 0],
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    borderRadius: 6
                },
                {
                    label: '순자산 가치 (억 원)',
                    data: [5.8, 0.23, 21.3],
                    backgroundColor: ['rgba(245, 158, 11, 0.4)', 'rgba(6, 182, 212, 0.4)', 'rgba(16, 185, 129, 0.4)'],
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#94a3b8', font: { family: 'Inter', size: 11, weight: 'bold' } }
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
                    ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11, weight: 'bold' } },
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

