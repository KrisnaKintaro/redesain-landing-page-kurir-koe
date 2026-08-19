async function renderTestimonialSetting() {
    return await fetchHTML('./components/cms_page/testimonial_setting/testimonial_setting.html');
}

function initTestimonialSettingLogic() {
    console.log("[CMS Module] Testimonial Form Ready.");
    
    // Ambil copy dari state (Clone array items)
    const state = window.State.data || {};
    const testiData = state.testimonial || {};
    let testiItemsArr = JSON.parse(JSON.stringify(testiData.items || []));

    // Mapping DOM Elements (Header)
    const inputs = {
        tagline: document.getElementById('set-testi-tagline'),
        title: document.getElementById('set-testi-title'),
        desc: document.getElementById('set-testi-desc')
    };

    const listContainer = document.getElementById('testi-list-container');
    const btnAdd = document.getElementById('btn-add-testi-item');

    // 1. Tembak Data Static Header
    if(inputs.tagline) inputs.tagline.value = testiData.tagline || "";
    if(inputs.title) inputs.title.value = testiData.title || "";
    if(inputs.desc) inputs.desc.value = testiData.description || "";

    // 2. Logic Render List Item Dinamis
    const renderTestiList = () => {
        if(!listContainer) return;
        listContainer.innerHTML = '';

        if(testiItemsArr.length === 0) {
            listContainer.innerHTML = `<div class="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">Belum ada ulasan, tambahkan satu cuy!</div>`;
            return;
        }

        testiItemsArr.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = "flex items-start gap-3 p-5 bg-white border border-gray-200 rounded-xl shadow-sm relative group";
            
            row.innerHTML = `
                <div class="flex flex-col gap-4 flex-1">
                    
                    <div class="grid grid-cols-12 gap-3">
                        <div class="col-span-12 md:col-span-8">
                            <label class="block text-[10px] font-bold text-gray-500 mb-1">Nama Pelanggan/Mitra</label>
                            <input type="text" data-idx="${index}" data-field="name" value="${item.name}" class="testi-item-input w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-gray-800 font-bold" placeholder="Budi Santoso">
                        </div>
                        <div class="col-span-8 md:col-span-4">
                            <label class="block text-[10px] font-bold text-gray-500 mb-1">Role / Status</label>
                            <input type="text" data-idx="${index}" data-field="role" value="${item.role}" class="testi-item-input w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-gray-800" placeholder="Mitra Merchant">
                        </div>
                    </div>

                    <div>
                        <label class="block text-[10px] font-bold text-gray-500 mb-1">Teks Ulasan</label>
                        <textarea data-idx="${index}" data-field="text" rows="3" class="testi-item-input w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-gray-800 resize-none" placeholder="Semenjak pakai Kurir Koe...">${item.text}</textarea>
                    </div>

                    <div class="grid grid-cols-12 gap-3">
                        <div class="col-span-12 md:col-span-9">
                            <label class="block text-[10px] font-bold text-gray-500 mb-1">URL Avatar / Foto (Link Web)</label>
                            <div class="flex items-center gap-2">
                                <img src="${item.avatar}" onerror="this.src='https://ui-avatars.com/api/?name=User&background=random'" class="w-9 h-9 rounded-full object-cover shrink-0 border border-gray-200 shadow-sm prev-avatar">
                                <input type="text" data-idx="${index}" data-field="avatar" value="${item.avatar}" class="testi-item-input w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-primary/20 outline-none text-gray-800 font-mono">
                            </div>
                        </div>
                        <div class="col-span-4 md:col-span-3">
                            <label class="block text-[10px] font-bold text-gray-500 mb-1">Rating (1-5)</label>
                            <input type="number" data-idx="${index}" data-field="rating" min="1" max="5" value="${item.rating}" class="testi-item-input w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-center focus:ring-2 focus:ring-primary/20 outline-none text-accent font-extrabold">
                        </div>
                    </div>

                </div>
                <!-- Tombol Hapus -->
                <button type="button" data-idx="${index}" class="btn-remove-testi w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors shrink-0">
                    <i class="fa-solid fa-trash-can text-sm"></i>
                </button>
            `;
            listContainer.appendChild(row);
        });
    };

    renderTestiList();

    // 3. Event Listener (Event Delegation)
    if(listContainer) {
        listContainer.addEventListener('input', (e) => {
            if(e.target.classList.contains('testi-item-input')) {
                const idx = e.target.getAttribute('data-idx');
                const field = e.target.getAttribute('data-field');
                
                // Khusus rating, paksa nilainya jadi integer
                if(field === 'rating') {
                    let val = parseInt(e.target.value);
                    if(val > 5) val = 5;
                    if(val < 1) val = 1;
                    testiItemsArr[idx][field] = val;
                } else {
                    testiItemsArr[idx][field] = e.target.value;
                }
                
                // Live preview URL Avatar
                if(field === 'avatar') {
                    const imgDisplay = e.target.previousElementSibling;
                    if(imgDisplay) imgDisplay.src = e.target.value;
                }
            }
        });

        listContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-remove-testi');
            if(btn) {
                const idx = btn.getAttribute('data-idx');
                testiItemsArr.splice(idx, 1);
                renderTestiList();
            }
        });
    }

    if(btnAdd) {
        btnAdd.addEventListener('click', () => {
            testiItemsArr.push({ 
                name: "Klien Baru", 
                role: "Pelanggan", 
                text: "Ulasan yang sangat luar biasa...",
                avatar: "https://ui-avatars.com/api/?name=Klien+Baru&background=random",
                rating: 5
            });
            renderTestiList();
            setTimeout(() => { listContainer.scrollTop = listContainer.scrollHeight; }, 100);
        });
    }

    // 4. Daftarkan Fungsi Save
    window.activeCmsSaveHandler = () => {
        window.State.data.testimonial = {
            tagline: inputs.tagline.value,
            title: inputs.title.value,
            description: inputs.desc.value,
            items: testiItemsArr
        };

        const formData = new FormData();
        formData.append('testimonial', JSON.stringify(window.State.data.testimonial));

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