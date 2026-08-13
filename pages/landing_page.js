async function renderLandingPage() {
  const navbarHTML = await renderNavbarMaster();
  const heroHTML = await renderHero();
  const statsHTML = await renderStats();
  const servicesHTML = await renderServices();
  const howItWorksHTML = await renderHowItWorks();
  const partnershipHTML = await renderPartnership();
  const testimonialHTML = await renderTestimonial();
  const ctaHTML = await renderCta();

  return `
        <div id="view-landing-page">
            ${navbarHTML} ${heroHTML} ${statsHTML} ${servicesHTML} ${howItWorksHTML} ${partnershipHTML} ${testimonialHTML}
            
            <!-- Render CTA di bawah Testi -->
            ${ctaHTML}
            
            <main id="main-content"> 
                <!-- Footer nyusul di sini -->
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
  if (typeof initTestimonialLogic === "function") initTestimonialLogic();
  if (typeof initCtaLogic === 'function') initCtaLogic();
}
