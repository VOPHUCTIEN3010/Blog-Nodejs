import PostServices from "../services/postServices.js";
import LikeService from "../services/likeServices.js";

const HomeCrl = {
    homePage: async (req, res) => {
        try {
            const user = req.session.user || null;
            const postAll = await PostServices.getAllPost();
            return res.render('index.ejs', { user: user, cssFile: 'main.css', jsFile: 'homePage.js', posts: postAll });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
}
export default HomeCrl;