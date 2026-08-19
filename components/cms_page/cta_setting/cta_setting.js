async function renderCtaSetting() {
    return await fetchHTML('./components/cms_page/cta_setting/cta_setting.html');
}

function initCtaSettingLogic() {
    console.log("[CMS Module] CTA Section Form Ready.");
    
    const state = window.State.data || {};
    const ctaData = state.cta || {};
    const appStore = ctaData.app_store || {};
    const playStore = ctaData.play_store || {};

    // Mapping DOM Elements
    const inputs = {
        tagline: document.getElementById('set-cta-tagline'),
        title: document.getElementById('set-cta-title'),
        desc: document.getElementById('set-cta-desc'),
        
        appShow: document.getElementById('set-cta-app-show'),
        appSub: document.getElementById('set-cta-app-sub'),
        appLabel: document.getElementById('set-cta-app-label'),
        appLink: document.getElementById('set-cta-app-link'),

        playShow: document.getElementById('set-cta-play-show'),
        playSub: document.getElementById('set-cta-play-sub'),
        playLabel: document.getElementById('set-cta-play-label'),
        playLink: document.getElementById('set-cta-play-link'),
        
        imgPrev: document.getElementById('set-cta-img-preview'),
        imgInput: document.getElementById('set-cta-img-input'),
        imgDrop: document.getElementById('set-cta-drop-zone')
    };

    // 1. Tembak Data Awal
    if(inputs.tagline) inputs.tagline.value = ctaData.tagline || "";
    if(inputs.title) inputs.title.value = ctaData.title || "";
    if(inputs.desc) inputs.desc.value = ctaData.description || "";

    if(inputs.appShow) inputs.appShow.checked = appStore.show !== false; // Default true kalau undefined
    if(inputs.appSub) inputs.appSub.value = appStore.sub || "";
    if(inputs.appLabel) inputs.appLabel.value = appStore.label || "";
    if(inputs.appLink) inputs.appLink.value = appStore.link || "";

    if(inputs.playShow) inputs.playShow.checked = playStore.show !== false;
    if(inputs.playSub) inputs.playSub.value = playStore.sub || "";
    if(inputs.playLabel) inputs.playLabel.value = playStore.label || "";
    if(inputs.playLink) inputs.playLink.value = playStore.link || "";

    if(inputs.imgPrev && ctaData.image_url) inputs.imgPrev.src = ctaData.image_url;

    // 2. Logic Drag & Drop Image
    let pendingCtaImage = null;
    const handleCtaImgUpload = (file) => {
        if (!file || !file.type.startsWith('image/')) return alert("Harus file gambar!");
        pendingCtaImage = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            inputs.imgPrev.src = e.target.result;
            inputs.imgPrev.classList.remove('opacity-50', 'group-hover:opacity-20');
            inputs.imgPrev.classList.add('opacity-100');
        };
        reader.readAsDataURL(file);
    };

    if (inputs.imgDrop && inputs.imgInput) {
        if (!window.hasCtaDragProt) {
            ['dragover', 'drop'].forEach(evt => window.addEventListener(evt, e => e.preventDefault(), false));
            window.hasCtaDragProt = true;
        }
        ['dragenter', 'dragover'].forEach(evt => inputs.imgInput.addEventListener(evt, (e) => {
            e.preventDefault(); e.stopPropagation();
            inputs.imgDrop.classList.add('drag-active-zone');
        }));
        ['dragleave', 'drop'].forEach(evt => inputs.imgInput.addEventListener(evt, (e) => {
            e.preventDefault(); e.stopPropagation();
            inputs.imgDrop.classList.remove('drag-active-zone');
        }));
        inputs.imgInput.addEventListener('drop', e => { if (e.dataTransfer.files[0]) handleCtaImgUpload(e.dataTransfer.files[0]); });
        inputs.imgInput.addEventListener('change', e => { if (e.target.files[0]) handleCtaImgUpload(e.target.files[0]); });
    }

    // 3. Daftarkan Fungsi Save
    window.activeCmsSaveHandler = () => {
        window.State.data.cta = {
            tagline: inputs.tagline.value,
            title: inputs.title.value,
            description: inputs.desc.value,
            app_store: {
                show: inputs.appShow.checked,
                sub: inputs.appSub.value,
                label: inputs.appLabel.value,
                link: inputs.appLink.value
            },
            play_store: {
                show: inputs.playShow.checked,
                sub: inputs.playSub.value,
                label: inputs.playLabel.value,
                link: inputs.playLink.value
            },
            image_url: window.State.data.cta?.image_url || "./assets/images/cta_illustration.webp"
        };

        const formData = new FormData();
        formData.append('cta', JSON.stringify(window.State.data.cta));
        
        if (pendingCtaImage) formData.append('cta_image', pendingCtaImage);

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
                
                if (result.cta && inputs.imgPrev) {
                    window.State.data.cta = result.cta;
                    inputs.imgPrev.src = result.cta.image_url + '?v=' + Date.now();
                }
            } else throw new Error(result.message);
        })
        .catch(err => {
            alert("Gagal: " + err.message);
            btnSave.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Gagal`;
            btnSave.className = "anim-save-btn bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_5px_15px_rgba(239,68,68,0.3)] transition-all flex items-center gap-2";
        })
        .finally(() => {
            pendingCtaImage = null;
            setTimeout(() => {
                btnSave.disabled = false;
                btnSave.innerHTML = originalHTML;
                btnSave.className = "anim-save-btn bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_5px_15px_rgba(0,84,183,0.3)] hover:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2";
            }, 2000);
        });
    };
}