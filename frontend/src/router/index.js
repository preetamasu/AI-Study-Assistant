import {createRouter, createWebHistory} from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [ 
        {
            path: '/',
            name: 'Home',
            component: ()=> import('../views/Home.vue')
        },
        {
            path: '/create',
            name: 'CreateNote',
            component: () => import('../views/CreateNote.vue')
        },
        {
            path: '/note/:id',
            name: 'NoteById',
            component: () => import('../views/NoteDetail.vue')
        },
        {
            path: '/quiz-history',
            name: 'QuizHistory', 
            component: () => import('../views/QuizHistory.vue')
        },
        {
            path: '/quiz/:id',
            name: 'TakeQuiz',
            component: () => import('../views/TakeQuiz.vue')
        },
        {
            path: '/login',
            name: 'Login',
            component: () => import('../views/Login.vue'),
            meta: { requiresAuth: false }
        },
        {
            path: '/register',
            name: 'Register',
            component: () => import('../views/Register.vue'),
            meta: { requiresAuth: false }
        }
    ]
})

// Navigation guard to protect routes
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const publicPages = ['/login', '/register'];
    const isPublicPage = publicPages.includes(to.path);
    
    // If on public page and user is already logged in, redirect to home
    if (isPublicPage && token) {
        next('/');
    }
    // If not on public page and no token, redirect to login
    else if (!isPublicPage && !token) {
        next('/login');
    }
    // Otherwise, allow navigation
    else {
        next();
    }
});

export default router;