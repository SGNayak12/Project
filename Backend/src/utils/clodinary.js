import {v2 as cloudinary} from "cloudinary";
import fs from 'fs'
cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME ,
        api_key:process.env.CLOUDINARY_API_KEY ,
        api_secret:process.env.CLOUDINARY_API_SECRET
    });

const cloudinaryFileUpload=async(filePath)=>{
     try {
        if(!filePath) return null;
        const response=await cloudinary.uploader.upload(filePath,{resource_type:"auto"})
        fs.unlinkSync(filePath);
        return {success:true,response};
        
     } catch (error) {
        console.error('Error during file upload:', error);
        fs.unlinkSync(filePath)
        return { success: false, error };
    }
}

export {cloudinaryFileUpload}