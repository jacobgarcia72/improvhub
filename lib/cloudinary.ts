import { v2 as cloudinary } from 'cloudinary';
import { appName } from "@/lib/app-info";

if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error('CLOUDINARY_CLOUD_NAME is not set');
}

if (!process.env.CLOUDINARY_API_KEY) {
    throw new Error('CLOUDINARY_API_KEY is not set');
}

if (!process.env.CLOUDINARY_API_SECRET) {
    throw new Error('CLOUDINARY_API_SECRET is not set');
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(image: File, folder: string): Promise<string> {
    const imageData = await image.arrayBuffer();
    const mime = image.type;
    const encoding = 'base64';
    const base64Data = Buffer.from(imageData).toString('base64');
    const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;
    const result = await cloudinary.uploader.upload(fileUri, {
        folder: `${appName}/${folder}`,
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    });
    return result.secure_url;
}

export const optimizeImage = (
    imagePath: string,
    width?: number | null,
    height?: number | null,
    quality?: number | null,
    square?: boolean | null,
    rounded?: boolean | null
) => {
    const transformations = [];
    if (square) transformations.push('ar_1.0,c_fill');
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (quality) transformations.push(`q_${quality}`);
    if (rounded) transformations.push('r_max');
    return imagePath.split('upload/').join(`upload/${transformations.join(',')}/`);
}