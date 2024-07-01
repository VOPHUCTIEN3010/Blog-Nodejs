import Comment from "../models/Comment.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Like from "../models/Like.js";
import sequelize from'sequelize';
import { Op } from "sequelize";

const commentService = {
    async getAllComments(page = 1, limit = 10, keyword = '') {
        try {
            const offset = (page - 1) * limit;
            let whereClause = {};
            if (keyword) {
                whereClause = {
                    content: {
                        [sequelize.Op.like]: `%${keyword}%`
                    },
                };
            }
            const { count: totalComments, rows: comments } = await Comment.findAndCountAll({
                where: whereClause,
                include: [ 'users', 'posts' ],
                limit: limit,
                offset: offset,
                order: [['createdAt', 'DESC']]
            });
            return { comments, totalComments };
        } catch (error) {
            console.error('Error retrieving all users:', error);
            throw error;
        }
    },
    async getAllCommentPost(post_id) {
        try {
            const comments = await Comment.findAll({
                where: { post_id: post_id },
                include: [
                    { model: User, as: 'users', attributes: ['id', 'fullname', 'image'] }, 
                    { model: Like, as: 'likes', attributes: ['id', 'user_id'] } 
                ],
                order: [['path', 'ASC']]
            });
   
            return comments;
        } catch (error) {
            console.error('Error retrieving all post comments:', error);
            throw error;
        }
    },
    async getCommentById(comment_id) {
        try {
            const comment = await Comment.findByPk(comment_id, {
                include: [
                    { model: User, as: 'users', attributes: ['id', 'fullname', 'image'] }, 
                    { model: Post, as: 'posts', attributes: ['title']}
                ],
            });
            if (!comment) {
                throw new Error('Comment not found');
            }
            return comment;
        } catch (error) {
            console.error('Error retrieving comment by ID:', error);
            throw error;
        }
    },
    async getTotalComments(post_id) {
        try {
            const totalComments = await Comment.count({
                where : {
                    post_id: post_id
                }
            })
            return totalComments;
        } catch (error) {
            console.error('Error retrieving all post:', error);
            throw error;
        }
    },
    createComment: async (content, user_id, post_id, parent_path = '') => {    
        try {
            if (parent_path === null) {
                parent_path = '';
            }
    
            let newPath;
    
            if (parent_path === '') {
                const lastTopLevelComment = await Comment.findOne({
                    where: {
                        post_id: post_id, 
                        path: {
                            [Op.notLike]: '%.%' 
                        }
                    },
                    order: [['path', 'DESC']], 
                    limit: 1 
                });
    
                if (lastTopLevelComment) {
                    const lastNumber = parseInt(lastTopLevelComment.path, 10);
                    newPath = (lastNumber + 1).toString();
                } else {
                    newPath = '1'; 
                }
            } else {
                const lastReply = await Comment.findOne({
                    where: {
                        post_id: post_id, 
                        path: {
                            [Op.like]: `${parent_path}.%`
                        }
                    },
                    order: [['path', 'DESC']], 
                    limit: 1 
                });
    
                if (lastReply) {
                    const lastPath = lastReply.path;
                    const pathSegments = lastPath.split('.');
                    const lastNumber = parseInt(pathSegments[pathSegments.length - 1], 10);
    
                    newPath = `${parent_path}.${lastNumber + 1}`;
                } else {
                    newPath = `${parent_path}.1`; 
                }
            }
    
            const newComment = await Comment.create({
                user_id: user_id,
                post_id: post_id,
                content: content,
                path: newPath
            });
    
            return newComment;
        } catch (error) {
            console.error("Error adding comment:", error);
            throw error;
        }
    },
    editComment: async (commentId, newContent) => { 
        try {
            const comment = await Comment.findOne({ where: { id: commentId } });            
            if (!comment) {
                return res.status(404).json({ success: false, message: 'Comment not found' });
            }
            return await comment.update({ content: newContent });
            } catch (err) {
            res.status(500).json({ success: false, message: 'An error occurred', error: err });
        } 
    },
    deleteComment : async (comment_id) => {
        try {
            const comment = await Comment.findByPk(comment_id);
            if (!comment) {
                return res.status(404).json({ success: false, message: 'Comment not found' });
            }
            await comment.destroy();
            return { success : true, message : 'Comment deleted successfully'}
        } catch (err) {
            res.status(500).json({ success: false, message: 'An error occurred', error: err });
        }
    },
    updateCommentStatus : async (commentId, status) => {
        try {
            const comment = await Comment.findOne({ where: { id: commentId } });
            if (!comment) {
                return res.status(404).json({ success: false, message: 'Comment not found' });
            }
            return await comment.update({ status: status });
        } catch (err) {
            res.status(500).json({ success: false, message: 'An error occurred', error: err });
        }
    },
    updateComment : async (comment_id, newContent) => {
        try {
            const comment = await Comment.findByPk(comment_id);
            if (!comment) {
                return res.status(404).json({ success: false, message: 'Comment not found' });
            }
            return await comment.update({ content: newContent });
        } catch (err) {
            res.status(500).json({ success: false, message: 'An error occurred', error: err });
        }
    }

}

export default commentService;