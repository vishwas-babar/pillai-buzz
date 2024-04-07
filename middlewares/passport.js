require('dotenv').config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5173/api/user/auth/google/callback" // user is redirected to path if user authenticate with google
},
    function (accessToken, refreshToken, profile, cb) {
        console.log(profile)
        // User.findOrCreate({ googleId: profile.id }, function (err, user){
        //     console.log(user)
        //     return cb(err, user);
        // })
        return cb(null, profile)
    }
))

module.exports = passport;