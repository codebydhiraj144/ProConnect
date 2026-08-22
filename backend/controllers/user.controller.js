import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import ConnectionRequest from "../models/connections.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";

const convertUserDataToPDF = async (userData) => {
    const doc = new PDFDocument();

    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
    const stream = fs.createWriteStream("uploads/" + outputPath);

    doc.pipe(stream);

    if (userData.userId && userData.userId.profilepicture) {
        const imagePath = `uploads/${userData.userId.profilepicture}`;
        if (fs.existsSync(imagePath)) {
            doc.image(imagePath, { align: "center", width: 100 });
        }
    }

    doc.fontSize(14).text(`Name: ${userData.userId ? userData.userId.name : "N/A"}`);
    doc.fontSize(14).text(`Username: ${userData.userId ? userData.userId.username : "N/A"}`);
    doc.fontSize(14).text(`Email: ${userData.userId ? userData.userId.email : "N/A"}`);
    doc.fontSize(14).text(`Bio: ${userData.bio || "N/A"}`);
    doc.fontSize(14).text(`Current Position: ${userData.currentPost || "N/A"}`);

    doc.fontSize(14).text("Past Work: ");
    if (userData.pastWork && userData.pastWork.length > 0) {
        userData.pastWork.forEach((work) => {
            doc.fontSize(12).text(`  - Company: ${work.company || "N/A"}`);
            doc.fontSize(12).text(`    Position: ${work.position || "N/A"}`);
            doc.fontSize(12).text(`    Years: ${work.years || "N/A"}`);
        });
    }

    doc.end();

    return outputPath;
};

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

export const getAllUserProfile = async (req, res) => {
    try {
        const profiles = await Profile.find().populate("userId", "name username email profilepicture");
        return res.json({ profiles });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const downloadProfile = async (req, res) => {
    try {
        const userId = req.query.id;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const userProfile = await Profile.findOne({ userId })
            .populate("userId", "name username email profilepicture");

        if (!userProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        const outputPath = await convertUserDataToPDF(userProfile);

        return res.json({ message: outputPath });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const sendConnectionRequest = async (req, res) => {
    const { token, connectionId } = req.body;

    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const connectionUser = await User.findOne({ _id: connectionId });
        if (!connectionUser) {
            return res.status(404).json({ message: "Connection user not found" });
        }

        const existingRequest = await ConnectionRequest.findOne({
            userId: user._id,
            connectionId: connectionUser._id
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Request already sent" });
        }

        const request = new ConnectionRequest({
            userId: user._id,
            connectionId: connectionUser._id
        });

        await request.save();

        return res.json({ message: "Request sent" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getMyConnectionRequests = async (req, res) => {
    const token = req.query.token || req.body.token;

    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const connections = await ConnectionRequest.find({ userId: user._id })
            .populate("connectionId", "name email username profilepicture");

        return res.json({ connections });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const whatAreMyConnections = async (req, res) => {
    const token = req.query.token || req.body.token;

    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const connections = await ConnectionRequest.find({ connectionId: user._id })
            .populate("userId", "name email username profilepicture");

        return res.json({ connections });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const acceptConnectionRequest = async (req, res) => {
    const { token, requestId, action_type } = req.body;

    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const connection = await ConnectionRequest.findOne({ _id: requestId });
        if (!connection) {
            return res.status(404).json({ message: "Connection not found" });
        }

        if (action_type === "accept") {
            connection.status_accepted = true;
        } else {
            connection.status_accepted = false;
        }

        await connection.save();

        return res.json({ message: "Connection updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};