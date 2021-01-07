const express = require("express");
const uniqid = require("uniqid");
const { readExam, writeExam, readQuestions } = require("../lib/utilities");

const Router = express.Router();

Router.post("/start", async (req, res) => {
  try {
    //GET EXAM AND QUESTION DB
    const examsDB = await readExam();
    const questionsDB = await readQuestions();
    //CREATE VARIABLE FOR EXAM QUESTIONS
    const actualQuestions = [];
    //GET RANDOM QUESTION INDEXES
    try {
      const selectedQuestions = [];
      for (let i = 0; i < 5; i++) {
        let questionIndex = Math.floor(Math.random() * questionsDB.length);
        if (selectedQuestions.includes(questionIndex)) {
          i--;
        } else {
          selectedQuestions.push(questionIndex);
        }
      }
      //GET QUESTIONS FROM RANDOM INDEXES ABOVE
      selectedQuestions.forEach((index) => {
        actualQuestions.push(questionsDB[index]);
      });
    } catch (error) {
      console.log(error);
    }
    //PUSH EXAM OBJECT TO DATABASE
    examsDB.push({
      ...req.body,
      _id: uniqid(),
      examDate: new Date(),
      isCompleted: false,
      totalDuration: 30,
      questions: actualQuestions,
    });
    //OVERWRITE OLD DB WITH NEW DB
    await writeExam(examsDB);
    res.send("Added! Pog!");
  } catch (error) {
    console.log(error);
  }
});

module.exports = Router;
