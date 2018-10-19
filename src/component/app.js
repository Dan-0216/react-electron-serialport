import React, {Component} from 'react';
import { Layout, Menu, Icon, message } from 'antd';
import { Route,Link,Redirect} from 'react-router-dom'
import Trunk from './Trunk/Trunk.jsx';
// import Mysocket from './Socket/Socket.jsx'
import  IpSetting from './IP/ip.jsx'
const {Header, Content, Footer, Sider} = Layout;
import './app.css'
class RootComponent extends React.Component {
    componentDidMount(){
        message.loading('与扫码软件尚未建立连接,请确认开启扫码软件', 0)
    }
    render() {
        // console.log("this.props===>>>",this.props)
        let path=this.props.location.pathname;

        let title=path.indexOf('trunk')!==-1?'串口称重配置':'IP绑定配置'
        return (
            <div>
                <Layout>
              
                    <Sider
                        collapsible={false}
                    >
                        <div className="logo">
                          <img src={require('../resource/img/logo.png')} alt="logo" />
                        </div>
                        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                            <Menu.Item key="1">
                                <Link to="/trunk">
                                <Icon type="appstore" />
                                <span className="nav-text">
                                  串口设备IP配置
                                </span>
                                </Link>
                            </Menu.Item>
                            
                            <Menu.Item key="2">
                                <Link to="/ipsetting">
                                <Icon type="exception" />
                                <span className="nav-text">扫描设备IP配置</span>
                                </Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header
                            style={{
                            background: '#fff',
                            padding: 0
                        }}>
                         <div className="trunk_title">{title}</div>
                        </Header>
                        <Content
                            style={{
                            margin: '24px 16px 0'
                        }}>
                            <div
                                style={{
                                padding: 10,
                                // minHeight: 360
                                minWidth:400
                            }}>

                                <div className="content_wrapper">
                                      <Redirect from="/" to="/trunk"></Redirect>   
                                      <Route path="/trunk" component={Trunk} />
                                      <Route path='/ipsetting' component={IpSetting}/>
                                </div>

                            </div>
                        </Content>
                        <Footer
                            style={{
                            textAlign: 'center'
                        }}>
                         版权所有 © 2018 上海快仓智能科技有限公司  
                        </Footer>
                    </Layout>
                </Layout>
            </div>
        )
    }
}
export default RootComponent;