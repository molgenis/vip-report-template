import Vue from 'vue'
import Vuex from 'vuex'
import state from '@/store/state'
import actions from '@/store/actions'
import getters from '@/store/getters'
import mutations from '@/store/mutations'
import {State} from '@/types/State'

Vue.use(Vuex)

export default new Vuex.Store({
    state: state as State,
    getters,
    mutations,
    actions
})