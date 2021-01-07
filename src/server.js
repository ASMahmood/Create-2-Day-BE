const express = require("express");

const server = express();
const port = process.env.PORT || 3001;

server.use(express.json());

server.listen(port, () => {
  console.log("Server currently getting chased by ", port, " doomguys");
});
