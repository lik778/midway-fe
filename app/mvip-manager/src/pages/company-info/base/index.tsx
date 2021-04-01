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
import { UserEnterpriseInfo, ThirdMetas, SaveEnterpriseForShopParams } from '@/interfaces/user';
import { errorMessage, successMessage } from '@/components/message';
import { USER_NAMESPACE, GET_COMPANY_INFO_ACTION, SET_COMPANY_INFO_ACTION } from '@/models/user';
import './index.less';
import { getThirdCategoryMetas } from '@/api/user';
import { objToTargetObj } from '@/utils';
import { ConnectState } from '@/models/connect';


const { Step } = Steps;

function CompanyInfoBase(props: { companyInfo: UserEnterpriseInfo | null, dispatch: any }) {
  const { companyInfo } = props
  const [enterpriseInfo, setEnterpriseInfo] = useState<SaveEnterpriseForShopParams | null>(null)
  const [currentStep, setCurrentStep] = React.useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [formLoading, setFormLoading] = React.useState<boolean>(false);
  const [hasEditForm, setHasEditFofrm] = React.useState<boolean>(false);
  const [config, setConfig] = useState<FormConfig>(cloneDeepWith(baseInfoForm));
  const steps = ['基础信息', '联系方式']
  const [thirdMetas, setThirdMetas] = useState<ThirdMetas[] | null>(null)

  //获取三级类目meta
  const getThirdCategoryMetasFn = async (catogoryName: any) => {
    const res = await getThirdCategoryMetas(catogoryName);
    if (res?.success) {
      const metas = objToTargetObj(res.data, "label")
      console.log("metas:", metas)
      setThirdMetas(metas)
    }
  }

  const onChangeCategory = (catogoryName: any, form: any) => {
    //切换类目后，清空thirdMetas数据
    form.setFieldsValue({ thirdMetas: [] })
    getThirdCategoryMetasFn(catogoryName)
  }

  //wildcat-form公共组件搞不定的交互，这里去处理config
  const initComponent = async () => {
    if (!companyInfo) {
      setFormLoading(true)
      return
    }
    const { companyAddress, companyAlias, companyDescription, companyName, companyYears, employeeCount, promoteImg, secondCategories, selectedSecondCategory, thirdMetas, selectedThirdMetas } = companyInfo
    //secondCategories的值是对象，要转换为select组件value定义的类型
    //const defaultCategory = objToTargetObj(selectedSecondCategory)

    setEnterpriseInfo({
      //...companyInfo,
      area: companyInfo.area,
      companyAddress,
      companyAlias,
      companyDescription,
      companyName,
      companyYears,
      employeeCount,
      promoteImg,
      secondCategory: selectedSecondCategory ? Object.keys(selectedSecondCategory)[0] : "",
      thirdMetas: selectedThirdMetas ? Object.keys(selectedThirdMetas) : []
    })
    setFormLoading(false)

    if (selectedSecondCategory && Object.keys(selectedSecondCategory).length > 0) {
      getThirdCategoryMetasFn(Object.keys(selectedSecondCategory)[0])
      return
      //备注：getThirdCategoryMetasFn里获得thirdMetas后，会触发执行updateConfigData
    }

    updateConfigData()
  }
  useEffect(() => {

    updateConfigData()
  }, [thirdMetas])


  const updateConfigData = () => {
    if (!companyInfo) {
      setFormLoading(true)
      return
    }
    const { companyNameLock, secondCategories, selectedSecondCategory } = companyInfo
    const newChildren = config.children.map(item => {
      //目的：禁止企业名称改写
      if (companyNameLock && item.name === 'companyName') {
        item.disabled = true
      }

      //修改config里类目选择组件的配置信息，并给select加了onChange
      if (item.name === 'secondCategory') {
        //item.defaultValue = defaultCategory
        item.onChange = onChangeCategory
        item.options = objToTargetObj(secondCategories)
      }

      //这里options没获取到值
      if (item.name === 'thirdMetas') {
        item.options = thirdMetas!
        //只要有类目，则显示thirdMetas数据
        selectedSecondCategory ? item.display = true : ""
      }
      return item
    })
    setConfig({ ...config, children: newChildren })
  }
  //会根据企业信息变更，重新渲染大表单
  useEffect(() => {
    initComponent()
  }, [companyInfo])


  const next = () => {
    setHasEditFofrm(false)
    setCurrentStep(currentStep + 1)
  }

  const nextStep = async (values: SaveEnterpriseForShopParams) => {
    if (!hasEditForm) {
      next(); return
    }

    //对地区进行处理
    if (!Array.isArray(values.area)) {
      values.area = Object.keys(values.area).map(k => k)
    }
    setLoading(true)


    //保存企业资料
    console.log("企业资料入参values：", values)
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
  const formChangeFn = (value: any, values: any) => {
    setHasEditFofrm(true)
    console.log("表单实时数据", values)
  }

  return (
    <div>
      <MainTitle title="基础资料" />
      <Steps current={currentStep} className="step-container">
        {steps.map(name => (
          <Step key={name} title={name} />
        ))}
      </Steps>
      <div className="container">
        {formLoading && <Loading />}
        {!formLoading && currentStep == 0 &&
          <WildcatForm
            formChange={formChangeFn}
            useLabelCol={true} submit={nextStep}
            editDataSource={enterpriseInfo} config={config} loading={loading}

            submitBtn={
              <Row className="save-base-info-box">
                <Col span={3}></Col>
                <Col><Button loading={loading} className="btn"
                  type="primary" size="large" htmlType="submit">保存并下一步</Button></Col>
              </Row>
            } />
        }
        {!formLoading && currentStep == 1 &&
          <ContactForm {...props} back={() => setCurrentStep(currentStep - 1)} />}
      </div>
    </div>
  );
}

const WrapperCompanyInfoBase: any = connect((state: ConnectState) => {
  return {
    companyInfo: state[USER_NAMESPACE].companyInfo,
  }
})(CompanyInfoBase)

WrapperCompanyInfoBase.wrappers = ['@/wrappers/path-auth']

export default WrapperCompanyInfoBase
