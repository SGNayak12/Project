import express from 'express'
import { registeredUser } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { loginUser } from '../controllers/user.controller.js';
import { verifyjwt } from '../middlewares/auth.middleware.js';
import { logOutUser } from '../controllers/user.controller.js';
import { refreshAccessToken } from '../controllers/user.controller.js';

const router=express.Router();


router.route("/").post(upload.fields([
     {
        name:"avatar",
        maxCount:1
     },
     {
        name:"coverImage",
        maxCount:1
     }
]),refreshAccessToken);

router.route('/login').post(loginUser);

router.route('/logout').post(verifyjwt,logOutUser);

export default router;
