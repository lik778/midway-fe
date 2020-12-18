
import React from 'react';
import { Link, history } from 'umi';
import './index.less';

export default (props: any) => {
  const s = props?.shopChild
  const status = s?.status === 1 ? 's-active' : 's-offline'
  const statusTxt = s?.status === 1 ? '生效中' : '已下线'

  const linkTo = (link: string) => {
    if (props.notInterceptCreateShop()) {
      history.push(link)
    }
  }

  return (
    <div className="shop-box">
      <div className="shop-icon">
        <i className="iconfont">&#xe61e;</i>
        店铺{props.index + 1}
      </div>
      <div className="s-img">
        <a href={s.shopDomain} target="_blank">
          <img src={s?.thumb}/>
          <div className={`s-status ${status}`}>{statusTxt}</div>
        </a>
      </div>
      <div className="s-title" >
        <a href={s.shopDomain} target="_blank"><h4>{s?.name}</h4></a>
        <span className="s-edit iconfont" onClick={props.onClick}>&#xe61b;</span>
      </div>
      <div className="s-btn">
        <span onClick={() => linkTo(`/shop/${s.id}/nav`) } >基础设置</span>
        <span onClick={() => linkTo(`/shop/${s.id}/product`) }>内容管理</span>
      </div>
    </div>
  );
}
