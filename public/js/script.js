console.log('script file is connected successfuly')

// on nav btn onclick display the side nav bar
const showSideNavBtn = document.querySelector('#show-side-nav-btn');
const sideNavCloseBtn = document.querySelector('.side-nav-close-btn');

showSideNavBtn.addEventListener('click', () => {
    const sideNav = document.querySelector('.side-nav');
    sideNav.style.marginLeft = '0%';
});

sideNavCloseBtn.addEventListener('click', () => {
    const sideNav = document.querySelector('.side-nav');
    sideNav.style.marginLeft = '-100%';
});

// when the user click outside the side nav bar it will close
// const sideNav = document.querySelector('.side-nav');
// window.addEventListener('click', (e) => {
//     if (sideNav.style.marginLeft === '0%') {
//         // sideNav.style.marginLeft = '-100%';
//         console.log('side nav is closing')
//     }
// });

