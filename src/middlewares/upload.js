import multer from 'multer';
import ResponseHandler from '../untils/helper.js';

const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(file.mimetype)) {
            const error = new Error(
                "Chỉ cho phép tải lên hình ảnh JPG, PNG và GIF!"
            );
            error.code = "FORMAT_NOT_ALLOWED";
            return cb(error, false);
        }
        cb(null, true);
    },
});

const handleImageUpload = (req, res, next) => {
    upload.single("image")(req, res, function (err) {
        if (err) {
            if (err.code == "LIMIT_FILE_SIZE") {
                return ResponseHandler.error(
                    res,
                    "Hình ảnh quá lớn! Kích thước tối đa là 5MB.",
                    400
                );
            } else if (err.code == "FORMAT_NOT_ALLOWED") {
                return ResponseHandler.error(
                    res,
                    "Chỉ cho phép tải lên hình ảnh JPG, PNG và GIF!",
                    400
                );
            }
            return ResponseHandler.error(
                res,
                "Đã xảy ra lỗi trong quá trình tải lên hình ảnh.",
                500
            );
        } else if (!req.file) { 
            if (req.method == "post") {
                return ResponseHandler.error(res, "Chua co anh", 400);
            } else if (req.method == "patch") {
                next();
            }
        }

        req.uploadedFile = req.file;
        next();
    });
};


export default handleImageUpload;
