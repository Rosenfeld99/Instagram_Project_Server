const { UserModel } = require("../models/userModel");

exports.adminCtrl = {
  getUsersList: async (req, res) => {
    try {
      const data = await UserModel.find({}, { password: 0 });
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
  changeRole: async (req, res) => {
    try {
      const { id, role } = req.params;
      if (role != "user" && role != "admin") {
        return res.status(401).json({ err: "You can send admin or user role" });
      }
      // אדמין לא יוכל לשנות את עצמו
      if (id == req.tokenData._id) {
        return res.status(401).json({ err: "you cant change your self" });
      }
      // RegExp -> פקודת שלילה חייבת לעבוד עם ביטוי רגולרי
      // כדי לדאוג שלא נוכל להשפיע על סופר אדמין
      const data = await UserModel.updateOne(
        { _id: id, role: { $not: new RegExp("superadmin") } },
        { role }
      );
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      // אדמין לא יוכל לשנות את עצמו
      if (id == req.tokenData._id) {
        return res.status(401).json({ err: "you cant delete your self" });
      }
      // RegExp -> פקודת שלילה חייבת לעבוד עם ביטוי רגולרי
      // כדי לדאוג שלא נוכל להשפיע על סופר אדמין
      const data = await UserModel.deleteOne({
        _id: id,
        role: { $not: new RegExp("superadmin") },
      });
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
};
