<script setup>
import {ref,onMounted} from 'vue';
import { RouterLink } from 'vue-router';
import api from '../services/api';


const notes = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchNotes = async ()=>{
  try{
   loading.value = true;
   const response = await api.getAllNotes();
   notes.value = response.data;
  }
  catch(err){
    error.value = 'Failed to load the api';
    console.log(err);
  }
  finally{
    loading.value = false
  }
}

const deleteNote = async (id)=>{
  if(!confirm('Are you sure you want to delete this note?')) return 
  
  try{
   await api.deleteNote(id);
   notes.value = notes.value.filter(note => note._id !== id);

  }
  catch(err){
    error.value = 'Failed to delete note';
    alert('Failed to delete the note');
    console.error(err);
  }
}

onMounted(() => {
  fetchNotes()
})
</script>

<template>
  <div class="home">
    <h1>📚 My Study Notes</h1>
    
    <div v-if="loading" class="loading">Loading notes...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else-if="notes.length === 0" class="empty-state">
      <p>No notes yet. Create your first note to get started!</p>
      <RouterLink to="/create" class="btn-create">Create Note</RouterLink>
    </div>
    
    <div v-else class="notes-grid">
      <div v-for="note in notes" :key="note._id" class="note-card">
        <RouterLink :to="`/note/${note._id}`" class="note-link">
          <h3>{{ note.title }}</h3>
          <p>{{ note.content.substring(0, 100) }}...</p>
          <span class="date">{{ new Date(note.createdAt).toLocaleDateString() }}</span>
        </RouterLink>
        <button @click="deleteNote(note._id)" class="delete-btn">🗑️ Delete</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fafafa;
  min-height: 100vh;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.error {
  color: #d32f2f;
  background-color: #ffebee;
  border: 2px solid #ffcdd2;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.empty-state p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.btn-create {
  display: inline-block;
  margin-top: 1rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.05rem;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.note-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.75rem;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.note-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.note-card:hover::before {
  transform: scaleX(1);
}

.note-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  border-color: #4CAF50;
}

.note-link {
  text-decoration: none;
  color: inherit;
  display: block;
  margin-bottom: 1rem;
}

.note-card h3 {
  color: #2c3e50;
  margin-bottom: 0.75rem;
  font-size: 1.35rem;
  font-weight: 600;
  line-height: 1.3;
}

.note-card p {
  color: #5a6c7d;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.date {
  font-size: 0.85rem;
  color: #95a5a6;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.date::before {
  content: '📅';
}

.delete-btn {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(244, 67, 54, 0.3);
}

.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
  background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%);
}
</style>
