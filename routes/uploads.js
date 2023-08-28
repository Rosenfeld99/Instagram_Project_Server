const express = require("express");
const cloudinary = require("cloudinary").v2;
const { UserModel } = require("../models/userModel");
const { auth } = require("../middlewares/auth");
const { validateStory } = require("../validation/validateStory");
const { validatePost } = require("../validation/validatePost");
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
      // console.log(data.secure_url);
      // console.log(user);
      user.profileImage = data.secure_url;

      await user.save();
      res.json({ user });
    }
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.post("/createStory", auth, async (req, res) => {
  const validBody = validateStory(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const story = req.body;
    // console.log(story);
    const myFile = req.body.url;
    if (myFile) {
      // update to cloudinary
      const data = await cloudinary.uploader.upload(myFile, {
        unique_filename: true,
      });
      console.log("somthing");
      // return information for image end url also
      // ב secure_url
      const user = await UserModel.findById(req.tokenData._id);
      if (!user) {
        return res.json({ error: " user not found" });
      }
      console.log(user);
      story.url = data.secure_url;
      user.stories.push(story);

      await user.save();
      res.json({ user });
    }
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.post("/createPost", auth, async (req, res) => {
  const validBody = validatePost(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const post = req.body;
    // console.log(story);
    const myFile = req.body.images[0].url;
    if (myFile) {
      // console.log("somthing");
      // update to cloudinary
      const data = await cloudinary.uploader.upload(myFile, {
        unique_filename: true,
      });
      // return information for image end url also
      // ב secure_url
      const user = await UserModel.findById(req.tokenData._id);
      if (!user) {
        return res.json({ error: " user not found" });
      }
      
      console.log(user);
      post.images[0].url = data.secure_url;
      user.posts.push(post);
      // add post to grid
      user.grid.push(post);

      await user.save();
      res.json({ user });
    }
  } catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

module.exports = router;
