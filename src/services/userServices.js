import User from "../models/User.js";
import Post  from "../models/Post.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserService = {
    async getAllUsers() {
        try {
            const users = await User.findAll();
            return users;
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
    async updateByUserById(id, fullname, email, phone, birthday, sex, address, image) {
        try {
            const  rowsUpdated = await User.update({
                fullname,
                email,
                phone,
                birthday,
                sex,
                address,
                image
            }, {
                where: {
                    id: id 
                }
            });
            const results = await User.findAll({
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
            const user = await User.findByPk(user_id);

            if (!user) {
                return false;
            }
            await user.destroy();
            return true;
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