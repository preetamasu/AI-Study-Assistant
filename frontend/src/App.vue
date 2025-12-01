<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <header>
      <nav>
        <div class="nav-brand">
          <span class="logo">🎓</span>
          <span class="brand-name">AI Study Assistant</span>
        </div>
        <div class="nav-links">
          <RouterLink to="/" class="nav-link">
            <span class="icon">📚</span>
            <span>Notes</span>
          </RouterLink>
          <RouterLink to="/create" class="nav-link">
            <span class="icon">✍️</span>
            <span>Create</span>
          </RouterLink>
          <RouterLink to="/quiz-history" class="nav-link">
            <span class="icon">📊</span>
            <span>Quiz History</span>
          </RouterLink>
        </div>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #fafafa;
}

header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

nav {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 1.35rem;
  color: #2c3e50;
}

.logo {
  font-size: 1.75rem;
}

.brand-name {
  display: none;
}

@media (min-width: 640px) {
  .brand-name {
    display: inline;
  }
}

.nav-links {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  color: #5a6c7d;
  text-decoration: none;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.nav-link .icon {
  font-size: 1.1rem;
}

.nav-link:hover {
  background-color: #f0f7f0;
  color: #4CAF50;
  transform: translateY(-1px);
}

.nav-link.router-link-active {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.nav-link.router-link-active:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

main {
  padding: 0;
}
</style>
