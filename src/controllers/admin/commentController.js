import commentService from "../../services/commentServices.js";
import generatePagination from "../../helpers/htmlHelpers.js";

const commentController = { 
    getAllComments: async (req, res) => {
        try {
            const user = req.session.user || null;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const keyword = req.query.kw || ''; 

            const {comments, totalComments} = await commentService.getAllComments(page, limit, keyword);
            res.render('admin/comments/index.ejs', {
                comments: comments,
                currentPage: page,
                totalPages: Math.ceil(totalComments / limit),
                postsPerPage: limit,
                totalComments: totalComments,
                keyword : keyword,
                cssFile : "admin/comments.css", 
                jsFile : "admin/comments.js",
                generatePagination: generatePagination,
            });
        } catch (err) {
            return res.status(500).json({ message: "An error occurred" });
        }
    },
    deleteComment : async (req, res) => {
        try {
            const comment_id = req.params.id;
            const result = await commentService.deleteComment(comment_id);
            if (!result.success) {
                return res.status(404).json(result);
            }
            return res.status(200).json(result);
        } catch (err) {
            console.error("Error deleting user:", err);
            return res.status(500).json({ message: "An error occurred" });
        }
    },
    getViewComments : async (req, res) => {
        try {
            const comment_id = req.params.id;
            const comment = await commentService.getCommentById(comment_id);
            return res.render('admin/comments/view.ejs', { comment : comment, cssFile : "admin/users.css", jsFile : "admin/users.js"} )
        } catch (err) {
            return res.status(500).json({ message: "An error occurred" });
        }
    },
    getEditComment : async (req, res) => {
        try {
            const comment_id = req.params.id;
            const comment = await commentService.getCommentById(comment_id);
            return res.render('admin/comments/edit.ejs', { comment : comment, cssFile : "admin/users.css", jsFile : "admin/users.js"} )
        } catch (err) {
            return res.status(500).json({ message: "An error occurred" });
        }
    },
    updateComment : async (req, res) => {
        try {
            const comment_id = req.params.id;
            const content = req.body.content;
            await commentService.updateComment(comment_id, content);    
            return res.redirect('/admin/edit_comment/' + comment_id);
        } catch (err) {
            console.error("Error updating comment:", err);
            return res.status(500).json({ message: "An error occurred" });
        }
    }
}

export default commentController;