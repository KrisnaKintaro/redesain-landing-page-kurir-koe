async function renderCmsPageMaster() {
    let html = await fetchHTML('./components/cms_page/cms_page_master.html');
    
    // 1. Ambil Data Global CMS dari State
    const data = window.State.get('cms_global') || {
        brand_name: "Kurir Koe",
        subtitle: "CMS Console",
        logo_url: "./assets/images/logo_cms_kurir_koe.webp",
        font_family: "Inter",
        theme: { primary: "#0054B7", accent: "#FAD812" },
        developer: { name: "Developer", role: "Super Admin" }
    };

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // 2. Suntik Data Awal ke Tampilan Sidebar
    const dTitle = tempDiv.querySelector('#cms-brand-title');
    const dSub = tempDiv.querySelector('#cms-brand-subtitle');
    const dLogo = tempDiv.querySelector('#cms-brand-logo');
    const dDevName = tempDiv.querySelector('#cms-dev-name');
    const dDevRole = tempDiv.querySelector('#cms-dev-role');

    if (dTitle) dTitle.textContent = data.brand_name;
    if (dSub) dSub.textContent = data.subtitle;
    if (dLogo) dLogo.src = data.logo_url;
    if (dDevName) dDevName.textContent = data.developer.name;
    if (dDevRole) dDevRole.textContent = data.developer.role;

    // 3. Suntik Data Awal ke Form Input
    const iTitle = tempDiv.querySelector('#input-cms-title');
    const iSub = tempDiv.querySelector('#input-cms-subtitle');
    const iFont = tempDiv.querySelector('#input-cms-font');
    const iPrim = tempDiv.querySelector('#input-cms-primary');
    const iAcc = tempDiv.querySelector('#input-cms-accent');
    const iDevName = tempDiv.querySelector('#input-cms-dev-name');
    const iDevRole = tempDiv.querySelector('#input-cms-dev-role');
    const prevLogo = tempDiv.querySelector('#preview-cms-logo');
    
    const hexPrim = tempDiv.querySelector('#hex-cms-primary');
    const hexAcc = tempDiv.querySelector('#hex-cms-accent');

    if (iTitle) iTitle.value = data.brand_name;
    if (iSub) iSub.value = data.subtitle;
    if (iFont) iFont.value = data.font_family;
    if (iDevName) iDevName.value = data.developer.name;
    if (iDevRole) iDevRole.value = data.developer.role;
    if (prevLogo) prevLogo.src = data.logo_url;
    
    if (iPrim && hexPrim) {
        iPrim.value = data.theme.primary;
        hexPrim.textContent = data.theme.primary.toUpperCase();
    }
    if (iAcc && hexAcc) {
        iAcc.value = data.theme.accent;
        hexAcc.textContent = data.theme.accent.toUpperCase();
    }

    return tempDiv.innerHTML;
}

