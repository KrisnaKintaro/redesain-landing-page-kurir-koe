async function renderFooterMaster() {
    let html = await fetchHTML('./components/landing_page/footer/footer_master.html');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // 1. Tambahkan linkGroupHTML di dalam kurung siku
    const [brandInfoHTML, linkGroupHTML, contactUsHTML] = await Promise.all([
        renderBrandInfo(),
        renderLinkGroup(),
        renderContactUs(),
        // renderFooterMaps(),
        // renderCopyright()
    ]);

    // Pasang ke slotnya masing-masing
    const slotBrand = tempDiv.querySelector('#slot-footer-brand');
    const slotLinks = tempDiv.querySelector('#slot-footer-links');
    const slotContact = tempDiv.querySelector('#slot-footer-contact');
    
    if (slotBrand) slotBrand.innerHTML = brandInfoHTML;
    if (slotLinks) slotLinks.innerHTML = linkGroupHTML;
    if (slotContact) slotContact.innerHTML = contactUsHTML;
    

    return tempDiv.innerHTML;
}

function initFooterMasterLogic() {
    // Inisiasi logic anak-anak komponen
    if (typeof initBrandInfoLogic === 'function') initBrandInfoLogic();
    if (typeof initLinkGroupLogic === 'function') initLinkGroupLogic();
    if (typeof initContactUsLogic === 'function') initContactUsLogic();
}