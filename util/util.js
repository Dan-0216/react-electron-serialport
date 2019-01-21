function setTrunkRecord(data){
    let record = localStorage.getItem('TrunkRecord')|| JSON.stringify([])
    if(record){
        record = JSON.parse(record)
        if(record.length>500){
            record.pop();
            record.unshift(data)
        }else{
            record.unshift(data)
        }
       
     localStorage.setItem('TrunkRecord',JSON.stringify(record))
    }
}

export { setTrunkRecord }