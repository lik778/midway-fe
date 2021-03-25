import React, { useState } from 'react';
import { Input, Form, Col, Row, Button } from 'antd';
import styles from './index.less';
import MyModal, { ModalType } from '@/components/modal';
import { BasicMaterialApiParams } from '@/interfaces/ai-content'
import { submitBasicMaterial } from '@/api/ai-content'
import { errorMessage, successMessage } from '@/components/message';
import { mockData } from '@/utils';
import { castArray } from 'lodash';
const { TextArea } = Input;
const FormItem = Form.Item;

interface FormItemListItem {
  key: string,
  label: string,
  placeholder: string,
  required: boolean
}

export default () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [upDataLoading, setUpdataLoading] = useState<boolean>(false)

  const formItemList: FormItemListItem[] = [{
    key: 'wordA',
    label: '公司产品/服务',
    placeholder: `例如：\n本公司从事家电维修行业，主营业务有空调维修、电视机维修、冰箱维修等。\n一行一个素材，至少填写5个，多个素材以回车换行区分。`,
    required: true
  }, {
    key: 'wordB',
    label: '公司优势 ',
    placeholder: `例如：\n1.我们有专业的技术团队\n2.我们有高质量的服务标准\n3.我们的产品质量行业TOP100`,
    required: true
  }, {
    key: 'wordC',
    label: '公司好评 ',
    placeholder: `例如：\nXX搬家公司，获得全国驰名商标荣耀\nXX开锁公司，获取洛阳锁王称号，XXX小区开锁王`,
    required: true
  }, {
    key: 'wordD',
    label: '服务承诺',
    placeholder: `例如：\n1.提供24小时一条龙服务\n2.无额外收费， 统一标价`,
    required: true
  }, {
    key: 'wordE',
    label: '行业小知识',
    placeholder: `请填写行业小知识等信息。\n一行一句回答素材，多个以回车换行区分。`,
    required: false
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
    console.log(requestData)
    setUpdataLoading(true)
    // TODO;
    // const res = await submitBasicMaterial(requestData)
    const res = await mockData('data', null)
    if (res.success) {
      successMessage(res.message || '添加成功')
      form.resetFields()
    } else {
      errorMessage(res.message || '添加失败')
    }
    setUpdataLoading(false)
    setModalVisible(false);
  }

  /** 
  * 去除特殊字符 
  * @description 注意replace里要把单引号排除，因为中文输入时，输入未结束拼音是以单引号分割的
  * */
  const clearSpecialCharacter = (value: string) => {
    return value.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\n\']+/g, '')
  }

  return (
    <>
      <div className={styles['ai-content-container']} >
        <Form className={styles['base-information-box']} form={form} labelCol={{ span: 4 }} >
          {
            formItemList.map((item) => <FormItem name={item.key} label={item.label} key={item.key} rules={[{ required: item.required, message: `请输入${item.label}！` }]} >
              <TextArea rows={5}
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
        content="提交后不可修改，确认提交吗？"
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
