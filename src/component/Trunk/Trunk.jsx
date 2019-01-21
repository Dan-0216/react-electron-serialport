import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Select,
    Input,
    Button,
    Table,
    Modal,
    Form
} from 'antd';
import './Trunk.css'
import { add,remove,setWeight,setIp,deleteWeight,deleteIp} from '../../redux/serialport/action.js'
import { addData,removeData,chectStatus,judgeOnline,selectTrunk} from '../../../util/access.js';
import { getNowFormatDate } from '../../../util/time.js'
import {IpContrast} from '../../../util/ip.js';
import { list ,newSP ,closeTrunk,send} from '../../service/trunk.js';
import { ConnectNet } from '../../service/net.js';
import {ConnectSocket,emit} from '../../service/socket.js';
const FormItem = Form.Item;
const Option = Select.Option;
const ERR_CODE ='ErrorParcelCode'
let timerMap = {};
let codeTimerMap = {}
// let timerArr=[];
const MIN_WEIGHT=0.01;
const Belt_Order="$go#";
let CodeCount = 0;
class Trunk extends Component {
    constructor(props){
        super(props)
        this.state = { 
            visible: false,
            data:[],
            trunk_list:[],
            trunkMsg:[],
            port1:{},
            protInstance:[],
            trunk_data:[],
            value:"",
            logFlag:false
         }
         this.test=[];
    }   

    // 显示模态框
    showModal = () => {
        this.setState({
          visible: true,
        });
      }
      
    // 隐藏模态框
    handleCancel = (e) => {
        this.setState({
          visible: false,
        });
      }

    // 新增记录
    onCreate = () => {
        this.props.form.validateFields((err, values) => {
          if (err) {
            return;
          }
        console.log('Received values of form: ', values);
        const Data=values;
        addData(Data)
        this.renderData()
        this.filterTrunk()
        this.props.form.resetFields();
        this.setState({ visible: false });
        // 新增端口
        this.InitPort(values.trunk_id,values.type,values.agvStation_ip);
        });  
    }



    // 获取data 数据
    renderData(){
          this.setState({
              data:chectStatus(this.state.trunk_data)
          })
    }

    // 初始化端口
    InitPort=(name,type,ip)=>{
        const {dispatch}=this.props;
        let id;
        if(type === 'weight'){
             id =newSP(name,this.receiveTrunkData(name),9600);
        }else{
            id =newSP(name);
        }   
        let obj ={id,type,ip}
        dispatch(add(obj))
    }

    // 接收串口数据
    receiveTrunkData=(name)=>{
        // 每次接收串口数据和reducer值进行比较,不同则进行赋值
        const {dispatch,serialport:{weight,ip,portInter}} = this.props;
        return data => {
            // 如果当前reducer 中的重量信息不一致 或者不存在当前串口的重量信息 则赋值后执行发送逻辑
            let str = data.replace("wn","");
            let srrInt=parseFloat(str);
            // 如果重量信息小于最小重量，则忽略
            if(srrInt > MIN_WEIGHT){
                if((weight[name] && weight[name]!==srrInt) || !weight[name] ){
                    dispatch(setWeight(name,srrInt));
                }
                this.setTimerSend(name,srrInt)
            }else{
              // 如果称重有变化 清除延迟计时器队列
              if(timerMap[name] && timerMap[name].length>0){
                timerMap[name].forEach(v=>clearTimeout(v))
                timerMap[name]=[];
                // console.log(name, "无称重信息 清除延迟计时器队列")
              }
            }
        }
    }

        // 接收net数据
    receiveNetData=()=>{
            const {dispatch,serialport:{ip,portInter,weight}} = this.props;
           return data=>{
            let mydata=IpContrast(data);
            if(mydata!=false){
              let arr= mydata.split(':')
              let receiveIp =arr[0];
              let code =arr[1].replace(/\+/g,'');
            if(( ip[receiveIp] && ip[receiveIp]!==code) || !ip[receiveIp] ){
                   dispatch(setIp(receiveIp,code));
            }
            this.clearTimerSend(receiveIp,code)
            }
           }
        }

    // 设置计时器的发送逻辑
    setTimerSend=(name,data)=>{
        let _this= this;
        const {serialport:{portInter},dispatch}=this.props;
        const station_ip =  portInter[name].ip;
        let msg={message:`${station_ip}:${ERR_CODE}+${data}`}
        
        let a = setTimeout(()=>{
                emit("mockscan",msg)
                dispatch(deleteWeight(name));
         _this.state.logFlag && console.log(`条码异常${getNowFormatDate()}`,msg);
        },1000);
        if(!timerMap[name]){
            timerMap[name]=[];
        }
        timerMap[name].push(a);
    }

