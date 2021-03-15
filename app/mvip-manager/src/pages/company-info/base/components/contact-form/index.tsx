import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'antd';
import { history } from 'umi';
import { connect } from 'dva';
import { cloneDeepWith } from 'lodash';
import WildcatForm from '@/components/wildcat-form';
import { baseInfoForm, contactForm } from '../../config';
import { QQItem, UserEnterpriseInfo } from '@/interfaces/user';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { saveEnterpriseContactInfoApi } from '@/api/user'
import { formUnvalid, isEmptyObject } from '@/utils';
import { KF53 } from '../kf53';
import { QQCustomService } from '../qq-custom-service';
import { KFStatus } from '@/enums';
import { errorMessage, successMessage } from '@/components/message';
import { isNewUserApi } from '@/api/shop';
import { companyInfoStateToProps, SET_COMPANY_INFO_ACTION, USER_NAMESPACE } from '@/models/user';
import './index.less';


function ContactForm (props: any) {
  const { companyInfo } = props
  const [qqList, setQQList] = useState<QQItem[]>([]);
  const [kf53Data, setKf53Data] = useState<any>({});
  const [config, setConfig] = useState<FormConfig>(cloneDeepWith(contactForm));
  const [formData, setFormData] = useState<any>(null);
  const [formInstance, setFormInstance] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasEditForm, setHasEditFofrm] = React.useState<boolean>(false);

  useEffect(() => {
    if (companyInfo) {
      const { qqMap } = companyInfo
      const list = (qqMap && Object.keys(qqMap).map(k => {
        return { qq: k, name: qqMap[k] }
      })) || []
      setQQList(list)
    }
  }, [ companyInfo ])

  const formChange = (changeValue: any, allValues: any) => {
    setHasEditFofrm(true)
    setFormData(allValues)
  }

  const saveInfo = async() => {
    if (formUnvalid(formInstance)) return
    let qqMap: any = null
    if (qqList.length > 0) {
      qqMap = {}
      qqList.forEach(x => qqMap[x.qq] = x.name)
    }
    const clonedCompanyInfo = cloneDeepWith(companyInfo)
    const info:UserEnterpriseInfo = Object.assign(clonedCompanyInfo, formData)
    info.qqMap = qqMap
    // 处理53客服数据
    if (!isEmptyObject(kf53Data)) {
      if (kf53Data.kefuStatus) {
        if (kf53Data.companyName && kf53Data.companyName.length < 2) return
        info.kefuStatus = KFStatus.OPEN;
        info.kf53Info.companyName = kf53Data.companyName
        info.kf53Info.bname = kf53Data.bname
      } else {
        info.kefuStatus = KFStatus.CLOSE
      }
    } else {
      if(info.kf53Info.companyName && info.kf53Info.companyName.length < 2) return
    }
    setLoading(true)
    const res = await saveEnterpriseContactInfoApi(info)
    setLoading(false)
    if (res?.success) {
      props.dispatch({ type: `${USER_NAMESPACE}/${SET_COMPANY_INFO_ACTION}`, playload: info })
      // 判断是否为新人需要一个接口字段
      const res2 = await isNewUserApi()
      if (res2.data) {
        Modal.confirm({
          width: 532,
          className: 'contact-newman-modal',
          icon: '',
          content: '您的企业资料已经填写完毕，是否现在去创建店铺？',
          title: <img src="//file.baixing.net/202101/17914d789bc8679e787dbcf12b49de6c.png" />,
          cancelButtonProps: { className: 'cancel-btn' },
          okButtonProps: { className: 'ok-btn' },
          okText: '立即前往',
          cancelText: '稍后再说',
          onOk: () => history.push('/shop'),
        })
      } else {
        successMessage('更新联系方式成功')
      }
    } else {
      errorMessage(res?.message || '出错了')
    }
  }

  return (
    <div>
      <Form.Item label="电话/微信">
        <WildcatForm useLabelCol={true} editDataSource={companyInfo}
           onInit={(form) => setFormInstance(form)}
           config={config} formChange={formChange}/>
      </Form.Item>
      <Form.Item label="智能接待系统">
        <KF53 editDataSource={companyInfo} onChange={(values) => {
          setHasEditFofrm(true)
          setKf53Data(values) }}/>
      </Form.Item>
      <Form.Item label="QQ客服">
        <QQCustomService values={qqList}  onChange={(list: QQItem[]) => {
          setHasEditFofrm(true)
          setQQList(list) }}/>
        <div className="contact-form-box" >
          <Button disabled={!hasEditForm} loading={loading} className="btn" type="primary" size="large" onClick={saveInfo}>保存</Button>
          <Button onClick={props.back} style={{ margin: '0 8px' }} size="large">上一步</Button>
        </div>
      </Form.Item>
    </div>
  )
}
export default connect(companyInfoStateToProps)(ContactForm)
