let rivalData = [];
let chartInstance = null;
let currentPair = '1';
let currentTab = 'overview';

// 각 보유 호기별 다중 비교 단지 옵션 정의 (도곡렉슬 -> 역삼래미안 13평 수정)
const RIVAL_OPTIONS = {
    '1': [
        { id: 'p1', name: '1호기: 역삼아이파크 11평 (내물건)', color: '#f59e0b', default: true, isBase: true },
        { id: 'r1_hillstate', name: '삼성동 힐스테이트 2단지 15평', color: '#ef4444', default: true },
        { id: 'r1_yeoksam_raemian', name: '역삼 래미안 13평 (전용 33㎡)', color: '#ec4899', default: true },
        { id: 'r1_jamsil', name: '잠실 리센츠/엘스 12평', color: '#8b5cf6', default: false },
        { id: 'r1_mapu', name: '마포 래미안푸르지오 24평', color: '#3b82f6', default: false }
    ],
    '2': [
        { id: 'p2', name: '2호기: 쌍용더플래티넘 17㎡ (내물건)', color: '#06b6d4', default: true, isBase: true },
        { id: 'r2_brown', name: '중림동 브라운스톤서울 25㎡', color: '#a855f7', default: true },
        { id: 'r2_gongdeok', name: '공덕 디오빌 20㎡', color: '#10b981', default: true },
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

// 현재 선택된 비교 단지 셋
let activeSelectedIds = new Set();

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Fetch Rival Dataset
    try {
        const resp = await fetch('rival-comparison-2006-2026.json');
        rivalData = await resp.json();
    } catch (e) {
        console.error("Error loading rival dataset:", e);
    }

    // 2. Initialize Main Navigation Tab Handlers
    initMainTabs();

    // 3. Initialize Rival Selection Chips for pair 1
    initChipsForPair('1');

    // 4. Initialize Rival Chart
    initChart();

    // 5. Render Insight Cards for initial pair
    renderInsightCards('1');

    // 6. Render Milestone Table
    renderMilestoneTable();

    // 7. Rival Pair Sub-Tab Switch
    const rTabs = document.querySelectorAll('#rivalPairTabs .r-tab-btn');
    rTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            rTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentPair = tab.getAttribute('data-pair');
            initChipsForPair(currentPair);
            updateChart();
            renderInsightCards(currentPair);
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

    if (tabId === 'rival' && chartInstance) {
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
            renderInsightCards(currentPair);
        });
    });
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
        document.getElementById('rivalChartTitle').innerText = '📈 [1호기] 역삼아이파크 11평 vs 과거/현재 주요 아파트 시세 추이';
        document.getElementById('rivalChartSub').innerText = '강남 소형 대표 아파트(역삼래미안·힐스테이트) 20년간 시세 추이 및 프리미엄 격차 변화 (2006~2026년)';
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