    // 清除计时器发送逻辑
    clearTimerSend=(receiveIp,code)=>{
        const {dispatch,serialport:{ip,portInter,weight}} = this.props;
        // 找到串口名称
        let comName;
        for (let i in portInter){
            if(portInter[i].ip===receiveIp && portInter[i].type == "weight"){
                comName = i;
            }
        }
        if(weight[comName]){
            let msg={message:`${receiveIp}:${code}+${weight[comName]}`}
            emit("mockscan",msg)
            this.state.logFlag && console.log(`正常发送条码${getNowFormatDate()}`,msg)
            // 清除异常条码计时器
            if(timerMap[comName] && timerMap[comName].length>0){
                timerMap[comName].forEach(v=>clearTimeout(v))
                timerMap[comName]=[];
            }

            // 清除有条码无称重计时器
            if(codeTimerMap[receiveIp] && codeTimerMap[receiveIp].length>0){
                codeTimerMap[receiveIp].forEach(i=>clearTimeout(i))
                // timerMap[comName]=[];
                codeTimerMap[receiveIp]=[]
            }

            dispatch(deleteWeight(comName));

        }else{
            
            /**
             * @date 2019/1/1
             * @author zhangshuaidan
             * 修复有条码无称重，添加默认称重信息
             */

            // message: "192.168.1.121:9708186019700+0.05"

            // if(CodeCount>2){
            //     let msg={message:`${receiveIp}:${code}+0.02`}
            //     this.state.logFlag && console.log(`正常发送条码${getNowFormatDate()}`,msg)
            //    setTimeout(()=>{
            //      emit("mockscan",msg)
            //    },1000)    
            //   CodeCount= 0;

            // }else{
            //     CodeCount++;
            // }
            

            let msg={message:`${receiveIp}:${code}+0.02`}
            //重写 有条码无称重发送
            let timer = setTimeout(()=>{
              emit("mockscan",msg)
              this.state.logFlag && console.log(`正常发送条码${getNowFormatDate()}`,msg)
            },1000)

            if(!Array.isArray(codeTimerMap[receiveIp])){
                codeTimerMap[receiveIp]=[]
            }

            codeTimerMap[receiveIp].push(timer)
            // 
            

        }

    }


    // 清除reducer中ip下的条码和称重
    clearWeightIp(comName,ip){
        const {dispatch} =this.props;
        dispatch(deleteWeight(comName));
        dispatch(deleteIp(ip))
    }





    // 删除data
    deleteData=(v)=>{
        console.log("trunk_id===>>",v.trunk_id)
        const {dispatch} =this.props;
        closeTrunk(v.trunk_id)
        dispatch(remove(v.trunk_data))
        removeData(v.trunk_id);
        this.filterTrunk()
        this.renderData()
    }


    // 过滤已经选择的串口 
    filterTrunk=()=>{
        this.setState({
            trunk_list:selectTrunk(this.state.trunk_data)
        })
    }

    // TestTrunk=()=>{
    //     send('COM8',"2.12kg")
    // }

    // 渲染local数据
    renderLocalPort=()=>{
       const {serialport:{portInter}} = this.props;
       let localArr=judgeOnline(this.state.trunk_data) 
    //    console.log("localArr===>>>",localArr);
        localArr.map(v=>{
            if(!(portInter[v.trunk_id] && typeof portInter[v.trunk_id] == 'object') ){
                this.InitPort(v.trunk_id,v.type,v.agvStation_ip);
            }
        })
    }

    // 接收socket 发送来滚动皮带的指令
    receiveSocketData=(receiveMsg)=>{
    const {serialport:{portInter}} = this.props;
    let {ip,msg}=receiveMsg;
    let comName;
    for (let i in portInter){
        if(portInter[i].ip==ip && portInter[i].type=="belt"){
            comName=i;
        }
    }

     this.state.logFlag && console.log(`串口信息发送${getNowFormatDate()}`,comName);

    // 给串口发信息
    send(comName,Belt_Order)

    /**
     * 下发皮带滚动并清除延迟计时器队列
     */

    // let comName_weight;
    // for (let i in portInter){
    //     if(portInter[i].ip === ip && portInter[i].type == "weight"){
    //         comName_weight = i;
    //     }
    // }

    // if(timerMap[comName_weight] && timerMap[comName_weight].length>0){
    //     timerMap[comName_weight].forEach(v=>clearTimeout(v))
    //     timerMap[comName_weight]=[];
    // }
    
    
    }
    
    // 皮带A模拟滚动
    goToA(){
        // setInterval(()=>{
         
        // },2000);
        send('COM2',Belt_Order);
       
    }

    // 皮带B模拟滚动
    goToB(){
        send('COM4',Belt_Order);
    }

    // 模拟sock发送
    mockSend=()=>{
        let msg={message:`${this.state.value}:ErrorParcelCode+2.25`}
        emit("mockscan",msg)
    }
    // 模拟sock发送
    mockSendNormal=()=>{
        let msg={message:`${this.state.value}:1446789654123+2.25`}
        emit("mockscan",msg)
    }

