const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    try {
        const { fullName, userName, email, mobile, password } = req.body;

        // Hash and salt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        let newUserData = {
            "fullName": fullName,
            "userName": userName,
            "email": email,
            "mobile" : mobile,
            "password": hashedPassword
        }
        // Create new user with hashed password
        const newUser = await User.create(newUserData);
        res.status(201).json({
            success: true,
            message: 'Signup successful',
            user: newUser
        });
    } catch (error) {
        if (error.code == 11000) {
            const duplicateField = Object.keys(error.keyPattern)[0];
            error = `${duplicateField} already exist`;
            
            return res.status(400).json({
                success: false,
                error: error,
            });
        } else {
            return res.status(500).json({
                success: false,
                error: error,
            });
        }
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if user exists
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                error: 'Incorrect password'
            });
        }
        // Generate access token
        const accessToken = jwt.sign({ userId: user._id }, 'accessTokenSecret', { expiresIn: '15m' });
        // Generate refresh token
        const refreshToken = jwt.sign({ userId: user._id }, 'refreshTokenSecret', { expiresIn: '7d' });
        // Store refresh token in database (for session management)
        user.refreshToken = refreshToken;
        await user.save();
        // Set refreshTokens in cookies
        res.cookie('refreshToken', refreshToken, { httpOnly: true, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }); // 7 days
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: user,
            accessToken: accessToken
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error
        });
    }
};


exports.refreshToken = async (req, res) => {
    try {
        // Extract refresh token from request cookies
        console.log("cookies:", req.cookies)
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                error: 'Refresh token not provided'
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, 'refreshTokenSecret');
        const userId = decoded.userId;

        // Check if user exists and refresh token matches
        const user = await User.findById(userId);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                success: false,
                error: 'Invalid refresh token'
            });
        }

        // Generate new access token
        const accessToken = jwt.sign({ userId: user._id }, 'accessTokenSecret', { expiresIn: '15m' });
        // Generate new refresh token (rotate)
        const newRefreshToken = jwt.sign({ userId: user._id }, 'refreshTokenSecret', { expiresIn: '7d' });
        // Update refresh token in database
        user.refreshToken = newRefreshToken;
        await user.save();
        // Set refreshTokens in cookies
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }); // 7 days
        res.status(200).json({
            success: true,
            accessToken: accessToken
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: error
        });
    }
};




