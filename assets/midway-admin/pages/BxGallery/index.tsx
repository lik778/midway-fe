import * as React from 'react'
import { FC, useEffect, useState, useRef } from 'react'
import { Button, message, Form, Spin, Select, Table, } from 'antd';
import { ZoomInOutlined } from "@ant-design/icons"
import { useForm } from 'antd/lib/form/Form';
import { getMediaList, getMediaCate, delMedias } from '../../api/bxGallery';
import { MediaCateListItem, MediaInfoListItem } from '../../interfaces/bxGallery';
import { mockData } from '../../utils';
import PreviewImage from '../../components/PreviewImage'
import './index.css'
import AddMedia from './components/AddMedia';
const { Option } = Select

interface Props {
  reloadListFlag: boolean
  setReloadListFlag: (data: boolean) => void
}

const DataTable: FC<Props> = (props) => {
  const { setReloadListFlag, reloadListFlag } = props
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)
  const [dataList, setDataList] = useState<MediaInfoListItem[]>([])
  const [page, setPage] = useState<number>(1)
  const [totalRecord, setTotalRecord] = useState<number>(1)

  const [previewURL, setPreviewURL] = useState<string | undefined>();
  const [visiblePreviewModal, setVisiblePreviewModal] = useState(false);
  const [form] = useForm()
  const [imageTypeList, setMediaTypeList] = useState<MediaCateListItem[]>([])
  const [delIds, setDelIds] = useState<number[]>([])
  const delKeyMap = useRef<{ [key: string]: boolean }>({})

  const getMediaCateFn = async () => {
    setGetDataLoading(true)
    const res = await getMediaCate()
    setMediaTypeList(res.data)
    setGetDataLoading(false)
  }

  useEffect(() => {
    getMediaCateFn()
  }, [])

  const initList = () => {
    if (page === 1) {
      getList()
    } else {
      setPage(1)
    }
  }

  const getList = async () => {
    setGetDataLoading(true)
    const values = form.getFieldValue('cateId')
    const res = await getMediaList({ page, size: 10, mediaCateId: values })
    if (res.success) {
      setDataList(res.data.managerMediaImgBos.result || [])
      if (res.data.managerMediaImgBos.totalRecord !== totalRecord) {
        setTotalRecord(res.data.managerMediaImgBos.totalRecord)
      }
    } else {
      message.error(res.message)
    }
    setGetDataLoading(false)
  }

  const delMediasFn = async () => {
    setUpDataLoading(true)
    const res = await delMedias({
      ids: delIds
    })
    if (res.success) {
      setDelIds([])
      delKeyMap.current = {}
      message.success('删除成功')
      if (dataList.length === 1 && page > 1) {
        setPage(page - 1)
      } else {
        getList()
      }
    } else {
      message.error(res.message)
    }
    setUpDataLoading(false)
  }

  useEffect(() => {
    setDelIds([])
    delKeyMap.current = {}
    getList()
  }, [page])

  const previewMedia = (url: string) => {
    setPreviewURL(url)
    setVisiblePreviewModal(true)
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    {
      title: '图片预览',
      dataIndex: 'imgUrl',
      key: 'imgUrl',
      render: src => {
        return (
          <div className="preview-img-con">
            <img className="preview-sm-image" src={src} />
            <div className="mask" onClick={() => previewMedia(src)}>
              <ZoomInOutlined />
            </div>
          </div>
        )
      }
    },
    {
      title: '上传时间', dataIndex: 'createdTime', key: 'createdTime', render: (data) => {
        const time = new Date(data * 1000)
        return `${time.getFullYear()}-${time.getMonth()}-${time.getDate()} ${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}`
      }
    },
    {
      title: '上传用户ID', dataIndex: 'usrId', key: 'usrId', render: (data) => {
        if (data === 0) {
          return ' '
        } else {
          return data
        }
      }
    }
  ]

  const handleClosePreviewModal = () => {
    setVisiblePreviewModal(false)
  }

  const rowSelection = {
    selectedRowKeys: delIds,
    // hideSelectAll: true,
    selections: undefined,
    onChange: (selectedRowKeys: any[], selectedRows: MediaInfoListItem[]) => {
      setDelIds(selectedRowKeys)
    },
    onSelect: (record: MediaInfoListItem, selected: boolean) => {
      delKeyMap.current[(record as MediaInfoListItem).id] = selected
    },
    onSelectAll: (selected: boolean, selectedRows: MediaInfoListItem[], changeRows: MediaInfoListItem[]) => {
      if (selected) {
        dataList.forEach(item => {
          delKeyMap.current[item.id] = selected
        })
      } else {
        delKeyMap.current = {}
      }
    },
    onSelectNone: () => {
      delKeyMap.current = {}
    }
  }

  return <div className={'page-info-image'}>
    <Form layout="inline" form={form} style={{ marginBottom: 32 }} onFinish={initList}>
      <Form.Item
        label="相册"
        name="cateId"
      >
        <Select
          placeholder={"选择相册进行筛选"}
          allowClear
          style={{ width: 300 }}
        >
          {
            imageTypeList.map(item => <Option value={item.id} key={item.id}>{item.name}</Option>)
          }
        </Select>
      </Form.Item>
      <Form.Item >
        <Button
          type="primary"
          htmlType="submit"
        >查询</Button>
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          disabled={delIds.length === 0 || upDataLoading}
          onClick={delMediasFn}
        >删除图片</Button>
      </Form.Item>
      <Form.Item>
        <AddMedia reloadList={initList} imageTypeList={imageTypeList} setMediaTypeList={setMediaTypeList}></AddMedia>
      </Form.Item>
    </Form>
    <Spin spinning={getDataLoading}>
      <Table
        rowKey="id"
        loading={getDataLoading}
        dataSource={dataList}
        columns={columns}
        rowSelection={rowSelection}
        pagination={{
          pageSize: 10,
          current: page,
          total: totalRecord,
          onChange: (page, pageSize) => {
            setPage(page)
          }
        }}
      />
    </Spin>
    <PreviewImage visible={visiblePreviewModal} url={previewURL} onClose={handleClosePreviewModal}></PreviewImage>
  </div>
}

export default DataTable