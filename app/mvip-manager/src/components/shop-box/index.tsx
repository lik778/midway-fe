
import React from 'react';
import './index.less';
export default (props: any) => {
  const s = props.shopChild
  const status = s.status === 1 ? 's-active' : 's-offline'
  const statusTxt = s.status === 1 ? '生效中' : '已下线'
  return (
    <div className="shop-box">
      <div className="s-img">
        <img src={s.thumb}/>
        <div className={`s-status ${status}`}>{statusTxt}</div>
      </div>
      <div className="s-title">
        <h4>{s.name}</h4>
        <span className="s-edit iconfont" onClick={props.onClick}>&#xe61b;</span>
      </div>
      
      <div className="s-btn">
        <a href="">基础设置</a>
        <a href="">内容管理</a>
      </div>
    </div>
  );
}
