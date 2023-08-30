const indexR = require("./index");
const usersR = require("./users");
const categoriesR = require("./categories");
const productsR = require("./products");
const uploadsR = require("./uploads");
const postsR = require("./posts");
const storiesR = require("./stories");

exports.routesInit = (app) => {
  app.use("/",indexR);
  app.use("/users",usersR);
  app.use("/categories",categoriesR);
  app.use("/products",productsR);
  app.use("/uploads",uploadsR);
  app.use("/stories",storiesR)
  app.use("/posts",postsR)
}