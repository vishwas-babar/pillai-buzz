
const container = document.querySelector('#editor');
let editor;

ClassicEditor.create(container, {
    ckfinder: {
        uploadUrl: '/api/post/create/uploadimage'
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

    showCoverImageModal(title, discription);

});


const coverImageInput = document.querySelector('#cover-image-input');
const coverImageDiv = document.querySelector('#cover-image-div');
const coverImage = document.querySelector('#cover-image');
const coverImageIc = document.querySelector('#cover-image-ic');

coverImageDiv.addEventListener('click', () => coverImageInput.click())

coverImageInput.addEventListener('change', (event) => {

    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            coverImage.src = reader.result;
            coverImageIc.style.display = 'none';
        }
        reader.readAsDataURL(file);
    }
})


const coverImageOverlay = document.querySelector('#cover-image-overlay');
const coverImageModal = document.querySelector('#cover-image-modal');
function showCoverImageModal(title, description) {
    console.log('showCoverImageMOdal is executing...')
    // 
    coverImageModal.style.display = 'block';
    coverImageModal.style.opacity = '1';

    coverImageOverlay.classList.remove('hidden');
    coverImageOverlay.style.opacity = '0.5';


    // add the event listener for add btn 
    const addBtn = document.querySelector("#add-btn");
    addBtn.addEventListener('click', () => {
        let coverImage = coverImageInput.files[0];

        const formData = new FormData();
        formData.append('coverImage', coverImage);
        formData.append('title', title);
        formData.append('description', description);

        axios.post('/api/post/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
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
                addBtn.disabled = false;
                addBtn.textContent = 'Add';
            })

    })
}

coverImageOverlay.addEventListener('click', () => {

    coverImageModal.style.opacity = '0';
    coverImageOverlay.classList.add('hidden')
})