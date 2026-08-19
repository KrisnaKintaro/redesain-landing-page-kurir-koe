async function renderBrandInfo() {
    let html = await fetchHTML('./components/landing_page/footer/brand_info/brand_info.html');
    
    // Ambil data CMS
    const data = window.State.get('footer_brand') || {
        logo_url: "./assets/images/logo_kurir_koe.webp",
        description: "Solusi pengiriman terpercaya untuk UMKM dan kebutuhan personal Anda. Cepat, aman, dan dapat diandalkan ke seluruh pelosok Nusantara.",
        socials: [
            { icon: "fa-instagram", link: "https://instagram.com" },
            { icon: "fa-facebook-f", link: "https://facebook.com" },
            { icon: "fa-twitter", link: "https://twitter.com" }
        ]
    };

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const elLogo = tempDiv.querySelector('#footer-logo-img');
    const elDesc = tempDiv.querySelector('#footer-brand-desc');
    const elSocials = tempDiv.querySelector('#footer-socials');

    if (elLogo) elLogo.src = data.logo_url;
    
    // Inject teks deskripsi & jalankan Auto Scale Font
    if (elDesc && data.description) {
        elDesc.textContent = data.description;
        // Toleransi sekitar 140 karakter sebelum dikecilkan
        autoScaleFont(elDesc, 140, "text-sm sm:text-base", "text-xs sm:text-sm");
    }

    if (elSocials && data.socials) {
        elSocials.innerHTML = '';
        data.socials.forEach(soc => {
            const a = document.createElement('a');
            a.href = soc.link;
            a.target = "_blank";
            
            // REVISI: Gunakan bg-blue-100 text-primary (biru muda 30-40%) dan hover:bg-accent (kuning)
            a.className = "w-10 h-10 rounded-full bg-blue-100 text-primary flex items-center justify-center hover:bg-accent hover:text-primary transition-all duration-300 shadow-sm border border-blue-200/50 hover:border-accent";
            
            a.innerHTML = `<i class="fa-brands ${soc.icon}"></i>`;
            elSocials.appendChild(a);
        });
    }

    return tempDiv.innerHTML;
}

function initBrandInfoLogic() {
    // Kosongin sementara
}