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
router.post("/", authCtrl.register);
router.post("/login", authCtrl.login);

// ADMIN ROUTS
router.get("/usersList", authAdmin, adminCtrl.getUsersList);
router.delete("/:id", authAdmin, adminCtrl.deleteUser);
router.patch("/changeRole/:id/:role", authAdmin, adminCtrl.changeRole);

// USER ROUTS
router.get("/userInfo", auth, userCtrl.getUserInfo);
router.get("/getUserByUserName/:userName", auth, userCtrl.getUserByUserName);
router.get("/suggestedAccounts", auth, userCtrl.getSuggestedAccounts);
router.put("/editInfo", auth, userCtrl.editUserInfo);
router.patch("/removeCurrentPhoto", auth, userCtrl.remodeCurrentPhoto);
router.get("/check-parameter/:key/:value", userCtrl.checkParameter);
router.patch("/change-theme/:mode", auth, userCtrl.changeTheme);
router.patch("/updateFavs/", auth, userCtrl.upDateFavs);
router.post("/createPost/", auth, userCtrl.createPost);
router.post("/createStory/", auth, userCtrl.createStory);
router.patch("/toggelFollow/:id", auth, userCtrl.toggelFollow);
router.get("/following/:userName", auth, userCtrl.getFollowingList);
router.get("/followers/:userName", auth, userCtrl.getFollowersList);
// TODO remove follower from array (onclick in list in cilent)

module.exports = router;
