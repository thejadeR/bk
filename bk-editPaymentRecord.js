import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../../../actions/staff';
import * as actions from '../../../../actions/organization';
import { Spin,Breadcrumb,Icon,Row,Col,Form,Input,Button,Radio,DatePicker,message,Upload,Select,Checkbox,Tooltip,InputNumber } from 'antd';
import Cookies from 'js-cookie';
import { bindActionCreators } from 'redux';
import {editPaymentById, getPayment, postPayment} from "../../../../utils/requrl";
import moment from 'moment';

const BreadcrumbItem = Breadcrumb.Item;
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;


class EditPaymentRecord extends Component {

    constructor(props) {
        super(props);

        this.state = {
            addingpaymentList:{
                "category": "",
                "fee_type": '',
                "payer": '',
                "amount": '',
                "payment_method": '',
                // "course": '',
                "operator": "",
                "remark": ""
            },
            record:{},
            // default_category: 0,
            // default_fee_type: 0,
            // default_amount: 100,
            // default_payer: 1,
            // default_payment_method: 0,
            // default_operator: "menhu",
            // default_remark: "1234"
                    };


      }

    componentWillMount(){
        console.log('monting...');
        if(this.props.location.hasOwnProperty('query') )
        {
            console.log('yes ,i have query props');
            const  the_record = this.props.location.query.record;
            console.log('the_record:',the_record);
            this.setState({record: the_record});

        }


        // const  payerName = this.props.location.query.record.payer.name ;
        // const  payerId = this.props.location.query.record.payer.id ;
        //
        // const  typeTitle = this.props.location.query.record.fee_type.title ;
        // const  typeId = this.props.location.query.record.fee_type.id ;
        //
        // const  courseTitle = this.props.location.query.record.course.title ;
        // const  courseId = this.props.location.query.record.course.id ;
        //
        // const theDate = this.props.location.query.record.date ;
        // const amount = this.props.location.query.record.amount;
        //
        // const payment_method = this.props.location.query.record.payment_method.title;
        // const payment_id = this.props.location.query.record.payment_method.id;
        //
        // const  operator = this.props.location.query.record.operator ;
        // const  remark = this.props.location.query.record.remark ;
        //
        // console.log('payer-name:',payerName);
        // console.log('payer-id:',payerId);
        // console.log('type-title:',typeTitle);
        // console.log('type-id:',typeId);
        // console.log('courseTitle:',courseTitle);
        // console.log('course-id:',courseId);
        // console.log('date:',theDate);
        // console.log('amount:',amount);
        // console.log('payment_method-title:',payment_method);
        // console.log('payment_method-id:',payment_id);
        // console.log('operator:',operator);
        // console.log('remark:',remark);
        //
        // let {addingpaymentList} = this.state;
        //
        // this.setState({addingpaymentList: {...addingpaymentList, payer: payerId}});
        // this.setState({addingpaymentList: {...addingpaymentList, date: theDate}});
        // this.setState({addingpaymentList: {...addingpaymentList, fee_type: typeId}});
        // this.setState({addingpaymentList: {...addingpaymentList, amount: amount}});
        // this.setState({addingpaymentList: {...addingpaymentList, payment_method: payment_id}});
        // this.setState({addingpaymentList: {...addingpaymentList, course: courseId}});
        // this.setState({addingpaymentList: {...addingpaymentList, remark: courseId}});
        // this.setState({addingpaymentList: {...addingpaymentList, operator: courseId}});
    }

    async componentDidMount(){
        if(this.props.location.hasOwnProperty('query') ){
            console.log('yes ,i have query props');
        }
        else {
            this.goBack()
        }
        console.log('didmounting...');

    }

    componentWillUpdate(nextProps) {

      }


    //编辑
    // async handleupdPayment(e){
    //       let {Payment} = this.state;
    //       const token = Cookies.get('qal-auth-token');
    //
    //         const  paymentId = this.props.location.query.record.id ;
    //         const categoryId = this.props.location.query.record.category.id ;
    //       await editPaymentById(token, Payment,paymentId,categoryId );
    //       this.setState({
    //           Payment : {}
    //       });
    //
    //       this.getPayment();
    //       this.handleCancel();
    //   }


