async function renderHero() {
    let html = await fetchHTML('./components/landing_page/hero/hero.html');
    
    const data = window.State.get('hero') || {
        tagline: "🚀 Solusi Pengiriman #1",
        title_1: "Solusi Pengiriman",
        title_2: "Terpercaya!",
        description: "Kirim paket ke seluruh pelosok dengan mudah, cepat, dan aman bersama Kurir Koe.",
        btn_primary: { label: "Mulai Sekarang", target: "services" },
        btn_secondary: { label: "Gabung Mitra", target: "cta" },
        social_proof: {
            text: "Dipercaya oleh 5.000+ pelanggan",
            rating: 5,
            avatars: [
                "https://ui-avatars.com/api/?name=User+1&background=random",
                "https://ui-avatars.com/api/?name=User+2&background=random",
                "https://ui-avatars.com/api/?name=User+3&background=random"
            ]
        },
        image_url: "./assets/images/hero_illustration.webp" 
    };

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const elTaglineWrapper = tempDiv.querySelector('#hero-tagline-wrapper');
    const elTagline = tempDiv.querySelector('#hero-tagline');
    
    const elH1 = tempDiv.querySelector('#hero-h1');
    const elTitle1 = tempDiv.querySelector('#hero-title-1');
    const elTitle2 = tempDiv.querySelector('#hero-title-2');
    
    const elDesc = tempDiv.querySelector('#hero-desc');
    const elBtnPrimary = tempDiv.querySelector('#hero-btn-primary');
    const elBtnSecondary = tempDiv.querySelector('#hero-btn-secondary');
    const elImg = tempDiv.querySelector('#hero-img');
    const elSocialProofText = tempDiv.querySelector('#hero-social-proof');
    const elAvatars = tempDiv.querySelector('#hero-avatars');
    const elStars = tempDiv.querySelector('#hero-stars');

    // 1. Tagline
    if (elTagline && data.tagline) {
        elTagline.textContent = data.tagline;
        if (elTaglineWrapper) autoScaleFont(elTaglineWrapper, 25, "text-sm", "text-xs");
    }

    // 2. Title 1 & Title 2 (Digabung logicnya pada parent H1)
    if (elTitle1 && data.title_1) elTitle1.textContent = data.title_1;
    if (elTitle2 && data.title_2) elTitle2.textContent = data.title_2;
    
    if (elH1 && data.title_1 && data.title_2) {
        const totalLen = data.title_1.length + data.title_2.length;
        if (totalLen > 38) { 
            elH1.classList.remove('text-4xl', 'sm:text-5xl', 'lg:text-6xl');
            elH1.classList.add('text-3xl', 'sm:text-4xl', 'lg:text-5xl');
        } else {
            elH1.classList.remove('text-3xl', 'sm:text-4xl', 'lg:text-5xl');
            elH1.classList.add('text-4xl', 'sm:text-5xl', 'lg:text-6xl');
        }
    }

    // 3. Deskripsi
    if (elDesc && data.description) {
        elDesc.textContent = data.description;
        autoScaleFont(elDesc, 100, "text-lg", "text-base");
    }

    // 4. Tombol Aksi
    if (elBtnPrimary && data.btn_primary) {
        elBtnPrimary.textContent = data.btn_primary.label;
        elBtnPrimary.setAttribute('data-target', data.btn_primary.target);
        autoScaleFont(elBtnPrimary, 15, "text-base", "text-sm whitespace-nowrap");
    }
    if (elBtnSecondary && data.btn_secondary) {
        elBtnSecondary.textContent = data.btn_secondary.label;
        elBtnSecondary.setAttribute('data-target', data.btn_secondary.target);
        autoScaleFont(elBtnSecondary, 15, "text-base", "text-sm whitespace-nowrap");
    }

    // 5. Gambar
    if (elImg && data.image_url) elImg.src = data.image_url;

    // 6. Social Proof
    if (elSocialProofText && data.social_proof) {
        elSocialProofText.textContent = data.social_proof.text;
        autoScaleFont(elSocialProofText, 35, "text-sm", "text-xs");
    }
    if (elAvatars && data.social_proof) {
        elAvatars.innerHTML = ''; 
        data.social_proof.avatars.forEach(url => {
            elAvatars.innerHTML += `<img class="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" src="${url}" alt="User Avatar">`;
        });
    }
    if (elStars && data.social_proof) {
        elStars.innerHTML = ''; 
        for (let i = 0; i < data.social_proof.rating; i++) {
            elStars.innerHTML += `<i class="fa-solid fa-star"></i>`;
        }
    }

    return tempDiv.innerHTML;
}

function initHeroLogic() {
    const heroLinks = document.querySelectorAll('.hero-scroll-link');
    
    heroLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}