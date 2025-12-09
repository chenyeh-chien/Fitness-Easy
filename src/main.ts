import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './global.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faDumbbell, faScaleBalanced, faUtensils, faWeightScale, faCubes,
  faArrowRightToBracket, faPlus, faAngleDown, faChevronLeft, faChevronRight,
  faCheck, faMinus, faAnglesUp, faAnglesDown, faBars
} from '@fortawesome/free-solid-svg-icons'
import {
  faBell, faSun, faMoon
} from '@fortawesome/free-regular-svg-icons'
import {
  faGoogle
} from '@fortawesome/free-brands-svg-icons'

library.add(
  faDumbbell, faScaleBalanced, faUtensils, faWeightScale, faCubes,
  faBell, faSun, faMoon, faArrowRightToBracket, faGoogle, faPlus,
  faAngleDown, faChevronLeft, faChevronRight, faCheck, faMinus,
  faAnglesUp, faAnglesDown, faBars
)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
