const serialport = global.require('serialport')
const reg=/(wn)\d{4,}\.\d{2}(kg)/g;
import { getNowFormatDate } from '../../util/time.js'
import { setTrunkRecord } from '../../util/util.js'
export function list(){
    // 存取serialport 端口名
    return new Promise((resolve, reject) => {
        serialport.list((err,ports)=>{
            console.log('serialport_list_err',err)
            if (err) {
                reject(err);
                return;
            }
            // let myseraport=['COM1','COM2','COM3','COM4'];
            let myseraport=[];
            ports.map(v=>(
                myseraport.push(v['comName'])
            ))

            resolve(myseraport);   
        })
    })
}


const sp ={}
export function newSP(comName, dataFn, baudRate=115200, errFn = ()=> {}) {
    let p = new serialport(comName,{
        baudRate
    });
    let Str="";
    p.on('data', (data) => {
      
        if (typeof dataFn === 'function') {
            Str+=data.toString();
            if(Str.match(reg)!==null){
                let StrArr=Str.match(reg)
                StrArr.forEach(v=>dataFn(v))
                Str="";
            }
        }

  
 
    });
    p.on('disconnect', (err) => {
        console.log('sp unexpectally closed ===>>>>', err);
    })
    p.on('close', () => {
        console.log('sp closed! ====>>>> ====');
    })
    sp[comName]=p
    return comName
}

const sendIn = (sp, msg, errFn) => {
    sp.write(msg, function (err) {
        if (err) {
            if (typeof errFn === 'function' ){
                errFn(err);
            }
            return console.log('Error on write: ', err.message);
        }
        // console.log('message written');
    })
    
    sp.flush();
    // sp.flush(function(err,results){
    //     console.log('flush====>>>>>')
    // });
 
}

export function send(id, msg) {
    let obj ={
        name:id,
        time:getNowFormatDate()
    }
    setTrunkRecord(obj)

    const p = sp[id];
    if (p) {
        if(!p.isOpen()) {
            p.open(function(err){
                if(err){
                    console.log("failed to open:",err)
                }else{
                    sendIn(p, msg, p.errFn);
                }
            })
        } else {

            sendIn(p, msg, p.errFn);
        }
    }
}

export function closeTrunk(id) {
    if (sp[id]) {
        sp[id].close(() => {
            list().then(ports => console.log('ports ===>>>', ports));
            delete sp[id]
        });
    }
}