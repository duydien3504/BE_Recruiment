const OTP_LENGTH = 6;
const OTP_EXPIRATION_MINUTES = 10;

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const getOtpExpiration = () => {
    const now = new Date();
    return new Date(now.getTime() + OTP_EXPIRATION_MINUTES * 60000);
};

module.exports = {
    generateOtp,
    getOtpExpiration,
    OTP_EXPIRATION_MINUTES
};
