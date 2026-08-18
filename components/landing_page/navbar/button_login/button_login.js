async function renderButtonLogin() {
    let html = await fetchHTML('./components/landing_page/navbar/button_login/button_login.html');
    
    const data = window.State.get('button_login') || { label: "Masuk" };

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Tangkap tombol dan span teksnya (pakai ID yang bener)
    const btnEl = tempDiv.querySelector('#nav-btn-masuk'); 
    const btnText = tempDiv.querySelector('#nav-btn-masuk-text');
    
    if (btnText && data.label) {
        btnText.textContent = data.label;
        autoScaleFont(btnText, 8, "text-sm sm:text-base", "text-[11px] sm:text-xs leading-tight");
    }
    
    // Wajib pakai outerHTML biar ngereturn elemen <button> secara utuh
    return btnEl ? btnEl.outerHTML : '';
}

function initButtonLoginLogic() {

}