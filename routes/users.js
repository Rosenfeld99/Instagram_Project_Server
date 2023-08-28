const express = require("express");
const { auth, authAdmin } = require("../middlewares/auth");
const { userCtrl } = require("../controllers/userCtrl");
const { authCtrl } = require("../controllers/authCtrl");
const { adminCtrl } = require("../controllers/adminCtrl");
const { postCtrl } = require("../controllers/postCtrl");
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
router.post("/createStory/", auth, userCtrl.createStory);
router.patch("/toggelFollow/:id", auth, userCtrl.toggelFollow);
router.get("/following/:userName", auth, userCtrl.getFollowingList);
router.get("/followers/:userName", auth, userCtrl.getFollowersList);
router.patch("/followers/removedFollower/:id", auth, userCtrl.removedFollower);
router.patch("/resetNotifications/", auth, userCtrl.resetNotifications);

// POSTS
router.post("/createPost/", auth, userCtrl.createPost);
router.patch("/removePost/:postId", auth, postCtrl.removePost);
router.get("/getSinglePost/:postId/:userName", auth, postCtrl.getSinglePost);
router.patch("/addCommentPost/:postId/:userPost", auth, postCtrl.addCommentPost);
router.get("/commentList/:postId/:userPost", auth, postCtrl.commentList);

// FEED
router.get("/getFeedUser", auth, userCtrl.getFeedUser);

module.exports = router;
