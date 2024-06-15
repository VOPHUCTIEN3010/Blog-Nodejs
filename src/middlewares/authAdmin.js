import User from "../models/User.js";

const authAdmin = async (req, res, next) => {
    try {
        const email = req.session.email;
        if (!email) {
            return res.redirect("/login"); 
        } else {
            const results = await User.findAll({
                where: {
                    email: email
                }
            });
            if (results.length === 0) {
                return res.redirect("/login"); 
            }
            const user = results[0];
            if (user.role === 1 ) {
                return res.redirect("/login"); 
            } 
            req.user = user;
            next();
        }      
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: err.message }); 
    }
}
export default authAdmin;