import React, { FC, useState, useEffect, useMemo } from 'react';
import { useParams, Link } from "umi";
import { Modal, Spin, Button } from 'antd'
import { ConfigItem, SelectProductListItem, SelectArticleListItem, ConfigItemTypeText } from '../../../../data.d';
import styles from './index.less'
import { RouteParams } from '@/interfaces/shop';
import { ArticleListItem, ProductListItem } from '@/interfaces/shop';
import ContentItem from '../content-item'
import ScrollBox from '@/components/scroll-box'
import { errorMessage } from '@/components/message';

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
  const [localValue, setLocalValue] = useState<SelectProductListItem[] | SelectArticleListItem[]>([])
  const typeText = ConfigItemTypeText[componentConfig.type]
  const [dataList, setDataList] = useState<ProductListItem[] | ArticleListItem[]>([])
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)

  const [modalTitle] = useState(<div className={styles['modal-title-container']} key="title">
    选择{typeText}
    <span className={styles['tip']}>（最多可添加{componentConfig.maxLength}个{typeText}）</span>
  </div>)

  // 将暂存的数据拷贝一份到弹窗里，点击提交再更新到表单
  // 每次弹出选择框重置选项
  useEffect(() => {
    setLocalValue([...(value || [])])
  }, [value, modalVisible])


  const localValueObj = useMemo(() => {
    const localValueObj: {
      [key: string]: number
    } = {};
    (localValue || []).forEach((item, index) => {
      localValueObj[item.id] = index + 1
    })
    return localValueObj
  }, [localValue])

  const getDataList = async () => {
    if (page > totalPage) return
    setGetDataLoading(true)
    // TODO;
    const res = await componentConfig.ajaxApi(Number(params.id), { page, contentCateId: 0, size: 10, onlyApprove: true })
    if (res?.success) {
      setDataList([...dataList, ...((componentConfig.type === 'product' ? res.data.productList.result : res.data.articleList.result) || [])] as any[])
      setTotalPage((componentConfig.type === 'product' ? res.data.productList.totalPage : res.data.articleList.totalPage) || 0)
      setPage((page) => page + 1)
    }
    setGetDataLoading(false)
  }

  useEffect(() => {
    getDataList()
  }, [])

  const handleChangeSelect = (selected: boolean, content: SelectProductListItem | SelectArticleListItem) => {
    if (selected) {
      if (componentConfig.maxLength > localValue.length) {
        setLocalValue([...(localValue || []), content])
      } else {
        errorMessage(`最多可添加${componentConfig.maxLength}个${typeText}`)
      }
    } else {
      setLocalValue((localValue || []).filter(item => item.id !== content.id))
    }
  }

  const handleClickSubmit = () => {
    onChange!(localValue)
    setModalVisible(false)
  }

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
          dataList.length > 0 && <ScrollBox className={styles['scroll-box']} scrollY={true} handleScrollToLower={getDataList}>
            <div className={styles[`${componentConfig.type}-content-list`]}>
              {
                dataList.map((item: SelectArticleListItem | SelectProductListItem, index: number) => <ContentItem index={index} type={componentConfig.type} content={item} key={item.id} actionConfig={{
                  delete: false,
                  select: true,
                  draggable: false
                }} handleChangeSelect={handleChangeSelect} selectNum={localValueObj[item.id]}></ContentItem>)
              }
            </div>
          </ScrollBox>
        }
        <div className={styles['footer']}>
          <div className={styles['tip']}>已选择{localValue.length}个{typeText}</div>
          <Button className={styles['updata-btn']} onClick={handleClickSubmit}>提交</Button>
        </div>
      </div>
    </Spin>
  </Modal >
}

export default SelectModal