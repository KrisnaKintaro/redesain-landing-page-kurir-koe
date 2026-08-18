async function renderContactUs() {
    let html = await fetchHTML('./components/landing_page/footer/contact_us/contact_us.html');
    
    // Ambil data CMS
    const data = window.State.get('footer_contact') || {
        title: "Hubungi Kami",
        whatsapp: {
            label: "WhatsApp",
            number: "081234567890", 
            display: "+62 81-2345-67890" 
        },
        email: {
            label: "Email",
            address: "cs@kurirkoe.com",
            subject: "[Ganti teks ini dengan tujuan Anda] - Tanya Layanan Kurir Koe"
        }
    };

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const elTitle = tempDiv.querySelector('#footer-contact-title');
    const elList = tempDiv.querySelector('#footer-contact-list');

    // 1. Scale & Inject Judul (Toleransi 15 karakter)
    if (elTitle && data.title) {
        elTitle.textContent = data.title;
        autoScaleFont(elTitle, 15, "font-bold text-primary mb-5 tracking-wide text-base sm:text-lg", "font-bold text-primary mb-5 tracking-wide text-sm sm:text-base");
    }

    if (elList && data.whatsapp && data.email) {
        // REVISI: Tambahkan class penanda font scale (contact-label, contact-display) & transition-all duration-300
        elList.innerHTML = `
            <li>
                <a href="https://wa.me/${data.whatsapp.number}" target="_blank" class="group flex items-start gap-4 text-gray-500 hover:text-accent transition-colors duration-300">
                    <div class="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                        <i class="fa-brands fa-whatsapp text-xl"></i>
                    </div>
                    <div class="flex flex-col">
                        <span class="contact-label text-sm font-bold text-gray-900 mb-0.5 transition-all duration-300">${data.whatsapp.label}</span>
                        <span class="contact-display text-sm transition-all duration-300">${data.whatsapp.display}</span>
                    </div>
                </a>
            </li>
            
            <li>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${data.email.address}&su=${encodeURIComponent(data.email.subject)}" target="_blank" class="group flex items-start gap-4 text-gray-500 hover:text-accent transition-colors duration-300">
                    <div class="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                        <i class="fa-solid fa-envelope text-lg"></i>
                    </div>
                    <div class="flex flex-col">
                        <span class="contact-label text-sm font-bold text-gray-900 mb-0.5 transition-all duration-300">${data.email.label}</span>
                        <span class="contact-display text-sm transition-all duration-300">${data.email.address}</span>
                    </div>
                </a>
            </li>
        `;

        // --- LOGIC AUTO-SCALE FONT INTERNAL LIST ---
        const labelElements = elList.querySelectorAll('.contact-label');
        const displayElements = elList.querySelectorAll('.contact-display');

        // 2. Scale Label (Toleransi 12 karakter)
        if (labelElements[0] && data.whatsapp.label) autoScaleFont(labelElements[0], 12, "text-sm", "text-xs");
        if (labelElements[1] && data.email.label) autoScaleFont(labelElements[1], 12, "text-sm", "text-xs");

        // 3. Scale Teks Isi Konten (Toleransi 18 karakter)
        if (displayElements[0] && data.whatsapp.display) autoScaleFont(displayElements[0], 18, "text-sm", "text-xs");
        if (displayElements[1] && data.email.address) autoScaleFont(displayElements[1], 18, "text-sm", "text-xs");
    }

    return tempDiv.innerHTML;
}

function initContactUsLogic() {
    // Kosongin sementara
}