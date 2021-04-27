import React, { ChangeEventHandler, FC, useEffect, useRef, useState } from 'react'
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
  // id: number
}

const CustomerSet: FC<Props> = (props) => {
  // const { id } = props
  const [id, setId] = useState<number>()
  const [title, setTitle] = useState<string>('')
  const [dataList, setDataList] = useState<CustomerSetChildListItem[]>([])
  const [keyCount, setKeyCount] = useState<number>(0)
  const [getDataLoading, setGetDataLoading] = useState<boolean>(true)
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)
  const [delKey, setDelKey] = useState<number[]>([])
  const forms = useRef<{ form: FormInstance }[]>([])
  const [form] = Form.useForm();

  const newItem = {
    title: '',
    desc: '',
    bgImg: '',
    fontColor: 'black' as 'black',
  }

  const getCustomerSet = async () => {
    setGetDataLoading(true)
    // const res = await getCustomerSetApi()
    // const res = await mockData<CustomerSetListItem>('data', {
    //   id: 1,
    //   title: '企业优势',
    //   module: []
    // })
    const res = await mockData<CustomerSetListItem | null>('data', null)
    if (res.success) {
      if (res.data) {
        const { id, title, module } = res.data
        const newDataList = createChildList(module)
        setId(id)
        setTitle(title)
        setDataList(newDataList)
      } else {
        const newDataList = createChildList([])
        setDataList(newDataList)
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
    getCustomerSet()
  }, [])

  const handleClickAdd = () => {
    let nowKey = keyCount
    nowKey++;
    setDataList([...dataList, {
      ...newItem,
      key: `key${nowKey}`
    }])
    setKeyCount(nowKey)
  }

  const handleDeleteItem = (item: CustomerSetChildListItem) => {
    const newDataList = dataList.filter(item => item.key !== item.key)
    if (item.id) {
      setDelKey([...delKey, item.id])
    }
    setDataList(newDataList)
  }

  /** 当出现错误reture false */
  const validateForm = async () => await Promise.all([form.validateFields(), ...forms.current.filter(item => item).map((item) => item.form.validateFields())])

  const sumbit = async () => {
    try {
      await validateForm()
      const values = forms.current.filter(item => item).map(item => {
        return item.form.getFieldsValue()
      })
      const title = form.getFieldValue('title')
      setUpDataLoading(true)
      console.log({
        detail: {
          id: id,
          title,
          module: values
        },
        del: id ? {
          id: id,
          cid: []
        } : null
      })
      // const res = await setCustomerSetApi({
      //   detail: {
      //     id: id,
      //     title,
      //     module: values
      //   },
      //   del: id ? {
      //     id: id,
      //     cid: []
      //   } : null
      // })
      const res = await mockData('data', null)
      if (res.success) {
        successMessage(res.message || '保存成功')
      } else {
        errorMessage(res.message || '保存失败，请稍后再试！')
      }
      setUpDataLoading(false)
    } catch (e) {
      console.log(e)
    }
  }


  const handleChangeInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    e.persist()
    setTitle(e.target.value)
  }

  return <>
    <Spin spinning={getDataLoading}>
      <div className={styles['container']}>
        <Form form={form} name={`form${id}`}>
          <FormItem className={styles['form-item']} label={<span className={styles['form-label']} >
            模块标题
        </span>} labelCol={{ span: 2 }} rules={[{ required: true, message: '请输入模块标题' }, { type: 'string', min: 2, max: 6, message: '模块标题须在2-6字符之间' }]} required={true} name='title'>
            <InputLen className={styles['form-input']} maxLength={6} minLength={2} showCount={true} />
          </FormItem>
        </Form>
        {
          dataList.map((item, index) => <CustomerSetForm item={item} index={index} key={item.key} total={dataList.length} ref={(ref) => forms.current[index] = ref} onDel={handleDeleteItem} />)
        }
        {
          dataList.length < 10 && <Button className={`${styles['add-btn']}`} type="primary" onClick={handleClickAdd}>+增加优势</Button>
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