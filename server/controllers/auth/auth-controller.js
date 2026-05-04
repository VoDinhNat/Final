const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const dotenv = require("dotenv");
dotenv.config();

const CLIENT_SECRET_KEY = process.env.CLIENT_SECRET_KEY;
const normalizeString = (value = "") => value.trim();

const authCookieBase =
    process.env.NODE_ENV === "production"
        ? {httpOnly: true, secure: true, sameSite: "none", maxAge: 60 * 60 * 1000}
        : {httpOnly: true, secure: false, sameSite: "lax"};

function authCookieClearOptions() {
    const {maxAge, ...rest} = authCookieBase;
    return {...rest, path: "/"};
}

//register  
const registerUser = async (req, res) => {
    let {userName, email, password} = req.body;

    try {
        userName = normalizeString(userName);
        email = normalizeString(email).toLowerCase();
        password = normalizeString(password);

        if (!userName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "userName, email and password are required",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }

        const checkUser = await User.findOne({
            $or: [{email}, {userName}],
        });
        if (checkUser) {
            const duplicateField = checkUser.email === email ? "email" : "userName";
            return res.status(409).json({
                success: false,
                message: `User already exists with this ${duplicateField}`,
            });
        }

        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            userName,
            email,
            password: hashPassword,
        });

        await newUser.save();
        res.status(200).json({
            success: true,
            message: "Registration successful",
        });
    } catch (e) {
        if (e?.code === 11000) {
            const duplicateField = Object.keys(e.keyPattern || {})[0] || "field";
            return res.status(409).json({
                success: false,
                message: `User already exists with this ${duplicateField}`,
            });
        }
        console.error("[AUTH_REGISTER_ERROR]", e);

        res.status(500).json({
            success: false,
            message: "Unable to register user",
        });
    }
};

//login
const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try {
        const checkUser = await User.findOne({email});
        if (!checkUser)
            return res.json({
                success: false,
                message: "User doesn't exists! Please register first",
            });

        const checkPasswordMatch = await bcrypt.compare(
            password,
            checkUser.password
        );
        if (!checkPasswordMatch)
            return res.json({
                success: false,
                message: "Incorrect password! Please try again",
            });

        const token = jwt.sign(
            {
                id: checkUser._id,
                role: checkUser.role,
                email: checkUser.email,
                userName: checkUser.userName,
            },
            CLIENT_SECRET_KEY,
            {expiresIn: "60m"}
        );

        res.cookie("token", token, {...authCookieBase, path: "/"}).json({
            success: true,
            message: "Logged in successfully",
            user: {
                email: checkUser.email,
                role: checkUser.role,
                id: checkUser._id,
                userName: checkUser.userName,
            },
        });
    } catch (e) {

        res.status(500).json({
            success: false,
            message: "Some error occured",
        });
    }
};

//logout
const logoutUser = (req, res) => {
    res.clearCookie("token", authCookieClearOptions()).json({
        success: true,
        message: "Logged out successfully!",
    });
};

//auth middleware
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
        return res.status(401).json({
            success: false,
            message: "Unauthorised user!",
        });

    try {
        const decoded = jwt.verify(token, CLIENT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Unauthorised user!",
        });
    }
};

module.exports = {registerUser, loginUser, logoutUser, authMiddleware};
