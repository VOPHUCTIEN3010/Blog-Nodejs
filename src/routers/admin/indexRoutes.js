import express from 'express';
import handleImageUpload from '../../middlewares/upload.js';

import authAdmin from '../../middlewares/authAdmin.js';
import dashboardController from "../../controllers/admin/dashboardController.js"
import postController from '../../controllers/admin/postController.js';
import userController from '../../controllers/admin/userController.js'
import commentController from '../../controllers/admin/commentController.js';

const router = express.Router();

router.get('/dashboard', authAdmin, dashboardController.dashboard);

router.get('/posts', authAdmin, postController.getAllPosts);
router.get('/search_posts', authAdmin, postController.getAllPosts);
router.get('/view_post/:id', authAdmin, postController.getViewPost);
router.get('/edit_post/:id', authAdmin, postController.getEditPost);
router.post('/update_post/:id', authAdmin, handleImageUpload, postController.updatePost)
router.post('/delete_post/:id', authAdmin, postController.deletePost);

router.get('/users', authAdmin, userController.getAllUsers);
router.get('/search_users', authAdmin, userController.getAllUsers);
router.get('/view_user/:id', authAdmin, userController.getViewUser);
router.get('/edit_user/:id', authAdmin, userController.getEditUser)
router.post('/delete_user/:id', authAdmin,  userController.deleteUser);
router.post('/update_user/:id', authAdmin, handleImageUpload, userController.updateUser);

router.get('/comments', authAdmin, commentController.getAllComments);
router.get('/view_comment/:id', authAdmin, commentController.getViewComments);
router.get('/edit_comment/:id', authAdmin, commentController.getEditComment)
router.post('/delete_comment/:id', authAdmin, commentController.deleteComment);
router.post('/update_comment/:id', authAdmin, commentController.updateComment);

export default router;
