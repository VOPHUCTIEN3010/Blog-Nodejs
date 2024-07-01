import UserService from "../../services/userServices.js";
import generatePagination from "../../helpers/htmlHelpers.js";
import saveFile from "../../services/uploadServices.js";

const userController = { 
    getAllUsers: async (req, res) => {
        try {
            const user = req.session.user || null;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const keyword = req.query.kw || ''; 
    
            const { users, totalUsers } = await UserService.getAllUsers(page, limit, keyword);
    
            res.render('admin/users/index.ejs', {
                users: users,
                currentPage: page,
                totalPages: Math.ceil(totalUsers / limit),
                postsPerPage: limit,
                totalUsers: totalUsers,
                keyword: keyword,
                cssFile: "admin/users/index.css", 
                jsFile: "admin/users.js",
                generatePagination: generatePagination,
            });
        } catch (err) {
            return res.status(500).json({ message: "An error occurred" });
        }
    },
    getViewUser : async (req, res) => {
        try {
            const user_id = req.params.id;
            const user = await UserService.getUserById(user_id);
            return res.render('admin/users/view.ejs', { user : user, cssFile : "admin/users.css", jsFile : "admin/users.js"} )
        } catch (err) {
            return res.status(500).json({ message: "An error occurred" });
        }
    },
    deleteUser : async (req, res) => {
        try {
            const user_id = req.params.id;
            const result = await UserService.deleteUser(user_id);
            if (!result.success) {
                return res.status(404).json(result);
            }
            return res.status(200).json(result);
        } catch (err) {
            console.error("Error deleting user:", err);
            return res.status(500).json({ message: "An error occurred" });
        }
    },
    getEditUser : async (req, res) => {
        try {
            const user_id = req.params.id;
            const user = await UserService.getUserById(user_id);
            return res.render('admin/users/edit.ejs', { user : user, cssFile : "admin/users.css", jsFile : "admin/users.js"} )
        } catch (err) {
            return res.status(500).json({ message: "An error occurred" });
        }
    },
    updateUser : async (req, res) => {
        try {
            const user_id = req.params.id;
            const { fullname, email, phone, birthday, sex, address, image, role} = req.body;
            let new_image;

            if (req.uploadedFile) {
                let file = await saveFile(req.uploadedFile);
                new_image = file.split("/").slice(3).join("/");

                if (image) {
                    const oldFilePath = `./src/public/upload/${image}`;
                    try {
                        fs.unlinkSync(oldFilePath);
                    } catch (error) {
                        console.error(
                            `Error deleting old image file: ${error}`
                        );
                    }
                }
            } else {
                new_image = image;
            }
            await UserService.updateByUserById(user_id, fullname, email, phone, birthday, sex, address, new_image, role);
            res.redirect('/admin/edit_user/' + user_id);
        } catch (error) {
            console.error(`Error updating user with ID ${user_id}:`, error);
            res.status(500).send('Failed to update user.');
        }    
    }
}

export default userController;