import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
export default{

    // authentication

    register(name,email,password){
        return axios.post(`${API_BASE_URL}/register`,{name,email,password});
    },
    login(email,password){
        return axios.post(`${API_BASE_URL}/login`,{email,password});

    },
    createNote(data){
        return axios.post(`${API_BASE_URL}/notes`,data);
    },
    getAllNotes(){
        return axios.get(`${API_BASE_URL}/notes`);
    },
    getNoteById(id){
        return axios.get(`${API_BASE_URL}/notes/${id}`);
    },
    deleteNote(id){
        return axios.delete(`${API_BASE_URL}/notes/${id}`);
    },

    // AI Section - Summarize
    summarizeNote(data){
        return axios.post(`${API_BASE_URL}/ai/summarize`,data);
    },
    //AI Section - Answering questions
    answerQuestion(data){
        return axios.post(`${API_BASE_URL}/ai/question`,data);
    },
    // AI Section - To generate the quiz
    generateQuiz(data){
        return axios.post(`${API_BASE_URL}/ai/generate-quiz`,data);
    },
    
    // ----QUIZ SECTION----
    getQuizzesByNote(noteId){
        return axios.get(`${API_BASE_URL}/quizzes/${noteId}`);
    },

    // Get quiz by Id
    getQuizById(quizId){
        return axios.get(`${API_BASE_URL}/quiz/${quizId}`);
    },
    submitQuiz(data){
        return axios.post(`${API_BASE_URL}/quiz/submit`,data);
    },
    getQuizHistory(){
        return axios.get(`${API_BASE_URL}/quiz/history`);
    }
    

}
