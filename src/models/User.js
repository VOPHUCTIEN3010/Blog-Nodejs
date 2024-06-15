import sequelize from '../config/connectDB.js';
import { DataTypes } from 'sequelize';

const User = sequelize.define(
    'user',
    {
        fullname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
                
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true, // Consider adding uniqueness constraint
        },
        birthday: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        sex: {
            type: DataTypes.STRING, // Changed from NUMBER to INTEGER
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true, // Optional field
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.INTEGER, // Changed from NUMBER to INTEGER
            defaultValue: 1,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true, // Địa chỉ là trường tùy chọn
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        }
    },
    {
        tableName: 'users',
        timestamps: true // Tắt tự động quản lý timestamps
    }   
);

  
export default User;
