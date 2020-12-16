
import React from 'react';
import './index.less';
export default (props: any) => {
  return (
    <div className="recharge">
      <span>当前免费剩余发文量:  <i className="highlight">168篇</i></span>
      <span className="left-m">当前剩余信息发布点:  <i className="highlight">1889点</i></span>
      <i className="highlight left-m">去充值&gt;</i>
      <span className="left-m">(消耗顺序： 免费发文&gt;信息发布点，1篇文章消耗6个信息发布点)</span>
    </div>
  );
}
