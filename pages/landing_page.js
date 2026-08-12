async function renderLandingPage() {
  const navbarHTML = await renderNavbarMaster();
  const heroHTML = await renderHero();
  const statsHTML = await renderStats();
  const servicesHTML = await renderServices();

  return `
        <div id="view-landing-page">
            ${navbarHTML}
            ${heroHTML}
            ${statsHTML}
            
            <!-- Render komponen Services di bawah Stats -->
            ${servicesHTML}
            
            <main id="main-content"> 
                <!-- Semudah 1-2-3 (How It Works) nyusul di sini -->
            </main>
        </div>
    `;
}

function initLandingPageLogic() {
  // Hidupkan logic khusus komponen yang ada di halaman ini
  initNavbarMasterLogic();
  if (typeof initHeroLogic === "function") initHeroLogic();
  if (typeof initStatsLogic === "function") initStatsLogic();
  if (typeof initServicesLogic === 'function') initServicesLogic();
}
