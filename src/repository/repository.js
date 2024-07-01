import saveFile  from "../services/uploadServices.js";
import fs from 'fs'
import PostService from '../services/postServices.js';

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
    },
    async searchRecords (req, res, next) {
        try {
            const { search } = req.query;
            const records = await PostService.searchRecords(search);
            return res.status(200).json(records);
        } catch (error) {
            console.error('Error searching records:', error);
            return res.status(500).json({ message: 'An error occurred' });
        }
    },
}

export default Repository;