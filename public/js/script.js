console.log('script file is connected successfuly')

// on nav btn onclick display the side nav bar
const showSideNavBtn = document.querySelector('#show-side-nav-btn');
const sideNavCloseBtn = document.querySelector('.side-nav-close-btn');

showSideNavBtn.addEventListener('click', () => {
    const sideNav = document.querySelector('.side-nav');
    sideNav.style.marginLeft = '0%';

    // add overlay to background
    const overlay = document.querySelector('#side-nav-overlay');
    overlay.style.display = 'block';
});

sideNavCloseBtn.addEventListener('click', () => {
    const sideNav = document.querySelector('.side-nav');
    sideNav.style.marginLeft = '-100%';

    // remove overlay to background
    const overlay = document.querySelector('#side-nav-overlay');
    overlay.style.display = 'none';
});


// on overlay click close the side nav bar
const overlay = document.querySelector('#side-nav-overlay');
overlay.addEventListener('click', () => {
    const sideNav = document.querySelector('.side-nav');
    sideNav.style.marginLeft = '-100%';

    // remove overlay to background
    overlay.style.display = 'none';
});


// show the profile modal
const profile_btn = document.querySelector('#profile-btn');
profile_btn.addEventListener('click', () => {
    const profile_modal = document.querySelector('#profile-modal');
    profile_modal.style.display = 'flex';


    // // add user data to user modal
    // axios.get('/api/user/info')
    // .then((res) => {
    //     const user = res.data;
    //     console.log(user);

    //     // change the content modal
    //     const user_name = document.querySelector('#user-name');
    //     const user_id = document.querySelector('#user-id');

    //     user_name.textContent = user.name;
    //     user_id.textContent = user.userId;
    // })



    if (window.innerWidth <= 600) {
        overlay.style.display = 'block';

        overlay.addEventListener('click', () => {
            profile_modal.style.display = 'none';
            overlay.style.display = 'none';
        })
    } else {

        // set timeout to close the modal, if cursor is not hovered on modal then close it
        modalTimeOut = setTimeout(() => {
            profile_modal.style.display = 'none';
        }, 3000);

        // if cursor is hovered on modal then clear the timeout
        profile_modal.addEventListener('mouseenter', () => {
            clearTimeout(modalTimeOut);
        });

        // if cursor is leaved from modal then set the timeout again for 1s and close it
        profile_modal.addEventListener('mouseleave', () => {
            modalTimeOut = setTimeout(() => {
                profile_modal.style.display = 'none';
                overlay.style.display = 'none';
            }, 1000);
        });
    }

});


// onload event
window.onload = function () {
    // add user data to user modal
    axios.get('/api/user/info')
        .then((res) => {
            const user = res.data;
            console.log(user);

            // change the content modal
            const user_name = document.querySelector('#user-name');
            const user_id = document.querySelector('#user-id');

            user_name.textContent = user.name;
            user_id.textContent = '@' + user.userId;
        })
        .catch((error) => {
            console.log(error);
        })

}


// sign out the user
const signout_btn = document.querySelector('#sign-out');
signout_btn.addEventListener('click', () => {
    // remove the user from local storage and send request to server to remove the user from session

    axios.post('/api/user/signout')
        .then((res) => {
            document.cookie = 'uid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; // remove the cookie
            window.location.href = '/login';
        })
        .catch((err) => {
            console.log(err);
            alert('An error occurred. Please try again.');
        })
});


// set the user name and userid in profile modal
const user_name = document.querySelector('#user-name');
const user_id = document.querySelector('#user-id');

user_name.textContent = cookie



