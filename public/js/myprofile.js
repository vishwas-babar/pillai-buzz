console.log('myprofile.js is connected');
let user_id;
let postCount;

// add content to the profile card on page load
window.onload = async function () {
    
    await requestUserInfo(); // get the users data 

    showPostLoadingSkeleton(); // show loading skeleton until we got the posts data from backend
    
    
     await requestUserPosts(); // get all posts of user
    
    
}

async function requestUserInfo() {

    await axios.get('/api/user/info')
        .then((res) => {
            const userInfo = res.data;
            user_id = userInfo._id;
            postCount = userInfo.postCount;

            console.log(res.data);

            const user_name = document.querySelector('#user-name');
            const userId = document.querySelector('#user-id');

            document.querySelector('#role'); // add the role here
            user_name.textContent = userInfo.name;
            userId.textContent = userInfo.userId;
        })
        .catch((error) => {
            console.log(error)
            alert('itnernal server error! please try again later');
        })
}

async function requestUserPosts(){
    await axios.get(`/api/post/userposts/${user_id}`)
        .then((res) => {
            console.log(res.data);
            const posts = res.data.posts;

            removePostLoadingSkeleton();

            if(posts.length == 0){
                userHasNOPosts(); // if users dont have any post
            }

            // add all post to page
            posts.forEach(post => {
                addPostToPage(post);
            });


            // set the click event listeners to all posts
            setEventListenersToPosts();
        })
        .catch((error) => {
            console.log("error occured when fetching the user posts");
            console.log(error);
        })
}

function userHasNOPosts() {
    const postContainer = document.querySelector('#post-container');

    postContainer.innerHTML = '<p>not posted anything yet</p>';
}


function addPostToPage(post) {

    const { title, reads, likesCount, commentsCount, _id: post_id } = post;
    const { name: authorName, userId: authorUserId, _id: author_id } = post.authorDetails;

    const post_container = document.querySelector('#post-container');

    const postDiv = `
    <div id="post"
    class="h-fit flex flex-col w-full min-w-[90%] items-center rounded-md pt-0">
    <div id="author-info" class="flex justify-start bg-white self-start" data-user_id="${author_id}">
        <div class="size-14 ring-blue-600">
            <img src="/images/user.png" alt="">
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


function showPostLoadingSkeleton() {
    const post_container = document.querySelector('#post-container');
    const skeleton = `
    <div role="status" class="w-[90%] p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700">
    
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

    for (let i = 0; i < postCount; i++) { 

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

function setEventListenersToPosts() {
    const post_field = document.querySelectorAll('#post-field');

    // for redirecting to the post
    post_field.forEach(element => {
        element.addEventListener('click', (event) => {
            const currentPostField = event.currentTarget;
            const user_id = currentPostField.dataset.post_id;
    
            window.location.href =  `/post/${user_id}`;
        })
    });


    // for redirecting to author profile
    const authorField = document.querySelectorAll('#author-info');
    authorField.forEach(element => {
        element.addEventListener('click', () => {
            window.scrollTo(0, 0); // scroll users to top when user click on the author field
        })
    });
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