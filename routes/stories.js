const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ msg: "stories work" });
});

module.exports = router;
