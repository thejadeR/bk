import React, { Component } from 'react';
import { Divider ,Breadcrumb,Tabs,Form,Card, Input, Select,Icon,Spin,Button,Upload,message,Radio,Checkbox, Table,Tooltip, Modal,DatePicker,TimePicker,Dropdown,Menu,InputNumber } from 'antd';
// import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Cookies from 'js-cookie'
import moment from 'moment';
// import * as actionCreators from '../../../../actions/courseAdmin'
import {Link,Route,withRouter} from 'react-router-dom';

import {getPaymentForStuInfo,getPayment,postPayment,deleteLevelbyId,editPaymentById,getPaymentForCourseInfo} from '../../../../utils/requrl'

import { getscrollData,regScroll,monthChange  } from '../../../../utils/function.js'
import './PaymentRecord.less'


const { MonthPicker } = DatePicker;
const FormItem = Form.Item;

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const mydate = new Date();
const currentMounth = mydate.getMonth() + 1;
const en_currentMounth = monthChange(currentMounth);
const cur_time = mydate.toLocaleDateString();
// if (currentMounth >= 1 && currentMounth <= 9) {
//     currentMounth = "0" + currentMounth;
// }
//   console.log(currentMounth);
// console.log(mydate.toLocaleDateString());
//   console.log(en_currentMounth);

// console.log('window.location.hash:',window.location.hash);

class Receipt extends Component {
  constructor(props){
    super(props);
    this.state = {
        addNewPaymentModalVisible: false,
        paymentList : [],
        stuList:[],
        courseList:[],
        nodify_paymentList:[],
        showMinusIcon: false,
        updLevelModalVisible: false,
        addingpaymentList:{
                "date": "",
                "student": "",
                "paid": "",
                "fee_type": "",
                // "course": "",
                // "status": "1",
                "payment_method":'',
                "remark": "",
                "operator": "luoyu",
                "direction":"0",
        },
        // Type:'',
        // isEditReceipt:false,
        // stu_name_list:[],
        // stu_id_list:[],
    };

    console.log('props',props);
    console.log('props2',this.props);
    console.log('props2',this.props.history);
    // this.gotoEditReceipt = this.gotoEditReceipt.bind(this)
  }


  componentWillMount(){
      const token = Cookies.get('qal-auth-token');
      this.getStu(token);
      // this.getCourse(token);
}
  componentDidMount(){
      this.getPayment();

      const {nodify_paymentList} = this.state;

      const stu_name_list = nodify_paymentList.map(function (item,index,input) {return item.student.name;});
      const stu_id_list = nodify_paymentList.map(function (item,index,input) {return item.student.id;});
      this.setState( {stu_name_list:stu_name_list}  );
      this.setState( {stu_id_list:stu_id_list}  );

      console.log('stu_name_list',stu_name_list);
      console.log('stu_id_list',stu_id_list);
  }

  resetData(){
      this.setState({
          addNewPaymentModalVisible: false,
          paymentList : [],
          stuList:[],
          nodify_paymentList:[],
          showMinusIcon: false,
          updLevelModalVisible: false,
          addingpaymentList:{
            	"date": "",
                "student": "",
                "paid": "",
                "payment_method":'',
                "fee_type": "",
                "course": "",
                // "status": "1",
                "remark": "",
                "operator": "luoyu",
                "direction":"",
        },
          // Type:'',
          // isEditReceipt:false,
          // stu_name_list:[],
          // stu_id_list:[],
      })
  }

  async getPayment(token, data = {}){
      //请求的的Payment结果
      let getPaymentRes = await getPayment(token, data) ;
      // console.log('token:',token);
      console.log('data:',data);
      console.log('getPaymentRes:',getPaymentRes);

      let paymentList = getPaymentRes.data && getPaymentRes.data.results ? getPaymentRes.data.results : [];
      console.log('paymentList:',paymentList);


      // paymentList.map((v,i)=>{paymentList[i].key = v.id;});

      this.setState({paymentList: paymentList});
      this.setState({nodify_paymentList:paymentList});

      console.log('state-paymentList:',this.state.paymentList);


  }


