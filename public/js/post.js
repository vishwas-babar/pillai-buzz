

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

    const authorProfilePhoto = document.querySelector('#author-profile-photo');
    const author_name = document.querySelector('#author');
    const post_date = document.querySelector('#post-date');
    const heading = document.querySelector('#heading');
    const description = document.querySelector('#description');

    authorProfilePhoto.src = author.profilePhoto;
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
            const profilePhotoNav = document.querySelector('#profile-photo-nav');
            const profilePhotoModal = document.querySelector('#profile-photo-modal')
            const user_name = document.querySelector('#user-name');
            const user_id = document.querySelector('#user-id');

            profilePhotoNav.src = user.profilePhoto;
            profilePhotoModal.src = user.profilePhoto;
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

            const like_btn_ic = document.querySelector('#like-btn i');
            like_btn_ic.style.color = '#2563EB';
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
            const comments = res.data.comments;
            // console.log(comments[0].comments);

            comments.forEach(comment => {
                addCommentDataInCommentSection(comment.comments);
            });

            addEventListenerToLikeBtns(); // after creating comment div add eventlisteners to their all likes btns
        })
        .catch((error) => {
            console.log(error);
        })
})


// function for addding comments in page 
function addCommentDataInCommentSection(comment) {

    let profilePhoto = comment.authorProfilePhoto;
    let userName = comment.authorName;
    let userId = comment.authorUserId;
    let content = comment.content;
    let commentId = comment._id;
    let commentLikes = comment.likes.length;
    console.log('comments likes: ', commentLikes)
    let comment_section = document.querySelector('#comment-section');

    let postedComment = `<div id="comment" class="flex flex-col" data-comment-id="${commentId}">

    <div class="flex gap-2">

        <img class="size-10 rounded-full" src="${profilePhoto}" alt="">

        <!-- user info of commented user -->
        <div class="rounded-md rounded-tl-none bg-slate-200 px-2 py-3 w-full flex flex-col gap-3">
            <div class="flex items-center justify-start">
                <div class="flex flex-col ml-2">
                    <h2 id="commented-user-name" class="leading-3 text-[16px] font-[500]">
                        ${userName}
                    </h2>
                    <span id="commented-user-id" class="leading-3 mt-1 text-[12px]">
                        ${userId}
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
        <div class="flex items-center justify-center gap-1">
            <img  class="size-[18px] transition-all duration-300 ease-linear scale-on-click" src="/images/blue-like-ic.png" alt="">
            <span id="likes-count" class="text-[12px]">${commentLikes}</span>
        </div>
    </a>
</div>`;

    let div = document.createElement('div');
    div.innerHTML = postedComment;

    comment_section.appendChild(div);

}


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
});


const addRecentComment = (data) => {
    console.log(data);
    let profilePhoto = data.author.profilePhoto;
    let userName = data.author.name;
    let userId = data.author.userId;
    let content = data.comment.content;
    let commentId = data.comment._id;
    let comment_section = document.querySelector('#comment-section');

    let postedComment = `<div id="comment" class="flex flex-col" data-comment-id="${commentId}">

    <div class="flex gap-2">

        <img class="size-10 rounded-full" src="${profilePhoto}" alt="">

        <!-- user info of commented user -->
        <div class="rounded-md rounded-tl-none bg-slate-200 px-2 py-3 w-full flex flex-col gap-3">
            <div class="flex items-center justify-start">
                <div class="flex flex-col ml-2">
                    <h2 id="commented-user-name" class="leading-3 text-[16px] font-[500]">
                        ${userName}
                    </h2>
                    <span id="commented-user-id" class="leading-3 mt-1 text-[12px]">
                        ${userId}
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
        <div class="flex items-center justify-center gap-1">
            <img  class="size-[18px] transition-all duration-300 ease-linear scale-on-click" src="/images/blue-like-ic.png" alt="">
            <span id="likes-count" class="text-[12px]">0</span>
        </div>
    </a>
</div>`;

    let div = document.createElement('div');
    div.innerHTML = postedComment;

    comment_section.prepend(div);


    addEventListenerToLikeBtns();
}

// like the comments
function addEventListenerToLikeBtns() {
    const comment_like_btn = document.querySelectorAll('#comment-like-btn');
    comment_like_btn.forEach(element => {

        element.addEventListener('click', (event) => {
            const element = event.currentTarget;

            const commentDiv = element.closest('#comment');
            const commentId = commentDiv.dataset.commentId;

            console.log('liking the post......')
            axios.post(`/api/post/${postId}/likethecomment/${commentId}`)
                .then((res) => {
                    console.log(res.data);
                    const likes_count = element.querySelector('#likes-count');
                    likes_count.textContent = res.data.commentLikesCount;
                })
                .catch((error) => {
                    console.log(error);
                })
        })
    });
}


// bookmark the post
const bookmark_btn = document.querySelector('#bookmark-btn');
bookmark_btn.addEventListener('click', () => {

    console.log("bookmark event called")
    // send the post request
    axios.post(`/api/post/${postId}/bookmark`)
        .then((res) => {
            console.log(res);
            const bookmark_ic = document.querySelector('#bookmark-btn i');

            bookmark_ic.style.color = '#2563EB';
        })
        .catch((error) => {
            console.log(error);
        })
});


// share the post
const share_btn = document.querySelector('#share-btn');
share_btn.addEventListener('click', () => {

    const postLink = window.location.href;
    console.log(postLink)

    // Get the current page URL
    const currentUrl = window.location.href;

    // Create a temporary input element
    const tempInput = document.createElement('input');
    tempInput.value = currentUrl;
    document.body.appendChild(tempInput);

    // Select the URL text
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices

    // Copy the URL to the clipboard
    document.execCommand('copy');

    // Remove the temporary input element
    document.body.removeChild(tempInput);

    // show toast
    Toastify({
        text: "url copied to clipboard",
        duration: 3000,
        gravity: "top", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "black",
        },
        onClick: function () { } // Callback after click
    }).showToast();

});


