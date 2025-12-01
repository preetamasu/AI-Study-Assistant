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
        }
    ]
})

export default router;