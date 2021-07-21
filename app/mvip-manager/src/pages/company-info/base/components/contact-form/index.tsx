import React, { useRef, useState } from 'react';
import { Button, Form, FormInstance } from 'antd';
import { connect } from 'dva';
import { cloneDeepWith } from 'lodash';
import WildcatForm from '@/components/wildcat-form';
import { contactForm } from '../../config';
import { KF53Info, QQItem, UserEnterpriseInfo } from '@/interfaces/user';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { saveEnterpriseContactInfoApi } from '@/api/user'
import { formUnvalid, isEmptyObject } from '@/utils';
import genNewUserModal from '../new-user-modal';
import KF53 from '../kf53';
import QQCustomService from '../qq-custom-service';
import { KFStatus } from '@/enums';
import { errorMessage, successMessage } from '@/components/message';
import { isNewUserApi } from '@/api/shop';
import { userMapStateToProps, userMapDispatchToProps } from '@/models/user';
import styles from './index.less';

function ContactForm(props: any) {
  const { companyInfo, setCompanyInfo } = props
  const [qqList, setQQList] = useState<QQItem[]>([]);
  const [kf53Data, setKf53Data] = useState<any>({});
  const [config, setConfig] = useState<FormConfig>(cloneDeepWith(contactForm));
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  // 是否修改过表单 阈值  
  const [hasEditForm, setHasEditForm] = React.useState<boolean>(false);

  // 客户信息表单的form
  const [formInstance, setFormInstance] = useState<FormInstance<any> | null>(null);
  // 53客服表单的form
  const kf53Ref = useRef<{ form: FormInstance<any> }>()
  // 53客服表单的form
  const QQRef = useRef<{ form: FormInstance<any> }>()


  const formChange = (changeValue: any, allValues: any) => {
    setHasEditForm(true)
    setFormData(allValues)
  }

  const KF53Change = (values: any) => {
    setHasEditForm(true)
    setKf53Data(values)
  }

  const QQChange = (values: QQItem[]) => {
    setHasEditForm(true)
    setQQList(values)
  }

  const saveInfo = async () => {
    // 这里的校验是分两段校验的  微笑
    // 校验电话联系人  , 校验53客服
    await Promise.all([formInstance?.validateFields(), kf53Ref.current?.form.validateFields(), QQRef.current?.form.validateFields()])
    let qqMap: any = null
    if (qqList.length > 0) {
      qqMap = qqList
    }
    const clonedCompanyInfo = cloneDeepWith(companyInfo)
    const info: UserEnterpriseInfo = Object.assign(clonedCompanyInfo, formData)
    info.qqMap = qqMap
    // 校验53客服
    // 刚创建用户 kf53Info可以为空
    if (kf53Data && kf53Data.kefuStatus) {
      // 校验字数是否正确
      info.kefuStatus = KFStatus.OPEN;
      if (!info.kf53Info) {
        info.kf53Info = {
          companyName: kf53Data.companyName,
          bname: kf53Data.bname
        } as KF53Info
      } else {
        info.kf53Info.companyName = kf53Data.companyName
        info.kf53Info.bname = kf53Data.bname
      }
    } else {
      info.kefuStatus = KFStatus.CLOSE
    }
    setLoading(true)
    const res = await saveEnterpriseContactInfoApi(info)
    setLoading(false)
    if (res?.success) {
      setCompanyInfo(info)
      successMessage('更新联系方式成功')
    } else {
      errorMessage(res?.message || '出错了')
    }
  }

  return (
    <div className={styles['contact-form-box']}>
      <Form.Item label="电话/微信" labelAlign='right' labelCol={{ span: 4 }} className={styles['label-style']}>
        <WildcatForm editDataSource={companyInfo}
          onInit={(form) => setFormInstance(form)}
          config={config} formChange={formChange} />
      </Form.Item>
      <Form.Item label="智能接待系统" labelAlign='right' labelCol={{ span: 4 }} className={styles['label-style']}>
        <KF53 editDataSource={companyInfo} onChange={KF53Change} ref={kf53Ref} />
      </Form.Item>
      <Form.Item label="QQ客服" labelAlign='right' labelCol={{ span: 4 }} className={styles['label-style']}>
        <QQCustomService companyInfo={companyInfo} onChange={QQChange} ref={QQRef} />
        <div className={styles['contact-form-btn-box']} >
          <Button disabled={!hasEditForm} loading={loading} className={styles['btn']} type="primary" size="large" onClick={saveInfo}>保存</Button>
          <Button onClick={props.back} style={{ margin: '0 8px' }} size="large">上一步</Button>
        </div>
      </Form.Item>
    </div>
  )
}

export default connect(userMapStateToProps, userMapDispatchToProps)(ContactForm)