    // 模拟任务发送1
    mockTask1(){
     const data ={
        driveUnit: {},
        driveUnitID: "AGV1",
        order: 2,
        parcels: [],
        scanDeviceIP: "169.254.7.120",
        state: "",
        stationID: 1,
        taskID: "task1",
        taskType: "SMALL",
        }
        emit('task',data)
    }
    // 模拟任务发送2
    mockTask2(){
    const data = {
        driveUnit: {},
        driveUnitID: "AGV2",
        order: 1,
        parcels: [],
        scanDeviceIP: "169.254.6.184",
        state: "",
        stationID: 1,
        taskID: "task2",
        taskType: "SMALL",
        }
        emit('task',data)
    }
    
    // 日志打印开关
    toggleLog=()=>{
        this.setState({
            logFlag:!this.state.logFlag
        })
    }

    componentDidMount(){

        // console.log('当前时间',getNowFormatDate())
                
        // 连接WeBSocket
        ConnectSocket(this.receiveSocketData);

        const _this=this

        // 获取当前的串口列表
        list().then(ports=>{
            _this.setState({
                trunk_list:ports,
                trunk_data:ports,
            },()=>{
                /**
                 * 存取串口到state中
                 */
                // 过滤已经选择的串口
                _this.filterTrunk();

                //渲染数据到table中
                _this.renderData(); 

                // 实例化已选择端口
                _this.renderLocalPort();
            })
        })
        
        // 连接HTTP
        ConnectNet(this.receiveNetData())

    }

    handleChange=(e)=>{
        this.setState({
            value:e.target.value
        })
    }

    render() {   
        

        console.log("portInter===>>>",this.props)
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: '串口',
                dataIndex: 'trunk_id',
                key: 'trunk_id'
            }, {
                title: '供包台标识',
                dataIndex: 'agvStation_ip',
                key: 'agvStation_ip'
            },{
                title: '类型',
                dataIndex: 'type',
                render:(text,record)=>{
                    return (text==='weight'?'称重设备':'皮带设备')
                }
            },
            {
                title:'状态',
                dataIndex:'status',
                key:'status' 
            },{
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                           <Button type="danger" onClick={()=>this.deleteData(record)}>删除</Button>
                    </span>
                )
            }
        ];

        return (
        
            <div className="trunk_wrapper">
                <div className="trunk_content">
                <div className="trunk_option">
                    <Button type="primary" icon="plus"  onClick={this.showModal}>新增配置</Button>
                      {/* {/* <Button type="primary" onClick={this.mockScan1}>模拟包裹1扫描</Button> */}
                      {/* <Button type="primary" onClick={this.TestTrunk}>模拟串口发送</Button>
                      <Button type="primary" onClick={this.clearTimerSend}>模拟条码发送</Button> */}

                     {/* <Input addonBefore="目标地址"  value={this.state.value}  onChange={this.handleChange}/>

                      <Button type="primary" onClick={this.mockSend}>模拟异常发送</Button>
                      <Button type="primary" onClick={this.mockSendNormal}>模拟正常发送</Button>

                      <Button type="primary" onClick={this.mockTask1}>模拟任务发送1</Button>
                      <Button type="primary" onClick={this.mockTask2}>模拟任务发送2</Button>         */}

                      <Button type="primary" onClick={this.goToA}>皮带A滚动模拟</Button>
                      <Button type="primary" onClick={this.goToB}>皮带B滚动模拟</Button>
                      <Button type="primary" onClick={this.toggleLog}>{this.state.logFlag ? '关闭日志' : '开启日志'}</Button>
                
                    </div>
                    <div className="table_wrapper">
                        <Table dataSource={this.state.data} columns={columns}/>
                    </div>
        
                </div>
                <Modal
                    title="新增串口--配置"
                    visible={this.state.visible}
                    onOk={this.onCreate}
                    onCancel={this.handleCancel}
                    okText="确认"
                    cancelText="取消"
                >
                    <div>
                    <Form layout="vertical">
                            <FormItem label="供包台标识">
                                {getFieldDecorator('agvStation_ip', {
                                    rules: [{ required: true, message: '请输入供包台标识' }],
                                })(
                                    <Input />
                                )}
                            </FormItem>
                            <FormItem label="串口">
                                {getFieldDecorator('trunk_id',{
                                      rules: [
                                        { required: true, message: '请选择串口' },
                                      ],
                                })(   
                                     <Select placeholder="请选择一个串口" >
                                            {
                                                this.state.trunk_list.map((item,index)=>(
                                                    <Option value={item} key={index}>{item}</Option>
                                                ))
                                            }
                                </Select>)}
                            </FormItem>
                            <FormItem label="类型">
                                {getFieldDecorator('type',{
                                      rules: [
                                        { required: true, message: '请选择串口类型' },
                                      ],
                                })(   
                                    <Select placeholder="请选择串口类型" >
                                         <Option value="weight">称重设备</Option>
                                         <Option value="belt">皮带设备</Option>      
                                    </Select>)
                                }
                            </FormItem>
                
               </Form>
                    </div>
                </Modal>
            </div>
        )
    }
}

const FormWrapper= Form.create()(Trunk)

const mapStateToProps=(state)=>({
    serialport:state
})
export default connect(mapStateToProps)(FormWrapper);