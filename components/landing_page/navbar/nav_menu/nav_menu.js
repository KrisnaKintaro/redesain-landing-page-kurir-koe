async function renderNavMenu() {
    let html = await fetchHTML('./components/landing_page/navbar/nav_menu/nav_menu.html');
    
    // Tambahin properti icon di data CMS
    const data = window.State.get('nav_menu') || [
        { label: "Beranda", target: "hero", icon: "fa-house" },
        { label: "Layanan", target: "services", icon: "fa-box" },
        { label: "Gabung Mitra", target: "partnership", icon: "fa-handshake" },
        { label: "Hubungi Kami", target: "footer", icon: "fa-phone" }
    ];

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const ulList = tempDiv.querySelector('#navbar-menu-list');
    
    if (ulList) {
        ulList.innerHTML = '';
        
        data.forEach((item, index) => {
            const li = document.createElement('li');
            const isActive = index === 0;
            
            // Tambahin flex items-center gap-2 biar sejajar
            const baseClass = "nav-pill flex items-center gap-2 px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 ease-in-out cursor-pointer select-none";
            const defaultClass = "text-gray-500 hover:text-primary hover:bg-blue-50";
            const activeClass = "bg-accent text-gray-900 shadow-[2px_2px_10px_rgba(250,216,18,0.4)]";
            
            const finalClass = `${baseClass} ${isActive ? activeClass : defaultClass}`;
            
            // Masukin tag <i> buat icon-nya
            li.innerHTML = `
                <a href="javascript:void(0)"
                    data-target="${item.target}"
                    class="${finalClass}">
                   <i class="fa-solid ${item.icon} text-base"></i>
                   ${item.label}
                </a>
            `;
            ulList.appendChild(li);
        });
    }
    return tempDiv.innerHTML;
}

function initNavMenuLogic() {
    const links = document.querySelectorAll('.nav-pill');
    
    // Siapkan array class untuk proses bongkar-pasang saat diklik
    const defaultClasses = ["text-gray-500", "hover:text-primary", "hover:bg-blue-50"];
    const activeClasses = ["bg-accent", "text-gray-900", "shadow-[2px_2px_10px_rgba(250,216,18,0.4)]"];
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 1. RESET SEMUA: Hapus status aktif dari semua menu, kembalikan ke default
            links.forEach(l => {
                l.classList.remove(...activeClasses);
                l.classList.add(...defaultClasses);
            });
            
            // 2. SET AKTIF: Tambahkan status aktif hanya pada menu yang baru saja diklik
            link.classList.remove(...defaultClasses);
            link.classList.add(...activeClasses);
            
            // 3. EKSEKUSI SCROLL: Gulir layar ke komponen target
            const targetId = link.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Ambil tinggi navbar (misal header punya class h-20 = 80px)
                const headerHeight = document.querySelector('header').offsetHeight;
                
                // Hitung posisi elemen target dari atas dokumen, lalu kurangi tinggi navbar
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            } else {
                console.warn(`Target section #${targetId} belum ada cuy!`);
            }
        });
    });
}