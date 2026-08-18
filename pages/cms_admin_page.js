async function renderCmsAdminPage() {
    let html = await fetchHTML('./components/cms_page/cms_page_master.html');
    return html;
}

function initCmsAdminLogic() {
    // Kosongin sementara cuy.
    // Nanti semua logic buat nangkep inputan form dan update ke state.js kita taruh di sini.
    console.log("CMS Dashboard berhasil dimuat!");
}