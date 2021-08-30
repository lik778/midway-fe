import React, { useState, useEffect } from 'react';
import { useParams } from "umi";
import ContentHeader from '../components/content-header';
import ShopModuleGroup from '../components/shop-module-group';
import ProductBox from './components/product-box';
import ProductList from './components/list';
import ProductNav from './components/nav';
import { ContentCateType, ShopModuleType, ProductType } from '@/enums';
import { getProductListApi } from '@/api/shop';
import { addKeyForListData, removeOverflow, removeOverflowY } from '@/utils';
import './index.less'
import { CateItem, RouteParams, ShopProductListItem } from '@/interfaces/shop';
import { errorMessage } from '@/components/message';

// tips: 本组件和文章组件一定要抽一个组件出来，很多内容相同
const ShopProductPage = (props: any) => {
  const [moduleGroupVisible, setModuleGroupVisible] = useState<boolean>(false);
  const [productFormVisible, setProductFormVisible] = useState<boolean>(false);
  const [productList, setProductList] = useState<ShopProductListItem[]>([]);
  const [editProductData, setEditProductData] = useState<any>(null);
  const [cateList, setCateList] = useState<CateItem[]>([]);
  const [contentCateId, setContentCateId] = useState<number>(0);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number | null>(null);
  const [typeTxt, setTypeTxt] = useState<string>('服务')
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

  const onChangeType = (type: ProductType) => {
    {
      if (type == ProductType.B2B) {
        setTypeTxt('产品')
      } else {
        setTypeTxt('服务')
      }
    }
  }

  const handleClickCreateProduct = () => {
    setEditProductData({})
    setProductFormVisible(true)
  }


  const handleClickEditProduct = (item: ShopProductListItem) => {
    setEditProductData({ ...item });
    setProductFormVisible(true);
  }

  return (
    <div>
      <ContentHeader {...props} type={ShopModuleType.PRODUCT} onChangeType={onChangeType} />
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
          title={`${typeTxt}分组`}
          cateList={cateList}
          updateCateList={(list) => setCateList(list)}
          onClose={() => removeOverflow(() => setModuleGroupVisible(false))}
          visible={moduleGroupVisible}
          save={() => removeOverflow(() => setModuleGroupVisible(false))} />
        <ProductBox
          cateList={cateList}
          editData={editProductData}
          updateCateList={(x) => addKeyForListData(setCateList([x, ...cateList]))}
          visible={productFormVisible}
          onClose={() => removeOverflow(() => setProductFormVisible(false))} />
      </div>
    </div>)
}

ShopProductPage.wrappers = ['@/wrappers/path-auth']

export default ShopProductPage
