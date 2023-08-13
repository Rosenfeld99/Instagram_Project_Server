const { UserModel, validateEditUser } = require("../models/userModel");

exports.userCtrl = {
  getUserInfo: async (req, res) => {
    try {
      const user = await UserModel.findOne(
        { _id: req.tokenData._id },
        { password: 0, __v: 0, updatedAt: 0 }
      );
      res.json({ user });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
  editUserInfo: async (req, res) => {
    const validBody = validateEditUser(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      const { gender, bio } = req.body;

      // Find the user by ID
      const user = await UserModel.findById(req.tokenData._id, {
        password: 0,
        __v: 0,
        updatedAt: 0,
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (
        gender !== "Male" &&
        gender !== "Female" &&
        gender !== "Custom" &&
        gender !== "Prefer not to say"
      ) {
        return res.status(400).json({
          error:
            "You need to send gender only : 'Male' or 'Female' or 'Custom' or 'Prefer not to say'",
        });
      }

      // Update user's bio and gender
      user.bio = bio || user.bio;
      user.gender = gender || user.gender;

      // Save the changes to the database
      await user.save();

      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
  upDateFavs: async (req, res) => {
    try {
      // בדוק שהבאדי שלך פאבס איי אר שהוא מערך
      if (!Array.isArray(req.body.favs_ar)) {
        return res
          .status(400)
          .json({ msg: "You need to send favs_ar as array" });
      }
      const data = await UserModel.updateOne(
        { _id: req.tokenData._id },
        { favs_ar: req.body.favs_ar }
      );
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
  checkParameter: async (req, res) => {
    const { key, value } = req.params;
    try {
      // check wat is type the we want to check if is exists
      let user;
      if (key === "username") {
        user = await UserModel.findOne({ username: value });
      } else if (key === "email") {
        user = await UserModel.findOne({ email: value });
      } else if (key === "phone") {
        user = await UserModel.findOne({ phone: value });
      } else {
        return res.json({
          msg: "You need to send only this keys : 'username' or 'email' or 'phone' ",
        });
      }

      if (user) {
        // Parameter exists
        res.json({ exists: true });
      } else {
        // Parameter doesn't exist
        res.json({ exists: false });
      }
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
};
