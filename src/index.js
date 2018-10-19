import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import thunk from 'redux-thunk';
import { Provider} from 'react-redux'
import RootComponent from './component/app.js';
import {  HashRouter as Router, Route, Switch , hashHistory,Redirect } from 'react-router-dom';
import  reducer from './redux/serialport/reducer.js'
import { createStore, applyMiddleware } from 'redux' 

const store=createStore(reducer,applyMiddleware(thunk))

class IndexComponent extends React.Component {
    render() {
        return (
            <div>
                <Router>
                        <Switch>
                        <Route  path="/" component={RootComponent}/>
                        </Switch>
                </Router>
            </div>
        )
    }
}
var oBox = document.getElementById("main");
ReactDOM.render(
    <Provider store={store}>
    <IndexComponent/>
    </Provider>, oBox)