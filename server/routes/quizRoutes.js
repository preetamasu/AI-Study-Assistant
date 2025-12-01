const express = require('express');
const router = express.Router();
const {getQuizzesByNote,getQuizzesByQuizId} = require('../controllers/quizController');
router.get('/quizzes/:noteId', getQuizzesByNote);
router.get('/quiz/:quizId', getQuizzesByQuizId);
module.exports = router;