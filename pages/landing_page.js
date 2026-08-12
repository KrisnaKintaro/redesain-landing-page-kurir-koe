async function renderLandingPage() {
    // Panggil Master Navbar
    const navbarHTML = await renderNavbarMaster();
    
    const heroHTML = await renderHero(); 
    
    return `
        <div id="view-landing-page">
            ${navbarHTML}
            
            <!-- Tambahkan Hero di bawah Navbar -->
            ${heroHTML}
            
            <main id="main-content" class="min-h-screen"> 
                <!-- Nanti komponen Stats, Services dll nyusul di sini -->
            </main>
        </div>
    `;
}

function initLandingPageLogic() {
    // Hidupkan logic khusus komponen yang ada di halaman ini
    initNavbarMasterLogic();
    if (typeof initHeroLogic === 'function') initHeroLogic();
}