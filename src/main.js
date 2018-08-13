import Vue from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBomb, faFlag, faDiceOne, faDiceTwo, faDiceThree, faDiceFour, faDiceFive, faDiceSix }
  from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faBomb, faFlag, faDiceOne, faDiceTwo, faDiceThree, faDiceFour, faDiceFive, faDiceSix);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app');
