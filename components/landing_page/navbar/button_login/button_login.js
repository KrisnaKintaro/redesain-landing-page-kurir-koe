async function renderButtonLogin() {
    let html = await fetchHTML('./components/landing_page/navbar/button_login/button_login.html');
    
    const data = window.State.get('login_modal') || {
        karyawan_url: "https://kurir-koe.deviscode.com/employee/login",
        admin_url: "https://kurir-koe.deviscode.com/admin/login"
    };

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Inject URL ke masing-masing card (opsional jika ada di HTML)
    const linkKaryawan = tempDiv.querySelector('#link-karyawan');
    const linkAdmin = tempDiv.querySelector('#link-admin');
    if (linkKaryawan) linkKaryawan.href = data.karyawan_url;
    if (linkAdmin) linkAdmin.href = data.admin_url;

    // 1. Tangkap elemen modalnya
    const modalEl = tempDiv.querySelector('#login-modal');
    
    if (modalEl) {
        // 2. Bersihkan modal lama kalau misal user pindah-pindah halaman biar nggak duplikat
        const existingModal = document.getElementById('login-modal');
        if (existingModal) existingModal.remove();
        
        // 3. Pindahkan modalnya keluar dari Navbar dan letakkan langsung di body
        document.body.appendChild(modalEl);
    }

    // 4. Kembalikan HANYA tombolnya untuk dipasang di Navbar
    const btnEl = tempDiv.querySelector('#nav-btn-masuk'); 
    const navBtnData = window.State.get('button_login_nav') || { label: "Masuk" };
    if (btnEl) btnEl.textContent = navBtnData.label;
    
    return btnEl ? btnEl.outerHTML : '';
}

function initButtonLoginLogic() {
    // Tangkap elemen tombol yang ada di navbar
    const btnMasuk = document.getElementById('nav-btn-masuk');
    
    // Tangkap elemen modal yang sekarang posisinya udah di dalam body
    const modal = document.getElementById('login-modal');
    const overlay = document.getElementById('login-modal-overlay');
    const modalBox = document.getElementById('login-modal-box');
    const btnClose = document.getElementById('login-modal-close');

    if (!btnMasuk || !modal) return;

    const openModal = () => {
        modal.classList.remove('hidden');
        setTimeout(() => {
            overlay.classList.remove('opacity-0');
            modalBox.classList.remove('opacity-0', 'scale-95');
            modalBox.classList.add('opacity-100', 'scale-100');
        }, 10);
    };

    const closeModal = () => {
        overlay.classList.add('opacity-0');
        modalBox.classList.remove('opacity-100', 'scale-100');
        modalBox.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    };

    btnMasuk.addEventListener('click', openModal);
    btnClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
}