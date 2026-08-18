async function renderLoginOptionPopup() {
    let html = await fetchHTML('./components/landing_page/navbar/button_login/login_option_popup/login_option_popup.html');
    
    // --- AMBIL DATA DARI CMS ---
    const data = window.State.get('login_modal');

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Tembak konten CMS ke dalam HTML (jika data CMS ada)
    if (data && data.options) {
        const titleEl = tempDiv.querySelector('#auth-options-title');
        const subtitleEl = tempDiv.querySelector('#auth-options-subtitle');
        
        const karTitleEl = tempDiv.querySelector('#opt-kar-title');
        const karSubEl = tempDiv.querySelector('#opt-kar-sub');
        const karIconEl = tempDiv.querySelector('#opt-kar-icon');
        
        const admTitleEl = tempDiv.querySelector('#opt-adm-title');
        const admSubEl = tempDiv.querySelector('#opt-adm-sub');
        const admIconEl = tempDiv.querySelector('#opt-adm-icon');

        // 1. Render & Scale Judul Utama Popup
        if (titleEl && data.options.title) {
            titleEl.textContent = data.options.title;
            autoScaleFont(titleEl, 15, "text-2xl", "text-xl sm:text-lg leading-tight");
        }
        
        // 2. Render & Scale Subtitle Utama Popup
        if (subtitleEl && data.options.subtitle) {
            subtitleEl.textContent = data.options.subtitle;
            autoScaleFont(subtitleEl, 40, "text-sm", "text-xs leading-normal");
        }
        
        // 3. Render & Scale Role Karyawan
        if (karTitleEl && data.options.karyawan?.title) {
            karTitleEl.textContent = data.options.karyawan.title;
            autoScaleFont(karTitleEl, 10, "text-sm", "text-xs whitespace-nowrap");
        }
        if (karSubEl && data.options.karyawan?.subtitle) {
            karSubEl.textContent = data.options.karyawan.subtitle;
            autoScaleFont(karSubEl, 22, "text-[10px]", "text-[9px] leading-tight");
        }
        if (karIconEl && data.options.karyawan?.icon) {
            karIconEl.className = `fa-solid ${data.options.karyawan.icon} text-xl`;
        }
        
        // 4. Render & Scale Role Admin
        if (admTitleEl && data.options.admin?.title) {
            admTitleEl.textContent = data.options.admin.title;
            autoScaleFont(admTitleEl, 10, "text-sm", "text-xs whitespace-nowrap");
        }
        if (admSubEl && data.options.admin?.subtitle) {
            admSubEl.textContent = data.options.admin.subtitle;
            autoScaleFont(admSubEl, 22, "text-[10px]", "text-[9px] leading-tight");
        }
        if (admIconEl && data.options.admin?.icon) {
            admIconEl.className = `fa-solid ${data.options.admin.icon} text-xl`;
        }
    }

    const modalEl = tempDiv.querySelector('#auth-modal');
    if (modalEl) {
        const existingModal = document.getElementById('auth-modal');
        if (existingModal) existingModal.remove();
        document.body.appendChild(modalEl);
    }
    return ''; 
}

function initLoginOptionLogic() {
  // Tombol trigger dari navbar (di file button_login.html)
  const btnMasuk = document.getElementById("nav-btn-masuk");

  // Elemen modal dari file login_option_popup.html
  const modal = document.getElementById("auth-modal");
  const overlay = document.getElementById("auth-modal-overlay");
  const modalBox = document.getElementById("auth-modal-box");
  const btnClose = document.getElementById("auth-modal-close");

  // Tombol pilihan role
  const btnKaryawan = document.getElementById("btn-role-karyawan");
  const btnAdmin = document.getElementById("btn-role-admin");
  const optionsView = document.getElementById("auth-options-view");

  if (!btnMasuk || !modal) return;

  // Fungsi Buka Modal
  const openModal = () => {
    // Pastikan view di-reset ke pilihan role saat dibuka
    if (optionsView) {
      optionsView.classList.remove("hidden", "swap-out");
      optionsView.classList.add("swap-in");
    }

    modal.classList.remove("hidden");
    // Jeda bentar biar animasi CSS jalan
    setTimeout(() => {
      overlay.classList.remove("opacity-0");
      modalBox.classList.remove("opacity-0", "scale-95");
      modalBox.classList.add("opacity-100", "scale-100");
    }, 10);
  };

  // Fungsi Tutup Modal
  const closeModal = () => {
    overlay.classList.add("opacity-0");
    modalBox.classList.remove("opacity-100", "scale-100");
    modalBox.classList.add("opacity-0", "scale-95");

    setTimeout(() => {
      modal.classList.add("hidden");

      const optionsView = document.getElementById("auth-options-view");
      const formEl = document.getElementById("dynamic-login-form");

      if (formEl) formEl.remove();

      if (optionsView) {
        optionsView.classList.remove("hidden", "swap-out", "swap-in");
      }
    }, 400); // Tunggu sampai animasi hilang 100% baru di-reset
  };

  // Pasang Event Listener
  btnMasuk.addEventListener("click", openModal);
  btnClose.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);

  // --- LOGIC KLIK PILIHAN ROLE ---
  const handleRoleSelection = (role) => {
    // Jalankan animasi konten lama nge-slide ke kiri dan ngilang
    optionsView.classList.remove("swap-in");
    optionsView.classList.add("swap-out");

    setTimeout(() => {
      optionsView.classList.add("hidden"); // Sembunyiin dari layout setelah transparan

      // Panggil form barunya cuy!
      if (typeof renderFormLoginPopup === "function") {
        renderFormLoginPopup(role);
      }
    }, 400); // Waktu nunggu sesuai durasi css animasi swap-out
  };

  if (btnKaryawan)
    btnKaryawan.addEventListener("click", () =>
      handleRoleSelection("karyawan"),
    );
  if (btnAdmin)
    btnAdmin.addEventListener("click", () => handleRoleSelection("admin"));
}