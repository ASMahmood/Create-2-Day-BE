const express = require("express");
const cors = require("cors");
const examsRouter = require("./exams");

const server = express();
const port = process.env.PORT || 3001;

server.use(cors());
server.use(express.json());

server.use("/exams", examsRouter);

server.listen(port, () => {
  console.log("Server currently getting chased by ", port, " doomguys");
});
