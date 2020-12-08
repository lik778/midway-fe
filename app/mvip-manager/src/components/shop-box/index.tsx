
import React from 'react';
import { Link } from 'umi';
import './index.less';

export default (props: any) => {
  const s = props?.shopChild
  const status = s?.status === 1 ? 's-active' : 's-offline'
  const statusTxt = s?.status === 1 ? '生效中' : '已下线'
  return (
    <div className="shop-box">
      <div className="s-img">
        <img src={s?.thumb}/>
        <div className={`s-status ${status}`}>{statusTxt}</div>
      </div>
      <div className="s-title">
        <h4>{s?.name}</h4>
        <span className="s-edit iconfont" onClick={props.onClick}>&#xe61b;</span>
      </div>

      <div className="s-btn">
        <Link to={`143/basis`}>基础设置</Link>
        <Link to={`${s.id}/product`}>内容管理</Link>
        {/*为了测试数据先写死*/}
        {/*<Link to={`143/product`}>内容管理</Link>*/}
      </div>
    </div>
  );
}
