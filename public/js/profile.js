console.log('profile.js is connected');

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