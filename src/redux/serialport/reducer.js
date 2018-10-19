const ADD_PORT="ADD_PORT"
const REMOVE_PORT="REMOVE_PORT"
const SET_WEIGHT="SET_WEIGHT"
const SET_IP="SET_IP"
const DELETE_WEIGHT="DELETE_WEIGHT"
const DELETE_IP="DELETE_IP"


const initState={
    portInter:{},
    weight:{},
    ip:{}
}
export default function reducer(state=initState,action){
    switch(action.type){
        case ADD_PORT:
            state.portInter[action.payload.id]={type:action.payload.type,ip:action.payload.ip}
        return state;
        
        case REMOVE_PORT:
            delete state.portInter[action.payload]
        return state;    

        case SET_WEIGHT:
            state.weight[action.payload.name]=action.payload.data
        return state;

        case DELETE_WEIGHT:
            delete state.weight[action.payload]
        return state;

        case SET_IP:
            state.ip[action.payload.ip]=action.payload.code
         return state;   

        case DELETE_IP:
            delete state.ip[action.payload]
        return state;

        default: return state;
    }
}
