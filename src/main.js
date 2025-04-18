import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import { createStore } from '.store'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)
app.use(router)
// app.use(createStore())
app.mount('#app')
