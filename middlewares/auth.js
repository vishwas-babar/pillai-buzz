const { getUserByToken } = require("../utils/auth")


const isUserAuthenticated = (req, res, next) => {

    const token = req.cookies?.uid;
    if (!token) {
        // return res.redirect('/login');
        return res.status(401).json({
            message: "to get the  user data first login page"
        })
    }

    const user = getUserByToken(token);
    // console.log(user)
    if (!user) {
        res.clearCookie('uid');
        return res.redirect('/login');
    }

    req.user = user;
    next();
}

module.exports = isUserAuthenticated;