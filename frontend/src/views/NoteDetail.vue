<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const router = useRouter()
const noteId = route.params.id

const note = ref(null)
const loading = ref(true)
const error = ref(null)

// AI Features
const summarizing = ref(false)
const question = ref('')
const answer = ref('')
const askingQuestion = ref(false)
const generatingQuiz = ref(false)
const numQuestions = ref(5)

const fetchNote = async () => {
  try {
    loading.value = true
    const response = await api.getNoteById(noteId)
    note.value = response.data
  } catch (err) {
    error.value = 'Failed to load note'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const summarizeNote = async () => {
  try {
    summarizing.value = true
    const response = await api.summarizeNote({ noteId })
    note.value.summary = response.data.summary
  } catch (err) {
    alert('Failed to generate summary')
    console.error(err)
  } finally {
    summarizing.value = false
  }
}

const askQuestion = async () => {
  if (!question.value.trim()) return
  
  try {
    askingQuestion.value = true
    answer.value = ''
    const response = await api.answerQuestion({
      noteId,
      question: question.value
    })
    answer.value = response.data.answer
  } catch (err) {
    alert('Failed to get answer')
    console.error(err)
  } finally {
    askingQuestion.value = false
  }
}

const generateQuiz = async () => {
  try {
    generatingQuiz.value = true
    const response = await api.generateQuiz({
      noteId,
      numQuestions: numQuestions.value,
      quizType: 'mcq'
    })
    router.push(`/quiz/${response.data.quiz._id}`)
  } catch (err) {
    alert('Failed to generate quiz')
    console.error(err)
  } finally {
    generatingQuiz.value = false
  }
}

onMounted(() => {
  fetchNote()
})
</script>

<template>
  <div class="note-detail">
    <div v-if="loading" class="loading">Loading note...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else-if="note" class="content">
      <h1>{{ note.title }}</h1>
      <p class="date">Created: {{ new Date(note.createdAt).toLocaleString() }}</p>
      
      <div class="note-content">
        <h2>📝 Content</h2>
        <p>{{ note.content }}</p>
      </div>
      
      <!-- AI Summary -->
      <div class="ai-section">
        <div class="section-header">
          <h2>🤖 AI Summary</h2>
          <button @click="summarizeNote" :disabled="summarizing">
            {{ summarizing ? 'Generating...' : 'Generate Summary' }}
          </button>
        </div>
        <div v-if="note.summary" class="summary-box">
          {{ note.summary }}
        </div>
        <div v-else class="placeholder">
          Click "Generate Summary" to get an AI-powered summary
        </div>
      </div>
      
      <!-- Ask Question -->
      <div class="ai-section">
        <h2>💬 Ask a Question</h2>
        <textarea 
          v-model="question" 
          placeholder="Ask anything about this note..."
          rows="3"
        ></textarea>
        <button @click="askQuestion" :disabled="askingQuestion || !question.trim()">
          {{ askingQuestion ? 'Asking...' : 'Get Answer' }}
        </button>
        
        <div v-if="answer" class="answer-box">
          <strong>Answer:</strong> {{ answer }}
        </div>
      </div>
      
      <!-- Generate Quiz -->
      <div class="ai-section">
        <h2>📋 Generate Quiz</h2>
        <div class="quiz-form">
          <label>Number of questions:</label>
          <input v-model.number="numQuestions" type="number" min="3" max="10" />
          <button @click="generateQuiz" :disabled="generatingQuiz">
            {{ generatingQuiz ? 'Generating...' : 'Generate Quiz' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.note-detail {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background-color: #fafafa;
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.error {
  color: #d32f2f;
  background-color: #ffebee;
  border: 2px solid #ffcdd2;
}

h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
  font-weight: 700;
}

.date {
  color: #95a5a6;
  font-size: 0.95rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.date::before {
  content: '📅';
}

.note-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  margin-bottom: 1.75rem;
  border: 1px solid #e0e0e0;
}

.note-content h2 {
  color: #2c3e50;
  margin-bottom: 1.25rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.note-content p {
  color: #5a6c7d;
  line-height: 1.7;
  white-space: pre-wrap;
  font-size: 1.05rem;
}

.ai-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  margin-bottom: 1.75rem;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.ai-section:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

.ai-section h2 {
  color: #2c3e50;
  margin-bottom: 1.25rem;
  font-size: 1.4rem;
  font-weight: 600;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-header h2 {
  margin: 0;
}

button {
  padding: 0.875rem 1.75rem;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  font-size: 1rem;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

button:disabled {
  background: #bdbdbd;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.summary-box, .answer-box {
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #4CAF50;
  margin-top: 1.25rem;
  line-height: 1.7;
  color: #2c3e50;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.answer-box strong {
  color: #4CAF50;
  font-weight: 600;
}

.placeholder {
  color: #95a5a6;
  font-style: italic;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  text-align: center;
  border: 2px dashed #e0e0e0;
}

textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  margin-bottom: 1.25rem;
  transition: all 0.3s ease;
  font-size: 1rem;
  line-height: 1.6;
  background-color: #fafafa;
}

textarea:focus {
  outline: none;
  border-color: #4CAF50;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.quiz-form {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.quiz-form label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.05rem;
}

.quiz-form input {
  width: 100px;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.quiz-form input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.quiz-form button {
  flex: 1;
  min-width: 200px;
}
</style>
