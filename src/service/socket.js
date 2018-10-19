const server = require('http').createServer();
const io = require('socket.io')(server,{
    serveClient: false
});
server.listen(8081,function(){
    console.log("listener in port 8081")
  });

export function ConnectSocket(dataFn){
    io.on('connection', function (socket) { 
        console.log("连接成功")
        socket.on('data',(data)=>{
            console.log("socket___ data===>>>>",data)
            let  mydata =JSON.parse(data)
            // let res = mydata.data;
            if (typeof dataFn === 'function') {
                dataFn(mydata);
            }
        }) 
    })
}

export function emit(event, message) {
    io.emit(event, message);
}
