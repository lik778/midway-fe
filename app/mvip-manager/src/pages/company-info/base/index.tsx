import React, { useEffect, useState } from 'react';
import { Steps, Button, Row, Col } from 'antd';
import { connect } from 'dva';
import { cloneDeepWith } from 'lodash';
import { baseInfoForm } from './config';
import WildcatForm from '@/components/wildcat-form';
import Loading from '@/components/loading';
import MainTitle from '@/components/main-title';
import ContactForm from './components/contact-form';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { saveEnterpriseForShopApi } from '@/api/user'
import { UserEnterpriseInfo } from '@/interfaces/user';
import { errorMessage, successMessage } from '@/components/message';
import { companyInfoStateToProps, USER_NAMESPACE, GET_COMPANY_INFO_ACTION, SET_COMPANY_INFO_ACTION } from '@/models/user';
import './index.less';
import { getThirdCategoryMetas } from '@/api/user';


const { Step } = Steps;

function CompanyInfoBase (props: any) {
  const { companyInfo } = props
  const [enterpriseInfo, setEnterpriseInfo] = useState<UserEnterpriseInfo | null>(null)
  const [currentStep, setCurrentStep] = React.useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [formLoading, setFormLoading] = React.useState<boolean>(false);
  const [hasEditForm, setHasEditFofrm] = React.useState<boolean>(false);
  const [config, setConfig] = useState<FormConfig>(cloneDeepWith(baseInfoForm));
  const steps = [ '基础信息', '联系方式']



  useEffect(() => {
    props.dispatch({ type: `${USER_NAMESPACE}/${GET_COMPANY_INFO_ACTION}` })
  },[])

//获取三级类目meta
  const getThirdCategoryMetasFn = async (catogoryName: any) =>{
    console.log("catogoryName:",catogoryName)
    const res = await getThirdCategoryMetas(catogoryName);
    console.log(33)
    if (res?.success) {
      console.log(res.data)
    }
  }

  //wildcat-form公共组件搞不定的交互，这里去处理config
  const initComponent = async()=>{
    console.log("companyInfo:",companyInfo)
    if (!companyInfo) return
    const newChildren = config.children.map(item=>{
      if(item.name === 'secondCategories'){
        item.defaultValue = companyInfo.selectedSecondCategory
        item.onChange = getThirdCategoryMetasFn
        const {secondCategories} = companyInfo
        const optionlist = Object.keys(secondCategories).map(k =>({key:k,value:secondCategories[k]}))
        item.options = optionlist
      }
      return item
    })
    console.log(11)
  setConfig({...config,children:newChildren})
  console.log({...config,children:newChildren})
 }

  //useEffect( ()=>{
  //  initComponent()
  //},[companyInfo])

  const AAAOnChange=()=>{
    //...
  }
  useEffect(() => {
    initComponent()
    if (companyInfo) {
      setEnterpriseInfo(companyInfo)
      setFormLoading(false)
      const { companyNameLock } = companyInfo
      if (companyNameLock) {
        const  companyFiled: any = config.children.find((x: any) => x.name === 'companyName')
        companyFiled.disabled = true
        setConfig({...config})
      }
    } else {
      setFormLoading(true)
    }
  }, [ companyInfo ])

  const next = () => {
    setHasEditFofrm(false)
    setCurrentStep(currentStep + 1)
  }

  const nextStep = async (values: any) => {
    if (!hasEditForm) {
      next(); return
    }
    if (!Array.isArray(values.area)) {
      values.area = Object.keys(values.area).map(k => k)
    }
    setLoading(true)
    //保存企业资料
    console.log("企业资料入参values：",values)
    const { success, message, data } = await saveEnterpriseForShopApi(values)
    setLoading(false)
    if (success) {
      successMessage('修改基础资料成功')
      props.dispatch({ type: `${USER_NAMESPACE}/${SET_COMPANY_INFO_ACTION}`, payload: data })
      next()
    } else {
      errorMessage(message || '出错啦')
    }
  }

  return (
    <div>
      <MainTitle title="基础资料"/>
      <Steps current={currentStep} className="step-container">
        {steps.map(name => (
          <Step key={name} title={name} />
        ))}
      </Steps>
      <div className="container">
        { formLoading && <Loading />}

        { !formLoading && currentStep == 0 &&
          <WildcatForm
           formChange={() => setHasEditFofrm(true)}
           useLabelCol={true} submit={nextStep}
           editDataSource={enterpriseInfo} config={config} loading={loading}
            submitBtn={
              <Row className="save-base-info-box">
                <Col span={3}></Col>
                <Col><Button loading={loading} className="btn"
                      type="primary" size="large" htmlType="submit">保存并下一步</Button></Col>
              </Row>
            }/>
        }
        { !formLoading && currentStep == 1 &&
        <ContactForm {...props} back={() => setCurrentStep(currentStep - 1)} />}
      </div>
    </div>
  );
}

export default connect(companyInfoStateToProps)(CompanyInfoBase)
