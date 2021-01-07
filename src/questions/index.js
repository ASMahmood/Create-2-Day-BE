const express = require("express");
const uniqid = require("uniqid");
const { readQuestions, writeQuestions } = require("../lib/utilities");

const Router = express.Router();

Router.post("/giveIDs", async (req, res) => {
  try {
    const questionDB = await readQuestions();
    questionDB.forEach((question) => (question._id = uniqid()));
    await writeQuestions(questionDB);
  } catch (error) {
    console.log(error);
  }
});

Router.delete("/:questionID", async (req, res) => {
  try {
    //GETTING DATABASE OF QUESTIONS
    const questionDB = await readQuestions();
    //CREATE NEW DB WITHOUT SPECIFIED QUESTIONS
    const newDB = questionDB.filter(
      (question) => question._id !== req.params.questionID
    );
    //OVERWRITE OLD DB WITH NEW DB
    await writeQuestions(newDB);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

module.exports = Router;
