async function renderBenefits() {
    let html = await fetchHTML('./components/landing_page/benefits/benefits.html');
    
    // Ambil data CMS, kita tambahkan properti 'shadow_neon' untuk masing-masing card
    const data = window.State.get('benefits') || {
        tagline: "Kenapa Memilih Kami?",
        title: "Keuntungan Ekstra Buat Anda",
        description: "Berbagai alasan mengapa ribuan UMKM dan Mitra Driver mempercayakan bisnisnya pada Kurir Koe.",
        items: [
            { title: "Gratis Jemput Paket", desc: "Satu paket pun kami jemput ke depan pintu tanpa biaya tambahan.", icon: "fa-box-open", color: "text-blue-500", bg: "bg-blue-50", shadow_neon: "hover:shadow-[0_15px_35px_-5px_rgba(59,130,246,0.4)]" },
            { title: "Harga Khusus UMKM", desc: "Makin sering kirim, ongkir makin murah. Skema tarif flat untuk bisnis lokal.", icon: "fa-tags", color: "text-accent", bg: "bg-yellow-50", shadow_neon: "hover:shadow-[0_15px_35px_-5px_rgba(250,216,18,0.4)]" },
            { title: "Bagi Hasil Adil", desc: "Potongan aplikasi rendah. Pendapatan Mitra Driver cair setiap hari tanpa ribet.", icon: "fa-hand-holding-dollar", color: "text-green-500", bg: "bg-green-50", shadow_neon: "hover:shadow-[0_15px_35px_-5px_rgba(34,197,94,0.4)]" },
            { title: "Layanan CS Cepat", desc: "Bukan dilayani robot. Tim CS kami responsif siap bantu kendala 24/7.", icon: "fa-headset", color: "text-red-500", bg: "bg-red-50", shadow_neon: "hover:shadow-[0_15px_35px_-5px_rgba(239,68,68,0.4)]" }
        ]
    };

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // --- Render Teks Header ---
    const elTagline = tempDiv.querySelector('#benefits-tagline');
    const elTitle = tempDiv.querySelector('#benefits-title');
    const elDesc = tempDiv.querySelector('#benefits-desc');

    if (elTagline && data.tagline) {
        elTagline.textContent = data.tagline;
        autoScaleFont(elTagline, 25, "text-sm", "text-xs");
    }
    if (elTitle && data.title) {
        elTitle.textContent = data.title;
        autoScaleFont(elTitle, 30, "text-3xl md:text-4xl", "text-2xl md:text-3xl");
    }
    if (elDesc && data.description) {
        elDesc.textContent = data.description;
        autoScaleFont(elDesc, 100, "text-lg", "text-base");
    }

   // --- Render Card Layanan ---
   const container = tempDiv.querySelector('#benefits-container');
    if (container && data.items) {
        container.innerHTML = '';
                 
        data.items.forEach((item, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = `benefit-wrapper benefit-delay-${index + 1}`;
            
            // Pasang shadow_neon dari CMS, ganti hover:shadow-xl dengan item.shadow_neon
            // Tambahin class hover:-translate-y-2 biar card-nya agak ngangkat saat di-hover
            wrapper.innerHTML = `
                <div class="h-full bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 group flex flex-col items-start hover:-translate-y-2 ${item.shadow_neon || 'hover:shadow-xl'}">
                    <div class="w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <i class="fa-solid ${item.icon} text-2xl"></i>
                    </div>
                    <h3 class="benefit-title text-xl font-bold text-gray-900 mb-3 transition-all duration-300">${item.title}</h3>
                    <p class="benefit-desc text-gray-600 leading-relaxed text-sm transition-all duration-300">${item.desc}</p>
                </div>
            `;
            
            // Logic Auto-scale font untuk dalam Card
            const h3El = wrapper.querySelector('.benefit-title');
            const pEl = wrapper.querySelector('.benefit-desc');

            if (h3El) autoScaleFont(h3El, 18, "text-xl", "text-lg leading-tight");
            if (pEl) autoScaleFont(pEl, 80, "text-sm", "text-xs");

            container.appendChild(wrapper);
        });
    }

    return tempDiv.innerHTML;
}

function initBenefitsLogic() {
    // Kosongin sementara
}