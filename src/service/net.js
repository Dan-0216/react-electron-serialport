import { message } from 'antd';
const net = global.require('net');
const server2=net.createServer();
const ab2str = global.require('arraybuffer-to-string')
const ETX = String.fromCharCode(0x03);
const STX = String.fromCharCode(0x02);

server2.listen(8089,function(){
    console.log("listen in 8089")
})


export function ConnectNet(callbackFn){
    server2.on('connection',function(socket){
        // console.log("厂商软件 连接成功")
        message.destroy()
        message.success('建立连接成功', 2.5)
        socket.on('data', (data)=> {
            const str = ab2str(data);
            const strs = str.split(ETX).map(s => s.replace(STX, ''));
            if(Array.isArray(strs)&&strs.length){
                let nativeData=strs[0]
                if(nativeData && typeof callbackFn === 'function'){
                    callbackFn(nativeData)
                }
            }
        })

        socket.on('close',(err)=>{
            message.loading('与扫码软件断开连接,请确认开启扫码软件', 0)
        })
    })

}


