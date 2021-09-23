import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'antd';
import ShopBasisTab from '../shop-basis-tab';
import MainTitle from '@/components/main-title';
import WildcatForm from '@/components/wildcat-form';
import { FormConfig } from '@/components/wildcat-form/interfaces';
import { RecordForm } from './config'
import { ShopBasisType } from '@/enums';
import { Link, useParams } from 'umi';
import { ShopInfo } from '@/interfaces/shop';
import styles from './index.less';
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
  const [formConfig, setformConfig] = useState<FormConfig>(() => {
    formConfig.customerFormItemList = [{
      index: 2,
      key: 'checkbox',
      node: 
    }]
  })
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
      <p>您好！以下是您对<span className={styles['diamond-company']}>钻石店铺的意见反馈</span></p >
    )
  }

  return (
    <>
      <div className={styles["basis-header"]}>
        {
          curShopInfo?.name && <>
            <Link className={styles["arrow"]} to="/shop"></Link>
            <MainTitle title={curShopInfo?.name} />
            <a className={styles["feed-back"]} href="#" onClick={showModal}>我要吐槽</a>
            <a className={styles["visit-online"]} href={curShopInfo?.shopDomain} target="_blank">访问线上</a>
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
              loading={formLoading} />

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
