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

    // 7개 단지 최종 정밀 핀포인트 위치 (소수점 6자리 정확도)
    const complexes = [
        { id: '우정', name: '우정', lat: 37.517531, lng: 127.045331 },
        { id: '월드타워', name: '월드타워', lat: 37.517391, lng: 127.046535 },
        { id: 'CLK', name: 'CLK', lat: 37.517454, lng: 127.046755 },
        { id: '석탑', name: '석탑', lat: 37.517523, lng: 127.046960 },
        { id: '푸른솔', name: '푸른솔', lat: 37.517742, lng: 127.047466 },
        { id: '한솔', name: '한솔', lat: 37.518654, lng: 127.047434 },
        { id: '현대', name: '현대', lat: 37.518485, lng: 127.047913 }
    ];

    // Real-Time API Map Linkage
    async function initMap() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;

        // 지도 초기화 (7개 단지 중심 정밀 줌 세팅)
        const map = L.map('map', {
            center: [37.5178, 127.0465],
            zoom: 18,
            zoomControl: false
        });

        // 다크 테마 지도 타일
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        try {
            const response = await fetch('/.netlify/functions/getAptPrices');
            if (!response.ok) throw new Error('API fetch failed');
            
            const aptDataMap = await response.json();
            
            complexes.forEach(comp => {
                // 대표 평형 2개 (25평형 전후, 33평형 전후) 데이터 추출
                const allPyEntries = Object.keys(aptDataMap)
                    .filter(key => key.startsWith(comp.id))
                    .map(key => aptDataMap[key]);

                // 20평대 대표 (25평에 가장 가까운 것)
                const py20 = allPyEntries.filter(e => e.pyNum >= 18 && e.pyNum <= 29)
                                          .sort((a,b) => Math.abs(a.pyNum - 25) - Math.abs(b.pyNum - 25))[0];
                
                // 30평대 대표 (33평에 가장 가까운 것)
                const py30 = allPyEntries.filter(e => e.pyNum >= 30 && e.pyNum <= 39)
                                          .sort((a,b) => Math.abs(a.pyNum - 33) - Math.abs(b.pyNum - 33))[0];

                let tagHtml = `<div class="map-price-tag">
                    <div class="tag-name">${comp.name}</div>`;
                
                if (py20) {
                    tagHtml += `<div class="tag-row"><span class="tag-py">${py20.py}</span><span class="tag-val">${py20.price}</span></div>`;
                }
                if (py30) {
                    tagHtml += `<div class="tag-row"><span class="tag-py">${py30.py}</span><span class="tag-val">${py30.price}</span></div>`;
                }
                if (!py20 && !py30) {
                    tagHtml += `<div class="tag-row"><span class="tag-py">실거래</span><span class="tag-val">문의</span></div>`;
                }
                tagHtml += `</div>`;

                // 커스텀 가격표 마커 생성
                const priceTagIcon = L.divIcon({
                    className: 'custom-tag-icon',
                    html: tagHtml,
                    iconSize: [120, 60],
                    iconAnchor: [60, 30]
                });

                L.marker([comp.lat, comp.lng], { icon: priceTagIcon })
                    .addTo(map);
            });
            
        } catch(err) {
            console.error('Map Data Error:', err);
            complexes.forEach(comp => {
                L.marker([comp.lat, comp.lng]).addTo(map).bindPopup(`<h4>${comp.name}</h4><p>데이터 연동 오류</p>`);
            });
        }
    }

    // Initialize Map
    initMap().then(() => {
        // 레이아웃 렌더링 후 지도가 깨지는 현상 방지용 (Leaflet 필수 팁)
        setTimeout(() => {
            const mapEl = document.querySelector('.leaflet-container');
            if (mapEl && mapEl._leaflet_id) {
                // Leaflet 인스턴스에 접근하여 크기 재조정
                window.dispatchEvent(new Event('resize'));
            }
        }, 500);
    });
});
