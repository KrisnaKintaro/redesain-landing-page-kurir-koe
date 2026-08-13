async function renderPartnership() {
    let html = await fetchHTML('./components/landing_page/partnership/partnership.html');
    
    // Ambil data CMS, sesuaikan strukturnya buat 2 role
    const data = window.State.get('partnership') || {
        tagline: "Gabung Mitra",
        title: "Tumbuh & Sukses Bersama Kami",
        description: "Pilih peran yang paling sesuai dengan Anda. Jadilah armada penggerak kami, atau tingkatkan efisiensi pengiriman bisnis Anda.",
        options: [
            {
                title: "Mitra Driver",
                desc: "Dapatkan penghasilan tambahan dengan waktu kerja yang fleksibel.",
                icon: "fa-motorcycle",
                btn_label: "Daftar Driver",
                btn_link: "#/"
            },
            {
                title: "Mitra Merchant",
                desc: "Solusi pengiriman handal untuk bantu tingkatkan skala bisnis UMKM Anda.",
                icon: "fa-store",
                btn_label: "Daftar Merchant",
                btn_link: "#/"
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
            // Wrapper luar buat animasi scroll (Mulai dari delay-4)
            const wrapper = document.createElement('div');
            wrapper.className = `partner-wrapper partner-delay-${index + 4}`;
            
            // Card asli, tambahin h-full dan flex col biar layoutnya rapi
            wrapper.innerHTML = `
                <div class="h-full flex flex-col bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 group cursor-pointer">
                    <!-- Icon Role -->
                    <div class="w-12 h-12 bg-blue-50 text-primary rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                        <i class="fa-solid ${opt.icon} text-xl"></i>
                    </div>
                    
                    <!-- Judul & Deskripsi -->
                    <h3 class="text-xl font-bold text-gray-900 mb-2">${opt.title}</h3>
                    <p class="text-gray-600 text-sm mb-6 leading-relaxed flex-grow">${opt.desc}</p>
                    
                    <!-- Link Daftar -->
                    <a href="${opt.btn_link}" class="inline-flex items-center gap-2 text-primary font-semibold hover:text-accent transition-colors duration-300 group-hover:translate-x-1 transform mt-auto">
                        ${opt.btn_label} <i class="fa-solid fa-arrow-right text-sm"></i>
                    </a>
                </div>
            `;
            optionsContainer.appendChild(wrapper);
        });
    }

    return tempDiv.innerHTML;
}

function initPartnershipLogic() {
    // Siap diisi interaksi tambahan kalau diperlukan
}