import PostServices from "../services/postServices.js";
import saveFile from "../services/uploadServices.js";
import commentService from "../services/commentServices.js";
import LikeService from "../services/likeServices.js";

const PostCtl = {
    CreatePost: async (req, res) => {
        try {
            const { content, title, slug } = req.body;
            let image = null;
            let file = null;
            if (req.uploadedFile) {
                image = req.uploadedFile;
            }
            if (image) {
                file = await saveFile(image);
                const parts = file.split("/");
                image = parts.slice(3).join("/");
            }
            const user_id = req.user.id;
            const newPost = await PostServices.createPosts(
                content,
                title,
                slug,
                image,
                user_id
            );
            return res.redirect("/");
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ msg: err.message });
        }
    },
    getShowDetailPost: async (req, res) => {
        try {
            const slug = req.params.slug;
            const user = req.session.user || null;
            const post = await PostServices.getPostBySlug(slug);
            const commentPost = await commentService.getAllCommentPost(post.id);
            return res.render("post_page_detail/index.ejs", {
                user: user,
                post: post,
                commentPost: commentPost,
                cssFile: "main.css",
                jsFile: "blogDetail.js",
            });
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ msg: err.message });
        }
    },
    deletePost: async (req, res) => {
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
    addLikePost: async (req, res) => {
        try {
            const user_id = req.user.id;
            const post_id = req.body.post_id;
            const data = await LikeService.addLikePost(user_id, post_id);

            const result = {
                status_code: data ? 200 : 503,
                data: data || "",
                error_message: data ? "" : "Cannot save data",
            };

            res.json(result);
        } catch (error) {
            console.error("Error adding like:", error);
            res.status(500).json({ error: error.message });
        }
    },
    getEditPost: async (req, res) => {
        try {
            const post_id = req.params.id;
            const post = await PostServices.getPostById(post_id);
            res.render("my_blog/edit.ejs", {
                postEdit: post,
                user: req.user,
                jsFile: "profile/editBlog.js",
            });
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ msg: err.message });
        }
    },
    getViewPost: async (req, res) => {
        try {
            const post_id = req.params.id;
            const post = await PostServices.getPostById(post_id);
            res.render("my_blog/view.ejs", { post: post, user: req.user });
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({ msg: err.message });
        }
    },
    CreatePostUpdate: async (req, res) => {
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
            await PostServices.updatePostById(
                post_id,
                content,
                title,
                slug,
                new_image
            );

            return res.redirect("/my_blog");
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    postUpdateStatus: async (req, res) => {
        const { postId, status } = req.body;
        try {
            const post = await PostServices.updatePostStatus(postId, status);
            if (!post) {
                return res.status(404).send("Bài đăng không tồn tại");
            }
            
            res.status(200).send("Cập nhật trạng thái thành công");
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            res.status(500).send("Lỗi khi cập nhật trạng thái");
        }
    },
};
export default PostCtl;
