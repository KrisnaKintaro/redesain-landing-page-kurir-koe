async function renderPartnershipSetting() {
    return await fetchHTML('./components/cms_page/partnership_setting/partnership_setting.html');
}

function initPartnershipSettingLogic() {
    console.log("[CMS Module] Partnership Form Ready.");
    
    const state = window.State.data || {};
    const prtData = state.partnership || {};
    // Backward compatibility: handle if the array was saved as 'items' previously
    let prtOptionsArr = JSON.parse(JSON.stringify(prtData.options || prtData.items || []));

    // Mapping DOM Elements
    const inputs = {
        tagline: document.getElementById('set-prt-tagline'),
        title: document.getElementById('set-prt-title'),
        desc: document.getElementById('set-prt-desc'),
        action: document.getElementById('set-prt-action'),
        
        imgPrev: document.getElementById('set-prt-img-preview'),
        imgInput: document.getElementById('set-prt-img-input'),
        imgDrop: document.getElementById('set-prt-drop-zone')
    };

    const listContainer = document.getElementById('prt-list-container');
    const btnAdd = document.getElementById('btn-add-prt-opt');

    // 1. Tembak Data Static
    if(inputs.tagline) inputs.tagline.value = prtData.tagline || "";
    if(inputs.title) inputs.title.value = prtData.title || "";
    if(inputs.desc) inputs.desc.value = prtData.description || "";
    if(inputs.action) inputs.action.value = prtData.action_label || "";
    if(inputs.imgPrev && prtData.image_url) inputs.imgPrev.src = prtData.image_url;

    // 2. Logic Render List Item Dinamis
    const renderPrtList = () => {
        if(!listContainer) return;
        listContainer.innerHTML = '';

        if(prtOptionsArr.length === 0) {
            listContainer.innerHTML = `<div class="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">Belum ada opsi kemitraan, tambahkan satu cuy!</div>`;
            return;
        }

        prtOptionsArr.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = "flex items-start gap-3 p-5 bg-white border border-gray-200 rounded-xl shadow-sm relative group transition-all";
            
            row.innerHTML = `
                <div class="flex flex-col gap-4 flex-1">
                    
                    <!-- Basic Info -->
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
                        <div class="md:col-span-8">
                            <label class="block text-[10px] font-bold text-gray-500 mb-1">Judul Kemitraan</label>
                            <input type="text" data-idx="${index}" data-field="title" value="${item.title}" class="prt-item-input w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-gray-800 font-bold" placeholder="Contoh: Mitra Driver">
                        </div>
                        <div class="md:col-span-4">
                            <label class="block text-[10px] font-bold text-gray-500 mb-1">Class Icon</label>
                            <div class="flex items-center gap-2">
                                <div class="w-9 h-9 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0 border border-blue-100">
                                    <i class="fa-solid ${item.icon}"></i>
                                </div>
                                <input type="text" data-idx="${index}" data-field="icon" value="${item.icon}" class="prt-item-input w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-gray-800 font-mono text-xs">
                            </div>
                        </div>
                        <div class="md:col-span-12">
                            <label class="block text-[10px] font-bold text-gray-500 mb-1">Deskripsi Kemitraan</label>
                            <textarea data-idx="${index}" data-field="desc" rows="2" class="prt-item-input w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-gray-800 resize-none">${item.desc}</textarea>
                        </div>
                    </div>

                    <!-- Contact Options -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <!-- WA Panel -->
                        <div class="p-4 border border-green-200 rounded-lg bg-green-50/30 space-y-2">
                            <h5 class="text-[10px] font-bold text-green-600 mb-2 uppercase flex items-center gap-1.5"><i class="fa-brands fa-whatsapp text-sm"></i> WhatsApp</h5>
                            <div>
                                <label class="block text-[9px] font-bold text-gray-500 mb-1">Label Tombol</label>
                                <input type="text" data-idx="${index}" data-field="wa_label" value="${item.wa_label || 'WhatsApp'}" class="prt-item-input w-full bg-white border border-green-200 rounded-md px-2 py-1.5 text-xs focus:ring-2 focus:ring-green-500/20 outline-none text-gray-800">
                            </div>
                            <div>
                                <label class="block text-[9px] font-bold text-gray-500 mb-1">Nomor Tujuan</label>
                                <input type="text" data-idx="${index}" data-field="whatsapp" value="${item.whatsapp || ''}" class="prt-item-input w-full bg-white border border-green-200 rounded-md px-2 py-1.5 text-xs focus:ring-2 focus:ring-green-500/20 outline-none text-gray-800 font-mono">
                            </div>
                            <div>
                                <label class="block text-[9px] font-bold text-gray-500 mb-1">Teks Template Pesan</label>
                                <input type="text" data-idx="${index}" data-field="wa_text" value="${item.wa_text || ''}" class="prt-item-input w-full bg-white border border-green-200 rounded-md px-2 py-1.5 text-xs focus:ring-2 focus:ring-green-500/20 outline-none text-gray-800">
                            </div>
                        </div>

                        <!-- Email Panel -->
                        <div class="p-4 border border-red-200 rounded-lg bg-red-50/30 space-y-2">
                            <h5 class="text-[10px] font-bold text-red-500 mb-2 uppercase flex items-center gap-1.5"><i class="fa-solid fa-envelope text-sm"></i> Email</h5>
                            <div>
                                <label class="block text-[9px] font-bold text-gray-500 mb-1">Label Tombol</label>
                                <input type="text" data-idx="${index}" data-field="email_label" value="${item.email_label || 'Email'}" class="prt-item-input w-full bg-white border border-red-200 rounded-md px-2 py-1.5 text-xs focus:ring-2 focus:ring-red-500/20 outline-none text-gray-800">
                            </div>
                            <div>
                                <label class="block text-[9px] font-bold text-gray-500 mb-1">Email Tujuan</label>
                                <input type="text" data-idx="${index}" data-field="email" value="${item.email || ''}" class="prt-item-input w-full bg-white border border-red-200 rounded-md px-2 py-1.5 text-xs focus:ring-2 focus:ring-red-500/20 outline-none text-gray-800">
                            </div>
                            <div>
                                <label class="block text-[9px] font-bold text-gray-500 mb-1">Subject Email</label>
                                <input type="text" data-idx="${index}" data-field="email_subject" value="${item.email_subject || ''}" class="prt-item-input w-full bg-white border border-red-200 rounded-md px-2 py-1.5 text-xs focus:ring-2 focus:ring-red-500/20 outline-none text-gray-800">
                            </div>
                        </div>
                    </div>

                </div>
                
                <!-- Tombol Hapus -->
                <button type="button" data-idx="${index}" class="btn-remove-prt w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors shrink-0">
                    <i class="fa-solid fa-trash-can text-sm"></i>
                </button>
            `;
            listContainer.appendChild(row);
        });
    };

    renderPrtList();

    // 3. Event Listener List (Delegation)
    if(listContainer) {
        listContainer.addEventListener('input', (e) => {
            if(e.target.classList.contains('prt-item-input')) {
                const idx = e.target.getAttribute('data-idx');
                const field = e.target.getAttribute('data-field');
                prtOptionsArr[idx][field] = e.target.value;
                
                if(field === 'icon') {
                    const iconDisplay = e.target.previousElementSibling.querySelector('i');
                    if(iconDisplay) iconDisplay.className = `fa-solid ${e.target.value}`;
                }
            }
        });

        listContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-remove-prt');
            if(btn) {
                prtOptionsArr.splice(btn.getAttribute('data-idx'), 1);
                renderPrtList();
            }
        });
    }

    if(btnAdd) {
        btnAdd.addEventListener('click', () => {
            prtOptionsArr.push({ 
                title: "Opsi Baru", desc: "Deskripsi...", icon: "fa-star",
                whatsapp: "0812...", wa_text: "Halo", wa_label: "WhatsApp",
                email: "admin@domain.com", email_subject: "Daftar", email_label: "Email"
            });
            renderPrtList();
            setTimeout(() => { listContainer.scrollTop = listContainer.scrollHeight; }, 100);
        });
    }

    // 4. Logic Drag & Drop Image
    let pendingPrtImage = null;
    const handlePrtImgUpload = (file) => {
        if (!file || !file.type.startsWith('image/')) return alert("Harus file gambar!");
        pendingPrtImage = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            inputs.imgPrev.src = e.target.result;
            inputs.imgPrev.classList.remove('opacity-50', 'group-hover:opacity-20');
            inputs.imgPrev.classList.add('opacity-100');
        };
        reader.readAsDataURL(file);
    };

    if (inputs.imgDrop && inputs.imgInput) {
        if (!window.hasPrtDragProt) {
            ['dragover', 'drop'].forEach(evt => window.addEventListener(evt, e => e.preventDefault(), false));
            window.hasPrtDragProt = true;
        }
        ['dragenter', 'dragover'].forEach(evt => inputs.imgInput.addEventListener(evt, (e) => {
            e.preventDefault(); e.stopPropagation();
            inputs.imgDrop.classList.add('drag-active-zone');
        }));
        ['dragleave', 'drop'].forEach(evt => inputs.imgInput.addEventListener(evt, (e) => {
            e.preventDefault(); e.stopPropagation();
            inputs.imgDrop.classList.remove('drag-active-zone');
        }));
        inputs.imgInput.addEventListener('drop', e => { if (e.dataTransfer.files[0]) handlePrtImgUpload(e.dataTransfer.files[0]); });
        inputs.imgInput.addEventListener('change', e => { if (e.target.files[0]) handlePrtImgUpload(e.target.files[0]); });
    }

    // 5. Daftarkan Fungsi Save
    window.activeCmsSaveHandler = () => {
        window.State.data.partnership = {
            tagline: inputs.tagline.value,
            title: inputs.title.value,
            description: inputs.desc.value,
            action_label: inputs.action.value,
            options: prtOptionsArr,
            image_url: window.State.data.partnership?.image_url || "./assets/images/partnership_illustration.webp"
        };

        const formData = new FormData();
        formData.append('partnership', JSON.stringify(window.State.data.partnership));
        
        if (pendingPrtImage) formData.append('partnership_image', pendingPrtImage);

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
                
                if (result.partnership && inputs.imgPrev) {
                    window.State.data.partnership = result.partnership;
                    inputs.imgPrev.src = result.partnership.image_url + '?v=' + Date.now();
                }
            } else throw new Error(result.message);
        })
        .catch(err => {
            alert("Gagal: " + err.message);
            btnSave.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Gagal`;
            btnSave.className = "anim-save-btn bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_5px_15px_rgba(239,68,68,0.3)] transition-all flex items-center gap-2";
        })
        .finally(() => {
            pendingPrtImage = null;
            setTimeout(() => {
                btnSave.disabled = false;
                btnSave.innerHTML = originalHTML;
                btnSave.className = "anim-save-btn bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_5px_15px_rgba(0,84,183,0.3)] hover:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2";
            }, 2000);
        });
    };
}