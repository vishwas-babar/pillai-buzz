const { getUserByToken } = require("../utils/auth")


const isUserAuthenticated = (req, res, next) => {

    const token = req.cookies?.uid;
    if (!token) {
        return res.redirect('/login');
    }

    const user = getUserByToken(token);
    if (!user) {
        res.clearCookie('uid');
        return res.redirect('/login');
    }

    req.user = user;
    next();
}

module.exports = isUserAuthenticated;