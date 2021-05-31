import { createApp } from 'vue';
import App from './App.vue';

// Importando Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";

// Importando Vue-Fontawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBackspace, faPercentage, faDivide, faTimes, faMinus, faPlus, faEquals } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome';

library.add(faBackspace, faPercentage, faDivide, faTimes, faMinus, faPlus, faEquals);

createApp(App).component('font-awesome-icon', FontAwesomeIcon)
              .component('font-awesome-layers', FontAwesomeLayers)
              .component('font-awesome-layers-text', FontAwesomeLayersText)
              .mount('#app');
