import saveFile  from "../services/uploadServices.js";
import fs from 'fs'

const Repository = { 
    async handleImageUpdate(req, old_image)  {

        if (req.uploadedFile) {
            const file = await saveFile(req.uploadedFile);
            const parts = file.split('/');
            const image = parts.slice(3).join('/');

            if (old_image) {
                const oldFilePath = `./src/public/upload/${old_image}`;
                try {
                    fs.unlinkSync(oldFilePath);
                } catch (error) {
                    console.error(`Error deleting old image file: ${error}`);
                }
            }
            return image;
        } else {
            return old_image;
        }
    }
}

export default Repository;