const express = require('express');
const router = express.Router();
const {getOtp} = require('../controller/uploaderController');
const passport = require('passport');

router.get('/', (req, res) => {
    res.render('loginPage', {
        documentTitle:"Login",
        cssPage: "style"
    });
});

router.post('/get-otp', getOtp);
router.post('/verify', passport.authenticate('local', { 
    failureRedirect: '/login',
    successRedirect: '/home'
}));

module.exports = router;