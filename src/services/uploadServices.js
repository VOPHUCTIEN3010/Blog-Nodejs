import fs from 'fs';
import path from 'path';

class UploadService {

    async deleteFile(filePath) {
        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

const saveFile = async (file, option = null) => {
    try {
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.originalname}`;
        const filePath = path.join('src/public/upload/', fileName); 
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, file.buffer, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(filePath);
                }
            });
        });
    } catch (error) {
        console.error(error);
    }
};
export default saveFile;
