const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { isLoggedIn } = require('../middleware');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.register));


router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', { 
        failureFlash: true, 
        failureRedirect: '/login' 
    }), users.login);


router.get('/logout', isLoggedIn, users.logout)

module.exports = router;