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

    // Render Teks & Ganti Tahun Otomatis + Auto Scale
    if (elText && data.text) {
        const currentYear = new Date().getFullYear();
        const fullText = data.text.replace('{year}', currentYear);
        elText.textContent = fullText;
        
        // Toleransi sekitar 40 karakter sebelum mengecil otomatis
        autoScaleFont(elText, 40, "text-sm", "text-xs");
    }

    // Render Links + Auto Scale
    if (elLinks && data.links) {
        elLinks.innerHTML = '';
        data.links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            // Tambahkan class 'footer-copyright-link' dan 'transition-all'
            a.className = "footer-copyright-link text-sm text-gray-500 hover:text-primary transition-all duration-300 font-medium whitespace-nowrap";
            a.textContent = link.label;
            elLinks.appendChild(a);
        });

        // --- LOGIC AUTO-SCALE FONT UNTUK LINK KEBIJAKAN ---
        const linkElements = elLinks.querySelectorAll('.footer-copyright-link');
        data.links.forEach((link, idx) => {
            const el = linkElements[idx];
            if (el && link.label) {
                // Toleransi panjang teks menu kebijakan sekitar 18 karakter
                autoScaleFont(el, 18, "text-sm", "text-xs");
            }
        });
    }

    return tempDiv.innerHTML;
}

function initCopyrightLogic() {
    // Kosongin sementara
}