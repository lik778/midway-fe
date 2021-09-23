import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'antd';
import { cloneDeepWith } from 'lodash';
import ShopBasisTab from '../shop-basis-tab';
import MainTitle from '@/components/main-title';
import WildcatForm from '@/components/wildcat-form';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import CheckoutGroup from '@/components/checkout-group'
import { RecordForm } from './config'
import { ShopBasisType } from '@/enums';
import { Link, useParams } from 'umi';
import { ShopInfo } from '@/interfaces/shop';
import './index.less';
import { connect, Dispatch } from 'dva';
import { GET_CUR_SHOP_INFO_ACTION, SHOP_NAMESPACE } from '@/models/shop';

interface Props {
  type: ShopBasisType;
  curShopInfo?: ShopInfo | null;
  dispatch: Dispatch;
}

const BasicHeader = (props: Props) => {
  const { type, curShopInfo } = props
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editData, setEditData] = useState<any>(null)
  const [formLoading, setFormLoading] = useState<boolean>(false)
  // const [formConfig, setformConfig] = useState<FormConfig>(() => {
  //   formConfig = cloneDeepWith(RecordForm)
  //   formConfig.customerFormItemList = [{
  //     index: 2,
  //     key: 'checkbox',
  //     node: <CheckoutGroup />
  //   }]
  //   return formConfig
  // })
  const [formConfig, setformConfig] = useState<FormConfig>(RecordForm)
  const { id } = useParams<{ id: string }>()
  useEffect(() => {
    props.dispatch({ type: `${SHOP_NAMESPACE}/${GET_CUR_SHOP_INFO_ACTION}`, id: Number(id) })
  }, [])
  const showModal = () => {
    setIsModalVisible(true)
  }
  const handleOk = () => {
    setIsModalVisible(false)
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const creatTitle = () => {
    return (
      <p>您好！以下是您对<span className='diamond-company'>钻石店铺的意见反馈</span></p >
    )
  }
  const sumbit = (values: any) => {
    console.log(values)
  }
  return (
    <>
      <div className="basis-header">
        {
          curShopInfo?.name && <>
            <Link className="arrow" to="/shop"></Link>
            <MainTitle title={curShopInfo?.name} />
            <a className="feed-back" href="#" onClick={showModal}>我要吐槽</a>
            <a className="visit-online" href={curShopInfo?.shopDomain} target="_blank">访问线上</a>
          </>
        }

        <ShopBasisTab type={type} />
      </div>
      <Modal
        title={creatTitle()}
        visible={isModalVisible}
        onOk={handleOk}
        style={{ top: 300 }}
        onCancel={handleCancel}
        width={1000}
      >
        <div className="diamond-form">
          <Form.Item>
            <WildcatForm
              editDataSource={editData}
              config={formConfig}
              submit={sumbit}
              loading={formLoading}
            />
          </Form.Item>
        </div>
      </Modal>
    </>
  );
}

const mapStateToProps = (state: any): any => {
  const { curShopInfo } = state[SHOP_NAMESPACE];
  return { curShopInfo }
}

export default connect<{ curShopInfo: ShopInfo }>(mapStateToProps)(BasicHeader)
