import multer, {Multer} from "multer";
import multerS3 from "multer-s3";
import s3 from '../lib/aws'
import dotenv from "dotenv";

dotenv.config();

const uploadAvatar = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME!,
        acl: 'public-read',
        key: (req, file, cb) => {
            cb(null, `avatars/${Date.now()}_${file.originalname}`);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // Лимит файла 5MB
});

export const uploadAvatarMiddleware = uploadAvatar.single('avatar');