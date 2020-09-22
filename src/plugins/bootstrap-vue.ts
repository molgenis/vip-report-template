import Vue from 'vue';
import {
  AlertPlugin,
  ButtonPlugin,
  CollapsePlugin,
  FormGroupPlugin,
  FormInputPlugin,
  LayoutPlugin,
  ModalPlugin,
  NavbarPlugin,
  NavPlugin,
  PaginationPlugin,
  TablePlugin,
  VBTooltipPlugin,
  BIcon,
  BIconBoxArrowInUpRight,
  BIconChevronDown,
  BIconChevronUp,
  BIconQuestionCircle,
  BIconSearch
} from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(AlertPlugin);
Vue.use(ButtonPlugin);
Vue.use(CollapsePlugin);
Vue.use(FormGroupPlugin);
Vue.use(FormInputPlugin);
Vue.use(LayoutPlugin);
Vue.use(ModalPlugin);
Vue.use(NavbarPlugin);
Vue.use(NavPlugin);
Vue.use(PaginationPlugin);
Vue.use(TablePlugin);
Vue.use(VBTooltipPlugin);
Vue.component('BIcon', BIcon);
Vue.component('BIconBoxArrowInUpRight', BIconBoxArrowInUpRight);
Vue.component('BIconChevronDown', BIconChevronDown);
Vue.component('BIconChevronUp', BIconChevronUp);
Vue.component('BIconQuestionCircle', BIconQuestionCircle);
Vue.component('BIconSearch', BIconSearch);
