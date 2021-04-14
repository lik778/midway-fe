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
import { ThirdMetas, SaveEnterpriseForShopParams } from '@/interfaces/user';
import { errorMessage, successMessage } from '@/components/message';
import { userMapStateToProps, userMapDispatchToProps } from '@/models/user';
import './index.less';
import { getThirdCategoryMetas } from '@/api/user';
import { objToTargetObj } from '@/utils';


const { Step } = Steps;

function CompanyInfoBase(props: any) {
  const { companyInfo, setCompanyInfo } = props
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
      setThirdMetas(metas)
    }
  }

  const onChangeCategory = (catogoryName: any, form: any) => {
    //切换类目后，清空thirdMetas数据
    form.setFieldsValue({ thirdMetas: []})
    getThirdCategoryMetasFn(catogoryName)

  }

  //wildcat-form公共组件搞不定的交互，这里去处理config
  const initComponent = async () => {
    if (!companyInfo) {
      setFormLoading(true)
      return
    }
    const { area, companyAddress, companyAlias, companyDescription, companyName, companyYears, employeeCount, promoteImg, selectedSecondCategory, thirdMetas, selectedThirdMetas } = companyInfo
    //由于接口返回字段和表单字段不一致，所以要字段转换
    setEnterpriseInfo({
      //...companyInfo,
      area,
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
      //备注：getThirdCategoryMetasFn里获得thirdMetas后，会effect触发执行updateConfigData,故return掉，防止重复更新
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
        //只要thirdMetas数据，则显示
        item.display = !!(thirdMetas && thirdMetas.length > 0)
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

    // 一级类目
    values.firstCategory = companyInfo?.firstCategory && Object.keys(companyInfo?.firstCategory).length > 0 ? Object.keys(companyInfo?.firstCategory)[0] : ''
    const { success, message, data } = await saveEnterpriseForShopApi(values)
    setLoading(false)
    if (success) {
      successMessage('修改基础资料成功')
      setCompanyInfo(data)
      next()
    } else {
      errorMessage(message || '出错啦')
    }
  }
  const formChangeFn = (value: any, values: any) => {
    setHasEditFofrm(true)
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

const WrapperCompanyInfoBase: any = connect(userMapStateToProps, userMapDispatchToProps)(CompanyInfoBase)

WrapperCompanyInfoBase.wrappers = ['@/wrappers/path-auth']

export default WrapperCompanyInfoBase
