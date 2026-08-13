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

    const elTagline = tempDiv.querySelector('#hero-tagline');
    const elTitle1 = tempDiv.querySelector('#hero-title-1');
    const elTitle2 = tempDiv.querySelector('#hero-title-2');
    const elDesc = tempDiv.querySelector('#hero-desc');
    const elBtnPrimary = tempDiv.querySelector('#hero-btn-primary');
    const elBtnSecondary = tempDiv.querySelector('#hero-btn-secondary');
    const elImg = tempDiv.querySelector('#hero-img');
    
    // Tangkap elemen social proof yang baru
    const elSocialProofText = tempDiv.querySelector('#hero-social-proof');
    const elAvatars = tempDiv.querySelector('#hero-avatars');
    const elStars = tempDiv.querySelector('#hero-stars');

    if (elTagline) elTagline.textContent = data.tagline;
    if (elTitle1) elTitle1.textContent = data.title_1;
    if (elTitle2) elTitle2.textContent = data.title_2;
    if (elDesc) elDesc.textContent = data.description;
    
    if (elBtnPrimary) {
        elBtnPrimary.textContent = data.btn_primary.label;
        elBtnPrimary.setAttribute('data-target', data.btn_primary.target);
    }
    
    if (elBtnSecondary) {
        elBtnSecondary.textContent = data.btn_secondary.label;
        elBtnSecondary.setAttribute('data-target', data.btn_secondary.target);
    }
    
    if (elImg) elImg.src = data.image_url;

    // --- RENDER SOCIAL PROOF DINAMIS ---
    if (elSocialProofText) {
        elSocialProofText.textContent = data.social_proof.text;
    }

    if (elAvatars) {
        elAvatars.innerHTML = ''; // Bersihkan dulu
        data.social_proof.avatars.forEach(url => {
            elAvatars.innerHTML += `<img class="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" src="${url}" alt="User Avatar">`;
        });
    }

    if (elStars) {
        elStars.innerHTML = ''; // Bersihkan dulu
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