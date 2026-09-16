// App State
let aptListData = null;
let historyData = null;
let datesList = [];
let currentSelectedDistrict = null;
let trendChartInstance = null;
let activeDaysFilter = 30;

// Element References
const welcomePanel = document.getElementById("welcome-panel");
const detailPanel = document.getElementById("detail-panel");
const selectedDistrictName = document.getElementById("selected-district-name");
const selectedDistrictStatus = document.getElementById("selected-district-status");
const distAvgPrice = document.getElementById("dist-avg-price");
const distChangeRate = document.getElementById("dist-change-rate");
const distTotalListings = document.getElementById("dist-total-listings");
const districtAptList = document.getElementById("district-apt-list");
const hotList = document.getElementById("hot-list");
const mapTooltip = document.getElementById("map-tooltip");
const btnBack = document.getElementById("btn-back");

// Overall Stats Elements
const seoulIndex = document.getElementById("seoul-index");
const seoulIndexChange = document.getElementById("seoul-index-change");
const countUpEl = document.getElementById("count-up");
const countStableEl = document.getElementById("count-stable");
const countDownEl = document.getElementById("count-down");
const seoulAvgPriceEl = document.getElementById("seoul-avg-price");
const updateDateEl = document.getElementById("update-date");

// Initialize application
async function init() {
    try {
        console.log("Initializing dashboard application...");
        // Load data in parallel
        const [aptRes, histRes] = await Promise.all([
            fetch("data/apt_list.json"),
            fetch("data/history.json")
        ]);

        aptListData = await aptRes.json();
        historyData = await histRes.json();

        // Sort dates chronologically
        datesList = Object.keys(historyData).sort();
        console.log(`Loaded ${datesList.length} days of history data.`);

        if (datesList.length > 0) {
            const latestDate = datesList[datesList.length - 1];
            updateDateEl.textContent = `최근 집계일: ${latestDate}`;
            
            // Calculate changes for the latest date compared to the previous date
            const previousDate = datesList.length > 1 ? datesList[datesList.length - 2] : latestDate;
            
            // Analyze market stats
            const stats = calculateMarketStats(latestDate, previousDate);
            renderOverallStats(stats);
            renderMapHeatmap(stats);
            renderHotDistricts(stats);
            setupMapInteractions(stats);
            setupPeriodFilters();
        } else {
            console.error("No historical data found!");
        }
    } catch (error) {
        console.error("Failed to initialize app data:", error);
    }
}

// Calculate price changes and details for all districts
function calculateMarketStats(latestDate, prevDate) {
    const stats = {};
    let seoulTotalLatestPrice = 0;
    let seoulTotalPrevPrice = 0;
    let seoulListingCount = 0;
    let seoulAptCount = 0;
    
    let countUp = 0;
    let countStable = 0;
    let countDown = 0;

    const latestDayData = historyData[latestDate];
    const prevDayData = historyData[prevDate];

    Object.keys(aptListData).forEach(district => {
        const latestApts = latestDayData[district] || [];
        const prevApts = prevDayData[district] || [];

        // Sum prices
        const latestAvg = latestApts.reduce((sum, item) => sum + item.lowestPrice, 0) / (latestApts.length || 1);
        const prevAvg = prevApts.reduce((sum, item) => sum + item.lowestPrice, 0) / (prevApts.length || 1);
        
        // Sum listings
        const totalListings = latestApts.reduce((sum, item) => sum + item.listingCount, 0);
        
        // Change percentage
        // e.g. ((latest - prev) / prev) * 100
        const changePercent = prevAvg > 0 ? ((latestAvg - prevAvg) / prevAvg) * 100 : 0;

        // Categorize trend
        let trend = "stable";
        if (changePercent > 0.05) {
            trend = "up";
            countUp++;
        } else if (changePercent < -0.05) {
            trend = "down";
            countDown++;
        } else {
            countStable++;
        }

        stats[district] = {
            avgPrice: latestAvg,
            prevAvgPrice: prevAvg,
            changeRate: changePercent,
            trend: trend,
            totalListings: totalListings,
            apts: latestApts
        };

        // Accumulate for Seoul-wide stats
        latestApts.forEach(apt => {
            seoulTotalLatestPrice += apt.lowestPrice;
            seoulListingCount += apt.listingCount;
            seoulAptCount++;
        });

        prevApts.forEach(apt => {
            seoulTotalPrevPrice += apt.lowestPrice;
        });
    });

    const seoulAvgLatest = seoulAptCount > 0 ? seoulTotalLatestPrice / seoulAptCount : 0;
    const seoulAvgPrev = seoulAptCount > 0 ? seoulTotalPrevPrice / seoulAptCount : 0;
    const seoulIndexChangeVal = seoulAvgPrev > 0 ? ((seoulAvgLatest - seoulAvgPrev) / seoulAvgPrev) * 100 : 0;

    return {
        districts: stats,
        seoul: {
            avgPrice: seoulAvgLatest,
            indexChange: seoulIndexChangeVal,
            totalListings: seoulListingCount,
            counts: { up: countUp, stable: countStable, down: countDown }
        }
    };
}

