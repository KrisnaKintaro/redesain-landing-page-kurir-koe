/**
 * assets/js/global.js
 * Kumpulan fungsi utility yang bisa dipanggil dari seluruh komponen
 */

// Fungsi untuk load file HTML komponen secara asynchronous
async function fetchHTML(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Gagal memuat: ${path}`);
        }
        return await response.text();
    } catch (error) {
        console.error("Error fetching component:", error);
        return `<div class="p-4 text-red-500">Error loading component from ${path}</div>`;
    }
}

// Opsional: Fungsi bantuan buat generate ID unik (berguna kalau bikin elemet dinamis)
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Fungsi Global buat animasi Entrance pas di-scroll
function initScrollReveal() {
    // 1. Tangkap semua bagian utama (section dan footer) secara otomatis
    const sections = document.querySelectorAll('section, footer');
    
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