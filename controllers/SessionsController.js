const User = require('../models/user');
const passport = require('passport');
const viewPath = 'sessions';
const jwt = require('jsonwebtoken');

exports.new = (req,res) => {
    res.render(`${viewPath}/new`, {
        pageTitle: 'Login'
    });
};

exports.create = (req,res, next) => {
   //checking if the user is registered or not
    /*passport.authenticate('local', {
        //if successfully logged in, redirecting to a certain page
        successRedirect: '/blogs',
        successFlash: 'You were successfully logged in.',
        failureRedirect: '/login',
        failureFlash:'Invalid credentials'
    })(req,res,next);*/
    //now we have to authenticate using jwttokens, therefore code above is invalid
    passport.authenticate('local', (err,user) => {
        if ( err || !user) return res.status(401).json({
                status: 'failed',
                message: 'Not authenticated',
                error: err
        });
        req.login(user, err => {
            if (err) return res.status(401).json({
                status: 'failed',
                message: 'Not authenticated',
                error: err
            });

            return res.status(200).json({
                status: 'success',
                message: 'Logged in successfully',
                user: {
                    _id: user._id,
                    fullname: user.fullname,
                    email: user.email
                }
            })
        })
    })(req,res,next);
};  

exports.delete = (req,res) => {
    //calling default passport functions for logging out 
    req.logout();
    req.flash('success', 'You were logged out successfully.');
    res.redirect('/');
};

