async function initCmsSlider() {
    // 1. Ambil template slider
    let html = await fetchHTML('./components/cms_page/cms_slider/cms_slider.html');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    document.body.appendChild(tempDiv.firstElementChild);

    const sliderWrapper = document.getElementById('cms-slider-wrapper');
    const handleBtn = document.getElementById('cms-slider-handle');
    const btnLanding = document.getElementById('btn-view-landing');
    const btnCms = document.getElementById('btn-view-cms');

    // Cek hash saat ini untuk sinkronisasi tombol aktif pertama kali load
    let currentPath = window.location.hash.slice(1) || '/';
    if (currentPath === '/admin') {
        updateActiveButtonState(btnCms, btnLanding);
    } else {
        updateActiveButtonState(btnLanding, btnCms);
    }

    // --- LOGIC AUTO HIDE / SHOW (HOVER ALA GAME SPACE) ---
    const openSlider = () => {
        sliderWrapper.classList.remove('-translate-x-[100%]');
        sliderWrapper.classList.add('translate-x-0');
        handleBtn.querySelector('.fa-caret-right')?.classList.replace('fa-caret-right', 'fa-caret-left');
    };

    const closeSlider = () => {
        sliderWrapper.classList.remove('translate-x-0');
        sliderWrapper.classList.add('-translate-x-[100%]');
        handleBtn.querySelector('.fa-caret-left')?.classList.replace('fa-caret-left', 'fa-caret-right');
    };

    sliderWrapper.addEventListener('mouseenter', openSlider);
    sliderWrapper.addEventListener('mouseleave', closeSlider);
    handleBtn.addEventListener('click', () => {
        if (sliderWrapper.classList.contains('-translate-x-[100%]')) openSlider();
        else closeSlider();
    });

    // --- LOGIC UNTUK BONGKAR PASANG CLASS TOMBOL ---
    function updateActiveButtonState(activeBtn, inactiveBtn) {
        activeBtn.className = "view-toggle-btn w-full flex items-center justify-between bg-primary text-white py-3.5 px-5 rounded-2xl shadow-[0_5px_15px_rgba(0,84,183,0.3)] transition-all font-bold text-sm pointer-events-none";
        activeBtn.querySelector('.check-icon')?.classList.replace('opacity-0', 'opacity-100');

        inactiveBtn.className = "view-toggle-btn w-full flex items-center justify-between bg-white text-gray-900 py-3.5 px-5 rounded-2xl shadow-sm transition-all hover:shadow-[0_5px_15px_rgba(255,255,255,0.5)] hover:-translate-y-1 font-bold text-sm border border-transparent hover:border-white cursor-pointer";
        inactiveBtn.querySelector('.check-icon')?.classList.replace('opacity-100', 'opacity-0');
    }

    // --- INTEGRASI KE ROUTER NATIVE ---
    btnLanding.addEventListener('click', () => {
        updateActiveButtonState(btnLanding, btnCms);
        closeSlider();
        window.location.hash = '#/'; // Pemicu destroy & write otomatis lewat router.js
    });

    btnCms.addEventListener('click', () => {
        updateActiveButtonState(btnCms, btnLanding);
        closeSlider();
        window.location.hash = '#/admin'; // Pemicu destroy & write otomatis lewat router.js
    });
}