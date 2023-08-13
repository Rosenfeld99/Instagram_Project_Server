const {
  validateUser,
  UserModel,
  validateLogin,
  createToken,
} = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.authCtrl = {
  register: async (req, res) => {
    const validBody = validateUser(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      const user = new UserModel(req.body);
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
      user.password = "*****";
      res.status(201).json(user);
    } catch (err) {
      if (err.code == 11000) {
        console.log(err);
        return res.status(401).json({
          errMsg: "Email or Phone or userName already in system",
          code: 11000,
          err: err,
        });
      }
      res.status(502).json({ err });
    }
  },
  login: async (req, res) => {
    const validBody = validateLogin(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      const user = await UserModel.findOne({ email: req.body.email });
      if (!user) {
        return res.status(401).json({ err: "Email or password wrong" });
      }
      const passwordValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!passwordValid) {
        return res.status(401).json({ err: "Email or password wrong!" });
      }
      const token = createToken(user._id, user.role);
      res.json({ token, role: user.role });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
};
