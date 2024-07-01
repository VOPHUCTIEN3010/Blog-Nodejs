import User from "../models/User.js";
import bcrypt from "bcrypt";
import sequelize from'sequelize';
import path from 'path';
import fs from 'fs';


const UserService = {
    async getAllUsers(page = 1, limit = 10, keyword = '') {
        try {
            const offset = (page - 1) * limit;
            let whereClause = {};
            if (keyword) {
                whereClause = {
                    [sequelize.Op.or]: [
                        {
                            fullname: {
                                [sequelize.Op.like]: `%${keyword}%`
                            }
                        },
                        {
                            email: {
                                [sequelize.Op.like]: `%${keyword}%`
                            }
                        }
                    ]
                };
            }
            const { count: totalUsers, rows: users } = await User.findAndCountAll({
                where: whereClause,
                // include: ['posts', 'likes', 'comments'],
                limit: limit,
                offset: offset,
                order: [['createdAt', 'DESC']]
            });
            return { users, totalUsers };
        } catch (error) {
            console.error('Error retrieving all users:', error);
            throw error;
        }
    },    
    async getUser(user_id) {
        try {
            const results = await User.findAll({
                where: {
                    id: user_id
                }
            });
            return results;
        } catch (error) {
            console.error('Lỗi khi truy vấn người dùng:', error);
            throw error;
        }
    },    
    async getUserById(user_id) {
        try {
            const results = await User.findAll({
                where: {
                    id: user_id
                }
            });
            let user = results && results.length > 0 ? results[0] : [];
            return user;
        } catch (error) {
            console.error('Lỗi khi truy vấn người dùng:', error);
            throw error;
        }
        
    },
    async createUsers(fullname, email, phone, birthday, sex, avatar) {
        try {
            const user = await User.create({
                fullname,
                email,
                phone,
                birthday,
                sex,
                avatar
            })
            return user;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },
    async updateByUserById(id, fullname, email, phone, birthday, sex, address, image, role) {
        try {
            const  rowsUpdated = await User.update({
                fullname,
                email,
                phone,
                birthday,
                sex,
                address,
                image,
                role
            }, {
                where: {
                    id: id 
                }
            });
            if (rowsUpdated === 0) {
                throw new Error(`No user found with ID ${id} or no changes were made.`);
            }
    
            return rowsUpdated;
    
        } catch (error) {
            console.error(`Error updating user with ID ${id}:`, error);
            throw error; 
        }
    },
    async deleteUser(user_id) {
        try {
            const user = await this.getUserById(user_id);
            if (!user) {
                return { success: false, message: 'Post not found' };
            }
            if (user.image && user.image !== '') {
                const imagePath = path.resolve(`./src/public/upload/${user.image}`);
                try {
                    fs.unlinkSync(imagePath);
                } catch (err) {
                    console.error('Error deleting image:', err);
                    return { success: false, message: 'Error deleting post image' };
                }
            }
            await user.destroy();
            return { success: true, message: 'User deleted successfully' };
        } catch (err) {
            console.error('Error deleting user:', err);
            return false; 
        }
    },
    register: async (fullname, email, password) => {
        try {
            const user = await User.findOne({ where: { email: email } });
            if (user) {
                throw new Error("The email already exists.");
            }
            if (password.length < 6) {
                throw new Error("Password is at least 6 characters long.");
            }
            const passwordHash = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                fullname,
                email,
                password: passwordHash,
            });
            return newUser;
        } catch (err) {
            throw new Error(err.message);
        }
    },
    login: async (email, password) => {
        try {
            const user = await User.findOne({ where: { email: email } });
            if (!user) {
                throw new Error("User does not exist.");
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error("Invalid credentials.");
            }
            return user;
        } catch (err) {
            throw new Error(err.message);
        }
    },
}
export default UserService;