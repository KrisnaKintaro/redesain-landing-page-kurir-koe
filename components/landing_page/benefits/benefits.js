async function renderBenefits() {
    let html = await fetchHTML('./components/landing_page/benefits/benefits.html');
    
    // Ambil data CMS
    const data = window.State.get('benefits') || {
        tagline: "Kenapa Memilih Kami?",
        title: "Keuntungan Ekstra Buat Anda",
        description: "Berbagai alasan mengapa ribuan UMKM dan Mitra Driver mempercayakan bisnisnya pada Kurir Koe.",
        items: [
            { title: "Gratis Jemput Paket", desc: "Satu paket pun kami jemput ke depan pintu tanpa biaya tambahan.", icon: "fa-box-open", color: "text-blue-500", bg: "bg-blue-50" },
            { title: "Harga Khusus UMKM", desc: "Makin sering kirim, ongkir makin murah. Skema tarif flat untuk bisnis lokal.", icon: "fa-tags", color: "text-accent", bg: "bg-yellow-50" },
            { title: "Bagi Hasil Adil", desc: "Potongan aplikasi rendah. Pendapatan Mitra Driver cair setiap hari tanpa ribet.", icon: "fa-hand-holding-dollar", color: "text-green-500", bg: "bg-green-50" },
            { title: "Layanan CS Cepat", desc: "Bukan dilayani robot. Tim CS kami responsif siap bantu kendala 24/7.", icon: "fa-headset", color: "text-red-500", bg: "bg-red-50" }
        ]
    };

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const elTagline = tempDiv.querySelector('#benefits-tagline');
    const elTitle = tempDiv.querySelector('#benefits-title');
    const elDesc = tempDiv.querySelector('#benefits-desc');

    if (elTagline) elTagline.textContent = data.tagline;
    if (elTitle) elTitle.textContent = data.title;
    if (elDesc) elDesc.textContent = data.description;

    const container = tempDiv.querySelector('#benefits-container');

    if (container && data.items) {
        container.innerHTML = '';
        
        data.items.forEach(item => {
            const div = document.createElement('div');
            div.className = "bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col items-start";
            
            div.innerHTML = `
                <div class="w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <i class="fa-solid ${item.icon} text-2xl"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">${item.title}</h3>
                <p class="text-gray-600 leading-relaxed text-sm">${item.desc}</p>
            `;
            container.appendChild(div);
        });
    }

    return tempDiv.innerHTML;
}

function initBenefitsLogic() {
    // Kosongin sementara
}