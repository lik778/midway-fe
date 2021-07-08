import React, { useCallback, useEffect, useMemo, useState, FC, useContext } from 'react';
import { Spin, Tabs } from 'antd'
import styles from './index.less'
import Atlas from './components/atlas'
import LocalUpload from './components/local-upload'
import ImgUploadContext  from '@/components/img-upload/context'
import { TabsKeys } from './data'
const { TabPane } = Tabs

const ModalContent: FC = () => {
  const context = useContext(ImgUploadContext)
  const { loadingShopModel } = context
  const [tabsCurrent, setTabsCurrent] = useState<TabsKeys>('本地上传')

  return <Spin spinning={loadingShopModel}>
    <div className={styles['modal-content']}>
      <Tabs defaultActiveKey={tabsCurrent} size="large" onChange={(key) => setTabsCurrent(key as TabsKeys)}>
        <TabPane tab="本地上传" key="本地上传">
          <LocalUpload></LocalUpload>
        </TabPane>
        <TabPane tab="百姓图库" key="百姓图库">
          <Atlas tabsCurrent={tabsCurrent} tabKey="百姓图库"></Atlas>
        </TabPane>
        <TabPane tab="我的图库" key="我的图库">
          <Atlas tabsCurrent={tabsCurrent} tabKey="我的图库"></Atlas>
        </TabPane>
      </Tabs>
    </div>
  </Spin>
}
export default ModalContent