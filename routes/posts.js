const express = require("express");
const cloudinary = require("cloudinary").v2;
const { validatePost } = require("../validation/validatePost");
const { auth } = require("../middlewares/auth");
const { UserModel } = require("../models/userModel");
const { PostModel } = require("../models/postModel");
const router = express.Router();

// Configuration
cloudinary.config({
  cloud_name: "djwetaeqt",
  api_key: "313437161428726",
  api_secret: "K5CU1ZPpgU87bqvrd98_mxF-T38",
});

router.get("/", async (req, res) => {
  res.json({ msg: "Express posts work" });
});

module.exports = router;

router.post("/createPostFrom1", auth, async (req, res) => {
    const validBody = validatePost(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      const post = req.body;

      const myFile = req.body.images[0].url;
      if (myFile) {
        const data = await cloudinary.uploader.upload(myFile, {
          unique_filename: true,
        });

        const user = await UserModel.findById(req.tokenData._id);
        if (!user) {
          return res.json({ error: "User not found" });
        }

        post.images[0].url = data.secure_url;

        const newPost = new PostModel(post); // יצירת אובייקט של הפוסט

        // קשר בין המשתמש לפוסט
        newPost.userId = user._id;

        // שמירת הפוסט במסד הנתונים
        await newPost.save();

        // קשר בין המשתמש לפוסט ברשימת הפוסטים של המשתמש
        user.posts.push(newPost);

        await user.save();

        res.json({ user, post: newPost });
      }
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  });
