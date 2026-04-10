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

    // 7개 단지 최종 초정밀 핀포인트 위치 (네이버 지도 데이터 기반)
    const complexes = [
        { id: '월드타워', name: '월드타워', lat: 37.5174513, lng: 127.0440789 },
        { id: 'CLK', name: 'CLK', lat: 37.5175294, lng: 127.0443834 },
        { id: '우정', name: '우정', lat: 37.5172908, lng: 127.0445214 },
        { id: '석탑', name: '석탑', lat: 37.5173648, lng: 127.0447655 },
        { id: '현대', name: '현대', lat: 37.5169341, lng: 127.0446034 },
        { id: '한솔', name: '한솔', lat: 37.5175568, lng: 127.0458282 },
        { id: '푸른솔', name: '푸른솔', lat: 37.5177284, lng: 127.0461070 }
    ];

    let allTransactions = [];

    // Real-Time API Map & Transaction Linkage
    async function initDashboard() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;

        // 지도 초기화 (기본 뷰는 fitBounds로 자동 조정됨)
        const map = L.map('map', {
            zoomControl: false,
            scrollWheelZoom: false
        });

        // 다크 모드 타일 설정
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO'
        }).addTo(map);

        const markers = [];
        const bounds = L.latLngBounds();

        // 7개 단지 위치에 점(Dot) 마커 배치 및 바운드 확장
        complexes.forEach(comp => {
            const dotIcon = L.divIcon({
                className: 'custom-dot-icon',
                html: `<div class="dot-marker" title="${comp.name}"></div>`,
                iconSize: [14, 14],
                iconAnchor: [7, 7]
            });

            const marker = L.marker([comp.lat, comp.lng], { icon: dotIcon })
                .addTo(map)
                .bindPopup(`<strong>${comp.name}</strong>`);
            
            markers.push(marker);
            bounds.extend([comp.lat, comp.lng]);
        });

        // 7개 단지가 모두 보이도록 자동 줌/중심 조정
        map.fitBounds(bounds, { padding: [50, 50] });

        try {
            const response = await fetch('/.netlify/functions/getAptPrices');
            if (!response.ok) throw new Error('API fetch failed');
            
            allTransactions = await response.json();
            
            // 데이터 수신 후 초기 렌더링 (가장 최근 데이터가 있는 연도 우선, 기본은 2026)
            renderYear('2026');
            
        } catch(err) {
            console.error('Data Error:', err);
            const listContainer = document.getElementById('transaction-list');
            if (listContainer) listContainer.innerHTML = '<div class="loading-state">데이터를 불러오는 중 오류가 발생했습니다.</div>';
        }
    }

    // 연도별 탭 클릭 이벤트 바인딩
    document.getElementById('year-tabs')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-btn');
        if (!btn) return;

        // UI 업데이트
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedYear = btn.dataset.year;
        renderYear(selectedYear);
    });

    function renderYear(year) {
        const listContainer = document.getElementById('transaction-list');
        if (!listContainer) return;

        // 해당 연도 데이터 필터링 및 최신순 정렬
        const filtered = allTransactions
            .filter(t => t.year === year)
            .sort((a, b) => b.dateVal - a.dateVal);

        if (allTransactions.length === 0) {
            listContainer.innerHTML = `<div class="loading-state">데이터를 불러오는 중입니다...</div>`;
            return;
        }

        if (filtered.length === 0) {
            listContainer.innerHTML = `<div class="loading-state">${year}년도 실거래 데이터가 없습니다.</div>`;
            return;
        }

        listContainer.innerHTML = filtered.map(t => `
            <div class="transaction-card">
                <div class="card-info">
                    <div class="apt-name">${t.apt}</div>
                    <div class="apt-meta">${t.py} • ${t.dateStr}</div>
                </div>
                <div class="card-price">
                    <span class="price-val">${t.price}</span>
                    <span class="deal-date">실거래완료</span>
                </div>
            </div>
        `).join('');
    }

    // Initialize Dashboard
    initDashboard();
});
