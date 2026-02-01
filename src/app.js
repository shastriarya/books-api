const express = require("express");
const bookRoute = require("./routes/book.routes");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
// Tell Express where to find EJS templates (the views folder inside src)
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "views")));

app.use("/api", bookRoute);

module.exports = app;
