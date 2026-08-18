async function renderServices() {
    let html = await fetchHTML('./components/landing_page/services/services.html');
    
    // Ambil data CMS, sesuaikan struktur datanya (Object dengan items)
    const data = window.State.get('services') || {
        tagline: "Layanan",
        title: "Layanan Unggulan Kami",
        description: "Pilihan layanan pengiriman yang fleksibel sesuai kebutuhan Anda.",
        items: [
            { title: "Instant Delivery", desc: "Sampai dalam hitungan jam.", icon: "fa-bolt" },
            { title: "Sameday Service", desc: "Dikirim dan sampai di hari yang sama.", icon: "fa-clock" },
            { title: "Regular Service", desc: "Pengiriman aman ke seluruh pelosok.", icon: "fa-truck-fast" }
        ]
    };

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // --- Render Teks Header ---
    const elTagline = tempDiv.querySelector('#services-tagline');
    const elTitle = tempDiv.querySelector('#services-title');
    const elDesc = tempDiv.querySelector('#services-desc');

    if (elTagline && data.tagline) {
        elTagline.textContent = data.tagline;
        autoScaleFont(elTagline, 20, "text-sm", "text-xs");
    }
    
    if (elTitle && data.title) {
        elTitle.textContent = data.title;
        autoScaleFont(elTitle, 25, "text-3xl md:text-4xl", "text-2xl md:text-3xl");
    }
    
    if (elDesc && data.description) {
        elDesc.textContent = data.description;
        autoScaleFont(elDesc, 80, "text-lg", "text-base");
    }

    // --- Render Card Layanan ---
    const container = tempDiv.querySelector('#services-container');
    if (container && data.items) {
        container.innerHTML = '';
        
        data.items.forEach((item, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = `service-wrapper service-delay-${index + 1}`;
            
            // REVISI: Ganti hover:shadow-2xl jadi hover:shadow-[0_15px_35px_-5px_rgba(250,216,18,0.4)]
            wrapper.innerHTML = `
                <div class="h-full group bg-white rounded-3xl p-8 shadow-sm hover:shadow-[0_15px_35px_-5px_rgba(250,216,18,0.4)] border border-gray-100 hover:border-accent transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden z-10">
                    <div class="absolute -right-8 -top-8 w-32 h-32 bg-blue-50/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                    
                    <div class="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                        <i class="fa-solid ${item.icon} text-3xl"></i>
                    </div>
                    
                    <h3 class="service-title text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-all duration-300">
                        ${item.title}
                    </h3>
                    <p class="service-desc text-gray-600 leading-relaxed text-base transition-all duration-300">
                        ${item.desc}
                    </p>
                </div>
            `;

            // --- LOGIC AUTO-SCALE FONT UNTUK MASING-MASING CARD ---
            const h3El = wrapper.querySelector('.service-title');
            const pEl = wrapper.querySelector('.service-desc');

            if (h3El) autoScaleFont(h3El, 18, "text-xl", "text-lg");
            if (pEl) autoScaleFont(pEl, 60, "text-base", "text-sm");

            container.appendChild(wrapper);
        });
    }

    return tempDiv.innerHTML;
}

function initServicesLogic() {
    // Kalau ke depannya mau ditambahin interaksi klik di card-nya, logic-nya taruh sini
}