async function renderNavbarMaster() {
    let html = await fetchHTML('./components/landing_page/navbar/navbar_master.html');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const [logoHTML, navMenuHTML, btnLoginHTML, btnDownloadHTML] = await Promise.all([
        renderLogo(),
        renderNavMenu(),
        renderButtonLogin(),
        renderButtonDownload()
    ]);

    const slotLogo = tempDiv.querySelector('#slot-logo');
    const slotNavMenu = tempDiv.querySelector('#slot-nav-menu');
    const slotBtnLogin = tempDiv.querySelector('#slot-btn-login');
    const slotBtnDownload = tempDiv.querySelector('#slot-btn-download');

    if (slotLogo) slotLogo.innerHTML = logoHTML;
    if (slotNavMenu) slotNavMenu.innerHTML = navMenuHTML;
    if (slotBtnLogin) slotBtnLogin.innerHTML = btnLoginHTML;
    if (slotBtnDownload) slotBtnDownload.innerHTML = btnDownloadHTML;

    // --- RENDER MOBILE MENU ---
    // Ambil data menu yang sama dari CMS biar gak kerja dua kali
    const menuData = window.State.get('nav_menu') || [
        { label: "Beranda", target: "hero" },
        { label: "Layanan", target: "services" },
        { label: "Gabung Mitra", target: "partnership" },
        { label: "Hubungi Kami", target: "footer" }
    ];
    
    const mobileMenuList = tempDiv.querySelector('#mobile-menu-list');
    if (mobileMenuList) {
        menuData.forEach((item, index) => {
            const li = document.createElement('li');
            
            const isActive = index === 0; // Default Beranda aktif
            
            // Base Class
            const baseClass = "mobile-nav-link block px-4 py-3 rounded-xl font-medium transition-all duration-300 ease-in-out cursor-pointer select-none";
            
            // Default Class: Teks abu-abu
            const defaultClass = "text-gray-600 hover:bg-yellow-50 hover:text-yellow-700";
            
            // Active Class: Background Kuning (accent) dan teks gelap
            const activeClass = "bg-accent text-gray-900 shadow-md";

            const finalClass = `${baseClass} ${isActive ? activeClass : defaultClass}`;

            li.innerHTML = `
                <a href="javascript:void(0)" 
                   data-target="${item.target}" 
                   class="${finalClass}">
                   ${item.label}
                </a>
            `;
            mobileMenuList.appendChild(li);
        });
    }

    return tempDiv.innerHTML;
}

function initNavbarMasterLogic() {
    // 1. Inisiasi logic sub-komponen
    if (typeof initNavMenuLogic === 'function') initNavMenuLogic();
    if (typeof initButtonLoginLogic === 'function') initButtonLoginLogic();
    if (typeof initButtonDownloadLogic === 'function') initButtonDownloadLogic();

    // 2. Logic Mobile Drawer
    const btnMenu = document.getElementById('mobile-menu-btn');
    const btnClose = document.getElementById('close-drawer-btn');
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('mobile-drawer-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const defaultClasses = ["text-gray-600", "hover:bg-yellow-50", "hover:text-yellow-700"];
    const activeClasses = ["bg-accent", "text-gray-900", "shadow-md"];

    if (!btnMenu || !drawer) return;

    const openDrawer = () => {
        overlay.classList.remove('hidden');
        setTimeout(() => {
            overlay.classList.remove('opacity-0');
            drawer.classList.remove('-translate-x-full');
        }, 10);
    };

    const closeDrawer = () => {
        overlay.classList.add('opacity-0');
        drawer.classList.add('-translate-x-full');
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 300); // Sesuaikan dengan durasi transition Tailwind
    };

    // Event listener buka/tutup
    btnMenu.addEventListener('click', openDrawer);
    btnClose.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    // 3. Logic Scroll untuk Mobile Links
    mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Reset semua link jadi default
            mobileLinks.forEach(l => {
                l.classList.remove(...activeClasses);
                l.classList.add(...defaultClasses);
            });
            
            // Set link yang diklik jadi aktif (kuning)
            link.classList.remove(...defaultClasses);
            link.classList.add(...activeClasses);

            const targetId = link.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                closeDrawer(); 
            }
        });
    });
}