      handleCancel = (e,type) => {
          this.props.history.go(-1)
      };

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
      console.log('state-paymentList:',this.state.paymentList);
    }


    goBack(){this.props.history.push("/main/manage/Finance/PaymentRecord")}

  amount_onChange(e){

      console.log('amount:',e.target.value);
      console.log('amount:',typeof(e.target.value));

      const reg=/^\d+(\.\d+)?$/; //判断字符串是否为非负浮点数字 ，
        //由于每次输入一个字符都会调用，所以开始输入正确，则符合正则，后面输错就不行了
      if(reg.test(e.target.value)){

          console.log('匹配到浮点数');
          let {addingpaymentList} = this.state;

          this.setState({addingpaymentList: {...addingpaymentList, amount: parseFloat(e.target.value)}});
          // this.setState(  preState => ({ addingpaymentList: {...preState.addingpaymentList, amount: `${e}`}  })  );

          console.log('[pre-addingpaymentList]',addingpaymentList);
          console.log('[pre-addingpaymentList.amount]',addingpaymentList.amount);

      }else{
          //否则不是数字，应该设置成空的值
          let {addingpaymentList} = this.state;
          this.setState({addingpaymentList: {...addingpaymentList, amount: ''}});
          // this.setState(  preState => ({ addingpaymentList: {...preState.addingpaymentList, amount: `${e}`}  })  );

          console.log('[pre-addingpaymentList]',addingpaymentList);
          console.log('[pre-addingpaymentList.amount]',addingpaymentList.amount);
      }


  }

  type_onChange(e){

      console.log('fee_type:',`${e}`);
      console.log('fee_type:',typeof(`${e}`));
      let {addingpaymentList} = this.state;

      this.setState({addingpaymentList: {...addingpaymentList, fee_type: `${e}`}});
      // this.setState(  preState => ({ addingpaymentList: {...preState.addingpaymentList, fee_type: `${e}`}  })  );


      console.log('[pre-addingpaymentList]',addingpaymentList);
      console.log('[pre-addingpaymentList.fee_type]',addingpaymentList.fee_type);
  }


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

  handleEditPayment(){
      this.EditPayment();

      // this.resetData();
  }

    //Edit Payment
   async EditPayment(){
        const editData = {};
        //         console.log('updating...');
        const  payerName = this.props.location.query.record.payer.name ;
        const  payerId = this.props.location.query.record.payer.id ;

        const  typeTitle = this.props.location.query.record.fee_type.title ;
        const  typeId = this.props.location.query.record.fee_type.id ;

        const  courseTitle = this.props.location.query.record.course.title ;
        const  courseId = this.props.location.query.record.course.id ;

        const theDate = this.props.location.query.record.date ;
        const amount = this.props.location.query.record.amount;

        const payment_method = this.props.location.query.record.payment_method.title;
        const payment_id = this.props.location.query.record.payment_method.id;

        const  operator = this.props.location.query.record.operator ;
        const  remark = this.props.location.query.record.remark ;
        //
        // console.log('payer-name:',payerName);
        // console.log('payer-id:',payerId);
        // console.log('type-title:',typeTitle);
        // console.log('type-id:',typeId);
        // console.log('courseTitle:',courseTitle);
        // console.log('course-id:',courseId);
        // console.log('date:',theDate);
        // console.log('amount:',amount);
        // console.log('payment_method-title:',payment_method);
        // console.log('payment_method-id:',payment_id);
        // console.log('operator:',operator);
        // console.log('remark:',remark);
        //
        // let {addingpaymentList} = this.state;
        //
        // this.setState({addingpaymentList: {...addingpaymentList, payer: payerId}});
        // this.setState({addingpaymentList: {...addingpaymentList, date: theDate}});
        // this.setState({addingpaymentList: {...addingpaymentList, fee_type: typeId}});
        // this.setState({addingpaymentList: {...addingpaymentList, amount: amount}});
        // this.setState({addingpaymentList: {...addingpaymentList, payment_method: payment_id}});
        // this.setState({addingpaymentList: {...addingpaymentList, course: courseId}});
        // this.setState({addingpaymentList: {...addingpaymentList, remark: remark}});
        // this.setState({addingpaymentList: {...addingpaymentList, operator: courseId}});
        //
        // console.log('addingpaymentList:',this.state.addingpaymentList);

      console.log('Edit payment');
      let {addingpaymentList,record} = this.state;
      console.log('addingpaymentList',addingpaymentList);
      console.log('addingpaymentList-type:',typeof(addingpaymentList));
      console.log('addingpaymentList-feytype:',addingpaymentList.fee_type);
      const flag = !addingpaymentList.fee_type && !addingpaymentList.payer && !addingpaymentList.amount && !addingpaymentList.payment_method && !addingpaymentList.amount && !addingpaymentList.remark && !addingpaymentList.operator;
      //
       console.log('eeee:',!addingpaymentList.payer);
       console.log('flag:',flag);
      //
       if(flag){
           this.handleCancel();
       }
       else {
           // if(!addingpaymentList.payer){this.setState({addingpaymentList: {...addingpaymentList, payer: payerId}})}
           // if(!addingpaymentList.date){this.setState({addingpaymentList: {...addingpaymentList, date: theDate}})}
           // if(!addingpaymentList.fee_type){this.setState({addingpaymentList: {...addingpaymentList, fee_type: typeId}})}
           // if(!addingpaymentList.payment_method){this.setState({addingpaymentList: {...addingpaymentList, payment_method: payment_id}})}
           // if(!addingpaymentList.course){this.setState({addingpaymentList: {...addingpaymentList, course: courseId}})}
           // if(!addingpaymentList.amount){this.setState({addingpaymentList: {...addingpaymentList, amount: amount}})}
           // if(!addingpaymentList.remark){this.setState({addingpaymentList: {...addingpaymentList, remark: remark}})}
           // if(!addingpaymentList.operator){this.setState({addingpaymentList: {...addingpaymentList, operator: operator}})}

           if(!addingpaymentList.payer){editData.payer=payerId}else {editData.payer=addingpaymentList.payer}
           // if(!addingpaymentList.date){this.setState({addingpaymentList: {...addingpaymentList, date: theDate}})}
           if(!addingpaymentList.fee_type){editData.fee_type=typeId}else {editData.fee_type=addingpaymentList.fee_type}
           if(!addingpaymentList.payment_method){editData.payment_method=payment_id}else {editData.payment_method=addingpaymentList.payment_method}
           // if(!addingpaymentList.course){editData.course=courseId}
           if(!addingpaymentList.amount){editData.amount=amount}else {editData.amount=addingpaymentList.amount}
           if(!addingpaymentList.remark){editData.remark=remark}else {editData.remark=addingpaymentList.remark}
           if(!addingpaymentList.operator){editData.operator=operator}

          // for(let i in addingpaymentList){
          //
          //     console.log('v:',addingpaymentList[i]);
          //     console.log('i:',i);
          //
          // }


          const token = Cookies.get('qal-auth-token');
          const  paymentId = record.id ;


          console.log('add payment-token:',token);
          console.log('add payment-editData:',editData);
          console.log('add payment-paymentId:',paymentId);


          try {
              await editPaymentById(token,editData,paymentId);
              this.setState({addingpaymentList : {}});
          }catch (e){

          }
          finally {
              this.getPayment();
              this.handleCancel();
          }


           }

    }



    resetData(){
      this.setState({
            addingpaymentList:{
                "date": "2019-09-09",
                "fee_type": 1,
                "payer": 1,
                "amount": 100,
                "payment_method": 1,
                // "course": 1,
                "operator": "luoyu",
                "remark": ""
            },
            record:{},
      })
  }





    render() {
        console.log('render edit receipt');

        if(this.props.location.hasOwnProperty('query') ){
                console.log('yes ,i have query props')
        }
        else
        {
         console.log('idont have query');
            return (<div>error</div>)
        }
        // try{
        //     console.log('this.props.location.query.record:',this.props.location.query.record);
        // }
        // catch (e){
        //     this.goBack();
        //     return <h1>error</h1>
        // }
        // finally {}
        //
        // const  payerName = this.props.location.query.record.payer.name ;
        // const  typeTitle = this.props.location.query.record.fee_type.title ;
        // const  courseTitle = this.props.location.query.record.course.title ;
        // const theDate = this.props.location.query.record.date ;
        // const amount = this.props.location.query.record.amount;
        // const payment_method = this.props.location.query.record.payment_method.title;
        // const  remark = this.props.location.query.record.remark ;
        //
        // console.log('payer:',payerName);
        // console.log('type:',typeTitle);
        // console.log('courseTitle:',courseTitle);
        // console.log('date:',theDate);
        // console.log('amount:',amount);
        // console.log('payment_method:',payment_method);
        // console.log('remark:',remark);


        const {record} = this.state;
        const { getFieldDecorator } = this.props.form;
        // console.log('render-addingpaymentList:',addingpaymentList);
        console.log('record:',record);
        const formItemLayout = {

            labelCol: {
				xs: { span: 24 },
				sm: { span: 8 },
				md: { span: 6 },
				lg: { span: 3 }
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 },
				md: { span: 12 },
				lg: { span: 6},
			},

          };

        const tailFormItemLayout = {
            labelCol: {
                        xs: { span: 8 },
                        sm: { span: 8 },
                        md: { span: 6 },
                        lg: { span: 7 }
                        },

            wrapperCol: {
				xs: {
					span: 24,
					offset: 0,
				},
				sm: {
					span: 16,
					offset: 8,
				},
			},
		};


        return (
            <Spin spinning={this.props.loading}>
                <div className='breadcrumb1'style={{ height: '33px',}}>
                    <p onClick={()=>this.props.history.go(-1)} style={{cursor:'pointer',margin:'10px 0' }}> <Icon type="left" />  Edit receipt</p>
                </div>

                <div className='edit payment' style={{ margin: '0px',}}>
                    <Form style={{ backgroundColor: 'white',}}>

                            <FormItem{...formItemLayout} label="Category" style={{textAlign:'left'}}>
                                    {
                                            record.category.title
                                    }
                            </FormItem>

                            {/*<FormItem*/}
                                {/*{...formItemLayout}*/}
                                    {/*label="Type:"style={{textAlign:'left'}}*/}
                                {/*>*/}
                                    {/*{*/}

                                            {/*record.fee_type.title*/}

                                    {/*}*/}
                            {/*</FormItem>*/}

                            <FormItem {...formItemLayout} style={{textAlign:'left'}} label="Type">
                                      {

                                       (
                                             <Select
                                                    onChange={this.type_onChange.bind(this)}
                                                    showSearch
                                                    style={{ width: 200 }}
                                                    placeholder={record.fee_type.title}
                                                    optionFilterProp="children"
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


                                  {/*<FormItem*/}
                                {/*{...formItemLayout}*/}
                                    {/*label="Course:"*/}
                                    {/*style={{textAlign:'left'}}*/}

                                {/*>*/}
                                    {/*{*/}
                                            {/*record.course.title*/}
                                    {/*}*/}
                            {/*</FormItem>*/}

                            {/*<FormItem*/}
                                {/*{...formItemLayout}*/}
                                {/*style={{textAlign:'left'}}*/}
                                    {/*label="Date:"*/}
                                {/*>*/}
                                    {/*{   (*/}
                                        {/*<DatePicker style={{width:'100%'}} defaultValue={moment(record.date, 'YYYY-MM-DD')} />*/}
                                        {/*)*/}
                                    {/*}*/}
                            {/*</FormItem>*/}



                            <FormItem{...formItemLayout} label="Amount" >
                                {

                                    getFieldDecorator('Amount', {
                                                rules: [
                                                  {
                                                    pattern: new RegExp(/^[1-9]\d*$/, "g"),
                                                    message: 'Only numbers can be entered!',
                                                  },
                                                ],
                                              })

                                    (
                                        record.fee_type.title !=  "added fee" ? <div>{record.amount + '$'}</div>
                                        :
                                        (
                                             <Input
                                                    placeholder={record.amount}
                                                    onChange={this.amount_onChange.bind(this)}
                                                    prefix=""
                                                    suffix={
                                                            <Tooltip title="Extra information">
                                                            {/*<Icon type="info-circle" style={{color: 'rgba(0,0,0,.45)'}}/>*/}
                                                            $
                                                            </Tooltip>
                                                    }
                                                    style={{width: "200px" }} />
                                        )
                                    )
                                }

                            </FormItem>



                            <FormItem{...formItemLayout} label="Payer" style={{textAlign:'left'}}>
                                    {
                                            record.payer.name
                                    }
                            </FormItem>


                            <FormItem{...formItemLayout} label="Payment method" style={{textAlign:'left'}}>
                                        {
                                            (
                                                <Select
                                                    onChange={this.paymentMethod_onChange.bind(this)}
                                                    showSearch
                                                    style={{ width: 200 }}
                                                    placeholder={record.payment_method.title}
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


                            <FormItem{...formItemLayout} label="Remark">
                                {
                                    (
                                    <TextArea
                                        // value={remark}
                                        onChange={this.remark_onChange.bind(this)}
                                        autosize={{ minRows: 3, maxRows: 5 }}
                                    />
                                    )
                                }
                            </FormItem>

                            <FormItem {...tailFormItemLayout}>
                                <Button style={{  marginRight: "15px" }} onClick={() => this.goBack()}>Back</Button>
                                <Button
                                    loading={this.state.loading}
                                    type="primary"
                                    // htmlType="submit"
                                    onClick={e=>this.handleEditPayment()}
                                >Save</Button>

					        </FormItem>

                    </Form>

                    {/*<Button onClick={this.pushStaff} type="primary">Save</Button>*/}
                </div>
            </Spin>

        );
    }
}


const mapStateToProps = (state) => {
      return {
        StudentData:state.organization&&state.organization.branch?state.organization.branch.results:[],
        TypeData:state.staff&&state.staff.TypeData?state.staff.TypeData.results:[],
        CourseData:state.staff&&state.staff.CourseData?state.staff.CourseData.results:[],
        loading: state.staff.loading,
        //   organization:state.aboutSchool.organization&&state.aboutSchool.organization.results.length?state.aboutSchool.organization.results:[]
      };
    };

const mapDispatchToProps = (dispatch) => {
    return {
        actionCreators: bindActionCreators(actionCreators, dispatch),
        actions: bindActionCreators(actions, dispatch),
    };
};

const EditPaymentRecordForm = Form.create()(EditPaymentRecord);
export default connect(mapStateToProps, mapDispatchToProps)(EditPaymentRecordForm);
export { EditPaymentRecordForm };