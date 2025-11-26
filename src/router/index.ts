import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/views/HomePage.vue'
import LoginPage from '@/views/LoginPage.vue'
import NutrientsMain from '@/views/NutrientsMain.vue'
import TrainingRoutine from '@/views/TrainingRoutine.vue'
import DailyMeals from '@/views/DailyMeals.vue'
import PhysiqueProgress from '@/views/PhysiqueProgress.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/nutrients', component: NutrientsMain },
  { path: '/training-routine', component: TrainingRoutine },
  { path: '/daily-meals', component: DailyMeals },
  { path: '/physique-progress', component: PhysiqueProgress },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
