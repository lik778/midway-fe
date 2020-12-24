import React, { useEffect, useState } from 'react';
import ContentHeader from '@/components/content-header';
import ShopModuleGroup from '@/components/shop-module-group';
import ArticleBox from '@/components/article-box';
import ArticleList from './components/list';
import ArticleNav from './components/nav';
import { getArticleListApi } from '@/api/shop';
import { addKeyForListData } from '@/utils';
import { CateItem, RouteParams } from '@/interfaces/shop';
import { useParams } from 'umi';
import { ContentCateType, ShopModuleType, ProductType } from '@/enums';
import './index.less';
import { errorMessage } from '@/components/message';

export default (props: any) => {
  const [moduleGroupVisible, setModuleGroupVisible] = useState<boolean>(false);
  const [articleFormVisible, setArticleFormVisible] = useState<boolean>(false);
  const [articleList, setArticleList] = useState<any>([]);
  const [editArticleData, setEditArticleData] = useState<any>(null)
  const [cateList, setCateList] = useState<CateItem[]>([]);
  const [contentCateId, setContentCateId] = useState<number>(0);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number | null>(null);
  const [quota, setQuota] = useState<any>(null)
  const [typeTxt, setTypeTxt] = useState<string>('服务')
  // 获取店铺id
  const params: RouteParams = useParams();
  useEffect(() => {
    (async () => {
      setListLoading(true)
      const res = await getArticleListApi(Number(params.id), { page, contentCateId, size: 10 })
      if (res?.success) {
        setArticleList(addKeyForListData(res.data.articleList.result, page) || [])
        setCateList(addKeyForListData(res.data.cateList) || [])
        setTotal(res?.data?.articleList?.totalRecord)
        setQuota(res?.data?.quotaInfo)
      } else {
        errorMessage(res?.message || '出错了');
      }
      setListLoading(false)
    })()
  }, [page, contentCateId])

  const updateQuota = (q: any) =>{
    setQuota(q)
  }

  const onChangeType = (type: ProductType) => {{
    if(type == ProductType.B2B) {
      setTypeTxt('产品')
    }else{
      setTypeTxt('服务')
    }
  }}

  return (<div>
    <ContentHeader type={ShopModuleType.ARTICLE} onChangeType={onChangeType}/>
    <div className="container">
      <ArticleNav
        cateList={cateList}
        onChange={(cateId: number) => { setPage(1); setContentCateId(cateId) }}
        showGroup={() => setModuleGroupVisible(true)}
        quota={quota}
        showCreate={() => {
          setEditArticleData({})
          setArticleFormVisible(true)
        }}  />
      <ShopModuleGroup
        type={ContentCateType.ARTICLE}
        title="文章分组"
        createBtnText="新建分组"
        cateList={cateList}
        updateCateList={(list) => setCateList(list)}
        onClose={() => setModuleGroupVisible(false)}
        visible={moduleGroupVisible}
        save={() => { setModuleGroupVisible(false) }}
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
        onChange={(page) => setPage(page)}/>
      <ArticleBox
        cateList={cateList}
        editData={editArticleData}
        updateCateList={(x) => setCateList(addKeyForListData([x, ...cateList]))}
        visible={articleFormVisible}
        onClose={() => {setTimeout(() =>setArticleFormVisible(false), 500)}}
        quota={quota}
        updateQuota={updateQuota}
        />
    </div>
  </div>)
}
