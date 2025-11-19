import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './global.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faDumbbell, faScaleBalanced, faUtensils, faWeightScale, faCubes,
  faP, faC, faF
} from '@fortawesome/free-solid-svg-icons'
import { 
  faBell, faSun, faMoon
} from '@fortawesome/free-regular-svg-icons'

library.add(
  faDumbbell, faScaleBalanced, faUtensils, faWeightScale, faCubes,
  faBell, faSun, faMoon, faP, faC, faF
)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
