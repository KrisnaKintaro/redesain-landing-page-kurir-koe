async function renderStatsSetting() {
    return await fetchHTML('./components/cms_page/stats_setting/stats_setting.html');
}

function initStatsSettingLogic() {
    console.log("[CMS Module] Stats Section Form Ready.");
    
    // Ambil copy dari state array stats
    const state = window.State.data || {};
    let statsArr = JSON.parse(JSON.stringify(state.stats || []));

    const container = document.getElementById('stats-list-container');
    const btnAdd = document.getElementById('btn-add-stat');

    // Helper: Fungsi ngebedah "10Jt+" jadi Angka "10" dan Satuan "Jt"
    const parseNilai = (str) => {
        const cleanStr = (str || "").replace(/\+$/, '').trim(); // Buang '+' di belakang
        const angka = cleanStr.replace(/[^0-9.]/g, ''); // Ambil angka & titik aja
        const satuan = cleanStr.replace(/[0-9.]/g, ''); // Ambil hurufnya aja
        return { angka, satuan };
    };

    // Helper: Build Options Dropdown (Biar rapi)
    const buildOptions = (selectedSatuan) => {
        const options = [
            { val: "", text: "(Tanpa Satuan)" },
            { val: "K", text: "K (Ribu)" },
            { val: "Jt", text: "Jt (Juta)" },
            { val: "M", text: "M (Miliar)" },
            { val: "T", text: "T (Triliun)" },
            { val: "Qd", text: "Qd (Quadrillion)" }, // Wkwkwk
            { val: "Gg", text: "Googol" } // Wkwkwk
        ];
        return options.map(opt => 
            `<option value="${opt.val}" ${selectedSatuan === opt.val ? 'selected' : ''}>${opt.text}</option>`
        ).join('');
    };

    // Fungsi Render List ke HTML
    const renderStatsList = () => {
        if(!container) return;
        container.innerHTML = '';

        if(statsArr.length === 0) {
            container.innerHTML = `<div class="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">Belum ada data statistik, tambahkan satu cuy!</div>`;
            return;
        }

        statsArr.forEach((item, index) => {
            const parsed = parseNilai(item.nilai);
            const row = document.createElement('div');
            row.className = "flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-xl shadow-sm relative group transition-all";
            
            row.innerHTML = `
                <div class="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                    <!-- Angka (Col 3) -->
                    <div class="md:col-span-3">
                        <label class="block text-[10px] font-bold text-gray-500 mb-1">Nilai Angka</label>
                        <input type="number" data-idx="${index}" data-field="angka" value="${parsed.angka}" class="stat-input-complex w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-gray-800 font-bold" placeholder="0">
                    </div>
                    
                    <!-- Dropdown Satuan (Col 3) -->
                    <div class="md:col-span-3">
                        <label class="block text-[10px] font-bold text-gray-500 mb-1">Satuan</label>
                        <select data-idx="${index}" data-field="satuan" class="stat-input-complex w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-gray-800 font-semibold cursor-pointer">
                            ${buildOptions(parsed.satuan)}
                        </select>
                    </div>

                    <!-- Label Teks (Col 6) -->
                    <div class="md:col-span-6">
                        <label class="block text-[10px] font-bold text-gray-500 mb-1">Label Deskripsi</label>
                        <input type="text" data-idx="${index}" data-field="label" value="${item.label}" class="stat-input-simple w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-gray-800 font-semibold" placeholder="Contoh: Paket Terkirim">
                    </div>

                    <!-- Class Icon (Col 12) -->
                    <div class="md:col-span-12">
                        <label class="block text-[10px] font-bold text-gray-500 mb-1">Class Icon (FontAwesome)</label>
                        <div class="flex items-center gap-2">
                            <div class="w-9 h-9 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0 border border-blue-100">
                                <i class="fa-solid ${item.icon}"></i>
                            </div>
                            <input type="text" data-idx="${index}" data-field="icon" value="${item.icon}" class="stat-input-simple w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-gray-800 font-mono text-xs" placeholder="fa-box-open">
                        </div>
                    </div>
                </div>

                <!-- Tombol Hapus -->
                <button type="button" data-idx="${index}" class="btn-remove-stat w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors shrink-0">
                    <i class="fa-solid fa-trash-can text-sm"></i>
                </button>
            `;
            container.appendChild(row);
        });
    };

    renderStatsList();

    // Event Delegation buat Input & Tombol Hapus
    if(container) {
        // Nangkep perubahan input sederhana (Label & Icon)
        container.addEventListener('input', (e) => {
            if(e.target.classList.contains('stat-input-simple')) {
                const idx = e.target.getAttribute('data-idx');
                const field = e.target.getAttribute('data-field');
                statsArr[idx][field] = e.target.value;
                
                // Update live preview icon
                if(field === 'icon') {
                    const iconDisplay = e.target.previousElementSibling.querySelector('i');
                    if(iconDisplay) iconDisplay.className = `fa-solid ${e.target.value}`;
                }
            }
        });

        // Nangkep perubahan Angka & Dropdown Satuan (Digabung & ditambah '+')
        container.addEventListener('change', (e) => {
            if(e.target.classList.contains('stat-input-complex')) {
                const idx = e.target.getAttribute('data-idx');
                
                // Cari elemen input angka dan select satuan di dalam row yang sama
                const row = e.target.closest('.flex.items-start');
                const angkaVal = row.querySelector('[data-field="angka"]').value.trim();
                const satuanVal = row.querySelector('[data-field="satuan"]').value;
                
                // Gabungin dan assign ke property "nilai"
                // Kalau angka kosong, jangan kasih plus
                statsArr[idx].nilai = angkaVal ? `${angkaVal}${satuanVal}+` : '';
            }
        });

        // Event Hapus
        container.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-remove-stat');
            if(btn) {
                const idx = btn.getAttribute('data-idx');
                statsArr.splice(idx, 1);
                renderStatsList();
            }
        });
    }

    // Event Tambah Stat Baru
    if(btnAdd) {
        btnAdd.addEventListener('click', () => {
            statsArr.push({ nilai: "0+", label: "Statistik Baru", icon: "fa-star" });
            renderStatsList();
            setTimeout(() => { container.scrollTop = container.scrollHeight; }, 100);
        });
    }

    // Daftarkan Fungsi Save
    window.activeCmsSaveHandler = () => {
        window.State.data.stats = statsArr; // Timpa array utama dengan yg baru

        const formData = new FormData();
        formData.append('stats', JSON.stringify(window.State.data.stats));

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