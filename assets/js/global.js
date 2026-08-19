// Opsional: Fungsi bantuan buat generate ID unik (berguna kalau bikin elemet dinamis)
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Fungsi Global buat animasi Entrance pas di-scroll
function initScrollReveal() {
    // 1. Tangkap semua bagian utama (section dan footer) secara otomatis
    const sections = document.querySelectorAll('section:not(#hero), footer');
    
    // 2. Suntikkin class rahasia kita ke mereka (biar otomatis ngilang semua dulu)
    sections.forEach(sec => {
        sec.classList.add('scroll-reveal');
    });

    // 3. Ambil ulang semua elemen yang udah dikasih class scroll-reveal
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (revealElements.length === 0) return;

    // 4. Bikin 'CCTV' (Observer) buat mantau layar
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            // Kalau elemennya udah nabrak/masuk ke dalam viewport layar user
            if (entry.isIntersecting) {
                // Munculinnn!
                entry.target.classList.add('reveal-visible');
                
                // Stop mantau elemen ini biar animasinya cukup jalan 1x aja (nggak ngulang2 terus)
                obs.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Syarat: Minimal 15% dari wujud komponen harus masuk layar, baru di-trigger
    });

    // 5. Suruh CCTV mantau satu-satu komponennya
    revealElements.forEach(el => observer.observe(el));
}

// Fungsi untuk load file HTML komponen secara asynchronous + Dynamic CSS Loading
async function fetchHTML(path) {
    try {
        // 1. Fetch HTML-nya (Logic bawaan)
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Gagal memuat: ${path}`);
        }

        // 2. --- LOGIC DYNAMIC CSS LOADING ---
        // Ubah ekstensi .html jadi .css dari path yang direquest
        const cssPath = path.replace('.html', '.css');

        // Cek dulu apakah CSS ini udah pernah diload sebelumnya di <head> (biar ga dobel)
        if (!document.querySelector(`link[href="${cssPath}"]`)) {
            try {
                // Cek apakah file CSS-nya beneran ada di folder pake request HEAD (biar ringan ga download isinya)
                const cssCheck = await fetch(cssPath, { method: 'HEAD' });
                
                // Kalau file CSS-nya ada (status 200 OK), baru kita suntik ke DOM
                if (cssCheck.ok) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = cssPath;
                    document.head.appendChild(link);
                }
            } catch (e) {
                // Silent error: Kalau file CSS ga ada, biarin aja lewat (nggak semua komponen butuh CSS)
            }
        }

        return await response.text();
    } catch (error) {
        console.error("Error fetching component:", error);
        return `<div class="p-4 text-red-500">Error loading component from ${path}</div>`;
    }
}

// Fungsi buat nyuntik meta global (SEO, Font, Title, Favicon) dari JSON ke HTML
function applyGlobalMeta() {
    const meta = window.State.get('global_meta');
    if (!meta) return;

    // 1. Update Title Browser
    if (meta.title) {
        document.title = meta.title;
        const titleTag = document.getElementById('meta-title');
        if (titleTag) titleTag.textContent = meta.title;
    }

    // 2. Update Meta Description (Buat SEO Google)
    if (meta.description) {
        const descTag = document.getElementById('meta-desc');
        if (descTag) descTag.setAttribute('content', meta.description);
    }

    // 3. Update Favicon (Logo Tab)
    if (meta.favicon_url) {
        const faviconTag = document.getElementById('meta-favicon');
        if (faviconTag) faviconTag.setAttribute('href', meta.favicon_url);
    }

    // 4. Update Import Google Font
    if (meta.font_url) {
        const fontTag = document.getElementById('meta-font');
        if (fontTag) fontTag.setAttribute('href', meta.font_url);
    }

    // 5. Paksa Body Pakai Font Baru
    if (meta.font_family) {
        // Nge-override settingan default Tailwind biar font langsung berubah
        document.body.style.fontFamily = `"${meta.font_family}", sans-serif`;
    }
}

function showConfirmModal({
    title = 'Konfirmasi',
    message = '',
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    variant = 'primary'
} = {}) {
    return new Promise((resolve) => {
        // Bersihin kalau kebetulan ada modal lain yang masih nyangkut
        document.getElementById('global-confirm-modal')?.remove();

        const isDanger = variant === 'danger';
        const iconBg = isDanger ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-primary';
        const iconClass = isDanger ? 'fa-triangle-exclamation' : 'fa-circle-question';
        const confirmBtnClass = isDanger
            ? 'bg-red-500 hover:bg-red-600 shadow-[0_5px_15px_rgba(239,68,68,0.3)]'
            : 'bg-primary hover:bg-blue-800 shadow-[0_5px_15px_rgba(0,84,183,0.3)]';

        const overlay = document.createElement('div');
        overlay.id = 'global-confirm-modal';
        overlay.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4 fade-in';

        overlay.innerHTML = `
            <div class="bg-white rounded-3xl p-6 sm:p-7 w-full max-w-sm shadow-2xl">
                <div class="w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center mb-4">
                    <i class="fa-solid ${iconClass} text-lg"></i>
                </div>
                <h3 class="text-lg font-extrabold text-gray-900 mb-1.5">${title}</h3>
                <p class="text-sm text-gray-500 leading-relaxed mb-6">${message}</p>
                <div class="flex items-center justify-end gap-2.5">
                    <button type="button" id="global-confirm-cancel" class="px-4 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 transition-all">${cancelText}</button>
                    <button type="button" id="global-confirm-ok" class="px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5 ${confirmBtnClass}">${confirmText}</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const cleanup = (result) => {
            overlay.remove();
            resolve(result);
        };

        // Klik area gelap di luar card = dianggap cancel
        overlay.addEventListener('click', (e) => { if (e.target === overlay) cleanup(false); });
        overlay.querySelector('#global-confirm-cancel').addEventListener('click', () => cleanup(false));
        overlay.querySelector('#global-confirm-ok').addEventListener('click', () => cleanup(true));
    });
}

