async function renderStats() {
  let html = await fetchHTML("./components/landing_page/stats/stats.html");

  const data = window.State.get("stats") || [
    { nilai: "1M+", label: "Paket Terkirim", icon: "fa-box-open" },
    { nilai: "50K+", label: "Driver Aktif", icon: "fa-motorcycle" },
    { nilai: "500+", label: "Kota Jangkauan", icon: "fa-map-location-dot" },
  ];

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const container = tempDiv.querySelector("#stats-container");

  if (container) {
    container.innerHTML = "";

    data.forEach((item, index) => {
      // <-- Tambahin parameter index di sini
      const div = document.createElement("div");

      // Tambahin class stat-card dan stat-delay dinamis berdasarkan index
      div.className = `relative flex flex-col items-center justify-center py-6 px-4 group stat-card stat-delay-${index + 1}`;

      div.innerHTML = `
                <!-- Aksen Garis Kuning Masing-masing Item -->
                <div class="absolute top-0 md:-top-4 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-accent rounded-full transition-all duration-300 group-hover:w-20"></div>
                <!-- Icon Box -->
                <div class="w-14 h-14 flex items-center justify-center bg-blue-50 text-primary rounded-2xl mb-4 mt-2 group-hover:-translate-y-2 transition-transform duration-300">
                    <i class="fa-solid ${item.icon} text-2xl"></i>
                </div>
                
                <!-- Nilai Angka -->
                <h2 class="stat-number text-4xl md:text-5xl font-extrabold text-gray-900 mb-1 tracking-tight" data-target="${item.nilai}">
                    0
                </h2>
                
                <!-- Label Deskripsi -->
                <p class="text-gray-500 font-medium text-sm md:text-base">
                    ${item.label}
                </p>
            `;
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
            
            // Pake easing 'easeOutQuart' biar pas mau nyampe target angkanya ngerem (smooth)
            const easeOut = 1 - Math.pow(1 - progress, 4);
            const currentVal = Math.floor(easeOut * (end - start) + start);
            
            // Gabungin angka yang lagi jalan sama huruf belakangnya (K+, M+, dll)
            obj.innerHTML = currentVal + suffix;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                // Pastiin nilai akhir pas banget sama target
                obj.innerHTML = end + suffix; 
            }
        };
        window.requestAnimationFrame(step);
    };

    // Bikin CCTV khusus (Observer) buat nge-trigger animasi ini pas layarnya di-scroll
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            // Kalau section stats udah kelihatan di layar
            if (entry.isIntersecting) {
                statNumbers.forEach(el => {
                    const targetStr = el.getAttribute('data-target');
                    
                    // Ekstrak angka murni. Misal "50K+" -> jadi 50
                    const targetNum = parseInt(targetStr.replace(/[^0-9]/g, ''));
                    // Ekstrak teks/simbol sisa. Misal "50K+" -> jadi "K+"
                    const suffix = targetStr.replace(/[0-9]/g, '');
                    
                    // Eksekusi animasi selama 2000ms (2 detik)
                    animateValue(el, 0, targetNum, 2000, suffix);
                });
                // Stop mantau biar animasinya cuma jalan sekali pas pertama kali diliat
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    observer.observe(statsSection);
}
