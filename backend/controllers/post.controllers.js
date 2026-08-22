import User from "../models/user.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";

export const activecheck = async (req, res) => {
    return res.status(200).json({ message: "RUNNING" });
};

export const createPost = async (req, res) => {
    try {
        const { token, body } = req.body || {};

        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const post = new Post({
            userId: user._id,
            body: body || "",
            media: req.file ? req.file.filename : "",
            filetype: req.file ? req.file.mimetype.split("/")[1] : ""
        });

        await post.save();
        return res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("userId", "name username email profilepicture")
            .sort({ createdAt: -1 });

        return res.json({ posts });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deletePost = async (req, res) => {
    const { token, post_id } = req.body || {};

    try {
        if (!token || !post_id) {
            return res.status(400).json({ message: "Token and post_id are required" });
        }

        const user = await User.findOne({ token }).select("_id");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const post = await Post.findOne({ _id: post_id });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.userId.toString() !== user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized to delete this post" });
        }

        await Post.deleteOne({ _id: post_id });
        return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const commentPost = async (req, res) => {
    const { token, post_id, commentBody } = req.body || {};

    try {
        if (!token || !post_id || !commentBody) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ token }).select("_id");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const post = await Post.findOne({ _id: post_id });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = new Comment({
            userId: user._id,
            postId: post._id,
            comment: commentBody
        });

        await comment.save();
        return res.status(201).json({ message: "Comment created successfully", comment });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getCommentsByPost = async (req, res) => {
    const { post_id } = req.query;

    try {
        if (!post_id) {
            return res.status(400).json({ message: "post_id query parameter is required" });
        }

        const comments = await Comment.find({ postId: post_id })
            .populate("userId", "name username email profilepicture")
            .sort({ createdAt: -1 });

        return res.json({ comments });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteComment = async (req, res) => {
    const { token, comment_id } = req.body || {};

    try {
        const user = await User.findOne({ token }).select("_id");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const comment = await Comment.findOne({ _id: comment_id });
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.userId.toString() !== user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized to delete this comment" });
        }

        await Comment.deleteOne({ _id: comment_id });
        return res.json({ message: "Comment deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const incrementLikes = async (req, res) => {
    const { token, post_id } = req.body || {};

    try {
        const user = await User.findOne({ token }).select("_id");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const post = await Post.findOne({ _id: post_id });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const isLiked = post.likes.includes(user._id);

        if (isLiked) {
            post.likes = post.likes.filter((id) => id.toString() !== user._id.toString());
        } else {
            post.likes.push(user._id);
        }

        await post.save();
        return res.json({ message: isLiked ? "Post unliked" : "Post liked", likesCount: post.likes.length });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};