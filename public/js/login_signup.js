

const register_btn = document.querySelector('.register-btn');
const switch_login_btn = document.querySelector('.switch-login-btn');
const innerFormContainer = document.querySelector('.inner-form-container');

register_btn.addEventListener('click', ()=>{
    innerFormContainer.style.transform = 'rotateY(0deg)';
});

switch_login_btn.addEventListener('click', ()=>{
    innerFormContainer.style.transform = 'rotateY(180deg)';
});