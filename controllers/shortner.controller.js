const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
// const nanoid = require('nanoid');
const QRCode = require('qrcode-generator');
const Url = require('../models/shortner.model');
const User = require('../models/user.model');

module.exports.checkUserFunction = async (req, res) => {
    try {
        const { email } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(200).json({ message: "User is present", status: true });
        } else {
            res.status(200).json({ message: "User is not present", status: false });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports.SignupFunction = async (req, res, next) => {
    try {
        const { email, password, username, createdAt } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ message: "User already exists" });
        }
        const user = await User.create({ email, password, username, createdAt });
        const token = createSecretToken(user._id);
        res
            .status(201)
            .json({ message: "User signed in successfully", success: true, user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.LoginFunction = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Incorrect password or email' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password or email' });
        }
        const token = createSecretToken(user._id);
        console.log(token)
        res.status(200).json({ message: "User logged in successfully", success: true, token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.PasswordResetFunction = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiration = Date.now() + 3600000;
        await user.save();
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });
        console.log(process.env.APP_URL);
        const resetLink = `${process.env.APP_URL}/reset-password/${resetToken}`;
        console.log(resetLink);
        await transporter.sendMail({
            to: email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset (An Task)',
            html: `<p>You requested a password reset</p>
               <p>Click this <a href="${resetLink}">link</a> to reset your password</p>
               <p>This is a task </p>`
        });
        res.status(200).json({ message: 'Password reset link sent!' });
    } catch (error) {
        res.send(error);
    }
}

module.exports.UpdatePasswordFunction = async (req, res, next) => {
    try {
        const { newPassword } = req.body;
        const { token } = req.params;
        const user = await User.findOne({ resetToken: token });
        if (!user) {
            return res.status(404).json({ message: 'Invalid or expired reset token' });
        }
        if (user.resetTokenExpiration < Date.now()) {
            return res.status(400).json({ message: 'Reset token has expired' });
        }
        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();
        res.status(200).json({ message: 'Password updated successfully', success: true });
    } catch (error) {
        console.error("Error during saving new password:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.ShortenUrlFunction = async (req, res, next) => {
    try {
        const { originalUrl } = req.body;
        let url = await Url.findOne({ originalUrl });
        if (url) {
            return res.json({ message: 'URL already shortened', url });
        }
        const shortUrl = nanoid(8);
        const qr = QRCode(0, 'L');
        qr.addData(`${APP_URL}/${shortUrl}`);
        qr.make();
        const qrCode = qr.createImgTag();
        url = new Url({
            originalUrl,
            shortUrl: `${APP_URL}/${shortUrl}`,
            qrCode
        });
        await url.save();
        res.json({ message: 'URL shortened successfully', url });
    } catch (error) {
        console.error("Error during generating Url:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.GetUrlFunction = async (req, res, next) => {
    const { shortUrl } = req.params;
    try {
        const url = await Url.findOne({ shortUrl: `${APP_URL}/${shortUrl}` });
        if (url) {
            url.accessCount += 1;
            await url.save();
            return res.redirect(url.originalUrl);
        } else {
            return res.status(404).json({ message: 'URL not found' });
        }
    } catch (error) {
        console.error("Error during getting Url:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.GetAllUrlsFunction = async (req, res, next) => {
    try {
        const urls = await Url.find({});
        res.json({ message: 'Fetched URls successfully', urls });
    } catch (error) {
        console.error("Error during getting Url:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.GetLastGeneratedUrlsFunction = async (req, res, next) => {
    try {
        const urls = await Url.find({});
        res.json({ message: 'Fetched URls successfully', urls });
    } catch (error) {
        console.error("Error during getting Url:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};