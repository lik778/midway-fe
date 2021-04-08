import React, { useEffect, useState } from 'react';
import { Switch, Form, Input } from 'antd';
import { KF53Info, UserEnterpriseInfo } from '@/interfaces/user';
import { KFStatus } from '@/enums';
import './index.less'
const FormItem = Form.Item;

const styles = {
  p: {  color: '#999', fontSize: 12, lineHeight: 1 },
  s: { fontWeight: 1, color: '#096DD9' },
}

interface Prop {
  editDataSource: UserEnterpriseInfo | null;
  onChange(values: any): void;
}
export const KF53 =  (props: Prop) => {
  const { editDataSource, onChange } = props
  const [isOpenKFStatus, setIsOpenKFStatus] = useState<boolean | null>(null)
  const [kf53Info, setKf53Info] = useState<KF53Info | null>(null)
  const [form] = Form.useForm();

  useEffect(() => {
    if (editDataSource) {
      const kefuStatus = editDataSource.kefuStatus === KFStatus.OPEN
      setKf53Info(editDataSource.kf53Info)
      setIsOpenKFStatus(kefuStatus)
      form.setFieldsValue({...editDataSource.kf53Info, kefuStatus })
    }
  }, [editDataSource])

  const formChange = (value: any, values: any) => {
    setIsOpenKFStatus(values['kefuStatus'])
    form.setFieldsValue(values)
    onChange(values)
  }

  return <Form form={form} name="kf53-form" onValuesChange={formChange} >
    <FormItem label="是否展示" style={{ width: 346 }} name="kefuStatus" valuePropName='checked'>
      <Switch />
    </FormItem>
    {
      isOpenKFStatus && <>
        <FormItem label="公司名称" name="companyName" style={{ width: 346 }} rules={[{required:true,message:'请输入公司名称'},{ pattern: /^[\s\S]{2,20}$/, message: '2～20个字'}]}>
          <Input size="large" placeholder="请输入公司名称" minLength={2} maxLength={20} />
        </FormItem>
        <FormItem label="客服昵称" name="bname" style={{ width: 346 }} rules={[{required:true,message:'请输入客服昵称'},{ pattern: /^[\s\S]{2,20}$/, message: '2～20个字'}]}>
          <Input size="large" placeholder="请输入客服昵称" maxLength={8} />
        </FormItem>
        <FormItem>
          <p style={styles.p}>1.关注 <span style={styles.s}>“百姓商户”</span> 公众号，即可随时随地获取客户咨询线索。</p>
          <p style={styles.p}>2.如需登陆智能客服系统进行个性化设置，可使用账号登陆 账号：{kf53Info?.userId}，密码：{kf53Info?.password}，
            <a style={styles.s} href="http://open.53kf.com" target="_blank">登录地址</a>
          </p>
        </FormItem>
      </>}
  </Form>

}
