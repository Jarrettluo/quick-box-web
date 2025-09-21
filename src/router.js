import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import ResultView from './views/ResultView.vue'

const routes = [
    { path: '/', component: HomeView },
    { path: '/result/:code', component: ResultView, props: true }
]

export default createRouter({
    history: createWebHistory(),
    routes
})