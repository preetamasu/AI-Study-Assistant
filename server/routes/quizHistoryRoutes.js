const express = require('express');
const router = express.Router();
const {submitQuiz,getQuizHistory} = require('../controllers/quizHistoryController');

router.post('/quiz/submit', submitQuiz);
router.get('/quiz/history', getQuizHistory);

module.exports = router;