import { Injectable } from "@nestjs/common";
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from "cloudinary";

@Injectable()
export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CDN_CLOUD_NAME,
            api_key: process.env.CDN_API_KEY,
            api_secret: process.env.CDN_API_SECRET
        })
    }

    async uploadImage(file: Express.Multer.File, public_id: string, width: number, height: number): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ 
                upload_preset: "sjsfbfw1", 
                overwrite: true, 
                public_id,
                transformation: [{ width, height, crop: "limit" }]
            }, (error, result) => {
                if (error) {
                    return reject(error); // Rejects the promise if there's an error
                }
                if (result === undefined) {
                    return reject(new Error("Upload resulted in undefined")); // Rejects the promise if result is undefined
                }
                resolve(result); // Resolves the promise with the result if it's not undefined
            }).end(file.buffer);
        });
    }

    async deleteImage(public_id: string): Promise<{ result: string }> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(public_id, (error, result) => {
                if (error)
                    return reject(error)
                resolve(result)
            })
        })
    }

    generateSignedUploadUrl(): { signature: string; timestamp: number; api_key: string; cloud_name: string; upload_preset: string; upload_url: string } {
        const timestamp = Math.round((new Date).getTime() / 1000);
        const signature = cloudinary.utils.api_sign_request({ timestamp: timestamp, upload_preset: process.env.CDN_UPLOAD_PRESET! }, process.env.CDN_API_SECRET!);

        return {
            signature,
            timestamp,
            api_key: process.env.CDN_API_KEY!,
            cloud_name: process.env.CDN_CLOUD_NAME!,
            upload_preset: process.env.CDN_UPLOAD_PRESET!,
            upload_url: `https://api.cloudinary.com/v1_1/${process.env.CDN_CLOUD_NAME!}/image/upload`
        };
    }
}