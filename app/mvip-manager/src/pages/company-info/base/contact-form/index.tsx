import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'antd';
import { history } from 'umi';
import WildcatForm from '@/components/wildcat-form';
import { contactForm } from '@/config/form';
import { QQCustomService } from '@/pages/company-info/base/qq-custom-service';
import { QQItem, UserEnterpriseInfo } from '@/interfaces/user';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { saveEnterpriseContactInfoApi } from '@/api/user'
import { formUnvalid, isEmptyObject } from '@/utils';
import { KF53 } from '@/pages/company-info/base/kf53';
import { KFStatus } from '@/enums';
import { errorMessage, successMessage } from '@/components/message';
import './index.less';
import { isNewUserApi } from '@/api/shop';

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

  useEffect(() => {
    if (editDataSource) {
      const { qqMap } = editDataSource
      const list = (qqMap && Object.keys(qqMap).map(k => {
        return { qq: k, name: qqMap[k] }
      })) || []
      setQQList(list)
    }
  }, [editDataSource])

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
        <WildcatForm useLabelCol={true} editDataSource={editDataSource}
           onInit={(form) => setFormInstance(form)}
           config={config} formChange={formChange}/>
      </Form.Item>
      <Form.Item label="智能接待系统">
        <KF53 editDataSource={editDataSource} onChange={(values) => setKf53Data(values)}/>
      </Form.Item>
      <Form.Item label="QQ客服">
        <QQCustomService values={qqList}  onChange={(list) => setQQList(list)}/>
        <div className="contact-form-box" >
          <Button loading={loading} className="btn" type="primary" size="large" onClick={saveInfo}>保存</Button>
          <Button onClick={props.back} style={{ margin: '0 8px' }} size="large">上一步</Button>
        </div>
      </Form.Item>
    </div>
  )
}

export default ContactForm
