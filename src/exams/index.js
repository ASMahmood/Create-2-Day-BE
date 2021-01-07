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
    //CREATE OBJECT TO ADD TO DATABASE
    const examObject = {
      ...req.body,
      _id: uniqid(),
      examDate: new Date(),
      isCompleted: false,
      totalDuration: examDuration,
      score: 0,
      questions: actualQuestions,
    };
    //PUSH EXAM OBJECT TO DATABASE
    examsDB.push(examObject);
    //OVERWRITE OLD DB WITH NEW DB
    await writeExam(examsDB);
    //CREATE QUESTIONS ARRAY WITHOUT IS_CORRECT
    const examResponse = { ...examObject };
    examResponse.questions.forEach((question) => {
      question.answers.forEach((answer) => delete answer.isCorrect);
    });
    //SEND RESPONSE
    res.status(201).send(examResponse);
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
      if (
        examsDB[selectedExamIndex].questions[req.body.question].providedAnswer
      ) {
        res.send("🎉 Already answered 🎉");
      } else {
        examsDB[selectedExamIndex].questions[req.body.question].providedAnswer =
          req.body.answer;
        //CALCULATE CURRENT SCORE
        if (
          examsDB[selectedExamIndex].questions[req.body.question].answers[
            req.body.answer
          ].isCorrect === true
        ) {
          examsDB[selectedExamIndex].score += 1;
        }
        //OVERWRITE DATABASE
        await writeExam(examsDB);
        res.send("🎉 Answer recieved! 🎉");
      }
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
    selectedExam.isCompleted = true;
    res.send(selectedExam);
  } catch (error) {
    console.log(error);
  }
});

module.exports = Router;
