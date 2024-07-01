import commentService from "../../services/commentServices.js";
import PostServices from "../../services/postServices.js";
import UserService from "../../services/userServices.js";

const dashboardController = { 
    dashboard: async (req, res) => {
        try {
            const totalPosts = await PostServices.getAllPosts();
            const totalUsers = await UserService.getAllUsers();
            const totalComments = await commentService.getAllComments();
            res.render("admin/dashboard.ejs", { totalPosts : totalPosts, totalUsers : totalUsers, totalComments: totalComments });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
}

export default dashboardController;