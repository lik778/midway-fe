import * as React from 'react'
import { useState } from 'react'
import { Button, Modal, Select, Upload, message, Dropdown, Menu, Tooltip } from 'antd'
import { UploadOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { TEMPLATE_TYPES, TEMPLATE_FILENAMES } from '../../constants/templates'
import { uploadTemplate, downloadTemplate } from '../../api/template';

const { Option } = Select;

const templateDownloadMenu = () => {

  const handleDownload = async (key) => {
    await downloadTemplate(key, TEMPLATE_FILENAMES[key])
  }

  return (
    <Menu>
      {Object.entries(TEMPLATE_TYPES).map((([key, val] )=> (
        <Menu.Item onClick={() => handleDownload(key)} key={key}>
          下载{val}模板
        </Menu.Item>
      )))}
    </Menu>
  )
}

const UploadModal = ({
  onSuccess
}: {
  onSuccess: () => void
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [type, setType] = useState()
  const [fileList, setFileList] = useState([])
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!type) {
      return message.warn('请选择类型')
    }
    if (fileList.length === 0) {
      return message.warn('请选择要上传的文件')
    }
    setLoading(true)
    const data = await uploadTemplate({ type, file: fileList[0] })
    setLoading(false)
    if (data.success) {
      message.success('上传成功')
      setModalVisible(false)
      onSuccess()
    } else {
      message.error(data?.message ?? '上传失败')
    }
  }

  return (
    <>
      <Button type="primary" onClick={() => setModalVisible(true)}>上传文件</Button>
      <Dropdown overlay={templateDownloadMenu} placement="bottomLeft">
        <Tooltip placement="topLeft" title="Mac系统建议用WPS编辑">
          <Button style={{ marginLeft: 10 }}>模板下载</Button>
        </Tooltip>
      </Dropdown>
      <Button type="link" onClick={() => window.open('https://baixing.yuque.com/yhk2fx/wpg26z/nktk0d', '_blank').opener = null}>
        <QuestionCircleOutlined />
        使用说明
      </Button>
      <Modal
        visible={modalVisible}
        title="上传文件"
        onCancel={() => setModalVisible(false)}
        okText="确认上传"
        onOk={handleUpload}
        okButtonProps={{ loading }}
        destroyOnClose
      >
        <div className="template-form-row">
          <span>模板类型：</span>
          <Select value={type} style={{ width: 120 }} onChange={e => setType(e)} placeholder="请选择类型">
            {Object.entries(TEMPLATE_TYPES).map((([key, val] )=> (
              <Option value={key} key={key}>{val}</Option>
            )))}
          </Select>
        </div>
        <div className="template-form-row">
          <span>选择文件：</span>
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={({ fileList, file }) => {
              if (fileList.length === 0) {
                setFileList([])
                return
              }
              if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
                  && file.type !== 'application/vnd.ms-excel'
                  && (file.type === '' && !file.name.includes('.xlsx'))) { // 兼容Safari
                message.error('文件格式错误')
                return
              }
              setFileList(file.status === 'removed' ? [] : [file])
            }}
            accept=".xls,.xlsx"
          >
            <Button icon={<UploadOutlined />}>点击选择文件</Button>
          </Upload>
        </div>
      </Modal>
    </>
  )
}
export default UploadModal
