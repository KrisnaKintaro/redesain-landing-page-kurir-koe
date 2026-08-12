async function renderNavMenu() {
    let html = await fetchHTML('./components/landing_page/navbar/nav_menu/nav_menu.html');
    
    // Ambil data dari State, kalau kosong kasih default bawaan lu
    const data = window.State.get('nav_menu') || [
        { label: "Beranda", target: "hero" },
        { label: "Layanan", target: "services" },
        { label: "Gabung Mitra", target: "partnership" },
        { label: "Hubungi Kami", target: "footer" }
    ];

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const ulList = tempDiv.querySelector('#navbar-menu-list');

    if (ulList) {
        ulList.innerHTML = ''; // Pastikan bersih dulu
        
        // Looping data dari JSON buat bikin list menu-nya
        data.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="javascript:void(0)" 
                   data-target="${item.target}" 
                   class="scroll-link hover:text-primary transition-colors duration-300">
                   ${item.label}
                </a>
            `;
            ulList.appendChild(li);
        });
    }

    return tempDiv.innerHTML;
}

function initNavMenuLogic() {
    // Cari semua elemen yang punya class 'scroll-link'
    const links = document.querySelectorAll('.scroll-link');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Cegah fungsi bawaan link
            
            // Ambil nama targetnya (misal: "services")
            const targetId = link.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Eksekusi gulir layar dengan efek mulus
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start' 
                });
            } else {
                console.warn(`Waduh cuy, komponen dengan id="${targetId}" belum ada di layar!`);
            }
        });
    });
}