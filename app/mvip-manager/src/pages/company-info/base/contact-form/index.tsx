import React, { useState } from 'react';
import { Button, Form, message } from 'antd';
import WildcatForm from '@/components/wildcat-form';
import { contactForm } from '@/config/form';
import { QQCustomService } from '@/pages/company-info/base/qq-custom-service';
import { QQItem, UserEnterpriseInfo } from '@/interfaces/user';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { saveEnterpriseContactInfoApi } from '@/api/user'
import { formUnvalid } from '@/utils';
import { KF53 } from '@/pages/company-info/base/kf53';
import { KFStatus } from '@/enums';

interface Props {
  editDataSource: UserEnterpriseInfo | null;
  back(): void;
}

const ContactForm = (props: Props) => {
  const { editDataSource } = props
  const [qqList, setQQList] = useState<QQItem[]>([]);
  const [kf53Data, setKf53Data] = useState<any>({});
  const [config, setConfig] = useState<FormConfig>(contactForm);
  const [formData, setFormData] = useState<any>(null);
  const [formInstance, setFormInstance] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const formChange = (changeValue: any, allValues: any) => {
    setFormData(allValues);
  }

  // 这里前置要校验一下
  const saveInfo = async() => {
    if (formUnvalid(formInstance)) return
    let qqMap: any = null
    if (qqList.length > 0) {
      qqMap = {}
      qqList.forEach(x => qqMap[x.qq] = x.name)
    }
    const info:UserEnterpriseInfo = Object.assign(editDataSource, formData)
    info.qqMap = qqMap
    // 处理53客服数据
    if (kf53Data.kefuStatus) {
      info.kefuStatus = KFStatus.OPEN;
      info.kf53Info.companyName = kf53Data.companyName
      info.kf53Info.bname = kf53Data.bname
    } else {
      info.kefuStatus = KFStatus.CLOSE
    }
    setLoading(true)
    const res = await saveEnterpriseContactInfoApi(info)
    setLoading(false)
    if (res.success) {
       message.success('更新联系方式成功')
    } else {
      message.error(res.message)
    }
  }

  return (
    <div>
      <Form.Item label="电话/微信">
        <WildcatForm useLabelCol={true} editDataSource={editDataSource}
           onInit={(form) => setFormInstance(form)}
           config={config} formChange={formChange}/>
      </Form.Item>
      <Form.Item label="第三方客服">
        <KF53 editDataSource={editDataSource} onChange={(values) => setKf53Data(values)}/>
      </Form.Item>
      <Form.Item label="QQ客服">
        <QQCustomService editDataSource={editDataSource} onChange={(qqList) => setQQList(qqList)}/>
        <div style={{ marginTop: 32 }}>
          <Button loading={loading} type="primary" size="large" onClick={saveInfo}>保存</Button>
          <Button onClick={props.back} style={{ margin: '0 8px' }} size="large">上一步</Button>
        </div>
      </Form.Item>
    </div>
  )
}

export default ContactForm