function renderInsightCards(pair) {
    const grid = document.getElementById('rivalInsightsGrid');
    if (!grid) return;

    if (pair === '1') {
        grid.innerHTML = `
            <div class="div-card border-gold">
                <div class="div-header">
                    <span class="div-badge gold-bg">1호기 vs 역삼래미안·힐스테이트·리센츠 비교</span>
                    <h3>역삼동 대표 쌍두마차 (역삼아이파크 11평 vs 역삼래미안 13평)</h3>
                </div>
                <div class="div-body">
                    <div class="div-comparison-box">
                        <div class="c-item">
                            <span class="year-lbl">2006년 당시 시세</span>
                            <div class="val-group">
                                <span>1호기(11평): 1.85억</span>
                                <span>역삼래미안(13평): 2.20억</span>
                                <span>힐스테이트(15평): 2.90억</span>
                            </div>
                        </div>
                        <div class="arrow-divider">➔</div>
                        <div class="c-item">
                            <span class="year-lbl">2026년 현재 시세</span>
                            <div class="val-group">
                                <span>1호기(11평): 11.5억~12억</span>
                                <span>역삼래미안(13평): 12.8억</span>
                                <span>힐스테이트(15평): 15.3억</span>
                            </div>
                        </div>
                    </div>
                    <p class="div-desc">
                        💡 <strong>가격 분석:</strong> 바로 옆에 위치한 **역삼 래미안 13평(전용 33㎡, 현 12.8억)**과 1호기 역삼아이파크 11평(전용 28.2㎡, 현 11.5~12억)은 20년 전 불과 3,500만 원 차이에서 시작하여 현재도 1억 안팎의 근소한 격차를 유지하며 **역삼동 소형 아파트 시세를 끌어올리는 쌍두마차** 역할을 하고 있습니다.
                    </p>
                </div>
            </div>

            <div class="div-card border-gold">
                <div class="div-header">
                    <span class="div-badge gold-bg">마포래미안푸르지오(24평)와의 가격 역전 및 추이</span>
                    <h3>마포 대장주 24평(12.6억) vs 강남 11평(11.5~12억)</h3>
                </div>
                <div class="div-body">
                    <p class="div-desc">
                        • <strong>시세 교차점:</strong> 2014년 마포래미안푸르지오 24평 분양·입주 당시(5.25억) 대비 1호기(3.05억)는 큰 차이가 났으나, 강남 입지 프리미엄이 누적되면서 **강북 대표 24평 아파트 시세에 필적하는 평당 가치**를 증명했습니다.<br>
                        • <strong>임대 방어력:</strong> 보유 1호기는 14층 로열층 + 최상급 인테리어로 **전세 5.7억 안착 완료**.
                    </p>
                </div>
            </div>
        `;
    } else if (pair === '2') {
        grid.innerHTML = `
            <div class="div-card border-cyan">
                <div class="div-header">
                    <span class="div-badge cyan-bg">2호기 vs 도심 오피스텔 (브라운스톤·공덕디 오빌·서초렉시온)</span>
                    <h3>전용 면적 차이 대비 소액 갭투자 승부</h3>
                </div>
                <div class="div-body">
                    <div class="div-comparison-box">
                        <div class="c-item">
                            <span class="year-lbl">2006년 당시</span>
                            <div class="val-group">
                                <span>2호기(17㎡): 1.05억</span>
                                <span>공덕디 오빌: 1.10억</span>
                                <span>브라운스톤: 1.50억</span>
                            </div>
                        </div>
                        <div class="arrow-divider">➔</div>
                        <div class="c-item">
                            <span class="year-lbl">2026년 현재</span>
                            <div class="val-group">
                                <span>2호기(17㎡): 2.78억</span>
                                <span>공덕디 오빌: 2.65억</span>
                                <span>브라운스톤: 3.90억</span>
                            </div>
                        </div>
                    </div>
                    <p class="div-desc">
                        💡 <strong>가격 분석:</strong> 2006년 당시 공덕디 오빌(1.1억)과 유사 가격대였던 2호기(1.05억)는 현재 2.78억 원으로 **공덕 도심 오피스텔 시세를 앞질렀습니다**. 복층 구조 특유의 높은 전세 수요(전세 2.55억) 덕분에 **실투자금 2,300만 원**으로 보유 가능한 극강의 효자 자산입니다.
                    </p>
                </div>
            </div>

            <div class="div-card border-cyan">
                <div class="div-header">
                    <span class="div-badge cyan-bg">17층 고층 전망 & 안정적 현금흐름</span>
                    <h3>서울역 도심 직주근접 입지 가치</h3>
                </div>
                <div class="div-body">
                    <p class="div-desc">
                        • <strong>17층 탁 트인 조망:</strong> 임차인 선호도가 높은 고층 조망 보유.<br>
                        • <strong>전세 2.55억 안착:</strong> 매매가 2.78억 대비 91.7% 전세가율 확보로 자기자본 상환 완결.
                    </p>
                </div>
            </div>
        `;
    } else if (pair === '3') {
        grid.innerHTML = `
            <div class="div-card border-emerald">
                <div class="div-header">
                    <span class="div-badge emerald-bg">3호기(삼성동한솔) vs 반포 미도1차(34평) Divergence</span>
                    <h3>20년 전 3.8~3.9억으로 가격이 똑같았던 두 단지의 현재!</h3>
                </div>
                <div class="div-body">
                    <div class="div-comparison-box">
                        <div class="c-item">
                            <span class="year-lbl">2006년 당시 (동일 가격대)</span>
                            <div class="val-group">
                                <span>3호기(한솔23평): 3.80억</span>
                                <span>반포미도1차(34평): 3.90억</span>
                            </div>
                            <div class="gap-result">격차: <strong>불과 1,000만 원</strong></div>
                        </div>
                        <div class="arrow-divider">➔</div>
                        <div class="c-item">
                            <span class="year-lbl">2026년 현재</span>
                            <div class="val-group">
                                <span>3호기(한솔23평): 21.3억</span>
                                <span>반포미도1차(34평): 26.5억</span>
                            </div>
                            <div class="gap-result text-emerald">격차: <strong>5.2억 원 벌어짐</strong></div>
                        </div>
                    </div>
                    <p class="div-desc">
                        💡 <strong>비교 분석:</strong> 2006년 당시 **반포 미도1차 34평(3.9억)과 3호기 삼성동한솔 23평(3.8억)은 가격대가 완벽히 동일**했습니다. 반포 재건축/대형 평형 프리미엄으로 반포미도가 26.5억으로 올랐지만, 3호기 삼성동한솔 또한 21.3억 원으로 **20년간 5.6배 폭등**하며 삼성동 핵심 실거주 자산으로서 입지를 입증했습니다.
                    </p>
                </div>
            </div>

            <div class="div-card border-emerald">
                <div class="div-header">
                    <span class="div-badge emerald-bg">대치 현대 & 마용성(옥수파크힐스) 시세 비교</span>
                    <h3>강남 입지의 힘 (21.3억 vs 19.2억)</h3>
                </div>
                <div class="div-body">
                    <p class="div-desc">
                        • <strong>대치동 대치현대 24평(22.8억) 추격:</strong> 대치동 학원가 입지 대치현대와 불과 1.5억 차이를 유지하며 삼성동 GBC/영동대로 호재를 온전히 흡수 중.<br>
                        • <strong>마용성 신축 대비 상위 시세:</strong> 옥수 e편한세상파크힐스 24평(19.2억) 대비 3호기가 **2.1억 원 더 높은 시세** 형성 중 (19층 탑층 프리미엄).
                    </p>
                </div>
            </div>
        `;
    }
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
            <td>${row.r1_yeoksam_raemian}억 원</td>
            <td class="highlight-sale"><strong>${row.p2}억 원</strong></td>
            <td>${row.r2_brown}억 원</td>
            <td class="highlight-sale"><strong>${row.p3}억 원</strong></td>
            <td>${row.r3_seoktap}억 원</td>
            <td><strong style="color: var(--rose);">${row.r3_banpo_mido}억 원</strong></td>
        </tr>`;
    });

    tbody.innerHTML = html;
}
