

const register_btn = document.querySelector('.register-btn');
const switch_login_btn = document.querySelector('.switch-login-btn');
const innerFormContainer = document.querySelector('.inner-form-container');

register_btn.addEventListener('click', () => {
    innerFormContainer.style.transform = 'rotateY(0deg)';
});

switch_login_btn.addEventListener('click', () => {
    innerFormContainer.style.transform = 'rotateY(180deg)';
});


// signup form
const signup_form = document.querySelector('.signup-form');
signup_form.addEventListener('submit', (event) => {
    event.preventDefault();


    
    let { userId, password, email } = {
        userId: event.target.userid.value.trim(),
        password: event.target.password.value.trim(),
        email: event.target.email.value.trim()
    }
    
    if (!userId || !password || !email) {
        alert('all fields required');
        return;
    }

    // add the loading on btn
    const signup_btn = document.querySelector('.signup-btn');
    signup_btn.disabled = true;
    signup_btn.textContent = 'Loading...';

    axios.post('/api/user', {
        userId: userId,
        password: password,
        email: email,
    })
        .then((res) => {
            alert('user created successfully');
            innerFormContainer.style.transform = 'rotateY(180deg)';
            signup_form.reset();
        })
        .catch((err) => {
            console.log(err.response.data)
            if(err.response.data.field == 'userId'){
                alert('this userid is already used by someone');
            }
            else if(err.response.data.field == 'email') {
                alert('provided email already used for different account');
            }
            else{
                alert('An error occurred. Please try again.');
            }
        })
        .finally(() => {
            signup_btn.disabled = false;
            signup_btn.textContent = 'Create';
        });
});
