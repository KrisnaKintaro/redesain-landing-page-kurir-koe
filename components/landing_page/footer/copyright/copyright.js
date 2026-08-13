async function renderCopyright() {
    let html = await fetchHTML('./components/landing_page/footer/copyright/copyright.html');
    
    // Ambil data CMS, fallback ke data dummy
    const data = window.State.get('footer_copyright') || {
        text: "© {year} Kurir Koe. All rights reserved.",
        links: [
            { label: "Syarat & Ketentuan", url: "#/" },
            { label: "Kebijakan Privasi", url: "#/" }
        ]
    };

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const elText = tempDiv.querySelector('#footer-copyright-text');
    const elLinks = tempDiv.querySelector('#footer-copyright-links');

    // Render Teks & Ganti Tahun Otomatis
    if (elText && data.text) {
        const currentYear = new Date().getFullYear();
        elText.textContent = data.text.replace('{year}', currentYear);
    }

    // Render Links
    if (elLinks && data.links) {
        elLinks.innerHTML = '';
        data.links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.className = "text-sm text-gray-500 hover:text-primary transition-colors duration-300 font-medium";
            a.textContent = link.label;
            elLinks.appendChild(a);
        });
    }

    return tempDiv.innerHTML;
}

function initCopyrightLogic() {
    // Kosongin sementara
}