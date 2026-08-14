async function renderPartnership() {
    let html = await fetchHTML('./components/landing_page/partnership/partnership.html');
    
    // Ambil data CMS, sesuaikan strukturnya dengan opsi WA & Email baru
    const data = window.State.get('partnership') || {
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
        image_url: "./assets/images/hero_illustration.webp" 
    };

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const elTagline = tempDiv.querySelector('#partner-tagline');
    const elTitle = tempDiv.querySelector('#partner-title');
    const elDesc = tempDiv.querySelector('#partner-desc');
    const elImg = tempDiv.querySelector('#partner-img');
    const optionsContainer = tempDiv.querySelector('#partner-options');

    if (elTagline) elTagline.textContent = data.tagline;
    if (elTitle) elTitle.textContent = data.title;
    if (elDesc) elDesc.textContent = data.description;
    if (elImg) elImg.src = data.image_url;

    if (optionsContainer && data.options) {
        optionsContainer.innerHTML = '';
        
        data.options.forEach((opt, index) => {
            // Wrapper luar buat animasi scroll
            const wrapper = document.createElement('div');
            wrapper.className = `partner-wrapper partner-delay-${index + 4}`;
            
            // Format URL khusus buat nembak langsung ke Aplikasi WA dan Gmail
            const waLink = `https://wa.me/${opt.whatsapp}?text=${encodeURIComponent(opt.wa_text)}`;
            const emailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${opt.email}&su=${encodeURIComponent(opt.email_subject)}`;

            // Card Asli dengan Desain Super Keren
            wrapper.innerHTML = `
                <div class="h-full flex flex-col bg-white p-6 md:p-7 rounded-[1.5rem] shadow-sm hover:shadow-2xl border border-gray-100 hover:border-primary/40 transition-all duration-500 group relative overflow-hidden">
                    
                    <!-- Efek Lingkaran Blur di Background Card pas di-hover -->
                    <div class="absolute -right-8 -top-8 w-32 h-32 bg-blue-50/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-0"></div>
                    
                    <!-- Icon Role -->
                    <div class="w-14 h-14 bg-blue-50 text-primary rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm relative z-10">
                        <i class="fa-solid ${opt.icon} text-2xl"></i>
                    </div>
                    
                    <!-- Judul & Deskripsi -->
                    <h3 class="text-xl font-extrabold text-gray-900 mb-2 relative z-10 group-hover:text-primary transition-colors duration-300">${opt.title}</h3>
                    <p class="text-gray-500 text-sm mb-8 leading-relaxed flex-grow relative z-10">${opt.desc}</p>
                    
                    <!-- Area Tombol Aksi -->
                    <div class="pt-5 border-t border-dashed border-gray-200 relative z-10 mt-auto">
                        <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Daftar Langsung Via:</span>
                        
                        <div class="flex items-center gap-2.5">
                            <!-- Tombol WhatsApp -->
                            <a href="${waLink}" target="_blank" class="flex-1 bg-green-50 border border-green-100 hover:bg-green-500 text-green-600 hover:text-white hover:border-green-500 py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1">
                                <i class="fa-brands fa-whatsapp text-lg"></i> WhatsApp
                            </a>
                            
                            <!-- Tombol Email -->
                            <a href="${emailLink}" target="_blank" class="flex-1 bg-red-50 border border-red-100 hover:bg-red-500 text-red-500 hover:text-white hover:border-red-500 py-2.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1">
                                <i class="fa-solid fa-envelope text-base"></i> Email
                            </a>
                        </div>
                    </div>

                </div>
            `;
            optionsContainer.appendChild(wrapper);
        });
    }

    return tempDiv.innerHTML;
}

function initPartnershipLogic() {
    // Interaksi udah di-handle langsung sama href tag <a>
}