// index.js
import express from 'express';
import handleImageUpload from '../../middlewares/upload.js';

import auth from '../../middlewares/auth.js';
import authMe from '../../middlewares/authMe.js';

import UserCtl from '../../controllers/userController.js';
import HomeCrl from '../../controllers/homeController.js';
import PostCtl from '../../controllers/postController.js'
import commentCtl from '../../controllers/commentController.js';

const router = express.Router();

router.get('/', HomeCrl.homePage);

router.get('/login', UserCtl.getLoginPage);
router.get('/register', UserCtl.getRegister);
router.get('/logout', UserCtl.logout);
router.post('/register', UserCtl.register);
router.post('/login', UserCtl.login);

// user profile
router.get('/user_profile', auth, UserCtl.profile);
router.get('/infor', auth, UserCtl.getInforPage)
router.get('/my_blog', auth, UserCtl.getMyBlog)
router.post('/update_infor', auth, handleImageUpload, UserCtl.updateInfor);

// blog
router.get('/edit_post/:id', auth, PostCtl.getEditPost);
router.get('/view_post/:id', auth, PostCtl.getViewPost);
router.get('/post/:slug', PostCtl.getShowDetailPost)

router.post('/post_blog', auth, handleImageUpload, PostCtl.CreatePost);
router.post('/delete_post/:id', auth, PostCtl.deletePost)
router.post('/update_post/:id', auth, handleImageUpload, PostCtl.CreatePostUpdate)

// comment 
router.post('/comment_post', authMe, commentCtl.createComment);
router.put('/edit_comment/:id', authMe, commentCtl.editComment);
router.delete('/delete_comment/:id', authMe, commentCtl.deleteComment);

// like 
router.post('/like_post', authMe, PostCtl.addLikePost);
router.post('/like_comment', authMe, commentCtl.addLikeComment);

router.post('/updatePostStatus', authMe, PostCtl.postUpdateStatus);
router.post('/updateCommentStatus', authMe, commentCtl.commentUpdateStatus);


export default router;
