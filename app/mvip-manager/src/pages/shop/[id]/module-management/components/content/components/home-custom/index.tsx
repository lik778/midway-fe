import React, { FC, useEffect, useRef, useState } from 'react'
import { useParams } from 'umi'
import { FormInstance, Spin, Form, Button, Tabs, Switch, Popover } from 'antd';

import { errorMessage, successMessage } from '@/components/message';
import SubForm from './components/subform/index'
import InputLen from '@/components/input-len';
import { getCustomerSetApi, setCustomerSetApi } from '@/api/shop'

import { CustomerSetChildListItem } from '@/interfaces/shop';

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

  /***************************************************** States */

  const { id: shopId } = useParams<{ id: string }>()

  const [pageInitLoading, setPageInitLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  const [formRenderKey, setFormRenderKey] = useState(0)
  const forms = useRef<FormWithVals[]>([])
  const [form] = Form.useForm()
  const [moduleID, setModuleID] = useState(1)

  const [subformVals, setSubformVals] = useState<CustomerSetChildListItem[]>([])
  const [delKey, setDelKey] = useState<number[]>([])

  // 初始化表单
  const initModuleData = async () => {
    setPageInitLoading(true)
    const res = await getCustomerSetApi(Number(shopId), moduleID)
    if (res.success) {
      if (res.data) {
        const { mainModuleTitle, subModuleBos } = res.data
        setSubformVals(
          paddingChildList(subModuleBos || [])
        )
        form.setFieldsValue({
          title: mainModuleTitle || '',
        })
      }
    }
    setPageInitLoading(false)
  }
  useEffect(() => {
    if (moduleID) {
      initModuleData()
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
        initModuleData()
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
    // form.setFieldsValue({})
    // setSubformVals(paddingChildList([]))
    setModuleID(+tab)
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
          <Popover
            title='示例图片'
            placement="right"
            trigger="hover"
            content={<img className={styles['thumbnail']} src={`//file.baixing.net/201709/4916aa54f4b4c69b4c01591fe6a87046.png`} />}>
            <span className={styles['info-icon']}>查看示例</span>
          </Popover>
        </FormItem>
        <FormItem
          className={styles['form-item']}
          label={<span className={styles['form-label']}>模块标题</span>}
          name='title'
          labelCol={{ span: 3 }}
          required
          rules={[
            { required: true, message: '请输入模块标题' },
            { type: 'string', min: 2, max: 20, message: '2~20个字' }
          ]}>
          <InputLen
            className={styles['form-input']}
            width={280}
            minLength={2}
            maxLength={20}
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
        <Tabs defaultActiveKey="1" onChange={changeModule}>
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
