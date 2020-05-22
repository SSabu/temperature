const express = require("express");

const path = require("path");

const app = express();

const PORT = process.env.PORT || 2000;

app.use(express.static(__dirname + "/frontend"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"))
});

app.listen(PORT, () => console.log(`app is running on port ${PORT}`));
