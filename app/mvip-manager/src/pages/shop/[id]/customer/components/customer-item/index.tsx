import React, { ChangeEventHandler, FC, useEffect, useRef, useState } from 'react'
import { useParams } from 'umi'
import { FormInstance, Spin, Form, Button, Input } from 'antd';
import MainTitle from '@/components/main-title';
import { CustomerSetChildListItem, CustomerSetListItem } from '@/interfaces/shop';
import { getCustomerSetApi, setCustomerSetApi } from '@/api/shop'
import styles from './index.less'
import CustomerSetForm from './components/form/index'
import { errorMessage, successMessage } from '@/components/message';
import form from './components/form/index';
import { mockData } from '@/utils';
import InputLen from '@/components/input-len';
const FormItem = Form.Item

interface Props {
  mainModuleId: number
  onSave: () => void
}

const CustomerSet: FC<Props> = (props) => {
  const { id } = useParams<{ id: string }>()
  const { mainModuleId, onSave } = props
  const [dataList, setDataList] = useState<CustomerSetChildListItem[]>([])
  const [keyCount, setKeyCount] = useState<number>(0)
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)
  const [delKey, setDelKey] = useState<number[]>([])
  const forms = useRef<{ form: FormInstance, item: CustomerSetChildListItem }[]>([])
  const [form] = Form.useForm();

  const newItem = {
    title: '',
    content: '',
    urlImg: '',
    fontColor: 0 as 0,
  }

  const getCustomerSet = async () => {
    setGetDataLoading(true)
    const res = await getCustomerSetApi(Number(id), mainModuleId)
    // const res = await mockData<CustomerSetListItem>('data', {
    //   id: 1,
    //   title: '企业优势',
    //   module: []
    // })
    // const res = await mockData<CustomerSetListItem | null>('data', null)
    if (res.success) {
      if (res.data) {
        const { mainModuleTitle, subModuleBos } = res.data
        const newDataList = createChildList(subModuleBos)
        setDataList(newDataList)
        form.setFieldsValue({
          title: mainModuleTitle,
        })
      }
    }
    setGetDataLoading(false)
  }

  const createChildList = (module: CustomerSetChildListItem[]): CustomerSetChildListItem[] => {
    let nowKey = keyCount
    const newDataList = []
    if (module?.length === 0) {
      let i = 0
      while (i < 2) {
        nowKey++;
        newDataList.push({
          ...newItem,
          key: `key${nowKey}`
        })
        i++;
      }
    } else {
      if (module.length === 1) {
        nowKey++;
        newDataList.push({
          ...module[0],
          key: `key${nowKey}`
        })
        nowKey++;
        newDataList.push({
          ...newItem,
          key: `key${nowKey}`
        })
      } else {
        newDataList.push(...module.map(item => {
          nowKey++;
          return {
            ...item,
            key: `key${nowKey}`
          }
        }))
      }
    }
    setKeyCount(nowKey)
    return newDataList
  }

  useEffect(() => {
    if (mainModuleId) {
      getCustomerSet()
    } else {
      const newDataList = createChildList([])
      setDataList(newDataList)
    }
  }, [mainModuleId])

  const handleClickAdd = () => {
    let nowKey = keyCount
    nowKey++;
    setDataList([...dataList, {
      ...newItem,
      key: `key${nowKey}`
    }])
    setKeyCount(nowKey)
  }

  const handleDeleteItem = (delItem: CustomerSetChildListItem) => {
    const newDataList = dataList.filter(item => item.key !== delItem.key)
    if (delItem.id) {
      setDelKey([...delKey, delItem.id])
    }
    setDataList(newDataList)
  }

  /** 当出现错误reture false */
  const validateForm = async () => await Promise.all([form.validateFields(), ...forms.current.filter(item => item).map((item) => item.form.validateFields())])

  const sumbit = async () => {
    try {
      await validateForm()
      const values = forms.current.filter(item => item).map(item => {
        return {
          ...item.form.getFieldsValue(),
          id: item.item.id
        }
      })
      const title = form.getFieldValue('title')
      setUpDataLoading(true)
      const res = await setCustomerSetApi(Number(id), {
        mainModuleId: isNaN(mainModuleId) ? undefined : mainModuleId,
        mainModuleTitle: title,
        subModuleVos: values,
        subModulesToDelete: delKey
      })
      if (res.success) {
        successMessage(res.message || '保存成功')
        onSave()
        if (mainModuleId) {
          getCustomerSet()
        }
        setDelKey([])
      } else {
        errorMessage(res.message || '保存失败，请稍后再试！')
      }
      setUpDataLoading(false)
    } catch (e) {
      errorMessage('必填项不能为空')
      setUpDataLoading(false)
      console.log(e)
    }
  }

  return <>
    <Spin spinning={getDataLoading}>
      <div className={styles['container']}>
        <Form form={form} name={`form${id}`} className={styles['title-form-container']}>
          <FormItem className={styles['form-item']} label={<span className={styles['form-label']} >
            模块标题
        </span>} labelCol={{ span: 3 }} rules={[{ required: true, message: '请输入模块标题' }, { type: 'string', min: 2, max: 6, message: '2~6个字' }]} required={true} name='title'>
            <InputLen width={280} className={styles['form-input']} maxLength={6} minLength={2} showCount={true} placeholder="例如：企业优势、服务流程" />
          </FormItem>
        </Form>
        {
          dataList.map((item, index) => <CustomerSetForm item={item} index={index} key={item.key} total={dataList.length} ref={(ref) => forms.current[index] = ref} onDel={handleDeleteItem} />)
        }
        {
          dataList.length < 10 && <Button className={`${styles['add-btn']}`} type="primary" onClick={handleClickAdd}>+增加子模块</Button>
        }
        <div>
          <Button className={`${styles['submit-btn']}`} loading={upDataLoading} disabled={upDataLoading}
            type="primary" onClick={sumbit}>保存</Button>
        </div>
      </div>
    </Spin>
  </>
}

(CustomerSet as any).wrappers = ['@/wrappers/path-auth']

export default CustomerSet