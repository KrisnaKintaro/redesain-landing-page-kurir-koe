async function renderNavbarSetting() {
    return await fetchHTML('./components/cms_page/navbar_setting/navbar_setting.html');
}

function initNavbarSettingLogic() {
    console.log("[CMS Module] Navbar Master Form Ready.");
    
    // Ambil copy dari state
    const state = window.State.data || {};
    let navMenuArr = JSON.parse(JSON.stringify(state.nav_menu || []));
    let btnLoginData = state.button_login || {};
    let btnDownloadData = state.button_download || {};
    let mobileDrawerData = state.mobile_drawer || {};
    
    // Clone data login_modal biar lengkap
    let loginModalData = JSON.parse(JSON.stringify(state.login_modal || { 
        options: { karyawan: {}, admin: {} }, 
        form: { alerts: {}, themes: { karyawan: {}, admin: {} } } 
    }));

    // 1. Mapping DOM Elements
    const inputs = {
        drawer1: document.getElementById('set-nav-drawer-1'),
        drawer2: document.getElementById('set-nav-drawer-2'),
        loginLabel: document.getElementById('set-nav-login-label'),
        dlLabel: document.getElementById('set-nav-dl-label'),
        dlTarget: document.getElementById('set-nav-dl-target'),
        
        // Modal Options Main
        modOptTitle: document.getElementById('set-mod-opt-title'),
        modOptSub: document.getElementById('set-mod-opt-sub'),
        
        // Modal Form Default
        modEmLbl: document.getElementById('set-mod-em-lbl'),
        modEmPh: document.getElementById('set-mod-em-ph'),
        modPwLbl: document.getElementById('set-mod-pw-lbl'),
        modPwPh: document.getElementById('set-mod-pw-ph'),
        modCapLbl: document.getElementById('set-mod-cap-lbl'),
        modCapPh: document.getElementById('set-mod-cap-ph'),
        modRemTxt: document.getElementById('set-mod-rem-txt'),
        modLoadTxt: document.getElementById('set-mod-load-txt'),
        modSubTxt: document.getElementById('set-mod-sub-txt'),
        modBackTxt: document.getElementById('set-mod-back-txt'),

        // Modal Alerts
        altEmEmp: document.getElementById('set-alt-em-emp'),
        altEmInv: document.getElementById('set-alt-em-inv'),
        altPwEmp: document.getElementById('set-alt-pw-emp'),
        altCapEmp: document.getElementById('set-alt-cap-emp'),
        altCapWrg: document.getElementById('set-alt-cap-wrg'),
        altSuccess: document.getElementById('set-alt-success'),

        // Role: Karyawan
        karOptTitle: document.getElementById('set-kar-opt-title'),
        karOptSub: document.getElementById('set-kar-opt-sub'),
        karThmTitle: document.getElementById('set-kar-thm-title'),
        karThmSub: document.getElementById('set-kar-thm-sub'),
        karThmUrl: document.getElementById('set-kar-thm-url'),
        karIcon: document.getElementById('set-kar-icon'),
        karCssBg: document.getElementById('set-kar-css-bg'),
        karCssInp: document.getElementById('set-kar-css-inp'),
        karCssChk: document.getElementById('set-kar-css-chk'),
        karCssBtn: document.getElementById('set-kar-css-btn'),

        // Role: Admin
        admOptTitle: document.getElementById('set-adm-opt-title'),
        admOptSub: document.getElementById('set-adm-opt-sub'),
        admThmTitle: document.getElementById('set-adm-thm-title'),
        admThmSub: document.getElementById('set-adm-thm-sub'),
        admThmUrl: document.getElementById('set-adm-thm-url'),
        admIcon: document.getElementById('set-adm-icon'),
        admCssBg: document.getElementById('set-adm-css-bg'),
        admCssInp: document.getElementById('set-adm-css-inp'),
        admCssChk: document.getElementById('set-adm-css-chk'),
        admCssBtn: document.getElementById('set-adm-css-btn')
    };

    const menuContainer = document.getElementById('nav-menu-list-container');
    const btnAddMenu = document.getElementById('btn-add-nav-menu');

    // 2. Tembak Data Static
    if(inputs.drawer1) inputs.drawer1.value = mobileDrawerData.brand_text_1 || "";
    if(inputs.drawer2) inputs.drawer2.value = mobileDrawerData.brand_text_2 || "";
    if(inputs.loginLabel) inputs.loginLabel.value = btnLoginData.label || "";
    if(inputs.dlLabel) inputs.dlLabel.value = btnDownloadData.label || "";
    if(inputs.dlTarget) inputs.dlTarget.value = btnDownloadData.target || "";

    // Tembak Data Modal Login
    if(inputs.modOptTitle) inputs.modOptTitle.value = loginModalData.options?.title || "";
    if(inputs.modOptSub) inputs.modOptSub.value = loginModalData.options?.subtitle || "";
    
    if(inputs.modEmLbl) inputs.modEmLbl.value = loginModalData.form?.email_label || "";
    if(inputs.modEmPh) inputs.modEmPh.value = loginModalData.form?.email_placeholder || "";
    if(inputs.modPwLbl) inputs.modPwLbl.value = loginModalData.form?.password_label || "";
    if(inputs.modPwPh) inputs.modPwPh.value = loginModalData.form?.password_placeholder || "";
    if(inputs.modCapLbl) inputs.modCapLbl.value = loginModalData.form?.captcha_label || "";
    if(inputs.modCapPh) inputs.modCapPh.value = loginModalData.form?.captcha_placeholder || "";
    if(inputs.modRemTxt) inputs.modRemTxt.value = loginModalData.form?.remember_text || "";
    if(inputs.modLoadTxt) inputs.modLoadTxt.value = loginModalData.form?.loading_text || "";
    if(inputs.modSubTxt) inputs.modSubTxt.value = loginModalData.form?.submit_text || "";
    if(inputs.modBackTxt) inputs.modBackTxt.value = loginModalData.form?.back_text || "";

    // Alerts
    if(inputs.altEmEmp) inputs.altEmEmp.value = loginModalData.form?.alerts?.email_empty || "";
    if(inputs.altEmInv) inputs.altEmInv.value = loginModalData.form?.alerts?.email_invalid || "";
    if(inputs.altPwEmp) inputs.altPwEmp.value = loginModalData.form?.alerts?.password_empty || "";
    if(inputs.altCapEmp) inputs.altCapEmp.value = loginModalData.form?.alerts?.captcha_empty || "";
    if(inputs.altCapWrg) inputs.altCapWrg.value = loginModalData.form?.alerts?.captcha_wrong || "";
    if(inputs.altSuccess) inputs.altSuccess.value = loginModalData.form?.alerts?.success || "";

    // Karyawan Role
    if(inputs.karOptTitle) inputs.karOptTitle.value = loginModalData.options?.karyawan?.title || "";
    if(inputs.karOptSub) inputs.karOptSub.value = loginModalData.options?.karyawan?.subtitle || "";
    if(inputs.karThmTitle) inputs.karThmTitle.value = loginModalData.form?.themes?.karyawan?.title || "";
    if(inputs.karThmSub) inputs.karThmSub.value = loginModalData.form?.themes?.karyawan?.subtitle || "";
    if(inputs.karThmUrl) inputs.karThmUrl.value = loginModalData.form?.themes?.karyawan?.redirect_url || "";
    if(inputs.karIcon) inputs.karIcon.value = loginModalData.options?.karyawan?.icon || loginModalData.form?.themes?.karyawan?.icon || "";
    if(inputs.karCssBg) inputs.karCssBg.value = loginModalData.form?.themes?.karyawan?.css_icon_bg || "";
    if(inputs.karCssInp) inputs.karCssInp.value = loginModalData.form?.themes?.karyawan?.css_input || "";
    if(inputs.karCssChk) inputs.karCssChk.value = loginModalData.form?.themes?.karyawan?.css_checkbox || "";
    if(inputs.karCssBtn) inputs.karCssBtn.value = loginModalData.form?.themes?.karyawan?.css_btn || "";

    // Admin Role
    if(inputs.admOptTitle) inputs.admOptTitle.value = loginModalData.options?.admin?.title || "";
    if(inputs.admOptSub) inputs.admOptSub.value = loginModalData.options?.admin?.subtitle || "";
    if(inputs.admThmTitle) inputs.admThmTitle.value = loginModalData.form?.themes?.admin?.title || "";
    if(inputs.admThmSub) inputs.admThmSub.value = loginModalData.form?.themes?.admin?.subtitle || "";
    if(inputs.admThmUrl) inputs.admThmUrl.value = loginModalData.form?.themes?.admin?.redirect_url || "";
    if(inputs.admIcon) inputs.admIcon.value = loginModalData.options?.admin?.icon || loginModalData.form?.themes?.admin?.icon || "";
    if(inputs.admCssBg) inputs.admCssBg.value = loginModalData.form?.themes?.admin?.css_icon_bg || "";
    if(inputs.admCssInp) inputs.admCssInp.value = loginModalData.form?.themes?.admin?.css_input || "";
    if(inputs.admCssChk) inputs.admCssChk.value = loginModalData.form?.themes?.admin?.css_checkbox || "";
    if(inputs.admCssBtn) inputs.admCssBtn.value = loginModalData.form?.themes?.admin?.css_btn || "";


    // 3. Logic Render List Menu Dinamis (Tetap sama)
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

    renderMenuList();

    // 4. Event Listener Dinamis untuk Array Menu (Tetap Sama)
    if(menuContainer) {
        menuContainer.addEventListener('input', (e) => {
            if(e.target.classList.contains('nav-menu-input')) {
                const idx = e.target.getAttribute('data-idx');
                const field = e.target.getAttribute('data-field');
                navMenuArr[idx][field] = e.target.value;
                if(field === 'icon') {
                    const iconDisplay = e.target.previousElementSibling.querySelector('i');
                    if(iconDisplay) iconDisplay.className = `fa-solid ${e.target.value}`;
                }
            }
        });
        menuContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-remove-nav');
            if(btn) {
                const idx = btn.getAttribute('data-idx');
                navMenuArr.splice(idx, 1);
                renderMenuList();
            }
        });
    }

    if(btnAddMenu) {
        btnAddMenu.addEventListener('click', () => {
            navMenuArr.push({ label: "Menu Baru", target: "hero", icon: "fa-star" });
            renderMenuList();
            setTimeout(() => { menuContainer.scrollTop = menuContainer.scrollHeight; }, 100);
        });
    }

    // 5. Daftarkan Fungsi Save ke Tombol Global Navbar CMS
    window.activeCmsSaveHandler = () => {
        
        // Memastikan kerangka objek ada
        if (!loginModalData.options) loginModalData.options = {};
        if (!loginModalData.options.karyawan) loginModalData.options.karyawan = {};
        if (!loginModalData.options.admin) loginModalData.options.admin = {};
        
        if (!loginModalData.form) loginModalData.form = {};
        if (!loginModalData.form.alerts) loginModalData.form.alerts = {};
        if (!loginModalData.form.themes) loginModalData.form.themes = {};
        if (!loginModalData.form.themes.karyawan) loginModalData.form.themes.karyawan = {};
        if (!loginModalData.form.themes.admin) loginModalData.form.themes.admin = {};

        // Bungkus data options utama
        loginModalData.options.title = inputs.modOptTitle.value;
        loginModalData.options.subtitle = inputs.modOptSub.value;
        
        // Bungkus form umum
        loginModalData.form.email_label = inputs.modEmLbl.value;
        loginModalData.form.email_placeholder = inputs.modEmPh.value;
        loginModalData.form.password_label = inputs.modPwLbl.value;
        loginModalData.form.password_placeholder = inputs.modPwPh.value;
        loginModalData.form.captcha_label = inputs.modCapLbl.value;
        loginModalData.form.captcha_placeholder = inputs.modCapPh.value;
        loginModalData.form.remember_text = inputs.modRemTxt.value;
        loginModalData.form.loading_text = inputs.modLoadTxt.value;
        loginModalData.form.submit_text = inputs.modSubTxt.value;
        loginModalData.form.back_text = inputs.modBackTxt.value;

        // Bungkus alerts
        loginModalData.form.alerts.email_empty = inputs.altEmEmp.value;
        loginModalData.form.alerts.email_invalid = inputs.altEmInv.value;
        loginModalData.form.alerts.password_empty = inputs.altPwEmp.value;
        loginModalData.form.alerts.captcha_empty = inputs.altCapEmp.value;
        loginModalData.form.alerts.captcha_wrong = inputs.altCapWrg.value;
        loginModalData.form.alerts.success = inputs.altSuccess.value;

        // Bungkus role karyawan (Options & Themes)
        loginModalData.options.karyawan.title = inputs.karOptTitle.value;
        loginModalData.options.karyawan.subtitle = inputs.karOptSub.value;
        loginModalData.options.karyawan.icon = inputs.karIcon.value; // icon disamakan dgn yg di form themes
        
        loginModalData.form.themes.karyawan.title = inputs.karThmTitle.value;
        loginModalData.form.themes.karyawan.subtitle = inputs.karThmSub.value;
        loginModalData.form.themes.karyawan.redirect_url = inputs.karThmUrl.value;
        loginModalData.form.themes.karyawan.icon = inputs.karIcon.value;
        loginModalData.form.themes.karyawan.css_icon_bg = inputs.karCssBg.value;
        loginModalData.form.themes.karyawan.css_input = inputs.karCssInp.value;
        loginModalData.form.themes.karyawan.css_checkbox = inputs.karCssChk.value;
        loginModalData.form.themes.karyawan.css_btn = inputs.karCssBtn.value;

        // Bungkus role admin (Options & Themes)
        loginModalData.options.admin.title = inputs.admOptTitle.value;
        loginModalData.options.admin.subtitle = inputs.admOptSub.value;
        loginModalData.options.admin.icon = inputs.admIcon.value;
        
        loginModalData.form.themes.admin.title = inputs.admThmTitle.value;
        loginModalData.form.themes.admin.subtitle = inputs.admThmSub.value;
        loginModalData.form.themes.admin.redirect_url = inputs.admThmUrl.value;
        loginModalData.form.themes.admin.icon = inputs.admIcon.value;
        loginModalData.form.themes.admin.css_icon_bg = inputs.admCssBg.value;
        loginModalData.form.themes.admin.css_input = inputs.admCssInp.value;
        loginModalData.form.themes.admin.css_checkbox = inputs.admCssChk.value;
        loginModalData.form.themes.admin.css_btn = inputs.admCssBtn.value;

        // Update state utama
        window.State.data.mobile_drawer = { brand_text_1: inputs.drawer1.value, brand_text_2: inputs.drawer2.value };
        window.State.data.button_login = { label: inputs.loginLabel.value, target: "login-popup" };
        window.State.data.button_download = { label: inputs.dlLabel.value, target: inputs.dlTarget.value };
        window.State.data.nav_menu = navMenuArr;
        window.State.data.login_modal = loginModalData;

        // Siapkan Payload buat dilempar ke PHP
        const formData = new FormData();
        formData.append('mobile_drawer', JSON.stringify(window.State.data.mobile_drawer));
        formData.append('button_login', JSON.stringify(window.State.data.button_login));
        formData.append('button_download', JSON.stringify(window.State.data.button_download));
        formData.append('nav_menu', JSON.stringify(window.State.data.nav_menu));
        formData.append('login_modal', JSON.stringify(window.State.data.login_modal));

        const btnSave = document.getElementById('btn-save-cms');
        const originalHTML = btnSave.innerHTML;
        btnSave.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...`;
        btnSave.disabled = true;

        // Tembak ke API
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