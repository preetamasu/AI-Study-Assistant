const Quiz = require('../models/quiz.js');
const getQuizzesByNote = async (req,res)=>{
    try{
    const {noteId} = req.params;
        const quizzes = await Quiz.find({ noteId: noteId });

    if(!quizzes){
        return res.status(404).json({message: "Quiz not found"});
    }
    res.json(quizzes);
}
catch(err){
    res.status(500).json({message: err.message});
}
   
}

const getQuizzesByQuizId = async (req,res) =>{
    try{
    const {quizId} = req.params;
    const quizzes = await Quiz.findById(quizId);
    if(!quizzes){
        return res.status(404).json({message: "Quiz is not found"});
    }
    res.json(quizzes);
}
catch(err){
    res.status(500).json({message: err.message});
}
}
module.exports = {getQuizzesByNote,getQuizzesByQuizId};
