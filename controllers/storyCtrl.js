const { UserModel } = require("../models/userModel");

exports.storyCtrl = {
  getStoriesArchives: async (req, res) => {
    try {
      const currentUser = await UserModel.findById(req.tokenData._id);
      if (!currentUser) {
        return res.status(404).json({ error: "Current user not found" });
      }

      const page = req.query.page || 1; // Get the requested page from the query parameter (default to page 1)
      const limit = 10; // Set the limit per page to 10
      const startIndex = (page - 1) * limit; // Calculate the starting index for the current page
      const endIndex = page * limit; // Calculate the ending index for the current page
      const storiesList = currentUser.stories.slice(startIndex, endIndex);

      res.json({
        storiesList,
        currentPage: page,
        totalPages: Math.ceil(currentUser.stories.length / limit),
      });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
  AddHightlight: async (req, res) => {
    try {
      const newHighlight = req.body;
      console.log(newHighlight);
      const currentUser = await UserModel.findById(req.tokenData._id);
      if (!currentUser) {
        return res.status(404).json({ error: "Current user not found" });
      }

      currentUser.highlights.push(newHighlight);
      await currentUser.save();

      res.json({ highlights: currentUser.highlights });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
  getHightlightList: async (req, res) => {
    try {
      const currentUser = await UserModel.findById(req.tokenData._id);
      if (!currentUser) {
        return res.status(404).json({ error: "Current user not found" });
      }

      res.json({ hightlightList: currentUser.highlights });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
};