/**
 * Fungsi buat nerapin warna tema (primary/accent) via CSS Variable.
 * Dipake berdua sama landing page (theme) & CMS console (cms_global.theme),
 * tinggal beda objek yang dikirim tergantung route lagi di mana.
 * @param {{primary?: string, accent?: string}} themeObj
 */
function applyThemeColor(themeObj) {
    if (!themeObj) return;
    const root = document.documentElement;
    if (themeObj.primary) root.style.setProperty('--color-primary', themeObj.primary);
    if (themeObj.accent) root.style.setProperty('--color-accent', themeObj.accent);
}

/**
 * Fungsi buat load & terapin Google Font secara dinamis khusus scope CMS Console
 * (Cuma ngefek ke div#app, ga ganggu font landing page yang diatur applyGlobalMeta)
 * @param {string} fontName - Nama font, harus persis sama kayak nama di Google Fonts
 */
function applyCmsFont(fontName) {
    const cleanName = (fontName || '').trim();
    if (!cleanName) return;

    // Bangun URL Google Fonts secara dinamis dari nama font yang diinput
    const fontUrlName = cleanName.replace(/\s+/g, '+');
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontUrlName}:wght@300;400;500;600;700;800&display=swap`;

    let linkTag = document.getElementById('cms-dynamic-font');
    if (!linkTag) {
        linkTag = document.createElement('link');
        linkTag.id = 'cms-dynamic-font';
        linkTag.rel = 'stylesheet';
        document.head.appendChild(linkTag);
    }
    if (linkTag.getAttribute('href') !== fontUrl) {
        linkTag.setAttribute('href', fontUrl);
    }

    // Terapin ke scope CMS Console aja (div#app), landing page ga kesenggol
    const appEl = document.getElementById('app');
    if (appEl) appEl.style.fontFamily = `"${cleanName}", sans-serif`;
}

/**
 * Fungsi Pintar untuk Auto-Scale Ukuran Font sesuai Panjang Karakter (CMS-Ready)
 * @param {HTMLElement} element - Elemen HTML yang mau di-scale font-nya
 * @param {number} maxLength - Batas aman karakter sebelum font mulai dikecilkan
 * @param {string} defaultClass - Class Tailwind bawaan saat teks pendek (misal: 'text-xl')
 * @param {string} shrinkClass - Class Tailwind pengganti saat teks kepanjangan (misal: 'text-base')
 */
function autoScaleFont(element, maxLength, defaultClass, shrinkClass) {
    if (!element) return;
    
    const textLength = element.textContent.trim().length;
    
    if (textLength > maxLength) {
        // Hapus class font bawaan yang besar, ganti ke yang lebih kecil
        element.classList.remove(...defaultClass.split(' '));
        element.classList.add(...shrinkClass.split(' '));
    } else {
        // Balikin ke ukuran normal kalau teksnya pendek
        element.classList.remove(...shrinkClass.split(' '));
        element.classList.add(...defaultClass.split(' '));
    }
}