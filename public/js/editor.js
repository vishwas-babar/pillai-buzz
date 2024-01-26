
const container = document.querySelector('#editor');

ClassicEditor.create(container, {
    ckfinder: {
        uploadUrl: '/path/to/your/upload/script'
    },
    removePlugins: ['CKFinder', 'Logo'],
    placeholder: 'Add discription here...'
}).catch(error => {
    console.error(error);
});


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




