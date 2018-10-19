const ADD_PORT="ADD_PORT";
const REMOVE_PORT="REMOVE_PORT";
const SET_WEIGHT="SET_WEIGHT";
const SET_IP="SET_IP"
const DELETE_WEIGHT="DELETE_WEIGHT"
const DELETE_IP="DELETE_IP"

export function add(item){
  
    return {
        type:ADD_PORT,
        payload:item
    }
}

export function remove(id){
    return {
        type:REMOVE_PORT,
        payload:id
    }
}

export function setWeight(name,data){
    return {
        type:SET_WEIGHT,
        payload:{name,data}
    }
}

export function deleteWeight(CoName){
    return {
        type:DELETE_WEIGHT,
        payload:CoName
    }
}



export function setIp(ip,code){
    return {
        type:SET_IP,
        payload:{ip,code}
    }
}

export function deleteIp(ip){
    return {
        type:DELETE_IP,
        payload:ip
    }
}