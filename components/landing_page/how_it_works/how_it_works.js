async function renderHowItWorks() {
    let html = await fetchHTML('./components/landing_page/how_it_works/how_it_works.html');
    
    // Ambil data CMS, sesuaikan struktur datanya (Object dengan items)
    const data = window.State.get('how_it_works') || {
        tagline: "Cara Kerja",
        title: "Pengiriman Semudah 1-2-3",
        description: "Tidak perlu repot, serahkan semuanya pada kami dari awal hingga akhir.",
        items: [
            { step: "1", title: "Pesan Layanan", desc: "Pilih layanan dan isi detail pengiriman melalui aplikasi atau website kami.", icon: "fa-mobile-screen-button" },
            { step: "2", title: "Kurir Menjemput", desc: "Kurir terdekat akan langsung menjemput paket ke lokasi Anda.", icon: "fa-box-archive" },
            { step: "3", title: "Paket Sampai", desc: "Paket diantar dengan aman, bisa dilacak secara real-time.", icon: "fa-house-circle-check" }
        ]
    };

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // --- Render Teks Header ---
    const elTagline = tempDiv.querySelector('#hiw-tagline');
    const elTitle = tempDiv.querySelector('#hiw-title');
    const elDesc = tempDiv.querySelector('#hiw-desc');

    if (elTagline) elTagline.textContent = data.tagline;
    if (elTitle) elTitle.textContent = data.title;
    if (elDesc) elDesc.textContent = data.description;

    // --- Render Langkah-langkah ---
    const container = tempDiv.querySelector('#how-it-works-container');

    if (container && data.items) {
        container.innerHTML = ''; 
        
        data.items.forEach(item => {
            const div = document.createElement('div');
            div.className = "relative flex flex-col items-center group";
            
            div.innerHTML = `
                <!-- Wadah Icon & Badge -->
                <div class="relative mb-6">
                    <!-- Lingkaran Icon -->
                    <div class="w-24 h-24 bg-white border-4 border-gray-100 rounded-full flex items-center justify-center text-primary group-hover:border-primary group-hover:shadow-xl transition-all duration-300 relative z-10">
                        <i class="fa-solid ${item.icon} text-4xl group-hover:scale-110 transition-transform duration-300"></i>
                    </div>
                    
                    <!-- Badge Angka -->
                    <div class="absolute -top-2 -right-2 w-8 h-8 bg-accent text-gray-900 font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-sm z-20 group-hover:-translate-y-1 transition-transform duration-300">
                        ${item.step}
                    </div>
                </div>
                
                <!-- Judul & Deskripsi -->
                <h3 class="text-xl font-bold text-gray-900 mb-2">${item.title}</h3>
                <p class="text-gray-600 leading-relaxed max-w-xs mx-auto text-sm sm:text-base">${item.desc}</p>
            `;
            container.appendChild(div);
        });
    }

    return tempDiv.innerHTML;
}

function initHowItWorksLogic() {
    // Siap diisi interaksi tambahan kalau diperlukan nanti
}