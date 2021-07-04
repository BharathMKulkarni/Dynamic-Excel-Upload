
// GENERATING A RANDOM 6 DIGIT LONG OTP:
const generateOtp = (size = 6) => {

    // characters to be included in the otp
    let digits = '0123456789';

    let otp = '';
    for(let i = 0; i < size; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }

    console.log(`OTP for Login : ${otp}`);

    return otp;
}

module.exports = generateOtp;