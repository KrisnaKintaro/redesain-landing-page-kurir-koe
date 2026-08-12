async function renderStats() {
    let html = await fetchHTML('./components/landing_page/stats/stats.html');
    
    const data = window.State.get('stats') || [
        { nilai: "1M+", label: "Paket Terkirim", icon: "fa-box-open" },
        { nilai: "50K+", label: "Driver Aktif", icon: "fa-motorcycle" },
        { nilai: "500+", label: "Kota Jangkauan", icon: "fa-map-location-dot" }
    ];

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const container = tempDiv.querySelector('#stats-container');

    if (container) {
        container.innerHTML = ''; 
        
        data.forEach(item => {
            const div = document.createElement('div');
            // Tambahin class 'relative' dan 'pt-4' biar ada ruang untuk garis kuning di atasnya
            div.className = "relative flex flex-col items-center justify-center py-6 px-4 group";
            
            div.innerHTML = `
                <!-- Aksen Garis Kuning Masing-masing Item (Ada efek animasi melebar pas di-hover) -->
                <div class="absolute top-0 md:-top-4 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-accent rounded-full transition-all duration-300 group-hover:w-20"></div>

                <!-- Icon Box -->
                <div class="w-14 h-14 flex items-center justify-center bg-blue-50 text-primary rounded-2xl mb-4 mt-2 group-hover:-translate-y-2 transition-transform duration-300">
                    <i class="fa-solid ${item.icon} text-2xl"></i>
                </div>
                
                <!-- Nilai Angka -->
                <h2 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-1 tracking-tight">
                    ${item.nilai}
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
    // Kosongkan sementara
}