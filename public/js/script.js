
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
            const profilePhotoModal = document.querySelector('#profile-photo-modal');

            profilePhotoModal.src = user.profilePhoto;
            user_name.textContent = user.name;
            user_id.textContent = '@' + user.userId;

            // change the profile photo 
            const profilePhotoNav = document.querySelector('#profile-photo-nav');
            profilePhotoNav.src = user.profilePhoto;
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



// load the post from database
let page = 0;
let postsPerPage = 3;
sendRequestToBackend(page, postsPerPage);
function sendRequestToBackend() {
    console.log('getting the data from backend')
    axios.get(`/api/post/load?page=${page}&postsPerPage=${postsPerPage}`)
        .then((res) => {
            console.log(res.data);
            page += 1;
            const posts = res.data.posts;

            removePostLoadingSkeleton();

            // add post data to page
            posts.forEach(post => {
                addPostToPage(post);
            });

            // set the event listeners to all profile field and post field 
            setEventListenersToPosts(document.querySelectorAll('#post'));

        })
        .catch((error) => {
            console.log('error occured');
            console.log(error);
        })
}

function setEventListenersToPosts(posts) {

    posts.forEach(post => {

        const author_info = post.querySelector('#author-info');
        author_info.addEventListener('click', (event) => {
            const user_id = event.currentTarget.dataset.user_id;

            // redirect user to specific author profile
            window.location.href = `/profile/${user_id}`;
        });

        const post_field = post.querySelector('#post-field');
        post_field.addEventListener('click', (event) => {
            const post_id = event.currentTarget.dataset.post_id;

            // redirect user to specific post
            window.location.href = `/post/${post_id}`;
        })
    });
}

function addPostToPage(post) {

    const { title, reads, likesCount, commentsCount, _id: post_id } = post;
    const { name: authorName, userId: authorUserId, profilePhoto, _id: author_id } = post.authorDetails;

    const post_container = document.querySelector('#post-container');


    const postDiv = `
    <div id="post"
    class="h-fit flex flex-col w-full min-w-[90%] items-center rounded-md pt-0">
    <div id="author-info" class="flex justify-start bg-white self-start" data-user_id="${author_id}">
        <div class="size-14 ring-blue-600 flex justify-center items-center overflow-hidden">
            <img src="${profilePhoto}" class="h-full w-full rounded-full" alt="">
        </div>
        <div class="ml-2 mt-2">
            <h2 class="md:text-[20px] text-[18px] font-serif leading-4 ">${authorName}</h2>
            <span class="text-[14px] mt-0">@${authorUserId}</span>
        </div>
    </div>

    <hr>

    <div id="post-field" data-post_id="${post_id}" class="w-full">
        <div class="ml-0 w-full">
            <h1 role="heading"
                class="md:text-[22px] text-[20px] my-2 font-[500] leading-tight text-neutral-800">
                ${title}
            </h1>
        </div>
        <div
            class="rounded-md w-full h-48 sm:h-52 md:h-60 lg:h-60 overflow-hidden flex items-center justify-center">

            <img class="w-full h-full object-cover" src="/images/news.jpeg" alt="">
        </div>
        <div class="mt-1 flex justify-between w-full relative">
            <div class=" flex justify-start w-full items-center">
                <a class="comments-btn ml-0">
                    <i class='bx bx-message-rounded'></i>
                    <span>${commentsCount}</span>
                </a>
                <a class="likes-btn ml-3">
                    <i class='bx bx-heart'></i>
                    <span>${likesCount}</span>
                </a>
                <a class="bookmark-btn">
                    <i class='bx bx-bookmark'></i>
                </a>
                <a class="reads-counts">${reads} reads</a>
            </div>
        </div>
    </div>
</div>
    `

    const div = document.createElement('div');
    div.innerHTML = postDiv;
    div.classList.add("w-full", "flex", "justify-center", "border-b", "border-zinc-300");

    post_container.appendChild(div);
}

const show_more_btn = document.querySelector('.show-more-btn');
show_more_btn.addEventListener('click', () => {

    showPostLoadingSkeleton();

    setTimeout(() => {
        sendRequestToBackend(page, postsPerPage);
    }, 3000);

})


function showPostLoadingSkeleton() {
    const post_container = document.querySelector('#post-container');
    const skeleton = `
    <div role="status" class="w-full p-4 border rounded shadow animate-pulse md:p-6 ">
    
    <div class="flex items-center mt-1 mb-4">
       <svg class="w-10 h-10 me-3 text-gray-200 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
        </svg>
        <div>
            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-400 w-32 mb-2"></div>
            <div class="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-400"></div>
        </div>
    </div>

    <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-400 mb-2.5"></div>
      <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-400 w-48 mb-4"></div>

    <div class="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-400">
        <svg class="w-10 h-10 text-gray-200 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
        </svg>
    </div>
    <span class="sr-only">Loading...</span>
</div>
    `;

    for (let i = 0; i < postsPerPage; i++) {

        const skeletonDiv = document.createElement('div');
        skeletonDiv.innerHTML = skeleton;
        skeletonDiv.setAttribute("id", "post-skeleton");
        skeletonDiv.classList.add("w-full", "flex", "justify-center", "transition", "ease-out", "duration-500");

        post_container.appendChild(skeletonDiv);
    }
}

function removePostLoadingSkeleton() {
    const post_skeleton = document.querySelectorAll('#post-skeleton');

    post_skeleton.forEach(element => {
        element.classList.add('opacity-0');
    }); // for adding some animations used the setTimeout when animation is completed then element will be removed

    setTimeout(() => {
        post_skeleton.forEach(element => {
            element.remove();
        });
    }, 500);
}

