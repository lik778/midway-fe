import React, { useEffect, useState } from 'react';
import ContentHeader from '../components/content-header';
import ShopModuleGroup from '../components/shop-module-group';
import ArticleBox from './components/article-box';
import ArticleList from './components/list';
import ArticleNav from './components/nav';
import { getArticleListApi } from '@/api/shop';
import { addKeyForListData, removeOverflow } from '@/utils';
import { CateItem, QuotaInfo, RouteParams } from '@/interfaces/shop';
import { useParams } from 'umi';
import { ContentCateType, ShopModuleType, ProductType } from '@/enums';
import './index.less';
import { errorMessage } from '@/components/message';
import Recharge from '@/components/recharge';

const ShopArticlePage = (props: any) => {
  const [moduleGroupVisible, setModuleGroupVisible] = useState<boolean>(false);
  const [articleFormVisible, setArticleFormVisible] = useState<boolean>(false);
  const [articleList, setArticleList] = useState<any>([]);
  const [editArticleData, setEditArticleData] = useState<any>(null)
  const [cateList, setCateList] = useState<CateItem[]>([]);
  const [contentCateId, setContentCateId] = useState<number>(0);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [size, setSize ] = useState<number>(10);
  const [total, setTotal] = useState<number | null>(null);
  const [quota, setQuota] = useState<QuotaInfo | null>(null)
  const [typeTxt, setTypeTxt] = useState<string>('服务')
  // 获取店铺id
  const params: RouteParams = useParams();
  const shopId = Number(params.id);
  useEffect(() => {
    (async () => {
      setListLoading(true)
      const res = await getArticleListApi(shopId, { page, contentCateId, size })
      if (res?.success) {
        setArticleList(addKeyForListData(res.data.articleList.result, page, size) || [])
        setCateList(addKeyForListData(res.data.cateList) || [])
        setTotal(res?.data?.articleList?.totalRecord)
        console.log(addKeyForListData(res.data.cateList) || [])
      } else {
        errorMessage(res?.message || '出错了');
      }
      setListLoading(false)
    })()
  }, [page, size, contentCateId])


  const onChangeType = (type: ProductType) => {{
    if(type == ProductType.B2B) {
      setTypeTxt('产品')
    }else{
      setTypeTxt('服务')
    }
  }}

  return (<div>
    <ContentHeader {...props} type={ShopModuleType.ARTICLE} onChangeType={onChangeType}/>
    <div className="container">
      <ArticleNav
        cateList={cateList}
        onChange={(cateId: number) => { setPage(1); setContentCateId(cateId) }}
        showGroup={() => setModuleGroupVisible(true)}
        shopId={shopId}
        showCreate={() => {
          setEditArticleData({})
          setArticleFormVisible(true)
        }} />
      <Recharge shopId={shopId} getQuotaData={(quota) => setQuota(quota)}/>
      <ShopModuleGroup
        type={ContentCateType.ARTICLE}
        title="文章分组"
        cateList={cateList}
        updateCateList={(list) => setCateList(list)}
        onClose={() => removeOverflow(() => setModuleGroupVisible(false))}
        visible={moduleGroupVisible}
        save={() => removeOverflow(() => setModuleGroupVisible(false))}
      />
      <ArticleList
        total={total}
        page={page}
        loading={listLoading}
        dataSource={articleList}
        openEditForm={(item) => {
          setEditArticleData({ ...item });
          setArticleFormVisible(true);
        }}
        onChange={(page) => setPage(page) }
        onShowSizeChange={(page, size) => setSize(size) }/>
      <ArticleBox
        cateList={cateList}
        editData={editArticleData}
        updateCateList={(x) => setCateList(addKeyForListData([x, ...cateList]))}
        visible={articleFormVisible}
        onClose={() => removeOverflow(() => setArticleFormVisible(false)) }
        quota={quota} />
    </div>
  </div>)
}


ShopArticlePage.wrappers = ['@/wrappers/path-auth']

export default ShopArticlePage
