class ResponseHandler {
    static success(res, message, data = null, status = 200) {
        return res.status(status).json({
            success: true,
            code: status,
            message: message,
            data: data,
        });
    }

    static error(res, message, status = 500) {
        return res.status(status).json({
            success: false,
            code: status,
            message: message,
        });
    }
}

export default ResponseHandler;