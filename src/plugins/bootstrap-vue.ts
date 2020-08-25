import Vue from 'vue';
import {
  BootstrapVue,
  BIcon,
  BIconBoxArrowInUpRight,
  BIconChevronDown,
  BIconChevronUp,
  BIconQuestionCircle,
  BIconSearch,
  BIconDiagram3
} from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);
Vue.component('BIcon', BIcon);
Vue.component('BIconBoxArrowInUpRight', BIconBoxArrowInUpRight);
Vue.component('BIconChevronDown', BIconChevronDown);
Vue.component('BIconChevronUp', BIconChevronUp);
Vue.component('BIconQuestionCircle', BIconQuestionCircle);
Vue.component('BIconSearch', BIconSearch);
Vue.component('BIconDiagram3', BIconDiagram3);
