async function renderServicesSetting() {
    return await fetchHTML('./components/cms_page/services_setting/services_setting.html');
}

function initServicesSettingLogic() {
    console.log("[CMS Module] Services Section Form Ready.");
    
    // Ambil copy dari state (Clone biar aman saat diedit sebelum disave)
    const state = window.State.data || {};
    const servicesData = state.services || {};
    let srvItemsArr = JSON.parse(JSON.stringify(servicesData.items || []));

    // Mapping DOM Elements (Kiri)
    const inputs = {
        tagline: document.getElementById('set-srv-tagline'),
        title: document.getElementById('set-srv-title'),
        desc: document.getElementById('set-srv-desc')
    };

    // Mapping DOM Elements (Kanan)
    const listContainer = document.getElementById('srv-list-container');
    const btnAdd = document.getElementById('btn-add-srv-item');

    // 1. Tembak Data Static Header
    if(inputs.tagline) inputs.tagline.value = servicesData.tagline || "";
    if(inputs.title) inputs.title.value = servicesData.title || "";
    if(inputs.desc) inputs.desc.value = servicesData.description || "";

    // 2. Logic Render List Item Dinamis
    const renderSrvList = () => {
        if(!listContainer) return;
        listContainer.innerHTML = '';

        if(srvItemsArr.length === 0) {
            listContainer.innerHTML = `<div class="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">Belum ada layanan, tambahkan satu cuy!</div>`;
            return;
        }

        srvItemsArr.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = "flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm relative group";
            
            row.innerHTML = `
                <div class="flex flex-col gap-3 flex-1">
                    <div>
                        <label class="block text-[10px] font-bold text-gray-500 mb-1">Nama Layanan</label>
                        <input type="text" data-idx="${index}" data-field="title" value="${item.title}" class="srv-item-input w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-gray-800 font-bold" placeholder="Contoh: Instant Delivery">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-gray-500 mb-1">Deskripsi Singkat</label>
                        <textarea data-idx="${index}" data-field="desc" rows="2" class="srv-item-input w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-gray-800 resize-none" placeholder="Sampai dalam hitungan jam...">${item.desc}</textarea>
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-gray-500 mb-1">Class Icon</label>
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0 border border-blue-100">
                                <i class="fa-solid ${item.icon}"></i>
                            </div>
                            <input type="text" data-idx="${index}" data-field="icon" value="${item.icon}" class="srv-item-input w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-gray-800 font-mono text-xs" placeholder="fa-bolt">
                        </div>
                    </div>
                </div>
                <!-- Tombol Hapus -->
                <button type="button" data-idx="${index}" class="btn-remove-srv w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors shrink-0">
                    <i class="fa-solid fa-trash-can text-sm"></i>
                </button>
            `;
            listContainer.appendChild(row);
        });
    };

    renderSrvList();

    // 3. Event Listener (Event Delegation)
    if(listContainer) {
        // Nangkep perubahan input
        listContainer.addEventListener('input', (e) => {
            if(e.target.classList.contains('srv-item-input')) {
                const idx = e.target.getAttribute('data-idx');
                const field = e.target.getAttribute('data-field');
                srvItemsArr[idx][field] = e.target.value;
                
                // Live preview icon
                if(field === 'icon') {
                    const iconDisplay = e.target.previousElementSibling.querySelector('i');
                    if(iconDisplay) iconDisplay.className = `fa-solid ${e.target.value}`;
                }
            }
        });

        // Nangkep klik tombol hapus
        listContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-remove-srv');
            if(btn) {
                const idx = btn.getAttribute('data-idx');
                srvItemsArr.splice(idx, 1);
                renderSrvList();
            }
        });
    }

    // Nangkep klik tambah
    if(btnAdd) {
        btnAdd.addEventListener('click', () => {
            srvItemsArr.push({ title: "Layanan Baru", desc: "Deskripsi layanan baru Anda...", icon: "fa-star" });
            renderSrvList();
            setTimeout(() => { listContainer.scrollTop = listContainer.scrollHeight; }, 100);
        });
    }

    // 4. Daftarkan Fungsi Save
    window.activeCmsSaveHandler = () => {
        // Susun objek final
        window.State.data.services = {
            tagline: inputs.tagline.value,
            title: inputs.title.value,
            description: inputs.desc.value,
            items: srvItemsArr
        };

        const formData = new FormData();
        formData.append('services', JSON.stringify(window.State.data.services));

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