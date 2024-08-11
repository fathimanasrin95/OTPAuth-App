const express = require('express');
const nodemailer = require('nodemailer');
const Otp = require('../Models/otp');
const crypto = require('crypto');

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/send', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

  try {
    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true }
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    });

    res.status(200).json({ message: 'OTP sent' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP', error });
  }
});

router.post('/verify', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const record = await Otp.findOne({ email });

    if (!record || record.otp !== otp || record.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    await Otp.deleteOne({ email });
    res.status(200).json({ message: 'OTP verified' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify OTP', error });
  }
});

module.exports = router;