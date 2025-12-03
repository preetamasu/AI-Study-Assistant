<script setup>
import {ref} from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';
const router = useRouter();  // at top of script
const email = ref('');
const password = ref('');
const error = ref('');

const handleLogin = async () => {
    try {
        error.value = '';
        const response = await api.login(email.value, password.value);
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        
        router.push('/');
    } catch (err) {
        error.value = err.response?.data?.message || 'Login failed. Please try again.';
    }
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1>🔐 Login</h1>
      <p class="subtitle">Welcome back! Please login to continue.</p>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            placeholder="Enter your email"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            placeholder="Enter your password"
          />
        </div>
        
        <div v-if="error" class="error">{{ error }}</div>
        
        <button type="submit" class="btn-login">Login</button>
      </form>
      
      <p class="register-link">
        Don't have an account? 
        <RouterLink to="/register">Register here</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-card h1 {
  text-align: center;
  margin-bottom: 10px;
  color: #2c3e50;
}

.subtitle {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
}

.error {
  color: #e74c3c;
  background: #fadbd8;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 15px;
  text-align: center;
}

.btn-login {
  width: 100%;
  padding: 14px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-login:hover {
  background: #2980b9;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  color: #7f8c8d;
}

.register-link a {
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
