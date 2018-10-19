import {requireTrunk} from './access.js';
const serialport = require("electron").remote.require("serialport");

// 开启所有串口
function AllTrunkInit(){
    let trunk_list =requireTrunk();
    trunk_list.map(v=>(
        addTrunkIntance(new serialport(v))
    ))
}

// 存取串口实例
function saveTrunkInstance(obj) {
    let TrunkObj = JSON.stringify(obj);
    localStorage.setItem('TrunkInstance',TrunkObj)
}

// 获取串口实例
function getTrunkIntance(){
    let obj = localStorage.getItem('TrunkInstance')
    return obj;
}

// 新增串口实例
function addTrunkIntance(obj){
    let oldObj=getTrunkIntance()||[]
    oldObj.push(obj)
    saveTrunkInstance(oldObj)
}

// 删除串口实例
function  removeTrunkIntance(trunk_id) {
    let arr =getTrunkIntance();
    for(var i=0;i<arr.length;i++){
        if(arr[i].path===trunk_id){
          arr.splice(i,1);
          i--;
        }
      }
    saveTrunkInstance(arr)
}

export {AllTrunkInit, saveTrunkInstance, getTrunkIntance, addTrunkIntance, removeTrunkIntance}