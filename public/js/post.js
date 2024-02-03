

// add data to page
const path = window.location.pathname;
const parts = path.split('/');
const postId = parts[2];

axios.get(`/api/post/${postId}`)
    .then((res) => {
        const data = res.data;
        console.log(data);

        // add data to page
        addPostDataToPage(data);

        // add number of likes to page
        const like_count = document.querySelector('#like-btn span');
        like_count.textContent = data.likesCount;
    })
    .catch((error) => {
        const description = document.querySelector('#description');
        description.textContent = 'Post not found';
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
window.onload = async function () {
    // add user data to user modal
    await axios.get('/api/user/info')
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
    document.body.style.overflow = 'hidden';
});

sideNavCloseBtn.addEventListener('click', () => {
    const sideNav = document.querySelector('#side-nav');
    sideNav.style.marginLeft = '-100%';

    // remove overlay to background
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto'
});

overlay.addEventListener('click', () => {
    const sideNav = document.querySelector('#side-nav');
    sideNav.style.marginLeft = '-100%';

    // remove overlay to background
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto';

    // close the comment modal 
    const comment_modal = document.querySelector('#comment-modal');
    comment_modal.style.display = 'none';
});



//add the like to post
const like_btn = document.querySelector('#like-btn');
like_btn.addEventListener('click', () => {


    axios.post(`/api/post/${postId}/like`)
        .then((res) => {
            const data = res.data;
            const count = document.querySelector('#like-btn span');
            count.textContent = data.likesCount;
        })
        .catch((error) => {
            console.log(error)
            showToast('failed to like the post');
        })
})

function showToast(message) {
    // Create a div
    const toast = document.createElement('div');

    // Add text to the div
    toast.textContent = message;

    // Style the div
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'black';
    toast.style.color = 'white';
    toast.style.padding = '10px';
    toast.style.borderRadius = '5px';
    toast.style.margin = '0 auto';
    toast.style.zIndex = '1000';

    // Add the div to the body
    document.body.appendChild(toast);

    // Remove the div after 3 seconds
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 3000);
}


// show the comment modal onclick
const comment_btn = document.querySelector('#comment-btn');
comment_btn.addEventListener('click', () => {
    console.log('event triggered')
    const comment_modal = document.querySelector('#comment-modal');
    const overlay = document.querySelector('#side-nav-overlay');

    comment_modal.style.display = 'flex';
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';

    axios.get(`/api/post/${postId}/comments`)
    .then((res) => {
        console.log('success');
        console.log(res.data);
    })
    .catch((error) => {
        console.log(error);
    })
})

// send post request to post comment
const add_comment_btn = document.querySelector('#add-comment-btn');
add_comment_btn.addEventListener('click', () => {

    const content = document.querySelector('#comment-input').value;

    if (content.trim() == "") {
        alert('enter some text');
        return;
    }

    // send the post request 
    axios.post(`/api/post/${postId}/addcomment`, {
        content: content,
    })
        .then((res) => {
            addRecentComment(res.data);

            document.querySelector('#comment-input').value = '';
        })
        .catch((error) => {
            console.log(error)
        })
})


const addRecentComment = (data) => {
    console.log(data);
    let userName = data.author.name;
    let userId = data.author.userId;
    let content = data.comment.content;
    let comment_section = document.querySelector('#comment-section');

    let postedComment = `
    <div id="comment" class="flex flex-col">

                <div class="flex gap-2">

                    <img class="size-10 rounded-full" src="/images/user.png" alt="">

                    <!-- user info of commented user -->
                    <div class="rounded-md rounded-tl-none bg-slate-200 px-2 py-3 w-full flex flex-col gap-3">
                        <div class="flex items-center justify-start">
                            <div class="flex flex-col ml-2">
                                <h2 id="commented-user-name" class="leading-3 text-[16px] font-[500]">
                                    ${userName}
                                </h2>
                                <span id="commented-user-id" class="leading-3 mt-1 text-[12px]">
                                    ${'@' + userId}
                                </span>
                            </div>
                        </div>

                        <div class="text-[15px]" id="comment-content">
                            ${content}
                        </div>
                    </div>
                </div>


                <a id="comment-like-btn" class="ml-[55px] w-fit flex items-center gap-3 cursor-pointer">
                    <span class="text-[14px]">Like</span>
                    <div class="size-1 rounded-full bg-black"></div>
                    <span class="text-[12px]">0</span>
                </a>
            </div>
    `;

    let div = document.createElement('div');
    div.innerHTML = postedComment;

    comment_section.prepend(div);
}