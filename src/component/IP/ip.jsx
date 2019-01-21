import React, { Component } from 'react';
import {
    Select,
    Input,
    Button,
    Table,
    Modal,
    Form,
} from 'antd';
import './ip.css'
import {addData,removeData,getItem} from '../../../util/ip.js';
const FormItem = Form.Item;
class IpSetting extends Component {
    state = { visible: false }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        this.props.form.validateFields((err, values) => {
            if (err) {
              return;
            }
        addData(values)
        this.renderData()
        this.setState({
            visible: false,
        });
        this.props.form.resetFields();
          });  
    }
    renderData(){
        this.setState({
            data:getItem()||[]
        })
    }
    
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    deleteData=(v)=>{
        removeData(v),
        this.renderData();
    }
    componentDidMount(){
        this.renderData()
    }
    render() {
        const {data} =this.state
        const { getFieldDecorator } = this.props.form;

        const columns = [{
            title: '扫描设备(相机)IP',
            dataIndex: 'scanIp',
            key: 'scanIp',
        }, {
            title: '供包台标识',
            dataIndex: 'stationIp',
            key: 'stationIp',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <Button type="danger" onClick={()=>this.deleteData(record)}>删除</Button>
                </span>
            )
        }];
        return (
            <div className="Ip_wrapper">
                <div className="ip_content">
                    <div className="ip_option">
                        <Button type="primary" icon="plus" onClick={this.showModal}>新增绑定关系</Button>
                    </div>
                    <div className="iptable">
                        <Table dataSource={data} columns={columns} />
                    </div>
                </div>
                <Modal
                    title="新增IP配置"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="确认"
                    cancelText="取消"
                >
                <div className="ip_form">
                <Form layout="vertical">
                    <FormItem label="扫描设备(相机)IP">
                        {getFieldDecorator('scanIp', {
                            rules: [{ required: true, message: '请输入扫描设备IP' }],
                                })(
                                    <Input />
                                )}
                    </FormItem>
                
                    <FormItem label="供包台标识">
                        {getFieldDecorator('stationIp', {
                            rules: [{ required: true, message: '请输入供包台标识' }],
                                })(
                                    <Input />
                                )}
                    </FormItem>
                       
               </Form>
                </div>
                </Modal>

            </div>
        )
    }
}
const FormIP= Form.create()(IpSetting)
export default FormIP;