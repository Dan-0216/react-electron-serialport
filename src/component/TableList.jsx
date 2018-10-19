import React, { Component  } from 'react';
import { Row, Col, Select, Input, Button, Table, Divider  } from 'antd';
const Option = Select.Option;
import './TableList.css'
class TableList extends Component {
    constructor(props) {
        super(props);
      
      }

    handleChange(){
        console.log(`selected ${this}`);
    }
    
    render() {
        const columns = [{
            title: '串口标识',
            dataIndex: 'trunk_id',
            key: 'trunk_id',
          }, {
            title: '沉重标识',
            dataIndex: 'weight_id',
            key: 'weight_id',
          }, {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <a href="javascript:;">删除</a>
                        <Divider type="vertical" />
                    </span>
                     ),
          }];
          const dataSource = [{
            key: '1',
            trunk_id: 'COM4',
            weight_id: 4877464,
          }, {
            key: '2',
            trunk_id: 'COM5',
            weight_id: 1121164,
          }];
          
        return (
            <div className="container">
                <div className="gutter-example">
                    <Row gutter={16}>
                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">
                                <Select defaultValue="lucy" style={{ width: '100%' }} onChange={ this.handleChange()}>
                                    <Option value="jack">Jack</Option>
                                    <Option value="lucy">Lucy</Option>
                                    <Option value="disabled" disabled>Disabled</Option>
                                    <Option value="Yiminghe">yiminghe</Option>
                                </Select>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box"><Input placeholder="Basic usage" /></div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">
                            <Button type="primary">确认添加</Button>
                            </div>
                        </Col>
                        <Col className="gutter-row" span={6}>
                            <div className="gutter-box">col-6</div>
                        </Col>
                    </Row>
                </div>


                <div className="table_wrapper">
                <Table dataSource={dataSource} columns={columns} />
                </div>  
            </div>
        )
    }
}

export default TableList