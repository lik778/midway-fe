
import React from 'react';
import './index.less';
export default (props: any) => {
  return (
    <div className="shop-box">
      <div className="s-img">
        <img src="//file.baixing.net/202011/7f14b8c736a614c75fda50d1d1615640.png"/>
        <div className="s-status s-active">生效中</div>
      </div>
      <div className="s-title">
        <h4>店铺名店铺名店铺名店铺名店铺名店铺名店铺名店铺名店铺名</h4>
        <span className="s-edit iconfont">&#xe61b;</span>
      </div>
      
      <div className="s-btn">
        <a href="">基础设置</a>
        <a href="">内容管理</a>
      </div>
    </div>
  );
}
