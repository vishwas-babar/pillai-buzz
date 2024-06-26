const User = require('../models/user.model.js');
const ApiError = require('../utils/ApiError.js');
const ApiResponse = require('../utils/ApiResponse.js');
const { setUserJwtToken } = require('../utils/auth.js');
const { uploadToCloudinary } = require('../utils/cloudinary.js');
const removeTheFileFromServer = require('../utils/filehandle.js');
const asynchandler = require('../utils/asynchandler.js');
const { ObjectId } = require('mongodb');
const { default: axios } = require('axios');
const { handleSearchPost } = require('./post.controller.js');


const handleGetUser = asynchandler(async (req, res) => {
    const { email, password } = req.body;

    if (req.body.access_token) {
        // google auth login
        console.log("google auth login")
        const access_token = req.body.access_token;

        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })

        if (!response.data) {
            throw new ApiError(500, "failed to get the user data from google api")
        }

        const userData = response.data;

        // check if the user is already exist then just login this user
        const pastUser = await User.findOne({ googleId: userData.sub });

        console.log("pastuser:", pastUser)

        if (pastUser) {
            console.log("this user is laready exist so login him")
            const uid = setUserJwtToken({
                name: pastUser.name,
                userId: pastUser.userId,
                bio: pastUser.bio,
                userType: pastUser.userType,
                _id: pastUser._id
            });

            if (!uid) {
                return res.status(500).json({
                    message: 'failed to generate the jwt token',
                });
            }

            res.cookie('uid', uid, {
                // specify the rules for cookie such as expiry date
            });

            return res.status(200).json({ msg: "user is already exist and loged in" })
        }

        const name = userData.name;
        const userId = name.toLowerCase().split(' ').join('_');

        const createdUser = await User.create({
            name: userData.name,
            userId: userId,
            email: userData.email,
            profilePhoto: userData.picture,
            profilePhotoPublic_id: "",
            provider: "google",
            googleId: userData.sub,
        })

        if (!createdUser) {
            throw new ApiError(500, 'failed to create the user with data provided by google')
        }

        const uid = setUserJwtToken({
            name: createdUser.name,
            userId: createdUser.userId,
            bio: createdUser.bio,
            userType: createdUser.userType,
            _id: createdUser._id
        });

        if (!uid) {
            return res.status(500).json({
                message: 'failed to generate the jwt token',
            });
        }

        res.cookie('uid', uid, {
            // specify the rules for cookie such as expiry date
        });

        return res.status(201).json({
            message: 'User account created Successfully as account with this email account not existed before',
            // uid: uid,
        });

    }

    if (!email || !password) {
        return res.status(400).json({
            message: 'Invalid request',
        });
    }

    // check if user exists in database

    // const theGoogleUser = await User.

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
        // specify the rules for cookie such as expiry date
    });
    return res.status(200).json({
        message: 'User logged in successfully',
        uid: uid,
    });
})

async function handleCreateNewUser(req, res) {

    const { name, userId, email, password } = req.body;

    // check if user already exists
    const userExistWithSameUserId = await User.findOne({ userId: userId })
    if (userExistWithSameUserId) {
        return res.status(409).json({
            message: 'User already exists',
            field: 'userId',
        });
    }

    // check if email already exists
    const userExistWithSameEmail = await User.findOne({ email: email })
    if (userExistWithSameEmail) {
        return res.status(409).json({
            message: 'Email already used',
            field: 'email',
        });
    }

    console.log("file for signup: ",req.file)


    try {

        const uploadedFile = await uploadToCloudinary(req.file.buffer);

        if (!uploadedFile) {
            return res.status(500).json({ msg: "failed to upload profile photo to cloudinary" })
        }

        const user = await User.create({
            name: name,
            userId: userId,
            email: email,
            password: password,
            profilePhoto: uploadedFile?.secure_url,
            profilePhotoPublic_id: uploadedFile?.public_id,
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
    // console.log(profilePhoto);

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
        return res.status(400).json(new ApiResponse(400, "_id is required to get the user"))
    }

    try {
        const user = await User.findById(_id).select("name _id email bookmarks notifications profilePhoto userType userId");
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

    // console.log(user_id)

    if (user_id === loggedInUser_id) {
        console.log("the current user and the provided user is same")
        const user = await User.findById(user_id).select("-password -bookmarks -updatedAt");
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

const handleGetAllNotifications = asynchandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(404, "current user is not logged in")
    }

    const userInDb = await User.findById(user._id).select('notifications _id userId userName');

    if (!userInDb) {
        throw new ApiError(404, "current user not found in database");
    }

    return res.status(200).json({
        massege: "notifications for current logged in user",
        notifications: userInDb?.notifications
    })
})

const handleGetNotifications = asynchandler(async (req, res) => {
    const { _id } = req.user;

    if (!_id) {
        throw new ApiError(401, "user not authenticated");
    }

    const data = await User.aggregate([
        {
            $match: {
                _id: new ObjectId(_id)
            }
        },
        {
            $unwind: "$notifications"
        },
        {
            $lookup: {
                from: "users",
                localField: "notifications.user_id",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        {
            $unwind: "$userDetails"
        },
        {
            $sort: {
                "notifications.createdAt": -1
            }
        },
        {
            $project: {
                "userDetails.userId": 1,
                "userDetails.name": 1,
                "userDetails._id": 1,
                "userDetails.profilePhoto": 1,
                userId: 1,
                notifications: 1,

            }
        }
    ]);

    if (!data) {
        throw new ApiError(500, "not geting any notifications from database")
    }

    return res.status(200).json({
        msg: "successs",
        notifications: data,
    })
})

const handleSearchUser = asynchandler(async (req, res) => {

    console.log("searching for the users with given query: ", req.query)
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ msg: "query text is not provided to search the user" })
    }

    const users = await User.aggregate([
        {
            $match: {
                $or: [
                    { name: { $regex: query, $options: "i" } },
                    { userId: { $regex: query, $options: "i" } }
                ]
            },
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                userId: 1,
                profilePhoto: 1,
                coverImage: 1,
                createdAt: 1,
            },
        },
    ]);

    if (!users) {
        throw new ApiError(500, "failed to search users")
    }

    return res.status(200).json({ users: users })
})


const handleEditUserProfile = asynchandler(async (req, res) => {
    const { name, userId, role } = req.body;
    const profilePhoto = req.file;
    const user = req.user;

    console.log("user: ", user)
    console.log(req.body)
    console.log("file: ", req.file)

    try {

        // check if same userid exist in database or not
        const userInDb = await User.findOne({ userId });

        if (userInDb) {
            console.log('userid conflicts send conflict response...')
            if (userInDb._id != user._id)
                return res.status(409).json({ msg: "userId already exist!" })
        }

        if (profilePhoto) {
            // update user with its profile photo
            
            const uploadedImage = await uploadToCloudinary(profilePhoto.buffer)
            console.log(uploadedImage)

            const updatedUser = await User.findByIdAndUpdate(user._id, {
                name,
                userId,
                role,
                profilePhoto: uploadedImage.secure_url,
                profilePhotoPublic_id: uploadedImage.public_id
            }, { new: true })
        } else {
            // update without profile image
            const updatedUser = await User.findByIdAndUpdate(user._id, {
                name,
                userId,
                role,
            }, { new: true })
        }

        res.status(201).json({
            msg: "user profile updated successfully."
        })
    } catch (error) {
        console.log(error)
        throw new ApiError(500, "error when updating the user profile")
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
    handleGetNotifications,
    handleSearchUser,
    handleEditUserProfile,
}