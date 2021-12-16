import React, { FC, useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'umi'
import { Checkbox, Row, Col } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { NavItem } from '@/interfaces/shop';
import styles from './index.less'
import { NavListItem } from '../../../../data';
import { TabKey } from '../../data'
import { errorMessage } from '@/components/message';

interface Props {
  tabKey: TabKey
  dataList: NavItem[]
  selected: NavListItem[]
  disabled: boolean
  visible: boolean
  onChange: (tabkey: TabKey, value: NavItem[]) => void
}

const SelectTab: FC<Props> = (props) => {
  // 获取店铺id
  const params = useParams<{ id: string }>();
  const { dataList, selected, tabKey, disabled, visible, onChange } = props
  const [checkValue, setCheckValue] = useState<(string | number)[]>([])

  useEffect(() => {
    onChange(tabKey, dataList.filter(item => checkValue.includes(item.id)))
  }, [checkValue])

  const showList = useMemo(() => {
    if (tabKey === "1") {
      const data = dataList.filter(item => selected.every(cItem => cItem.position !== item.position))
      return data
    } else if (tabKey === "2") {
      const data = dataList.filter(item => selected.every(cItem => cItem.position !== 'productCatePage' || (cItem.position === 'productCatePage' && cItem.id !== item.id)))
      return data
    } else if (tabKey === "3") {
      // TODO; 这里不是 articleListPage  是 articleCatePage
      const data = dataList.filter(item => selected.every(cItem => cItem.position !== 'articleCatePage' || (cItem.position === 'articleCatePage' && cItem.id !== item.id)))
      return data
    } else {
      return []
    }
  }, [dataList, selected, tabKey])

  const typeTextEnum: {
    [key in TabKey]: string
  } = {
    '1': '推荐页面',
    '2': '产品/服务',
    '3': '文章'
  }

  const linkUrlEnum: {
    [key in TabKey]: string
  } = {
    '1': '',
    '2': `/shop/${params.id}/product`,
    '3': `/shop/${params.id}/article`
  }

  const tipTextEnum: {
    [key in TabKey]: string
  } = {
    '1': `暂无可选${typeTextEnum[tabKey]}`,
    '2': `暂无${typeTextEnum[tabKey]}内容，你可以新建${typeTextEnum[tabKey]}`,
    '3': `暂无${typeTextEnum[tabKey]}内容，你可以新建${typeTextEnum[tabKey]}`
  }

  const handleChangeSelect = (checkedValue: (string | number | boolean)[]) => {

    if (disabled && (checkValue.length < checkedValue.length)) {
      errorMessage('导航项已达上限')
      return
    }
    setCheckValue(checkedValue as string[])
  }

  return <div className={styles['select-tab-container']}>
    {
      showList.length === 0 && <>
        <div className="no-list-data" style={{ marginTop: '100px' }}>
          {
            ["2", "3"].includes(tabKey) && <img src={tabKey === '2' ? '//file.baixing.net/202012/6b1ce056c5c675ec3a92e8e70fed06ed.png' : '//file.baixing.net/202012/de46c0eceb014b71d86c304b20224032.png'} />
          }
          <p>{tipTextEnum[tabKey]}</p>
          {
            linkUrlEnum[tabKey] && <Link className={styles['btn']} to={linkUrlEnum[tabKey]}>
              + 新建{typeTextEnum[tabKey]}
            </Link>
          }
        </div>
      </>
    }
    <Checkbox.Group style={{ display: 'block' }} value={checkValue} onChange={handleChangeSelect}>
      <Row gutter={16}>
        {
          showList.map(item => <Col className={styles['Col']} span={8} key={item.id}><Checkbox value={item.id}>{item.name}</Checkbox></Col>)
        }
      </Row>
    </Checkbox.Group>
  </div>
}

export default SelectTab