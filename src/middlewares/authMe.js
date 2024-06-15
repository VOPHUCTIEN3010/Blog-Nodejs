import { where } from "sequelize";
import User from "../models/User.js";
const authMe = async (req, res, next) => {
    try {
        const email = req.session.email;
        if (!email) {
            return res.status(401).json("Unauthorized");
        } else {
            const results = await User.findAll({
                where: {
                    email: email
                }
            });

            if (results.length === 0) {
                return res.status(401).json("Unauthorized");
            }

            req.user = results[0];
            next();
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: err.message });
    }
}
export default authMe;