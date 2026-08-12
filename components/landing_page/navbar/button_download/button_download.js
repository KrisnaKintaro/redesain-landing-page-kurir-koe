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
                // Eksekusi scroll ke seksi "Siap Mengirim?"
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center' // Kita set 'center' biar seksi "Siap Mengirim" pas di tengah layar
                });
            } else {
                console.warn(`Waduh cuy, komponen dengan id="${targetId}" belum dirender!`);
            }
        });
    }
}