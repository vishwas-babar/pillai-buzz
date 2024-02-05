console.log('profile.js is connected');
let user_id;

// add content to the profile card on page load
window.onload = function () {
    axios.get('/api/user/info')
        .then((res) => {
            const userInfo = res.data;
            console.log(userInfo);

            const user_name = document.querySelector('#user-name');
            const user_id = document.querySelector('#user-id');

            document.querySelector('#role'); // add the role here
            user_name.textContent = userInfo.name;
            user_id.textContent = userInfo.userId;
        })
        .catch((error) => {
            alert('itnernal server error! please try again later');
        })



    // get the all post of this user
    axios.get(`/api/post/userposts/`)
        .then((res) => {
            console.log(res.data);

        })
        .catch((error) => {
            console.log("error occured when fetching the user posts");
            console.log(error);
        })

}


// show side nav bar
const showSideNavBtn = document.querySelector('#show-side-nav-btn');
const sideNavCloseBtn = document.querySelector('#side-nav-close-btn');
const overlay = document.querySelector('#side-nav-overlay');

showSideNavBtn.addEventListener('click', () => {
    const sideNav = document.querySelector('#side-nav');
    sideNav.style.marginLeft = '0%';

    // add overlay to background
    overlay.style.display = 'block';
});

sideNavCloseBtn.addEventListener('click', () => {
    const sideNav = document.querySelector('#side-nav');
    sideNav.style.marginLeft = '-100%';

    // remove overlay to background
    overlay.style.display = 'none';
});

overlay.addEventListener('click', () => {
    const sideNav = document.querySelector('#side-nav');
    sideNav.style.marginLeft = '-100%';

    // remove overlay to background
    overlay.style.display = 'none';
});