import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function UploadCourseThumbnail(thumbnail: File): Promise<string> {
  if (thumbnail.size > 5 * 1024 * 1024) {
    throw new Error("Thumbnail must be under 5MB");
  }
  const bufer = Buffer.from(await thumbnail.arrayBuffer());
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "lms-course-thumbnail",
        },
        (error, result) => {
          if (error || !result) return reject(error);
          return resolve(result?.secure_url);
        },
      )
      .end(bufer);
  });
}

//  try {
//    const rawImg = thumbnail;
//    const bites = await rawImg.arrayBuffer();
//    const buffer = Buffer.from(bites);
//    return await new Promise((resolve, reject) => {
//      cloudinary.uploader
//        .upload_stream(
//          {
//            folder: "lms-course-image",
//          },
//          (error, result) => {
//            if (error) return reject(error);
//            else resolve(result?.secure_url);
//          },
//        )
//        .end(buffer);
//    });
//  } catch (error) {
//    console.error(error);
//  }
// // Optimize delivery by resizing and applying auto-format and auto-quality
// const optimizeUrl = cloudinary.url("shoes", {
//   fetch_format: "auto",
//   quality: "auto",
// });

// console.log(optimizeUrl);

// // Transform the image: auto-crop to square aspect_ratio
// const autoCropUrl = cloudinary.url("shoes", {
//   crop: "auto",
//   gravity: "auto",
//   width: 500,
//   height: 500,
// });

// console.log(autoCropUrl);
