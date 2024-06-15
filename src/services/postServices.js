import Post from '../models/Post.js'
import Like from '../models/Like.js';
import Comment from '../models/Comment.js';
import fs from 'fs';
import path from 'path';
import User from '../models/User.js';
const PostServices = {
    async getAllPost() {
        try {
            const posts = await Post.findAll({ 
                include: [
                    "users",
                    "comments",
                    "likes",
                ] 
            });
            return posts;
        } catch (error) {
            console.error('Error retrieving all posts:', error);
            throw error;
        }
    },  
    async getPostBySlug(slug) {
        try {
            const post = await Post.findOne({
                where: { slug: slug },
                include: [
                    { model: User, as: 'users', attributes: ['id', 'fullname', 'image'] }, 
                    { model: Like, as: 'likes', attributes: ['id', 'user_id'] },
                    { model: Comment, as: 'comments'}
                ]
            });    
            return post;
        } catch (error) {
            console.error('Error querying users:', error);
            throw error;
        }         
    },
    async getPostById(post_id) {
        try {
            const results = await Post.findAll({
                where: {
                    id: post_id
                }
            });
            let post = results && results.length > 0 ? results[0] : null;
            return post;
        } catch (error) {
            console.error('Lỗi khi truy vấn bài viết:', error);
            throw error;
        }
    },    
    async getUsersWhoLikedPost(post_id) {
        try {
            const likes = await Like.findAll({
                attributes: ['user_id'],
                where: {
                    post_id: post_id
                }
            });
            const userIds = likes.map(like => like.user_id);
            return userIds;
        } catch (error) {
            console.error('Error retrieving users who liked the post:', error);
            throw error;
        }
    },
    async createPosts(content, title, slug, image, user_id) {
        try {
            const post = await Post.create({
                content, 
                title,
                image,
                slug,
                user_id
            })
            return post;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },
    async deletePost(post_id) {
        try {
            const post = await this.getPostById(post_id);
            if (!post) {
                return { success: false, message: 'Post not found' };
            }

            if (post.image && post.image !== '') {
                const imagePath = path.resolve(`./src/public/upload/${post.image}`);
                try {
                    fs.unlinkSync(imagePath);
                } catch (err) {
                    console.error('Error deleting image:', err);
                    return { success: false, message: 'Error deleting post image' };
                }
            }

            await post.destroy();
            return { success: true, message: 'Post deleted successfully' };

        } catch (err) {
            console.error('Error deleting post:', err);
            return { success: false, message: 'An error occurred' };
        }
    },
    async updatePostById(post_id, content, title, slug, image) {
        try {
            const rowsUpdated = await Post.update({
                content, 
                title, 
                slug, 
                image
            }, {
                where: {
                    id: post_id 
                }
            });
            if (rowsUpdated[0] === 0) {
                throw new Error(`Không tìm thấy bài viết với ID ${id} hoặc không có thay đổi nào được thực hiện.`);
            }    
            return rowsUpdated;
        } catch (err) {
            throw err; 
        }
    },
    async updatePostStatus(post_id, status) {
        try {
            const rowsUpdated = await Post.update({
                status
            }, {
                where: {
                    id: post_id 
                }
            });
            if (rowsUpdated[0] === 0) {
                throw new Error(`Không tìm thấy bài viết với ID ${id} hoặc không có thay đổi nào được thực hiện.`);
            }    
            return rowsUpdated;
        } catch (err) {
            throw err; 
        }
    },   
    
}

export default PostServices;