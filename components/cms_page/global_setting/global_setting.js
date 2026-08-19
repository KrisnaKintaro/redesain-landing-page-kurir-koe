async function renderGlobalSetting() {
    return await fetchHTML('./components/cms_page/global_setting/global_setting.html');
}

function initGlobalSettingLogic() {
    const state = window.State.data || {};
    const meta = state.global_meta || {};
    const theme = state.theme || {};

    const inputs = {
        nama: document.getElementById('set-gl-nama'),
        title: document.getElementById('set-gl-title'),
        desc: document.getElementById('set-gl-desc'),
        font: document.getElementById('set-gl-font'),
        primary: document.getElementById('set-gl-primary'),
        primaryHex: document.getElementById('hex-gl-primary'),
        accent: document.getElementById('set-gl-accent'),
        accentHex: document.getElementById('hex-gl-accent'),
        favPrev: document.getElementById('set-gl-fav-preview'),
        favInput: document.getElementById('set-gl-fav-input'),
        favDrop: document.getElementById('set-gl-drop-zone'),
        favName: document.getElementById('set-gl-file-name')
    };

    // 1. Tembak Data Awal
    if(inputs.nama) inputs.nama.value = state.nama_perusahaan || "";
    if(inputs.title) inputs.title.value = meta.title || "";
    if(inputs.desc) inputs.desc.value = meta.description || "";
    if(inputs.font) inputs.font.value = meta.font_family || "Poppins";
    if(inputs.primary) {
        inputs.primary.value = theme.primary || "#0054B7";
        inputs.primaryHex.textContent = inputs.primary.value.toUpperCase();
    }
    if(inputs.accent) {
        inputs.accent.value = theme.accent || "#FAD812";
        inputs.accentHex.textContent = inputs.accent.value.toUpperCase();
    }
    if(inputs.favPrev) inputs.favPrev.src = meta.favicon_url || "";

    // 2. Fungsi Update State Real-Time
    const updateState = () => {
        if(!window.State.data.global_meta) window.State.data.global_meta = {};
        if(!window.State.data.theme) window.State.data.theme = {};

        window.State.data.nama_perusahaan = inputs.nama.value;
        window.State.data.global_meta.title = inputs.title.value;
        window.State.data.global_meta.description = inputs.desc.value;
        
        // Auto-Generate URL Google Fonts
        const cleanFont = inputs.font.value.trim();
        window.State.data.global_meta.font_family = cleanFont;
        if(cleanFont) {
            const fontUrlName = cleanFont.replace(/\s+/g, '+');
            window.State.data.global_meta.font_url = `https://fonts.googleapis.com/css2?family=${fontUrlName}:wght@300;400;500;600;700&display=swap`;
        }

        window.State.data.theme.primary = inputs.primary.value;
        window.State.data.theme.accent = inputs.accent.value;
    };

    // 3. Pasang Event Listener (Teks & Warna)
    [inputs.nama, inputs.title, inputs.desc, inputs.font].forEach(el => {
        el?.addEventListener('input', updateState);
    });

    inputs.primary?.addEventListener('input', (e) => {
        inputs.primaryHex.textContent = e.target.value.toUpperCase();
        updateState();
    });
    
    inputs.accent?.addEventListener('input', (e) => {
        inputs.accentHex.textContent = e.target.value.toUpperCase();
        updateState();
    });

    // 4. Logic Drag & Drop Favicon (Versi Anti-Ngebug)
    let pendingFavicon = null;
    const handleFavUpload = (file) => {
        if (!file || !file.type.startsWith('image/')) return alert("Harus file gambar!");
        pendingFavicon = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            inputs.favPrev.src = e.target.result;
            inputs.favName.innerHTML = `<i class="fa-solid fa-check"></i> ${file.name}`;
            inputs.favName.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    };

    if (inputs.favDrop && inputs.favInput) {
        if (!window.hasFavDragProt) {
            ['dragover', 'drop'].forEach(evt => window.addEventListener(evt, e => e.preventDefault(), false));
            window.hasFavDragProt = true;
        }
        ['dragenter', 'dragover'].forEach(evt => inputs.favInput.addEventListener(evt, (e) => {
            e.preventDefault(); e.stopPropagation();
            inputs.favDrop.classList.add('drag-active-zone');
        }));
        ['dragleave', 'drop'].forEach(evt => inputs.favInput.addEventListener(evt, (e) => {
            e.preventDefault(); e.stopPropagation();
            inputs.favDrop.classList.remove('drag-active-zone');
        }));
        inputs.favInput.addEventListener('drop', e => { if (e.dataTransfer.files[0]) handleFavUpload(e.dataTransfer.files[0]); });
        inputs.favInput.addEventListener('change', e => { if (e.target.files[0]) handleFavUpload(e.target.files[0]); });
    }

    // ==============================================================
    // RESET WARNA TEMA LANDING PAGE KE DEFAULT
    // ==============================================================
    const DEFAULT_GL_THEME = { primary: '#0054B7', accent: '#FAD812' };
    document.getElementById('btn-reset-gl-theme')?.addEventListener('click', async () => {
        // Panggil modal konfirmasi bawaan global.js
        const confirmed = await showConfirmModal({
            title: 'Reset Warna Tema?',
            message: 'Warna Primary & Accent Landing Page bakal balik ke default, dan langsung disimpen ke server.',
            confirmText: 'Ya, Reset',
            cancelText: 'Batal',
            variant: 'danger'
        });
        
        if (!confirmed) return;

        // 1. Balikin value input & label hex ke default
        if (inputs.primary && inputs.primaryHex) {
            inputs.primary.value = DEFAULT_GL_THEME.primary;
            inputs.primaryHex.textContent = DEFAULT_GL_THEME.primary.toUpperCase();
        }
        if (inputs.accent && inputs.accentHex) {
            inputs.accent.value = DEFAULT_GL_THEME.accent;
            inputs.accentHex.textContent = DEFAULT_GL_THEME.accent.toUpperCase();
        }

        // 2. Sync ke state lokal (panggil fungsi updateState yang udah lu bikin)
        updateState();

        // 3. Langsung simpan ke server via handler
        if (typeof window.activeCmsSaveHandler === 'function') {
            window.activeCmsSaveHandler();
        }
    });

    // 5. Daftarkan Fungsi Save ke Tombol Global Navbar CMS
    window.activeCmsSaveHandler = () => {
        const formData = new FormData();
        // Stringify sesuai requirement save_cms.php
        formData.append('nama_perusahaan', JSON.stringify(window.State.data.nama_perusahaan));
        formData.append('theme', JSON.stringify(window.State.data.theme));
        formData.append('global_meta', JSON.stringify(window.State.data.global_meta));

        // Nembak file favicon kalau ada yang diupload
        if (pendingFavicon) formData.append('favicon_file', pendingFavicon);

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

                // Auto update preview kalau path favicon berubah
                if (result.global_meta && inputs.favPrev) {
                    window.State.data.global_meta = result.global_meta;
                    inputs.favPrev.src = result.global_meta.favicon_url + '?v=' + Date.now();
                }
            } else throw new Error(result.message);
        })
        .catch(err => {
            alert("Gagal: " + err.message);
            btnSave.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Gagal`;
            btnSave.className = "anim-save-btn bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_5px_15px_rgba(239,68,68,0.3)] transition-all flex items-center gap-2";
        })
        .finally(() => {
            pendingFavicon = null;
            setTimeout(() => {
                btnSave.disabled = false;
                btnSave.innerHTML = originalHTML;
                btnSave.className = "anim-save-btn bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_5px_15px_rgba(0,84,183,0.3)] hover:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2";
            }, 2000);
        });
    };
}