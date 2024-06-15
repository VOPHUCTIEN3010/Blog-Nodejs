import sequelize from '../config/connectDB.js';
import { DataTypes } from 'sequelize';

const Like = sequelize.define('like',{
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    comment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    type: {
        type: DataTypes.INTEGER,
        validate: {
            max: 1,
        },
    }
}); 

export default Like;