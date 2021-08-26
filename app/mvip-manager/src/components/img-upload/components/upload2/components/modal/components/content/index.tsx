import React, { useState, FC, useContext } from 'react';
import { Tabs } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import styles from './index.less'
import Album from './components/album'
import LocalUpload from './components/local-upload'
import ImgUploadContext from '@/components/img-upload/context'
import { TabsKeys } from './data'
const { TabPane } = Tabs

const ModalContent: FC = () => {
  const context = useContext(ImgUploadContext)
  const [tabsCurrent, setTabsCurrent] = useState<TabsKeys>('本地上传')
  const { handleChangeAlbumVisible } = context

  return <div className={styles['modal-content']}>
    <Tabs defaultActiveKey={tabsCurrent} size="large" onChange={(key) => setTabsCurrent(key as TabsKeys)}>
      <TabPane tab="本地上传" key="本地上传">
        <LocalUpload></LocalUpload>
      </TabPane>
      <TabPane tab="百姓图库" key="百姓图库">
        <Album tabsCurrent={tabsCurrent} tabKey="百姓图库" mediaType="IMAGE"></Album>
      </TabPane>
      <TabPane tab="我的图库" key="我的图库">
        <Album tabsCurrent={tabsCurrent} tabKey="我的图库" mediaType="IMAGE"></Album>
      </TabPane>
      <TabPane tab="我的视频" key="我的视频">
        <Album tabsCurrent={tabsCurrent} tabKey="我的视频" mediaType="VIDEO"></Album>
      </TabPane>
    </Tabs>
    <CloseOutlined className={styles['close']} onClick={() => handleChangeAlbumVisible(false)}></CloseOutlined>
  </div>
}
export default ModalContent