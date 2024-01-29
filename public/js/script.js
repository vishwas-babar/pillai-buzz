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
overlay.addEventListener('click', () =>{
    const sideNav = document.querySelector('.side-nav');
    sideNav.style.marginLeft = '-100%';

    // remove overlay to background
    overlay.style.display = 'none';
});



