import User from '../models/User.js'; // Đường dẫn có thể thay đổi tùy vào cấu trúc dự án của bạn

const auth = async (req, res, next) => {
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

            req.user = results[0];

            next();
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: err.message });
    }
}

export default auth;