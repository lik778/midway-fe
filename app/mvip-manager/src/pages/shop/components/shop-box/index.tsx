
import React from 'react';
import { history } from 'umi';
import './index.less';
import moment from 'moment';
import { SET_CUR_SHOP_INFO_ACTION, SHOP_NAMESPACE } from '@/models/shop';

export default (props: any) => {
  const s = props?.shopInfo
  const status = s?.status === 1 ? 's-active' : 's-offline'
  const statusTxt = s?.status === 1 ? '生效中' : (s?.status === 2?'审核驳回':'已下线')

  const linkTo = (id: number, link: string) => {
    if (props.notInterceptCreateShop()) {
      props.dispatch({ type: `${SHOP_NAMESPACE}/${SET_CUR_SHOP_INFO_ACTION}`, payload: id })
      history.push(link)
    }
  }

  const genEditBtn = () => {
    if(s?.status === 1 || s?.status === 2) {
      return (<span className="s-edit" onClick={props.onClick}></span>)
    }
  }

  const genLinkPanel = () => {
    if(s?.status === 1 || s?.status === 2) {
      return (<div className="s-btn">
      <span onClick={() => linkTo(s.id, `/shop/${s.id}/nav`) } >基础设置</span>
      <span onClick={() => linkTo(s.id, `/shop/${s.id}/product`) }>内容管理</span>
    </div>)
    }
  }

  return (
    <div className="shop-box">
      <div className="s-img">
        <a href={s.shopDomain} target="_blank">
          <img src={s?.thumb}/>
          <div className={`s-status ${status}`}>{statusTxt}</div>
        </a>
      </div>
      <div className="s-title" >
        <a href={s.shopDomain} target="_blank">{s?.name}</a>
        { genEditBtn() }
      </div>
      <div className="dead-time">
        到期时间：{moment(s?.expiredTime * 1000).format('YYYY/MM/DD')}
      </div>
      { genLinkPanel() }
    </div>
  );
}
