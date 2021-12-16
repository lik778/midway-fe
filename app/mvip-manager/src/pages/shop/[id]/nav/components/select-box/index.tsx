import React, { FC, useState, useEffect, useMemo } from 'react';
import { useParams } from "umi";
import { Tabs, Spin, Modal, Button } from 'antd'
import { NavItem } from '@/interfaces/shop';
import SelectTab from './components/select-tab';
import { getSelectNavListApi } from '@/api/shop'
import { NavListItem } from '../../data';
import { TabKey } from './data'
import styles from './index.less'

const { TabPane } = Tabs


interface Props {
  selected: NavListItem[]
  tab1Data: NavItem[]
  visible: boolean,
  onClose: () => void
  onSubmit: (dataList: NavItem[]) => void
}

const SelectBox: FC<Props> = (props) => {
  // 获取店铺id
  const params = useParams<{ id: string }>();
  const { selected, tab1Data, visible, onClose, onSubmit } = props
  const [currentKey, setCurrentKey] = useState<TabKey>('1')
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false)

  const [dataLists, setDataLists] = useState<{
    [key in TabKey]: NavItem[]
  }>({
    '1': [],
    '2': [],
    '3': []
  })

  // 存放三个tab的勾选项 分开放 提交的时候再合并 不然中间更新的时候太麻烦了
  const [selectValue, setSelectVale] = useState<{
    [key in TabKey]: NavItem[]
  }>({
    '1': [],
    '2': [],
    '3': []
  })

  const checkboxDisabled = useMemo(() => {
    const max = 9
    return max - selected.length - selectValue['1'].length - selectValue['2'].length - selectValue['3'].length <= 0
  }, [selected, selectValue])

  useEffect(() => {
    if (Array.isArray(tab1Data)) {
      setDataLists(Object.assign(dataLists, {
        '1': tab1Data
      }))
    }
  }, [tab1Data])

  useEffect(() => {
    if (!visible) {
      setSelectVale(Object.assign(selectValue, {
        '1': [],
        '2': [],
        '3': []
      }))
    }
  }, [visible])

  const getSelectData = async () => {
    setGetDataLoading(true)
    const res = await getSelectNavListApi(Number(params.id))
    if (res.success) {
      setDataLists(Object.assign(dataLists, {
        '2': res.data.productCate,
        '3': res.data.articleCate,
      }))
    }
    setGetDataLoading(false)
  }

  useEffect(() => {
    getSelectData()
  }, [])

  const handleChangeTabKey = (key: string) => {
    setCurrentKey(key as TabKey)
  }

  const handleChangeSelect = (tabkey: TabKey, value: NavItem[]) => {
    setSelectVale({
      ...selectValue,
      [tabkey]: value
    })
  }

  const handleSubmit = () => {
    onSubmit([...selectValue['1'], ...selectValue['2'], ...selectValue['3']])
    onClose()
  }

  return <>
    <Modal
      className={styles['select-modal']}
      title={<div>添加导航<span className={styles["modal-tip"]}>店铺导航区最多可设置9项一级内容，建议不超过7项，5-7项最佳</span></div>}
      visible={visible}
      onCancel={onClose}
      width={800}
      onOk={handleSubmit}
      destroyOnClose={true}
    >
      <Spin spinning={getDataLoading}>
        <Tabs defaultActiveKey={currentKey} onChange={handleChangeTabKey}>
          <TabPane tab="推荐页面" key="1">
            <SelectTab dataList={dataLists['1']} selected={selected} tabKey="1" onChange={handleChangeSelect} disabled={checkboxDisabled} visible={visible}></SelectTab>
          </TabPane>
          <TabPane tab="产品/服务分类" key="2">
            <SelectTab dataList={dataLists['2']} selected={selected} tabKey="2" onChange={handleChangeSelect} disabled={checkboxDisabled} visible={visible}></SelectTab>
          </TabPane>
          <TabPane tab="文章分类" key="3" >
            <SelectTab dataList={dataLists['3']} selected={selected} tabKey="3" onChange={handleChangeSelect} disabled={checkboxDisabled} visible={visible}></SelectTab>
          </TabPane>
        </Tabs>
      </Spin>
    </Modal>
  </>
}

export default SelectBox