const User = require('../models/user.model.js');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');
const { setUserJwtToken } = require('../utils/auth.js');
const { uploadToCloudinary } = require('../utils/cloudinary.js');
const removeTheFileFromServer = require('../utils/filehandle.js');
const asynchandler = require('../utils/asynchandler.js')

async function handleGetUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Invalid request',
        });
    }

    // check if user exists in database
    let user;
    try {
        user = await User.findOne({ email: email, password: password });
        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
        });
    }

    const uid = setUserJwtToken({
        name: user.name,
        userId: user.userId,
        bio: user.bio,
        userType: user.userType,
        _id: user._id
    });
    if (!uid) {
        return res.status(500).json({
            message: 'Internal server error',
        });
    }

    res.cookie('uid', uid, {

    });
    return res.status(200).json({
        message: 'User logged in successfully',
        uid: uid,
    });
}

async function handleCreateNewUser(req, res) {
    const { name, userId, email, password } = req.body;

    // check if user already exists
    const userExistWithSameUserId = await User.findOne({ userId: userId })
    if (userExistWithSameUserId) {
        return res.status(400).json({
            message: 'User already exists',
            field: 'userId',
        });
    }

    // check if email already exists
    const userExistWithSameEmail = await User.findOne({ email: email })
    if (userExistWithSameEmail) {
        return res.status(400).json({
            message: 'Email already exists',
            field: 'email',
        });
    }

    try {
        const user = await User.create({
            name: name,
            userId: userId,
            email: email,
            password: password,
            profilePhoto: 'https://res.cloudinary.com/dllphjlv3/image/upload/f_auto,q_auto/ut3hb62wndfelslnpd7m'
        });


        const uid = setUserJwtToken({
            name: user.name,
            userId: user.userId,
            bio: user.bio,
            userType: user.userType,
            _id: user._id
        });

        res.cookie('uid', uid, {

        });

        return res.status(200).json({
            message: 'User created successfully',
            _id: user._id,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
}

function handlesignoutUser(req, res) {
    res.cookie('uid', '', {
        expires: new Date(Date.now() + 1000),
    });

    return res.status(200).json({
        success: true,
        msg: "user signed out succesfully"
    });
}

const handleGetMyInfo = async (req, res) => {
    const userinfo = req.user;

    try {
        const user = await User.findById(userinfo._id);

        return res.status(200).json({
            name: user.name,
            userId: user.userId,
            profilePhoto: user.profilePhoto,
            _id: user._id,
            postCount: user.posts.length,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'internal server error'
        })
    }
}

const handleGetUserInfo = async (req, res) => {

    const user_id = req.params._id;

    try {
        const user = await User.findById(user_id);

        return res.status(200).json({
            name: user.name,
            userId: user.userId,
            _id: user._id,
            profilePhoto: user.profilePhoto,
            postCount: user.posts.length,
            followingCount: user.following.length,
            followersCount: user.followers.length,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'internal server error'
        })
    }
}

const handleUploadProfilePhoto = async (req, res) => {

    console.log('inside the uploadprofilephoto controller')

    const user_id = req.body.user_id;

    // Check if profilePhoto is defined before trying to access its elements
    let profilePhotoLocalPath;
    if (req.files && req.files.profilePhoto && req.files.profilePhoto.length > 0) {
        profilePhotoLocalPath = req.files.profilePhoto[0].path;

        // if given file is not image then reject request
        if (!req.files.profilePhoto[0].mimetype.startsWith('image/')) {
            removeTheFileFromServer(profilePhotoLocalPath);
            return res.status(400).json({
                msg: "Please upload image and not the other files"
            })
        }

    } else {
        // Handle the case when profilePhoto is not defined or no file was attached
        return res.status(400).json({
            msg: "profile picture is required"
        });
    }


    // upload img to cloudinary
    const profilePhoto = await uploadToCloudinary(profilePhotoLocalPath);
    console.log(profilePhoto);

    if (!profilePhoto) {
        return res.status(500).json({
            msg: "failed to upload img to cloudinary"
        })
    }

    try {
        const user = await User.findByIdAndUpdate(user_id, {
            profilePhoto: profilePhoto.secure_url
        }, { new: true })

        res.status(200).json({
            msg: 'profile photo uploaded succesfully',
            profilePhoto: user.profilePhoto,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'some internal error',
            error: error
        })
    }

}

const handleGetCurrentUser = async (req, res) => {

    const _id = req.user?._id;
    if (!_id) {
        return new res.status(400).json(new ApiResponse(400, "_id is required to get the user"))
    }

    try {
        const user = await User.findById(_id).select("name _id email bookmarks profilePhoto userType userId");
        if (user) {
            const response = new ApiResponse(200, "everything is well", user)

            return res.status(200).json(response)
        }
    } catch (error) {
        return res.status(400).json(new ApiResponse(400, "internal server error"));
    }

}

const handleGetUserData = asynchandler(async (req, res) => {
    const user_id = req.params._id;
    const loggedInUser_id = req.user?._id;
    if (!user_id) {
        throw new ApiError(400, "you not provided _id as query para");
    }

    console.log(user_id)

    if (user_id === loggedInUser_id) {
        console.log("the current user and the provided user is same")
        const user = await User.findById(user_id).select("-password -bookmarks -notifications -updatedAt");
        if (user) {
            return res.status(200).json(new ApiResponse(200, "successful", user))
        }
    } else {
        console.log("users are different")
        const user = await User.findById(user_id).select("-password -email -notifications -bookmarks -updatedAt -intrests -userType")
        if (user) {
            return res.status(200).json(new ApiResponse(200, "successful", user))
        }
    }
})

const handleNotificationOnOffToggle = asynchandler(async (req, res) => {

    // add current user _id to the target author subscriber array field
    const author_id = req.body.author_id;
    const subscriberUser_id = req.user._id;

    if (!author_id || !subscriberUser_id) {
        throw new ApiError(400, "you not provided the all required data for this request")
    }

    // first check the current user exist or not
    const current_logged_in_user = await User.findById(subscriberUser_id).select("_id name userId")

    if (!current_logged_in_user) {
        throw new ApiError(404, "the current user not found!")
    }

    // check if the author user exist or not
    const authorUser = await User.findById(author_id).select("_id subscribers");

    if (!authorUser) {
        throw new ApiError(404, "the author user you trying to turn on notification for not exist!")
    }

    // to toggle on of notification check if this user is already in the subscribers list or not
    // if it is already in the array then remove it 
    // if the current user is not in author user subscriber then add it

    let isAlreadyInSubscribersList = false;
    const authorSubscribers = authorUser.subscribers;
    if (authorSubscribers.includes(subscriberUser_id)) {
        isAlreadyInSubscribersList = true;
    }


    // perform a update operation on author user document to push the current user _id in their subscriber list
    if (isAlreadyInSubscribersList) {
        const updatedAuthorUser = await User.findByIdAndUpdate(author_id, {
            $pull: { subscribers: subscriberUser_id }
        }, { new: true }).select('_id name userId subscribers')


        if (updatedAuthorUser) {
            return res.status(200).json(new ApiResponse(200, `@${current_logged_in_user?.userId} removed from the the @${updatedAuthorUser.userId} subscribers list`))
        }
    } else { // add user in the author subscriber list
        const updatedAuthorUser = await User.findByIdAndUpdate(author_id, {
            $push: { subscribers: subscriberUser_id }
        }, { new: true }).select('_id name userId subscribers')

        if (updatedAuthorUser) {
            return res.status(200).json(new ApiResponse(200, `@${current_logged_in_user?.userId} added to the @${updatedAuthorUser.userId} subscribers list`))
        }
    }
})

module.exports = {
    handleCreateNewUser,
    handleGetUser,
    handlesignoutUser,
    handleGetMyInfo,
    handleGetUserInfo,
    handleUploadProfilePhoto,
    handleGetCurrentUser,
    handleGetUserData,
    handleNotificationOnOffToggle,
}