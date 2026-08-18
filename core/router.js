const routes = {
    '/': async () => {
        return await renderLandingPage(); 
    },
    '/admin': async () => {
        // Panggil fungsi render yang udah kita pisah
        return await renderCmsAdminPage();
    }
};

// Fungsi utama Router
const router = async () => {
    const app = document.getElementById('app');
    let path = window.location.hash.slice(1) || '/'; 
    const renderPage = routes[path] || routes['/'];
    
    // Loading Screen
    app.innerHTML = `
        <div class="h-screen w-full flex flex-col items-center justify-center bg-gray-50 fade-in">
            <i class="fa-solid fa-circle-notch fa-spin text-4xl text-primary mb-4"></i>
            <p class="text-gray-500 font-medium animate-pulse text-sm">Menyiapkan Workspace...</p>
        </div>
    `;
    
    // Jeda animasi masuk
    setTimeout(async () => {
        app.innerHTML = await renderPage(); 
        
        // Eksekusi logic masing-masing halaman
        if (path === '/') {
            initLandingPageLogic();
        } else if (path === '/admin') {
            initCmsAdminLogic();
        }
    }, 400);
};

// --- Inisialisasi Aplikasi --- //
window.addEventListener('load', async () => {
    await window.State.init();
    if (typeof applyGlobalMeta === 'function') applyGlobalMeta();
    if (typeof initCmsSlider === 'function') await initCmsSlider();
    
    router();
});

window.addEventListener('hashchange', router);