import PostServices from "../../services/postServices.js";
import generatePagination from "../../helpers/htmlHelpers.js";
import saveFile from "../../services/uploadServices.js";
const postController = { 
    async getAllPosts(req, res) {
        try {
            const user = req.session.user || null;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const keyword = req.query.kw || ''; 

            const { posts, totalPosts } = await PostServices.getAllPosts(page, limit, keyword);

            res.render("admin/posts/index.ejs", {
                posts: posts,
                currentPage: page,
                totalPages: Math.ceil(totalPosts / limit),
                postsPerPage: limit,
                totalPosts: totalPosts,
                keyword : keyword,
                cssFile: "admin/posts.css",
                jsFile: "admin/posts.js",
                generatePagination: generatePagination,
            });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getViewPost : async (req, res) => {
        try {
            const post_id = req.params.id;
            const post = await PostServices.getPostById(post_id);
            res.render("admin/posts/view.ejs", { post: post});
        } catch (err) {
            
        }
    },
    deletePost : async (req, res) => { 
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
    getEditPost : async (req, res) => {
        try {
            const post_id = req.params.id;
            const post = await PostServices.getPostById(post_id);
            res.render("admin/posts/edit.ejs", { post: post, jsFile: "admin/editPost.js" });
        } catch (err) {
            return res.status(500).json({ message: "An error occurred" });
        }
    },
    updatePost : async (req, res) => {
        try {
            const post_id = req.params.id;
            const { content, title, slug, image } = req.body;
            let new_image;
            
            if (req.uploadedFile) {
                let file = await saveFile(req.uploadedFile);
                new_image = file.split("/").slice(3).join("/");
                
                if (image) {
                    const oldFilePath = `./src/public/upload/${image}`;
                    try {
                        fs.unlinkSync(oldFilePath);
                    } catch (error) {
                        console.error(
                            `Error deleting old image file: ${error}`
                        );
                    }
                }
            } else {
                new_image = image;
            }
            await PostServices.updatePostById(post_id, content, title, slug, new_image);
            return res.redirect('/admin/edit_post/' + post_id);
        } catch (err) {
            console.error("Error updating post:", err);
            return res.status(500).json({ message: "An error occurred" });
        }
    }

}

export default postController;