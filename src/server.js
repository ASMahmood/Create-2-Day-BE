const express = require("express");
const cors = require("cors");
const examsRouter = require("./exams");
const questionRouter = require("./questions");

const server = express();
const port = process.env.PORT || 3001;

server.use(cors());
server.use(express.json());

server.use("/exams", examsRouter);
server.use("/question", questionRouter);

server.listen(port, () => {
  console.log("Doomguy is currently slaying ", port, " thots");
});
