const express = require('express');
const router = express.Router();
const {summarizeNote} = require('../controllers/aiController');
const {answerQuestion} = require('../controllers/aiController');
const {generateQuiz} = require('../controllers/aiController');
router.post('/ai/summarize', summarizeNote);
router.post('/ai/question',answerQuestion);
router.post('/ai/generate-quiz',generateQuiz);

module.exports = router;