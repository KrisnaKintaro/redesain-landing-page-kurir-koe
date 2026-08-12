async function renderLogo() {
    // 1. Fetch file HTML-nya
    let html = await fetchHTML('./components/landing_page/navbar/logo/logo.html');
    
    // 2. Ambil data CMS dari State
    const data = window.State.get();
    
    // Bikin fallback (nilai default) kalau misal di CMS datanya belum diisi
    const namaPerusahaan = data.nama_perusahaan || "Kurir Koe"; 
    const logoUrl = data.logo_url || "./assets/images/logo_kurir_koe.webp";

    // 3. Render HTML ke DOM sementara
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // 4. Update Gambar Logo (Teks brand sudah dihapus)
    const logoImgEl = tempDiv.querySelector('#navbar-logo-img');
    if (logoImgEl) {
        logoImgEl.src = logoUrl;
        // Alt text tetap pakai nama perusahaan untuk kebutuhan SEO
        logoImgEl.alt = `Logo ${namaPerusahaan}`; 
    }

    // 5. Kembalikan HTML yang sudah dimodifikasi
    return tempDiv.innerHTML;
}