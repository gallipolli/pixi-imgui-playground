const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use("/public", express.static("./public"));

app.listen(port);
console.log(`listening on http://localhost:${port}`);
