import commentService from "../services/commentServices.js";
import LikeService from "../services/likeServices.js";
const commentCtl = {
    createComment: async (req, res) => {
        try {
            const { content, post_id , path} = req.body;
            const user_id = req.user.id;
            const newComment = await commentService.createComment(content, user_id, post_id, path);
            res.status(200).json({ response: newComment });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    editComment: async (req, res) => {
        const commentId = req.params.id;
        const newContent = req.body.content;        
        try {
            const newComment = await commentService.editComment(commentId, newContent);
            res.status(200).json({ success: true, message: 'Comment updated', newComment });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    deleteComment : async (req, res) => {
        const commentId = req.params.id;
        try {
            await commentService.deleteComment(commentId);
            res.status(200).json({ success: true, message: 'Comment deleted' });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    addLikeComment : async (req, res) => {
        try {
            const user_id = req.user.id;
            const comment_id = req.body.comment_id;
            const post_id = req.body.post_id;

            const data = await LikeService.addLikeComment(user_id, comment_id, post_id);
            const result = {
                "status_code": data ? 200 : 503,
                "data": data || '',
                "error_message": data ? '' : 'Cannot save data'
            };
        
            res.json(result);
        } catch (error) {
            console.error('Error adding like:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

export default commentCtl;