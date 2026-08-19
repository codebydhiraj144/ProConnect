import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const register = async (req, res) => {
    try {
        const { name, email, password, username } = req.body;

        if (!name || !email || !password || !username) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({ message: "User already exists with this email or username" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username
        });

        await newUser.save();

        const profile = new Profile({
            userId: newUser._id
        });

        await profile.save();

        return res.status(201).json({ message: "User Created" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = crypto.randomBytes(32).toString("hex");
        await User.updateOne({ _id: user._id }, { $set: { token } });

        return res.json({ token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const uploadprofilepicture = async (req, res) => {
    try {
        const { token } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.profilepicture = req.file.path;
        await user.save();

        return res.json({ message: "Profile picture updated", path: req.file.path });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { token, ...newUserData } = req.body;

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { username, email } = newUserData;

        if (username || email) {
            const existingUser = await User.findOne({
                $or: [
                    ...(username ? [{ username }] : []),
                    ...(email ? [{ email }] : [])
                ]
            });

            if (existingUser && existingUser._id.toString() !== user._id.toString()) {
                return res.status(400).json({ message: "Username or email already in use" });
            }
        }

        Object.assign(user, newUserData);
        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;
        delete userResponse.token;

        return res.json({ message: "User updated successfully", user: userResponse });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getUserAndProfile = async (req, res) => {
    try {
        const token = req.query.token || req.body.token;

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userProfile = await Profile.findOne({ userId: user._id })
            .populate("userId", "name email username profilepicture");

        return res.json({ profile: userProfile });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateProfileData = async (req, res) => {
    try {
        const { token, ...newProfileData } = req.body;

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const profileToUpdate = await Profile.findOne({ userId: user._id });
        if (!profileToUpdate) {
            return res.status(404).json({ message: "Profile not found" });
        }

        Object.assign(profileToUpdate, newProfileData);
        await profileToUpdate.save();

        return res.json({ message: "Profile updated successfully", profile: profileToUpdate });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};