  async getStu(token){
          //查询学生
      let getStuRes = await getPaymentForStuInfo(token) ;
      // console.log('token:',token);

      console.log('getStuRes:',getStuRes);

      let stuList = getStuRes.data && getStuRes.data.results ? getStuRes.data.results : [];
      console.log('stuList:',stuList);


      // stuList.map((v,i)=>{stuList[i].key = v.id;});

      this.setState({stuList: stuList});

  }
  async getCourse(token){
          //查询课程
      let getCourseRes = await getPaymentForCourseInfo(token) ;
      // console.log('token:',token);

      console.log('getCourseRes:',getCourseRes);

      let courseList = getCourseRes.data && getCourseRes.data.results ? getCourseRes.data.results : [];
      console.log('courseList:',courseList);


      // stuList.map((v,i)=>{stuList[i].key = v.id;});

      this.setState({courseList: courseList});

  }


  //显示 addNewPayment modal

    addNewPayment(event){ this.setState({addNewPaymentModalVisible: true,}) }


  //隐藏modal
    handleCancel = e => { this.setState({addNewPaymentModalVisible: false,}) };

  // //点击增加按钮时
  // plusClassroom(index){
  //     let {addingClassroomList, branchId} = this.state;
  //
  //     addingClassroomList.push({index: addingClassroomList.length, title: '', branch: branchId})
  //     this.setState({
  //         addingClassroomList: addingClassroomList
  //     })
  // }
  //
  // //点击减少按钮时
  // minusClassroom(index){
  //   let {addingClassroomList} = this.state;
  //   addingClassroomList.splice(index,1) //操作这个数组等于操作dom节点
  //   this.setState({
  //       addingClassroomList: addingClassroomList
  //   })
  // }




  //向后台添加新的Payment

    async handleAddNew(){
      this.handleAddpaymentList();

      // this.resetData();
    }
   async handleAddpaymentList(){
      console.log('add payment');

      const token = Cookies.get('qal-auth-token');

      let {addingpaymentList} = this.state;


      try{
          console.log('for-req-addingpaymentList:',addingpaymentList);
          console.log('for-req-addingpaymentList:',typeof(addingpaymentList));

          await postPayment(token, addingpaymentList);
      }catch (e) {

      }finally {
          this.getPayment();
          this.handleCancel();
      }
    }



  //删除 level
  async deleteLevel(LevelId){
      console.log('delete level-levelid:',LevelId);
      const token = Cookies.get('qal-auth-token');
      await deleteLevelbyId(LevelId, token);
      this.getPayment();
  }

  //open updLevel modal
  async updLevel(event,LevelId){

      console.log('update level-levelid:',LevelId);
      let {paymentList, Level} = this.state;

      paymentList.forEach((v,i)=>{
          if (v.id === LevelId) {
              console.log('v:',v);
              Level = v;
          }
      });
      this.setState({
          Level: Level,

      })
  }


  //写后台写入更新
  async handleupdLevel(e){

      let {Level} = this.state;
      const token = Cookies.get('qal-auth-token');
      await editPaymentById(token, Level,Level['id'], );
      this.setState({
          Level : {}
      });

      this.getPayment();
      this.handleCancel();
  }


  // handleCancel = (e,type) => {this.resetData();};
  //

  category_onChange(e){
       console.log('category:',e.target.value);
       console.log('category:',typeof(e.target.value));
       const {addingpaymentList} = this.state;

       this.setState({addingpaymentList: {...addingpaymentList, direction: e.target.value}});

  };

  stu_onChange(e){

      console.log('student:',`${e}`);
      console.log('student:',typeof(`${e}`));
      const {addingpaymentList} = this.state;

      // this.setState({
      //     addingpaymentList: {student:e.target.value},
      // });

      this.setState({addingpaymentList: {...addingpaymentList, student: `${e}`}});

      console.log('[pre-addingpaymentList]',addingpaymentList);
      console.log('[pre-addingpaymentList.student]',addingpaymentList.student);

  }

