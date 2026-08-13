async function renderLandingPage() {
  const navbarHTML = await renderNavbarMaster();
  const heroHTML = await renderHero();
  const statsHTML = await renderStats();
  const servicesHTML = await renderServices();
  const howItWorksHTML = await renderHowItWorks();
  const partnershipHTML = await renderPartnership();

  return `
        <div id="view-landing-page">
            ${navbarHTML}
            ${heroHTML}
            ${statsHTML}
            ${servicesHTML}
            ${howItWorksHTML}
            
            <!-- Render komponen Partnership di sini -->
            ${partnershipHTML}
            
            <main id="main-content"> 
                <!-- Komponen CTA / Footer nyusul di sini -->
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
  if (typeof initHowItWorksLogic === "function") initHowItWorksLogic();
  if (typeof initPartnershipLogic === 'function') initPartnershipLogic();
}
