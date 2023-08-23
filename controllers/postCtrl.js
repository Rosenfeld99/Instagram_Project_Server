const { UserModel } = require("../models/userModel");

exports.postCtrl = {
  removePost: async (req, res) => {
    const postId = req.params.postId;
    try {
      // Find the current user by ID
      const user = await UserModel.findById(req.tokenData._id, {
        password: 0,
        __v: 0,
        updatedAt: 0,
        createdAt: 0,
      });

      if (!user) {
        return res.status(404).json({ error: "Current user not found" });
      }

      // Find the post by ID and verify ownership
      const postToRemove = user.posts.find(
        (post) => post._id.toString() === postId
      );
      if (!postToRemove) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Remove the post from the user's posts array
      user.posts = user.posts.filter((post) => post._id.toString() !== postId);

      await user.save();

      res.json({ user });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
};
