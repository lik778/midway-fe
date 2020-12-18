
import React from 'react';
import './index.less';
export default (props: any) => {
  const {quota} = props

  const consumePage = () =>{
    if(!quota?.freeNum){
      return (
        <>
          <span className="left-m">当前剩余信息发布点:  <i className="highlight">{quota?.postRemain || 0}点</i></span>
          <a href={quota?.buyUrl}><i className="highlight left-m">去充值&gt;</i></a>
          <span className="left-m">(消耗顺序： 免费发文&gt;信息发布点，1篇文章消耗6个信息发布点)</span>
        </>
      )
    }
  }
  return (
    <div className="recharge">
      <span>当前免费剩余发文量:  <i className="highlight">{quota?.freeNum || 0}篇</i></span>
      {consumePage()}
    </div>
  );
}
