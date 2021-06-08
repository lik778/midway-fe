import React, { forwardRef, useEffect, useState, Ref, useImperativeHandle } from 'react';
import { Switch, Form, Input, FormInstance } from 'antd';
import { KF53Info, UserEnterpriseInfo } from '@/interfaces/user';
import { KFStatus } from '@/enums';
import styles from './index.less'
const FormItem = Form.Item;

interface Props {
  editDataSource: UserEnterpriseInfo | null;
  onChange(values: any): void;
}

// kf53Ref
const KF53 = (props: Props, parentRef: Ref<any>) => {
  const { editDataSource, onChange } = props
  const [isOpenKFStatus, setIsOpenKFStatus] = useState<boolean | null>(null)
  const [kf53Info, setKf53Info] = useState<KF53Info | null>(null)
  const [form] = Form.useForm();

  // 将子组件的form给父组件
  useImperativeHandle(parentRef, () => ({
    form: form
  }))

  useEffect(() => {
    if (editDataSource) {
      const kefuStatus = editDataSource.kefuStatus === KFStatus.OPEN
      setKf53Info(editDataSource.kf53Info)
      setIsOpenKFStatus(kefuStatus)
      form.setFieldsValue({ ...editDataSource.kf53Info, kefuStatus })
      onChange({ ...editDataSource.kf53Info, kefuStatus })
    }
  }, [editDataSource])

  useEffect(() => {
    // 切换开关时，是先修改的开关后改的值，onChange事件只触发了一次
    if (isOpenKFStatus && editDataSource) {
      onChange({ ...editDataSource.kf53Info, kefuStatus: isOpenKFStatus })
    }
  }, [isOpenKFStatus])

  const formChange = (value: any, values: any) => {
    setIsOpenKFStatus(values['kefuStatus'])
    form.setFieldsValue(values)
    onChange(values)
  }

  return <Form form={form} name="kf53-form" onValuesChange={formChange} style={{ width: '550px' }} labelCol={{ span: 4 }} className={styles['kf53-form-container']}>
    <FormItem label="是否展示" name="kefuStatus" valuePropName='checked'>
      <Switch className={styles['form-item-left']} />
    </FormItem>
    {
      isOpenKFStatus && <>
        <FormItem label="公司名称" name="companyName" rules={[{ required: true, message: '请输入公司名称' }, { pattern: /^[\s\S]{2,20}$/, message: '2～20个字' }]}>
          <Input className={`${styles['form-item-left']} ${styles['input']}`} size="large" placeholder="请输入公司名称" minLength={2} maxLength={20} />
        </FormItem>
        <FormItem label="客服昵称" name="bname" rules={[{ required: true, message: '请输入客服昵称' }, { pattern: /^[\s\S]{2,20}$/, message: '2～20个字' }]}>
          <Input className={`${styles['form-item-left']} ${styles['input']}`} size="large" placeholder="请输入客服昵称" maxLength={8} />
        </FormItem>
        <FormItem>
          <p className={styles['p']}>1.关注 <span className={styles['s']}>“百姓商户”</span> 公众号，即可随时随地获取客户咨询线索。</p>
          <p className={styles['p']}>2.如需登录智能客服系统进行个性化设置，可使用账号登录 账号：{kf53Info?.userId}，密码：{kf53Info?.password}，
            <a className={styles['p']} href="http://open.53kf.com" target="_blank">登录地址</a>
          </p>
        </FormItem>
      </>}
  </Form>

}


export default forwardRef(KF53)