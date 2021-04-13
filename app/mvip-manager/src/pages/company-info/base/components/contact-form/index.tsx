import React, { useState } from 'react';
import { Button, Form } from 'antd';
import { connect } from 'dva';
import { cloneDeepWith } from 'lodash';
import WildcatForm from '@/components/wildcat-form';
import { contactForm } from '../../config';
import { QQItem, UserEnterpriseInfo } from '@/interfaces/user';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { saveEnterpriseContactInfoApi } from '@/api/user'
import { formUnvalid, isEmptyObject } from '@/utils';
import genNewUserModal from '../new-user-modal';
import { KF53 } from '../kf53';
import { QQCustomService } from '../qq-custom-service';
import { KFStatus } from '@/enums';
import { errorMessage, successMessage } from '@/components/message';
import { isNewUserApi } from '@/api/shop';
import { userMapStateToProps, userMapDispatchToProps } from '@/models/user';
import './index.less';

function ContactForm(props: any) {
  const { companyInfo, setCompanyInfo } = props
  const [qqList, setQQList] = useState<QQItem[]>([]);
  const [kf53Data, setKf53Data] = useState<any>({});
  const [config, setConfig] = useState<FormConfig>(cloneDeepWith(contactForm));
  const [formData, setFormData] = useState<any>(null);
  const [formInstance, setFormInstance] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasEditForm, setHasEditForm] = React.useState<boolean>(false);

  const formChange = (changeValue: any, allValues: any) => {
    setHasEditForm(true)
    setFormData(allValues)
  }

  const saveInfo = async () => {
    if (formUnvalid(formInstance)) return
    let qqMap: any = null
    if (qqList.length > 0) {
      qqMap = {}
      qqList.forEach(x => qqMap[x.qq] = x.name)
    }
    const clonedCompanyInfo = cloneDeepWith(companyInfo)
    const info: UserEnterpriseInfo = Object.assign(clonedCompanyInfo, formData)
    info.qqMap = qqMap
    // 处理53客服数据  刚创建用户 kf53Info可以为空
    if (kf53Data.kefuStatus) {
      if (kf53Data && !isEmptyObject(kf53Data)) {
        if ((!kf53Data.companyName || (kf53Data.companyName.length < 2||kf53Data.companyName.length > 20)) || (!kf53Data.bname || (kf53Data.bname.length < 2||kf53Data.bname.length > 20))) return
        info.kefuStatus = KFStatus.OPEN;
        info.kf53Info!.companyName = kf53Data.companyName
        info.kf53Info!.bname = kf53Data.bname
      } else {
        return
      }
    } else {
      info.kefuStatus = KFStatus.CLOSE
    }

    setLoading(true)
    const res = await saveEnterpriseContactInfoApi(info)
    setLoading(false)
    if (res?.success) {
      setCompanyInfo(info)
      const newUserRes = await isNewUserApi()
      if (newUserRes.data) {
        // genNewUserModal()
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
          config={config} formChange={formChange} />
      </Form.Item>
      <Form.Item label="智能接待系统">
        <KF53 editDataSource={companyInfo} onChange={(values) => {
          setHasEditForm(true)
          setKf53Data(values)
        }} />
      </Form.Item>
      <Form.Item label="QQ客服">
        <QQCustomService companyInfo={companyInfo} onChange={(list: QQItem[]) => {
          setHasEditForm(true)
          setQQList(list)
        }} />
        <div className="contact-form-box" >
          <Button disabled={!hasEditForm} loading={loading} className="btn" type="primary" size="large" onClick={saveInfo}>保存</Button>
          <Button onClick={props.back} style={{ margin: '0 8px' }} size="large">上一步</Button>
        </div>
      </Form.Item>
    </div>
  )
}

export default connect(userMapStateToProps, userMapDispatchToProps)(ContactForm)
