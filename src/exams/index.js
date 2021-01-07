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
    //CREATE VARIABLE FOR EXAM DURATION
    let examDuration = 0;
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

        examDuration += questionsDB[index].duration;
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
      totalDuration: examDuration,
      questions: actualQuestions,
    });
    //OVERWRITE OLD DB WITH NEW DB
    await writeExam(examsDB);
    res.send("Added! Pog!");
  } catch (error) {
    console.log(error);
  }
});

Router.post("/:examID/answer", async (req, res) => {
  try {
    //GET EXAM DATABASE
    const examsDB = await readExam();
    //GETTING OUR EXAM FROM THE REQ.PARAMS
    const selectedExamIndex = examsDB.findIndex(
      (exam) => exam._id === req.params.examID
    );
    //IF/ELSE
    if (selectedExamIndex !== -1) {
      examsDB[selectedExamIndex].questions[req.body.question].providedAnswer =
        req.body.answer;
      await writeExam(examsDB);
      res.send("🎉 Answer recieved! 🎉");
    } else {
      res.send("Couldn't find this exam 🥺");
    }
  } catch (error) {
    console.log(error);
  }
});

Router.get("/:examID", async (req, res) => {
  try {
    //GETTING SELECTED EXAM
    const examsDB = await readExam();
    const selectedExam = examsDB.find((exam) => exam._id === req.params.examID);
    //CALCULATE CURRENT SCORE
    let score = 0;
    selectedExam.questions.forEach((question) => {
      if (question.answers[question.providedAnswer].isCorrect === true) {
        score += 1;
      }
    });
    selectedExam.score = score;
    res.send(selectedExam);
  } catch (error) {
    console.log(error);
  }
});

module.exports = Router;
