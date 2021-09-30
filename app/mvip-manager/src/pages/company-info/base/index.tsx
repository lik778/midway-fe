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
import { getImgUploadValueModel, getImgUploadModelValue } from '@/components/img-upload'
import { saveEnterpriseForShopApi } from '@/api/user'
import { InitEnterpriseForShopParams, MetasItem, SaveEnterpriseForShopParams, UserEnterpriseInfo, ShopMetas } from '@/interfaces/user';
import { errorMessage, successMessage } from '@/components/message';
import { userMapStateToProps, userMapDispatchToProps } from '@/models/user';
import { ConnectState } from '@/models/connect';
import { SHOP_NAMESPACE, shopMapDispatchToProps } from '@/models/shop';
import styles from './index.less';
import { ShopStatus } from '@/interfaces/shop';
import { objToTargetObj } from '@/utils';
import { track } from '@/api/common'
import { BXMAINSITE } from '@/constants/index'

const { Step } = Steps;

interface Props {
  companyInfo: UserEnterpriseInfo | null,
  setCompanyInfo: (data: UserEnterpriseInfo) => void,
  shopStatus: ShopStatus,
  getShopStatus: () => void
}

function CompanyInfoBase(props: Props) {
  const { companyInfo, setCompanyInfo, shopStatus, getShopStatus } = props
  const [enterpriseInfo, setEnterpriseInfo] = useState<InitEnterpriseForShopParams | null>(null)
  const [currentStep, setCurrentStep] = React.useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [formLoading, setFormLoading] = React.useState<boolean>(false);
  const [hasEditForm, setHasEditFofrm] = React.useState<boolean>(false);
  const [config, setConfig] = useState<FormConfig>(cloneDeepWith(baseInfoForm));
  const steps = ['基础信息', '联系方式']

  //wildcat-form公共组件搞不定的交互，这里去处理config
  const initComponent = async () => {
    if (!companyInfo) {
      setFormLoading(true)
      return
    }
    const { area, companyAddress, serviceArea, companyAlias, companyDescription, companyName, companyYears, employeeCount, promoteImg, selectedFirstCategory, selectedSecondCategory, selectedThirdMetas } = companyInfo

    // 做一手转化 转为组件需要的输入值 ShopMetas类型
    const metas: ShopMetas = [objToTargetObj(selectedFirstCategory)[0], objToTargetObj(selectedSecondCategory)[0], selectedThirdMetas ? Object.keys(selectedThirdMetas) : []]

    //由于接口返回字段和表单字段不一致，所以要字段转换
    setEnterpriseInfo({
      //...companyInfo,
      area,
      companyAddress,
      serviceArea,
      companyAlias,
      companyDescription,
      companyName,
      companyYears,
      employeeCount,
      promoteImg: getImgUploadValueModel('IMAGE', promoteImg),
      metas: metas,
    })
    setFormLoading(false)

    updateConfigData()
  }

  const updateConfigData = () => {
    if (!companyInfo) {
      setFormLoading(true)
      return
    }
    const { companyNameLock, firstCategory, secondCategories } = companyInfo
    const newChildren = config.children.map(item => {
      //目的：禁止企业名称改写
      if (companyNameLock && item.name === 'companyName') {
        item.disabled = true
      }

      //修改config里类目选择组件的配置信息，并给select加了onChange
      if (item.type === 'MetaSelect') {
        const options = objToTargetObj(firstCategory)
        const secondCategoriesArr = objToTargetObj(secondCategories)
        if (options.length > 0 && secondCategoriesArr.length > 0) {
          options[0].children = secondCategoriesArr
        }
        item.options = options
      }
      return item
    })
    setConfig({ ...config, children: newChildren })
  }

  //会根据企业信息变更，重新渲染大表单
  useEffect(() => {
    initComponent()
  }, [companyInfo])


  useEffect(() => {
    getShopStatus() 
    track({
      eventType: BXMAINSITE,
      data: {
        event_type: BXMAINSITE,
        action: 'entry-page',
        action_page: 'company-info-base',
      }
    })
  }, [])

  const next = () => {
    setHasEditFofrm(false)
    setCurrentStep(currentStep + 1)
  }

  const nextStep = async (values: InitEnterpriseForShopParams) => {
    if (!hasEditForm) {
      next(); return
    }

    // metas 相关的值需要自己从metas里取
    const metas: {
      firstCategory: string;
      secondCategory: string;
      thirdMetas: string[];
    } = {
      firstCategory: values.metas[0]?.value || '',
      secondCategory: values.metas[1]?.value || '',
      thirdMetas: values.metas[2],
    }

    const requestData = {
      ...values,
      area: Array.isArray(values.area) ? values.area : Object.keys(values.area).map(k => k),
      ...metas,
      promoteImg: values.promoteImg ? getImgUploadModelValue(values.promoteImg) : values.promoteImg
    } as SaveEnterpriseForShopParams
    // 下面三个是表单里的额外字段，用于保存类目的，避免接口有多余字段，所以删除
    // @ts-ignore
    delete requestData.metaCascaderValue
    // @ts-ignore
    delete requestData.metaCheckbox
    // @ts-ignore
    delete requestData.metas

    setLoading(true)

    // 一级类目
    values.firstCategory = companyInfo?.firstCategory && Object.keys(companyInfo?.firstCategory).length > 0 ? Object.keys(companyInfo?.firstCategory)[0] : ''
    //console.log("提交表单数据",values)
    const { success, message, data } = await saveEnterpriseForShopApi(requestData)
    setLoading(false)
    if (success) {
      successMessage('修改基础资料成功')
      setCompanyInfo(data)
      next()
      track({
        eventType: BXMAINSITE,
        data: {
          event_type: BXMAINSITE,
          action: 'time-end',
          action_page: 'company-info-base',
        }
      })
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
      <Steps current={currentStep} className={styles["step-container"]}>
        {steps.map(name => (
          <Step key={name} title={name} />
        ))}
      </Steps>
      <div className="container">
        {formLoading && <Loading />}
        {!formLoading && currentStep == 0 &&
          <WildcatForm
            formChange={formChangeFn}
            submit={nextStep}
            editDataSource={enterpriseInfo} config={config} loading={loading}
            submitBtn={
              <Row className={styles["save-base-info-box"]}>
                <Col span={3}></Col>
                <Col span={6} style={{ paddingLeft: 16 }}><Button loading={loading} className={styles["btn"]}
                  type="primary" size="large" htmlType="submit">保存并下一步</Button></Col>
                {
                  !shopStatus.hasMultiShopRights && <Col className={styles['tip']}>*  如需多套企业资料，请咨询销售</Col>
                }
              </Row>
            } />
        }
        {!formLoading && currentStep == 1 &&
          <ContactForm back={() => setCurrentStep(currentStep - 1)} />}
      </div>
    </div>
  );
}

const WrapperCompanyInfoBase: any = connect((state: ConnectState) => {
  const { curShopInfo, shopStatus } = state[SHOP_NAMESPACE]
  return { curShopInfo, shopStatus, ...(userMapStateToProps(state)) }
}, (dispatch) => {
  return {
    ...shopMapDispatchToProps(dispatch),
    ...userMapDispatchToProps(dispatch)
  }
})(CompanyInfoBase)

WrapperCompanyInfoBase.wrappers = ['@/wrappers/path-auth']

export default WrapperCompanyInfoBase
