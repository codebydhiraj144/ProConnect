import multer from "multer";
import { Router } from "express";
import { 
    register, 
    login, 
    uploadprofilepicture, 
    updateUserProfile, 
    getUserAndProfile, 
    updateProfileData
} from "../controllers/user.controller.js";

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

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user_update").post(updateUserProfile);
router.route("/update_profile_picture").post(upload.single("profile_picture"), uploadprofilepicture);
router.route("/get_user_and_profile").get(getUserAndProfile);
router.route("/update_profile_data").post(updateProfileData)


export default router;