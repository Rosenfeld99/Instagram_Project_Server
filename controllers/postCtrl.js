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
  getSinglePost: async (req, res) => {
    const { postId, userName } = req.params;
    console.log(userName);
    try {
      // Find the user by UserName
      const user = await UserModel.findOne({ username: userName });
      if (!user) {
        return res.status(404).json({ error: "User othher post not found" });
      }

      // Find the post by ID and verify ownership
      const singlePost = user.grid.find(
        (item) => item._id.toString() === postId
      );
      // console.log(user.grid);
      // console.log(singlePost);
      if (!singlePost) {
        return res.status(404).json({ error: "Post not found" });
      }

      (singlePost.profileImage = user.profileImage),
        (singlePost.username = user.username),
        console.log(singlePost);
      res.json({ singlePost });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
  addCommentPost: async (req, res) => {
    const { postId, userPost } = req.params;
    const comment = req.body.comment;
    console.log(postId);

    try {
      // Find the current user by ID
      const currentUser = await UserModel.findById(req.tokenData._id, {
        password: 0,
        __v: 0,
        updatedAt: 0,
        createdAt: 0,
      });

      console.log(currentUser);
      if (!currentUser) {
        return res.status(404).json({ error: "Current user not found" });
      }

      const otherPost = await UserModel.findOne({ username: userPost }); // Use a query object to find by username
      if (!otherPost) {
        return res.status(404).json({ error: "User other not found" });
      }
      console.log(otherPost);

      // Find the post by ID and verify ownership
      const singlePost = otherPost.grid.find(
        (post) => post._id.toString() === postId
      );
      console.log(singlePost);
      if (!singlePost) {
        return res.status(404).json({ error: "Post not found" });
      }
      console.log(singlePost);

      const newComment = {
        username: currentUser.username,
        profileImage: currentUser.profileImage,
        time: Date.now(),
        comment: comment,
      };

      singlePost.comments.push(newComment);
      await otherPost.save();

      res.json({ singlePost });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
  commentList: async (req, res) => {
    const { postId, userPost } = req.params;
    const comment = req.body.comment;
    console.log(postId);

    try {
      // Find the current user by ID
      const currentUser = await UserModel.findById(req.tokenData._id, {
        password: 0,
        __v: 0,
        updatedAt: 0,
        createdAt: 0,
      });

      console.log(currentUser);
      if (!currentUser) {
        return res.status(404).json({ error: "Current user not found" });
      }

      const otherPost = await UserModel.findOne({ username: userPost }); // Use a query object to find by username
      if (!otherPost) {
        return res.status(404).json({ error: "User other not found" });
      }
      console.log(otherPost);

      // Find the post by ID and verify ownership
      const singlePost = otherPost.grid.find(
        (post) => post._id.toString() === postId
      );
      console.log(singlePost);
      if (!singlePost) {
        return res.status(404).json({ error: "Post not found" });
      }
      console.log(singlePost);

      res.json(singlePost.comments);
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
};
