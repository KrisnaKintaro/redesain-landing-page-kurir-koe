async function renderFooterMaps() {
    let html = await fetchHTML('./components/landing_page/footer/footer_maps/footer_maps.html');
    
    // Ambil data CMS
    const data = window.State.get('footer_maps') || {
        embed_url: "https://maps.google.com/maps?q=Jl.+Kutai+Utara+No.1,+Sumber,+Kec.+Banjarsari,+Kota+Surakarta,+Jawa+Tengah+57138&t=&z=17&ie=UTF8&iwloc=&output=embed",
        label: "Kantor Pusat Kurir Koe",
        address: "Jl. Kutai Utara No.1, Sumber, Kec. Banjarsari, Kota Surakarta, Jawa Tengah 57138"
    };

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const iframe = tempDiv.querySelector('#footer-map-iframe');
    const elLabel = tempDiv.querySelector('#footer-map-label');
    const elAddress = tempDiv.querySelector('#footer-map-address');
    
    if (iframe && data.embed_url) {
        iframe.src = data.embed_url;
    }
    
    // --- LOGIC INJECT TEXT & AUTO SCALE FONT ---

    // 1. Label Nama Kantor (Toleransi 18 karakter)
    if (elLabel && data.label) {
        elLabel.textContent = data.label;
        autoScaleFont(elLabel, 18, "text-sm", "text-xs");
    }
    
    // 2. Deskripsi Alamat Lengkap (Toleransi 65 karakter)
    if (elAddress && data.address) {
        elAddress.textContent = data.address;
        autoScaleFont(elAddress, 65, "text-[10px]", "text-[8px] leading-tight");
    }

    return tempDiv.innerHTML;
}

function initFooterMapsLogic() {
    // Kosongin sementara
}