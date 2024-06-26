require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const isUserAuthenticated = require('./middlewares/auth.js');

const staticRouter = require('./routes/static.route.js');
const userRouter = require('./routes/user.route.js');
const postRouter = require('./routes/post.route.js');
const imageRouter = require('./routes/image.route.js');


const connectDB = require('./database/connection.js');
connectDB();
 
const app = express();

// enable access from all origins
app.use(cors());

// this is middlewares for adding given data to req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use('/', staticRouter);
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
// app.use('/api/post', postRouter);
app.use('/api/images', imageRouter);

app.listen(process.env.PORT || 7000, () => {
    console.log(`Server is running on port ${process.env.PORT || 7000}`);
});