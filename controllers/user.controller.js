const User = require('../models/user.model.js');
const { setUserJwtToken } = require('../utils/auth.js');

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
        await User.create({
            name: name,
            userId: userId,
            email: email,
            password: password,
        });

        return res.status(200).json({
            message: 'User created successfully',
        });
    } catch (error) {
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

const handleGetUserInfo = async (req, res) => {
    const userinfo = req.body.user;
    console.log(userinfo);

    try {
        const user = await User.findById(userinfo._id);
        console.log(user);

        return res.status(200).json({
            name: user.name,
            userId: user.userId,
        });
    } catch (error) {
        console.log(error);
       return res.status(500).json({
            msg:'internal server error'
        })
    }
}

module.exports = {
    handleCreateNewUser,
    handleGetUser,
    handlesignoutUser,
    handleGetUserInfo,
}