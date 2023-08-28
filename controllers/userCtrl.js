const { UserModel } = require("../models/userModel");
const { validateEditUser } = require("../validation/validateEditUser");
const { validatePost } = require("../validation/validatePost");
const { validateStory } = require("../validation/validateStory");

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
  getSuggestedAccounts: async (req, res) => {
    try {
      const userId = req.tokenData._id;

      // Find the user by ID
      const user = await UserModel.findById(userId, {
        password: 0,
        __v: 0,
        updatedAt: 0,
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Find suggested accounts that the user is not already following
      const suggestedAccounts = await UserModel.find(
        {
          _id: { $nin: [...user.following, userId] }, // Exclude accounts user is already following and the user itself
        },
        {
          username: 1,
          fullname: 1,
          profileImage: 1,
          posts: { $slice: -3 }, // Get the last 3 posts
        } // Projection: Include only the desired fields
      )
        .sort({ followers: -1 })
        .limit(10); // Limit to 3 suggested accounts

      res.json(suggestedAccounts);
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },

  // getUserByUserName: async (req, res) => {
  //   try {
  //     const { userName } = req.params;
  //     const userId = req.tokenData._id;

  //     // Find the user by UserName
  //     const user = await UserModel.findOne(
  //       { username: userName },
  //       { password: 0 }
  //     );

  //     if (!user) {
  //       return res.status(404).json({ error: "User not found" });
  //     }

  //     // Check if the requested user is the same as the logged-in user
  //     const isSameUser = user._id.toString() === userId.toString();

  //     if (isSameUser) {
  //       res.json({ user, type: "personale" });
  //     } else {
  //       // Filtered user for other users
  //       const filteredUser = {
  //         ...user.toObject(),
  //         password: undefined,
  //         role: undefined,
  //         adentification: undefined,
  //         theme: undefined,
  //         gender: undefined,
  //       };
  //       res.json({ user: filteredUser, type: "another" });
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).json({ err });
  //   }
  // },
  getUserByUserName: async (req, res) => {
    try {
      const { userName } = req.params;
      const userId = req.tokenData._id;

      // Find the user by UserName
      const user = await UserModel.findOne(
        { username: userName },
        {
          _id: 1,
          bio: 1,
          "grid._id": 1,
          "grid.images": 1,
          "grid.description": 1,
          username: 1,
          followers: { $size: "$followers" },
          following: { $size: "$following" },
          profileImage: 1,
        }
      );

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if the requested user is the same as the logged-in user
      const isSameUser = user._id.toString() === userId.toString();

      if (isSameUser) {
        res.json({ user, type: "personale" });
      } else {
        // Filtered user for other users
        res.json({ user, type: "another" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ err });
    }
  },
  editUserInfo: async (req, res) => {
    const validBody = validateEditUser(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      const { gender, bio, category, website } = req.body;

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
        gender !== "Prefer not to say" &&
        gender !== ""
      ) {
        return res.status(400).json({
          error:
            "You need to send gender only : 'Male' or 'Female' or 'Custom' or 'Prefer not to say'",
        });
      }
      const oldGender = user.gender;
      const oldBio = user.bio;
      const oldCategory = user.category;
      const oldWebsite = user.website;

      // Check if content has changed

      // Update user's bio and gender
      user.bio = bio || user.bio;
      user.category = category || user.category;
      user.website = website || user.website;
      user.gender = gender || user.gender;

      const contentChanged =
        oldGender !== user.gender ||
        oldBio !== user.bio ||
        oldCategory !== user.category ||
        oldWebsite !== user.website;

      // Save the changes to the database
      await user.save();

      res.json({ user, modifyCount: contentChanged ? 1 : 0 });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
  remodeCurrentPhoto: async (req, res) => {
    try {
      // Find the user by ID
      const user = await UserModel.findById(req.tokenData._id, {
        password: 0,
        __v: 0,
        updatedAt: 0,
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update user's userPhoto to be default image user
      user.profileImage = "";

      // Save the changes to the database
      await user.save();

      res.json({ user });
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
  changeTheme: async (req, res) => {
    const { mode } = req.params;
    try {
      // Find the user by ID
      const user = await UserModel.findById(req.tokenData._id, {
        password: 0,
        __v: 0,
        updatedAt: 0,
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (mode !== "light" && mode !== "dark") {
        return res.json({ error: "You need to send only light or dark theme" });
      }
      console.log(mode);
      user.theme = mode;
      console.log(user);
      await user.save();

      res.json({ user, msg: `theme change seccess full to ${mode}` });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
  // --> is push new post bt on upload to couldinary is save image post in Blob url --> to all request go to uploads / createPost
  createPost: async (req, res) => {
    const validBody = validatePost(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      const post = req.body;
      // Find the user by ID
      const user = await UserModel.findById(req.tokenData._id, {
        password: 0,
        __v: 0,
        updatedAt: 0,
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      user.posts.push(post);

      await user.save();

      res.json({ user });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
  // --> is push new story bt on upload to couldinary is save image story in Blob url --> to all request go to uploads / createPost
  createStory: async (req, res) => {
    const validBody = validateStory(req.body);
    if (validBody.error) {
      return res.status(400).json(validBody.error.details);
    }
    try {
      const post = req.body;
      // Find the user by ID
      const user = await UserModel.findById(req.tokenData._id, {
        password: 0,
        __v: 0,
        updatedAt: 0,
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      user.stories.push(post);

      await user.save();

      res.json({ user });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
  toggelFollow: async (req, res) => {
    const userIdToToggleFollow = req.params.id; // Extract _id from req.params
    console.log(userIdToToggleFollow);

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
      console.log(currentUser);

      // Find the user to follow/unfollow by ID
      const userToToggleFollow = await UserModel.findById(
        userIdToToggleFollow,
        {
          password: 0,
          __v: 0,
          updatedAt: 0,
          theme: 0,
          adentification: 0,
        }
      );

      if (!userToToggleFollow) {
        return res
          .status(404)
          .json({ error: "User to follow/unfollow not found" });
      }

      // Check if the user is already being followed
      const isFollowing = currentUser.following.includes(userIdToToggleFollow);

      if (isFollowing) {
        // Unfollow the user
        currentUser.following = currentUser.following.filter(
          (id) => id !== userIdToToggleFollow
        );
        userToToggleFollow.followers = userToToggleFollow.followers.filter(
          (id) => id.toString() !== currentUser._id.toString() // Corrected the filtering
        );
        if (userToToggleFollow.notification > 0) {
          userToToggleFollow.notification--;
        }
      } else {
        // Follow the user
        userToToggleFollow.startedFollowingAt = new Date(); // Set the timestamp

        currentUser.following.push(userIdToToggleFollow);
        userToToggleFollow.followers.push(currentUser._id);
        userToToggleFollow.notification++;
      }

      await currentUser.save();
      await userToToggleFollow.save(); // Save the changes to the followed user as well

      res.json({ user: currentUser });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },

  getFollowingList: async (req, res) => {
    try {
      const userName = req.params.userName;
      console.log(userName);

      const currentUser = await UserModel.findOne({ username: userName }); // Use a query object to find by username
      if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const followingUsers = await UserModel.find(
        { _id: { $in: currentUser.following } },
        { _id: 1, username: 1, profileImage: 1, fullname: 1 } // Include only necessary fields
      );

      res.json({ following: followingUsers });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
  resetNotifications: async (req, res) => {
    try {
      // Find the current user by ID
      const user = await UserModel.findById(req.tokenData._id, {
        password: 0,
        __v: 0,
        updatedAt: 0,
        createdAt: 0,
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      // reset notification to 0
      user.notification = 0;
      await user.save();
      // console.log(user);

      res.json({ user });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
  getFollowersList: async (req, res) => {
    try {
      const userName = req.params.userName;
      console.log(userName);

      const currentUser = await UserModel.findOne({ username: userName }); // Use a query object to find by username
      if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const followersUsers = await UserModel.find(
        { _id: { $in: currentUser.followers } },
        { _id: 1, username: 1, profileImage: 1, fullname: 1 } // Include only necessary fields
      );

      res.json({ followers: followersUsers });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
  removedFollower: async (req, res) => {
    const userIdDel = req.params.id;
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

      console.log(currentUser);
      console.log(userIdDel);

      const userToRemove = await UserModel.findById(userIdDel);
      if (!userToRemove) {
        return res.status(404).json({ error: "User to remove not found" });
      }

      // Remove the userToRemove from the currentUser's followers array
      const updatedFollowers = currentUser.followers.filter(
        (followerId) => followerId.toString() !== userToRemove._id.toString()
      );

      // Update the currentUser's followers array with the updatedFollowers array
      currentUser.followers = updatedFollowers;
      await currentUser.save();

      // Remove the currentUser from userToRemove's following array
      const updatedFollowing = userToRemove.following.filter(
        (followingId) => followingId.toString() !== currentUser._id.toString()
      );

      // Update the userToRemove's following array with the updatedFollowing array
      userToRemove.following = updatedFollowing;
      await userToRemove.save();

      const followersUsers = await UserModel.find(
        { _id: { $in: currentUser.followers } },
        { _id: 1, username: 1, profileImage: 1, fullname: 1 } // Include only necessary fields
      );

      res.json({ followers: followersUsers });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
  getFeedUser: async (req, res) => {
    try {
      const currentUser = await UserModel.findById(req.tokenData._id);

      if (!currentUser) {
        return res.status(404).json({ error: "Current user not found" });
      }

      const followingUsers = await UserModel.find(
        { _id: { $in: currentUser.following } },
        { grid: 1 } // Include only the grid field
      );

      // Combine the posts from the grids of following users into a single array
      let feedPosts = [];
      for (const user of followingUsers) {
        feedPosts = feedPosts.concat(user.grid);
      }

      // Sort the feedPosts array by descending order of creation date
      feedPosts.sort((a, b) => b.createdAt - a.createdAt);

      res.json({ feed: feedPosts, });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
};
