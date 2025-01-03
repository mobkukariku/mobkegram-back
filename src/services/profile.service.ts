import { Express } from 'express';

export const uploadAvatarService = async (file: Express.MulterS3.File): Promise<string> => {
    return file.location; // Возвращает URL загруженного файла
};
