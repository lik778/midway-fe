import * as React from 'react';
import { useEffect, useState } from 'react';
import { Table, Button, Tooltip, Select, Input, Form, message } from 'antd';
import { SearchShopListItem } from '../../interfaces/switchShopType'
import { getShopListApi, setShopTypeApi } from '../../api/switchShopType'
import { GetShopListParams } from '../../interfaces/switchShopType'
import { ShopTypeText } from '../../constants/switchShopType'
import { ShopType } from '../../enums/switchShopType';
const SwitchShopType = () => {
  const [form] = Form.useForm<GetShopListParams>();
  const [dataList, setDataList] = useState<SearchShopListItem[]>([])
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)
  const [uploadLoading, setUploadLoading] = useState<boolean>(false)
  const columns = [
    { title: '用户id', dataIndex: 'userId', key: 'userId' },
    { title: '店铺id', dataIndex: 'shopId', key: 'shopId' },
    { title: '店铺域名', dataIndex: 'domain', key: 'domain' },
    {
      title: '模板类型', dataIndex: 'type', key: 'type', render: (text: string, record: SearchShopListItem) => ShopTypeText[text]
    },
    {
      title: '操作', key: 'action', render: (text: string, record: SearchShopListItem) =>
        <Button type="primary" disabled={uploadLoading} onClick={() => handleSetShopType(record)}>切换</Button>
    },
  ];

  const getList = async () => {
    const values = form.getFieldsValue()
    if (values.userId || values.shopId || values.domain) {
      setGetDataLoading(true)
      const res = await getShopListApi(values)
      setGetDataLoading(false)
      setDataList(res)
    } else {
      message.error('请至少输入一个搜索项！')
    }
  }

  const handleSetShopType = async (record: SearchShopListItem) => {
    console.log('handleSetShopType:', record);
    setUploadLoading(true)
    const res = await setShopTypeApi({
      id: record.shopId
    })
    message.success('操作成功')

    const newDataList = dataList.map(item => {
      if (item.shopId === record.shopId) {
        return {
          ...item,
          type: record.type === ShopType.B2B ? ShopType.B2C : ShopType.B2B
        }
      } else {
        return item
      }
    })
    setDataList(newDataList)
    setUploadLoading(false)
  }

  return (<>
    <Form layout="inline" form={form} style={{ marginBottom: 32 }} onFinish={getList}>
      <Form.Item
        label="用户id"
        name="userId"
      >
        <Input placeholder="请输入用户id" />
      </Form.Item>
      <Form.Item
        label="店铺id"
        name="shopId"
      >
        <Input placeholder="请输入店铺id" />
      </Form.Item>
      <Form.Item
        label="店铺域名"
        name="domain"
      >
        <Input placeholder="请输入店铺域名" />
      </Form.Item>
      <Form.Item >
        <Button
          type="primary"
          htmlType="submit"
        >查询</Button>
      </Form.Item>
    </Form>
    <Table rowKey="shopId" loading={getDataLoading || uploadLoading} dataSource={dataList} columns={columns} pagination={false} />
  </>)
}


export default SwitchShopType
