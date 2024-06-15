import handleImageUpload from '../middlewares/upload.js';
import express from 'express';
import UserCtl from '../controllers/userController.js';
import auth from '../middlewares/auth.js';
import HomeCrl from '../controllers/homeController.js';
import adminController from '../controllers/adminController.js';
import PostCtl from '../controllers/postController.js'
import commentCtl from '../controllers/commentController.js';
import authMe from '../middlewares/authMe.js';
import authAdmin from '../middlewares/authAdmin.js';
const router = express.Router();``


// router.get('/view/:id', UserCrudController.getViewUsers);
// router.get('/edit/:id', UserCrudController.getEditPages);
// router.get('/add',  UserCrudController.getCreatePages);
// router.get('/delete/:id', UserCrudController.postDeleteUser);
// router.post('/add-user', handleImageUpload , UserCrudController.postCreateUser);
// router.post('/update/:id', UserCrudController.postUpdateUser);

router.get('/',  HomeCrl.homePage);

router.get('/login', UserCtl.getLoginPage);
router.get('/register', UserCtl.getRegister);
router.get('/logout',  UserCtl.logout);
router.post('/register', UserCtl.register);
router.post('/login',  UserCtl.login)

// user profile
router.get('/user_profile',auth ,UserCtl.profile);
router.get('/infor' , auth, UserCtl.getInforPage)
router.get('/my_blog', auth, UserCtl.getMyBlog)
router.post('/update_infor', auth, handleImageUpload,  UserCtl.updateInfor) 



// blog
router.get('/edit_post/:id', auth, PostCtl.getEditPost);
router.get('/view_post/:id', auth, PostCtl.getViewPost);
router.get('/post/:slug', PostCtl.getShowDetailPost)

router.post('/post_blog', auth, handleImageUpload, PostCtl.CreatePost);
router.post('/delete_post/:id', auth, PostCtl.deletePost)
router.post('/update_post/:id', auth, handleImageUpload, PostCtl.CreatePostUpdate)


//comment 
router.post('/comment_post', authMe, commentCtl.createComment);
router.put('/edit_comment/:id', authMe, commentCtl.editComment);
router.delete('/delete_comment/:id', authMe, commentCtl.deleteComment);


//like 
router.post('/like_post', authMe, PostCtl.addLikePost);
router.post('/like_comment', authMe, commentCtl.addLikeComment);


//admin
router.get('/admin', authAdmin, adminController.dashboard);
router.get('/admin/users_blog', authAdmin, adminController.getAllUserBlog);
router.get('/admin/view_post/:id', authAdmin, adminController.getViewUserBlog)
router.get('/admin/list_users', authAdmin, adminController.getAllUsers);
router.get('/admin/view_user/:id', authAdmin, adminController.getViewUser)
router.post('/admin/delete_post/:id', authAdmin, adminController.deleteUserBlog);



router.post('/updatePostStatus', authMe, PostCtl.postUpdateStatus);


export default router;
