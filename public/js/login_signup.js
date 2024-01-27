

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

    axios.post('/api/user/signup', {
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
            if (err.response.data.field == 'userId') {
                alert('this userid is already used by someone');
            }
            else if (err.response.data.field == 'email') {
                alert('provided email already used for different account');
            }
            else {
                alert('An error occurred. Please try again.');
            }
        })
        .finally(() => {
            signup_btn.disabled = false;
            signup_btn.textContent = 'Create';
        });
});


// send request to server for login
const login_form = document.querySelector('.login-form');
login_form.addEventListener('submit', (event) => {
    event.preventDefault();

    let { email, password } = {
        email: event.target.email.value.trim(),
        password: event.target.password.value.trim(),
    }

    // check email validation
    if (!email || !password) {
        alert('all fields required');
        return;
    }

    // check email validation
    if (!validator.isEmail(email)) {
        alert('invalid email');
        return;
    }

    // add the loading on btn
    const login_btn = document.querySelector('.login-btn');
    login_btn.disabled = true;
    login_btn.textContent = 'Loading...';

    axios.post('/api/user/login', {
        email: email,
        password: password
    })
        .then((res) => {
            console.log(res);
            window.location.href = '/';
        })
        .catch((err) => {
            if(err.response.status == 401) {
                alert('invalid email or password');
            }
        })
        .finally(() => {
            login_btn.disabled = false;
            login_btn.textContent = 'Login';
        })
});
