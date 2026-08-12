async function renderLandingPage() {
    const navbarHTML = await renderNavbarMaster();
    const heroHTML = await renderHero(); 
    const statsHTML = await renderStats();

    return `
        <div id="view-landing-page">
            ${navbarHTML}
            ${heroHTML}
            
            <!-- Render komponen Stats tepat di bawah Hero -->
            ${statsHTML}
            
            <main id="main-content" class="min-h-[100vh]"> 
                <!-- Nanti komponen Services dll nyusul di sini -->
            </main>
        </div>
    `;
    
}

function initLandingPageLogic() {
    // Hidupkan logic khusus komponen yang ada di halaman ini
    initNavbarMasterLogic();
    if (typeof initHeroLogic === 'function') initHeroLogic();
    if (typeof initStatsLogic === 'function') initStatsLogic(); 
}
