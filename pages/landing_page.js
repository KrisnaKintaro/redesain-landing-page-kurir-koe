async function renderLandingPage() {
  const navbarHTML = await renderNavbarMaster();
  const heroHTML = await renderHero();
  const statsHTML = await renderStats();
  const servicesHTML = await renderServices();
  const howItWorksHTML = await renderHowItWorks();

  return `
        <div id="view-landing-page">
            ${navbarHTML}
            ${heroHTML}
            ${statsHTML}
            ${servicesHTML}
            
            <!-- Render komponen How It Works di bawah Services -->
            ${howItWorksHTML}
            
            <main id="main-content"> 
                <!-- Komponen Partnership/Gabung Mitra nyusul di sini -->
            </main>
        </div>
    `;
}

function initLandingPageLogic() {
  // Hidupkan logic khusus komponen yang ada di halaman ini
  initNavbarMasterLogic();
  if (typeof initHeroLogic === "function") initHeroLogic();
  if (typeof initStatsLogic === "function") initStatsLogic();
  if (typeof initServicesLogic === "function") initServicesLogic();
  if (typeof initHowItWorksLogic === 'function') initHowItWorksLogic();
}