function initCmsPageMasterLogic() {
    console.log("Inisialisasi Master CMS berjalan...");

    // ==========================================
    // 1. LOGIC RESPONSIVE SIDEBAR
    // ==========================================
    const sidebar = document.getElementById('cms-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const btnOpen = document.getElementById('open-sidebar-btn');
    const btnClose = document.getElementById('close-sidebar-btn');

    const toggleSidebar = () => {
        const isClosed = sidebar.classList.contains('-translate-x-full');
        if (isClosed) {
            overlay.classList.remove('hidden');
            setTimeout(() => overlay.classList.remove('opacity-0'), 10);
            sidebar.classList.remove('-translate-x-full');
        } else {
            overlay.classList.add('opacity-0');
            sidebar.classList.add('-translate-x-full');
            setTimeout(() => overlay.classList.add('hidden'), 300);
        }
    };

    if (btnOpen) btnOpen.addEventListener('click', toggleSidebar);
    if (btnClose) btnClose.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);

    // ==========================================
    // 2. LOGIC MENU & WORKSPACE TITLE
    // ==========================================
    const navLinks = document.querySelectorAll('.cms-nav-link');
    const workspaceTitle = document.getElementById('workspace-title');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => {
                l.className = "cms-nav-link flex items-center gap-3 text-gray-800 hover:bg-yellow-400 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all border border-transparent hover:border-yellow-500/50 cursor-pointer";
                l.querySelector('i').classList.replace('text-accent', 'text-primary');
            });
            
            link.className = "cms-nav-link active flex items-center gap-3 bg-gray-950 text-white px-4 py-3.5 rounded-2xl font-bold text-sm shadow-[0_5px_15px_rgba(0,0,0,0.15)] transition-all transform hover:-translate-y-0.5 cursor-pointer";
            link.querySelector('i').classList.replace('text-primary', 'text-accent');

            workspaceTitle.innerHTML = `${link.querySelector('.nav-text').textContent} ⚙️`;
            if (window.innerWidth < 1024) toggleSidebar();
        });
    });

    // ==========================================
    // 3. LOGIC DRAG & DROP IMAGE + PREVIEW
    // ==========================================
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('input-cms-logo-file');
    const previewImg = document.getElementById('preview-cms-logo');
    const fileNameDisplay = document.getElementById('file-name-display');
    const displayLogo = document.getElementById('cms-brand-logo');
    let pendingImageFile = null;

    // Wajib ada untuk mencegah browser membuka gambar di tab baru
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Efek visual hover
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('border-accent', 'bg-yellow-50/50'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('border-accent', 'bg-yellow-50/50'), false);
    });

    const handleImageSelection = (file) => {
        if (!file || !file.type.startsWith('image/')) {
            alert("Harap masukkan file gambar (WebP/PNG/JPG)!");
            return;
        }
        
        pendingImageFile = file; 
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Image = e.target.result;
            previewImg.src = base64Image;
            displayLogo.src = base64Image; 
            fileNameDisplay.innerHTML = `File <span class="font-bold text-gray-900">${file.name}</span> siap dikonversi menjadi <span class="font-mono bg-gray-100 px-1 rounded">logo_cms_kurir_koe.webp</span>`;
        };
        reader.readAsDataURL(file);
    };

    fileInput.addEventListener('change', (e) => {
        handleImageSelection(e.target.files[0]);
    });

    dropZone.addEventListener('drop', (e) => {
        if (e.dataTransfer.files.length) {
            handleImageSelection(e.dataTransfer.files[0]);
        }
    });

    // ==========================================
    // 4. LOGIC COLOR PICKER & FONT
    // ==========================================
    const iPrim = document.getElementById('input-cms-primary');
    const iAcc = document.getElementById('input-cms-accent');
    const hexPrim = document.getElementById('hex-cms-primary');
    const hexAcc = document.getElementById('hex-cms-accent');
    const iFont = document.getElementById('input-cms-font');

    if (iPrim) iPrim.addEventListener('input', (e) => hexPrim.textContent = e.target.value.toUpperCase());
    if (iAcc) iAcc.addEventListener('input', (e) => hexAcc.textContent = e.target.value.toUpperCase());

    if (iFont) {
        iFont.addEventListener('change', (e) => {
            document.getElementById('cms-master-container').style.fontFamily = `"${e.target.value}", sans-serif`;
        });
    }

    // ==========================================
    // 5. TOMBOL SIMPAN & UPDATE STATE JSON
    // ==========================================
    const btnSave = document.getElementById('btn-save-cms');
    
    if (btnSave) {
        btnSave.addEventListener('click', () => {
            // Ambil semua value dari input
            const newTitle = document.getElementById('input-cms-title').value;
            const newSubtitle = document.getElementById('input-cms-subtitle').value;
            const newDevName = document.getElementById('input-cms-dev-name').value;
            const newDevRole = document.getElementById('input-cms-dev-role').value;
            const newFont = document.getElementById('input-cms-font').value;
            const newPrimary = document.getElementById('input-cms-primary').value;
            const newAccent = document.getElementById('input-cms-accent').value;

            // Update UI Sidebar Realtime
            document.getElementById('cms-brand-title').textContent = newTitle;
            document.getElementById('cms-brand-subtitle').textContent = newSubtitle;
            document.getElementById('cms-dev-name').textContent = newDevName;
            document.getElementById('cms-dev-role').textContent = newDevRole;

            // Update State di Memory! (Ini bikin perubahannya tersimpan selama session)
            if (window.State && window.State.data) {
                if(!window.State.data.cms_global) window.State.data.cms_global = { theme: {}, developer: {} };
                
                window.State.data.cms_global.brand_name = newTitle;
                window.State.data.cms_global.subtitle = newSubtitle;
                window.State.data.cms_global.font_family = newFont;
                window.State.data.cms_global.theme.primary = newPrimary;
                window.State.data.cms_global.theme.accent = newAccent;
                window.State.data.cms_global.developer.name = newDevName;
                window.State.data.cms_global.developer.role = newDevRole;
                
                if (pendingImageFile) {
                    window.State.data.cms_global.logo_url = previewImg.src; // Simpan base64 ke memori sementara
                }
            }

            if (pendingImageFile) {
                console.log("-> [SIMULASI BACKEND] Merename file", pendingImageFile.name, "menjadi: logo_cms_kurir_koe.webp");
                pendingImageFile = null; 
            }

            // Animasi Tersimpan
            const originalHTML = btnSave.innerHTML;
            btnSave.innerHTML = `<i class="fa-solid fa-check"></i> <span class="hidden sm:inline">Tersimpan!</span>`;
            btnSave.classList.remove('bg-primary', 'shadow-[0_5px_15px_rgba(0,84,183,0.3)]', 'hover:bg-blue-700');
            btnSave.classList.add('bg-green-500', 'shadow-[0_5px_15px_rgba(34,197,94,0.3)]', 'hover:bg-green-600');
            
            setTimeout(() => {
                btnSave.innerHTML = originalHTML;
                btnSave.classList.remove('bg-green-500', 'shadow-[0_5px_15px_rgba(34,197,94,0.3)]', 'hover:bg-green-600');
                btnSave.classList.add('bg-primary', 'shadow-[0_5px_15px_rgba(0,84,183,0.3)]', 'hover:bg-blue-700');
            }, 2000);
        });
    }
}