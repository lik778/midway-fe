import React, { useEffect, useState, ReactNode } from 'react';
import { Input, Form, Col, Row, Button, Popover } from 'antd';
import styles from './index.less';
import MyModal, { ModalType } from '@/components/modal';
import { BasicMaterialApiParams, BasicMaterialForm } from '@/interfaces/ai-module'
import { submitBasicMaterialApi, getBasicMaterialApi } from '@/api/ai-module'
import { errorMessage, successMessage } from '@/components/message';
import { FormKey } from './data.d'
import MainTitle from '@/components/main-title'
import { track } from '@/api/common'
import { BXMAINSITE } from '@/constants/index'

const { TextArea } = Input;
const FormItem = Form.Item;

interface FormItemListItem {
  key: FormKey,
  label: string,
  tip: string,
  rules: any[],
  popover?: ReactNode
}


export const zhidaoTypeMap: { [key in FormKey]: string } = {
  [FormKey.WORDA]: '公司产品/服务',
  [FormKey.WORDB]: '公司优势',
  [FormKey.WORDC]: '公司好评',
  [FormKey.WORDD]: '服务承诺',
  [FormKey.WORDE]: '行业小知识',
}

export default () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [upDataLoading, setUpdataLoading] = useState<boolean>(false)
  const [wordsNum, setWordsNum] = useState({
    [FormKey.WORDA]: 0,
    [FormKey.WORDB]: 0,
    [FormKey.WORDC]: 0,
    [FormKey.WORDD]: 0,
    [FormKey.WORDE]: 0,
  })

  const validateItem = (key: FormKey, value: string | undefined, label: string) => {
    if (key === FormKey.WORDE) {
      return Promise.resolve()
    } else {
      if (!!value) {
        const data = value.split('\n').filter(item => !!item)
        if (data.length < 3) {
          return Promise.reject(new Error(`${zhidaoTypeMap[key]}请至少填写3个（以回车换行区分）`));
        } else {
          return Promise.resolve()
        }
      } else {
        return Promise.reject(new Error(`请输入${label}`));
      }
    }
  }

  const formItemList: FormItemListItem[] = [{
    key: FormKey.WORDA,
    label: zhidaoTypeMap[FormKey.WORDA],
    tip: '说明：公司产品/服务请至少填写3个（以回车换行区分），可以填写公司有哪些产品，提供哪些服务，做什么业务。',
    rules: [{ required: true, validator: (rule: any, value: any) => validateItem(FormKey.WORDA, value, zhidaoTypeMap[FormKey.WORDA]), }]
  }, {
    key: FormKey.WORDB,
    label: zhidaoTypeMap[FormKey.WORDB],
    tip: '说明：请至少填写3个（以回车换行区分），填写示例：“我们有专业的技术团队”、“高质量的服务标准”、“产品质量行业TOP100”。',
    rules: [{ required: true, validator: (rule: any, value: any) => validateItem(FormKey.WORDB, value, zhidaoTypeMap[FormKey.WORDB]), }],
    popover: <div className={styles['popover-box']}>
      <p className={styles['popover-item']}>
        1.口碑载道：重视信誉和口碑，客户忠实度高。
    </p>
      <p className={styles['popover-item']}>
        2.资质正规：相关资质均有工商备案，资质可查，公司正规。
    </p>
      <p className={styles['popover-item']}>
        3.贴心服务：全方位的售前售后服务，提高客户满意度。
    </p>
      <p className={styles['popover-item']}>
        4.售后保障：完善的售后服务体系和严格的管理制度，客户至上。
    </p>
      <p className={styles['popover-item']}>
        5.产品技术优势：公司有专门的技术团队，不断攻克技术难关，每个季度都研发新产品
    </p>
      <p className={styles['popover-item']}>
        6.新品研发优势：公司重视产品研发，不断开发产品新款式，增加产品新功能。
    </p>
    </div>
  }, {
    key: FormKey.WORDC,
    label: zhidaoTypeMap[FormKey.WORDC],
    tip: '说明：请至少填写3个（以回车换行区分），填写示例：“上海市优秀企业”、“中国3.15诚信品牌”、“绿色环保推广产品”。',
    rules: [{ required: true, validator: (rule: any, value: any) => validateItem(FormKey.WORDC, value, zhidaoTypeMap[FormKey.WORDC]), }],
    popover: <div className={styles['popover-box']}>
      <p className={styles['popover-item']}>
        1.2016年公司荣获由世界知识产权组织（WIPO）和中国国家版权局联合举办的中国版权领域最高奖项“中国版权金奖”。
      </p>
      <p className={styles['popover-item']}>
        2.2016年挖贝新三板年终评选文化传媒优秀企业。
      </p>
      <p className={styles['popover-item']}>
        3.2014年公司获得中国版权协会授予的“中国版权最具影响力企业”称号。
      </p>
      <p className={styles['popover-item']}>
        4.质量服务诚信AAA企业。
      </p>
      <p className={styles['popover-item']}>
        5.山西省守合同重信用企业。
      </p>
      <p className={styles['popover-item']}>
        6.十佳诚信企业
      </p>
    </div>
  }, {
    key: FormKey.WORDD,
    label: zhidaoTypeMap[FormKey.WORDD],
    tip: '说明：请至少填写3个（以回车换行区分），填写示例：“提供24小时上门服务”、“无额外收费”、"收费全国统一"。',
    rules: [{ required: true, validator: (rule: any, value: any) => validateItem(FormKey.WORDD, value, zhidaoTypeMap[FormKey.WORDD],), }],
    popover: <div className={styles['popover-box']}>
      <p className={styles['popover-item']}>
        1.不分节假日，实行24小时服务。
  </p>
      <p className={styles['popover-item']}>
        2.提供优质全程服务。
  </p>
      <p className={styles['popover-item']}>
        3.有呼必应，热情服务。
  </p>
      <p className={styles['popover-item']}>
        4.让客户少进一扇门，少找一个人，少跑一趟路。
  </p>
      <p className={styles['popover-item']}>
        5.有求必救，有呼必应。
  </p>
      <p className={styles['popover-item']}>
        6.岗位服务承诺口号。
  </p>
      <p className={styles['popover-item']}>
        7.以最短的时间、最快的速度，提供最有效的服务。
  </p>
      <p className={styles['popover-item']}>
        8.厚德、搏时、竞进。
  </p>
    </div>
  }, {
    key: FormKey.WORDE,
    label: zhidaoTypeMap[FormKey.WORDE],
    tip: '说明：小知识填写以回车换行区分，请填写行业、业务、产品、服务相关的小知识、文章内容。',
    rules: [{ required: false, validator: (rule: any, value: any) => validateItem(FormKey.WORDE, value, zhidaoTypeMap[FormKey.WORDE]), }]
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
      const newWordsNum = {
        [FormKey.WORDA]: 0,
        [FormKey.WORDB]: 0,
        [FormKey.WORDC]: 0,
        [FormKey.WORDD]: 0,
        [FormKey.WORDE]: 0,
      }
      Object.keys(res.data).forEach(item => {
        const str = res.data[item].reduce((total, item) => `${total}\n${item.content}`, '').slice(1)
        switch (item) {
          case '1':
            formData[FormKey.WORDA] = str
            newWordsNum[FormKey.WORDA] = res.data[item].length
            break
          case '2':
            formData[FormKey.WORDB] = str
            newWordsNum[FormKey.WORDB] = res.data[item].length
            break
          case '3':
            formData[FormKey.WORDC] = str
            newWordsNum[FormKey.WORDC] = res.data[item].length
            break
          case '4':
            formData[FormKey.WORDD] = str
            newWordsNum[FormKey.WORDD] = res.data[item].length
            break
          case '5':
            formData[FormKey.WORDE] = str
            newWordsNum[FormKey.WORDE] = res.data[item].length
            break
          default:
            break
        }
      })
      setWordsNum(newWordsNum)
      form.setFieldsValue(formData)
    }
  }

  useEffect(() => {
    getBasicMaterialFc()
    track({
      eventType: BXMAINSITE,
      data: {
        event_type: BXMAINSITE,
        action: 'entry-page',
        action_page: 'zhidao-basic-materia',
      }
    })
  }, [])

  const getWordNum = (key: string, value: string) => {
    const words = value.split('\n').filter(item => !!item)
    setWordsNum((wordsNum) => ({
      ...wordsNum,
      [key]: words.length
    }))
  }

  /**
   * 去重 去特殊符号
   * @description 注意replace里要把单引号排除，因为中文输入时，输入未结束拼音是以单引号分割的
   * */
  const outgoingControl = (key: string, value: string, type?: 'blur') => {
    let newValue = value.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\n\s\'\,，.。\<《\>》\?？\/\;；\:：\'‘’\"“”\[【\]】\|\~\!！\@\#\$￥\%\&\*\(（\)）\-—\_\=\+、·]+/g, '').replace(/[\\]+/g, '')
    const words = newValue.split('\n')
    if (words.length > 1) {
      // 当失焦校验时，最后一行也要加入去重
      const endWord = type === 'blur' ? '' : words.pop()
      newValue = `${[...new Set(words.filter(item => !!item))].reduce((total, item) => `${total}${item}\n`, '')}${endWord}`
    }
    getWordNum(key, newValue)
    return newValue
  }

  /** 失焦时去重 */
  const textAreaBlur = (key: string) => {
    const value: string | undefined = form.getFieldValue(key)
    form.setFieldsValue({
      [key]: value ? outgoingControl(key, value || '', 'blur').replace(/\s{0,}\n\s{0,}/g, '\n') : ''
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
      <MainTitle title="知道AI基础素材" showJumpIcon={true} />
      <div className={styles['ai-content-container']} >
        <Form className={styles['base-information-box']} form={form} labelCol={{ span: 3 }} >
          {
            formItemList.map((item) => <FormItem label={item.label} key={item.key} required={item.rules[0].required}>
              <div className={styles['tip']}>
                {item.tip}
                {
                  item.popover && <Popover content={item.popover} placement="topRight"><span className={styles['popover']}>查看参考示例</span></Popover>
                }
              </div>
              <div className={styles['num']}>已填写：{wordsNum[item.key]}个</div>
              <FormItem name={item.key} rules={item.rules} normalize={(val) => outgoingControl(item.key, val)
              } >
                <TextArea rows={5}
                  showCount={true}
                  maxLength={500}
                  onBlur={() => textAreaBlur(item.key)}
                />
              </FormItem>
            </FormItem>
            )
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
