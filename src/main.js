import Vue from 'vue'
import App from './App'
import router from './router'
import VueFire from 'vuefire'

// Global Components
import spinner from './components/Spinner'
Vue.component('spinner', spinner)

Vue.use(VueFire)
Vue.config.productionTip = false

import '@/firebase'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