// Render the overall top widgets
function renderOverallStats(stats) {
    const seoul = stats.seoul;
    
    // Seoul average price in 억 (e.g. 235500 -> 23.6억)
    const avgPriceEok = (seoul.avgPrice / 10000).toFixed(1);
    seoulAvgPriceEl.textContent = `${avgPriceEok}억`;

    // Seoul index change percentage
    const changeSign = seoul.indexChange >= 0 ? "+" : "";
    seoulIndexChange.textContent = `${changeSign}${seoul.indexChange.toFixed(2)}%`;
    seoulIndexChange.className = `change ${seoul.indexChange > 0.05 ? "value-up" : seoul.indexChange < -0.05 ? "value-down" : "value-stable"}`;

    // Ratio counts
    countUpEl.textContent = seoul.counts.up;
    countStableEl.textContent = seoul.counts.stable;
    countDownEl.textContent = seoul.counts.down;

    // Seoul Heat Index: 100 + scaled cumulative change
    const baseIndex = 100.0;
    const indexVal = baseIndex + seoul.indexChange * 10;
    seoulIndex.textContent = indexVal.toFixed(1);
}

// Color the map paths based on price changes
function renderMapHeatmap(stats) {
    Object.keys(stats.districts).forEach(district => {
        const path = document.getElementById(district);
        if (path) {
            const data = stats.districts[district];
            // Remove previous classes
            path.classList.remove("map-up", "map-stable", "map-down");
            
            // Add class based on trend
            if (data.trend === "up") {
                path.classList.add("map-up");
            } else if (data.trend === "down") {
                path.classList.add("map-down");
            } else {
                path.classList.add("map-stable");
            }
        }
    });
}

// Render the top rising districts list in welcome page
function renderHotDistricts(stats) {
    const list = Object.keys(stats.districts)
        .map(name => ({ name, ...stats.districts[name] }))
        .sort((a, b) => b.changeRate - a.changeRate); // Sort descending

    hotList.innerHTML = "";
    
    // Take top 3 rising districts
    list.slice(0, 3).forEach((item, index) => {
        const li = document.createElement("li");
        const changeSign = item.changeRate >= 0 ? "+" : "";
        li.innerHTML = `
            <span><strong>${index + 1}. ${item.name}</strong></span>
            <span class="c-up">${changeSign}${item.changeRate.toFixed(2)}% <i class="ph ph-trend-up"></i></span>
        `;
        
        // Clicking list item clicks the corresponding map element
        li.addEventListener("click", () => {
            selectDistrict(item.name, stats);
        });
        hotList.appendChild(li);
    });
}

