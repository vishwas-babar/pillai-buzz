

// add data to page
const path = window.location.pathname;
console.log( path );
const parts = path.split('/');
console.log(parts);
const postId = parts[2];

axios.get(`/api/post/${postId}`)
.then((res) => {
    const data = res.data;
    console.log(data);
    
    // add data to page
    addPostDataToPage(data);
})
.catch((error) => {
    console.log( error );
})


const addPostDataToPage = (data) => {
    const post = data.postContent;
    const author = data.author;

    let createdAt = new Date(post.createdAt);
    let formatedDate = createdAt.toLocaleDateString("en-IN", {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }); // return data in '31 jan 2024' format
    console.log(formatedDate);
    console.log(typeof formatedDate);

    const author_name = document.querySelector('#author');
    const post_date = document.querySelector('#post-date');
    const heading = document.querySelector('#heading');
    const description = document.querySelector('#description');

    author_name.textContent = author.name;
    post_date.textContent = formatedDate;
    heading.textContent = post.title;
    description.innerHTML = post.discription;
 
    const elements = document.querySelectorAll('#description a');
    elements.forEach(element => {
        element.classList.add('text-blue-600');
    });
}

// show the profile modal
const profile_btn = document.querySelector('#profile-btn');
profile_btn.addEventListener('click', () => {
    const profile_modal = document.querySelector('#profile-modal');
    profile_modal.style.display = 'flex';

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



// made changes in working
// made some changes
