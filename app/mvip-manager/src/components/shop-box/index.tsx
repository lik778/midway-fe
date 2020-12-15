
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

  const handleClick = () =>{
    location.href = s.shopDomain
  }

  return (
    <div className="shop-box">
      <div className="s-img" onClick={handleClick}>
        <img src={s?.thumb}/>
        <div className={`s-status ${status}`}>{statusTxt}</div>
      </div>
      <div className="s-title">
        <h4 onClick={handleClick}>{s?.name}</h4>
        <span className="s-edit iconfont" onClick={props.onClick}>&#xe61b;</span>
      </div>
      <div className="s-btn">
        <span onClick={() => linkTo(`/shop/${s.id}/nav`) } >基础设置</span>
        <span onClick={() => linkTo(`/shop/${s.id}/product`) }>内容管理</span>
      </div>
    </div>
  );
}
