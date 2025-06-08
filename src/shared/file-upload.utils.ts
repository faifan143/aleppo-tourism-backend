import { HttpException, HttpStatus } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Utility functions for file uploads
export const fileUploadConfig = (destination = './public/uploads/photos') => ({
    storage: diskStorage({
        destination,
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
    }),
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new HttpException(
                    'Unsupported file type. Only JPEG, JPG, and PNG are allowed.',
                    HttpStatus.BAD_REQUEST,
                ),
                false,
            );
        }
    },
});

// Function to ensure the upload directory exists
export const ensureUploadDirectories = () => {
    const fs = require('fs');
    const directories = [
        './public',
        './public/uploads',
        './public/uploads/photos',
        './public/uploads/events',
    ];

    directories.forEach((dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
}; 