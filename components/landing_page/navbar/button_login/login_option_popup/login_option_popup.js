// components/landing_page/navbar/button_login/login_option_popup/login_option_popup.js

async function renderLoginOptionPopup() {
    let html = await fetchHTML('./components/landing_page/navbar/button_login/login_option_popup/login_option_popup.html');
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const modalEl = tempDiv.querySelector('#auth-modal');
    if (modalEl) {
        // Hapus modal lama biar ga dobel
        const existingModal = document.getElementById('auth-modal');
        if (existingModal) existingModal.remove();
        
        // Pindah modal langsung nempel ke body (biar blur-nya maksimal nutupin semuanya)
        document.body.appendChild(modalEl);
    }
    
    return ''; // Komponen ini ga nembak HTML ke tempat dia dipanggil, melainkan langsung ke body
}

function initLoginOptionLogic() {
    // Tombol trigger dari navbar (di file button_login.html)
    const btnMasuk = document.getElementById('nav-btn-masuk');
    
    // Elemen modal dari file login_option_popup.html
    const modal = document.getElementById('auth-modal');
    const overlay = document.getElementById('auth-modal-overlay');
    const modalBox = document.getElementById('auth-modal-box');
    const btnClose = document.getElementById('auth-modal-close');
    
    // Tombol pilihan role
    const btnKaryawan = document.getElementById('btn-role-karyawan');
    const btnAdmin = document.getElementById('btn-role-admin');
    const optionsView = document.getElementById('auth-options-view');

    if (!btnMasuk || !modal) return;

    // Fungsi Buka Modal
    const openModal = () => {
        // Pastikan view di-reset ke pilihan role saat dibuka
        if(optionsView) {
            optionsView.classList.remove('hidden', 'swap-out');
            optionsView.classList.add('swap-in');
        }
        
        modal.classList.remove('hidden');
        // Jeda bentar biar animasi CSS jalan
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
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 400);
    };

    // Pasang Event Listener
    btnMasuk.addEventListener('click', openModal);
    btnClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    // --- LOGIC KLIK PILIHAN ROLE ---
    const handleRoleSelection = (role) => {
        // Jalankan animasi konten lama nge-slide ke kiri dan ngilang
        optionsView.classList.remove('swap-in');
        optionsView.classList.add('swap-out');
        
        setTimeout(() => {
            optionsView.classList.add('hidden'); // Sembunyiin dari layout setelah transparan
            
            // NOTE: Di sini nanti kita bakal trigger fungsi renderFormLoginPopup(role)
            // Untuk sementara kita biarin kosong nunggu lu beresin komponen form-nya
            console.log(`Role ${role} dipilih! Siap nge-load form...`);
            
        }, 400); // Waktu nunggu sesuai durasi css animasi swap-out
    };

    if (btnKaryawan) btnKaryawan.addEventListener('click', () => handleRoleSelection('karyawan'));
    if (btnAdmin) btnAdmin.addEventListener('click', () => handleRoleSelection('admin'));
}