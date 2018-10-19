import React, { Component } from 'react';
import {connect} from 'react-redux'
import {add,remove} from '../../redux/reducer.js'
class MySocket extends Component{
    render(){
        // console.log("socket===>>",this.props)
        // const {portInter,dispatch}=this.props
        // console.log("portInte1r===>>>",portInter);
        return (
            <div>
                    THis is for socket 
                    
                    {/* <div onClick={()=>dispatch(add({id:1}))}>
                        增加
                    </div>
                    
                    <div onClick={()=>dispatch(remove({id:1}))}>
                        减少
                    </div> */}
                    <ul>
                      
                    </ul>
            </div>
        )
    }
}
// const mapStateToPorps = state =>({
//         portInter:state.portInter
//     })

// function mapStateToProps(state) {
//     console.log("state===>>",state)
//     return { portInter: state.portInter }
    
// }


// const mapDispatchToProps=(dispatch)=>{
//     return {
//        add:(item)=>{
//            dispatch(add(item))
//        },
//        remove:(item)=>{
//            dispatch(remove(item))
//        }
//     }
// }
// export default connect(mapStateToProps)(MySocket);
export default MySocket;