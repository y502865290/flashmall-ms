import {createStore} from "vuex";

export default createStore({
    state(){
        return {
            user: {
                username:''
            }
        }
    },
    mutations:{
        setUser(state,payload){
            state.user = {username:payload};
        }
    },
})