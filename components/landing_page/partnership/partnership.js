async function renderPartnership() {
    let html = await fetchHTML('./components/landing_page/partnership/partnership.html');
    
    // Ambil data CMS
    const data = window.State.get('partnership') || {};
    
    // Fallback data kalau belum konek JSON
    const defaultData = {
        tagline: "Gabung Mitra",
        title: "Tumbuh & Sukses Bersama Kami",
        description: "Pilih peran yang paling sesuai dengan Anda. Jadilah armada penggerak kami, atau tingkatkan efisiensi pengiriman bisnis Anda.",
        options: [
            {
                title: "Mitra Driver",
                desc: "Dapatkan penghasilan tambahan dengan waktu kerja yang fleksibel.",
                icon: "fa-motorcycle",
                whatsapp: "081234567890",
                wa_text: "Halo, saya tertarik mendaftar Mitra Driver.",
                email: "mitra@kurirkoe.com",
                email_subject: "Daftar Mitra Driver"
            },
            {
                title: "Mitra Merchant",
                desc: "Solusi pengiriman handal untuk bantu tingkatkan skala bisnis UMKM Anda.",
                icon: "fa-store",
                whatsapp: "081234567890",
                wa_text: "Halo, saya tertarik mendaftar Mitra Merchant.",
                email: "mitra@kurirkoe.com",
                email_subject: "Daftar Mitra Merchant"
            }
        ],
        image_url: "./assets/images/partnership_illustration.webp" 
    };

    // Ambil target array. Kalau di CMS lama masih pakai 'items', kita alihkan secara otomatis
    const activeOptions = data.options || data.items || defaultData.options;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const elTagline = tempDiv.querySelector('#partner-tagline');
    const elTitle = tempDiv.querySelector('#partner-title');
    const elDesc = tempDiv.querySelector('#partner-desc');
    const elImg = tempDiv.querySelector('#partner-img');
    const optionsContainer = tempDiv.querySelector('#partner-options');

    // --- Render Teks Header & Scale ---
    if (elTagline) {
        elTagline.textContent = data.tagline || defaultData.tagline;
        autoScaleFont(elTagline, 20, "text-sm", "text-xs");
    }
    if (elTitle) {
        elTitle.textContent = data.title || defaultData.title;
        autoScaleFont(elTitle, 25, "text-3xl md:text-4xl lg:text-5xl", "text-2xl md:text-3xl lg:text-4xl");
    }
    if (elDesc) {
        elDesc.textContent = data.description || defaultData.description;
        autoScaleFont(elDesc, 90, "text-lg", "text-base");
    }
    if (elImg) elImg.src = data.image_url || defaultData.image_url;

    // --- Render Card Options ---
    if (optionsContainer && activeOptions) {
        optionsContainer.innerHTML = '';
        
        activeOptions.forEach((opt, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = `partner-wrapper partner-delay-${index + 4}`;
            
            const waLink = `https://wa.me/${opt.whatsapp || '081234567890'}?text=${encodeURIComponent(opt.wa_text || 'Halo')}`;
            const emailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${opt.email || 'mitra@kurirkoe.com'}&su=${encodeURIComponent(opt.email_subject || 'Daftar Mitra')}`;
            
            const actionLabel = data.action_label || "Daftar Langsung Via:";
            const waLabel = opt.wa_label || "WhatsApp";
            const emailLabel = opt.email_label || "Email";

            // REVISI: Hover border pakai primary/40, title text jadi accent, bayangan neon biru
            wrapper.innerHTML = `
                <div class="h-full flex flex-col bg-white p-6 md:p-7 rounded-[1.5rem] shadow-sm hover:shadow-[0_15px_35px_-5px_rgba(0,84,183,0.3)] border border-gray-100 hover:border-primary/40 transition-all duration-500 group relative overflow-hidden">
                                         
                    <div class="absolute -right-8 -top-8 w-32 h-32 bg-blue-50/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-0"></div>
                                         
                    <div class="w-14 h-14 bg-blue-50 text-primary rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm relative z-10">
                        <i class="fa-solid ${opt.icon || 'fa-box'} text-2xl"></i>
                    </div>
                                         
                    <h3 class="partner-title text-xl font-extrabold text-gray-900 mb-2 relative z-10 group-hover:text-accent transition-colors duration-300">${opt.title}</h3>
                    <p class="partner-desc text-gray-500 text-sm mb-8 leading-relaxed flex-grow relative z-10">${opt.desc}</p>
                                         
                    <div class="pt-5 border-t border-dashed border-gray-200 relative z-10 mt-auto">
                        <span class="partner-action block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 transition-all duration-300">${actionLabel}</span>
                                                 
                        <div class="flex items-center gap-2.5">
                            <a href="${waLink}" target="_blank" class="flex-1 bg-green-50 border border-green-100 hover:bg-green-500 text-green-600 hover:text-white hover:border-green-500 py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1">
                                <i class="fa-brands fa-whatsapp text-lg"></i> ${waLabel}
                            </a>
                                                         
                            <a href="${emailLink}" target="_blank" class="flex-1 bg-red-50 border border-red-100 hover:bg-red-500 text-red-500 hover:text-white hover:border-red-500 py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1">
                                <i class="fa-solid fa-envelope text-base"></i> ${emailLabel}
                            </a>
                        </div>
                    </div>
                </div>
            `;
            
            // --- LOGIC AUTO-SCALE FONT DALAM CARD ---
            const h3El = wrapper.querySelector('.partner-title');
            const pEl = wrapper.querySelector('.partner-desc');
            const actionEl = wrapper.querySelector('.partner-action');

            if (h3El) autoScaleFont(h3El, 22, "text-xl", "text-lg");
            if (pEl) autoScaleFont(pEl, 80, "text-sm", "text-xs");
            if (actionEl) autoScaleFont(actionEl, 25, "text-[10px]", "text-[8px]");

            optionsContainer.appendChild(wrapper);
        });
    }

    return tempDiv.innerHTML;
}

function initPartnershipLogic() {
    // Interaksi udah di-handle langsung sama href tag <a>
}