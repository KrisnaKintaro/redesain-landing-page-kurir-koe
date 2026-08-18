async function renderCmsAdminPage() {
    // Panggil komponen master CMS
    const cmsMasterHTML = await renderCmsPageMaster();
    
    return `
        <div id="view-cms-page">
            ${cmsMasterHTML}
        </div>
    `;
}

function initCmsAdminLogic() {
    // Hidupkan logic master CMS
    if (typeof initCmsPageMasterLogic === 'function') initCmsPageMasterLogic();
}