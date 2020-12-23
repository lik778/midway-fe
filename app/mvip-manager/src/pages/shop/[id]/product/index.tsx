import React,  { useState, useEffect } from 'react';
import { useParams } from "umi";
import ContentHeader from '@/components/content-header';
import ShopModuleGroup from '@/components/shop-module-group';
import ProductBox from '@/components/product-box';
import ProductList from './components/list';
import ProductNav from './components/nav';
import { ContentCateType, ShopModuleType } from '@/enums';
import { getProductListApi }  from '@/api/shop';
import { addKeyForListData } from '@/utils';
import './index.less'
import { CateItem, RouteParams } from '@/interfaces/shop';
import { errorMessage } from '@/components/message';

// tips: 本组件和文章组件一定要抽一个组件出来，很多内容相同
export default (props: any) => {
  const [moduleGroupVisible, setModuleGroupVisible] = useState<boolean>(false);
  const [productFormVisible, setProductFormVisible] = useState<boolean>(false);
  const [productList, setProductList] = useState<any>([]);
  const [editProductData, setEditProductData] = useState<any>(null);
  const [cateList, setCateList] = useState<CateItem[]>([]);
  const [contentCateId, setContentCateId] = useState<number>(0);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  // 获取店铺id
  const params: RouteParams = useParams();

  useEffect(() => {
    (async () => {
      setListLoading(true)
      const res = await getProductListApi(Number(params.id), { page, contentCateId, size: 10 })
      if (res?.success) {
        setProductList(addKeyForListData(res.data.productList.result, page) || [])
        setCateList(addKeyForListData(res.data.cateList) || [])
        setTotal(res.data.productList.totalRecord)
      } else {
        errorMessage(res.message);
      }
      setListLoading(false)
    })()
  }, [page, contentCateId])

  return (
    <div>
      <ContentHeader type={ShopModuleType.PRODUCT}/>
      <div className="container">
          <ProductNav
            onChange={(cateId: number) => { setPage(1); setContentCateId(cateId) }}
            cateList={cateList}
            showGroup={() => setModuleGroupVisible(true)}
            showCreate={() => {
              setEditProductData({})
              setProductFormVisible(true)
            }} />
          <ProductList
            total={total}
            page={page}
            loading={listLoading}
            dataSource={productList}
            openEditForm={(item) => {
              setEditProductData({...item});
              setProductFormVisible(true);
            }}
            onChange={(page) => setPage(page)}/>
          <ShopModuleGroup
            type={ContentCateType.PRODUCT}
            title="服务分组"
            createBtnText="新建分组"
            cateList={cateList}
            updateCateList={(list) => setCateList(list)}
            onClose={() => setModuleGroupVisible(false)}
            visible={moduleGroupVisible}
            save={() => { setModuleGroupVisible(false) }} />
          <ProductBox
            cateList={cateList}
            editData={editProductData}
            updateCateList={(x) => addKeyForListData(setCateList([x, ...cateList]))}
            visible={productFormVisible}
            onClose={() => setProductFormVisible(false)}/>
      </div>
  </div>)
}
