import React, { FC, useEffect, useRef, useState, useCallback } from 'react'
import { useParams } from 'umi'
import { FormInstance, Spin, Form, Button, } from 'antd';
import styles from './index.less'
import pageStyles from '../../index.less'
import { FormWithVals } from './data'
import SubForm from './components/subform/index'
import { errorMessage, successMessage } from '@/components/message';
import { getCustomerSetApi, setCustomerSetApi } from '@/api/shop'
import { CustomerSetChildListItem, CustomerSetListItem, InitCustomerSetChildListItem } from '@/interfaces/shop';
import { getImgUploadModelValue } from '@/components/img-upload';
import { useDebounce } from '@/hooks/debounce';
import { FormType } from '@/components/wildcat-form/enums'
import { FormItem } from '@/components/wildcat-form/interfaces'
import { ModuleID } from '../../data'
import BaseForm from '../components/base-form'

const notNull = (x: any): boolean => !!x

const emptySubformVal = {
  title: '',
  content: '',
  urlImg: '',
}

const getEmptySubformVal = (key: string) => ({
  ...emptySubformVal,
  key
})
interface Props {
  moduleID: ModuleID,
}

const ModuleForm: FC<Props> = (props) => {
  const { id: shopId } = useParams<{ id: string }>()
  const { moduleID } = props

  const [getDataLoading, setGetDataLoading] = useState(false)
  const [upDateLoading, setUpDateLoading] = useState(false)
  const [formRenderKey, setFormRenderKey] = useState(0)
  const forms = useRef<FormWithVals[]>([])
  const [subformVals, setSubformVals] = useState<CustomerSetChildListItem[]>([])
  const [delKey, setDelKey] = useState<number[]>([])
  const baseForm = useRef<{
    formFn: () => FormInstance | null
  }>({ formFn: () => null })
  const [formItems] = useState<FormItem[]>([{ className: pageStyles['form-item'], formItemWidth: 280, label: '模块标题', name: 'title', type: FormType.Input, required: true, maxLength: 20, minLength: 2, patternList: [{ pattern: /^[\s\S]{2,50}$/, message: '2～20个字' }], placeholder: '例如：企业优势、服务流程', disabled: false, showCount: true }])

  const initModuleData = (data: CustomerSetListItem) => {
    const { mainModuleTitle, subModuleBos, show } = data
    setSubformVals(
      paddingChildList(subModuleBos || [])
    )
    baseForm.current.formFn()?.setFieldsValue({
      title: mainModuleTitle || '',
      show: typeof show === 'boolean' ? show : true
    })
  }

  // 初始化表单
  const getModuleData = async () => {
    setGetDataLoading(true)
    const res = await getCustomerSetApi(Number(shopId), moduleID)
    if (res.success) {
      if (res.data) {
        initModuleData(res.data as CustomerSetListItem)
      } else {
        // 如果没有请求到则给默认值
        initModuleData({} as CustomerSetListItem)
      }
    }
    setGetDataLoading(false)
  }

  useEffect(() => {
    getModuleData()
  }, [])

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
    baseForm.current.formFn()?.validateFields(),
    ...forms.current.filter(notNull).map((item) => item.form.validateFields())
  ])

  // 提交表单
  const sumbit = useDebounce(async () => {
    try {
      setUpDateLoading(true)
      await validateForm()
      const title = baseForm.current.formFn()?.getFieldValue('title')
      const show = baseForm.current.formFn()?.getFieldValue('show')
      const values: CustomerSetChildListItem[] = forms.current.filter(notNull).map(item => {
        const value: InitCustomerSetChildListItem = item.form.getFieldsValue()
        return {
          ...value,
          id: item.item.id,
          urlImg: getImgUploadModelValue(value.urlImg)
        }
      })
      const res = await setCustomerSetApi(Number(shopId), {
        mainModuleId: Number(moduleID),
        mainModuleTitle: title,
        show,
        subModuleVos: values,
        subModulesToDelete: delKey
      })
      if (res.success) {
        successMessage(res.message || '保存成功')
        initModuleData(res.data as CustomerSetListItem)
        setDelKey([])
      } else {
        errorMessage(res.message || '保存失败，请稍后再试！')
      }
    } catch (e) {
      errorMessage('请检查输入项')
      console.error('[ERR] when submit', e)
    } finally {
      setUpDateLoading(false)
    }
  }, 300)

  return <>
    <Spin spinning={getDataLoading}>
      <BaseForm ref={ref => baseForm.current = ref!} moduleID={moduleID} formItems={formItems}></BaseForm>
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
        loading={upDateLoading}
        disabled={upDateLoading}
        type="primary"
        onClick={sumbit}
      >保存</Button>
    </Spin>
  </>
}

export default ModuleForm