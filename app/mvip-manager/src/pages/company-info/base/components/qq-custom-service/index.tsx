import React, { useEffect, useState, forwardRef, Ref, useImperativeHandle } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Form, Button, Input } from 'antd';
import { QQItem, UserEnterpriseInfo } from '@/interfaces/user';
import styles from './index.less'
import { useDebounce } from '@/hooks/debounce';
const FormItem = Form.Item;


const QQCustomService = function (props: {
  onChange(list: QQItem[]): void,
  companyInfo: UserEnterpriseInfo,
}, parentRef: Ref<any>) {
  const { onChange, companyInfo } = props
  const [list, setList] = React.useState<QQItem[]>([]);
  // QQ信息表单的form
  const [form] = Form.useForm();

  // 将子组件的form给父组件
  useImperativeHandle(parentRef, () => ({
    form: form
  }))

  useEffect(() => {
    if (companyInfo && companyInfo.qqMap) {
      const { qqMap } = companyInfo
      const formValue: {
        [key: string]: string
      } = {}
      qqMap.forEach((item, index) => {
        formValue[`name-${index}`] = item.name
        formValue[`content-${index}`] = item.content
      })
      form.setFieldsValue(formValue)
      setList([...qqMap])
      onChange([...qqMap])
    }
  }, [companyInfo])

  const addAction = function () {
    setList([...list, { name: '', content: '' }]);
  }

  const deleteAction = function (i: number) {
    list.splice(i, 1)
    setList([...list]);
    onChange(list);
  }

  const formChange = useDebounce((value: any, values: any) => {
    const newList: QQItem[] = [...list]
    for (let key in value) {
      const [valueKey, index] = key.split('-')
      newList[Number(index)] = {
        ...newList[Number(index)],
        [valueKey]: value[key]
      }
    }
    setList(newList);
    onChange(newList);
  }, 300)

  return (
    <Form form={form} name="QQ-form" onValuesChange={formChange} style={{ width: '550px' }} labelCol={{ span: 4 }} className={styles['QQ-container']}>
      { list && list.length > 0 && list.map((item, index) => {
        return (
          <div className={styles['qq-line']} key={index}>
            <FormItem name={`name-${index}`} rules={[{ required: true, message: '请输客服昵称' }, { pattern: /^[\s\S]{2,20}$/, message: '2～4个字' }]}>
              <Input maxLength={4} className={styles['formItem']} placeholder="例客服张三" size="large" />
            </FormItem>
            <FormItem name={`content-${index}`} rules={[{ required: true, message: '请输入客服qq' }, { pattern: /^[\s\S]{2,20}$/, message: '2～12个字' }]}>
              <Input maxLength={12} className={styles['formItem']} placeholder="请输入qq号" size="large" />
            </FormItem>
            <span className={styles['delete']} onClick={() => deleteAction(index)}>删除</span>
          </div>
        )
      })}
      <Button disabled={list && list.length >= 3} onClick={() => addAction()} className={styles['add']} type="dashed" size="large" icon={<PlusOutlined />} block>添加客服</Button>
      <p className={styles['p']}>（最多添加3个）</p>
      <p className={styles['p']}>1.QQ客服需到<a href="//shang.qq.com/v3/index.html" target="_blank" className={styles['s']}>
        “QQ推广”</a>登录开通后即可a使用，并到悬浮框组件中将“QQ交谈开关启用”；</p>
      <p className={styles['p']}>2.显示名称只能是中英文字母、汉字、数字和下划线，不得超过10个字符；</p>
      <p className={styles['p']}>3.部分手机浏览器可能不支持该功能。</p>
    </Form>)
}

export default forwardRef(QQCustomService)