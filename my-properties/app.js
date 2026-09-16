let rivalData = [];
let chartInstance = null;
let currentPair = '1';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Fetch Rival Dataset
    try {
        const resp = await fetch('rival-comparison-2006-2026.json');
        rivalData = await resp.json();
    } catch (e) {
        console.error("Error loading rival dataset:", e);
    }

    // 2. Initialize Chart
    initChart();

    // 3. Render Insight Cards for initial pair
    renderInsightCards('1');

    // 4. Render Milestone Table
    renderMilestoneTable();

    // 5. Rival Pair Tab Switch
    const rTabs = document.querySelectorAll('#rivalPairTabs .r-tab-btn');
    rTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            rTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentPair = tab.getAttribute('data-pair');
            updateChart();
            renderInsightCards(currentPair);
        });
    });
});

function initChart() {
    const ctx = document.getElementById('rivalComparisonChart').getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: getChartConfig(currentPair),
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    labels: { color: '#94a3b8', font: { family: 'Inter', size: 13, weight: 'bold' } }
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
    const years = rivalData.map(d => d.year + '년');
    let datasets = [];

    if (pair === '1') {
        document.getElementById('rivalChartTitle').innerText = '📈 [1호기] 역삼아이파크 11평 🆚 라이벌: 삼성동 힐스테이트 2단지 15평 (2006~2026년)';
        document.getElementById('rivalChartSub').innerText = '강남 소형 대표 아파트 20년간 시세 추이 및 프리미엄 격차 변화';

        datasets = [
            {
                label: '1호기: 역삼아이파크 11평 (전용 28.2㎡)',
                data: rivalData.map(d => d.p1),
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.3, pointRadius: 4, borderWidth: 3
            },
            {
                label: '라이벌: 삼성동 힐스테이트 2단지 (전용 38.6㎡)',
                data: rivalData.map(d => d.r1),
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderDash: [5, 5],
                tension: 0.3, pointRadius: 4, borderWidth: 3
            }
        ];
    } else if (pair === '2') {
        document.getElementById('rivalChartTitle').innerText = '📈 [2호기] 중림동 쌍용더플래티넘 17㎡ 🆚 라이벌: 중림동 브라운스톤서울 (2006~2026년)';
        document.getElementById('rivalChartSub').innerText = '서울역 도심 직주근접 오피스텔 대표 라이벌 20개년 매매 시세 비교';

        datasets = [
            {
                label: '2호기: 쌍용더플래티넘 17㎡ (오피스텔)',
                data: rivalData.map(d => d.p2),
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                tension: 0.3, pointRadius: 4, borderWidth: 3
            },
            {
                label: '라이벌: 중림동 브라운스톤서울',
                data: rivalData.map(d => d.r2),
                borderColor: '#a855f7',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                borderDash: [5, 5],
                tension: 0.3, pointRadius: 4, borderWidth: 3
            }
        ];
    } else if (pair === '3') {
        document.getElementById('rivalChartTitle').innerText = '📈 [3호기] 삼성동 한솔 23평 🆚 라이벌: 삼성동 석탑아파트 23평 (2006~2026년)';
        document.getElementById('rivalChartSub').innerText = '삼성동 입지 동급 평형 나홀로/중소형 아파트 1대1 20년 맞대결 추이';

        datasets = [
            {
                label: '3호기: 삼성동 한솔아파트 (23평)',
                data: rivalData.map(d => d.p3),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.3, pointRadius: 4, borderWidth: 3
            },
            {
                label: '라이벌: 삼성동 석탑아파트 (23평)',
                data: rivalData.map(d => d.r3),
                borderColor: '#64748b',
                backgroundColor: 'rgba(100, 116, 139, 0.1)',
                borderDash: [5, 5],
                tension: 0.3, pointRadius: 4, borderWidth: 3
            }
        ];
    }

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
                    <span class="div-badge gold-bg">1호기 vs 힐스테이트 2단지 (20년 성과)</span>
                    <h3>평형차이(11평 vs 15평) 프리미엄 유지 분석</h3>
                </div>
                <div class="div-body">
                    <div class="div-comparison-box">
                        <div class="c-item">
                            <span class="year-lbl">2006년 당시</span>
                            <div class="val-group">
                                <span>1호기(11평): 1.85억</span>
                                <span>힐스테이트(15평): 2.90억</span>
                            </div>
                            <div class="gap-result">격차: <strong>1.05억 원</strong></div>
                        </div>
                        <div class="arrow-divider">➔</div>
                        <div class="c-item">
                            <span class="year-lbl">2026년 현재</span>
                            <div class="val-group">
                                <span>1호기(11평): 11.5억~12억</span>
                                <span>힐스테이트(15평): 15.3억</span>
                            </div>
                            <div class="gap-result text-gold">격차: <strong>3.80억 원</strong></div>
                        </div>
                    </div>
                    <p class="div-desc">
                        💡 <strong>분석 메시지:</strong> 1호기와 힐스테이트 2단지는 모두 강남 초소형 입지로서 20년간 **동반 6배 이상 폭등**했습니다. 11평과 15평의 실평수 차이만큼 시세 프리미엄 격차가 정비례하여 유지·확대되었으며, 두 단지 모두 강남권 대표 소형 자산으로서 최고 수준의 우상향 성과를 냈습니다.
                    </p>
                </div>
            </div>

            <div class="div-card border-gold">
                <div class="div-header">
                    <span class="div-badge gold-bg">임대 수익률 & 갭 효율 비교</span>
                    <h3>내 물건(14층/인테리어 굿)의 차별화 요소</h3>
                </div>
                <div class="div-body">
                    <p class="div-desc">
                        • <strong>전세 방어력:</strong> 힐스테이트 15평 전세(약 6.5억~7억) 대비 1호기(전세 5.7억)는 강남권 직장인 실속형 1인 가구 전세 수요가 대단히 탄탄함.<br>
                        • <strong>인테리어 효과:</strong> 보유 1호기는 14층 로열층 + 최상급 인테리어로 동일 단지 평균 전세가 대비 우수한 전세금 세팅 완료.
                    </p>
                </div>
            </div>
        `;
    } else if (pair === '2') {
        grid.innerHTML = `
            <div class="div-card border-cyan">
                <div class="div-header">
                    <span class="div-badge cyan-bg">2호기 vs 브라운스톤서울 (오피스텔 맞대결)</span>
                    <h3>전용 면적 차이 대비 갭 투자 효율성 승부</h3>
                </div>
                <div class="div-body">
                    <div class="div-comparison-box">
                        <div class="c-item">
                            <span class="year-lbl">2006년 당시</span>
                            <div class="val-group">
                                <span>2호기(17㎡): 1.05억</span>
                                <span>브라운스톤(25㎡): 1.50억</span>
                            </div>
                            <div class="gap-result">격차: <strong>4,500만 원</strong></div>
                        </div>
                        <div class="arrow-divider">➔</div>
                        <div class="c-item">
                            <span class="year-lbl">2026년 현재</span>
                            <div class="val-group">
                                <span>2호기(17㎡): 2.78억</span>
                                <span>브라운스톤(25㎡): 3.90억</span>
                            </div>
                            <div class="gap-result text-cyan">격차: <strong>1.12억 원</strong></div>
                        </div>
                    </div>
                    <p class="div-desc">
                        💡 <strong>분석 메시지:</strong> 브라운스톤이 면적이 넓어 매매가는 높으나, **2호기(쌍용더플래티넘)는 복층 설계 구조** 덕분에 전세가율이 91.7%에 달해 **단 2,300만 원이라는 독보적 소액 갭**으로 매수가 가능했습니다. 투자금 대비 레버리지 수익률 측면에서는 2호기가 압승입니다.
                    </p>
                </div>
            </div>

            <div class="div-card border-cyan">
                <div class="div-header">
                    <span class="div-badge cyan-bg">임대 가치 분석</span>
                    <h3>서울역 도심 직주근접 든든한 2호기</h3>
                </div>
                <div class="div-body">
                    <p class="div-desc">
                        • <strong>17층 고층 전망:</strong> 서울역 조망 및 탁 트인 채광 보유.<br>
                        • <strong>전세 2.55억 안착:</strong> 매매가 2.78억 대비 높은 보증금 유지로 사실상 자본금 상환 완결 자산 역할.
                    </p>
                </div>
            </div>
        `;
    } else if (pair === '3') {
        grid.innerHTML = `
            <div class="div-card border-emerald">
                <div class="div-header">
                    <span class="div-badge emerald-bg">3호기(삼성동한솔) vs 삼성동 석탑아파트</span>
                    <h3>동급 연식·평형 대결 ➔ 3호기의 1.8억 격차 벌림</h3>
                </div>
                <div class="div-body">
                    <div class="div-comparison-box">
                        <div class="c-item">
                            <span class="year-lbl">2006년 당시</span>
                            <div class="val-group">
                                <span>3호기(한솔): 3.80억</span>
                                <span>석탑아파트: 3.60억</span>
                            </div>
                            <div class="gap-result">격차: <strong>2,000만 원</strong> (미세한 차이)</div>
                        </div>
                        <div class="arrow-divider">➔</div>
                        <div class="c-item">
                            <span class="year-lbl">2026년 현재</span>
                            <div class="val-group">
                                <span>3호기(한솔): 21.3억</span>
                                <span>석탑아파트: 19.8억</span>
                            </div>
                            <div class="gap-result text-emerald">격차: <strong>1.50억 원!</strong> (격차 확대)</div>
                        </div>
                    </div>
                    <p class="div-desc">
                        💡 <strong>분석 메시지:</strong> 20년 전에는 불과 2,000만 원 차이였으나, 시간이 지남에 따라 **삼성동 한솔(263세대)이 석탑(84세대) 대비 단지 규모 및 언북초 배정 입지 프리미엄**이 누적되어 현재 1.5억 원 이상 시세를 앞서나가는 우월한 성과를 보였습니다.
                    </p>
                </div>
            </div>

            <div class="div-card border-emerald">
                <div class="div-header">
                    <span class="div-badge emerald-bg">실거주 만족도 프리미엄</span>
                    <h3>19층 탑층의 독보적 주거 가치</h3>
                </div>
                <div class="div-body">
                    <p class="div-desc">
                        • <strong>19층 탑층 프리미엄:</strong> 층간소음 제로, 우수한 조망과 채광으로 동일 단지 내 최고 선호 층수.<br>
                        • <strong>삼성동 미래 호재:</strong> 영동대로 복합환승센터 & GBC 개발 완료 시 추가적인 시세 분출이 가장 기대되는 실거주 메인 자산.
                    </p>
                </div>
            </div>
        `;
    }
}

function renderMilestoneTable() {
    const tbody = document.getElementById('rivalMilestoneTableBody');
    if (!tbody) return;

    let html = '';
    const reversed = [...rivalData].reverse();

    reversed.forEach(row => {
        const gap3 = (row.p3 - row.r3).toFixed(2);
        const gapSign = gap3 >= 0 ? `+${gap3}` : `${gap3}`;

        html += `<tr>
            <td><strong>${row.year}년</strong></td>
            <td class="highlight-sale"><strong>${row.p1}억 원</strong></td>
            <td>${row.r1}억 원</td>
            <td class="highlight-sale"><strong>${row.p2}억 원</strong></td>
            <td>${row.r2}억 원</td>
            <td class="highlight-sale"><strong>${row.p3}억 원</strong></td>
            <td>${row.r3}억 원</td>
            <td><strong style="color: var(--emerald);">${gapSign}억 원</strong></td>
        </tr>`;
    });

    tbody.innerHTML = html;
}
