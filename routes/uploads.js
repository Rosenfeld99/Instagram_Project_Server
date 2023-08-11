const express = require("express");
const cloudinary = require("cloudinary").v2;
const { ProductModel } = require("../models/productModel");
const { auth } = require("../middlewares/auth");
const router = express.Router();

// בפרוייקט אמיתי הערכים של המשתנים צריכים להיות ב
// .ENV
// Configuration
cloudinary.config({
  cloud_name: "djwetaeqt",
  api_key: "313437161428726",
  api_secret: "K5CU1ZPpgU87bqvrd98_mxF-T38",
});

router.get("/", async (req, res) => {
  res.json({ msg: "Upload work" });
});

router.post("/product/:id", auth, async (req, res) => {
  try {
    const myFile = req.body.myFile;
    if (myFile) {
      // מעלה את התמונה לקלואדינרי
      const data = await cloudinary.uploader.upload(myFile, {
        unique_filename: true,
      });
      // console.log(myFile);
      // יחזיר פרטים על התמונה שנמצאת בשרת כולל הכתובת שלה
      // ב secure_url
      const id = req.params.id;
      // מעדכנים במסד את היו אר אל של התמונה שעלתה לקלאוד
      const dataProduct = await ProductModel.updateOne(
        { _id: id, user_id: req.tokenData._id },
        { img_url: data.secure_url }
      );
      res.json(dataProduct);
    }
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.post("/cloud_server", async (req, res) => {
  try {
    const myFile = req.body.myFile;
    if (myFile) {
      // מעלה את התמונה לקלואדינרי
      const data = await cloudinary.uploader.upload(myFile, {
        unique_filename: true,
      });
      // console.log(myFile);
      // יחזיר פרטים על התמונה שנמצאת בשרת כולל הכתובת שלה
      // ב secure_url
      res.json(data);
    }
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.post("/cloud1", async (req, res) => {
  try {
    const myFile = req.files.myFile;
    if (myFile) {
      // מעלה את התמונה לקלואדינרי
      const data = await cloudinary.uploader.upload(myFile.tempFilePath, {
        unique_filename: true,
      });
      // console.log(myFile);
      // יחזיר פרטים על התמונה שנמצאת בשרת כולל הכתובת שלה
      // ב secure_url
      res.json(data);
    }
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

module.exports = router;
