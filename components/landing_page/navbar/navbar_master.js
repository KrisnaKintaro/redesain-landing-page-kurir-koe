async function renderNavbarMaster() {
    // 1. Ambil kerangka master
    let html = await fetchHTML('./components/landing_page/navbar/navbar_master.html');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // 2. Render semua sub-komponen secara paralel biar cepat
    const [logoHTML, navMenuHTML, btnLoginHTML, btnDownloadHTML] = await Promise.all([
        renderLogo(),
        renderNavMenu(),
        renderButtonLogin(),
        renderButtonDownload()
    ]);

    // 3. Timpa (Inject) ke dalam slot masing-masing
    const slotLogo = tempDiv.querySelector('#slot-logo');
    const slotNavMenu = tempDiv.querySelector('#slot-nav-menu');
    const slotBtnLogin = tempDiv.querySelector('#slot-btn-login');
    const slotBtnDownload = tempDiv.querySelector('#slot-btn-download');

    if (slotLogo) slotLogo.innerHTML = logoHTML;
    if (slotNavMenu) slotNavMenu.innerHTML = navMenuHTML;
    if (slotBtnLogin) slotBtnLogin.innerHTML = btnLoginHTML;
    if (slotBtnDownload) slotBtnDownload.innerHTML = btnDownloadHTML;

    return tempDiv.innerHTML;
}

// Fungsi untuk menghidupkan SEMUA interaksi JS di Navbar
function initNavbarMasterLogic() {
    // Panggil fungsi inisiasi dari masing-masing sub-komponen
    if (typeof initNavMenuLogic === 'function') initNavMenuLogic();
    if (typeof initButtonLoginLogic === 'function') initButtonLoginLogic();
    if (typeof initButtonDownloadLogic === 'function') initButtonDownloadLogic();
}