require('dotenv').config();
const mongoose = require('mongoose');


function connectDB() {
    mongoose.connect(process.env.DB_STRING)
    .then(() => {
        console.log('database is connected successfuly');
    })
    .catch((err) => {
        console.log('database connection failed');
        console.log(err);
    })
}

module.exports = connectDB;
