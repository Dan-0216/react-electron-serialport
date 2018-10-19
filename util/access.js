
  // 存取localStorage
function setItem(obj){
    var str = JSON.stringify(obj);
    localStorage.setItem('data',str);
}

//  获取 localStorage
function getItem(){
  var obj=JSON.parse(localStorage.getItem('data'))||[];
  return obj
}

// 添加 data
function addData(obj){
  let oldObj =  getItem()||[]
  oldObj.push(obj);
  setItem(oldObj)
}

// 删除 data
function removeData(trunk_id){
  var arr = getItem()
  for(var i=0;i<arr.length;i++){
    if(arr[i].trunk_id===trunk_id){
      arr.splice(i,1);
      i--;
    }
  }
  setItem(arr)
}

// 获取已经存取的trunk列表
function requireTrunk() {
    let myobj = getItem();
    let arrList=[];
    if(Array.isArray(myobj)&& myobj.length){
        myobj.map((item)=>{
          arrList.push(item.trunk_id)
        })
    }
    return arrList;
}


  // 数组去差方法 
  var subSet = function(arr1, arr2) {
    var set1 = new Set(arr1);
    var set2 = new Set(arr2);
    var subset = [];
    for (let item of set1) {
        if (!set2.has(item)) {
            subset.push(item);
        }
    }
    return subset;
};

// 判断数据状态
function chectStatus(trunklist){
  let arr =getItem();
  if(Array.isArray(arr)&& arr.length) {
    for (var i=0;i<arr.length;i++){
      if(trunklist.findIndex((v)=>v===arr[i]['trunk_id'])!=-1){
        arr[i]['status']='在线'
      }else{
        arr[i]['status']='不在线'
      }
    }
  }
  return arr;
}

// 判断存取在localstorage中 在线数据列表
/** 
 * arr表示在线的列表
*/
function judgeOnline(arr){
  let localArr=getItem();
  return localArr.filter(v => arr.includes(v.trunk_id))
  
}

// 获取可选串口
function selectTrunk(onList){
  let arr =requireTrunk();
  return subSet(onList,arr)
}

// 查找weight_id 对应的端口
function findWeightPort(id){
  let myobj = getItem();
  let port;
  if(Array.isArray(myobj)&& myobj.length){
    port=myobj.find(v=>v.weight_id===id)
  }
  return port;
}

// 
function findInstanceport(arr,trunk_id){
  return arr.find(v=>v.path===trunk_id)
}


export { setItem,getItem,addData,removeData,requireTrunk,subSet,chectStatus,judgeOnline,selectTrunk,findWeightPort,findInstanceport }