async function renderButtonDownload() {
    let html = await fetchHTML('./components/landing_page/navbar/button_download/button_download.html');
    
    // Ambil data CMS, siapin fallback
    const data = window.State.get('button_download') || {
        label: "Download App",
        target: "cta"
    };

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Inject teks dan target dari CMS
    const btnText = tempDiv.querySelector('#nav-btn-download-text');
    const btnDownload = tempDiv.querySelector('#nav-btn-download');
    
    if (btnText) btnText.textContent = data.label;
    if (btnDownload) btnDownload.setAttribute('data-target', data.target);

    return tempDiv.innerHTML;
}

function initButtonDownloadLogic() {
    const btnDownload = document.getElementById('nav-btn-download');
    
    if (btnDownload) {
        btnDownload.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = btnDownload.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // 1. Ambil tinggi navbar (header) biar nggak ketutupan
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 80; // Fallback 80px kalau header gagal ditangkap
                
                // 2. Hitung posisi asli elemen dari paling atas dokumen
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                
                // 3. Kurangi posisi elemen dengan tinggi navbar (ditambah ekstra 20px biar ada nafas dikit)
                const offsetPosition = elementPosition - headerHeight - 20;
                
                // 4. Eksekusi scroll yang presisi!
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            } else {
                console.warn(`Waduh cuy, komponen dengan id="${targetId}" belum dirender!`);
            }
        });
    }
}