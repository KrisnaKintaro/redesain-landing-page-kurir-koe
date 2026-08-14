async function renderNavbarMaster() {
  let html = await fetchHTML(
    "./components/landing_page/navbar/navbar_master.html",
  );
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const [logoHTML, navMenuHTML, btnLoginHTML, loginPopupHTML,btnDownloadHTML] =
    await Promise.all([
      renderLogo(),
      renderNavMenu(),
      renderButtonLogin(),
      renderLoginOptionPopup(),
      renderButtonDownload(),
    ]);

  const slotLogo = tempDiv.querySelector("#slot-logo");
  const slotNavMenu = tempDiv.querySelector("#slot-nav-menu");
  const slotBtnLogin = tempDiv.querySelector("#slot-btn-login");
  const slotBtnDownload = tempDiv.querySelector("#slot-btn-download");

  if (slotLogo) slotLogo.innerHTML = logoHTML;
  if (slotNavMenu) slotNavMenu.innerHTML = navMenuHTML;
  if (slotBtnLogin) slotBtnLogin.innerHTML = btnLoginHTML;
  if (slotBtnDownload) slotBtnDownload.innerHTML = btnDownloadHTML;

  // --- RENDER MOBILE MENU ---
  const menuData = window.State.get("nav_menu") || [
    { label: "Beranda", target: "hero", icon: "fa-house" },
    { label: "Layanan", target: "services", icon: "fa-box" },
    { label: "Gabung Mitra", target: "partnership", icon: "fa-handshake" },
    { label: "Hubungi Kami", target: "footer", icon: "fa-phone" },
  ];

  const mobileMenuList = tempDiv.querySelector("#mobile-menu-list");
  if (mobileMenuList) {
    mobileMenuList.innerHTML = ""; // Bersihin dulu biar aman

    menuData.forEach((item, index) => {
      const li = document.createElement("li");
      const isActive = index === 0;

      // Tambahin flex items-center gap-3
      const baseClass =
        "mobile-nav-link flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ease-in-out cursor-pointer select-none";
      const defaultClass =
        "text-gray-600 hover:bg-yellow-50 hover:text-yellow-700";
      const activeClass = "bg-accent text-gray-900 shadow-md";

      const finalClass = `${baseClass} ${isActive ? activeClass : defaultClass}`;

      // Tembak icon-nya. Lebar icon diseragamin pakai w-6 text-center biar teksnya rata
      li.innerHTML = `
                <a href="javascript:void(0)"
                    data-target="${item.target}"
                    class="${finalClass}">
                   <i class="fa-solid ${item.icon} text-lg w-6 text-center"></i>
                   ${item.label}
                </a>
            `;
      mobileMenuList.appendChild(li);
    });
  }

  return tempDiv.innerHTML;
}

function initNavbarMasterLogic() {
  // 1. Inisiasi logic sub-komponen
  if (typeof initNavMenuLogic === "function") initNavMenuLogic();
  if (typeof initButtonLoginLogic === "function") initButtonLoginLogic();
  initLoginOptionLogic()
  if (typeof initButtonDownloadLogic === "function") initButtonDownloadLogic();

  // 2. Logic Mobile Drawer
  const btnMenu = document.getElementById("mobile-menu-btn");
  const btnClose = document.getElementById("close-drawer-btn");
  const drawer = document.getElementById("mobile-drawer");
  const overlay = document.getElementById("mobile-drawer-overlay");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");
  const defaultClasses = [
    "text-gray-600",
    "hover:bg-yellow-50",
    "hover:text-yellow-700",
  ];
  const activeClasses = ["bg-accent", "text-gray-900", "shadow-md"];

  if (!btnMenu || !drawer) return;

  const openDrawer = () => {
    overlay.classList.remove("hidden");
    setTimeout(() => {
      overlay.classList.remove("opacity-0");
      drawer.classList.remove("-translate-x-full");
    }, 10);
  };

  const closeDrawer = () => {
    overlay.classList.add("opacity-0");
    drawer.classList.add("-translate-x-full");
    setTimeout(() => {
      overlay.classList.add("hidden");
    }, 300); // Sesuaikan dengan durasi transition Tailwind
  };

  // Event listener buka/tutup
  btnMenu.addEventListener("click", openDrawer);
  btnClose.addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);

  // 3. Logic Scroll untuk Mobile Links
  mobileLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      mobileLinks.forEach((l) => {
        l.classList.remove(...activeClasses);
        l.classList.add(...defaultClasses);
      });
      link.classList.remove(...defaultClasses);
      link.classList.add(...activeClasses);

      const targetId = link.getAttribute("data-target");
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // FIX OFFSET STICKY NAVBAR
        const headerHeight = document.querySelector("header").offsetHeight;
        const elementPosition =
          targetElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        closeDrawer();
      }
    });
  });
}
