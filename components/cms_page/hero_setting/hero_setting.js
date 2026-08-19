async function renderHeroSetting() {
    return await fetchHTML('./components/cms_page/hero_setting/hero_setting.html');
}

function initHeroSettingLogic() {
    const state = window.State.data || {};
    const heroData = state.hero || {};
    
    // Fallback object biar ga undefined
    const btnPrimary = heroData.btn_primary || {};
    const btnSecondary = heroData.btn_secondary || {};
    const sp = heroData.social_proof || {};
    let avatarsArr = Array.isArray(sp.avatars) ? [...sp.avatars] : [];

    const inputs = {
        tagline: document.getElementById('set-hero-tagline'),
        title1: document.getElementById('set-hero-title1'),
        title2: document.getElementById('set-hero-title2'),
        desc: document.getElementById('set-hero-desc'),
        
        btn1Label: document.getElementById('set-hero-btn1-label'),
        btn1Target: document.getElementById('set-hero-btn1-target'),
        btn2Label: document.getElementById('set-hero-btn2-label'),
        btn2Target: document.getElementById('set-hero-btn2-target'),
        
        spText: document.getElementById('set-hero-sp-text'),
        spRating: document.getElementById('set-hero-sp-rating'),
        
        imgPrev: document.getElementById('set-hero-img-preview'),
        imgInput: document.getElementById('set-hero-img-input'),
        imgDrop: document.getElementById('set-hero-drop-zone')
    };

    const avatarContainer = document.getElementById('hero-avatars-container');
    const btnAddAvatar = document.getElementById('btn-add-hero-avatar');

    // 1. Tembak Data Text & Buttons
    if(inputs.tagline) inputs.tagline.value = heroData.tagline || "";
    if(inputs.title1) inputs.title1.value = heroData.title_1 || "";
    if(inputs.title2) inputs.title2.value = heroData.title_2 || "";
    if(inputs.desc) inputs.desc.value = heroData.description || "";
    
    if(inputs.btn1Label) inputs.btn1Label.value = btnPrimary.label || "";
    if(inputs.btn1Target) inputs.btn1Target.value = btnPrimary.target || "";
    if(inputs.btn2Label) inputs.btn2Label.value = btnSecondary.label || "";
    if(inputs.btn2Target) inputs.btn2Target.value = btnSecondary.target || "";
    
    if(inputs.spText) inputs.spText.value = sp.text || "";
    if(inputs.spRating) inputs.spRating.value = sp.rating || 5;
    if(inputs.imgPrev && heroData.image_url) inputs.imgPrev.src = heroData.image_url;

    // 2. Logic List Avatar Dinamis
    const renderAvatars = () => {
        if(!avatarContainer) return;
        avatarContainer.innerHTML = '';
        
        if(avatarsArr.length === 0) {
            avatarContainer.innerHTML = `<div class="text-center p-3 border border-dashed border-gray-200 rounded-lg text-gray-400 text-xs">Belum ada avatar.</div>`;
            return;
        }

        avatarsArr.forEach((url, index) => {
            const div = document.createElement('div');
            div.className = "flex items-center gap-2";
            div.innerHTML = `
                <img src="${url}" onerror="this.src='https://ui-avatars.com/api/?name=?'" class="w-8 h-8 rounded-full bg-gray-100 object-cover shrink-0 border border-gray-200">
                <input type="text" data-idx="${index}" value="${url}" class="avatar-input w-full bg-white border border-gray-200 rounded-md px-3 py-1.5 text-xs focus:ring-2 focus:ring-green-500/20 outline-none text-gray-700">
                <button type="button" data-idx="${index}" class="btn-remove-avatar w-8 h-8 rounded-md bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors shrink-0">
                    <i class="fa-solid fa-xmark text-sm"></i>
                </button>
            `;
            avatarContainer.appendChild(div);
        });
    };
    renderAvatars();

    // Event Handler Avatars
    if(avatarContainer) {
        avatarContainer.addEventListener('input', (e) => {
            if(e.target.classList.contains('avatar-input')) {
                const idx = e.target.getAttribute('data-idx');
                avatarsArr[idx] = e.target.value;
                // Live update gambar avatar-nya
                e.target.previousElementSibling.src = e.target.value;
            }
        });
        avatarContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-remove-avatar');
            if(btn) {
                avatarsArr.splice(btn.getAttribute('data-idx'), 1);
                renderAvatars();
            }
        });
    }

    if(btnAddAvatar) {
        btnAddAvatar.addEventListener('click', () => {
            avatarsArr.push("https://ui-avatars.com/api/?name=New&background=random");
            renderAvatars();
            setTimeout(() => { avatarContainer.scrollTop = avatarContainer.scrollHeight; }, 100);
        });
    }

    // 3. Logic Drag & Drop Image Hero
    let pendingHeroImage = null;
    const handleHeroImgUpload = (file) => {
        if (!file || !file.type.startsWith('image/')) return alert("Harus file gambar!");
        pendingHeroImage = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            inputs.imgPrev.src = e.target.result;
            inputs.imgPrev.classList.remove('opacity-50', 'group-hover:opacity-20');
            inputs.imgPrev.classList.add('opacity-100');
        };
        reader.readAsDataURL(file);
    };

    if (inputs.imgDrop && inputs.imgInput) {
        if (!window.hasHeroDragProt) {
            ['dragover', 'drop'].forEach(evt => window.addEventListener(evt, e => e.preventDefault(), false));
            window.hasHeroDragProt = true;
        }
        ['dragenter', 'dragover'].forEach(evt => inputs.imgInput.addEventListener(evt, (e) => {
            e.preventDefault(); e.stopPropagation();
            inputs.imgDrop.classList.add('drag-active-zone');
        }));
        ['dragleave', 'drop'].forEach(evt => inputs.imgInput.addEventListener(evt, (e) => {
            e.preventDefault(); e.stopPropagation();
            inputs.imgDrop.classList.remove('drag-active-zone');
        }));
        inputs.imgInput.addEventListener('drop', e => { if (e.dataTransfer.files[0]) handleHeroImgUpload(e.dataTransfer.files[0]); });
        inputs.imgInput.addEventListener('change', e => { if (e.target.files[0]) handleHeroImgUpload(e.target.files[0]); });
    }

    // 4. Daftarkan Fungsi Save
    window.activeCmsSaveHandler = () => {
        // Susun ulang object hero sesuai JSON
        window.State.data.hero = {
            tagline: inputs.tagline.value,
            title_1: inputs.title1.value,
            title_2: inputs.title2.value,
            description: inputs.desc.value,
            btn_primary: { label: inputs.btn1Label.value, target: inputs.btn1Target.value },
            btn_secondary: { label: inputs.btn2Label.value, target: inputs.btn2Target.value },
            social_proof: { 
                text: inputs.spText.value, 
                rating: parseInt(inputs.spRating.value) || 5, 
                avatars: avatarsArr 
            },
            // Pertahankan URL lama kalau ga upload baru
            image_url: window.State.data.hero?.image_url || "./assets/images/hero_illustration.webp"
        };

        const formData = new FormData();
        formData.append('hero', JSON.stringify(window.State.data.hero));
        
        if (pendingHeroImage) formData.append('hero_image', pendingHeroImage);

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
                
                if (result.hero && inputs.imgPrev) {
                    window.State.data.hero = result.hero;
                    inputs.imgPrev.src = result.hero.image_url + '?v=' + Date.now();
                }
            } else throw new Error(result.message);
        })
        .catch(err => {
            alert("Gagal: " + err.message);
            btnSave.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Gagal`;
            btnSave.className = "anim-save-btn bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_5px_15px_rgba(239,68,68,0.3)] transition-all flex items-center gap-2";
        })
        .finally(() => {
            pendingHeroImage = null;
            setTimeout(() => {
                btnSave.disabled = false;
                btnSave.innerHTML = originalHTML;
                btnSave.className = "anim-save-btn bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_5px_15px_rgba(0,84,183,0.3)] hover:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2";
            }, 2000);
        });
    };
}