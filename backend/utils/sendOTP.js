// Integration with Twilio or MSG91 goes here.
// For now, it mocks sending SMS and prints to console.

export const sendOTP = async (mobileNumber, otp) => {
  try {
    // If using Twilio:
    // const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await client.messages.create({
    //   body: `Your Catchy Shop OTP is ${otp}. It is valid for 10 minutes.`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: `+91${mobileNumber}`
    // });

    console.log(`\n================================`);
    console.log(`📱 MOCK SMS TO: ${mobileNumber}`);
    console.log(`🔢 OTP CODE: ${otp}`);
    console.log(`================================\n`);
    
    return true;
  } catch (error) {
    console.error('❌ Error sending OTP: ', error);
    return false;
  }
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
};
