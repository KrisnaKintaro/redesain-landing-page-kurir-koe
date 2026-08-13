async function renderFooterMaster() {
    let html = await fetchHTML('./components/landing_page/footer/footer_master.html');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Panggil render komponen anak-anaknya secara paralel
    const [brandInfoHTML] = await Promise.all([
        renderBrandInfo()
        // renderLinkGroup(),
        // renderContactUs(),
        // renderFooterMaps(),
        // renderCopyright()
    ]);

    // Pasang ke slotnya masing-masing
    const slotBrand = tempDiv.querySelector('#slot-footer-brand');
    
    if (slotBrand) slotBrand.innerHTML = brandInfoHTML;

    return tempDiv.innerHTML;
}

function initFooterMasterLogic() {
    // Inisiasi logic anak-anak komponen
    if (typeof initBrandInfoLogic === 'function') initBrandInfoLogic();
}