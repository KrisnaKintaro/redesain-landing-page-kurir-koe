async function renderHero() {
    let html = await fetchHTML('./components/landing_page/hero/hero.html');
    
    // Tarik data CMS
    const data = window.State.get('hero') || {
        tagline: "🚀 Solusi Pengiriman #1",
        title_1: "Solusi Pengiriman",
        title_2: "Terpercaya!",
        description: "Kirim paket ke seluruh pelosok dengan mudah, cepat, dan aman bersama Kurir Koe.",
        btn_primary: { label: "Mulai Sekarang", target: "services" },
        btn_secondary: { label: "Gabung Mitra", target: "cta" },
        social_proof: "Dipercaya oleh 5.000+ pelanggan",
        image_url: "./assets/images/hero_illustration.webp" 
    };

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Mapping Data ke HTML
    const elTagline = tempDiv.querySelector('#hero-tagline');
    const elTitle1 = tempDiv.querySelector('#hero-title-1');
    const elTitle2 = tempDiv.querySelector('#hero-title-2');
    const elDesc = tempDiv.querySelector('#hero-desc');
    const elBtnPrimary = tempDiv.querySelector('#hero-btn-primary');
    const elBtnSecondary = tempDiv.querySelector('#hero-btn-secondary');
    const elSocialProof = tempDiv.querySelector('#hero-social-proof');
    const elImg = tempDiv.querySelector('#hero-img');

    if (elTagline) elTagline.textContent = data.tagline;
    if (elTitle1) elTitle1.textContent = data.title_1;
    if (elTitle2) elTitle2.textContent = data.title_2;
    if (elDesc) elDesc.textContent = data.description;
    if (elSocialProof) elSocialProof.textContent = data.social_proof;
    
    if (elBtnPrimary) {
        elBtnPrimary.textContent = data.btn_primary.label;
        elBtnPrimary.setAttribute('data-target', data.btn_primary.target);
    }
    
    if (elBtnSecondary) {
        elBtnSecondary.textContent = data.btn_secondary.label;
        elBtnSecondary.setAttribute('data-target', data.btn_secondary.target);
    }
    
    if (elImg) {
        elImg.src = data.image_url;
    }

    return tempDiv.innerHTML;
}

function initHeroLogic() {
    // Logic Scroll untuk tombol aksi di Hero
    const heroLinks = document.querySelectorAll('.hero-scroll-link');
    
    heroLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}