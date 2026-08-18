async function renderStats() {
  let html = await fetchHTML("./components/landing_page/stats/stats.html");
  
  // Perbaiki array dummy ke nilai "10Jt+" sesuai data CMS asli lu
  const data = window.State.get("stats") || [
    { nilai: "10Jt+", label: "Paket Terkirim", icon: "fa-box-open" },
    { nilai: "50K+", label: "Driver Aktif", icon: "fa-motorcycle" },
    { nilai: "500+", label: "Kota Jangkauan", icon: "fa-map-location-dot" },
  ];
  
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  
  const container = tempDiv.querySelector("#stats-container");
  
  if (container) {
    container.innerHTML = "";
    
    data.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = `relative flex flex-col items-center justify-center py-6 px-4 group stat-card stat-delay-${index + 1}`;
      
      // Tambahkan class transition-all duration-300 ke h2 dan p
      // Tambahkan class stat-label di p biar gampang ditarget
      div.innerHTML = `
                <!-- Aksen Garis Kuning Masing-masing Item -->
                <div class="absolute top-0 md:-top-4 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-accent rounded-full transition-all duration-300 group-hover:w-20"></div>
                
                <!-- Icon Box -->
                <div class="w-14 h-14 flex items-center justify-center bg-blue-50 text-primary rounded-2xl mb-4 mt-2 group-hover:-translate-y-2 transition-transform duration-300">
                    <i class="fa-solid ${item.icon} text-2xl"></i>
                </div>
                                 
                <!-- Nilai Angka -->
                <h2 class="stat-number text-4xl md:text-5xl font-extrabold text-gray-900 mb-1 tracking-tight transition-all duration-300" data-target="${item.nilai}">
                    0
                </h2>
                                 
                <!-- Label Deskripsi -->
                <p class="stat-label text-gray-500 font-medium text-sm md:text-base transition-all duration-300">
                    ${item.label}
                </p>
            `;
            
      // --- LOGIC AUTO-SCALE FONT ---
      const h2El = div.querySelector('.stat-number');
      const pEl = div.querySelector('.stat-label');

      // 1. Scale Label (Toleransi 15 karakter)
      if (pEl && item.label) {
          autoScaleFont(pEl, 15, "text-sm md:text-base", "text-xs md:text-sm leading-tight");
      }

      // 2. Scale Angka
      // Trik: Set ke nilai asli dulu buat diukur, baru dibalikin ke "0"
      if (h2El && item.nilai) {
          h2El.textContent = item.nilai; 
          // Toleransi 6 karakter (misal "1.000K")
          autoScaleFont(h2El, 6, "text-4xl md:text-5xl", "text-3xl md:text-4xl");
          h2El.textContent = "0"; // Reset untuk animasi counter
      }

      container.appendChild(div);
    });
  }
  return tempDiv.innerHTML;
}

function initStatsLogic() {
    const statsSection = document.getElementById('stats');
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (!statsSection || statNumbers.length === 0) return;
    
    // Fungsi inti buat animasi counter
    const animateValue = (obj, start, end, duration, suffix) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Pake easing 'easeOutQuart'
            const easeOut = 1 - Math.pow(1 - progress, 4);
            const currentVal = Math.floor(easeOut * (end - start) + start);
            
            obj.innerHTML = currentVal + suffix;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end + suffix; 
            }
        };
        window.requestAnimationFrame(step);
    };
    
    // Bikin CCTV khusus (Observer)
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(el => {
                    const targetStr = el.getAttribute('data-target');
                    
                    // Ekstrak angka murni
                    const targetNum = parseInt(targetStr.replace(/[^0-9]/g, ''));
                    // Ekstrak teks/simbol sisa
                    const suffix = targetStr.replace(/[0-9]/g, '');
                    
                    // Eksekusi animasi selama 2000ms
                    animateValue(el, 0, targetNum, 2000, suffix);
                });
                
                // Stop mantau
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    
    observer.observe(statsSection);
}