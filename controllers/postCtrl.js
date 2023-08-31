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
    try {
      // Find the current user by ID
      const currentUser = await UserModel.findById(req.tokenData._id, {
        password: 0,
        __v: 0,
        updatedAt: 0,
        createdAt: 0,
      });

      if (!currentUser) {
        return res.status(404).json({ error: "Current user not found" });
      }

      // Find the user by UserName
      const user = await UserModel.findOne({ username: userName });
      if (!user) {
        return res.status(404).json({ error: "User other post not found" });
      }

      // Find the post by ID and verify ownership
      let resp = {};
      const singlePost = user.grid.find(
        (item) => item._id.toString() === postId
      );

      if (!singlePost) {
        return res.status(404).json({ error: "Post not found" });
      }

      resp.images = singlePost.images;
      resp.description = singlePost.description;
      resp.likes = singlePost.likes.length;
      resp._id = singlePost._id;
      resp.username = user.username;
      resp.profileImage = user.profileImage;
      (resp.isCurrentLiked = singlePost.likes.includes(currentUser._id)),
        console.log(resp);

      res.json({ singlePost: resp });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
  // TODO add notofications for commnets
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
      otherPost.notifications.countNewComments++;
      otherPost.notifications.userIdComments.push(currentUser._id);
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
  toggeliked: async (req, res) => {
    const { postId, userName } = req.params;
    // console.log(postId);

    try {
      // Find the current user by ID
      const currentUser = await UserModel.findById(req.tokenData._id, {
        password: 0,
        __v: 0,
        updatedAt: 0,
        createdAt: 0,
      });

      if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
      }
      // console.log(currentUser);

      // Find the user to like/unlike by ID
      const userToToggleLiked = await UserModel.findOne(
        { username: userName },
        {
          password: 0,
          __v: 0,
          updatedAt: 0,
          theme: 0,
          adentification: 0,
        }
      );

      if (!userToToggleLiked) {
        return res.status(404).json({ error: "User to like/unlike not found" });
      }

      const post = userToToggleLiked.grid.filter(
        (post) => post._id.toString() === postId
      );

      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      const singlePost = post[0];

      // console.log(singlePost);
      // console.log(currentUser._id.toString());
      const currentUserId = currentUser._id.toString();
      // Check if the user is already being liked
      const isLiked = singlePost.likes.includes(currentUserId);

      if (isLiked) {
        // Unlike the post
        singlePost.likes = singlePost.likes.filter(
          (id) => id !== currentUserId
        );
        userToToggleLiked.notifications.userIsLiked =
          userToToggleLiked.notifications.userIsLiked.filter(
            (id) => id !== currentUserId
          );
        if (userToToggleLiked.notifications.userIsLiked.length > 0) {
          userToToggleLiked.notifications.countNewLiked--;
        }
      } else {
        // liked the post
        userToToggleLiked.startedLikedAt = new Date(); // Set the timestamp

        singlePost.likes.push(currentUserId);
        userToToggleLiked.notifications.userIsLiked.push(currentUserId);
        userToToggleLiked.notifications.countNewLiked++;
      }

      await currentUser.save();
      await userToToggleLiked.save(); // Save the changes to the followed user as well

      const resp = {};
      resp.images = singlePost.images;
      resp.description = singlePost.description;
      resp.likes = singlePost.likes.length;
      resp._id = singlePost._id;
      resp.username = userToToggleLiked.username;
      resp.profileImage = userToToggleLiked.profileImage;
      (resp.isCurrentLiked = singlePost.likes.includes(currentUser._id)),
        console.log(resp);

      res.json({ singlePost: resp });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
};
