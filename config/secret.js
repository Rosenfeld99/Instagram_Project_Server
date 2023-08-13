require("dotenv").config();

// console.log(process.env.MONGO_DB);
exports.config = {
  PASS_DB:process.env.PASS_DB,
  USER_DB:process.env.USER_DB,
  TOKEN_SECRET:process.env.TOKEN_SECRET,
  MONGO_DB:process.env.MONGO_DB,
  CLOUD_NAME:"dccoiwwxy",
  CLOUD_KEY:"664974667326928",
  CLOUD_SECRET:"dZhz2yfM5I8k9OB60HO9zVprjpI"
  
}