'use server'
import { put } from '@vercel/blob'

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];

export const uploadFile = async (FormData: FormData) => {
    const file = FormData.get('file') as File
    if (!file) {
        throw new Error('No file provided');
    }
    const filename = file.name;
    const contentType = file.type;
    const [type, subtype] = contentType.split('/')

    if (!allowedImageTypes.includes(contentType)) {
        throw new Error('Unsupported file type');
    }

    const blob = await put(`reservation/cover/${filename}.${subtype}`, file, {
        access: 'public',
        contentType: contentType,
    });

    return blob.url
}
