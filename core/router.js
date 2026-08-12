// core/router.js

// Nanti kalau komponen halamannya udah jadi, kita import di sini.
// Contoh: import LandingPage from '../pages/LandingPage.js';

// Konfigurasi Routes
const routes = {
    '/': async () => {
        // Karena komponennya belum dibikin, kita kasih placeholder dulu
        // Nanti ini tinggal diganti jadi: return await LandingPage();
        return `
            <div class="flex flex-col items-center justify-center min-h-screen fade-in text-center p-4">
                <h1 class="text-4xl font-bold text-primary mb-4">Mesin SPA Menyala! 🚀</h1>
                <p class="text-gray-600 mb-6">Ini adalah halaman Landing Page. Komponen belum dirakit.</p>
                <a href="#/admin" class="bg-accent text-primary font-bold py-2 px-6 rounded-full hover:bg-yellow-400 transition">
                    Ke Halaman Admin CMS
                </a>
            </div>
        `;
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
    
    // Ambil path dari hash, kalau kosong default ke '/'
    // Misal URL lu domain.com/#/admin -> path = '/admin'
    let path = window.location.hash.slice(1) || '/'; 

    // Cari fungsi route berdasarkan path, kalau ga ketemu balikin ke '/'
    const renderPage = routes[path] || routes['/'];
    
    // Eksekusi fungsi dan suntik HTML-nya ke div#app
    app.innerHTML = await renderPage();
};

// --- Inisialisasi Aplikasi --- //

// Jalankan saat pertama kali website diload
window.addEventListener('load', async () => {
    // 1. Load data JSON dulu sebelum ngerender UI
    await window.State.init(); 
    
    // 2. Jalankan router
    router();
});

// Dengarkan perubahan URL (saat user klik link atau tombol back/forward di browser)
window.addEventListener('hashchange', router);