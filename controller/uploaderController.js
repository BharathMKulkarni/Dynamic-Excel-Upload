const generateOtp = require('../lib/generateOtp');
const db = require('../models');
const Uploader = require('../models/Uploader.js')(db.sequelize, db.Sequelize);

const getOtp = async (req, res) => {

    // GENERATE RANDOM OTP WITH 6 DIGITS
    const otp = generateOtp();
    const phone = req.body.phone;

    try {
        const user = await Uploader.findOne({
            where: {phoneNo: phone}
        });
        if(user === null) 
            await Uploader.create({phoneNo: phone, otp: otp});
        else {
            user.otp = otp;
            await user.save();
        }
        res.status(200).json({message: `Your OTP: ${otp}`});
    }
    catch(error) {
        console.log(error);
        res.status(500).json({message: error});
    }
}

module.exports.getOtp = getOtp;