  paid_onChange(e){

      console.log('paid:',e.target.value);
      console.log('paid:',typeof(e.target.value));
      let {addingpaymentList} = this.state;

      this.setState({addingpaymentList: {...addingpaymentList, paid: e.target.value}});
      // this.setState(  preState => ({ addingpaymentList: {...preState.addingpaymentList, paid: `${e}`}  })  );

      console.log('[pre-addingpaymentList]',addingpaymentList);
      console.log('[pre-addingpaymentList.paid]',addingpaymentList.paid);
  }

  type_onChange(e){

      console.log('fee_type:',`${e}`);
      console.log('fee_type:',typeof(`${e}`));
      let {addingpaymentList} = this.state;

      this.setState({
          addingpaymentList: {...addingpaymentList, fee_type: `${e}`}
        })
      // this.setState(  preState => ({ addingpaymentList: {...preState.addingpaymentList, fee_type: `${e}`}  })  );


      console.log('[pre-addingpaymentList]',addingpaymentList);
      console.log('[pre-addingpaymentList.fee_type]',addingpaymentList.fee_type);
  }

  // course_onChange(e){
  //
  //     console.log('course:',`${e}`);
  //     console.log('course:',typeof(`${e}`));
  //     let {addingpaymentList} = this.state;
  //
  //     this.setState({
  //         addingpaymentList: {...addingpaymentList, course: `${e}`}
  //       })
  //     // this.setState(  preState => ({ addingpaymentList: {...preState.addingpaymentList, course: `${e}`}  })  );
  //
  //     console.log('[pre-addingpaymentList]',addingpaymentList);
  //     console.log('[pre-addingpaymentList.course]',addingpaymentList.course);
  // }

  paymentMethod_onChange(e){

      console.log('paymentMethod:',`${e}`);
      console.log('paymentMethod:',typeof(`${e}`));
      let {addingpaymentList} = this.state;

      this.setState({addingpaymentList: {...addingpaymentList, payment_method: `${e}`}});
      // this.setState(  preState => ({ addingpaymentList: {...preState.addingpaymentList, course: `${e}`}  })  );

      console.log('[pre-addingpaymentList]',addingpaymentList);
      console.log('[pre-addingpaymentList.payment_method]',addingpaymentList.payment_method);
  }

  remark_onChange(e){

      console.log('remark:',e.target.value);
      console.log('remark:',typeof(e.target.value));
      let {addingpaymentList} = this.state;

      this.setState({
          addingpaymentList: {...addingpaymentList, remark: e.target.value}
      });
      // this.setState(  preState => ({ addingpaymentList: {...preState.addingpaymentList, remark: `${e}`}  })  );


      console.log('[pre-addingpaymentList]',addingpaymentList);
      console.log('[pre-addingpaymentList.remark]',addingpaymentList.remark);
  }

  date_onChange(e){
      console.log('date-e:',e);

      // console.log('payment_list',this.state.paymentList);

      let nodify_paymentList = this.state.nodify_paymentList;
      if(e){
          console.log('date-e-type:',typeof(e._d));
          let selected_month = e._d.getFullYear()+ "-" + ( (e._d.getMonth()+1) < 10 ? "0"+ (e._d.getMonth()+1) : (e._d.getMonth()+1)  ) ;

          console.log('selected_month:',selected_month);

          let new_paymentList = nodify_paymentList.filter((x)=>(!x.date.indexOf(selected_month)));
          console.log(new_paymentList);

          this.setState( {paymentList:new_paymentList}  );

      }
      else{
          this.setState( {paymentList:this.state.nodify_paymentList} )
      }

  }

  updateInputChange(event){
      let {Level} = this.state;
      Level.title = event.target.value;
      this.setState({
          Level: Level
      })
  }

