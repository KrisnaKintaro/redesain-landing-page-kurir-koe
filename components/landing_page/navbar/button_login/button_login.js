
async function renderButtonLogin() {
    let html = await fetchHTML('./components/landing_page/navbar/button_login/button_login.html');
    
    // Ambil data CMS, siapin fallback kalau belum diset di admin
    const data = window.State.get('login_modal') || {
        karyawan_url: "https://kurir-koe.deviscode.com/employee/login",
        admin_url: "https://kurir-koe.deviscode.com/admin/login"
    };

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Inject URL ke masing-masing card
    const linkKaryawan = tempDiv.querySelector('#link-karyawan');
    const linkAdmin = tempDiv.querySelector('#link-admin');
    
    if (linkKaryawan) linkKaryawan.href = data.karyawan_url;
    if (linkAdmin) linkAdmin.href = data.admin_url;

    return tempDiv.innerHTML;
}

function initButtonLoginLogic() {
    const btnMasuk = document.getElementById('nav-btn-masuk');
    const modal = document.getElementById('login-modal');
    const overlay = document.getElementById('login-modal-overlay');
    const modalBox = document.getElementById('login-modal-box');
    const btnClose = document.getElementById('login-modal-close');

    if (!btnMasuk || !modal) return;

    // Fungsi Buka Modal
    const openModal = () => {
        modal.classList.remove('hidden');
        // Kasih jeda dikit biar browser render display:block dulu, baru jalanin animasi CSS
        setTimeout(() => {
            overlay.classList.remove('opacity-0');
            modalBox.classList.remove('opacity-0', 'scale-95');
            modalBox.classList.add('opacity-100', 'scale-100');
        }, 10);
    };

    // Fungsi Tutup Modal
    const closeModal = () => {
        overlay.classList.add('opacity-0');
        modalBox.classList.remove('opacity-100', 'scale-100');
        modalBox.classList.add('opacity-0', 'scale-95');
        
        // Tunggu animasi selesai baru di-hidden (durasi animasi 300ms di Tailwind)
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    };

    // Pasang Event Listeners
    btnMasuk.addEventListener('click', openModal);
    btnClose.addEventListener('click', closeModal);
    
    // Tutup modal kalau user klik area gelap di luar kotak putih
    overlay.addEventListener('click', closeModal);
}