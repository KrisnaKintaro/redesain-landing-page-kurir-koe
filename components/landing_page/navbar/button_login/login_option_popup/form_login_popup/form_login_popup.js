async function renderFormLoginPopup(role) {
    let html = await fetchHTML('./components/landing_page/navbar/button_login/login_option_popup/form_login_popup/form_login_popup.html');
    
    // --- AMBIL DATA DARI CMS ---
    const data = window.State.get('login_modal');
    if (!data || !data.form) return;
    
    const formData = data.form;
    const themeData = formData.themes[role]; // 'karyawan' atau 'admin'

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const formContainer = tempDiv.querySelector('#dynamic-login-form');
    const modalContent = document.getElementById('auth-modal-content');
    if (!modalContent) return;

    const existingForm = document.getElementById('dynamic-login-form');
    if (existingForm) existingForm.remove();

    // 1. Tembak Teks General Form
    formContainer.querySelector('#txt-back').textContent = formData.back_text;
    formContainer.querySelector('#lbl-email').textContent = formData.email_label;
    formContainer.querySelector('#inp-email').placeholder = formData.email_placeholder;
    formContainer.querySelector('#lbl-password').textContent = formData.password_label;
    formContainer.querySelector('#input-password').placeholder = formData.password_placeholder;
    formContainer.querySelector('#lbl-captcha').textContent = formData.captcha_label;
    formContainer.querySelector('#inp-captcha').placeholder = formData.captcha_placeholder;
    formContainer.querySelector('#txt-remember').textContent = formData.remember_text;
    formContainer.querySelector('#form-submit-btn').textContent = formData.submit_text;

    // 2. Tembak Tema & Teks Spesifik Role
    formContainer.querySelector('#form-role-title').textContent = themeData.title;
    formContainer.querySelector('#form-role-subtitle').textContent = themeData.subtitle;
    formContainer.querySelector('#form-role-icon').className = `fa-solid ${themeData.icon} text-2xl`;
    
    formContainer.querySelector('#form-role-icon-bg').className = `w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-inner transition-colors duration-300 ${themeData.css_icon_bg}`;
    formContainer.querySelector('#form-submit-btn').className = `w-full font-bold py-2.5 px-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none ${themeData.css_btn}`;

    // 3. Tembak CSS Tailwind untuk input & checkbox secara dinamis
    const inputCss = themeData.css_input.split(' ');
    formContainer.querySelectorAll('.input-theme').forEach(input => {
        input.classList.add(...inputCss);
    });
    formContainer.querySelector('.checkbox-theme').classList.add(...themeData.css_checkbox.split(' '));

    modalContent.appendChild(formContainer);

    // --- INISIASI LOGIC INTERAKTIF FORM --- //
    
    // 1. Logic Tombol Kembali
    const btnBack = document.getElementById('btn-back-options');
    btnBack.addEventListener('click', () => {
        const formEl = document.getElementById('dynamic-login-form');
        const optionsView = document.getElementById('auth-options-view');
        
        // Animasi keluar
        formEl.classList.remove('swap-in');
        formEl.classList.add('swap-out');
        
        setTimeout(() => {
            formEl.remove(); // Hapus form
            // Tampilkan kembali opsi role
            optionsView.classList.remove('hidden', 'swap-out');
            optionsView.classList.add('swap-in');
        }, 400);
    });

    // 2. Logic Toggle Password Visibility (Mata)
    const btnTogglePw = document.getElementById('btn-toggle-password');
    const inputPw = document.getElementById('input-password');
    const eyeIcon = document.getElementById('eye-icon');
    
    btnTogglePw.addEventListener('click', () => {
        if (inputPw.type === 'password') {
            inputPw.type = 'text';
            eyeIcon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            inputPw.type = 'password';
            eyeIcon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });

    // 3. Logic Captcha Interaktif
    const btnRefreshCaptcha = formContainer.querySelector('#btn-refresh-captcha');
    const captchaText = formContainer.querySelector('#captcha-text');
    const inpCaptcha = formContainer.querySelector('#inp-captcha');
    const formEl = formContainer.querySelector('#login-form-element');
    const inpEmail = formContainer.querySelector('#inp-email');
    const inpPassword = formContainer.querySelector('#input-password');
    const checkbox = formContainer.querySelector('#remember-me');
    const elBtnSubmit = formContainer.querySelector('#form-submit-btn'); 
    
    let currentCaptchaAnswer = 0;
    const generateCaptcha = () => {
        const icon = btnRefreshCaptcha.querySelector('i');
        if (icon) {
            icon.classList.add('animate-spin');
            setTimeout(() => icon.classList.remove('animate-spin'), 500);
        }
        const ops = ['+', '-'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let num1 = Math.floor(Math.random() * 10) + 1;
        let num2 = Math.floor(Math.random() * 10) + 1; 
                  
        if (op === '+') {
            currentCaptchaAnswer = num1 + num2;
        } else {
            currentCaptchaAnswer = num1 - num2;
        }
        
        captchaText.textContent = `${num1} ${op} ${num2} = ?`;
        inpCaptcha.value = ''; 
    };
    generateCaptcha();
    btnRefreshCaptcha.addEventListener('click', generateCaptcha);

    inpCaptcha.addEventListener('input', function() {
        let val = this.value.replace(/[^0-9-]/g, '');
        if (val.indexOf('-') > 0) {
            const isNegative = val.startsWith('-');
            val = val.replace(/-/g, ''); 
            if (isNegative) val = '-' + val; 
        }
        this.value = val;
    });

    // 4. --- FITUR REMEMBER ME (Local Storage) ---
    const savedEmail = localStorage.getItem('kurirkoe_saved_email');
    if (savedEmail) {
        inpEmail.value = savedEmail;
        checkbox.checked = true; // Sekarang checkbox-nya udah dikenali!
    }

    // 5. --- FITUR CUSTOM TOAST NOTIFICATION ---
    const showToast = (message, type = 'error') => {
        const existingToast = formContainer.querySelector('.custom-toast');
        if (existingToast) existingToast.remove();
        const toast = document.createElement('div');
        const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
        const iconType = type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check';
        
        toast.className = `custom-toast absolute top-0 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-white text-sm font-bold shadow-lg z-[1000] flex items-center gap-2 transition-all duration-300 transform -translate-y-4 opacity-0 w-max max-w-full text-center ${bgColor}`;
        toast.innerHTML = `<i class="fa-solid ${iconType}"></i> <span>${message}</span>`;
        
        formContainer.appendChild(toast);
        requestAnimationFrame(() => {
            toast.classList.remove('-translate-y-4', 'opacity-0');
            toast.classList.add('translate-y-4', 'opacity-100');
        });
        setTimeout(() => {
            toast.classList.remove('translate-y-4', 'opacity-100');
            toast.classList.add('-translate-y-4', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // 6. Validasi Submit Form
    formEl.addEventListener('submit', (e) => {
        e.preventDefault(); 
        const emailVal = inpEmail.value.trim();
        const pwVal = inpPassword.value.trim();
        const captchaVal = inpCaptcha.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailVal) { inpEmail.focus(); return showToast(formData.alerts.email_empty, 'error'); }
        if (!emailPattern.test(emailVal)) { inpEmail.focus(); return showToast(formData.alerts.email_invalid, 'error'); }
        if (!pwVal) { inpPassword.focus(); return showToast(formData.alerts.password_empty, 'error'); }
        if (!captchaVal) { inpCaptcha.focus(); return showToast(formData.alerts.captcha_empty, 'error'); }
        
        const userAnswer = parseInt(captchaVal);
        if (userAnswer !== currentCaptchaAnswer) {
            inpCaptcha.focus();
            generateCaptcha(); 
            return showToast(formData.alerts.captcha_wrong, 'error');
        }

        if (checkbox.checked) {
            localStorage.setItem('kurirkoe_saved_email', emailVal);
        } else {
            localStorage.removeItem('kurirkoe_saved_email');
        }

        const successMsg = formData.alerts.success.replace('{role}', role);
        showToast(successMsg, 'success');
        
        const originalBtnText = elBtnSubmit.textContent;
        elBtnSubmit.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Memproses...`;
        elBtnSubmit.disabled = true;
        elBtnSubmit.classList.add('opacity-75', 'cursor-not-allowed');

        // FITUR BARU: Ambil URL dari JSON (CMS)
        setTimeout(() => {
            // URL target otomatis ngambil dari konfigurasi themeData.redirect_url di CMS
            const targetUrl = themeData.redirect_url || '#/';
            window.location.href = targetUrl;
        }, 1500);
    });
}