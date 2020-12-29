const path = require('path');
const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');

const globalErrorHandler = require('./controller/globalErrorHandler');
const AppError = require('./utils/AppError');
const passportSetup = require('./utils/passport-setup');

const viewRoutes = require('./routes/viewsRoutes');

const app = express();


// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// cookie session
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys:[process.env.keys]    
}))

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// server static files
app.use(express.static(path.join(__dirname, '/public')));

app.use(express.urlencoded({extended:false}));
app.use(express.json());

// routes
app.use('/',    viewRoutes);

// unhandeled routes
app.all('*', (req,res,next)=>{
    next(new AppError(`can't find ${req.originalUrl}`, 404));
})

// handle gloabla errors
app.use(globalErrorHandler);

module.exports = app;