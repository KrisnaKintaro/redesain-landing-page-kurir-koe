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
            
            // REVISI: text-sm dipindah ke span. Tambahin whitespace-nowrap biar ngga patah 2 baris
            const baseClass = "nav-pill flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all duration-300 ease-in-out cursor-pointer select-none whitespace-nowrap";
            const defaultClass = "text-gray-500 hover:text-primary hover:bg-blue-50";
            const activeClass = "bg-accent text-gray-900 shadow-[2px_2px_10px_rgba(250,216,18,0.4)]";
            
            const finalClass = `${baseClass} ${isActive ? activeClass : defaultClass}`;
            
            // Masukin tag <i> buat icon-nya dan <span> buat teksnya
            li.innerHTML = `
                <a href="javascript:void(0)"
                    data-target="${item.target}"
                    class="${finalClass}">
                   <i class="fa-solid ${item.icon} text-base"></i>
                   <span class="nav-label text-sm transition-all duration-300">${item.label}</span>
                </a>
            `;
            
            // --- LOGIC AUTO-SCALE FONT ---
            const spanEl = li.querySelector('.nav-label');
            if (spanEl && item.label) {
                // Kalau karakternya panjang banget, ciutkan dari text-sm jadi text-[11px] / text-xs
                autoScaleFont(spanEl, 12, "text-sm", "text-[11px] lg:text-xs");
            }

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
            
            // 1. RESET SEMUA
            links.forEach(l => {
                l.classList.remove(...activeClasses);
                l.classList.add(...defaultClasses);
            });
            
            // 2. SET AKTIF
            link.classList.remove(...defaultClasses);
            link.classList.add(...activeClasses);
            
            // 3. EKSEKUSI SCROLL
            const targetId = link.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                
                // REVISI: Kurangi ekstra 40px biar ada jarak aman di atas tagline
                const offsetPosition = elementPosition - headerHeight - 40; 
                
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