// Setup SVG map interactions (hover, click, selected)
function setupMapInteractions(stats) {
    const paths = document.querySelectorAll("path");
    
    paths.forEach(path => {
        const districtName = path.getAttribute("id");
        const data = stats.districts[districtName];
        
        if (!data) return;

        // Hover: show tooltip
        path.addEventListener("mousemove", (e) => {
            const changeSign = data.changeRate >= 0 ? "+" : "";
            const trendIcon = data.trend === "up" ? "▲" : data.trend === "down" ? "▼" : "■";
            const trendClass = data.trend === "up" ? "c-up" : data.trend === "down" ? "c-down" : "c-stable";
            
            mapTooltip.innerHTML = `
                <div class="tooltip-title">${districtName}</div>
                <div>평균 호가: <strong>${(data.avgPrice / 10000).toFixed(1)}억</strong></div>
                <div class="${trendClass}">변동률: ${trendIcon} ${changeSign}${data.changeRate.toFixed(2)}%</div>
                <div style="color: var(--text-muted)">매물 수: ${data.totalListings}개</div>
            `;
            
            mapTooltip.classList.add("active");
            
            // Position tooltip next to cursor
            // Compensate for map container bounds
            const mapContainer = document.querySelector(".map-container");
            const rect = mapContainer.getBoundingClientRect();
            
            const x = e.clientX - rect.left + 15;
            const y = e.clientY - rect.top - 15;
            
            mapTooltip.style.left = `${x}px`;
            mapTooltip.style.top = `${y}px`;
        });

        path.addEventListener("mouseleave", () => {
            mapTooltip.classList.remove("active");
        });

        // Click: select district and show details
        path.addEventListener("click", () => {
            selectDistrict(districtName, stats);
        });
    });

    // Back button in detail panel returns to welcome panel
    btnBack.addEventListener("click", () => {
        deselectAllPaths();
        welcomePanel.classList.add("active");
        detailPanel.classList.remove("active");
        currentSelectedDistrict = null;
    });
}

// Select a district (visuals + data loading)
function selectDistrict(districtName, stats) {
    deselectAllPaths();
    
    currentSelectedDistrict = districtName;
    const path = document.getElementById(districtName);
    if (path) {
        path.classList.add("selected");
    }

    // Toggle panels
    welcomePanel.classList.remove("active");
    detailPanel.classList.add("active");

    // Populate panel details
    const distData = stats.districts[districtName];
    selectedDistrictName.textContent = districtName;
    
    const changeSign = distData.changeRate >= 0 ? "+" : "";
    const trendText = distData.trend === "up" ? "상승세" : distData.trend === "down" ? "하락세" : "보합세";
    selectedDistrictStatus.textContent = `${trendText} (${changeSign}${distData.changeRate.toFixed(2)}%)`;
    selectedDistrictStatus.className = `badge ${distData.trend}`;
    
    distAvgPrice.textContent = `${(distData.avgPrice / 10000).toFixed(1)}억`;
    distChangeRate.textContent = `${changeSign}${distData.changeRate.toFixed(2)}%`;
    distChangeRate.className = `ov-value ${distData.trend === "up" ? "c-up" : distData.trend === "down" ? "c-down" : "c-stable"}`;
    distTotalListings.textContent = `${distData.totalListings}개`;

    // Render the 3 apartments list
    districtAptList.innerHTML = "";
    distData.apts.forEach(apt => {
        // Calculate apartment change rate (yesterday vs today)
        // Find yesterday's data
        let aptChangeText = "보합 0.00%";
        let aptChangeClass = "c-stable";
        
        if (datesList.length > 1) {
            const prevDate = datesList[datesList.length - 2];
            const prevApt = historyData[prevDate][districtName].find(a => a.name === apt.name);
            if (prevApt) {
                const diff = ((apt.lowestPrice - prevApt.lowestPrice) / prevApt.lowestPrice) * 100;
                const sign = diff >= 0 ? "+" : "";
                if (diff > 0.05) {
                    aptChangeText = `▲ ${sign}${diff.toFixed(2)}%`;
                    aptChangeClass = "c-up";
                } else if (diff < -0.05) {
                    aptChangeText = `▼ ${sign}${diff.toFixed(2)}%`;
                    aptChangeClass = "c-down";
                } else {
                    aptChangeText = `보합 0.00%`;
                    aptChangeClass = "c-stable";
                }
            }
        }

        const aptCard = document.createElement("div");
        aptCard.className = "apt-card";
        aptCard.innerHTML = `
            <div>
                <div class="apt-name">${apt.name}</div>
                <div class="apt-meta">
                    <span>전용 ${apt.size}</span>
                    <span>•</span>
                    <a href="https://m.land.naver.com/complex/info/${apt.complexNo}" target="_blank" class="naver-link">
                        <i class="ph ph-arrow-square-out"></i> 네이버 매물
                    </a>
                </div>
            </div>
            <div class="apt-pricing">
                <div class="apt-price">${(apt.lowestPrice / 10000).toFixed(1)}억~</div>
                <div class="apt-change ${aptChangeClass}">${aptChangeText} (${apt.listingCount}개)</div>
            </div>
        `;
        districtAptList.appendChild(aptCard);
    });

    // Render chart
    renderTrendChart(districtName);
}

