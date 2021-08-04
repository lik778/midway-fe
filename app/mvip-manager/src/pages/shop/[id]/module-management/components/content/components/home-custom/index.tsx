import React, { FC, useEffect, useRef, useState } from 'react'
import { useParams } from 'umi'
import { FormInstance, Spin, Form, Button } from 'antd';

import { errorMessage, successMessage } from '@/components/message';
import InputLen from '@/components/input-len';
import SubForm from './components/subform/index'
import { getCustomerSetApi, setCustomerSetApi } from '@/api/shop'

import { CustomerSetChildListItem } from '@/interfaces/shop';

import styles from './index.less'
import { useCallback } from 'react';

const FormItem = Form.Item
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

interface Props {
  mainModuleId: number
}
const CustomModule: FC<Props> = (props) => {
  const { mainModuleId } = props
  const { id } = useParams<{ id: string }>()

  const [pageInitLoading, setPageInitLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)

  const [keyCount, setKeyCount] = useState(0)
  const forms = useRef<FormWithVals[]>([])
  const [form] = Form.useForm()

  const [subformVals, setSubformVals] = useState<CustomerSetChildListItem[]>([])
  const [delKey, setDelKey] = useState<number[]>([])

  // 初始化表单
  const initCustomModuleData = async () => {
    setPageInitLoading(true)
    const res = await getCustomerSetApi(Number(id), mainModuleId)
    if (res.success) {
      if (res.data) {
        const { mainModuleTitle, subModuleBos } = res.data
        setSubformVals(paddingChildList(subModuleBos))
        form.setFieldsValue({
          title: mainModuleTitle,
        })
      }
    }
    setPageInitLoading(false)
  }

  useEffect(() => {
    if (mainModuleId) {
      initCustomModuleData()
    } else {
      setSubformVals(paddingChildList([]))
    }
  }, [mainModuleId])

  // 初始化表单时需要给子模块填充数据
  const paddingChildList = (module: CustomerSetChildListItem[]): CustomerSetChildListItem[] => {
    let nowKey = keyCount

    const defaultChildListLen = 2
    const shouldPad = module.length > defaultChildListLen
    const padLen = shouldPad ? 0 : (defaultChildListLen - module.length)
    const getPadList = () => Array(padLen).fill('').map(_ => getEmptySubformVal(`key${++nowKey}`))

    const newSubformVals = module.map(item => ({
      ...item,
      key: `key${++nowKey}`
    })).concat(getPadList())

    setKeyCount(nowKey)
    return newSubformVals
  }

  // 新增子模块
  const handleAddSubform = useCallback(() => {
    let newKey = keyCount + 1
    setSubformVals([
      ...subformVals,
      getEmptySubformVal(`key${newKey}`)
    ])
    setKeyCount(newKey)
  }, [subformVals, keyCount])

  // 删除子模块
  const handleDelSubform = (delItem: CustomerSetChildListItem) => {
    if (delItem.id) {
      setDelKey([...delKey, delItem.id])
    }
    setSubformVals(subformVals.filter(item => item.key !== delItem.key))
  }

  // 表单及子表单统一校验
  const validateForm = useCallback(async () => await Promise.all([
    form.validateFields(),
    ...forms.current.filter(notNull).map((item) => item.form.validateFields())
  ]), [form])

  // 提交表单
  const sumbit = useCallback(async () => {
    try {
      setFormLoading(true)
      await validateForm()
      const title = form.getFieldValue('title')
      const values = forms.current.filter(notNull).map(item => {
        return {
          ...item.form.getFieldsValue(),
          id: item.item.id
        }
      })
      const res = await setCustomerSetApi(Number(id), {
        mainModuleId: isNaN(mainModuleId) ? undefined : mainModuleId,
        mainModuleTitle: title,
        subModuleVos: values,
        subModulesToDelete: delKey
      })
      if (res.success) {
        successMessage(res.message || '保存成功')
        if (mainModuleId) {
          initCustomModuleData()
        }
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
  }, [id])

  return <>
    <Spin spinning={pageInitLoading}>
      <div className={styles['container']}>

        <Form form={form} name={`form${id}`} className={styles['title-form-container']}>
          <FormItem
            className={styles['form-item']}
            name='title'
            label={<span className={styles['form-label']}>模块标题</span>}
            labelCol={{ span: 3 }}
            required={true}
            rules={[
              { required: true, message: '请输入模块标题' },
              { type: 'string', min: 2, max: 6, message: '2~6个字' }
            ]}>
            <InputLen
              className={styles['form-input']}
              width={280}
              maxLength={6}
              minLength={2}
              showCount={true}
              placeholder="例如：企业优势、服务流程"
            />
          </FormItem>
        </Form>

        {subformVals.map((item, index) => (
          <SubForm
            item={item}
            index={index}
            key={item.key}
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

      </div>
    </Spin>
  </>
}

(CustomModule as any).wrappers = ['@/wrappers/path-auth']

export default CustomModule
