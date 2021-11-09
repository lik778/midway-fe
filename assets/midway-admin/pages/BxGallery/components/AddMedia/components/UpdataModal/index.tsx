import * as React from 'react'
import { FC, useEffect, useState, ChangeEventHandler } from 'react'
import { Button, Select, Input, Form, Divider, message } from 'antd';
import { MediaCateListItem } from '../../../../../../interfaces/bxGallery'
import { getMediaCate, createMediaCate } from '../../../../../../api/bxGallery'
import UpFile from './components/UpFile'

import { mockData } from '../../../../../../utils/index'
const FormItem = Form.Item;
const Option = Select.Option;
const { Search } = Input;

interface Props {
  imageTypeList: MediaCateListItem[]
  setMediaTypeList: (imageTypeList: MediaCateListItem[]) => void
}

const UpdataModal: FC<Props> = (props) => {
  const { imageTypeList, setMediaTypeList } = props
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)

  const [newType, setNewType] = useState<string>('')

  const handleChangeInpnt: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.persist()
    setNewType(e.target.value)
  }

  const handleClickAddType = async () => {
    if (!newType || newType.length <= 1) {
      message.error('请输入相册名！')
      return
    }
    if (imageTypeList.some(item => item.name === newType)) {
      message.error('请勿输入重复名称！')
      return
    }
    setUpDataLoading(true)
    const res = await createMediaCate({ name: newType })
    if (res.success) {
      message.success('添加成功')
      setMediaTypeList([res.data, ...imageTypeList])
      setNewType('')
    } else {
      message.error(res.message)
    }
    setUpDataLoading(false)
  }

  return <>
    <FormItem label='选择相册' name="type" rules={[{ required: true, message: '请选择相册' }]}>
      <Select
        style={{ width: 240 }}
        placeholder="请选择相册"
        dropdownRender={menu => (
          <>
            {menu}
            <Divider style={{ margin: '4px 0' }} />
            <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
              <Search value={newType} loading={upDataLoading} onChange={handleChangeInpnt} onSearch={handleClickAddType} enterButton={"添加相册"} />
            </div>
          </>
        )}
      >
        {
          imageTypeList.map(item => <Option value={item.id} key={item.id}>{item.name}</Option>)
        }
      </Select>
    </FormItem>
    <FormItem label='选择图片' name="urls" extra="单次最多上传10张" rules={[{ required: true, message: '请选择图片' }]}>
      <UpFile></UpFile>
    </FormItem>
  </>
}

export default UpdataModal