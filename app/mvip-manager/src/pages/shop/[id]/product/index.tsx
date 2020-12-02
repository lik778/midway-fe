import React,  { useState, useEffect } from 'react';
import { useParams } from "umi";
import ShopModuleTab from '@/components/shop-module-tab';
import MainTitle from '@/components/main-title';
import ShopModuleGroup from '@/components/shop-module-group';
import CategoryBox from '@/components/category-box';
import ProductList from './components/list';
import ProductNav from './components/nav';
import { ShopModuleType } from '@/enums';
import { getProductListApi }  from '@/api/shop';
import { addKeyForListData } from '@/utils';
import './index.less'
import { RouteParams } from '@/interfaces/shop';


export default (props: any) => {
  const [moduleGroupVisible, setModuleGroupVisible] = useState(false);
  const [productFormVisible, setProductFormVisible] = useState(false);
  const [productList, setProductList] = useState([]);
  const [cateList, setCateList] = useState([]);
  const [contentCateId, setContentCateId] = useState(0);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  // 获取店铺id
  const params: RouteParams = useParams();

  useEffect(() => {
    (async () => {
      const { success, data, message } = await getProductListApi(Number(params.id), { page, contentCateId, size: 10 })
      if (success) {
        setProductList(addKeyForListData(data.productList.result) || [])
        setCateList(addKeyForListData(data.cateList) || [])
        setTotal(data.productList.totalRecord)
      } else {
        message.error(message);
      }
    })()
  }, [page, contentCateId])

  return (
    <div>
      <MainTitle title="百姓网店铺"/>
      <ShopModuleTab type={ShopModuleType.product}/>
      <div className="container">
          <ProductNav
            onChange={(cateId) => { setPage(1); setContentCateId(cateId) }}
            cateList={cateList}
            showGroup={() => setModuleGroupVisible(true)}
            showCreate={() => setProductFormVisible(true)} />
          <ProductList
            total={total}
            dataSource={productList}
            onChange={(page) => setPage(page)}/>
          <ShopModuleGroup
            title="服务分组"
            createBtnText="新建服务"
            cateList={cateList}
            onClose={() => setModuleGroupVisible(false)}
            visible={moduleGroupVisible}
            save={() => { console.log('保存') }} />
          <CategoryBox visible={productFormVisible} onClose={() => setProductFormVisible(false)}/>
      </div>
  </div>)
}
