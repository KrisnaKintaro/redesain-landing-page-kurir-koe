async function renderContactUs() {
    let html = await fetchHTML('./components/landing_page/footer/contact_us/contact_us.html');
    
    // Ambil data CMS, kita pasang dummy sesuai rikues lu
    const data = window.State.get('footer_contact') || {
        title: "Hubungi Kami",
        whatsapp: {
            label: "WhatsApp",
            number: "081234567890", // Nomor yang didaftarkan ke wa.me
            display: "+62 81-2345-67890" // Teks yang tampil di layar
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

    if (elTitle) elTitle.textContent = data.title;

    if (elList && data.whatsapp && data.email) {
        elList.innerHTML = `
            <!-- Tombol WhatsApp -->
            <li>
                <a href="https://wa.me/${data.whatsapp.number}" target="_blank" class="group flex items-start gap-4 text-gray-500 hover:text-accent transition-colors duration-300">
                    <div class="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                        <i class="fa-brands fa-whatsapp text-xl"></i>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-sm font-bold text-gray-900 mb-0.5">${data.whatsapp.label}</span>
                        <span class="text-sm">${data.whatsapp.display}</span>
                    </div>
                </a>
            </li>
            
            <!-- Tombol Email -->
            <li>
                <!-- Kita ganti mailto: pakai link web compose Gmail -->
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${data.email.address}&su=${encodeURIComponent(data.email.subject)}" target="_blank" class="group flex items-start gap-4 text-gray-500 hover:text-accent transition-colors duration-300">
                    <div class="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                        <i class="fa-solid fa-envelope text-lg"></i>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-sm font-bold text-gray-900 mb-0.5">${data.email.label}</span>
                        <span class="text-sm">${data.email.address}</span>
                    </div>
                </a>
            </li>
        `;
    }

    return tempDiv.innerHTML;
}

function initContactUsLogic() {
    // Kosongin sementara
}