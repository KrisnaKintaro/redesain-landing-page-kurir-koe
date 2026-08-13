async function renderCta() {
    let html = await fetchHTML('./components/landing_page/cta/cta.html');
    
    // Ambil data CMS, tambahin opsi 'show' (true/false) buat masing-masing tombol
    const data = window.State.get('cta') || {
        tagline: "Aplikasi Kurir Koe",
        title: "Siap Kirim Paket Pertamamu?",
        description: "Download aplikasi Kurir Koe sekarang dan nikmati kemudahan kirim paket dari genggaman tangan Anda. Dapatkan promo gratis ongkir untuk pengguna baru!",
        app_store: { show: true, link: "https://www.google.com/chrome/" },
        play_store: { show: true, link: "https://www.google.com/chrome/" },
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
    
    // Logic Hide/Show Tombol App Store
    if (elBtnAppStore) {
        if (data.app_store && data.app_store.show === true) {
            elBtnAppStore.href = data.app_store.link;
            elBtnAppStore.style.display = 'flex'; // Pastikan tampil
        } else {
            elBtnAppStore.style.display = 'none'; // Sembunyikan kalau false
        }
    }
    
    // Logic Hide/Show Tombol Play Store
    if (elBtnPlayStore) {
        if (data.play_store && data.play_store.show === true) {
            elBtnPlayStore.href = data.play_store.link;
            elBtnPlayStore.style.display = 'flex'; // Pastikan tampil
        } else {
            elBtnPlayStore.style.display = 'none'; // Sembunyikan kalau false
        }
    }

    if (elImg) {
        elImg.src = data.image_url;
    }

    return tempDiv.innerHTML;
}

function initCtaLogic() {
    // Kosongin sementara
}