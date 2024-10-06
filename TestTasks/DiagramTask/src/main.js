import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Tooltip from "@programic/vue3-tooltip";
// Import the CSS or use your own!
import '@programic/vue3-tooltip/dist/index.css';


const app = createApp(App)

app.use(Tooltip, {})
app.use(createPinia())
app.use(router)

app.mount('#app')
