import cloudinary from 'cloudinary'
import streamifier from 'streamifier'
import { env } from '~/config/environment'

const cloudinaryV2 = cloudinary.v2
cloudinaryV2.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET
})

//https://cloudinary.com/blog/node_js_file_upload_to_a_local_server_or_to_the_cloud
const streamUpLoad = (fileBuffer, folderName) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinaryV2.uploader.upload_stream(
            { folder: folderName }, // Tuỳ chỉnh folder lưu trữ nếu cần
            (error, result) => {
                if (error) reject(error)
                else resolve(result)
            }
        )
        streamifier.createReadStream(fileBuffer).pipe(stream)
    })
}
const streamUpLoadForCV = (fileBuffer, folderName, fileExtension) => {
    return new Promise((resolve, reject) => {
        const randomId = Math.random().toString(36).substring(2, 15) // Tạo ID ngẫu nhiên
        const publicId = `${folderName}/cv_${randomId}.${fileExtension}` // Ví dụ: it_jobs/cv/cv_abc123.pdf
        const stream = cloudinaryV2.uploader.upload_stream(
            {
                folder: folderName,
                resource_type: 'raw',
                public_id: publicId
            },
            (error, result) => {
                if (error) reject(error)
                else resolve(result)
            }
        )
        streamifier.createReadStream(fileBuffer).pipe(stream)
    })
}
export const cloudinaryProvider = { streamUpLoad, streamUpLoadForCV }