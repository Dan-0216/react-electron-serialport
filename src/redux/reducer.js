const ADD_PORT="ADD_PORT"
const REMOVE_PORT="REMOVE_PORT"
const serialport = global.require('serialport')
// const serialport = require("electron").remote.require("serialport");
// 存取实例化的 port
const initState={
    portInter:[]
}
export default function reducer(state=initState,action){
    switch(action.type){
        case ADD_PORT:
        let p = new serialport(action.payload);
        p.on('data', (data) => {
            console.log('receive data====>>>>', data.toString())
        });
        p.on('disconnect', (err) => {
            console.log('sp unexpectally closed ===>>>>', err);
        })
        p.on('close', () => {
            console.log('sp closed! ====>>>> ====');
        })
        let addObj={};
        let addP=[];
        state.portInter.push(p)
        addP= state.portInter
        addObj={
            portInter:addP
        }
        // return {portInter:[...state.portInter, p]}
        return addObj
        case REMOVE_PORT:
        action.payload.close(() => {
            serialport.list((err,ports)=>{
                console.log('serialport_list_err',err)
                //   let myseraport=['COM1','COM2','COM3','COM4'];
                console.log("ports===>>>",ports)      
            });
            action.payload = null;
        });
        // let obj=action.payload;
        // return {...state,portInter:state.portInter.filter(v=> v!==obj)}
        let removeObj ={}
        let index = state.portInter.findIndex(v=>v.path===action.payload.path)
        let removeP=[];
        state.portInter.splice(index,1);
        removeP = state.portInter
        removeObj={
            portInter:removeP
        }
        return removeObj
        // console.log("filter===>>>",state.portInter.filter(v=> v != action.payload))
        // return  { portInter:state.portInter.filter(v=> v != action.payload) }
        // return  {portInter:state.portInter.filter(v=>v.path != action.payload.path)}
        default: return state
    }
}

export function add(item){
  
    return {
        type:ADD_PORT,
        payload:item
    }
}

// export function remove(id){
    
//     return {
//         type:REMOVE_PORT,
//         payload:id
//     }
// }
export function remove(obj){
    
    return {
        type:REMOVE_PORT,
        payload:obj
    }
}