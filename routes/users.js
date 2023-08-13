const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { userCtrl } = require("../controllers/userCtrl");
const { authCtrl } = require("../controllers/authCtrl");
const { adminCtrl } = require("../controllers/adminCtrl");
const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ msg: "Users endpoint 14:28" });
});

router.get("/checkToken", auth, async (req, res) => {
  res.json(req.tokenData);
});

// AUTH ROUTS
router.get("/userInfo", auth, userCtrl.getUserInfo);
router.post("/", authCtrl.register);
router.post("/login", authCtrl.login);

// ADMIN ROUTS
router.get("/usersList", authAdmin, adminCtrl.getUsersList);
router.delete("/:id", authAdmin, adminCtrl.deleteUser);
router.patch("/changeRole/:id/:role", authAdmin, adminCtrl.changeRole);

// USER ROUTS
router.put("/editInfo", auth, userCtrl.editUserInfo);
router.get("/check-parameter/:key/:value", userCtrl.checkParameter);
router.patch("/updateFavs/", auth, userCtrl.upDateFavs);

module.exports = router;
