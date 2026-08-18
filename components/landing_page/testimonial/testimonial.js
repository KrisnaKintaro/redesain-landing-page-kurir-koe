let testiInterval; // Variabel global buat nampung timer auto-slide
let currentTestiIndex = 0;

async function renderTestimonial() {
    let html = await fetchHTML('./components/landing_page/testimonial/testimonial.html');
    
    // Ambil data CMS
    const data = window.State.get('testimonial') || {
        tagline: "Testimonial",
        title: "Apa Kata Mereka?",
        description: "Ribuan pelanggan dan mitra telah membuktikan keandalan layanan kami.",
        items: [
            { name: "Budi Santoso", role: "Mitra Merchant", text: "Semenjak pakai Kurir Koe, pengiriman barang toko saya jadi lebih cepat dan aman. Omzet naik drastis!", avatar: "https://ui-avatars.com/api/?name=Budi+Santoso&background=0054B7&color=fff", rating: 5 },
            { name: "Siti Aminah", role: "Pelanggan Setia", text: "Aplikasi sangat mudah digunakan. Lacak paket real-time bikin hati tenang. Kurirnya juga ramah-ramah.", avatar: "https://ui-avatars.com/api/?name=Siti+Aminah&background=FAD812&color=000", rating: 5 },
            { name: "Dewi Lestari", role: "Pemilik Online Shop", text: "Sameday service-nya beneran nyampe di hari yang sama. Klien saya selalu puas sama kecepatan kirimnya.", avatar: "https://ui-avatars.com/api/?name=Dewi+Lestari&background=F43F5E&color=fff", rating: 4 }
        ]
    };

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const elTagline = tempDiv.querySelector('#testi-tagline');
    const elTitle = tempDiv.querySelector('#testi-title');
    const elDesc = tempDiv.querySelector('#testi-desc');

    // --- Render Teks Header & Scale ---
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

    const track = tempDiv.querySelector('#testi-track');

    if (track && data.items) {
        track.innerHTML = ''; 
        
        data.items.forEach(item => {
            // Generate Bintang sesuai rating (Maksimal 5)
            const starsHTML = Array(5).fill(0).map((_, i) => 
                `<i class="fa-solid fa-star ${i < item.rating ? 'text-accent' : 'text-gray-300'}"></i>`
            ).join('');

            const slide = document.createElement('div');
            slide.className = "w-full flex-shrink-0 px-2 md:px-6";
            
            // REVISI: Tambah class testi-text, testi-name, testi-role, dan transition-all duration-300
            slide.innerHTML = `
                <div class="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-blue-900/5 border border-gray-100 mx-auto max-w-2xl text-center relative mt-8">
                    
                    <div class="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl shadow-md border-4 border-white">
                        <i class="fa-solid fa-quote-left"></i>
                    </div>
                    
                    <div class="flex justify-center gap-1 mb-6 mt-4 text-sm">
                        ${starsHTML}
                    </div>
                    
                    <p class="testi-text text-gray-700 text-lg md:text-xl italic mb-8 leading-relaxed transition-all duration-300">
                        "${item.text}"
                    </p>
                    
                    <div class="flex flex-col items-center justify-center">
                        <img src="${item.avatar}" alt="${item.name}" class="w-16 h-16 rounded-full object-cover mb-3 border-2 border-gray-100">
                        <h4 class="testi-name font-bold text-gray-900 transition-all duration-300">${item.name}</h4>
                        <p class="testi-role text-primary text-sm font-medium mt-0.5 transition-all duration-300">${item.role}</p>
                    </div>
                </div>
            `;
            
            // --- LOGIC AUTO-SCALE FONT DALAM CARD SLIDER ---
            const pTextEl = slide.querySelector('.testi-text');
            const h4NameEl = slide.querySelector('.testi-name');
            const pRoleEl = slide.querySelector('.testi-role');

            // 1. Jika teks review super panjang (lebih dari 110 karakter), turunkan font biar ngga melar lewatin container
            if (pTextEl && item.text) {
                autoScaleFont(pTextEl, 110, "text-lg md:text-xl", "text-sm md:text-base leading-relaxed");
            }
            // 2. Scale nama (Toleransi 18 karakter)
            if (h4NameEl && item.name) {
                autoScaleFont(h4NameEl, 18, "text-base", "text-sm");
            }
            // 3. Scale role (Toleransi 15 karakter)
            if (pRoleEl && item.role) {
                autoScaleFont(pRoleEl, 15, "text-sm", "text-xs");
            }

            track.appendChild(slide);
        });
    }

    return tempDiv.innerHTML;
}

function initTestimonialLogic() {
    const track = document.getElementById('testi-track');
    const prevBtn = document.getElementById('testi-prev');
    const nextBtn = document.getElementById('testi-next');
    const carousel = document.getElementById('testimonial-carousel');
    
    if (!track) return;

    const slides = track.children;
    const totalSlides = slides.length;
    
    // Kalau testimoni cuma 1, matiin aja tombol dan autonya
    if (totalSlides <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }

    currentTestiIndex = 0; // Reset index pas diload

    // Fungsi buat geser CSS Transform
    const updateSlider = () => {
        track.style.transform = `translateX(-${currentTestiIndex * 100}%)`;
    };

    const nextSlide = () => {
        currentTestiIndex = (currentTestiIndex + 1) % totalSlides;
        updateSlider();
    };

    const prevSlide = () => {
        currentTestiIndex = (currentTestiIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    };

    // Event Klik Tombol
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval(); // Restart timer kalau di-klik manual
    });
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });

    // --- LOGIC AUTO-SLIDE ---
    const startInterval = () => {
        testiInterval = setInterval(nextSlide, 4000); // Geser setiap 4 detik (4000 ms)
    };

    const resetInterval = () => {
        clearInterval(testiInterval);
        startInterval();
    };

    // --- PAUSE ON HOVER ---
    if(carousel) {
        carousel.addEventListener('mouseenter', () => clearInterval(testiInterval)); // Stop pas mouse masuk
        carousel.addEventListener('mouseleave', startInterval); // Jalan lagi pas mouse keluar
    }

    // Mulai animasi saat pertama kali load
    startInterval();
}