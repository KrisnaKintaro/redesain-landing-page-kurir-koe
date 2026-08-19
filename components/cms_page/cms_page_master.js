async function renderCmsPageMaster() {
  return await fetchHTML("./components/cms_page/cms_page_master.html");
}

async function loadCmsWorkspace(targetId) {
  const workspace = document.getElementById("cms-workspace-area");

  // RESET HANDLER SEBELUMNYA TIAP KALI GANTI MENU
  window.activeCmsSaveHandler = null;

  workspace.innerHTML = `
        <div class="flex flex-col items-center justify-center h-[70vh] w-full text-gray-400 workspace-anim">
            <i class="fa-solid fa-circle-notch fa-spin text-4xl mb-4 text-primary"></i>
            <p class="text-sm font-bold tracking-widest uppercase">Menyiapkan Workspace...</p>
        </div>
    `;

  try {
    switch (targetId) {
      case "setting-cms":
        if (typeof renderCmsSetting === "function") {
          workspace.innerHTML = await renderCmsSetting();
          initCmsSettingLogic();
        }
        break;
      case "setting-landing":
        if (typeof renderGlobalSetting === "function") {
          workspace.innerHTML = await renderGlobalSetting();
          initGlobalSettingLogic();
        }
        break;
      case "comp-navbar":
        if (typeof renderNavbarSetting === "function") {
          workspace.innerHTML = await renderNavbarSetting();
          initNavbarSettingLogic();
        }
        break;
      case "comp-hero":
        if (typeof renderHeroSetting === "function") {
          workspace.innerHTML = await renderHeroSetting();
          initHeroSettingLogic();
        }
        break;
      case "comp-stats":
        if (typeof renderStatsSetting === "function") {
          workspace.innerHTML = await renderStatsSetting();
          initStatsSettingLogic();
        }
        break;
      case "comp-services":
        if (typeof renderServicesSetting === "function") {
          workspace.innerHTML = await renderServicesSetting();
          initServicesSettingLogic();
        }
        break;
      default:
        workspace.innerHTML = renderPlaceholder(`Komponen ${targetId}`);
        break;
    }
  } catch (error) {
    console.error("Error loading CMS workspace:", error);
    workspace.innerHTML = `
            <div class="flex flex-col items-center justify-center h-[70vh] w-full workspace-anim">
                <i class="fa-solid fa-triangle-exclamation text-red-500 text-5xl mb-4"></i>
                <h3 class="text-xl font-bold text-gray-800">Ups! Terjadi Kesalahan.</h3>
                <p class="text-gray-500 text-sm">Gagal memuat komponen ruang kerja.</p>
            </div>
        `;
  }
}

function renderPlaceholder(name) {
  return `
        <div class="flex flex-col items-center justify-center h-[70vh] w-full text-center px-4 bg-white rounded-3xl border border-gray-100 shadow-sm workspace-anim">
            <div class="w-24 h-24 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-6">
                <i class="fa-solid fa-person-digging text-4xl"></i>
            </div>
            <h3 class="text-2xl font-extrabold text-gray-900 mb-2">${name}</h3>
            <p class="text-gray-500 text-base max-w-md">Form antarmuka untuk mengatur komponen ini sedang dalam tahap perakitan cuy. Semangat ngodingnya!</p>
        </div>
    `;
}

function initCmsPageMasterLogic() {
  console.log("Master CMS Ready. Menyiapkan layout dan navigasi...");

  const fullStateData = window.State.data || {};
  const cmsData = fullStateData.cms_global || {};

  const dTitle = document.getElementById("cms-brand-title");
  const dSub = document.getElementById("cms-brand-subtitle");
  const dLogo = document.getElementById("cms-brand-logo");
  const dDevName = document.getElementById("cms-dev-name");
  const dDevRole = document.getElementById("cms-dev-role");

  if (dTitle) dTitle.textContent = cmsData.brand_name || "Kurir Koe";
  if (dSub) dSub.textContent = cmsData.subtitle || "CMS Console";
  if (dLogo && cmsData.logo_url) dLogo.src = cmsData.logo_url;

  if (dDevName) {
    dDevName.textContent = cmsData.developer?.name || "Developer";
  }
  if (dDevRole) {
    dDevRole.textContent = cmsData.developer?.role || "Super Admin";
  }

  const sidebar = document.getElementById("cms-sidebar");
  const overlay = document.getElementById("cms-sidebar-overlay");
  const mainContent = document.getElementById("cms-main-content");
  const btnToggle = document.getElementById("toggle-sidebar-btn");
  const btnClose = document.getElementById("close-sidebar-btn");
  const navLinks = document.querySelectorAll(".cms-nav-link");
  const workspaceTitle = document.getElementById("workspace-title");

  const toggleSidebar = () => {
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop) {
      const isOpen = sidebar.classList.contains("lg:translate-x-0");
      if (isOpen) {
        sidebar.classList.remove("lg:translate-x-0");
        mainContent.classList.remove("lg:ml-[280px]");
      } else {
        sidebar.classList.add("lg:translate-x-0");
        mainContent.classList.add("lg:ml-[280px]");
      }
    } else {
      const isClosed = sidebar.classList.contains("-translate-x-full");
      if (isClosed) {
        sidebar.classList.remove("-translate-x-full");
        overlay.classList.remove("hidden");
        setTimeout(() => overlay.classList.remove("opacity-0"), 10);
      } else {
        sidebar.classList.add("-translate-x-full");
        overlay.classList.add("opacity-0");
        setTimeout(() => overlay.classList.add("hidden"), 300);
      }
    }
  };

  if (btnToggle) btnToggle.addEventListener("click", toggleSidebar);
  if (btnClose) btnClose.addEventListener("click", toggleSidebar);
  if (overlay) overlay.addEventListener("click", toggleSidebar);

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navLinks.forEach((l) => {
        l.className =
          "cms-nav-link group flex items-center gap-3 text-gray-800 hover:bg-yellow-400/50 px-4 py-3 rounded-xl font-bold text-sm transition-all border border-transparent hover:border-yellow-500/30";
        l.querySelector("i").classList.replace("text-accent", "text-primary");
      });

      link.className =
        "cms-nav-link active group flex items-center gap-3 bg-primary text-white px-4 py-3 rounded-xl font-bold text-sm shadow-[0_5px_15px_rgba(0,84,183,0.3)] transition-all hover:-translate-y-0.5";
      link.querySelector("i").classList.replace("text-primary", "text-accent");

      const menuTitle = link.querySelector(".nav-text").textContent;
      workspaceTitle.textContent = menuTitle;

      if (window.innerWidth < 1024) toggleSidebar();

      const targetId = link.getAttribute("data-target");
      loadCmsWorkspace(targetId);
    });
  });

  loadCmsWorkspace("setting-cms");

  // ==============================================================
  // LOGIC TOMBOL SIMPAN GLOBAL (OTAKNYA DI SINI)
  // ==============================================================
  const btnSave = document.getElementById("btn-save-cms");

  if (btnSave) {
    btnSave.addEventListener("click", () => {
      // Cek apakah komponen yang aktif punya handler nyimpen data
      if (typeof window.activeCmsSaveHandler === "function") {
        // Jalankan proses simpan dari komponen itu
        window.activeCmsSaveHandler();
      } else {
        alert("Waduh, fitur simpan untuk menu ini belum dibikin cuy.");
      }
    });
  }
}
