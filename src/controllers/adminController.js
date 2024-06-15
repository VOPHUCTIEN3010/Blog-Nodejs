import PostServices from "../services/postServices.js";
import UserService from "../services/userServices.js";


const adminController = {
    dashboard: async (req, res) => {
        try {
            res.render("admin/dashboard.ejs");
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getAllUserBlog : async (req, res) => {
        try {
            const allPosts = await PostServices.getAllPost();
            res.render("admin/blogs/index.ejs", { posts : allPosts, cssFile : "admin/userBlog.css", jsFile : "admin/userBlog.js"});
        } catch (error) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getViewUserBlog : async (req, res) => {
        try {
            const post_id = req.params.id;
            const post = await PostServices.getPostById(post_id);
            res.render("admin/blogs/view.ejs", { post: post});
        } catch (err) {
            
        }
    },
    deleteUserBlog : async (req, res) => { 
        try {
            const post_id = req.params.id;
            const result = await PostServices.deletePost(post_id);
            if (!result.success) {
                return res.status(404).json(result);
            }
            return res.status(200).json(result);
        } catch (err) {
            console.error("Error deleting post:", err);
            return res.status(500).json({ message: "An error occurred" });
        }
    },
    getAllUsers : async (req, res) => {
        try {
           const allUsers = await UserService.getAllUsers();
           return res.render('admin/users/index.ejs', { users : allUsers, cssFile : "admin/users.css", jsFile : "admin/users.js"} )
        } catch (err) {
            return res.status(500).json({ message: "An error occurred" });
        }
    },
    getViewUser : async (req, res) => {
        try {
            const user_id = req.params.id;
            const user = await UserService.getUserById(user_id);
            return res.render('admin/users/view.ejs', { user : user, cssFile : "admin/users.css", jsFile : "admin/users.js"} )
        } catch (err) {
            return res.status(500).json({ message: "An error occurred" });
        }
    }

};

export default adminController;
