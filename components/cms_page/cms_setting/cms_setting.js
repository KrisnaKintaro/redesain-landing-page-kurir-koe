async function renderCmsSetting() {
    return await fetchHTML('./components/cms_page/cms_setting/cms_setting.html');
}

function initCmsSettingLogic() {
    console.log("[CMS Module] Global Settings Form Ready.");

    const fullState = window.State.data || {};
    const cmsData = fullState.cms_global || { theme: {}, developer: {} };

    const inputs = {
        title: document.getElementById('set-cms-title'),
        subtitle: document.getElementById('set-cms-subtitle'),
        font: document.getElementById('set-cms-font'),
        devName: document.getElementById('set-cms-dev-name'),
        devRole: document.getElementById('set-cms-dev-role'),
        primary: document.getElementById('set-cms-primary'),
        primaryHex: document.getElementById('hex-cms-primary'),
        accent: document.getElementById('set-cms-accent'),
        accentHex: document.getElementById('hex-cms-accent'),
        logoPrev: document.getElementById('set-cms-logo-preview'),
        logoInput: document.getElementById('set-cms-logo-input'),
        logoDrop: document.getElementById('set-cms-drop-zone'),
        logoName: document.getElementById('set-cms-file-name')
    };

    if (inputs.title) inputs.title.value = cmsData.brand_name || "";
    if (inputs.subtitle) inputs.subtitle.value = cmsData.subtitle || "";
    if (inputs.font) inputs.font.value = cmsData.font_family || "Inter";
    if (inputs.devName) inputs.devName.value = cmsData.developer?.name || "";
    if (inputs.devRole) inputs.devRole.value = cmsData.developer?.role || "";
    if (inputs.primary && inputs.primaryHex) {
        inputs.primary.value = cmsData.theme?.primary || "#0054B7";
        inputs.primaryHex.textContent = inputs.primary.value.toUpperCase();
    }
    if (inputs.accent && inputs.accentHex) {
        inputs.accent.value = cmsData.theme?.accent || "#FAD812";
        inputs.accentHex.textContent = inputs.accent.value.toUpperCase();
    }
    if (inputs.logoPrev) inputs.logoPrev.src = cmsData.logo_url || "";

    const updateCmsState = () => {
        if (!window.State.data) return; 
        if (!window.State.data.cms_global) window.State.data.cms_global = { theme: {}, developer: {} };

        window.State.data.cms_global.brand_name = inputs.title.value;
        window.State.data.cms_global.subtitle = inputs.subtitle.value;
        window.State.data.cms_global.font_family = inputs.font.value;
        window.State.data.cms_global.theme.primary = inputs.primary.value;
        window.State.data.cms_global.theme.accent = inputs.accent.value;
        window.State.data.cms_global.developer.name = inputs.devName.value;
        window.State.data.cms_global.developer.role = inputs.devRole.value;
    };

    [inputs.title, inputs.subtitle, inputs.font, inputs.devName, inputs.devRole].forEach(el => {
        el?.addEventListener('input', updateCmsState);
    });

    inputs.primary?.addEventListener('input', (e) => {
        inputs.primaryHex.textContent = e.target.value.toUpperCase();
        updateCmsState();
    });
    inputs.accent?.addEventListener('input', (e) => {
        inputs.accentHex.textContent = e.target.value.toUpperCase();
        updateCmsState();
    });

    let pendingLogoFile = null;

    const handleImageUpload = (file) => {
        if (!file || !file.type.startsWith('image/')) { 
            alert("Harus file gambar cuy!"); return; 
        }
        pendingLogoFile = file; 
        const reader = new FileReader();
        reader.onload = (e) => {
            inputs.logoPrev.src = e.target.result;
            inputs.logoName.innerHTML = `<i class="fa-solid fa-check"></i> ${file.name}`;
            inputs.logoName.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    };

    if (inputs.logoDrop && inputs.logoInput) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => inputs.logoDrop.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); }, false));
        ['dragenter', 'dragover'].forEach(evt => inputs.logoDrop.addEventListener(evt, () => inputs.logoDrop.classList.add('drag-active-zone'), false));
        ['dragleave', 'drop'].forEach(evt => inputs.logoDrop.addEventListener(evt, () => inputs.logoDrop.classList.remove('drag-active-zone'), false));
        inputs.logoDrop.addEventListener('drop', (e) => { if (e.dataTransfer.files.length) handleImageUpload(e.dataTransfer.files[0]); });
        inputs.logoInput.addEventListener('change', (e) => handleImageUpload(e.target.files[0]));
    }

    // ==============================================================
    // DAFTARKAN FUNGSI SIMPAN KE GLOBAL EVENT BUS
    // ==============================================================
    window.activeCmsSaveHandler = () => {
        if (!window.State.data || !window.State.data.cms_global) return;

        const formData = new FormData();
        formData.append('cms_global', JSON.stringify(window.State.data.cms_global));
        if (pendingLogoFile) formData.append('cms_logo', pendingLogoFile);

        const btnSave = document.getElementById('btn-save-cms');
        const originalHTML = btnSave.innerHTML;
        btnSave.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...`;
        btnSave.disabled = true;

        fetch('./server/save_cms.php', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(result => {
            if (result.status === 'success' || result.status === 'warning') {
                btnSave.innerHTML = `<i class="fa-solid fa-check"></i> Tersimpan!`;
                btnSave.className = "anim-save-btn bg-green-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_5px_15px_rgba(34,197,94,0.3)] transition-all flex items-center gap-2";
                
                // Update text sidebar secara instan
                const dTitle = document.getElementById('cms-brand-title');
                const dSub = document.getElementById('cms-brand-subtitle');
                const dDevName = document.getElementById('cms-dev-name');
                const dDevRole = document.getElementById('cms-dev-role');
                if(dTitle) dTitle.textContent = inputs.title.value;
                if(dSub) dSub.textContent = inputs.subtitle.value;
                if(dDevName) dDevName.textContent = inputs.devName.value;
                if(dDevRole) dDevRole.textContent = inputs.devRole.value;

            } else throw new Error(result.message);
        })
        .catch(err => {
            alert("Gagal Menyimpan: " + err.message);
            btnSave.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Gagal`;
            btnSave.className = "anim-save-btn bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_5px_15px_rgba(239,68,68,0.3)] transition-all flex items-center gap-2";
        })
        .finally(() => {
            pendingLogoFile = null; 
            setTimeout(() => {
                btnSave.disabled = false;
                btnSave.innerHTML = originalHTML;
                btnSave.className = "anim-save-btn bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_5px_15px_rgba(0,84,183,0.3)] hover:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2";
            }, 2000);
        });
    };
}