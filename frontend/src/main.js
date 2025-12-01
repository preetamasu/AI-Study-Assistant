import { createApp } from 'vue'  // Import Vue
import App from './App.vue'      // Import root component
import router from './router'    // Import router config

createApp(App)     // Create Vue app instance
  .use(router)     // Add router functionality
  .mount('#app')   // Mount to <div id="app"> in index.html