import * as React from 'react'
import { FC, useEffect, useState } from 'react'
import { UploadFile } from 'antd/lib/upload/interface'
import { Modal, Select, Input, Button, Form, message } from 'antd';
import UpdataModal from './components/UpdataModal'
import { useForm } from 'antd/lib/form/Form';
import { uploadMedia, createMedia } from '../../../../api/bxGallery'
import { MediaCateListItem } from '../../../../interfaces/bxGallery'
import { mockData } from '../../../../utils';

interface Props {
  reloadList: () => void,
  imageTypeList: MediaCateListItem[]
  setMediaTypeList: (imageTypeList: MediaCateListItem[]) => void
}

const AddMedia: FC<Props> = (props) => {
  const { reloadList, imageTypeList, setMediaTypeList } = props
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)

  const [form] = useForm<{
    type: number,
    urls: UploadFile[]
  }>()

  const handleClickBtn = () => {
    setVisible(true)
  }

  const handleCloseModal = () => {
    setVisible(false)
    form.resetFields()
  }

  const createMediaFn = async (file: UploadFile, index, mediaCateId) => {
    try {
      const res = await uploadMedia({
        file: file.originFileObj!,
        ...(window.__upyunImgConfig?.uploadParams)
      })
      const res1 = await createMedia({
        imgUrl: res.url,
        mediaCateId
      })
      if (!res1.success) {
        message.error(`第${index}张图片上传失败！`)
      }
    } catch (e) {
      message.error(`第${index}张图片上传失败！`)
    }
  }

  const handleSubmit = async () => {
    await form.validateFields()
    try {
      setUpDataLoading(true)
      const values = form.getFieldsValue()
      await Promise.all(values.urls.map((item, index) => createMediaFn(item, index, values.type)))
      message.success('本次上传结束')
      reloadList()
      handleCloseModal()
      setUpDataLoading(false)
    } catch (e) {
      message.error('请稍后再试')
      setUpDataLoading(false)
    }

  }

  return <>
    <Button
      type="primary"
      onClick={handleClickBtn}
    >上传图片</Button>
    <Modal
      width="600px"
      visible={visible}
      title="上传图片"
      onCancel={handleCloseModal}
      okText="确认上传"
      onOk={handleSubmit}
      maskClosable={false}
      okButtonProps={{ loading: upDataLoading }}
    >
      <Form form={form} name={"form"}>
        <UpdataModal imageTypeList={imageTypeList} setMediaTypeList={setMediaTypeList} ></UpdataModal>
      </Form>
    </Modal>
  </>
}

export default AddMedia