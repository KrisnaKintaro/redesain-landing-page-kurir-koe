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

    // 1. Tembak & Scale Teks General Form
    const elTxtBack = formContainer.querySelector('#txt-back');
    if (elTxtBack && formData.back_text) {
        elTxtBack.textContent = formData.back_text;
        autoScaleFont(elTxtBack, 10, "text-sm", "text-xs");
    }

    const elLblEmail = formContainer.querySelector('#lbl-email');
    if (elLblEmail && formData.email_label) {
        elLblEmail.textContent = formData.email_label;
        autoScaleFont(elLblEmail, 15, "text-[10px]", "text-[8px]");
    }
    formContainer.querySelector('#inp-email').placeholder = formData.email_placeholder;

    const elLblPw = formContainer.querySelector('#lbl-password');
    if (elLblPw && formData.password_label) {
        elLblPw.textContent = formData.password_label;
        autoScaleFont(elLblPw, 15, "text-[10px]", "text-[8px]");
    }
    formContainer.querySelector('#input-password').placeholder = formData.password_placeholder;

    const elLblCaptcha = formContainer.querySelector('#lbl-captcha');
    if (elLblCaptcha && formData.captcha_label) {
        elLblCaptcha.textContent = formData.captcha_label;
        autoScaleFont(elLblCaptcha, 15, "text-[10px]", "text-[8px]");
    }
    formContainer.querySelector('#inp-captcha').placeholder = formData.captcha_placeholder;

    const elTxtRemember = formContainer.querySelector('#txt-remember');
    if (elTxtRemember && formData.remember_text) {
        elTxtRemember.textContent = formData.remember_text;
        autoScaleFont(elTxtRemember, 20, "text-xs", "text-[10px] leading-tight");
    }

    const elBtnSubmit = formContainer.querySelector('#form-submit-btn');
    if (elBtnSubmit && formData.submit_text) {
        elBtnSubmit.textContent = formData.submit_text;
        autoScaleFont(elBtnSubmit, 15, "text-base", "text-sm");
    }

    // 2. Tembak Tema & Scale Teks Spesifik Role
    const elRoleTitle = formContainer.querySelector('#form-role-title');
    if (elRoleTitle && themeData.title) {
        elRoleTitle.textContent = themeData.title;
        // Langsung set className secara utuh
        elRoleTitle.className = "text-xl font-extrabold text-gray-900 mb-1 tracking-tight transition-all duration-300";
        autoScaleFont(elRoleTitle, 14, "text-xl", "text-base sm:text-sm leading-tight");
    }

    const elRoleSubtitle = formContainer.querySelector('#form-role-subtitle');
    if (elRoleSubtitle && themeData.subtitle) {
        elRoleSubtitle.textContent = themeData.subtitle;
        autoScaleFont(elRoleSubtitle, 35, "text-xs", "text-[10px] leading-tight");
    }

    // PERBAIKAN: Set class untuk Icon DAN Background Icon-nya!
    const elRoleIconBg = formContainer.querySelector('#form-role-icon-bg');
    if (elRoleIconBg && themeData.css_icon_bg) {
        elRoleIconBg.className = `w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner ${themeData.css_icon_bg}`;
    }

    const elRoleIcon = formContainer.querySelector('#form-role-icon');
    if (elRoleIcon && themeData.icon) {
        elRoleIcon.className = `fa-solid ${themeData.icon} text-3xl`;
    }

    // 3. Tembak CSS Tailwind untuk input, checkbox, dan tombol submit secara dinamis
    const inputCss = themeData.css_input.split(' ');
    formContainer.querySelectorAll('.input-theme').forEach(input => {
        input.classList.add(...inputCss);
    });
    
    const checkbox = formContainer.querySelector('.checkbox-theme');
    if(checkbox) {
         checkbox.classList.add(...themeData.css_checkbox.split(' '));
    }

    // WAJIB: Render class warna buat tombol submit!
    if(elBtnSubmit) {
        elBtnSubmit.classList.add(...themeData.css_btn.split(' '));
    }

    modalContent.appendChild(formContainer);

    // ==========================================
    // --- INISIASI LOGIC INTERAKTIF FORM --- //
    // ==========================================

    // 1. Logic Tombol Kembali
    const btnBack = document.getElementById('btn-back-options');
    if(btnBack) {
        btnBack.addEventListener('click', () => {
            const formEl = document.getElementById('dynamic-login-form');
            const optionsView = document.getElementById('auth-options-view');
            
            if(formEl && optionsView) {
                // Animasi keluar
                formEl.classList.remove('swap-in');
                formEl.classList.add('swap-out');
                
                setTimeout(() => {
                    formEl.remove(); // Hapus form
                    // Tampilkan kembali opsi role
                    optionsView.classList.remove('hidden', 'swap-out');
                    optionsView.classList.add('swap-in');
                }, 400);
            }
        });
    }

    // 2. Logic Toggle Password Visibility (Mata)
    const btnTogglePw = document.getElementById('btn-toggle-password');
    const inputPw = document.getElementById('input-password');
    const eyeIcon = document.getElementById('eye-icon');
    
    if(btnTogglePw && inputPw && eyeIcon) {
        btnTogglePw.addEventListener('click', () => {
            if (inputPw.type === 'password') {
                inputPw.type = 'text';
                eyeIcon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                inputPw.type = 'password';
                eyeIcon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    }

    // 3. Logic Captcha Interaktif
    const btnRefreshCaptcha = formContainer.querySelector('#btn-refresh-captcha');
    const captchaText = formContainer.querySelector('#captcha-text');
    const inpCaptcha = formContainer.querySelector('#inp-captcha');
    const formEl = formContainer.querySelector('#login-form-element');
    const inpEmail = formContainer.querySelector('#inp-email');
    
    let currentCaptchaAnswer = 0;

    const generateCaptcha = () => {
        if(!btnRefreshCaptcha || !captchaText || !inpCaptcha) return;

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

    if(btnRefreshCaptcha) {
         generateCaptcha();
         btnRefreshCaptcha.addEventListener('click', generateCaptcha);
    }

    if(inpCaptcha) {
        inpCaptcha.addEventListener('input', function() {
            let val = this.value.replace(/[^0-9-]/g, '');
            if (val.indexOf('-') > 0) {
                const isNegative = val.startsWith('-');
                val = val.replace(/-/g, ''); 
                if (isNegative) val = '-' + val; 
            }
            this.value = val;
        });
    }

    // 4. --- FITUR REMEMBER ME (Local Storage) ---
    const savedEmail = localStorage.getItem('kurirkoe_saved_email');
    const checkboxRemember = formContainer.querySelector('#remember-me');
    if (savedEmail && inpEmail && checkboxRemember) {
        inpEmail.value = savedEmail;
        checkboxRemember.checked = true;
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
    if(formEl && inpEmail && inputPw && inpCaptcha && checkboxRemember && elBtnSubmit) {
        formEl.addEventListener('submit', (e) => {
            e.preventDefault();
    
            const emailVal = inpEmail.value.trim();
            const pwVal = inputPw.value.trim();
            const captchaVal = inpCaptcha.value.trim();
    
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
            if (!emailVal) { inpEmail.focus(); return showToast(formData.alerts.email_empty, 'error'); }
            if (!emailPattern.test(emailVal)) { inpEmail.focus(); return showToast(formData.alerts.email_invalid, 'error'); }
            if (!pwVal) { inputPw.focus(); return showToast(formData.alerts.password_empty, 'error'); }
            if (!captchaVal) { inpCaptcha.focus(); return showToast(formData.alerts.captcha_empty, 'error'); }
            
            const userAnswer = parseInt(captchaVal);
            if (userAnswer !== currentCaptchaAnswer) {
                inpCaptcha.focus();
                generateCaptcha(); 
                return showToast(formData.alerts.captcha_wrong, 'error');
            }
    
            if (checkboxRemember.checked) {
                localStorage.setItem('kurirkoe_saved_email', emailVal);
            } else {
                localStorage.removeItem('kurirkoe_saved_email');
            }
    
            const successMsg = formData.alerts.success.replace('{role}', role);
            showToast(successMsg, 'success');
            
            const loadingText = formData.loading_text || "Memproses...";          
            elBtnSubmit.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> ${loadingText}`;
            elBtnSubmit.disabled = true;
            elBtnSubmit.classList.add('opacity-75', 'cursor-not-allowed');
    
            setTimeout(() => {
                const targetUrl = themeData.redirect_url || '#/';
                window.location.href = targetUrl;
            }, 1500);
        });
    }
}