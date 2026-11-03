import { createApp } from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBomb, faFlag, faSmile, faGrinHearts, faAngry,
  faDiceOne, faDiceTwo, faDiceThree, faDiceFour, faDiceFive, faDiceSix,
  faBars, faPlay, faCog, faChartBar, faQuestionCircle, faTrash,
  faBullseye, faMousePointer, faLightbulb, faTrophy}
  from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faBomb, faFlag, faSmile, faGrinHearts, faAngry,
  faDiceOne, faDiceTwo, faDiceThree, faDiceFour, faDiceFive, faDiceSix,
  faBars, faPlay, faCog, faChartBar, faQuestionCircle, faTrash,
  faBullseye, faMousePointer, faLightbulb, faTrophy);

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
