import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({

    state: {
        name: '',
    },
    mutations: {
        handlehangeSpellName (state,params) {
            state.name = params
        }
    }
})

export default store