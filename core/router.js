const routes = {
    '/': async () => {
        return await renderLandingPage(); 
    },
    '/admin': async () => {
        return `
            <div class="flex flex-col items-center justify-center min-h-screen fade-in text-center p-4 bg-white">
                <h1 class="text-4xl font-bold text-primary mb-4">Panel CMS Admin ⚙️</h1>
                <p class="text-gray-600 mb-6">Di sini nanti form buat ubah isi konten landing page.</p>
                <a href="#/" class="border-2 border-primary text-primary font-bold py-2 px-6 rounded-full hover:bg-primary hover:text-white transition">
                    Kembali ke Landing Page
                </a>
            </div>
        `;
    }
};

// Fungsi utama Router
const router = async () => {
    const app = document.getElementById('app');
    let path = window.location.hash.slice(1) || '/'; 
    const renderPage = routes[path] || routes['/'];
    
    // Proses Nimpa ke index.html
    app.innerHTML = await renderPage(); 
    
    // WAJIB: Setelah HTML nempel di DOM, baru kita jalankan logic JS-nya!
    if (path === '/') {
        initLandingPageLogic();
    }
};

// --- Inisialisasi Aplikasi --- //

// Jalankan saat pertama kali website diload
window.addEventListener('load', async () => {
    // 1. Load data JSON dulu sebelum ngerender UI
    await window.State.init();
      
    // 2. Terapin pengaturan Global (Title, Font, Favicon)
    if (typeof applyGlobalMeta === 'function') applyGlobalMeta();
      
    // 3. Jalankan router buat nge-render halaman
    router();
});

// Dengarkan perubahan URL (saat user klik link atau tombol back/forward di browser)
window.addEventListener('hashchange', router);