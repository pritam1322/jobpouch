import  Razorpay from 'razorpay';

const instance = new Razorpay({ 
    key_id: process.env.RAZORPAY_CLIENT_ID!, 
    key_secret: process.env.RAZORPAY_CLIENT_SECRET! 
  });

export default instance;