// Deselect all highlighted map paths
function deselectAllPaths() {
    document.querySelectorAll("path").forEach(p => {
        p.classList.remove("selected");
    });
}

// Render the 30-day Chart.js trend line chart
function renderTrendChart(districtName) {
    if (trendChartInstance) {
        trendChartInstance.destroy();
    }

    // Filter historical dates according to range tab (e.g. last 30, 15, or 7 days)
    const filteredDates = datesList.slice(-activeDaysFilter);
    const aptsInDistrict = aptListData[districtName];
    
    // We want 3 separate line series (one for each apartment)
    const datasets = aptsInDistrict.map((apt, idx) => {
        const colorPalette = [
            { line: "#ff5b5b", fill: "rgba(255, 91, 91, 0.1)" }, // Neon Red
            { line: "#00f2fe", fill: "rgba(0, 242, 254, 0.1)" }, // Neon Cyan
            { line: "#f1c40f", fill: "rgba(241, 196, 15, 0.1)" }  // Neon Yellow
        ];
        
        const color = colorPalette[idx % colorPalette.length];
        
        // Extract lowest price for each date
        const dataPoints = filteredDates.map(date => {
            const dayApts = historyData[date][districtName] || [];
            const aptData = dayApts.find(a => a.name === apt.name);
            // Convert to 억 (billion KRW)
            return aptData ? aptData.lowestPrice / 10000 : null;
        });

        return {
            label: apt.name,
            data: dataPoints,
            borderColor: color.line,
            backgroundColor: color.fill,
            borderWidth: 2.5,
            pointRadius: filteredDates.length > 15 ? 1 : 3,
            pointHoverRadius: 6,
            tension: 0.15,
            fill: false
        };
    });

    // Formatting date labels (e.g., 2026-06-25 -> 06.25)
    const labels = filteredDates.map(date => {
        const parts = date.split("-");
        return parts.length === 3 ? `${parts[1]}.${parts[2]}` : date;
    });

    const ctx = document.getElementById("trend-chart").getContext("2d");
    trendChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        font: { family: 'Outfit, Noto Sans KR', size: 10 },
                        color: '#8e9cae'
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    titleFont: { family: 'Outfit, Noto Sans KR', size: 11, weight: 'bold' },
                    bodyFont: { family: 'Outfit, Noto Sans KR', size: 11 },
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw.toFixed(2)}억`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.03)' },
                    ticks: { color: '#8e9cae', font: { size: 9 } }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.03)' },
                    ticks: { 
                        color: '#8e9cae', 
                        font: { size: 9 },
                        callback: function(value) { return value + '억'; }
                    }
                }
            }
        }
    });
}

// Set up event listeners for chart range buttons (30일, 15일, 7일)
function setupPeriodFilters() {
    const buttons = document.querySelectorAll(".chart-period-tabs .tab-btn");
    buttons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            // Remove active class from all buttons
            buttons.forEach(b => b.classList.remove("active"));
            
            // Add active class to clicked button
            e.target.classList.add("active");
            
            // Update filter days
            activeDaysFilter = parseInt(e.target.getAttribute("data-days"));
            
            // Re-render chart for current selected district
            if (currentSelectedDistrict) {
                renderTrendChart(currentSelectedDistrict);
            }
        });
    });
}

// Run app init when DOM content is loaded
document.addEventListener("DOMContentLoaded", init);
