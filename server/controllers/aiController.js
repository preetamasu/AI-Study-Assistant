const Anthropic = require('@anthropic-ai/sdk');
const Note = require('../models/db.js');
const Quiz = require('../models/quiz.js');
function extractJSON(text) {
  
  const jsonMatch =
    text.match(/```json\s*([\s\S]*?)\s*```/) ||
    text.match(/```\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }
  return text.trim();
}
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});
console.log('API Key loaded:', process.env.ANTHROPIC_API_KEY ? 'YES' : 'NO');
const summarizeNote = async (req,res)=>{
    try{
        const {noteId} = req.body;
        const note = await Note.findById(noteId);
        if(!note){
            return res.status(404).json({message: "Note not found"});
        }
        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-5',
  max_tokens: 1000,
  messages: [
    {
      role: 'user',
      content: `Summarize the following study notes in 2-3 concise sentences:\n\n${note.content}`
    }
  ]
});
const summary = message.content[0].text;

        note.summary = summary;
       await note.save()
       res.json({message:"Summary generated",note});



    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}


const answerQuestion = async(req,res)=>{
    try{
        const {noteId, question} = req.body;
        const note = await Note.findById(noteId);
        if(!note){
            return res.status(404).json({message: "Note not found"});
        }
         const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-5',
           max_tokens: 1000,
messages: [
    {
      role: 'user',
      content: `Based on these study notes, answer the following question:\n\nNotes: ${note.content}\n\nQuestion: ${question}\n\nAnswer:`
    }
  ]
});

 const answer = message.content[0].text;
    
    
    res.json({ question, answer });  



    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

const generateQuiz = async (req,res)=>{
    try{
        const{noteId, numQuestions, quizType} = req.body;
        const note = await Note.findById(noteId);
        if(!note){
            return res.status(404).json({message:"Note not found"});
        }
          const message = await anthropic.messages.create({
            model: "claude-sonnet-4-5",
            max_tokens: 1000,
            messages: [
              {
                role: "user",
                content: `Generate ${numQuestions} ${quizType} quiz questions based on these study notes.

Notes: ${note.content}

Return ONLY valid JSON array (no extra text before or after) in this exact format:
[
  {
    "question": "question text here",
    "options": ["option A", "option B", "option C", "option D"],
    "correctAnswer": "the correct answer text",
    "type": "${quizType}"
  }
]

${quizType === 'mcq' ? 'For MCQ: Include 4 options and mark the correct one.' : 'For short answer: Leave options array empty.'}

Return ONLY the JSON array, nothing else.`,
              },
            ],
          });
        const answer = message.content[0].text;
const cleanedAnswer = extractJSON(answer);  
const questions = JSON.parse(cleanedAnswer);
        const quiz = await Quiz.create({
            noteId: noteId,
            questions: questions
        });
        res.status(201).json({
            message: "Quiz generated sucessfully",
            quiz: quiz
        });

    }
    catch(err){
        res.status(500).json({message: err.message});

    }
}
module.exports = {summarizeNote,answerQuestion,generateQuiz}