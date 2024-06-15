import UserService from "../services/userServices.js";
import fs from 'fs';
import saveFile from "../services/uploadServices.js";

const UserCrudController = {
    getAllUsers: async (req, res) => {
        try {
            const results = await UserService.getAllUsers();
            const user = {
                id: 1,
                fullname : "quy",
            }
            return res.render('index.ejs', {listUsers : results , user : user});
        } catch (error) {
            console.error('Error retrieving all users:', error);
            throw error;
        }
    },
    getCreatePages : (req, res) => {
        const oldData = req.body || null;
        res.render('create.ejs',{
            oldData: oldData, 
            errors: null,}
        );
    },
    postCreateUser: async (req, res) => {
        try {
            let {fullname, email, phone, birthday, sex} = req.body;  
            let avatar ;
            let image = null;
            let file = null;
            if (req.uploadedFile) {
                image = req.uploadedFile;
            }
            if (image) {
                file =  await saveFile(image);
                const parts = file.split('/');
                image = parts.slice(3).join('/');
            }
            const results = await UserService.createUsers(fullname, email, phone, birthday, sex, image);
            return res.redirect('/');
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },
    
    getViewUsers : async (req, res) => {
        let user_id = req.params.id;
        let result = await UserService.getUser(user_id);
        res.render('view.ejs', {userView : result});
    },
    postDeleteUser : async (req, res) => {
        try {
            const user_id = req.params.id;
    
            const user = await UserService.getUser(user_id);
    
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (user.image && user.image !== '') {
                try {
                    fs.unlinkSync(`./src/public/upload/${user.image}`);
                } catch (err) {
                    console.error('Lỗi khi xóa ảnh:', err);
                    return res.status(500).json({ message: 'Error deleting user image' });
                }
            }
    
            const deleteResult = await UserService.deleteUser(user_id);
    
            if (req.session) {
                req.session.message = {
                    type: 'info',
                    message: 'User deleted successfully',
                };
            }
    
            res.redirect('/');
        } catch (err) {
            console.error('Lỗi khi xóa người dùng:', err);
            res.status(500).json({ message: 'An error occurred' });
        }
    },
    getEditPages : async (req, res) => {
        let user_id = req.params.id;
        let result = await UserService.getUserById(user_id);
        return res.render('edit.ejs', ({studentEdit: result}) )
    },  
    postUpdateUser : async (req, res) => {
        const user_id = req.params.id;

        if (!user_id) {
            return res.status(400).send('User ID is required.');
        }

        const { fullname, email, phone, birthday, sex, updatedAt, image } = req.body;

        let new_image;

        if (req.file) {
            new_image = req.file.filename;

            if (image) {
                const oldFilePath = `./src/public/upload/${image}`;
                try {
                    fs.unlinkSync(oldFilePath);
                } catch (error) {
                    console.error(`Error deleting old image file: ${error}`);
                }
            }
        } else {
            new_image = image;
        }

        try {
            await UserService.updateByUserById(user_id, fullname, email, phone, birthday, sex, updatedAt, new_image);

            res.redirect('/');
        } catch (error) {
            console.error(`Error updating user with ID ${user_id}:`, error);
            res.status(500).send('Failed to update user.');
        }
    }
    
};
export default UserCrudController;