const { readJson, writeJson } = require("fs-extra");
const { join } = require("path");

const examPath = join(__dirname, "../exams/exams.json");
const questionsPath = join(__dirname, "../questions/questions.json");

const readDB = async (filepath) => {
  try {
    const fileJson = await readJson(filepath);
    return fileJson;
  } catch (error) {
    console.log(error);
  }
};

const writeDB = async (filepath, data) => {
  try {
    await writeJson(filepath, data);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  readExam: async () => readDB(examPath),
  writeExam: async (data) => writeDB(examPath, data),
  readQuestions: async () => readDB(questionsPath),
};
