const mongoose = require('mongoose');

const quizHistorySchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    answers: [{
        questionIndex: Number,
        answer: String
    }],
    score: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('QuizHistory', quizHistorySchema);
