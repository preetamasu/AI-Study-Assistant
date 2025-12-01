<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import api from '../services/api'

const quizzes = ref([])
const loading = ref(true)
const error = ref(null)

const fetchQuizHistory = async () => {
  try {
    loading.value = true
    const response = await api.getQuizHistory()
    
    // Calculate percentage for each history entry
    quizzes.value = response.data.map(history => ({
      ...history,
      questions: history.quizId?.questions || [],
      noteId: history.quizId?.noteId || null,
      scorePercentage: history.quizId?.questions?.length 
        ? (history.score / history.quizId.questions.length) * 100 
        : 0
    }))
  } catch (err) {
    error.value = 'Failed to load quiz history'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const getScoreColor = (percentage) => {
  if (percentage >= 80) return '#4CAF50'
  if (percentage >= 60) return '#FF9800'
  return '#f44336'
}

const getScoreEmoji = (percentage) => {
  if (percentage >= 90) return '🏆'
  if (percentage >= 80) return '🎉'
  if (percentage >= 70) return '👍'
  if (percentage >= 60) return '📈'
  return '📚'
}

onMounted(() => {
  fetchQuizHistory()
})
</script>

<template>
  <div class="quiz-history">
    <div class="container">
      <h1>📊 Quiz History</h1>
      <p class="subtitle">Track your learning progress and quiz performance</p>
      
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading quiz history...</p>
      </div>
      
      <div v-else-if="error" class="error">{{ error }}</div>
      
      <div v-else-if="quizzes.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>No quiz history yet</h3>
        <p>Take your first quiz to see your results here!</p>
        <RouterLink to="/" class="btn-primary">Browse Notes</RouterLink>
      </div>
      
      <div v-else class="quiz-grid">
        <div v-for="quiz in quizzes" :key="quiz._id" class="quiz-card">
          <div class="quiz-header">
            <div class="note-info">
              <h3>{{ quiz.noteId?.title || 'Untitled Note' }}</h3>
              <p class="date">{{ new Date(quiz.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) }}</p>
            </div>
            <div class="score-badge" :style="{ backgroundColor: getScoreColor(quiz.scorePercentage) }">
              <span class="emoji">{{ getScoreEmoji(quiz.scorePercentage) }}</span>
              <span class="percentage">{{ Math.round(quiz.scorePercentage) }}%</span>
            </div>
          </div>
          
          <div class="quiz-stats">
            <div class="stat">
              <span class="stat-label">Questions</span>
              <span class="stat-value">{{ quiz.questions.length }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Score</span>
              <span class="stat-value">{{ quiz.score }}/{{ quiz.questions.length }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Accuracy</span>
              <span class="stat-value">{{ Math.round(quiz.scorePercentage) }}%</span>
            </div>
          </div>
          
          <div class="quiz-actions">
            <RouterLink :to="`/note/${quiz.noteId?._id}`" class="btn-secondary">
              View Note
            </RouterLink>
            <RouterLink :to="`/quiz/${quiz._id}`" class="btn-primary">
              Review Quiz
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-history {
  min-height: 100vh;
  background-color: #fafafa;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: #5a6c7d;
  font-size: 1.1rem;
  margin-bottom: 3rem;
}

.loading {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 1rem;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 2rem;
  background-color: #ffebee;
  color: #d32f2f;
  border-radius: 12px;
  border: 2px solid #ffcdd2;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #2c3e50;
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #5a6c7d;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.quiz-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.quiz-card {
  background: white;
  border-radius: 12px;
  padding: 1.75rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.quiz-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.note-info {
  flex: 1;
}

.note-info h3 {
  color: #2c3e50;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.date {
  color: #95a5a6;
  font-size: 0.85rem;
}

.score-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  color: white;
  min-width: 80px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.score-badge .emoji {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.score-badge .percentage {
  font-size: 1.25rem;
  font-weight: 700;
}

.quiz-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-label {
  font-size: 0.8rem;
  color: #5a6c7d;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.35rem;
  font-weight: 700;
  color: #2c3e50;
}

.quiz-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 0.75rem 1rem;
  text-align: center;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.btn-secondary {
  background: white;
  color: #4CAF50;
  border: 2px solid #4CAF50;
}

.btn-secondary:hover {
  background: #f0f7f0;
  transform: translateY(-2px);
}
</style>
