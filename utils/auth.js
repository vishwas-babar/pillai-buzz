require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_KEY;

function setUserJwtToken(user) {
    try {
        const token = jwt.sign(user, secret);
        return token;
    } catch (error) {
        console.log(error);
        return null;
    }
}

function getUserByToken(token){
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
}

module.exports = {
    setUserJwtToken,
    getUserByToken
}