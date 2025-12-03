require('dotenv').config({ path: '../.env' });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const noteRoutes = require('./routes/noteRoutes');
const aiRoutes = require('./routes/aiRoutes');
const quizRoutes = require('./routes/quizRoutes');
const quizHistoryRoutes = require('./routes/quizHistoryRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();

// Enable CORS for frontend
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }))

app.use('/api',noteRoutes);
app.use('/api',aiRoutes)
app.use('/api',quizHistoryRoutes);
app.use('/api',quizRoutes)
app.use('/api',authRoutes)
mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("Connected to db");
    app.listen(process.env.PORT || 3000,(req,res)=>{
        console.log(`Listening at ${process.env.PORT}`);
    })
})
.catch((err)=> console.log(err));