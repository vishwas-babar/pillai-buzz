const { getUserByToken } = require("../utils/auth")


const isUserAuthenticated = (req, res, next) => {

    const token = req.cookies?.uid;
    if (!token) {
        console.log('cookie not found')
        return res.redirect('/login');
    }

    const user = getUserByToken(token);
    if (!user) {
        console.log('cookie uid is corrupted');
        res.clearCookie('uid');
        return res.redirect('/login');
    }

    req.body.user = user;
    next();
}

module.exports = isUserAuthenticated;