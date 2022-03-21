import React, { FC, useEffect, useState, useMemo } from 'react';
import { Button, Row, Col, Form } from 'antd';
import { CreateShopParams, ShopInfo } from '@/interfaces/shop';
import { shopInfoForm } from './config';
import WildcatForm from '@/components/wildcat-form';
import { FormConfig, OptionItem } from '@/components/wildcat-form/interfaces';
import { cloneDeepWith } from 'lodash';
import { DomainStatus, ShopIndustryType } from '@/enums/index'
import DomainItem from './components/domain-item'
import styles from './index.less'
import { createShopApi, updateShopApi } from '@/api/shop'
import { successMessage } from '@/components/message'

interface Props {
  ticketId: number;
  shopInfoData: CreateShopParams | null,
  actionType: 'add' | 'edit' | '',
  onCancal: () => void
  handleChangeData: () => void
}

const ShopForm: FC<Props> = (props) => {
  const { ticketId, shopInfoData, actionType, onCancal, handleChangeData } = props
  const [nowDomainType, setNowDomainType] = useState<DomainStatus>()
  const [errMsg, setErrMsg] = useState<string>('')
  const [upDataLoading, setUpdataLoading] = useState<boolean>(false)
  const [config, setConfig] = useState<FormConfig>(cloneDeepWith(shopInfoForm));
  const shopTypeOption: OptionItem[] = [{
    key: '售卖产品（举例：机床、车、房、车床、化工原料等）',
    value: ShopIndustryType.SALE
  }, {
    key: '提供服务（举例：搬家、公司注册、保洁、维修等）',
    value: ShopIndustryType.SERVICE
  }]
  const domainTypeOption: OptionItem[] = [{
    key: '***.shop.baixing.com',
    value: DomainStatus.PREFIX
  }, {
    key: 'shop.baixing.com/***（SEO推荐）',
    value: DomainStatus.SUFFIX
  }]


  const DomainFormItem = useMemo(() => nowDomainType ? <Form.Item label="店铺域名" name='domain' key='domain' required={true} rules={[{ required: true }, { pattern: /^[\s\S]{4,20}$/, message: '4～20个字', }]}>
    <DomainItem type={nowDomainType} disabled={Boolean(actionType === 'edit')} ></DomainItem>
  </Form.Item> : <div key="domain"></div>, [nowDomainType, actionType])

  const createFormData = () => {
    const newChildren = config.children.map(item => {
      if (item.name === 'shopType') {
        item.options = [...shopTypeOption]
        item.disabled = Boolean(actionType === 'edit')
      } else if (item.name === 'domainType') {
        item.options = [...domainTypeOption]
        item.onChange = (value) => {
          setNowDomainType(value)
        }
        item.disabled = Boolean(actionType === 'edit')
      }
      return item
    })
    config.customerFormItemList = [{
      key: 'domain',
      index: 3,
      node: DomainFormItem
    }]
    setConfig({ ...config, children: newChildren })
  }

  useEffect(() => {
    if (shopInfoData?.domainType) {
      setNowDomainType(shopInfoData.domainType)
    }
  }, [shopInfoData])

  useEffect(() => {
    createFormData()
  }, [nowDomainType])

  useEffect(() => {
    createFormData()
  }, [])

  const handleSumbit = async (value: CreateShopParams) => {
    setUpdataLoading(true)
    const { success, message, data } = actionType === 'add' ?
        await createShopApi({...value, ticketId})
      : await updateShopApi({ ...shopInfoData, ...value } as ShopInfo)
    setUpdataLoading(false)
    if (success) {
      successMessage('保存成功')
      handleChangeData()
    } else {
      setErrMsg(message || '出错了')
    }
  }

  return <>
    <div className={styles['error-info']}>{errMsg}</div>
    <WildcatForm
      editDataSource={shopInfoData}
      submit={handleSumbit}
      config={config}
      submitBtn={
        <Row className={styles['footer-btn-container']}>
          <Col span={3}></Col>
          <Col span={21} className={styles['footer-btn-line']}><Button className={styles['btn']}
            onClick={onCancal}>取消</Button><Button loading={upDataLoading} className={styles['btn']}
              type="primary" htmlType="submit">保存</Button></Col>
        </Row>
      }
    />
  </>
}

export default ShopForm

