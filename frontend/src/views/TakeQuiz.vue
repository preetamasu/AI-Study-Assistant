<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const router = useRouter()
const quizId = route.params.id

const quiz = ref(null)
const loading = ref(true)
const error = ref(null)
const userAnswers = ref([])
const submitting = ref(false)
const result = ref(null)

const fetchQuiz = async () => {
  try {
    loading.value = true
    const response = await api.getQuizById(quizId)
    quiz.value = response.data
    // Initialize answers array
    userAnswers.value = new Array(quiz.value.questions.length).fill(null)
  } catch (err) {
    error.value = 'Failed to load quiz'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const selectAnswer = (questionIndex, answer) => {
  userAnswers.value[questionIndex] = answer
}

const submitQuiz = async () => {
  // Check if all questions are answered
  const unanswered = userAnswers.value.some(answer => answer === null)
  if (unanswered) {
    alert('Please answer all questions before submitting!')
    return
  }

  try {
    submitting.value = true
    // Format answers for backend
    const formattedAnswers = userAnswers.value.map((answer, index) => ({
      questionIndex: index,
      answer: answer
    }))

    const response = await api.submitQuiz({
      quizId,
      answers: formattedAnswers
    })
    
    result.value = response.data
  } catch (err) {
    alert('Failed to submit quiz')
    console.error(err)
  } finally {
    submitting.value = false
  }
}

const retakeQuiz = () => {
  result.value = null
  userAnswers.value = new Array(quiz.value.questions.length).fill(null)
}

onMounted(() => {
  fetchQuiz()
})
</script>

<template>
  <div class="take-quiz">
    <div v-if="loading" class="loading">Loading quiz...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <!-- Quiz Questions -->
    <div v-else-if="quiz && !result" class="quiz-content">
      <div class="quiz-header">
        <h1>📝 Take Quiz</h1>
        <p class="quiz-info">{{ quiz.questions.length }} Questions</p>
      </div>

      <div class="questions">
        <div 
          v-for="(question, index) in quiz.questions" 
          :key="index"
          class="question-card"
        >
          <h3 class="question-number">Question {{ index + 1 }}</h3>
          <p class="question-text">{{ question.question }}</p>

          <div class="options">
            <div 
              v-for="(option, optionIndex) in question.options"
              :key="optionIndex"
              class="option"
              :class="{ selected: userAnswers[index] === option }"
              @click="selectAnswer(index, option)"
            >
              <input 
                type="radio" 
                :name="`question-${index}`"
                :value="option"
                :checked="userAnswers[index] === option"
              />
              <label>{{ option }}</label>
            </div>
          </div>
        </div>
      </div>

      <div class="submit-section">
        <button 
          @click="submitQuiz" 
          :disabled="submitting"
          class="btn btn-primary btn-large"
        >
          {{ submitting ? 'Submitting...' : 'Submit Quiz' }}
        </button>
      </div>
    </div>

    <!-- Quiz Results -->
    <div v-else-if="result" class="result-content">
      <div class="result-header">
        <h1>🎉 Quiz Completed!</h1>
      </div>

      <div class="result-card">
        <div class="score-display">
          <div class="score-circle">
            <span class="score-number">{{ result.score }}</span>
            <span class="score-total">/ {{ result.totalQuestions }}</span>
          </div>
          <p class="percentage">{{ ((result.score / result.totalQuestions) * 100).toFixed(0) }}%</p>
        </div>

        <div class="result-message">
          <p v-if="result.score === result.totalQuestions">
            🌟 Perfect! You got all questions correct!
          </p>
          <p v-else-if="result.score >= result.totalQuestions * 0.7">
            👏 Great job! You passed the quiz!
          </p>
          <p v-else>
            💪 Keep studying! You can do better!
          </p>
        </div>

        <div class="result-actions">
          <button @click="retakeQuiz" class="btn btn-secondary">
            🔄 Retake Quiz
          </button>
          <RouterLink to="/" class="btn btn-primary">
            🏠 Back to Home
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.take-quiz {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  font-size: 1.1rem;
}

.error {
  color: #e74c3c;
}

.quiz-header {
  text-align: center;
  margin-bottom: 3rem;
}

.quiz-header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.quiz-info {
  color: #666;
  font-size: 1.1rem;
}

.questions {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.question-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.question-number {
  color: #42b983;
  font-size: 1rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.question-text {
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.option:hover {
  border-color: #42b983;
  background-color: #f8f9fa;
}

.option.selected {
  border-color: #42b983;
  background-color: #e8f5e9;
}

.option input[type="radio"] {
  margin-right: 1rem;
  cursor: pointer;
}

.option label {
  flex: 1;
  cursor: pointer;
  color: #2c3e50;
  font-size: 1rem;
}

.submit-section {
  margin-top: 3rem;
  text-align: center;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s;
  display: inline-block;
}

.btn-large {
  padding: 1rem 3rem;
  font-size: 1.1rem;
}

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #38a373;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #666;
  border: 2px solid #ddd;
}

.btn-secondary:hover {
  background-color: #e8e8e8;
  border-color: #ccc;
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Results Styles */
.result-content {
  text-align: center;
}

.result-header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

.result-card {
  background: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.1);
}

.score-display {
  margin-bottom: 2rem;
}

.score-circle {
  display: inline-block;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, #42b983, #38a373);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 1rem;
  box-shadow: 0 4px 20px rgba(66, 185, 131, 0.3);
}

.score-number {
  font-size: 4rem;
  font-weight: bold;
  line-height: 1;
}

.score-total {
  font-size: 2rem;
  opacity: 0.9;
}

.percentage {
  font-size: 2rem;
  color: #42b983;
  font-weight: bold;
}

.result-message {
  font-size: 1.3rem;
  color: #2c3e50;
  margin: 2rem 0;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 5px;
}

.result-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}
</style>
