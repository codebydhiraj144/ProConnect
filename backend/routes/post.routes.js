import { Router } from "express";
import multer from "multer";
import { 
    activecheck, 
    createPost, 
    getAllPosts, 
    deletePost,
    commentPost,
    getCommentsByPost,
    deleteComment,
    incrementLikes
} from "../controllers/post.controllers.js";

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.route("/").get(activecheck);
router.route("/post").post(upload.single("media"), createPost);
router.route("/posts").get(getAllPosts);
router.route("/delete_post").delete(deletePost);
router.route("/comment").post(commentPost);
router.route("/get_comments").get(getCommentsByPost);
router.route("/delete_comment").delete(deleteComment);
router.route("/increment_post_like").post(incrementLikes);

export default router;