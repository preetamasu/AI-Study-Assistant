const QuizHistory = require('../models/quizhistory.js');
const Quiz = require('../models/quiz.js');

const submitQuiz = async (req,res) =>{
    try{
        const {quizId,answers} = req.body;
        const quiz = await Quiz.findById(quizId);
        if(!quiz){
            return res.status(404).json({message:"Quiz not found"});
        }
        let score = 0;
        for(let i = 0; i < answers.length; i++){
            const questionIndex = answers[i].questionIndex;
            const userAnswer = answers[i].answer;
            const correctAnswer = quiz.questions[questionIndex].correctAnswer;
            if(userAnswer === correctAnswer){
                score = score + 1;
            }
        }    
        const quizHistory = await QuizHistory.create({
            quizId,
            answers,
            score
        });
        res.json({
            message: "Quiz Submitted", 
            score,
            totalQuestions: quiz.questions.length,
            quizHistory
        });
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

const getQuizHistory = async (req, res) => {
    try {
        const history = await QuizHistory.find()
            .populate({
                path: 'quizId',
                populate: { path: 'noteId' }
            })
            .sort({ createdAt: -1 });
        
        res.json(history);
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { submitQuiz, getQuizHistory };