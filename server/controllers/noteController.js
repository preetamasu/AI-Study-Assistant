const Note = require('../models/db.js');
const createNote = async (req,res)=>{
    try{
    const {title, content} = req.body;
    const newNote = await Note.create({title, content});
    res.json(newNote);
    }
    catch(err){
        res.status(500).json({message: err.message});
        console.log(err);
    }
}

const getAllNotes = async (req,res)=>{
    try{
        const notes = await Note.find();
        res.json(notes);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

const getNoteById = async (req,res)=>{
    try{
        const id =  req.params.id;
        const noteId = await Note.findById(id)
        if(!noteId){
            return res.status(404).json({message: err.message})
        }
        res.json({title:noteId.title,content: noteId.content, summary: noteId.summary, createdAt: noteId.createdAt, _id: noteId._id});
        

    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}

const deleteNote = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedNote = await Note.findByIdAndDelete(id);
        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.json({ message: "Note deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    createNote,
    getAllNotes,
    getNoteById,
    deleteNote
};