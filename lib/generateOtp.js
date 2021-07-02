
const generateOtp = (size = 6) => {

    // characters to be included in the otp
    var digits = '0123456789';

    let otp = '';
    for(let i = 0; i < size; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }

    return otp;
}

module.exports = generateOtp