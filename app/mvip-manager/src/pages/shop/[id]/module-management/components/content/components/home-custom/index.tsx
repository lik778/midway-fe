import React, { FC, useEffect, useRef, useState } from 'react'
import { useParams } from 'umi'
import { FormInstance, Spin, Form, Button, Tabs, Switch, Popover } from 'antd';

import { errorMessage, successMessage } from '@/components/message';
import SubForm from './components/subform/index'
import InputLen from '@/components/input-len';
import { getCustomerSetApi, setCustomerSetApi } from '@/api/shop'

import { CustomerSetChildListItem, CustomerSetListItem } from '@/interfaces/shop';

import styles from './index.less'
import { useCallback } from 'react';

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const notNull = (x: any): boolean => !!x
const emptySubformVal = {
  title: '',
  content: '',
  urlImg: '',
  fontColor: 0 as 0,
}
const getEmptySubformVal = (key: string) => ({
  ...emptySubformVal,
  key
})

type FormWithVals = { form: FormInstance, item: CustomerSetChildListItem }

const CustomModule = () => {
  const { id: shopId } = useParams<{ id: string }>()

  const [pageInitLoading, setPageInitLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  const [formRenderKey, setFormRenderKey] = useState(0)
  const forms = useRef<FormWithVals[]>([])
  const [form] = Form.useForm()
  const [moduleID, setModuleID] = useState(1)

  const [subformVals, setSubformVals] = useState<CustomerSetChildListItem[]>([])
  const [delKey, setDelKey] = useState<number[]>([])

  const initModuleData = (data: CustomerSetListItem) => {

    const { mainModuleTitle, subModuleBos, show } = data
    setSubformVals(
      paddingChildList(subModuleBos || [])
    )
    form.setFieldsValue({
      title: mainModuleTitle || '',
      show: typeof show === 'boolean' ? show : true
    })
  }

  // 初始化表单
  const getModuleData = async () => {
    setPageInitLoading(true)
    const res = await getCustomerSetApi(Number(shopId), moduleID)
    if (res.success) {
      if (res.data) {
        initModuleData(res.data)
      } else {
        // 如果没有请求到则给默认值
        initModuleData({} as CustomerSetListItem)
      }
    }
    setPageInitLoading(false)
  }
  useEffect(() => {
    if (moduleID) {
      getModuleData()
    }
  }, [moduleID])

  // 初始化表单时需要给子模块填充数据
  const paddingChildList = (module: CustomerSetChildListItem[]): CustomerSetChildListItem[] => {
    let nowKey = formRenderKey

    const defaultChildListLen = 2
    const shouldPad = module.length > defaultChildListLen
    const padLen = shouldPad ? 0 : (defaultChildListLen - module.length)
    const getPadList = () => Array(padLen).fill('').map(_ => getEmptySubformVal(`key-${moduleID}-${++nowKey}`))

    const newSubformVals = module.map(item => ({
      ...item,
      key: `key-${moduleID}-${++nowKey}`
    })).concat(getPadList())

    setFormRenderKey(nowKey)
    return newSubformVals
  }

  /***************************************************** Interaction Fns */

  // 新增子模块
  const handleAddSubform = useCallback(() => {
    let newKey = formRenderKey + 1
    setSubformVals([
      ...subformVals,
      getEmptySubformVal(`key-${moduleID}-${newKey}`)
    ])
    setFormRenderKey(newKey)
  }, [subformVals, formRenderKey])

  // 删除子模块
  const handleDelSubform = (delItem: CustomerSetChildListItem) => {
    if (delItem.id) {
      setDelKey([...delKey, delItem.id])
    }
    setSubformVals(subformVals.filter(item => item.key !== delItem.key))
  }

  // 表单及子表单统一校验
  const validateForm = async () => await Promise.all([
    form.validateFields(),
    ...forms.current.filter(notNull).map((item) => item.form.validateFields())
  ])

  // 提交表单
  const sumbit = async () => {
    try {
      setFormLoading(true)
      await validateForm()
      const title = form.getFieldValue('title')
      const show = form.getFieldValue('show')
      const values = forms.current.filter(notNull).map(item => {
        return {
          ...item.form.getFieldsValue(),
          id: item.item.id
        }
      })
      const res = await setCustomerSetApi(Number(shopId), {
        mainModuleId: moduleID,
        mainModuleTitle: title,
        show,
        subModuleVos: values,
        subModulesToDelete: delKey
      })
      if (res.success) {
        successMessage(res.message || '保存成功')
        initModuleData(res.data)
        setDelKey([])
      } else {
        errorMessage(res.message || '保存失败，请稍后再试！')
      }
    } catch (e) {
      errorMessage('必填项不能为空')
      console.error('[ERR] when submit', e)
    } finally {
      setFormLoading(false)
    }
  }

  // 切换 Tabs 时切换模块
  const changeModule = (tab: string) => {
    setModuleID(+tab)
    // 防止点击删除却没有点保存，切换了tab点击保存却删除了非当前tab的数据
    setDelKey([])
  }

  /***************************************************** Renders */

  const renderForm = () => {
    return <>
      <Form form={form} name={`form-${moduleID}`} className={styles['title-form-container']}>
        <FormItem
          className={styles['form-item']}
          label={<span className={styles['form-label']}>是否在前端展现</span>}
          labelCol={{ span: 3 }}>
          <FormItem name='show' className={styles['form-item-with-dedent']} valuePropName="checked">
            <Switch />
          </FormItem>
          <span className={styles['info-icon']}>查看示例</span>
          <img className={styles['info-img']} src={String(moduleID) === '1' ? "//file.baixing.net/202108/22098f43ec8b45bb97d38e6e3ec911c2.png" : "//file.baixing.net/202108/c4d48216f70064ef3eaeeb03d573c544.png"} alt="" />
        </FormItem>
        <FormItem
          className={styles['form-item']}
          label={<span className={styles['form-label']}>模块标题</span>}
          name='title'
          labelCol={{ span: 3 }}
          required
          rules={[
            { required: true, message: '请输入模块标题' },
            { type: 'string', min: 2, max: 6, message: '2~6个字' }
          ]}>
          <InputLen
            className={styles['form-input']}
            width={280}
            minLength={2}
            maxLength={6}
            showCount
            placeholder="例如：企业优势、服务流程"
          />
        </FormItem>
      </Form>
      {subformVals.map((item, index) => (
        <SubForm
          item={item}
          index={index}
          key={`subform-${moduleID}-${item.key}`}
          moduleID={moduleID}
          total={subformVals.length}
          ref={ref => forms.current[index] = ref}
          onDel={handleDelSubform}
        />
      ))}
      {subformVals.length < 10 && (
        <Button
          className={`${styles['add-btn']}`}
          type="primary"
          onClick={handleAddSubform}
        >+增加子模块</Button>
      )}
      <Button
        className={`${styles['submit-btn']}`}
        loading={formLoading}
        disabled={formLoading}
        type="primary"
        onClick={sumbit}
      >保存</Button>
    </>
  }

  return <>
    <Spin spinning={pageInitLoading}>
      <div className={styles['container']}>
        <Tabs className={styles['tabs']} defaultActiveKey="1" onChange={changeModule}>
          <TabPane tab="自定义模块一" key="1">
            {String(moduleID) === '1' && renderForm()}
          </TabPane>
          <TabPane tab="自定义模块二" key="2">
            {String(moduleID) === '2' && renderForm()}
          </TabPane>
        </Tabs>
      </div>
    </Spin>
  </>
}

(CustomModule as any).wrappers = ['@/wrappers/path-auth']

export default CustomModule
