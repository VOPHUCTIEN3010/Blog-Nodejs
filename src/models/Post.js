import sequelize from '../config/connectDB.js';
import { DataTypes } from 'sequelize';

const Post = sequelize.define(
    'post', 
    {
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    slug : {
        type : DataTypes.TEXT,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    number_like: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    number_comment: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    status: {
        type: DataTypes.INTEGER,
        validate: {
            max: 1,
        },
        defaultValue: 1,
    },
    user_id : {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: true,
});
export default Post;
