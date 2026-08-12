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