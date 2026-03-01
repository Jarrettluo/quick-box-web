import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import ResultView from './views/ResultView.vue'
import HistoryView from "@/views/HistoryView.vue";
import NewHomeView from "@/views/NewHomeView.vue";

const routes = [
    { path: '/', component: HomeView },
    { path: '/result/:code', component: ResultView, props: true },
    { path: '/history', component: HistoryView, props: true }
]

export default createRouter({
    history: createWebHistory(),
    routes
})