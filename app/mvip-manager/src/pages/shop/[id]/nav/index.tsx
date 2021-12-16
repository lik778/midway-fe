import React, { useState, useEffect, useRef } from 'react'
import { useParams } from "umi";
import { Form, Table, Button, FormInstance, Tooltip } from 'antd'
import { UpOutlined, DownOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/lib/table'
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { SHOP_NAMESPACE, shopMapDispatchToProps } from '@/models/shop';
import { ShopInfo } from '@/interfaces/shop';
import BasisHeader from '@/pages/shop/[id]/components/basis-header'
import { ShopBasisType } from '@/enums'
import InputLen from '@/components/input-len'
import { NavListItem } from './data'
import { getNavListingApi, updateNavApi } from '@/api/shop';
import { NavItem } from '@/interfaces/shop';
import { errorMessage, successMessage } from '@/components/message';
import SelectBox from './components/select-box'
import styles from './index.less'
import NavInfoForm from './components/nav-info-form';
import { getImgUploadModelValue } from '@/components/img-upload';

interface Props {
  curShopInfo: ShopInfo | null
  loadingShop: boolean
  setCurShopInfo: (curShopInfo: ShopInfo) => void
}

const ShopNavPage = (props: Props) => {
  const { curShopInfo, loadingShop, setCurShopInfo } = props
  // 获取店铺id
  const params = useParams<{ id: string }>();
  const [dataList, setDataList] = useState<NavListItem[]>([])
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)
  const [selectVisible, setSelectVisible] = useState<boolean>(false)
  const [tab1Data, setTab1Data] = useState<NavItem[]>([])
  const navInfoFormRef = useRef<{ form: FormInstance | null }>({ form: null })

  // form只是做校验使用  所有的修改都会放到dataList中 
  const [form] = Form.useForm()

  // 为了确保每一行的key不同，需要手工给他们添加key，原因在于新建的和已有的在一个列表，所以id不是一定存在的
  const formItemKeyRef = useRef(0)

  const getList = async () => {
    setGetDataLoading(true)
    const res = await getNavListingApi(Number(params.id))
    if (res.success) {
      setTab1Data(res.data.defaultNavigation)
      setDataList(res.data.page.map(item => {
        let key = `${formItemKeyRef.current++}`
        form.setFieldsValue({
          [key]: item.name
        })
        return {
          ...item,
          key: key
        }
      }))
    } else {
      errorMessage(res.message)
    }
    setGetDataLoading(false)
  }

  useEffect(() => {
    getList()
  }, [])

  const handleInputChange = (value: any, record: NavListItem, index: number) => {
    const newDataList = [...dataList]
    newDataList[index].name = value
    setDataList(newDataList)
  }

  // flag 1 下移  -1 上移动
  const handleMoveItem = (record: NavListItem, index: number, flag: -1 | 1) => {
    const newDataList = [...dataList]
    newDataList[index] = newDataList[index + flag]
    newDataList[index + flag] = record
    setDataList(newDataList)
  }

  const handleDelItem = (record: NavListItem, index: number) => {
    setDataList(dataList.filter((cItem, cIndex) => cIndex !== index))
  }

  const columns: ColumnsType<NavListItem> = [
    {
      title: '名称',
      key: 'name',
      render: (value, record, index) => {
        const minNum = 2
        const maxNum = 6
        return (
          <Form.Item name={record.key} rules={[{
            validator: async (rule: any, value: any) => {
              if (!value || value.length === 0) {
                return Promise.reject(`请输入名称`)
              }
              if (value) {
                if (value.length < minNum || value.length > maxNum) {
                  return Promise.reject(`名称字数在${minNum}到${maxNum}个之间`)
                }
              }
              return Promise.resolve()
            }
          }]} labelCol={{
            span: 0
          }}>
            <InputLen onChange={(e) => handleInputChange(e.target.value, record, index)} placeholder={'请输入导航名称'} maxLength={maxNum} minLength={minNum} showCount={true} />
          </Form.Item>
        )
      }
    },
    {
      title: '页面介绍',
      dataIndex: 'desc',
      key: 'desc',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_text, record, index) => {
        if (index > 0) {
          return <div className={styles['action-box']} title="上移">
            {
              index > 1 && <div className={styles['action-btn']} onClick={() => handleMoveItem(record, index, -1)}>
                <UpOutlined />
              </div>
            }
            {
              index < dataList.length - 1 && <div className={styles['action-btn']} onClick={() => handleMoveItem(record, index, 1)} title="下移">
                <DownOutlined />
              </div>
            }
            <div className={styles['action-btn']} onClick={() => handleDelItem(record, index)} title="删除">
              <DeleteOutlined />
            </div>
          </div>
        } else {
          return <></>
        }
      }
    }
  ];

  const validateForm = async () => {
    return Promise.all([navInfoFormRef.current.form?.validateFields(), form.validateFields()])
  }

  const handleSubmit = async () => {
    await validateForm()
    // 要兼容过去没有realName的项
    const requestData = dataList.map(item => {
      const index = tab1Data.findIndex(cItem => cItem.position === item.position)
      if (index !== -1) {
        item.realName = tab1Data[index].name
      }
      return item
    })

    const values = navInfoFormRef.current.form?.getFieldsValue()
    setUpDataLoading(true)
    const res = await updateNavApi(Number(params.id), {
      navVos: requestData,
      slogan: values.slogan,
      qrImg: getImgUploadModelValue(values.qrImg)
    })
    if (res?.success) {
      successMessage(res?.message);
      setCurShopInfo({
        ...curShopInfo!,
        navInfo: {
          slogan: values.slogan,
          qrImg: getImgUploadModelValue(values.qrImg)
        }
      })
    } else {
      errorMessage(res?.message);
    }
    setUpDataLoading(false)
  }

  const handleCloseSelectModal = () => {
    setSelectVisible(false)
  }

  const handleShowSelectModal = () => {
    setSelectVisible(true)
  }

  const handleChangeData = (value: NavItem[]) => {
    setDataList([...dataList, ...value.map(item => {
      let key = `${formItemKeyRef.current++}`
      form.setFieldsValue({
        [key]: item.name
      })
      return {
        ...item,
        realName: item.name,
        key: key
      }
    })])
  }

  return <>
    <BasisHeader {...props} type={ShopBasisType.NAV} />
    <div className="container">
      <NavInfoForm ref={navInfoFormRef} editData={curShopInfo} upDateLoading={upDataLoading}></NavInfoForm>
      <div className={styles['title']}>导航内容设置
        <Tooltip color='#fff' overlayStyle={{ maxWidth: 800 }} overlayInnerStyle={{ color: '#999', padding: '10px 20px' }} title={<img style={{ width: '600px' }} src="//file.baixing.net/202112/aa1e0de9c976ba5a4fa23e6502b10496.png" />} placement='right'>
          <QuestionCircleOutlined className={styles['icon']} />
        </Tooltip></div>
      <Form className={styles['form']} form={form} name="navForm" onFinish={handleSubmit}>
        <Table rowKey={"key"} columns={columns} dataSource={dataList} loading={getDataLoading || upDataLoading} pagination={false}></Table>
        {
          dataList.length < 9 && <Button className={styles['add-btn']} type="primary" disabled={getDataLoading} onClick={handleShowSelectModal}>+添加导航</Button>
        }
        <Button className={styles['submit-btn']} type="primary" disabled={getDataLoading || upDataLoading} htmlType="submit">保存</Button>
      </Form>
    </div>
    <SelectBox selected={dataList} tab1Data={tab1Data} visible={selectVisible} onClose={handleCloseSelectModal} onSubmit={handleChangeData}></SelectBox>
  </>
}



const WrapperShopNavPage: any = connect((state: ConnectState) => {
  const { curShopInfo } = state[SHOP_NAMESPACE]
  const { loading } = state
  return { curShopInfo, loadingShop: loading.models.shop }
}, (dispatch) => {
  return {
    ...shopMapDispatchToProps(dispatch),
  }
})(ShopNavPage)

WrapperShopNavPage.wrappers = ['@/wrappers/path-auth']

export default WrapperShopNavPage
