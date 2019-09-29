import React, { Component } from 'react';
import {Breadcrumb,Spin,Tabs,Form} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import * as actionCreators from '../../../../actions/courseAdmin';
import {  } from '../../../../utils/requrl'

import PaymentRecord from './PaymentRecord';
import moment from 'moment'
import './index.less'

const BreadcrumbItem = Breadcrumb.Item
const { TabPane } = Tabs;
class index extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }

      }
    componentWillMount() {


    }

    async componentDidMount() {

    }


    componentWillUpdate(nextProps) {

    }

    render() {
        const { getFieldDecorator } = this.props.form;
        console.log(this.props.coursesData)
        return (
        //   <Spin spinning={this.props.loading}>
        <Spin spinning={false}>

          <div>
              <div className='breadcrumb1'>
                  <Breadcrumb separator=">">
                      <BreadcrumbItem>Transactions</BreadcrumbItem>
                  </Breadcrumb>
              </div>

              <div className='showPaymentRecord'><br />
                  <PaymentRecord />
              </div>


          </div>

          </Spin>
        );
    }
}

const mapStateToProps = (state) => {

    return {
      coursesData: state.course.data && state.course.data.results ? state.course.data.results : [],
      loading: state.course.loading,
    };
  };

  const mapDispatchToProps = (dispatch) => {
    return {
      actions: bindActionCreators(actionCreators, dispatch),
    };
  };
  const indexs = Form.create()(index)
  export default connect(mapStateToProps, mapDispatchToProps)(indexs);
  export { indexs };