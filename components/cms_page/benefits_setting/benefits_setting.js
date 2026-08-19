async function renderBenefitsSetting() {
    return await fetchHTML('./components/cms_page/benefits_setting/benefits_setting.html');
}

function initBenefitsSettingLogic() {
    console.log("[CMS Module] Benefits Section Form Ready.");
    
    // Ambil copy dari state (Clone)
    const state = window.State.data || {};
    const benefitsData = state.benefits || {};
    let bnfItemsArr = JSON.parse(JSON.stringify(benefitsData.items || []));

    // Mapping DOM Elements (Header)
    const inputs = {
        tagline: document.getElementById('set-bnf-tagline'),
        title: document.getElementById('set-bnf-title'),
        desc: document.getElementById('set-bnf-desc')
    };

    // Mapping DOM Elements (List)
    const listContainer = document.getElementById('bnf-list-container');
    const btnAdd = document.getElementById('btn-add-bnf-item');

    // 1. Tembak Data Static Header
    if(inputs.tagline) inputs.tagline.value = benefitsData.tagline || "";
    if(inputs.title) inputs.title.value = benefitsData.title || "";
    if(inputs.desc) inputs.desc.value = benefitsData.description || "";

    // 2. Logic Render List Item Dinamis
    const renderBnfList = () => {
        if(!listContainer) return;
        listContainer.innerHTML = '';

        if(bnfItemsArr.length === 0) {
            listContainer.innerHTML = `<div class="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">Belum ada item, tambahkan satu cuy!</div>`;
            return;
        }

        bnfItemsArr.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = "flex items-start gap-3 p-5 bg-white border border-gray-200 rounded-xl shadow-sm relative group";
            
            row.innerHTML = `
                <div class="flex flex-col gap-4 flex-1">
                    <!-- Konten Teks & Icon -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div class="md:col-span-2">
                            <label class="block text-[10px] font-bold text-gray-500 mb-1">Judul Benefit</label>
                            <input type="text" data-idx="${index}" data-field="title" value="${item.title}" class="bnf-item-input w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-gray-800 font-bold" placeholder="Contoh: Gratis Jemput Paket">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-[10px] font-bold text-gray-500 mb-1">Deskripsi Singkat</label>
                            <textarea data-idx="${index}" data-field="desc" rows="2" class="bnf-item-input w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-gray-800 resize-none">${item.desc}</textarea>
                        </div>
                    </div>

                    <!-- Styling CSS -->
                    <div class="p-4 border border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                        <h4 class="text-[10px] font-bold text-primary uppercase mb-3">Styling Class (Tailwind)</h4>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 mb-1">Class Icon</label>
                                <div class="flex items-center gap-2">
                                    <div class="w-7 h-7 rounded-md bg-white text-gray-600 flex items-center justify-center shrink-0 border border-gray-200 shadow-sm">
                                        <i class="fa-solid ${item.icon}"></i>
                                    </div>
                                    <input type="text" data-idx="${index}" data-field="icon" value="${item.icon}" class="bnf-item-input w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-xs focus:ring-2 focus:ring-primary/20 outline-none text-gray-800 font-mono">
                                </div>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 mb-1">Text Color Class</label>
                                <input type="text" data-idx="${index}" data-field="color" value="${item.color}" class="bnf-item-input w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-xs focus:ring-2 focus:ring-primary/20 outline-none text-gray-800 font-mono">
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 mb-1">BG Color Class</label>
                                <input type="text" data-idx="${index}" data-field="bg" value="${item.bg}" class="bnf-item-input w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-xs focus:ring-2 focus:ring-primary/20 outline-none text-gray-800 font-mono">
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 mb-1">Hover Shadow Class</label>
                                <input type="text" data-idx="${index}" data-field="shadow_neon" value="${item.shadow_neon}" class="bnf-item-input w-full bg-white border border-gray-200 rounded-md px-2 py-1.5 text-xs focus:ring-2 focus:ring-primary/20 outline-none text-gray-800 font-mono">
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Tombol Hapus -->
                <button type="button" data-idx="${index}" class="btn-remove-bnf w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors shrink-0">
                    <i class="fa-solid fa-trash-can text-sm"></i>
                </button>
            `;
            listContainer.appendChild(row);
        });
    };

    renderBnfList();

    // 3. Event Listener (Event Delegation)
    if(listContainer) {
        listContainer.addEventListener('input', (e) => {
            if(e.target.classList.contains('bnf-item-input')) {
                const idx = e.target.getAttribute('data-idx');
                const field = e.target.getAttribute('data-field');
                bnfItemsArr[idx][field] = e.target.value;
                
                // Live preview icon
                if(field === 'icon') {
                    const iconDisplay = e.target.previousElementSibling.querySelector('i');
                    if(iconDisplay) iconDisplay.className = `fa-solid ${e.target.value}`;
                }
            }
        });

        listContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-remove-bnf');
            if(btn) {
                const idx = btn.getAttribute('data-idx');
                bnfItemsArr.splice(idx, 1);
                renderBnfList();
            }
        });
    }

    if(btnAdd) {
        btnAdd.addEventListener('click', () => {
            bnfItemsArr.push({ 
                title: "Benefit Baru", 
                desc: "Deskripsi benefit Anda...", 
                icon: "fa-star",
                color: "text-blue-500",
                bg: "bg-blue-50",
                shadow_neon: "hover:shadow-[0_15px_35px_-5px_rgba(59,130,246,0.4)]"
            });
            renderBnfList();
            setTimeout(() => { listContainer.scrollTop = listContainer.scrollHeight; }, 100);
        });
    }

    // 4. Daftarkan Fungsi Save
    window.activeCmsSaveHandler = () => {
        window.State.data.benefits = {
            tagline: inputs.tagline.value,
            title: inputs.title.value,
            description: inputs.desc.value,
            items: bnfItemsArr
        };

        const formData = new FormData();
        formData.append('benefits', JSON.stringify(window.State.data.benefits));

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