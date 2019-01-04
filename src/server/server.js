const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const User = require('./models/user');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 4000;

//*** Middleware ***//
app.use(cors({origin: 'http://localhost:3000'}));/////////////////////////////////////////////////////
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));


// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
});


// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');////////////////////////////////////////////
    } else {
        next();
    }
};

//*** Routes ***//
app.route('/api/login', sessionChecker, (req,res) => {

});

app.route('/api/register', sessionChecker, (req,res) => {

});

//*** Server Start ***///
app.listen(PORT, error => {
    if (!error) {
        console.log(`Woof is running on port ${PORT}! Load http://localhost:${PORT} in your browser.`)
    }
});
