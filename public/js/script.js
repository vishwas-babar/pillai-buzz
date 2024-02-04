
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



// load the post from database
let page = 0;
let postsPerPage = 3;
sendRequestToBackend(page, postsPerPage);
function sendRequestToBackend() {
    console.log('getting the data from backend')
    axios.get(`/api/post/load?page=${page}&postsPerPage=${postsPerPage}`)
        .then((res) => {
            console.log(res.data);
            page+=1;
            const posts = res.data.posts;

            posts.forEach(post => {
                addPostToPage(post);
            });

            return res.data.posts
        })
        .catch((error) => {
            console.log('error occured');
            console.log(error);
            return null;
        })
}

function addPostToPage(post){

    const { title, reads, likesCount, commentsCount, _id: post_id } = post;
    const { name: authorName, userId: authorUserId, _id: author_id } = post.authorDetails;

    const post_container = document.querySelector('#post-container');


    const postDiv = `
    <div id="post" class="h-fit flex flex-col w-[90%] min-w-[90%] items-center rounded-md pt-4 px-4 shadow-custom-shadow-1">
    <div id="author-info" class="flex justify-start bg-white self-start" data-user_id="${author_id}">
        <div class="size-14 ring-blue-600">
            <img src="/images/user.png" alt="">
        </div>
        <div class="ml-2 mt-2">
            <h2 class="md:text-[20px] text-[18px] font-serif leading-4 ">${authorName}</h2>
            <span class="text-[14px] mt-0">@${authorUserId}</span>
        </div>
    </div>

    <hr >

    <div data-post_id="${post_id}" class="w-full">
        <div class="ml-3 w-full">
            <h1 role="heading" class="md:text-[22px] text-[20px] my-2 font-[500] leading-tight text-neutral-800">
                ${title}
            </h1>
        </div>
        <div
            class="rounded-md w-full h-48 sm:h-52 md:h-68 lg:h-80 overflow-hidden flex items-center justify-center shadow-custom-shadow-1">
            <img class="w-auto h-full" src="/images/news.jpeg" alt="">
        </div>
        <div class="mt-1 flex justify-between w-full relative">
            <div class=" flex justify-start w-full">
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
    div.classList.add("w-full", "flex", "justify-center");

    post_container.appendChild(div);
}

const show_more_btn = document.querySelector('.show-more-btn');
show_more_btn.addEventListener('click', () => {
    sendRequestToBackend(page, postsPerPage);
})
