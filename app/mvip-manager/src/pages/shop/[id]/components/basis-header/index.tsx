import React, { useEffect, useState } from 'react';
import ShopBasisTab from '../shop-basis-tab';
import MainTitle from '@/components/main-title';
import { ShopBasisType } from '@/enums';
import { Link, useParams } from 'umi';
import { ShopInfo } from '@/interfaces/shop';
import './index.less';
import { connect, Dispatch } from 'dva';
import { GET_CUR_SHOP_INFO_ACTION, SHOP_NAMESPACE } from '@/models/shop';
import { relative } from 'path/posix';
import AdivceRecord from '../advice-record/index'
interface Props {
  type: ShopBasisType;
  curShopInfo?: ShopInfo | null;
  dispatch: Dispatch;
}

const BasicHeader = (props: Props) => {
  const { type, curShopInfo } = props
  const [isModalVisible, setIsModalVisible] = useState(false)



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
      <AdivceRecord isModalVisible={isModalVisible} handleOk={handleOk} handleCancel={handleCancel} sumbit={sumbit} />
    </>
  );
}

const mapStateToProps = (state: any): any => {
  const { curShopInfo } = state[SHOP_NAMESPACE];
  return { curShopInfo }
}

export default connect<{ curShopInfo: ShopInfo }>(mapStateToProps)(BasicHeader)
