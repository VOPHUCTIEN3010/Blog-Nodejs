import User from "../models/User.js";
import UserService from "../services/userServices.js"
import Repository from "../repository/repository.js";
import PostServices from "../services/postServices.js";
import generatePagination from "../helpers/htmlHelpers.js";

const UserCtl = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await UserService.login(email, password);
            if (!user) {
                return res.status(400).json({ msg: "Invalid credentials." });
            }
            req.session.user = user;
            req.session.email= email;

            if (user.role === 0) {
                req.session.email= email;
                return res.redirect('/admin/dashboard');
            } else if (user.role === 1) {
                req.session.email= email;
                return res.redirect('/');
            }
        } catch (err) {
            console.log( err.message);
            return res.status(500).json({ msg: err.message });
        }
    },

    logout: (req, res) => {
        req.session.destroy(err => {
            if (err) {
              return res.status(500).json({ msg: 'Could not log out, please try again.' });
            }
            res.redirect("/login");
          });
    },
    register: async (req, res) => {
        try {
            const { fullname, email, password } = req.body;
            const newUser = await UserService.register(fullname, email, password);
            res.redirect('/login');
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ msg: err.message });
        }
    },
    getLoginPage: async (req, res) => {        
        
        return res.render('users/login.ejs', {user: null});
    },
    getRegister : async (req, res) => {
        return res.render('users/register.ejs');
    },
    getInforPage : async (req, res) => {
        try {
            const email = req.session.email;
            if (!email) {
                return res.status(401).json({ msg: 'No token provided.' });
            }

            const user = await User.findOne({
                where: { email: email },
                attributes: { exclude: ['password'] }
            });
    
            if (!user) {
                return res.status(400).json({ msg: 'User does not exist.' });
            }

            res.render('profile/infor.ejs', { user: user, cssFile: 'profile/infor.css', jsFile: 'profile/infor.js' });
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ msg: err.message });
        }    
    },

    
    profile: async (req, res) => {
        try {
            const email = req.session.email;
            if (!email) {
                return res.status(401).json({ msg: 'No token provided.' });
            }
            const user = await User.findOne({
                where: { email: email },
                attributes: { exclude: ['password'] }
            });
    
            if (!user) {
                return res.status(400).json({ msg: 'User does not exist.' });
            }

            res.render('profile/user_profile.ejs', { user: user });
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ msg: err.message });
        }
    },
    updateInfor : async (req, res) => {
        try {
            const user_id = req.user.id;
            if (!user_id) {
                return res.status(401).json({ msg: 'No user_id provided.' });
            }
            const { fullname, email, phone, birthday, sex, address, role} = req.body;
            const old_image = req.user.image;
            const image = await Repository.handleImageUpdate(req, old_image);
            await UserService.updateByUserById(user_id, fullname, email, phone, birthday, sex, address, image, role);
            res.redirect('/infor');
        } catch (error) {
            console.error(`Error updating user with ID ${user_id}:`, error);
            res.status(500).send('Failed to update user.');
        }    
    },
    getMyBlog : async (req, res) => {
        try {
            const user = req.session.user || null;
            const page = parseInt(req.query.page) || 1; 
            const limit = parseInt(req.query.limit) || 10; 
            const keyword = req.query.kw || ''; 
            const {posts, totalPosts} = await PostServices.getAllPostsByUserId(user.id, page, limit, keyword); 
            return res.render('my_blog/index.ejs', {
                posts : posts, 
                user : user, 
                cssFile : "profile/myBlog.css", 
                jsFile: "profile/myBlog.js",
                currentPage: page,
                totalPages: Math.ceil(totalPosts / limit),
                totalPosts: totalPosts,
                postsPerPage: limit,
                keyword : keyword,
                generatePagination: generatePagination,
            });
        } catch (error) {
            console.error('Error retrieving all post:', error);
            throw error;
        }
    }
    
};

export default UserCtl;
