// exports.storyCtrl = {
//   getActiveStories: async (req, res) => {
//     try {
//       const currentUser = await UserModel.findById(req.tokenData._id);
//       if (!currentUser) {
//         return res.status(404).json({ error: "Current user not found" });
//       }

//       const followingUsers = await UserModel.find({
//         _id: { $in: currentUser.following },
//       });

//       const itemsPerPage = 5; // Number of items to show per page
//       const page = req.query.page || 1; // Get the page number from query parameters

//       const startIndex = (page - 1) * itemsPerPage;
//       const endIndex = page * itemsPerPage;

//       const feedPosts = [];

//       for (const user of followingUsers) {
//         for (const post of user.grid) {
//           const postUser = await UserModel.findById(post.userId);

//           if (postUser) {
//             const postWithUserInfo = {
//               _id: post._id,
//               description: post.description,
//               profileImage: postUser.profileImage,
//               username: postUser.username,
//               images: post.images,
//             };
//             feedPosts.push(postWithUserInfo);
//           }
//         }
//       }

//       // Sort the feedPosts array by descending order of creation date
//       feedPosts.sort((a, b) => b.createdAt - a.createdAt);

//       // Paginate the feedPosts array
//       const paginatedFeed = feedPosts.slice(startIndex, endIndex);

//       res.json({ feed: paginatedFeed });
//     } catch (err) {
//       console.log(err);
//       res.status(502).json({ err });
//     }
//   },
// };
