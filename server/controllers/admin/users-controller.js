const User = require("../../models/User");
const bcrypt = require("bcryptjs");

const fetchAllUsers = async (req, res) => {
    try {
        const listOfUsers = await User.find({});
        res.status(200).json({
            success: true,
            data: listOfUsers,
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Error occured",
        });
    }
};
const createUser = async (req, res) => {
    const {userName, email, password, role} = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10); 
        const newUser = new User({
            userName,
            email,
            password: hashedPassword,
            role: role || "user",
        });

        await newUser.save();
        res.status(201).json({success: true, data: newUser});
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Error occurred while creating user",
        });
    }
};
const updateUser = async (req, res) => {
    const {id} = req.params;
    const {userName, email, role} = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {userName, email, role},
            {new: true}
        );
        res.status(200).json({success: true, data: updatedUser});
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Error occurred while updating user",
        });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    const {id} = req.params;
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({success: true, message: "User deleted successfully"});
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Error occurred while deleting user",
        });
    }
};

module.exports = {
    fetchAllUsers,
    createUser,
    updateUser,
    deleteUser,
};
