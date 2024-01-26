const User = require('../models/user.model.js');

async function handleCreateNewUser(req, res) {
    const { userId, email, password } = req.body;

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

async function handleGetUser(req, res) {
    const { userId } = req.body;
}

module.exports = {
    handleCreateNewUser,
}