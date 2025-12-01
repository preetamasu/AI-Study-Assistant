const mongoose = require('mongoose');
const quizSchema = new mongoose.Schema({
    noteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note',
        required: 'true'
    },
    questions: [{
        question: String,
        options: [String],
        correctAnswer: String,
        type: {
            type: String,
            enum: ['mcq','short'],
            default: 'mcq'
        }

    }]
},{timestamps: true});

module.exports = mongoose.model('Quiz',quizSchema);