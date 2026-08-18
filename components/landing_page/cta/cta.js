async function renderCta() {
    let html = await fetchHTML('./components/landing_page/cta/cta.html');
    
    // Ambil data CMS
    const data = window.State.get('cta') || {
        tagline: "Aplikasi Kurir Koe",
        title: "Siap Kirim Paket Pertamamu?",
        description: "Download aplikasi Kurir Koe sekarang dan nikmati kemudahan kirim paket dari genggaman tangan Anda.",
        app_store: { show: true, sub: "Download di", label: "App Store", link: "#" },
        play_store: { show: true, sub: "Dapatkan di", label: "Google Play", link: "#" },
        image_url: "./assets/images/cta_mockup.webp"
    };

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Mapping elemen dasar
    const elTagline = tempDiv.querySelector('#cta-tagline');
    const elTitle = tempDiv.querySelector('#cta-title');
    const elDesc = tempDiv.querySelector('#cta-desc');
    const elBtnAppStore = tempDiv.querySelector('#cta-btn-appstore');
    const elBtnPlayStore = tempDiv.querySelector('#cta-btn-playstore');
    const elImg = tempDiv.querySelector('#cta-img');

    // Mapping elemen teks tombol
    const elAppSub = tempDiv.querySelector('#cta-app-sub');
    const elAppLabel = tempDiv.querySelector('#cta-app-label');
    const elPlaySub = tempDiv.querySelector('#cta-play-sub');
    const elPlayLabel = tempDiv.querySelector('#cta-play-label');

    // --- LOGIC INJECT TEXT & AUTO SCALE FONT ---

    if (elTagline) {
        elTagline.textContent = data.tagline;
        autoScaleFont(elTagline, 25, "text-xs", "text-[10px]");
    }
    
    if (elTitle) {
        elTitle.textContent = data.title;
        autoScaleFont(elTitle, 30, "text-3xl md:text-4xl lg:text-5xl", "text-2xl md:text-3xl lg:text-4xl");
    }
    
    if (elDesc) {
        elDesc.textContent = data.description;
        autoScaleFont(elDesc, 130, "text-lg md:text-xl", "text-base md:text-lg");
    }
    
    if (elImg && data.image_url) {
        elImg.src = data.image_url;
    }

    // Logic Hide/Show & Inject Teks Tombol App Store
    if (elBtnAppStore) {
        if (data.app_store && data.app_store.show === true) {
            elBtnAppStore.href = data.app_store.link;
            elBtnAppStore.style.display = 'flex';
            
            // Suntik teks dari CMS dan resize jika kepanjangan
            if (elAppSub && data.app_store.sub) {
                elAppSub.textContent = data.app_store.sub;
                autoScaleFont(elAppSub, 13, "text-[11px]", "text-[9px]");
            }
            if (elAppLabel && data.app_store.label) {
                elAppLabel.textContent = data.app_store.label;
                autoScaleFont(elAppLabel, 12, "text-lg", "text-base");
            }
        } else {
            elBtnAppStore.style.display = 'none'; 
        }
    }
    
    // Logic Hide/Show & Inject Teks Tombol Play Store
    if (elBtnPlayStore) {
        if (data.play_store && data.play_store.show === true) {
            elBtnPlayStore.href = data.play_store.link;
            elBtnPlayStore.style.display = 'flex';
            
            // Suntik teks dari CMS dan resize jika kepanjangan
            if (elPlaySub && data.play_store.sub) {
                elPlaySub.textContent = data.play_store.sub;
                autoScaleFont(elPlaySub, 13, "text-[11px]", "text-[9px]");
            }
            if (elPlayLabel && data.play_store.label) {
                elPlayLabel.textContent = data.play_store.label;
                autoScaleFont(elPlayLabel, 12, "text-lg", "text-base");
            }
        } else {
            elBtnPlayStore.style.display = 'none'; 
        }
    }

    return tempDiv.innerHTML;
}

function initCtaLogic() {
    // Kosongin sementara
}