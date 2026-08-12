// core/state.js
const State = {
    data: null,

    // Fungsi untuk load data dari JSON
    async init() {
        try {
            const response = await fetch('./data/content.json');
            if (!response.ok) throw new Error('Gagal memuat konten');
            this.data = await response.json();
            console.log("State berhasil dimuat:", this.data);
        } catch (error) {
            console.error("Error loading state:", error);
            // Fallback data kosong biar aplikasi nggak crash
            this.data = {}; 
        }
    },

    // Fungsi buat ngambil data (dipakai sama komponen nanti)
    get(key) {
        if (!this.data) return null;
        // Kalau butuh key spesifik (misal State.get('hero'))
        if (key) return this.data[key]; 
        return this.data;
    }
};

// Ekspos ke global window biar gampang diakses komponen
window.State = State;