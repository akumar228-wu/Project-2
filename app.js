const express = require('express');
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require('express-mongo-sanitize');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const Registration = require('./models/Registration');
const routes = require('./routes/index');
const cookieParser = require('cookie-parser');
const app = express();

//=======================
//    BASIC MIDDLEWARE
//=======================
// 1. Basic middleware and parsers (should come first)
app.use(express.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

//=======================
//    SECURITY MIDDLEWARE
//=======================
// 2. Security middleware
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://maxcdn.bootstrapcdn.com", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://maxcdn.bootstrapcdn.com", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      childSrc: ["'none'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "'wasm-unsafe-eval'"],
      workerSrc: ["'self'", "blob:"],
    },
}));
app.use(xss());
app.use(mongoSanitize());

//=======================
//    RATE LIMITERS
//=======================
// 3. Rate limiters
const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many registration request, wait after 15min to try.'
});

const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: true,
    skipSuccessfulRequests: false,
    handler: (req, res, next, options) => {
        req.rateLimit = {
            ...req.rateLimit,
            isLimited: true,
            message: 'Too many login attempts, please try again after 5 minutes.'
        };
        next();
    }
});

app.set('registerLimiter', registerLimiter);
app.set('loginLimiter', loginLimiter);

//=======================
//    SESSION & AUTH
//=======================
app.use(cookieParser());
// 4. Session configuration (before passport)
app.use(session({
    secret: 'web602-project-2',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    },
    rolling: true,
    name: 'connect.sid'
}));

// 5. Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Registration.authenticate()));
passport.serializeUser(Registration.serializeUser());
passport.deserializeUser(Registration.deserializeUser());

//=======================
//    VIEW ENGINE
//=======================
// 6. View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//=======================
//    SESSION INITIALIZATION
//=======================
// 7. Session initialization middleware
app.use((req, res, next) => {
    if (req.session && !req.session.initialized) {
        req.session.initialized = true;
        req.session.save((err) => {
            if (err) {
                console.error('Session initialization error:', err);
            }
            next();
        });
    } else {
        next();
    }
});

//=======================
//    ROUTES
//=======================
// 8. Routes
app.use('/', routes);

//=======================
//    ERROR HANDLING
//=======================
// 9. Error handling (should be last)
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

module.exports = app;