    gotoEditPaymentRecord(record,event){
      console.log('this.props:',this.props.history);
      this.props.history.push({pathname:"/main/manage/Finance/PaymentRecord/editPaymentRecord",query:{record:record}})
        // this.setState({Type:theid})
        // console.log(this.state.Type)
  };
    //
    // lookDetailReceipt(theid,event){
    //     this.props.history.push({pathname:"/main/manage/Finance/Transactions/detailReceipt",query:{id:theid}})
    // }

//       gotoEditReceipt(){
//       this.props.history.push("/main/manage/Finance/Transactions/editReceipt")
//         // this.setState({Type:theid})
//         // console.log(this.state.Type)
//   };


  render() {

          console.log('rendering');
          const {stuList} = this.state;
          const { getFieldDecorator } = this.props.form;
          const columns = [
          {
              title: 'Date',
              dataIndex: 'date',
              key: 'Date',
          },

          {
              title: 'Category',
              dataIndex: 'direction.title',
              key: 'Category',
               filters: [
                          {
                            text: 'Income',
                            value: 'receipt',
                          },
                          {
                            text: 'Expense',
                            value: 'expense',
                          },
                        ],

              onFilter: (value, record) => record.direction.title ? record.direction.title.indexOf(value) === 0 : false,
              className:'Category',

          },

          {
              title: 'Type',
              dataIndex: 'fee_type.title',
              key: 'Type',
              filters: [
                          {
                            text: 'tuition',
                            value: 'tuition',
                          },
                          {
                            text: 'other fee',
                            value: 'other fee',
                          },
                        {
                            text: 'late fee',
                            value: 'late fee',
                        },
                        {
                            text: 'added fee',
                            value: 'added fee',
                        },

                          // {
                          //   text: 'Submenu',
                          //   value: 'Submenu',
                          //   children: [
                          //     {
                          //       text: 'Green',
                          //       value: 'Green',
                          //     },
                          //     {
                          //       text: 'Black',
                          //       value: 'Black',
                          //     },
                          //   ],
                          // },
                        ],
                        // specify the condition of filtering result
                        // here is that finding the name started with `value`
              onFilter: (value, record) => record.fee_type.title ? record.fee_type.title.indexOf(value) === 0 : false,
              className:'Fee_type',
          },

          {
              title: 'Amount',
              dataIndex: 'paid',
              key: 'Amount',
              defaultSortOrder: 'descend',
              sorter: (a, b) => a.paid - b.paid,
              sortDirections:['ascend' ,'descend'],
              className:'Amount',
          },

          {
              title: 'Payer',
              dataIndex: 'student.name',
              key: 'Payer',
          },


          {
              title: 'Payment method',
              dataIndex: 'payment_method.title',
              key: 'Payment method',
              filters: [

                            {
                            text: 'Bank Transfer',
                            value: 'Bank Transfer',
                          },
                            {
                            text: 'Paypal',
                            value: 'Paypal',
                          },

                            {
                            text: 'Cheque/Cash',
                            value: 'Cheque/Cash',
                          },
                            {
                            text: 'Braintree Credit Card',
                            value: 'Braintree Credit Card',
                          },
                            {
                            text: 'Stripe',
                            value: 'Stripe',
                          },
                            {
                            text: 'eNETS',
                            value: 'eNETS',
                          },

                          // {
                          //   text: 'Submenu',
                          //   value: 'Submenu',
                          //   children: [
                          //     {
                          //       text: 'Green',
                          //       value: 'Green',
                          //     },
                          //     {
                          //       text: 'Black',
                          //       value: 'Black',
                          //     },
                          //   ],
                          // },
                        ],
                        // specify the condition of filtering result
                        // here is that finding the name started with `value`

              onFilter: (value, record) => record.payment_method.title ? record.payment_method.title.indexOf(value) === 0 : false,
              className:'Payment_type',

          },
          {
              title: 'Add by',
              dataIndex: 'operator',
              key: 'Add by',
              filters: [
                          {
                            text: 'menhu',
                            value: 'menhu',
                          },
                          {
                            text: 'luoyu',
                            value: 'luoyu',
                          },
                          // {
                          //   text: 'Submenu',
                          //   value: 'Submenu',
                          //   children: [
                          //     {
                          //       text: 'Green',
                          //       value: 'Green',
                          //     },
                          //     {
                          //       text: 'Black',
                          //       value: 'Black',
                          //     },
                          //   ],
                          // },
                        ],
                        // specify the condition of filtering result
                        // here is that finding the name started with `value`
                        onFilter: (value, record) => record.operator ? record.operator.indexOf(value) === 0 : false,
          },
          {
              title: 'Remark',
              dataIndex: 'remark',
              key: 'Remark',
          },
          {
              title: '',
              key: 'action',
              render: (text, record) => (

                             <Dropdown overlay={
                                                     (
                                                          <Menu>
                                                                <Menu.Item>
                                                              <a rel="noopener noreferrer" style={{color:'#1890ff'}} onClick={this.gotoEditPaymentRecord.bind(this,record)}>
                                                                Edit
                                                              </a>
                                                                </Menu.Item>

                                                              {/*<Menu.Item>*/}
                                                              {/*<a  rel="noopener noreferrer" style={{color:'#1890ff'}} onClick={this.lookDetailReceipt.bind(this,record.id)}>*/}
                                                                {/*Details*/}
                                                              {/*</a>*/}
                                                            {/*</Menu.Item>*/}

                                                              <Menu.Item>
                                                              <a  rel="noopener noreferrer" style={{color:'#1890ff'}} onClick={(e)=>this.deleteLevel(record.id,e)}>
                                                                Delete
                                                              </a>
                                                            </Menu.Item>
                                                          </Menu>
                                                        )
                                                }
                             >
                                <a className="ant-dropdown-link"  style={{fontWeight: '600'}}>
                                    <Icon type="ellipsis" style={{ fontSize: '30px' }} />
                                </a>
                             </Dropdown>
              ),
          }];

//       const data = [
// {
//     key: '1',
//     Date: '02/12/2019',
//     Type: 'course fee',
//     Student: 'John Brown',
//     Paid:'100$',
//     Payment_type:'paypal',
//     Add_by:'system',
//     Remark:'New York No. 1 Lake Park',
//
//   },
// {
//     key: '2',
//     Date: '02/12/2019',
//     Type: 'course fee',
//     Student: 'John Brown',
//     Paid:'200$',
//     Payment_type:'paypal',
//     Add_by:'system',
//     Remark:'New York No. 1 Lake Park',
//
//   },
// {
//     key: '3',
//     Date: '02/12/2019',
//     Type: 'course fee',
//     Student: 'John Brown',
//     Paid:'300$',
//     Payment_type:'paypal',
//     Add_by:'system',
//     Remark:'New York No. 1 Lake Park',
//
//   },
// {
//     key: '4',
//     Date: '02/12/2019',
//     Type: 'course fee',
//     Student: 'John Brown',
//     Paid:'400$',
//     Payment_type:'paypal',
//     Add_by:'system',
//     Remark:'New York No. 1 Lake Park',
//
//   },
// {
//     key: '5',
//     Date: '02/12/2019',
//     Type: 'course fee',
//     Student: 'John Brown',
//     Paid:'500$',
//     Payment_type:'paypal',
//     Add_by:'system',
//     Remark:'New York No. 1 Lake Park',
//
//   },
// {
//     key: '6',
//     Date: '02/12/2019',
//     Type: 'course fee',
//     Student: 'John Brown',
//     Paid:'600$',
//     Payment_type:'paypal',
//     Add_by:'system',
//     Remark:'New York No. 1 Lake Park',
//
//   },
//       ];


      const formItemLayout = {
            labelCol: {
              xs: { span: 12 },
              sm: { span: 12 },
              md: { span: 12 },
              lg: { span: 8 }
            },
            wrapperCol: {
              xs: { span: 12 },
              sm: { span: 12 },
              md: { span: 12 },
              lg: { span: 16 }
            }
          };

    // console.log('this.state.isEditReceipt:',this.state.isEditReceipt);

    return (
        <div>

            <div className='showTable'><br />
                <Button onClick={()=>this.addNewPayment("payment")}  type="primary" style={{position:'relative',left:'25px'}}>
                  Add transaction
                </Button>
                {/*defaultValue={moment(cur_time,'YM')}*/}
                <div style={{margin:'15px 25px',}}>
                    <MonthPicker
                        size={'default'}
                        placeholder={en_currentMounth}
                        onChange={this.date_onChange.bind(this)}
                    />

                    {/*<Search*/}
                          {/*placeholder=""*/}
                          {/*onSearch={value => console.log(value)}*/}
                          {/*style={{ width: 200 ,margin:'0px 0px 0px 15px',}}*/}

                    {/*/>*/}

                </div>



                <Table className='Level'
                   columns={columns}
                   // dataSource={this.state.paymentList}
                    dataSource={this.state.paymentList}
                   pagination={{ pageSize: 10 }}
                       style={{margin:'0px 20px',}}
                   >
                </Table>
            </div>


            {/*增加paymrnt*/}
              <Modal title = "Add transaction"
                   visible = {this.state.addNewPaymentModalVisible}
                   onCancel = {e=>this.handleCancel(e)}
                   onOk = {e=>this.handleAddNew()}
                   okText={'Save'}
                   centered
                   destroyOnClose={true}

            >

                <FormItem {...formItemLayout} style={{textAlign:'left'}} label="Category">
                          {
                              getFieldDecorator('Category', {
                                                rules: [
                                                  {},
                                                  {
                                                    required: true,
                                                    message: 'Please select your Category!',
                                                  },
                                                ],
                                              })
                              (

                                 <Radio.Group onChange={this.category_onChange.bind(this)} >
                                        <Radio value="0">income</Radio>
                                        <Radio value="1">expenses</Radio>
                                 </Radio.Group>

                              )
                          }
                </FormItem>

                <FormItem {...formItemLayout} style={{textAlign:'left'}} label="Type">
                          {

                           (
                                 <Select
                                     onChange={this.type_onChange.bind(this)}
                                        showSearch
                                        style={{ width: 200 }}
                                        placeholder=""
                                        optionFilterProp="children"
                                        // onChange={type_onChange}
                                        filterOption={(input, option) =>
                                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                      >
                                        <Option value="0">tuition</Option>
                                        <Option value="1">Other fee</Option>
                                        <Option value="2">Late fee</Option>
                                        <Option value="3">Added fee</Option>
                                 </Select>
                           )
                          }
                </FormItem>

                <FormItem {...formItemLayout} style={{textAlign:'left'}} label="Amount">
                          {

                              getFieldDecorator('Amount', {
                                                rules: [
                                                  {
                                                    pattern: new RegExp(/^[1-9]\d*$/, "g"),
                                                    message: 'Only numbers can be entered!',
                                                  },
                                                  {
                                                    required: true,
                                                    message: 'Please input your Amount!',
                                                  },
                                                ],
                                              })

                              (
                                  <Input
                                      onChange={this.paid_onChange.bind(this)}
                                   prefix=""
                                   suffix={
                                       <Tooltip title="Extra information">
                                           {/*<Icon type="info-circle" style={{color: 'rgba(0,0,0,.45)'}}/>*/}
                                           $
                                       </Tooltip>
                                   }
                                   style={{width: "200px" }} />
                              )
                          }
                </FormItem>


                <FormItem {...formItemLayout} style={{textAlign:'left'}} label="Payer">
                          {

                           (
                                 <Select
                                        onChange={this.stu_onChange.bind(this)}
                                        showSearch
                                        style={{ width: 200 }}
                                        optionFilterProp="children"
                                        showArrow={false}
                                        // filterOption={(input, option) => option.props.children.indexOf(input) >= 0}
                                      >

                                      { stuList.map( (item, index) => <Option value={item.id} key={item.id}>{item.name}</Option> ) }

                                 </Select>
                           )
                          }
                </FormItem>

                <FormItem {...formItemLayout} style={{textAlign:'left'}} label="Payment method">
                          {
                           (
                                    <Select
                                        onChange={this.paymentMethod_onChange.bind(this)}
                                        showSearch
                                        style={{ width: 200 }}
                                        placeholder=""
                                        optionFilterProp="children"
                                        // filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                      >

                                        <Option value="0">Bank Transfer</Option>
                                        <Option value="1">Paypal</Option>
                                        <Option value="2">Cheque/Cash</Option>
                                        <Option value="3">Braintree Credit Card</Option>
                                        <Option value="4">Stripe</Option>
                                        <Option value="5">eNETS</Option>
                                 </Select>
                           )
                          }
                </FormItem>

                {/*<FormItem {...formItemLayout} style={{textAlign:'left'}} label="Course">*/}
                          {/*{*/}
                           {/*(*/}
                                    {/*<Select*/}
                                        {/*onChange={this.course_onChange.bind(this)}*/}
                                        {/*showSearch*/}
                                        {/*style={{ width: 200 }}*/}
                                        {/*placeholder=""*/}
                                        {/*optionFilterProp="children"*/}
                                        {/*// onChange={type_onChange}*/}
                                        {/*filterOption={(input, option) =>*/}
                                          {/*option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0*/}
                                        {/*}*/}
                                      {/*>*/}
                                        {/*/!*<Option value="jack">Jack</Option>*!/*/}
                                        {/*/!*<Option value="lucy">Lucy</Option>*!/*/}
                                        {/*/!*<Option value="tom">Tom</Option>*!/*/}
                                        {/*<Option value="1">1</Option>*/}
                                        {/*<Option value="2">2</Option>*/}
                                        {/*<Option value="3">3</Option>*/}
                                 {/*</Select>*/}
                           {/*)*/}
                          {/*}*/}
                {/*</FormItem>*/}

                <FormItem {...formItemLayout} style={{textAlign:'left'}} label="Remark">
                          {
                           (<TextArea onChange={this.remark_onChange.bind(this)} style={{width: "200px" }}  />)
                          }
                </FormItem>
            </Modal>




            {/*/!*修改*!/*/}
            {/*<Modal title = "Update Level"*/}
                    {/*visible = {this.state.updLevelModalVisible}*/}
                    {/*onCancel = {e=>this.handleCancel(e,"")}*/}
                    {/*onOk = {e=>this.handleupdLevel(e)}*/}
                   {/*okText={'Save'}*/}
                   {/*centered*/}

            {/*>*/}
                        {/*<FormItem {...formItemLayout} style={{textAlign:'left'}} label="Level：">*/}
                          {/*{(<Input onChange={this.updateInputChange.bind(this)} style={{width: "200px" }}  />)}*/}
                          {/*</FormItem>*/}

                 {/*/!*<FormItem {...formItemLayout} label="Classroom">*!/*/}
                    {/*/!*<Input value={this.state.classroom['title']} style={{width:"200px"}} onChange={(event)=>this.updateInputChange(event)}/>*!/*/}
                {/*/!*</FormItem>*!/*/}
            {/*</Modal>*/}


        </div>
    )
  }
}

//mapStateToProps（state, ownProps）
const mapStateToProps = (state) => {
    console.log('mapStateToProps:',state);
	return {
        // videoSource:state.course.lessonsData && state.course.lessonsData.results ? state.course.lessonsData.results :[],
	};
};

//用于建立组件跟store.dispatch的映射关系,可以是一个object，也可以传入函数
//如果mapDispatchToProps是一个函数，它可以传入dispatch,ownProps, 定义UI组件如何发出action，实际上就是要调用dispatch这个方法
// const mapDispatchToProps = (dispatch) => {
// 	return {dispatch, actions: bindActionCreators(actionCreators, dispatch)};
// };

const addform = Form.create()(Receipt)
export default withRouter( connect(mapStateToProps)( addform ) );
// export default connect(mapStateToProps)(Level);
export {addform};
