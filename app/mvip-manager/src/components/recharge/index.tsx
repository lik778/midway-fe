
import React, { useEffect, useState } from 'react';
import { getShopQuotaApi } from '@/api/shop';
import { QuotaInfo } from '@/interfaces/shop';
import './index.less';

interface Props {
  shopId: number | null;
  getQuotaData?(quota: QuotaInfo): void;
}
export default (props: Props) => {
  const { shopId, getQuotaData } = props
  const [quota, setQuota] = useState<QuotaInfo | null>(null);

  useEffect(() => {
    (async () => {
      if (shopId) {
        const res = await getShopQuotaApi({ id: shopId })
        setQuota(res?.data);
        if (getQuotaData) { getQuotaData(res?.data); }
      }
    })()

  }, [shopId])

  const url = ()=> {
    if(quota?.buyUrl){
      return (<a href={quota?.buyUrl}><i className="highlight left-m">去充值&gt;</i></a>)
    }
  }
  const quotaPage = ()=> {
    if(quota) {
      return (<div className="recharge">
        <span>当前免费剩余发文量:  <i className="highlight">{quota.freeNum || 0}篇</i></span>
        { (!!quota.postRemain) && <span className="left-m">当前剩余信息发布点:  <i className="highlight">{quota.postRemain || 0}点</i></span>}
        { (!!quota.postRemain) && url() }
        { (!!quota.postRemain) && <span className="left-m">(消耗顺序： 免费发文&gt;信息发布点，1篇文章消耗6个信息发布点)</span> }
      </div>)
    }
  }
  return (
    <>
      {quotaPage()}
    </>
  );
}
