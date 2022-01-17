const express = require("express");
const path = require("path");
const app = express();

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use("/public", express.static("./public"));

app.listen(8080);
console.log("listening on http://localhost:8080");
