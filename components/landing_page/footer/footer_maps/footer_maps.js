async function renderFooterMaps() {
    let html = await fetchHTML('./components/landing_page/footer/footer_maps/footer_maps.html');
    
    // Ambil data CMS, tambahin label dan alamat
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
    
    if (elLabel && data.label) {
        elLabel.textContent = data.label;
    }
    
    if (elAddress && data.address) {
        elAddress.textContent = data.address;
    }

    return tempDiv.innerHTML;
}

function initFooterMapsLogic() {
    // Kosongin sementara
}