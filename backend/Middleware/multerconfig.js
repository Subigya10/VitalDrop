import multer from "multer";
import path from "path";




const storage =multer.diskStorage({
    destination :(req,file,cb)=>{
        cb(null,"uploads/")
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname));
    },

});


const filefilter=(req,file,cb)=>{
    const allowedTypes=['image/jpeg','image/jpg','image/png'];
    if(allowedTypes.includes(file.mimetype)){
        cb(null,true);
    }else{
        cb(
new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'),
false
        );
    }
};
 const upload=multer({
    storage:storage,
    fileFilter:filefilter,
    limits:{fileSize:1024*1024*5}, 
});


export default upload;