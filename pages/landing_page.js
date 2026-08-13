async function renderLandingPage() {
  const navbarHTML = await renderNavbarMaster();
  const heroHTML = await renderHero();
  const statsHTML = await renderStats();
  const servicesHTML = await renderServices();
  //   const howItWorksHTML = await renderHowItWorks();
  const benefitsHTML = await renderBenefits();
  const partnershipHTML = await renderPartnership();
  const testimonialHTML = await renderTestimonial();
  const ctaHTML = await renderCta();
  const footerHTML = await renderFooterMaster();

  return `
        <div id="view-landing-page">
            ${navbarHTML} ${heroHTML} ${statsHTML} ${servicesHTML} ${benefitsHTML} ${partnershipHTML} ${testimonialHTML} ${ctaHTML}
            
            <!-- Render Footer Paling Bawah -->
            ${footerHTML}
        </div>
    `;
}

function initLandingPageLogic() {
  // Hidupkan logic khusus komponen yang ada di halaman ini
  initNavbarMasterLogic();
  if (typeof initHeroLogic === "function") initHeroLogic();
  if (typeof initStatsLogic === "function") initStatsLogic();
  if (typeof initServicesLogic === "function") initServicesLogic();
  //   if (typeof initHowItWorksLogic === "function") initHowItWorksLogic();
  if (typeof initBenefitsLogic === "function") initBenefitsLogic();
  if (typeof initPartnershipLogic === "function") initPartnershipLogic();
  if (typeof initTestimonialLogic === "function") initTestimonialLogic();
  if (typeof initCtaLogic === "function") initCtaLogic();
  if (typeof initFooterMasterLogic === "function") initFooterMasterLogic();
}
