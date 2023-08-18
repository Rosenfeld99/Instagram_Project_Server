const express = require("express");
const cloudinary = require("cloudinary").v2;
const { UserModel } = require("../models/userModel");
const { auth } = require("../middlewares/auth");
const router = express.Router();

// Configuration
cloudinary.config({
  cloud_name: "djwetaeqt",
  api_key: "313437161428726",
  api_secret: "K5CU1ZPpgU87bqvrd98_mxF-T38",
});

router.post("/profileImage", auth, async (req, res) => {
  try {
    const myFile = req.body.myFile;
    if (myFile) {
      // מעלה את התמונה לקלואדינרי
      const data = await cloudinary.uploader.upload(myFile, {
        unique_filename: true,
      });
      console.log(myFile);
      // יחזיר פרטים על התמונה שנמצאת בשרת כולל הכתובת שלה
      // ב secure_url
      const user = await UserModel.findById(req.tokenData._id);
      if (!user) {
        return res.json({ error: " user not found" });
      } // מעדכנים במסד את היו אר אל של התמונה שעלתה לקלאוד
      console.log(data.secure_url);
      console.log(user);
      user.profileImage = data.secure_url;

      await user.save();
      res.json({ user });
    }
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

// router.post("/upload-profile-image", auth, async (req, res) => {
//   try {
//     const userId = req.tokenData._id;
//     const myFile = req.body.myFile;
//     console.log(myFile);

//     if (!myFile) {
//       return res.status(400).json({ error: "No file provided" });
//     }

//     // Upload the image to Cloudinary
//     const uploadedImage = await cloudinary.uploader.upload(myFile, {
//       folder: "profile-images", // Specify the folder in Cloudinary
//       unique_filename: true,
//     });

//     // Update the user's profile image URL in the database
//     const updatedUser = await UserModel.findOneAndUpdate(
//       { _id: userId },
//       { profileImage: uploadedImage.secure_url },
//       { new: true }
//     );

//     res.json(updatedUser);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Error uploading profile image" });
//   }
// });

module.exports = router;
