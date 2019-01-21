  // 存取localStorage
  function setItem(obj){
    var str = JSON.stringify(obj);
    localStorage.setItem('ip',str);
}

//  获取 localStorage
function getItem(){
  var obj=JSON.parse(localStorage.getItem('ip')) || [];
  return obj
}

// 添加 data
function addData(obj){
    let oldObj =  getItem()||[]
    console.log(oldObj);
    oldObj.push(obj);
    setItem(oldObj)
  }
  
  // 删除 data
  function removeData(obj){
    var arr = getItem()
    setItem(arr.filter(v=>(!isObjEqual(v,obj))))
  }

// 改造原始数据中扫描设备ip对应供包台ip
function IpContrast(msg) {
    let obj =getItem()
    // 169.254.12.205:13284064349+1.21
   let oldArr= msg.split(':');
   let newstr="";
   if(Array.isArray(oldArr)&&oldArr.length){
       let oldip =oldArr[0];
       let temp=oldArr[1];
       let newip=""
       let newobj=obj.find(v=>v.scanIp==oldip)
       if(newobj && typeof newobj=='object'){
         newip=newobj.stationIp
         newstr=newip+":"+temp;
       } else {
        return false;
       } 
   }else{
       return false;
   }
   return newstr;
}  


//比较2个对象是否相同
function isObjEqual(o1,o2){
	var props1 = Object.getOwnPropertyNames(o1);
    var props2 = Object.getOwnPropertyNames(o2);
    if (props1.length != props2.length) {
        return false;
    }
    for (var i = 0,max = props1.length; i < max; i++) {
        var propName = props1[i];
        if (o1[propName] !== o2[propName]) {
            return false;
        }
    }
    return true;
}


export {setItem,getItem,addData,removeData ,IpContrast}