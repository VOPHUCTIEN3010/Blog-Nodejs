import sequelize from '../config/connectDB.js';
import { DataTypes } from 'sequelize';

const Comment = sequelize.define(
    'comment',{
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            post_id: {
        },
            type: DataTypes.INTEGER,
            allowNull: false,
        }, 
        content : {
            type: DataTypes.TEXT,
            allowNull: false,
        }, 
        number_like : {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        }, 
        status : {
            type: DataTypes.INTEGER,
            validate: {
                max: 1,
            },
            defaultValue: 1,
        },
        type : {
            type: DataTypes.INTEGER,
            validate: {
                max: 1,
            },
            defaultValue: 1,
        },
        path : {
            type : DataTypes.STRING,
        },
        },{timestamps: true});
        
export default Comment;

        
