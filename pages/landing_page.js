async function renderLandingPage() {
  const navbarHTML = await renderNavbarMaster();
  const heroHTML = await renderHero();
  const statsHTML = await renderStats();
  const servicesHTML = await renderServices();
  const howItWorksHTML = await renderHowItWorks();
  const partnershipHTML = await renderPartnership();
  const testimonialHTML = await renderTestimonial();

  return `
        <div id="view-landing-page">
            ${navbarHTML} ${heroHTML} ${statsHTML} ${servicesHTML} ${howItWorksHTML} ${partnershipHTML}
            
            <!-- Render Testi di Bawah Partnership -->
            ${testimonialHTML}
            
            <main id="main-content"> 
                <!-- Footer & CTA nyusul di sini -->
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
  if (typeof initPartnershipLogic === "function") initPartnershipLogic();
  if (typeof initTestimonialLogic === 'function') initTestimonialLogic();
}
