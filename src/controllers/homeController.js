import PostServices from "../services/postServices.js";
import generatePagination from "../helpers/htmlHelpers.js";


const HomeCrl = {
    homePage: async (req, res) => {
        try {
            const user = req.session.user || null;
            const page = parseInt(req.query.page) || 1; 
            const limit = parseInt(req.query.limit) || 10; 
            const keyword = req.query.kw || ''; 
            const { posts, totalPosts } = await PostServices.getAllPosts(page, limit);
            return res.render('index.ejs', {
                user: user,
                cssFile: 'main.css',
                jsFile: 'homePage.js',
                posts: posts,
                currentPage: page,
                totalPages: Math.ceil(totalPosts / limit),
                totalPosts: totalPosts,
                postsPerPage: limit,
                keyword : keyword,
                generatePagination: generatePagination,
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
    
}
export default HomeCrl;