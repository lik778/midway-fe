import React, { FC, useEffect, useState, useContext } from 'react';
import { Form, Modal, Button, Checkbox, Spin } from 'antd';
import { FragmentsListItem, MaterialListItem } from '@/interfaces/ai-module';
import { CollectionFragmentsType } from '@/enums/ai-module'
import { collectionFragmentsTypeMap } from '@/constants/ai-module'
import { createFragments, getMaterialList, updateFragments, batchAddFragment } from '@/api/ai-module'
import styles from './index.less'
import { errorMessage, successMessage } from '@/components/message';
import AiModuleContext from '../../../../../../../context'
import MaterialTag from './components/material-tag'
import ScrollBox from '@/components/scroll-box'

const CheckboxGroup = Checkbox.Group

interface Props {
  collectionId: number,
  type: CollectionFragmentsType,
  addFragment: (fragments: FragmentsListItem[]) => void
  visible: boolean,
  onCancel: () => void
}

const SpeedAdd: FC<Props> = (props) => {
  const { postToolFormData } = useContext(AiModuleContext)
  const { collectionId, type, addFragment, visible, onCancel } = props
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [tags, setTags] = useState<string[]>([])
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)
  const [dataList, setDataList] = useState<MaterialListItem[]>([])

  const [checkIds, setCheckIds] = useState<string[]>([])

  const handleClickSubmit = async () => {
    if (checkIds.length > 0) {
      setUpDataLoading(true)
      const res = await batchAddFragment({ id: collectionId, type, materialIds: checkIds })
      addFragment(res.data)
      setUpDataLoading(false)
    }
    onCancel()
  }

  const onTagChange = (tags: string[]) => {
    setPage(1)
    setTotalPage(1)
    setDataList([])
    setCheckIds([])
    setTags(tags)
  }

  useEffect(() => {
    getDataList()
  }, [tags])

  const getDataList = async () => {
    if (tags.length <= 0) return
    if (page > totalPage) return
    setGetDataLoading(true)
    const res = await getMaterialList({ page, size: 10, tags, category: postToolFormData[collectionId].metas[1]?.value || '' })
    if (res.data && res.data.content) {
      setDataList([...dataList, ...res.data.content])
      setPage(page + 1)
      setTotalPage(res.data.totalPage)
    }
    setGetDataLoading(false)
  }

  const handleChangeCheck = (checkedValues: any[]) => {
    setCheckIds(checkedValues)
  }

  return <Modal
    title={collectionFragmentsTypeMap[type]}
    visible={visible}
    width={'60%'}
    maskClosable={false}
    footer={
      <div>
        <Button disabled={upDataLoading} onClick={onCancel}>取消</Button>
        <Button disabled={upDataLoading} onClick={handleClickSubmit} type="primary">
          确认添加
        </Button>
      </div>
    }
    onCancel={onCancel}
    destroyOnClose={true}
  >
    <div>
      <MaterialTag visible={visible} onTagChange={onTagChange} />
      <ScrollBox height={"60vh"} scrollY handleScrollToLower={getDataList}>
        {
          dataList.length === 0 && !getDataLoading && <div className={styles["empty-info"]}>
            <img src="//file.baixing.net/202012/6b1ce056c5c675ec3a92e8e70fed06ed.png" />
            <p>暂未搜索到，请选择更多标签。</p>
          </div>
        }
        <Spin spinning={getDataLoading}>
          <CheckboxGroup className={styles['row']} onChange={handleChangeCheck} value={checkIds}>
            {
              dataList.map(item => <div className={styles['col']} key={item.id}>
                <Checkbox value={item.id}></Checkbox>
                <div className={styles['text']} dangerouslySetInnerHTML={{ __html: item.content }}>
                </div>
              </div>)
            }
          </CheckboxGroup>
        </Spin>
      </ScrollBox>
    </div>
  </Modal>
}

export default SpeedAdd

