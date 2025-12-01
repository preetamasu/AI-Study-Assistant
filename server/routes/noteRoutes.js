const express = require('express');
const router = express.Router();
const {createNote, getAllNotes, getNoteById, deleteNote} = require('../controllers/noteController');

router.post('/notes',createNote);
router.get('/notes',getAllNotes);
router.get('/notes/:id',getNoteById);
router.delete('/notes/:id', deleteNote);
module.exports = router;