async function renderCta() {
    let html = await fetchHTML('./components/landing_page/cta/cta.html');
    
    // Ambil data CMS, kita tambahin tagline dan image_url
    const data = window.State.get('cta') || {
        tagline: "Aplikasi Kurir Koe",
        title: "Siap Kirim Paket Pertamamu?",
        description: "Download aplikasi Kurir Koe sekarang dan nikmati kemudahan kirim paket dari genggaman tangan Anda. Dapatkan promo gratis ongkir untuk pengguna baru!",
        app_store: { link: "https://www.google.com/chrome/" },
        play_store: { link: "https://www.google.com/chrome/" },
        image_url: "./assets/images/cta_mockup.webp"
    };

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Mapping elemen
    const elTagline = tempDiv.querySelector('#cta-tagline');
    const elTitle = tempDiv.querySelector('#cta-title');
    const elDesc = tempDiv.querySelector('#cta-desc');
    const elBtnAppStore = tempDiv.querySelector('#cta-btn-appstore');
    const elBtnPlayStore = tempDiv.querySelector('#cta-btn-playstore');
    const elImg = tempDiv.querySelector('#cta-img');

    if (elTagline) elTagline.textContent = data.tagline;
    if (elTitle) elTitle.textContent = data.title;
    if (elDesc) elDesc.textContent = data.description;
    
    if (elBtnAppStore && data.app_store) {
        elBtnAppStore.href = data.app_store.link;
    }
    
    if (elBtnPlayStore && data.play_store) {
        elBtnPlayStore.href = data.play_store.link;
    }

    if (elImg) {
        elImg.src = data.image_url;
    }

    return tempDiv.innerHTML;
}

function initCtaLogic() {
    // Kosongin sementara
}