async function renderLinkGroup() {
    let html = await fetchHTML('./components/landing_page/footer/link_group/link_group.html');
    
    // Ambil data CMS, kita siapin 2 grup sesuai rikues lu
    const data = window.State.get('link_groups') || [
        {
            title: "Perusahaan",
            links: [
                { label: "Tentang Kami", url: "#/" },
                { label: "Karir", url: "#/" },
                { label: "Blog", url: "#/" }
            ]
        },
        {
            title: "Layanan",
            links: [
                { label: "Kurir Motor", url: "#/" },
                { label: "Kurir Mobil", url: "#/" },
                { label: "Corporate", url: "#/" }
            ]
        }
    ];

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const container = tempDiv.querySelector('#footer-link-groups-container');

    if (container && data.length > 0) {
        container.innerHTML = ''; // Bersihkan dulu
        
        data.forEach(group => {
            const groupDiv = document.createElement('div');
            groupDiv.className = "flex flex-col min-w-[120px]";
            
            // Looping untuk bikin elemen <li> nya
            let linksHTML = '';
            group.links.forEach(link => {
                linksHTML += `
                    <li>
                        <a href="${link.url}" class="text-gray-500 hover:text-primary transition-colors duration-300 text-sm sm:text-base flex items-center gap-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-accent opacity-0 transition-opacity duration-300 -ml-3 group-hover:opacity-100"></span>
                            ${link.label}
                        </a>
                    </li>
                `;
            });

            // Tembak struktur utuh per grup
            groupDiv.innerHTML = `
                <h4 class="font-bold text-gray-900 mb-5 tracking-wide">${group.title}</h4>
                <ul class="flex flex-col gap-3">
                    ${linksHTML}
                </ul>
            `;
            
            container.appendChild(groupDiv);
        });
    }

    return tempDiv.innerHTML;
}

function initLinkGroupLogic() {
    // Kosongin sementara
}