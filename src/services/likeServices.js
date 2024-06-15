import Like from "../models/Like.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

const LikeService = {    
    async addLikePost(user_id, post_id) {
        try {
            const data = await Like.findAll({
                where: { post_id, user_id }
            });
    
            if (data.length > 0) {
                const post = await Post.findByPk(post_id);
                if (post) {
                    const updatedNumberLike = Math.max(post.number_like - 1, 0);
                    await post.update({ number_like: updatedNumberLike });
                }
                return await Like.destroy({ where: { post_id, user_id } });
            } else {
                const post = await Post.findByPk(post_id);
                if (post) {
                    const updatedNumberLike = post.number_like + 1;
                    await post.update({ number_like: updatedNumberLike });
                }
                return await Like.create({ user_id, post_id });
            }
            
        } catch (error) {
            console.error('Error updating like status:', error);
            throw error;
        }
    },
    async addLikeComment(user_id, comment_id) {
        try {
            const data = await Like.findAll({
                where: { user_id, comment_id }
            });
            if (data.length > 0) {
                const comment = await Comment.findByPk(comment_id);
                if (comment) {
                    const updatedNumberLike = Math.max(comment.number_like - 1, 0); 
                    await comment.update({ number_like: updatedNumberLike });
                    } 
                return await Like.destroy({ where: { user_id, comment_id } });
            } else {
                const comment = await Comment.findByPk(comment_id);
                if (comment) {
                    const updatedNumberLike = comment.number_like + 1;
                    await comment.update({ number_like: updatedNumberLike });
                }
                return await Like.create({ user_id, comment_id });
            }
            
        } catch (error) {
            console.error('Error updating like status:', error);
            throw error;
        }
    },    
}

export default LikeService;