<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const title = ref('')
const content = ref('')
const submitting = ref(false)
const error = ref(null)

const createNote = async () =>{
  submitting.value = true;
  if(!title.value.trim() || !content.value.trim()) {
    error.value = 'Nothing entered'
    submitting.value = false;
    return;
  }
  try{
    const note = await api.createNote({title: title.value,content: content.value});
    router.push('/');

  }
  catch(err){
    error.value = 'Failed to create the note';
    console.log(err);
    
  }
  finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="create-note">
    <h1>✍️ Create New Note</h1>
    
    <div v-if="error" class="error">{{ error }}</div>
    
    <form @submit.prevent="createNote">
      <div class="form-group">
        <label>Title</label>
        <input 
          v-model="title" 
          type="text" 
          placeholder="Enter note title"
          :disabled="submitting"
        />
      </div>
      
      <div class="form-group">
        <label>Content</label>
        <textarea 
          v-model="content" 
          rows="10"
          placeholder="Enter your notes here..."
          :disabled="submitting"
        ></textarea>
      </div>
      
      <button type="submit" :disabled="submitting">
        {{ submitting ? 'Creating...' : 'Create Note' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.create-note {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background-color: #fafafa;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2.25rem;
  font-weight: 700;
  text-align: center;
}

.error {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  color: #c62828;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #d32f2f;
  font-weight: 500;
}

form {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border: 1px solid #e0e0e0;
}

.form-group {
  margin-bottom: 1.75rem;
}

label {
  display: block;
  margin-bottom: 0.6rem;
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.05rem;
}

input, textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
  background-color: #fafafa;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #4CAF50;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

input:disabled, textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

textarea {
  resize: vertical;
  min-height: 200px;
  line-height: 1.6;
}

button {
  width: 100%;
  padding: 1.15rem;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
}

button:disabled {
  background: #bdbdbd;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>
