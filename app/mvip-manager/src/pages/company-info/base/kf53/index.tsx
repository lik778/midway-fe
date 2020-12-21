import React, { useEffect, useState } from 'react';
import { Switch, Form, Input } from 'antd';
import { getKf53Info, editKf53Info } from '@/api/user';
const FormItem = Form.Item;

const styles = {
  p: {  color: '#999', fontSize: 12, lineHeight: 1 },
  s: { fontWeight: 1, color: '#096DD9' },
}

export const KF53 =  (props: any) => {
  const [isOpenKFStatus, setIsOpenKFStatus] = useState<any>(null)
  const isOpenKF = (e: boolean) => {
    setIsOpenKFStatus(e)
  }

  useEffect(() => {
     (async () => {
      const res = await getKf53Info()
      if (!res.data) {
        const resData = await editKf53Info({})
      }
    })()
  }, [])

  return <Form>
    <FormItem style={{ width: 346 }} >
      <Switch onChange={isOpenKF}/>
    </FormItem>
    {
      isOpenKFStatus && <FormItem>
      <FormItem label="公司名称" name="kfCompanyName" style={{ width: 346 }} rules={[{ required: true }]}>
        <Input size="large" placeholder="请输入公司名称"/>
      </FormItem>
      <FormItem label="客服昵称" name="kfAlias" style={{ width: 346 }} rules={[{ required: true }]}>
        <Input size="large" placeholder="请输入客服昵称"/>
      </FormItem>
      <FormItem>
        <p style={styles.p}>1.关注 <span style={styles.s}>“百姓商户”</span> 公众号，即可随时随地获取客户咨询线索。</p>
        <p style={styles.p}>2.如需登陆智能客服系统进行个性化设置，可使用账号登陆 账号：小百姓190928，密码：2892908，
          <a style={styles.s} href="http://open.53kf.com" target="_blank">登录地址</a>
        </p>
      </FormItem>
    </FormItem>}
  </Form>

}
