const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');
const Uploader = require('../models/Uploader.js')(db.sequelize, db.Sequelize);
const { Op } = require('sequelize');


const customFields = {
    usernameField: 'phone',
    passwordField: 'otp'
}

console.log("passport config called")

const verifyCallback = (phone, otp, done) => {
    
    Uploader.findOne({ 
        where: {
            phoneNo: phone,
            updatedAt: {
                [Op.gte]: new Date(new Date() - 2 * 60 * 1000)
            }
        } 
    })
    .then(uploader => {
        console.log(uploader);
        if(!uploader) {
            return done(null, false);
        }

        if(otp === uploader.otp) {
            return done(null, uploader);
        }
        else {
            return done(null, false);
        }
    })
    .catch( error => {
        console.log(error);
        done(error);
    });
}

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((uploader, done) => {
    done(null, uploader.uploaderId);
});

passport.deserializeUser((uploaderId, done) => {
    Uploader.findOne({ 
        raw: true,
        where: {uploaderId: uploaderId} 
    })
    .then((uploader) => {
        done(null, uploader);
    })
    .catch(error => done(error));
});