async function renderNavbarSetting() {
    return await fetchHTML('./components/cms_page/navbar_setting/navbar_setting.html');
}

function initNavbarSettingLogic() {
    console.log("[CMS Module] Navbar Master Form Ready.");
    
    // Ambil copy dari state (Clone biar aman saat diedit sebelum disave)
    const state = window.State.data || {};
    let navMenuArr = JSON.parse(JSON.stringify(state.nav_menu || []));
    let btnLoginData = state.button_login || {};
    let btnDownloadData = state.button_download || {};
    let mobileDrawerData = state.mobile_drawer || {};

    // 1. Mapping DOM Elements
    const inputs = {
        drawer1: document.getElementById('set-nav-drawer-1'),
        drawer2: document.getElementById('set-nav-drawer-2'),
        loginLabel: document.getElementById('set-nav-login-label'),
        dlLabel: document.getElementById('set-nav-dl-label'),
        dlTarget: document.getElementById('set-nav-dl-target')
    };

    const menuContainer = document.getElementById('nav-menu-list-container');
    const btnAddMenu = document.getElementById('btn-add-nav-menu');

    // 2. Tembak Data Static
    if(inputs.drawer1) inputs.drawer1.value = mobileDrawerData.brand_text_1 || "";
    if(inputs.drawer2) inputs.drawer2.value = mobileDrawerData.brand_text_2 || "";
    if(inputs.loginLabel) inputs.loginLabel.value = btnLoginData.label || "";
    if(inputs.dlLabel) inputs.dlLabel.value = btnDownloadData.label || "";
    if(inputs.dlTarget) inputs.dlTarget.value = btnDownloadData.target || "";

    // 3. Logic Render List Menu Dinamis
    const renderMenuList = () => {
        if(!menuContainer) return;
        menuContainer.innerHTML = '';

        if(navMenuArr.length === 0) {
            menuContainer.innerHTML = `<div class="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">Belum ada menu, tambahkan satu cuy!</div>`;
            return;
        }

        navMenuArr.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = "flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm relative group";
            
            row.innerHTML = `
                <div class="flex flex-col gap-3 flex-1">
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-[10px] font-bold text-gray-500 mb-1">Label Menu</label>
                            <input type="text" data-idx="${index}" data-field="label" value="${item.label}" class="nav-menu-input w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-gray-800 font-semibold">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-gray-500 mb-1">Target (ID Section)</label>
                            <input type="text" data-idx="${index}" data-field="target" value="${item.target}" class="nav-menu-input w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-gray-800">
                        </div>
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-gray-500 mb-1">Class Icon</label>
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0 border border-blue-100">
                                <i class="fa-solid ${item.icon}"></i>
                            </div>
                            <input type="text" data-idx="${index}" data-field="icon" value="${item.icon}" class="nav-menu-input w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-gray-800 font-mono text-xs">
                        </div>
                    </div>
                </div>
                <!-- Tombol Hapus -->
                <button type="button" data-idx="${index}" class="btn-remove-nav w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors shrink-0">
                    <i class="fa-solid fa-trash-can text-sm"></i>
                </button>
            `;
            menuContainer.appendChild(row);
        });
    };

    // Jalankan render pertama kali
    renderMenuList();

    // 4. Event Listener Dinamis untuk Array Menu (Event Delegation)
    if(menuContainer) {
        // Nangkep perubahan ketikan input
        menuContainer.addEventListener('input', (e) => {
            if(e.target.classList.contains('nav-menu-input')) {
                const idx = e.target.getAttribute('data-idx');
                const field = e.target.getAttribute('data-field');
                navMenuArr[idx][field] = e.target.value;
                
                // Kalau yang diubah icon, update live preview iconnya
                if(field === 'icon') {
                    const iconDisplay = e.target.previousElementSibling.querySelector('i');
                    if(iconDisplay) iconDisplay.className = `fa-solid ${e.target.value}`;
                }
            }
        });

        // Nangkep klik tombol hapus
        menuContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-remove-nav');
            if(btn) {
                const idx = btn.getAttribute('data-idx');
                navMenuArr.splice(idx, 1); // Hapus dari array
                renderMenuList(); // Re-render UI
            }
        });
    }

    // Nangkep klik tombol tambah
    if(btnAddMenu) {
        btnAddMenu.addEventListener('click', () => {
            navMenuArr.push({ label: "Menu Baru", target: "hero", icon: "fa-star" });
            renderMenuList();
            // Scroll otomatis ke bawah
            setTimeout(() => { menuContainer.scrollTop = menuContainer.scrollHeight; }, 100);
        });
    }

    // 5. Daftarkan Fungsi Save ke Tombol Global Navbar CMS
    window.activeCmsSaveHandler = () => {
        // Update state utama dengan data dari form (Static + Dynamic)
        window.State.data.mobile_drawer = {
            brand_text_1: inputs.drawer1.value,
            brand_text_2: inputs.drawer2.value
        };
        window.State.data.button_login = {
            label: inputs.loginLabel.value,
            target: "login-popup" // Target login biasanya fixed
        };
        window.State.data.button_download = {
            label: inputs.dlLabel.value,
            target: inputs.dlTarget.value
        };
        window.State.data.nav_menu = navMenuArr; // Masukin array yg udah diedit

        // Siapkan Payload buat dilempar ke PHP
        const formData = new FormData();
        formData.append('mobile_drawer', JSON.stringify(window.State.data.mobile_drawer));
        formData.append('button_login', JSON.stringify(window.State.data.button_login));
        formData.append('button_download', JSON.stringify(window.State.data.button_download));
        formData.append('nav_menu', JSON.stringify(window.State.data.nav_menu));

        const btnSave = document.getElementById('btn-save-cms');
        const originalHTML = btnSave.innerHTML;
        btnSave.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...`;
        btnSave.disabled = true;

        // Tembak ke API (Super Universal Save)
        fetch('./server/save_cms.php', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(result => {
            if (result.status === 'success' || result.status === 'warning') {
                btnSave.innerHTML = `<i class="fa-solid fa-check"></i> Tersimpan!`;
                btnSave.className = "anim-save-btn bg-green-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_5px_15px_rgba(34,197,94,0.3)] transition-all flex items-center gap-2";
            } else throw new Error(result.message);
        })
        .catch(err => {
            alert("Gagal: " + err.message);
            btnSave.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Gagal`;
            btnSave.className = "anim-save-btn bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_5px_15px_rgba(239,68,68,0.3)] transition-all flex items-center gap-2";
        })
        .finally(() => {
            setTimeout(() => {
                btnSave.disabled = false;
                btnSave.innerHTML = originalHTML;
                btnSave.className = "anim-save-btn bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_5px_15px_rgba(0,84,183,0.3)] hover:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2";
            }, 2000);
        });
    };
}