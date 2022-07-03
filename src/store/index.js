import {createStore} from "vuex";

export default createStore({
    state(){
        return {
            user:{},
            authority:{}
        }
    },
    mutations:{
        setUser(state,payload){
            state.user = payload
        },
        logout(state){
            state.user = {}
            state.authority = undefined
        },
        setAuthority(state,payload){
            state.authority = payload
        }
    }
})