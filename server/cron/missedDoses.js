const cron = require('node-cron');
const Tablet = require('../models/Tablet');
const Log = require('../models/Log');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Set up Nodemailer (Using local config, should use environment variables)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const checkMissedDoses = () => {
  cron.schedule('* * * * *', async () => {
    // console.log('Checking for missed doses...');
    // Logik: 
    // 1. Get current time.
    // 2. Find all tablets scheduled for "current time - grace period".
    // 3. Check if there is a Log for that tablet and time.
    // 4. If not, mark as missed and send email to parentEmail.
  });
};

module.exports = checkMissedDoses;
