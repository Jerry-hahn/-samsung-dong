import os
import xml.etree.ElementTree as ET

def build_html():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    svg_path = os.path.join(base_dir, "seoul_simple.svg")
    index_path = os.path.join(base_dir, "index.html")

    # Load SVG contents
    if not os.path.exists(svg_path):
        print("Error: seoul_simple.svg not found in base dir!")
        return

    with open(svg_path, "r", encoding="utf-8") as f:
        svg_content = f.read()

    # Extract the <svg> tag and its children
    # We want to embed the SVG element directly
    start_svg = svg_content.find("<svg")
    if start_svg == -1:
        print("Error: Could not find <svg tag!")
        return
    svg_embed = svg_content[start_svg:]

    html_template = f"""<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>서울 25개구 아파트 호가 동향 대시보드 | Real Estate Trends</title>
    <!-- Fonts & Icons -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;900&family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="app">
        <!-- Background Ambient Light -->
        <div class="ambient-glow bg-red"></div>
        <div class="ambient-glow bg-blue"></div>
        <div class="grid-overlay"></div>

        <div class="layout-container">
            <!-- Left Pane: Map and Market Overview -->
            <div class="pane-left">
                <header class="app-header">
                    <div class="live-indicator">
                        <span class="pulse-dot"></span>
                        <span id="update-date">네이버 호가 실시간 집계 중...</span>
                    </div>
                    <h1>서울 부동산 <span class="text-gradient">호가 동향</span> 대시보드</h1>
                    <p class="subtitle">서울 25개구 대장 아파트를 통한 일단위 부동산 흐름 분석</p>
                </header>

                <!-- Market Summary Widgets -->
                <section class="market-summary-section">
                    <div class="summary-card glass-card">
                        <div class="card-icon"><i class="ph ph-chart-line-up"></i></div>
                        <div class="card-info">
                            <span class="label">서울 종합 지수</span>
                            <span class="value" id="seoul-index">100.0</span>
                            <span class="change" id="seoul-index-change">0.00%</span>
                        </div>
                    </div>
                    <div class="summary-card glass-card">
                        <div class="card-icon"><i class="ph ph-trend-up"></i></div>
                        <div class="card-info">
                            <span class="label">상승 / 보합 / 하락</span>
                            <div class="ratio-values">
                                <span class="value-up" id="count-up">0</span>
                                <span class="value-stable" id="count-stable">0</span>
                                <span class="value-down" id="count-down">0</span>
                            </div>
                            <span class="change-label">25개 자치구 기준</span>
                        </div>
                    </div>
                    <div class="summary-card glass-card">
                        <div class="card-icon"><i class="ph ph-coins"></i></div>
                        <div class="card-info">
                            <span class="label">평균 호가 (84㎡)</span>
                            <span class="value" id="seoul-avg-price">0.0억</span>
                            <span class="change-label">대표 75개 단지 평균</span>
                        </div>
                    </div>
                </section>

                <!-- Interactive Map Wrapper -->
                <div class="map-container glass-card">
                    <div class="map-header">
                        <h3><i class="ph ph-map-trifold"></i> 서울 25개 자치구 호가 지도</h3>
                        <div class="map-legend">
                            <span class="legend-item"><span class="color-dot l-down"></span> 하락</span>
                            <span class="legend-item"><span class="color-dot l-stable"></span> 보합</span>
                            <span class="legend-item"><span class="color-dot l-up"></span> 상승</span>
                        </div>
                    </div>
                    
                    <div class="map-wrapper">
                        <!-- Embedded SVG Map -->
                        {svg_embed}
                        <!-- Floating Tooltip -->
                        <div id="map-tooltip" class="tooltip-box"></div>
                    </div>
                </div>

                <!-- Footer details / Instructions -->
                <footer class="app-footer glass-card">
                    <div class="footer-content">
                        <h4><i class="ph ph-terminal-window"></i> 수동 데이터 수집 (크롤러) 실행 방법</h4>
                        <p>이 웹사이트는 수집된 데이터를 바탕으로 실시간 동향을 시각화합니다. 아래 명령어로 최신 호가를 크롤링할 수 있습니다.</p>
                        <code>python3 scripts/crawler.py</code>
                    </div>
                </footer>
            </div>

            <!-- Right Pane: District Details and Charts -->
            <div class="pane-right">
                <!-- Welcome Card (Shown when no district is selected) -->
                <div id="welcome-panel" class="details-panel glass-card active">
                    <div class="welcome-content">
                        <i class="ph ph-hand-pointing"></i>
                        <h2>자치구를 선택해 주세요</h2>
                        <p>왼쪽 지도에서 자치구를 클릭하면 해당 자치구 대표 아파트의 실시간 네이버 호가 추이, 매물 현황 및 30일 시세 변동 차트를 확인할 수 있습니다.</p>
                        
                        <div class="hot-districts">
                            <h3><i class="ph ph-fire"></i> 오늘 가장 많이 오른 지역</h3>
                            <ul id="hot-list">
                                <!-- Generated by JS -->
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Detail Panel (Shown when a district is selected) -->
                <div id="detail-panel" class="details-panel glass-card">
                    <div class="panel-header">
                        <button id="btn-back" class="icon-btn"><i class="ph ph-arrow-left"></i></button>
                        <h2 id="selected-district-name">강남구</h2>
                        <span class="badge" id="selected-district-status">상승세 (+0.24%)</span>
                    </div>

                    <!-- Selected District Overview -->
                    <div class="district-overview">
                        <div class="ov-item">
                            <span class="ov-label">평균 호가</span>
                            <span class="ov-value" id="dist-avg-price">25.3억</span>
                        </div>
                        <div class="ov-item">
                            <span class="ov-label">전일 대비 변동</span>
                            <span class="ov-value" id="dist-change-rate">+0.15%</span>
                        </div>
                        <div class="ov-item">
                            <span class="ov-label">전체 매물 수</span>
                            <span class="ov-value" id="dist-total-listings">185개</span>
                        </div>
                    </div>

                    <!-- 3 Representative Apartments List -->
                    <div class="apt-section">
                        <h3><i class="ph ph-buildings"></i> 대표 아파트 호가 현황 (84㎡ 기준)</h3>
                        <div class="apt-list" id="district-apt-list">
                            <!-- Template for single apartment card -->
                            <!-- Filled dynamically by JavaScript -->
                        </div>
                    </div>

                    <!-- Trend Chart Section -->
                    <div class="chart-section">
                        <div class="chart-header">
                            <h3><i class="ph ph-chart-line"></i> 최근 30일 호가 추이</h3>
                            <div class="chart-period-tabs">
                                <button class="tab-btn active" data-days="30">30일</button>
                                <button class="tab-btn" data-days="15">15일</button>
                                <button class="tab-btn" data-days="7">7일</button>
                            </div>
                        </div>
                        <div class="chart-container">
                            <canvas id="trend-chart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Script Section -->
    <script src="app.js"></script>
</body>
</html>
"""

    with open(index_path, "w", encoding="utf-8") as f:
        f.write(html_template)
        
    print(f"Successfully generated {index_path} with embedded SVG map!")

if __name__ == "__main__":
    build_html()
