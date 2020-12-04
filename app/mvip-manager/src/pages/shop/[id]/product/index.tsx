import React,  { useState, useEffect } from 'react';
import { message } from 'antd';
import { useParams } from "umi";
import ShopModuleTab from '@/components/shop-module-tab';
import MainTitle from '@/components/main-title';
import ShopModuleGroup from '@/components/shop-module-group';
import ProductBox from '@/components/product-box';
import ProductList from './components/list';
import ProductNav from './components/nav';
import { ContentCateType, ShopModuleType } from '@/enums';
import { getProductListApi }  from '@/api/shop';
import { addKeyForListData } from '@/utils';
import './index.less'
import { CateItem, RouteParams } from '@/interfaces/shop';

export default (props: any) => {
  const [moduleGroupVisible, setModuleGroupVisible] = useState<boolean>(false);
  const [productFormVisible, setProductFormVisible] = useState<boolean>(false);
  const [productList, setProductList] = useState<any>([]);
  const [cateList, setCateList] = useState<CateItem[]>([]);
  const [contentCateId, setContentCateId] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  // 获取店铺id
  const params: RouteParams = useParams();

  useEffect(() => {
    (async () => {
      const res = await getProductListApi(Number(params.id), { page, contentCateId, size: 10 })
      if (res.success) {
        setProductList(addKeyForListData(res.data.productList.result) || [])
        setCateList(addKeyForListData(res.data.cateList) || [])
        setTotal(res.data.productList.totalRecord)
      } else {
        message.error(res.message);
      }
    })()
  }, [page, contentCateId])

  return (
    <div>
      <MainTitle title="百姓网店铺"/>
      <ShopModuleTab type={ShopModuleType.PRODUCT}/>
      <div className="container">
          <ProductNav
            onChange={(cateId: number) => { setPage(1); setContentCateId(cateId) }}
            cateList={cateList}
            showGroup={() => setModuleGroupVisible(true)}
            showCreate={() => setProductFormVisible(true)} />
          <ProductList
            total={total}
            dataSource={productList}
            update={(list) => {
              setProductList(addKeyForListData(list) || [])
            }}
            onChange={(page) => setPage(page)}/>
          <ShopModuleGroup
            type={ContentCateType.PRODUCT}
            title="服务分组"
            createBtnText="新建服务"
            cateList={cateList}
            updateCateList={(list) => setCateList(list)}
            onClose={() => setModuleGroupVisible(false)}
            visible={moduleGroupVisible}
            save={() => { setModuleGroupVisible(false) }} />
          <ProductBox
            addProductList={(item) => setProductList([item, ...productList])}
            cateList={cateList}
            updateCateList={(x) => setCateList([x, ...cateList])}
            visible={productFormVisible}
            onClose={() => setProductFormVisible(false)}/>
      </div>
  </div>)
}
