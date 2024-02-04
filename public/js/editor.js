
const container = document.querySelector('#editor');
let editor;

ClassicEditor.create(container, {
    ckfinder: {
        uploadUrl: '/path/to/your/upload/script'
    },
    removePlugins: ['CKFinder', 'Logo'],
    placeholder: 'Add discription here...'
})
    .then(newEditor => {
        editor = newEditor;
    })
    .catch(error => {
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


const publishBtn = document.querySelector('.publish-btn');

publishBtn.addEventListener('click', () => {
    const title = document.querySelector('.heading-input').value;
    const discription = editor.getData();
    console.log(title, discription);

    if (!title || !discription) {
        alert('all fields required');
        return;
    }

    // add the loading on btn
    publishBtn.disabled = true;
    publishBtn.textContent = 'Sending...';

    axios.post('/api/post/create', {
        title: title,
        discription: discription,
    })
        .then((res) => {
            alert('post created successfully');
            window.location.href = '/';
        })
        .catch((err) => {
            console.log(err.response.data)
            alert('An error occurred. Please try again.');
        })
        .finally(() => {
            publishBtn.disabled = false;
            publishBtn.textContent = 'Publish';
        })
});
