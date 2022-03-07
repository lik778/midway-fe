import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from "umi";
import BasisHeader from '../components/basis-header';
import ShopModuleGroup from '../components/shop-module-group';
import ProductBox from './components/product-box';
import ProductList from './components/list';
import ProductNav from './components/nav';
import { connect } from 'dva'
import { ContentCateType, ShopModuleType, ProductType } from '@/enums';
import { getProductListApi } from '@/api/shop';
import { addKeyForListData, removeOverflow, removeOverflowY } from '@/utils';
import './index.less'
import { CateItem, RouteParams, ProductListItem } from '@/interfaces/shop';
import { errorMessage } from '@/components/message';
import { SHOP_NAMESPACE } from '@/models/shop'

// tips: 本组件和文章组件一定要抽一个组件出来，很多内容相同
const ShopProductPage = (props: any) => {
  const { curShopInfo } = props
  const [moduleGroupVisible, setModuleGroupVisible] = useState<boolean>(false);
  const [productFormVisible, setProductFormVisible] = useState<boolean>(false);
  const [productList, setProductList] = useState<ProductListItem[]>([]);
  const [editProductData, setEditProductData] = useState<ProductListItem | {}>({});
  const [cateList, setCateList] = useState<CateItem[]>([]);
  const [contentCateId, setContentCateId] = useState<number>(0);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number | null>(null);
  const isB2B = useMemo(() => {
    return curShopInfo?.type === ProductType.B2B
  }, [curShopInfo])


  const typeTxt = useMemo(() => {
    return isB2B ? '产品' : '服务'
  }, [isB2B])

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

  const handleClickCreateProduct = () => {
    setEditProductData({})
    setProductFormVisible(true)
  }

  const handleClickEditProduct = (item: ProductListItem) => {
    setEditProductData({ ...item, params: item.params || [] });
    setProductFormVisible(true);
  }

  const updateEditData = (data: ProductListItem) => {
      setEditProductData(data)
  }

  return (
    <div>
      <BasisHeader {...props} type={ShopModuleType.PRODUCT} />
      <div className="container">
        <ProductNav
          onChange={(cateId: number) => { setPage(1); setContentCateId(cateId) }}
          cateList={cateList}
          showGroup={() => setModuleGroupVisible(true)}
          showCreate={handleClickCreateProduct}
          type={typeTxt} />
        <ProductList
          total={total}
          page={page}
          loading={listLoading}
          dataSource={productList}
          openEditForm={handleClickEditProduct}
          type={typeTxt}
          onChange={(page) => setPage(page)} />
        <ShopModuleGroup
          type={ContentCateType.PRODUCT}
          title={`${typeTxt}`}
          cateList={cateList}
          updateCateList={setCateList}
          onClose={() => removeOverflow(() => setModuleGroupVisible(false))}
          visible={moduleGroupVisible}
          save={() => removeOverflow(() => setModuleGroupVisible(false))} />
        <ProductBox
          isB2B={isB2B}
          updateEditData={updateEditData}
          curShopInfo={curShopInfo}
          typeTxt={typeTxt}
          cateList={cateList}
          editData={editProductData}
          updateCateList={setCateList}
          visible={productFormVisible}
          onClose={() => removeOverflow(() => setProductFormVisible(false))} />
      </div>
    </div>)
}
// 这一句是给下面提供 wrappers 字段定义
ShopProductPage.wrappers = ['@/wrappers/path-auth']

const mapStateToProps = (state: any): any => {
  const { curShopInfo } = state[SHOP_NAMESPACE];
  return { curShopInfo }
}

const ShopProductPageConnect = connect(mapStateToProps)(ShopProductPage)
// 这一句才是真正的挂上鉴权
ShopProductPageConnect.wrappers = ['@/wrappers/path-auth']

export default ShopProductPageConnect
