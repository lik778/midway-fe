import React, { FC, useState, useEffect, useMemo } from 'react'
import { Button, Select, Row, Col, Spin } from 'antd';
import { useParams } from 'umi'
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { successMessage } from '@/components/message';
import { SHOP_NAMESPACE } from '@/models/shop';
import { ProductType, IndursyModule } from '@/enums';
import { ShopInfo, ModulePageType, ModuleComponentId, ContactStyleType, ContactType } from '@/interfaces/shop'
import { SetMessageModule, getModuleInfoApi } from '@/api/shop'
import { useDebounce } from '@/hooks/debounce';
import { idTemplate4 } from '@/utils'
import styles from './index.less'
import { Option1, Option2, Urls, InduryItem } from './config'

const { Option } = Select;

interface Iprop {
  position: ModulePageType
  pageModule: ModuleComponentId
  curShopInfo?: ShopInfo | null
}

const HomeMessage: FC<Iprop> = (props) => {
  const { position, pageModule, curShopInfo } = props
  const [getData, setGetData] = useState<boolean>(false)
  const [upDate, setUpDate] = useState<boolean>(false)
  const [selectItem, setSelectItem] = useState<ContactType>('HUANGJIN')
  const { id: shopId } = useParams<{ id: string }>()
  const selectOption = useMemo(() => {
    if (curShopInfo) {
      const { type } = curShopInfo;
      return (Boolean(type === ProductType.B2B) ? Option1 : Option2).map((item, index) => {
        return (
          <Option value={item.key} key={index}>{item.value}</Option>
        )
      })
    }
    return []
  }, [curShopInfo])

  const getContact = async () => {
    setGetData(true)
    const res = await getModuleInfoApi<ContactStyleType>(Number(shopId), {
      position, pageModule
    })
    const { styleType }: any = res.data
    setSelectItem(styleType)
    setGetData(false)
  }

  useEffect(() => {
    console.log(curShopInfo,12)
    getContact()
  }, [curShopInfo])

  const handleChange = (item: ContactType) => {
    setSelectItem(item)
  }
  const handleSubmit = useDebounce(async () => {
    setUpDate(true)
    const res = await SetMessageModule(Number(shopId), {
      pageModule,
      position,
      styleType: selectItem
    })
    successMessage('保存成功')
    setUpDate(false)
  }, 300)
  return <Spin spinning={getData || upDate}>
    <div className={styles['home-message']}>
      <div className={styles['module-select']}>
        <p> <span className={styles['tip-i']}>*</span>&nbsp;行业模板：</p>
        <Select onChange={handleChange} value={selectItem} style={{ width: 200 }}>
          {
            selectOption
          }
        </Select>
      </div>
      <div className={styles['img-module']}>
        <p className={styles['img-title']}><span className={styles['tip-i']}>*</span>&nbsp;整体样式查看：</p>
        <img src={ idTemplate4(curShopInfo?.templateId) && selectItem === 'B2B_NORMAL' ?  Urls['NEW_B2B_NORMAL'] : Urls[selectItem]} alt="logo" />
      </div>
      <div className={styles['save-btn']}>
        <Row>
          <Col span={4}>
            <Button type="primary" size="large" className={styles['btn']} onClick={handleSubmit}> 保存</Button>
          </Col>
        </Row>
      </div>
    </div>
  </Spin>
}
export default connect((state: ConnectState) => {
  const { curShopInfo } = state[SHOP_NAMESPACE]
  return { curShopInfo }
})(HomeMessage)