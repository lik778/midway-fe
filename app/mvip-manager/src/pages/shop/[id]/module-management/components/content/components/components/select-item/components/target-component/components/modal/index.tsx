import React, { FC, useState, useEffect, useMemo } from 'react';
import { useParams, Link } from "umi";
import { Modal, Spin, Button } from 'antd'
import { ConfigItem, SelectProductListItem, SelectArticleListItem, ConfigItemTypeText } from '../../../../data.d';
import styles from './index.less'
import { RouteParams } from '@/interfaces/shop';
import { ArticleListItem, ProductListItem } from '@/interfaces/shop';
import ContentItem from '../content-item'

interface Props {
  value?: SelectProductListItem[] | SelectArticleListItem[]; // Form.Item提供
  onChange?: (value: SelectProductListItem[] | SelectArticleListItem[]) => void; // Form.Item提供
  modalVisible: boolean
  componentConfig: ConfigItem
  setModalVisible: (visible: boolean) => void
}

const SelectModal: FC<Props> = (props) => {
  // 获取店铺id
  const params: RouteParams = useParams();
  const { value, onChange, modalVisible, componentConfig, setModalVisible } = props
  const typeText = ConfigItemTypeText[componentConfig.type]
  const [dataList, setDataList] = useState<ProductListItem[] | ArticleListItem[]>([])
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(1);
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)

  const [modalTitle] = useState(<div className={styles['modal-title-container']} key="title">
    选择{typeText}
    <span className={styles['tip']}>（最多可添加{componentConfig.maxLength}个{typeText}）</span>
  </div>)

  const getDataList = async () => {
    if (page > total) return
    setGetDataLoading(true)
    const res = await componentConfig.ajaxApi(Number(params.id), { page, contentCateId: 0, size: 10 })
    if (res?.success) {
      setDataList([...dataList, ...((componentConfig.type === 'product' ? res.data.productList.result : res.data.articleList.result) || [])] as any[])
      setTotal((componentConfig.type === 'product' ? res.data.productList.totalRecord : res.data.articleList.totalRecord) || 0)
    }
    setGetDataLoading(false)
  }

  useEffect(() => {
    getDataList()
  }, [])


  return <Modal
    className={styles['select-item-modal']}
    title={modalTitle}
    onCancel={() => setModalVisible(false)}
    footer={null}
    visible={modalVisible}
    width={940}
  >
    <Spin spinning={getDataLoading}>
      <div className={styles['select-item-modal-container']}>
        {
          dataList.length === 0 && <>
            <div className="no-list-data" style={{ marginTop: '100px' }}>
              <img src={componentConfig.type === 'product' ? '//file.baixing.net/202012/6b1ce056c5c675ec3a92e8e70fed06ed.png' : '//file.baixing.net/202012/de46c0eceb014b71d86c304b20224032.png'} />
              <p>暂无{typeText}内容，你可以新建{typeText}</p>
              <Link className={styles['btn']} to={`/shop/${params.id}/${componentConfig.type}`}>
                + 新建{typeText}
              </Link>
            </div>
          </>
        }
        {
          dataList.length > 0 && <div className={styles['content-list']}>
            {
              dataList.map((item: any) => <ContentItem type={componentConfig.type} content={item}></ContentItem>)
            }
          </div>
        }
        <div className={styles['footer']}>
          <div className={styles['tip']}>已选择{value ? value.length + 1 : 0}个{typeText}</div>
          <Button className={styles['updata-btn']}>提交</Button>
        </div>
      </div>
    </Spin>
  </Modal >
}

export default SelectModal