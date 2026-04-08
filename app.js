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

    // 7개 단지 정확한 위치 (위도, 경도) 및 메타데이터
    const complexes = [
        { id: '한솔', name: '한솔', lat: 37.5196, lng: 127.0431 },
        { id: '푸른솔진흥', name: '푸른솔진흥', lat: 37.5208, lng: 127.0438 },
        { id: '석탑', name: '석탑', lat: 37.5192, lng: 127.0439 },
        { id: '현대', name: '현대', lat: 37.5186, lng: 127.0452 },
        { id: 'CLK', name: 'CLK', lat: 37.5181, lng: 127.0446 },
        { id: '월드타워', name: '월드타워', lat: 37.5201, lng: 127.0458 },
        { id: '우정에쉐르', name: '우정에쉐르', lat: 37.5192, lng: 127.0454 }
    ];

    // Real-Time API Map Linkage
    async function initMap() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;

        // 지도 초기화 (삼성동 통합부지 중심)
        const map = L.map('map', {
            center: [37.5195, 127.0445],
            zoom: 17,
            zoomControl: false
        });

        // 다크 테마 지도 타일 (CartoDB Dark Matter)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        try {
            const response = await fetch('/.netlify/functions/getAptPrices');
            if (!response.ok) throw new Error('API fetch failed');
            
            const aptDataMap = await response.json();
            
            // 각 단지별로 마커 생성
            complexes.forEach(comp => {
                // 해당 단지의 모든 평형 데이터 추출
                const pyEntries = Object.keys(aptDataMap)
                    .filter(key => key.startsWith(comp.id))
                    .map(key => aptDataMap[key])
                    .sort((a, b) => a.pyNum - b.pyNum);

                let popupContent = `<h4><i class="ph ph-buildings"></i> ${comp.name}</h4>`;
                
                if (pyEntries.length > 0) {
                    pyEntries.forEach(entry => {
                        popupContent += `
                        <div class="price-item">
                            <span class="py">${entry.py}</span>
                            <span class="val">${entry.price}</span>
                            <span class="date">${entry.dateStr}</span>
                        </div>`;
                    });
                } else {
                    popupContent += `<p class="text-dim">최근 5년 실거래 내역 없음</p>`;
                }

                // 커스텀 펄스 마커 (CSS 클래스 marker-pulse 기반)
                const pulseIcon = L.divIcon({
                    className: 'custom-div-icon',
                    html: `<div class='marker-pulse'></div>`,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                });

                L.marker([comp.lat, comp.lng], { icon: pulseIcon })
                    .addTo(map)
                    .bindPopup(popupContent);
                    
                // 기본으로 팝업 하나 열어두기 (가장 큰 한솔이나 푸른솔)
                if (comp.id === '한솔') {
                    // L.marker([comp.lat, comp.lng]).addTo(map).bindPopup(popupContent).openPopup();
                }
            });
            
        } catch(err) {
            console.error('Map Data Error:', err);
            // 에러 시 안내 마커라도 표시
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
