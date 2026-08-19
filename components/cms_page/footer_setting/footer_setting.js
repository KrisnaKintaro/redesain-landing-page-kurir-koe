async function renderFooterSetting() {
    return await fetchHTML('./components/cms_page/footer_setting/footer_setting.html');
}

function initFooterSettingLogic() {
    console.log("[CMS Module] Footer Setting Form Ready.");
    
    // Ambil copy data dari state
    const state = window.State.data || {};
    
    let ftBrand = JSON.parse(JSON.stringify(state.footer_brand || { socials: [] }));
    let linkGroupsArr = JSON.parse(JSON.stringify(state.link_groups || []));
    let ftContact = JSON.parse(JSON.stringify(state.footer_contact || { whatsapp: {}, email: {} }));
    let ftMaps = JSON.parse(JSON.stringify(state.footer_maps || {}));
    let ftCopy = JSON.parse(JSON.stringify(state.footer_copyright || { links: [] }));

    // Mapping DOM (Basic Inputs)
    const inputs = {
        // Brand
        desc: document.getElementById('set-ft-desc'),
        imgPrev: document.getElementById('set-ft-img-preview'),
        imgInput: document.getElementById('set-ft-img-input'),
        imgDrop: document.getElementById('set-ft-drop-zone'),
        // Contact
        ctTitle: document.getElementById('set-ft-ct-title'),
        waLbl: document.getElementById('set-ft-wa-lbl'),
        waNum: document.getElementById('set-ft-wa-num'),
        waDisp: document.getElementById('set-ft-wa-disp'),
        emLbl: document.getElementById('set-ft-em-lbl'),
        emAddr: document.getElementById('set-ft-em-addr'),
        emSubj: document.getElementById('set-ft-em-subj'),
        // Maps
        mapUrl: document.getElementById('set-ft-map-url'),
        mapLbl: document.getElementById('set-ft-map-lbl'),
        mapAddr: document.getElementById('set-ft-map-addr'),
        // Copyright
        copyTxt: document.getElementById('set-ft-copy-txt')
    };

    // Tembak Data Static
    if(inputs.desc) inputs.desc.value = ftBrand.description || "";
    if(inputs.imgPrev && ftBrand.logo_url) inputs.imgPrev.src = ftBrand.logo_url;
    
    if(inputs.ctTitle) inputs.ctTitle.value = ftContact.title || "";
    if(inputs.waLbl) inputs.waLbl.value = ftContact.whatsapp?.label || "";
    if(inputs.waNum) inputs.waNum.value = ftContact.whatsapp?.number || "";
    if(inputs.waDisp) inputs.waDisp.value = ftContact.whatsapp?.display || "";
    if(inputs.emLbl) inputs.emLbl.value = ftContact.email?.label || "";
    if(inputs.emAddr) inputs.emAddr.value = ftContact.email?.address || "";
    if(inputs.emSubj) inputs.emSubj.value = ftContact.email?.subject || "";

    if(inputs.mapUrl) inputs.mapUrl.value = ftMaps.embed_url || "";
    if(inputs.mapLbl) inputs.mapLbl.value = ftMaps.label || "";
    if(inputs.mapAddr) inputs.mapAddr.value = ftMaps.address || "";

    if(inputs.copyTxt) inputs.copyTxt.value = ftCopy.text || "";

    // ==========================================
    // RENDER: Socials (Brand)
    // ==========================================
    const socContainer = document.getElementById('soc-list-container');
    const renderSocials = () => {
        if(!socContainer) return;
        socContainer.innerHTML = '';
        if(!ftBrand.socials) ftBrand.socials = [];
        
        ftBrand.socials.forEach((soc, idx) => {
            socContainer.innerHTML += `
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                        <i class="fa-brands ${soc.icon} text-gray-600"></i>
                    </div>
                    <input type="text" data-idx="${idx}" data-field="icon" value="${soc.icon}" class="soc-input w-24 bg-white border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:border-primary font-mono" placeholder="fa-icon">
                    <input type="text" data-idx="${idx}" data-field="link" value="${soc.link}" class="soc-input flex-1 bg-white border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:border-primary" placeholder="https://...">
                    <button type="button" data-idx="${idx}" class="btn-rm-soc w-8 h-8 rounded bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center shrink-0"><i class="fa-solid fa-xmark"></i></button>
                </div>
            `;
        });
    };
    renderSocials();
    document.getElementById('btn-add-soc')?.addEventListener('click', () => {
        ftBrand.socials.push({ icon: "fa-instagram", link: "https://" });
        renderSocials();
    });

    // ==========================================
    // RENDER: Link Groups (Nested Arrays)
    // ==========================================
    const groupsContainer = document.getElementById('link-groups-container');
    const renderLinkGroups = () => {
        if(!groupsContainer) return;
        groupsContainer.innerHTML = '';

        if(linkGroupsArr.length === 0) {
            groupsContainer.innerHTML = `<div class="text-center p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-xs">Belum ada grup link.</div>`;
            return;
        }

        linkGroupsArr.forEach((group, gIdx) => {
            let linksHTML = '';
            if(group.links && group.links.length > 0) {
                group.links.forEach((link, lIdx) => {
                    linksHTML += `
                        <div class="flex items-center gap-2 mb-2">
                            <input type="text" data-gidx="${gIdx}" data-lidx="${lIdx}" data-field="label" value="${link.label}" class="group-link-input w-1/3 bg-white border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:border-primary" placeholder="Label">
                            <input type="text" data-gidx="${gIdx}" data-lidx="${lIdx}" data-field="url" value="${link.url}" class="group-link-input flex-1 bg-white border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:border-primary" placeholder="URL Target">
                            <button type="button" data-gidx="${gIdx}" data-lidx="${lIdx}" class="btn-rm-group-link w-7 h-7 rounded bg-red-50 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center shrink-0"><i class="fa-solid fa-xmark text-[10px]"></i></button>
                        </div>
                    `;
                });
            } else {
                linksHTML = `<p class="text-[10px] text-gray-400 italic mb-2">Tidak ada link di grup ini.</p>`;
            }

            groupsContainer.innerHTML += `
                <div class="p-4 border border-blue-100 bg-blue-50/20 rounded-xl relative group">
                    <button type="button" data-gidx="${gIdx}" class="btn-rm-group absolute top-3 right-3 text-gray-300 hover:text-red-500"><i class="fa-solid fa-trash-can"></i></button>
                    
                    <label class="block text-[10px] font-bold text-gray-500 mb-1">Judul Grup</label>
                    <input type="text" data-gidx="${gIdx}" value="${group.title}" class="group-title-input w-2/3 bg-white border border-blue-200 rounded-md px-3 py-2 text-sm font-bold outline-none focus:border-primary mb-3">
                    
                    <div class="p-3 bg-white rounded-lg border border-gray-100">
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-[10px] font-bold text-gray-500">Daftar Link</span>
                            <button type="button" data-gidx="${gIdx}" class="btn-add-group-link text-[9px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-primary hover:text-white transition-colors"><i class="fa-solid fa-plus"></i> Link</button>
                        </div>
                        ${linksHTML}
                    </div>
                </div>
            `;
        });
    };
    renderLinkGroups();
    document.getElementById('btn-add-group')?.addEventListener('click', () => {
        linkGroupsArr.push({ title: "Grup Baru", links: [] });
        renderLinkGroups();
    });

    // ==========================================
    // RENDER: Copyright Links
    // ==========================================
    const copyContainer = document.getElementById('copy-links-container');
    const renderCopyLinks = () => {
        if(!copyContainer) return;
        copyContainer.innerHTML = '';
        if(!ftCopy.links) ftCopy.links = [];
        
        ftCopy.links.forEach((lnk, idx) => {
            copyContainer.innerHTML += `
                <div class="flex items-center gap-2">
                    <input type="text" data-idx="${idx}" data-field="label" value="${lnk.label}" class="copy-link-input w-1/2 bg-white border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:border-gray-400" placeholder="Label">
                    <input type="text" data-idx="${idx}" data-field="url" value="${lnk.url}" class="copy-link-input w-1/2 bg-white border border-gray-200 rounded px-2 py-1.5 text-xs outline-none focus:border-gray-400" placeholder="#/">
                    <button type="button" data-idx="${idx}" class="btn-rm-copy-link w-8 h-8 rounded bg-gray-100 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center shrink-0"><i class="fa-solid fa-xmark"></i></button>
                </div>
            `;
        });
    };
    renderCopyLinks();
    document.getElementById('btn-add-copy-link')?.addEventListener('click', () => {
        ftCopy.links.push({ label: "Aturan", url: "#/" });
        renderCopyLinks();
    });


    // ==========================================
    // EVENT DELEGATION (Semua Container)
    // ==========================================
    document.addEventListener('input', (e) => {
        // Socials
        if(e.target.classList.contains('soc-input')) {
            ftBrand.socials[e.target.dataset.idx][e.target.dataset.field] = e.target.value;
            if(e.target.dataset.field === 'icon') {
                const icon = e.target.previousElementSibling.querySelector('i');
                if(icon) icon.className = `fa-brands ${e.target.value} text-gray-600`;
            }
        }
        // Link Groups - Title
        if(e.target.classList.contains('group-title-input')) {
            linkGroupsArr[e.target.dataset.gidx].title = e.target.value;
        }
        // Link Groups - Links
        if(e.target.classList.contains('group-link-input')) {
            linkGroupsArr[e.target.dataset.gidx].links[e.target.dataset.lidx][e.target.dataset.field] = e.target.value;
        }
        // Copyright Links
        if(e.target.classList.contains('copy-link-input')) {
            ftCopy.links[e.target.dataset.idx][e.target.dataset.field] = e.target.value;
        }
    });

    document.addEventListener('click', (e) => {
        // Hapus Social
        if(e.target.closest('.btn-rm-soc')) {
            ftBrand.socials.splice(e.target.closest('.btn-rm-soc').dataset.idx, 1);
            renderSocials();
        }
        // Hapus Grup
        if(e.target.closest('.btn-rm-group')) {
            linkGroupsArr.splice(e.target.closest('.btn-rm-group').dataset.gidx, 1);
            renderLinkGroups();
        }
        // Tambah Link ke Grup
        if(e.target.closest('.btn-add-group-link')) {
            const gIdx = e.target.closest('.btn-add-group-link').dataset.gidx;
            linkGroupsArr[gIdx].links.push({ label: "Link Baru", url: "#/" });
            renderLinkGroups();
        }
        // Hapus Link dari Grup
        if(e.target.closest('.btn-rm-group-link')) {
            const btn = e.target.closest('.btn-rm-group-link');
            linkGroupsArr[btn.dataset.gidx].links.splice(btn.dataset.lidx, 1);
            renderLinkGroups();
        }
        // Hapus Copyright Link
        if(e.target.closest('.btn-rm-copy-link')) {
            ftCopy.links.splice(e.target.closest('.btn-rm-copy-link').dataset.idx, 1);
            renderCopyLinks();
        }
    });

    // ==========================================
    // LOGIC UPLOAD LOGO FOOTER
    // ==========================================
    let pendingFtImage = null;
    const handleFtImgUpload = (file) => {
        if (!file || !file.type.startsWith('image/')) return alert("Harus file gambar!");
        pendingFtImage = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            inputs.imgPrev.src = e.target.result;
            inputs.imgPrev.classList.remove('opacity-50', 'group-hover:opacity-20');
            inputs.imgPrev.classList.add('opacity-100');
        };
        reader.readAsDataURL(file);
    };

    if (inputs.imgDrop && inputs.imgInput) {
        if (!window.hasFtDragProt) {
            ['dragover', 'drop'].forEach(evt => window.addEventListener(evt, e => e.preventDefault(), false));
            window.hasFtDragProt = true;
        }
        ['dragenter', 'dragover'].forEach(evt => inputs.imgInput.addEventListener(evt, (e) => {
            e.preventDefault(); e.stopPropagation();
            inputs.imgDrop.classList.add('drag-active-zone');
        }));
        ['dragleave', 'drop'].forEach(evt => inputs.imgInput.addEventListener(evt, (e) => {
            e.preventDefault(); e.stopPropagation();
            inputs.imgDrop.classList.remove('drag-active-zone');
        }));
        inputs.imgInput.addEventListener('drop', e => { if (e.dataTransfer.files[0]) handleFtImgUpload(e.dataTransfer.files[0]); });
        inputs.imgInput.addEventListener('change', e => { if (e.target.files[0]) handleFtImgUpload(e.target.files[0]); });
    }

    // ==========================================
    // DAFTARKAN FUNGSI SAVE
    // ==========================================
    window.activeCmsSaveHandler = () => {
        // Bungkus ulang data yang di-edit statis
        ftBrand.description = inputs.desc.value;
        ftBrand.logo_url = window.State.data.footer_brand?.logo_url || "./assets/images/logo_kurir_koe.webp"; // Pertahankan url lama sblm upload
        
        ftContact.title = inputs.ctTitle.value;
        ftContact.whatsapp.label = inputs.waLbl.value;
        ftContact.whatsapp.number = inputs.waNum.value;
        ftContact.whatsapp.display = inputs.waDisp.value;
        ftContact.email.label = inputs.emLbl.value;
        ftContact.email.address = inputs.emAddr.value;
        ftContact.email.subject = inputs.emSubj.value;

        ftMaps.embed_url = inputs.mapUrl.value;
        ftMaps.label = inputs.mapLbl.value;
        ftMaps.address = inputs.mapAddr.value;

        ftCopy.text = inputs.copyTxt.value;

        // Assign ke global state
        window.State.data.footer_brand = ftBrand;
        window.State.data.link_groups = linkGroupsArr;
        window.State.data.footer_contact = ftContact;
        window.State.data.footer_maps = ftMaps;
        window.State.data.footer_copyright = ftCopy;

        const formData = new FormData();
        formData.append('footer_brand', JSON.stringify(window.State.data.footer_brand));
        formData.append('link_groups', JSON.stringify(window.State.data.link_groups));
        formData.append('footer_contact', JSON.stringify(window.State.data.footer_contact));
        formData.append('footer_maps', JSON.stringify(window.State.data.footer_maps));
        formData.append('footer_copyright', JSON.stringify(window.State.data.footer_copyright));
        
        if (pendingFtImage) formData.append('footer_logo', pendingFtImage);

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
                
                if (result.footer_brand && inputs.imgPrev) {
                    window.State.data.footer_brand = result.footer_brand;
                    inputs.imgPrev.src = result.footer_brand.logo_url + '?v=' + Date.now();
                }
            } else throw new Error(result.message);
        })
        .catch(err => {
            alert("Gagal: " + err.message);
            btnSave.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Gagal`;
            btnSave.className = "anim-save-btn bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_5px_15px_rgba(239,68,68,0.3)] transition-all flex items-center gap-2";
        })
        .finally(() => {
            pendingFtImage = null;
            setTimeout(() => {
                btnSave.disabled = false;
                btnSave.innerHTML = originalHTML;
                btnSave.className = "anim-save-btn bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-[0_5px_15px_rgba(0,84,183,0.3)] hover:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2";
            }, 2000);
        });
    };
}