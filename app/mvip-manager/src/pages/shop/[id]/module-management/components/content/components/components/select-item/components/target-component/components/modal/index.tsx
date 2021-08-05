import React, { FC, useState, useEffect, useMemo } from 'react';
import { useParams } from "umi";
import { Modal } from 'antd'
import { ConfigItem, SelectProductListItem, SelectArticleListItem, ConfigItemTypeText } from '../../../../data.d';
import styles from './index.less'
import { RouteParams } from '@/interfaces/shop';
import { ArticleListItem, ProductListItem } from '@/interfaces/shop';
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

  const modalTitle = useState(<div className={styles['modal-title-container']}>
    选择{ConfigItemTypeText[componentConfig.type]}
    <span className={styles['tip']}>（最多可添加{componentConfig.maxLength}个{ConfigItemTypeText[componentConfig.type]}）</span>
  </div>)

  const modalFooter = useMemo<null | React.ReactDOM>(() => {

    return null
  }, [])

  const [dataList, setDataList] = useState<ProductListItem[] | ArticleListItem[]>([])
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number | null>(null);
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)
  const getDataList = async () => {
    setGetDataLoading(true)
    // const res = await componentConfig.ajaxApi(Number(params.id), { page, contentCateId, size: 10 })
    // if (res?.success) {
    //   setProductList(addKeyForListData(res.data.productList.result, page) || [])
    //   setCateList(addKeyForListData(res.data.cateList) || [])
    //   setTotal(res.data.productList.totalRecord)
    // }
    setGetDataLoading(false)
  }

  return <Modal
    title={modalTitle}
    onCancel={() => setModalVisible(false)}
    footer={modalFooter}
    visible={modalVisible}
  >
    123
  </Modal>
}

export default SelectModal