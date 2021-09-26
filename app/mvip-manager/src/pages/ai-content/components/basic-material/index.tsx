import React, { useEffect, useState } from 'react';
import { Input, Form, Col, Row, Button } from 'antd';
import styles from './index.less';
import MyModal, { ModalType } from '@/components/modal';
import { BasicMaterialApiParams, BasicMaterialForm } from '@/interfaces/ai-content'
import { submitBasicMaterialApi, getBasicMaterialApi } from '@/api/ai-content'
import { errorMessage, successMessage } from '@/components/message';
import { mockData } from '@/utils';
import { track } from '@/api/common'
import { BXMAINSITE } from '@/constants/index'

const { TextArea } = Input;
const FormItem = Form.Item;

interface FormItemListItem {
  key: string,
  label: string,
  placeholder: string,
  rules: any[]
}

export default () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [upDataLoading, setUpdataLoading] = useState<boolean>(false)

  const validateItem = (key: string, value: string | undefined, label: string) => {
    if (key === 'wordE') {
      return Promise.resolve()
    } else {
      if (!!value) {
        if (key === 'wordA') {
          const data = value.split('\n').filter(item => !!item)
          if (data.length < 5) {
            return Promise.reject(new Error(`公司产品/服务请至少填写5个（以回车换行区分）`));
          } else {
            return Promise.resolve()
          }
        } else {
          return Promise.resolve()
        }
      } else {
        return Promise.reject(new Error(`请输入${label}`));
      }
    }
  }

  const formItemList: FormItemListItem[] = [{
    key: 'wordA',
    label: '公司产品/服务',
    placeholder: `例如：\n空调维修\n电视机维修\n冰箱维修等。\n一行一个素材，至少填写5个，多个素材以回车换行区分。`,
    rules: [{ required: true, validator: (rule: any, value: any) => validateItem('wordA', value, '公司产品/服务'), }]
  }, {
    key: 'wordB',
    label: '公司优势',
    placeholder: `例如：\n我们有专业的技术团队\n我们有高质量的服务标准\n我们的产品质量行业TOP100`,
    rules: [{ required: true, validator: (rule: any, value: any) => validateItem('wordB', value, '公司优势'), }]
  }, {
    key: 'wordC',
    label: '公司好评',
    placeholder: `例如：\nXX搬家公司，获得全国驰名商标荣耀\nXX开锁公司，获取洛阳锁王称号，XXX小区开锁王`,
    rules: [{ required: true, validator: (rule: any, value: any) => validateItem('wordC', value, '公司好评'), }]
  }, {
    key: 'wordD',
    label: '服务承诺',
    placeholder: `例如：\n1.提供24小时一条龙服务\n2.无额外收费， 统一标价`,
    rules: [{ required: true, validator: (rule: any, value: any) => validateItem('wordD', value, '服务承诺'), }]
  }, {
    key: 'wordE',
    label: '行业小知识',
    placeholder: `请填写行业小知识等信息。\n一行一句回答素材，多个以回车换行区分。`,
    rules: [{ required: false, validator: (rule: any, value: any) => validateItem('wordE', value, '行业小知识'), }]
  },]

  // 点击提交按钮弹出弹窗
  const handleClickValidate = async () => {
    try {
      await form.validateFields();
      setModalVisible(true)
    } catch (e) {
      console.log(e)
    }
  }

  const getBasicMaterialFc = async () => {
    const res = await getBasicMaterialApi()
    if (res.success && res.data) {
      const formData: BasicMaterialForm = {} as BasicMaterialForm
      Object.keys(res.data).forEach(item => {
        const str = res.data[item].reduce((total, item) => `${total}\n${item.content}`, '').slice(1)
        switch (item) {
          case '1':
            formData.wordA = str
            break
          case '2':
            formData.wordB = str
            break
          case '3':
            formData.wordC = str
            break
          case '4':
            formData.wordD = str
            break
          case '5':
            formData.wordE = str
            break
          default:
            break
        }
      })
      form.setFieldsValue(formData)
    }
    track({
      eventType: BXMAINSITE,
      data: {
        event_type: BXMAINSITE,
        tm: +new Date(),
        action: 'entry-page',
        action_page: 'zhidao-basic-materia',
      }
    })
  }

  useEffect(() => {
    getBasicMaterialFc()
  }, [])


  /**
   * 去重 去特殊符号
   * @description 注意replace里要把单引号排除，因为中文输入时，输入未结束拼音是以单引号分割的
   * */
  const outgoingControl = (value: string) => {
    return value.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\n\s\'\,，.。\<《\>》\?？\/\;；\:：\'‘’\"“”\[【\]】\|\~\!！\@\#\$￥\%\&\*\(（\)）\-—\_\=\+、·]+/g, '').replace(/[\\]+/g, '')
  }

  /** 失焦时去重 */
  const textAreaBlur = (key: string) => {
    const value: string | undefined = form.getFieldValue(key)
    form.setFieldsValue({
      [key]: value ? outgoingControl(value || '').replace(/\s{0,}\n\s{0,}/g, '\n') : ''
    })
    form.validateFields([key])
  }



  // 提交单词
  const submit = async () => {
    const values = form.getFieldsValue()
    const requestData: BasicMaterialApiParams = [] as BasicMaterialApiParams
    formItemList.forEach((item, index) => {
      requestData.push({
        type: index + 1,
        content: values[item.key] ? values[item.key].split('\n').filter((item: string) => item !== '') : []
      })
    })
    setUpdataLoading(true)
    const res = await submitBasicMaterialApi(requestData)
    if (res.success) {
      successMessage(res.message || '添加成功')
      track({
        eventType: BXMAINSITE,
        data: {
          event_type: BXMAINSITE,
          tm: +new Date(),
          action: 'time-end',
          action_page: 'zhidao-basic-materia',
        }
      })
    } else {
      errorMessage(res.message || '添加失败')
    }
    setUpdataLoading(false)
    setModalVisible(false);
  }


  return (
    <>
      <div className={styles['ai-content-container']} >
        <Form className={styles['base-information-box']} form={form} labelCol={{ span: 4 }} >
          {
            formItemList.map((item) => <FormItem name={item.key} label={item.label} key={item.key} rules={item.rules} normalize={outgoingControl
            } >
              <TextArea rows={5}
                showCount={true}
                maxLength={500}
                onBlur={() => textAreaBlur(item.key)}
                placeholder={item.placeholder}
              />
            </FormItem>)
          }
          <FormItem wrapperCol={{ offset: 4 }}>
            <Button className={styles['submit-btn']} onClick={handleClickValidate} htmlType="submit">提交</Button>
          </FormItem>
        </Form>


      </div>
      <MyModal
        title="确认提交"
        content=""
        type={ModalType.info}
        onCancel={() => setModalVisible(false)}
        onOk={() => setModalVisible(false)}
        footer={<div>
          <Button onClick={() => setModalVisible(false)}>取消</Button>
          <Button type="primary" onClick={() => submit()} disabled={upDataLoading} loading={upDataLoading}>确认</Button>
        </div>}
        visible={modalVisible} />
    </>
  )
}
