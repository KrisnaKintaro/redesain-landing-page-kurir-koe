async function renderServices() {
    let html = await fetchHTML('./components/landing_page/services/services.html');
    
    // Ambil data CMS (Siapkan data dummy sesuai screenshot lu sebagai fallback)
    const data = window.State.get('services') || [
        { title: "Instant Delivery", desc: "Sampai dalam hitungan jam.", icon: "fa-bolt" },
        { title: "Sameday Service", desc: "Dikirim dan sampai di hari yang sama.", icon: "fa-clock" },
        { title: "Regular Service", desc: "Pengiriman aman ke seluruh pelosok.", icon: "fa-truck-fast" }
    ];

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const container = tempDiv.querySelector('#services-container');

    if (container) {
        container.innerHTML = ''; 
        
        data.forEach(item => {
            const div = document.createElement('div');
            // Styling Card: Punya shadow halus, kalau di-hover border jadi kuning & naik ke atas
            div.className = "group bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl border border-gray-100 hover:border-accent transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden z-10";
            
            div.innerHTML = `
                <!-- Efek dekorasi lingkaran biru transparan di pojok saat hover -->
                <div class="absolute -right-8 -top-8 w-32 h-32 bg-blue-50/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                
                <!-- Icon Box -->
                <div class="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                    <i class="fa-solid ${item.icon} text-3xl"></i>
                </div>
                
                <!-- Judul & Deskripsi -->
                <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                    ${item.title}
                </h3>
                <p class="text-gray-600 leading-relaxed">
                    ${item.desc}
                </p>
            `;
            container.appendChild(div);
        });
    }

    return tempDiv.innerHTML;
}

function initServicesLogic() {
    // Kalau ke depannya mau ditambahin interaksi klik di card-nya, logic-nya taruh sini
}