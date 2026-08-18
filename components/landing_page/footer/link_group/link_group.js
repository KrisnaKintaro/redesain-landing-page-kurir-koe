async function renderLinkGroup() {
  let html = await fetchHTML(
    "./components/landing_page/footer/link_group/link_group.html",
  );

  // Ambil data CMS
  const data = window.State.get("link_groups") || [
    {
      title: "Perusahaan",
      links: [
        { label: "Tentang Kami", url: "#/" },
        { label: "Karir", url: "#/" },
        { label: "Blog", url: "#/" },
      ],
    },
    {
      title: "Layanan",
      links: [
        { label: "Kurir Motor", url: "#/" },
        { label: "Kurir Mobil", url: "#/" },
        { label: "Corporate", url: "#/" },
      ],
    },
  ];

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const container = tempDiv.querySelector("#footer-link-groups-container");

  if (container && data.length > 0) {
    container.innerHTML = ""; 

    data.forEach((group) => {
      const groupDiv = document.createElement("div");
      groupDiv.className = "flex flex-col min-w-[120px]";

      // Looping untuk bikin elemen <li> nya
      let linksHTML = "";
      group.links.forEach((link) => {
        // REVISI: Teks link dibungkus <span> dengan class 'footer-link-text' & transition-all
        linksHTML += `
                    <li>
                        <a href="${link.url}" class="text-gray-500 hover:text-accent transition-colors duration-300 text-sm sm:text-base flex items-center gap-2 whitespace-nowrap">
                            <span class="w-1.5 h-1.5 rounded-full bg-accent opacity-0 transition-opacity duration-300 -ml-3 group-hover:opacity-100"></span>
                            <span class="footer-link-text text-sm sm:text-base transition-all duration-300">${link.label}</span>
                        </a>
                    </li>
                `;
      });

      // REVISI: Tambah class 'footer-group-title' & transition-all duration-300 di h4
      groupDiv.innerHTML = `
        <h4 class="footer-group-title font-bold text-primary mb-5 tracking-wide text-base sm:text-lg transition-all duration-300">${group.title}</h4>
        <ul class="flex flex-col gap-3">
            ${linksHTML}
        </ul>
    `;

      // --- LOGIC AUTO-SCALE FONT ---
      
      // 1. Scale Judul Grup Link (Toleransi 12 karakter)
      const titleEl = groupDiv.querySelector('.footer-group-title');
      if (titleEl && group.title) {
          autoScaleFont(titleEl, 12, "text-base sm:text-lg", "text-sm sm:text-base");
      }

      // 2. Scale Masing-masing Label Link di dalamnya (Toleransi 15 karakter)
      const linkElements = groupDiv.querySelectorAll('.footer-link-text');
      group.links.forEach((link, idx) => {
          const el = linkElements[idx];
          if (el && link.label) {
              autoScaleFont(el, 15, "text-sm sm:text-base", "text-xs sm:text-sm");
          }
      });

      container.appendChild(groupDiv);
    });
  }

  return tempDiv.innerHTML;
}

function initLinkGroupLogic() {
  // Kosongin sementara
}