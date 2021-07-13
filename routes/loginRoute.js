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

router.get('/failure', (req, res) => {
    res.status(403).json({message: "Invalid Credentials"});
})

router.get('/success', (req, res) => {
    res.status(200).json({message: "Success"});
})


router.post('/get-otp', getOtp);
router.post('/verify', passport.authenticate('local', { 
    failureRedirect: '/login/failure',
    successRedirect: '/login/success'
}));

module.exports = router;