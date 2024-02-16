


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


    let { name, userId, password, email } = {
        name: event.target.name.value.trim(),
        userId: event.target.userId.value.trim(),
        password: event.target.password.value.trim(),
        email: event.target.email.value.trim()
    }

    if (!name || !userId || !password || !email) {
        showToast('all fields are required!');
        return;
    }

    // add the loading on btn
    const signup_btn = document.querySelector('.signup-btn');
    signup_btn.disabled = true;
    signup_btn.textContent = 'Loading...';

    axios.post('/api/user/signup', {
        name: name,
        userId: userId,
        password: password,
        email: email,
    })
        .then((res) => {

            console.log("response: ", res.data)
            console.log("user_id: ", res.data._id)
            showUploadProfilePhotomodal(res.data._id);

            signup_form.reset();

            // show the profile upload section
            const testBtn = document.querySelector('#test-btn');
            testBtn.click();
        })
        .catch((err) => {
            console.log(err.response.data)
            if (err.response.data.field == 'userId') {
                showToast('this userid is already used by someone');
            }
            else if (err.response.data.field == 'email') {
                showToast('provided email already used for different account')
            }
            else {
                showToast('An error occured. Please try again');
            }
        })
        .finally(() => {
            signup_btn.disabled = false;
            signup_btn.textContent = 'Create';
        });
});


function showToast(message) {
    // Create a div
    const toast = document.createElement('div');

    // Add text to the div
    toast.textContent = message;

    // Style the div
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'black';
    toast.style.color = 'white';
    toast.style.padding = '10px';
    toast.style.borderRadius = '5px';
    toast.style.margin = '0 auto';
    toast.style.zIndex = '1000';

    // Add the div to the body
    document.body.appendChild(toast);

    // Remove the div after 3 seconds
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 3000);
}

function showToastBlue(message) {
    // Create a div
    const toast = document.createElement('div');

    // Add text to the div
    toast.textContent = message;

    // Style the div
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = '#2563EB';
    toast.style.color = 'white';
    toast.style.padding = '10px';
    toast.style.borderRadius = '5px';
    toast.style.margin = '0 auto';
    toast.style.zIndex = '1000';

    // Add the div to the body
    document.body.appendChild(toast);

    // Remove the div after 3 seconds
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 3000);
}

let currentLoggedInUser_id;
function showUploadProfilePhotomodal(user_id) {
    currentLoggedInUser_id = user_id;
    console.log("shwouploadprofilephotomodal is called with id: ", currentLoggedInUser_id)
    console.trace()

    const uploadProfilePart = document.querySelector('#upload-profile-part');
    const signupFormPart = document.querySelector('#signup-form-part');

    // show upload profile part 
    signupFormPart.style.opacity = '0';
    setTimeout(() => {
        signupFormPart.classList.add('hidden');

        uploadProfilePart.classList.remove('hidden');
        uploadProfilePart.style.opacity = '1';
    }, 1000);
    
}

// add event listeners for skip and add btn
const skipProfileBtn = document.querySelector('#skip-profile-btn');
skipProfileBtn.addEventListener('click', () => {
    window.location.href = '/';
});

// submit the profile photo
const uploadProfilePart = document.querySelector('#upload-profile-part');
uploadProfilePart.addEventListener('submit', (event) => {
    event.preventDefault();

    console.log('uploading profile photo to database...for the id: ', currentLoggedInUser_id);

    const fileInput = document.querySelector('input[type="file"');
    const profilePhoto = fileInput.files[0];

    const formData = new FormData();
    formData.append('profilePhoto', profilePhoto);
    formData.append('user_id', currentLoggedInUser_id);

    // show loading until profile not upload
    const profileLoadingLoader =  document.querySelector('#profile-loading-loader');
    const addProfileBtn = document.querySelector('#add-profile-btn');
    addProfileBtn.disabled = true;
    profileLoadingLoader.style.opacity = '1';
    axios.post('/api/user/addprofilephoto', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    })
        .then((res) => {
            console.log(res);

            showToastBlue('profile photo added');
            const profileImgElement = document.querySelector('#profile-img-img');
            profileImgElement.src = res.data.profilePhoto;

            profileLoadingLoader.style.opacity = '0';
            addProfileBtn.disabled = false;
            // redirect user to home page if profile is set succesfully
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        })
        .catch((error) => {
            profileLoadingLoader.style.opacity = '0';
            addProfileBtn.disabled = false;
            showToast('failed to upload profile photo');
            console.log('error: ', error);
        })
})

// click on photo input when clicked on profile img
const profileImgDiv = document.querySelector('#profile-img-div');
profileImgDiv.addEventListener('click', () => {
    const profilePhotoInput = document.querySelector('#profilePhoto-input');
    profilePhotoInput.click();
})


// const test_btn = document.querySelector('.test-btn');
// test_btn.addEventListener('click', () => {
//     showUploadProfilePhotomodal();
// })


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
        showToast('all fields required');
        return;
    }

    // check email validation
    if (!validator.isEmail(email)) {
        showToast('invalid email')
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
            if (err.response.status == 401) {
                showToast('invalid email or password');
            }
        })
        .finally(() => {
            login_btn.disabled = false;
            login_btn.textContent = 'Login';
        })
});
