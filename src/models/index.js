import Post from './Post.js';
import User from './User.js';
import Comment from './Comment.js';
import Like from './Like.js';

User.hasMany(Post, { as: "posts", foreignKey: 'user_id' });
Post.belongsTo(User, { foreignKey: "user_id", as: "users" });

Post.hasMany(Comment, { as: "comments", foreignKey: 'post_id' });
Comment.belongsTo(Post, { foreignKey: 'post_id', as: "posts" });

User.hasMany(Comment, { as: "comments", foreignKey: 'user_id' });
Comment.belongsTo(User, { foreignKey: 'user_id', as: "users" });

Post.hasMany(Like, { as: "likes", foreignKey: 'post_id' });
Like.belongsTo(Post, { foreignKey: 'post_id', as:'posts' });

Comment.hasMany(Like, { as: "likes", foreignKey: 'comment_id' });

User.hasMany(Like, { as: "likes", foreignKey: 'user_id' });
Like.belongsTo(User, { foreignKey: 'user_id', as: 'users' });

const Relations = {
  Post,
  User,
  Comment,
  Like
};

export default Relations;