const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const fileUpload = require("express-fileupload")
const {routesInit} = require("./routes/configRoutes")
require("./db/mongoConnect");

const app = express();
// מאפשר גם לדומיינים חיצוניים לעשות בקשה
app.use(cors());
// מאפשר לשגר קבצים מצד לקוח לצד שרת
// מגביל את הקבצים לגודל 5 מב,  ושיצרו
// קובץ עם כתובת זמנית על השרת
app.use(fileUpload({
  limits:{fileSize:"5mb"},
  useTempFiles:true
}))
// מאפשר לשלוח באדי דרך הצד לקוח
app.use(express.json({limit:"5mb"}));

app.use(express.static(path.join(__dirname,"public")));

routesInit(app);


const server = http.createServer(app);
const port = process.env.PORT || 3008;
server.listen(port);