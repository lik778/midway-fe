import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import ContentHeader from '@/components/content-header';
import MainTitle from '@/components/main-title';
import ShopModuleGroup from '@/components/shop-module-group';
import ArticleBox from '@/components/article-box';
import ArticleList from './components/list';
import ArticleNav from './components/nav';
import { getArticleListApi } from '@/api/shop';
import { addKeyForListData } from '@/utils';
import { CateItem, RouteParams } from '@/interfaces/shop';
import { useParams } from 'umi';
import { ContentCateType, ShopModuleType } from '@/enums';
import './index.less';

export default (props: any) => {
  const [moduleGroupVisible, setModuleGroupVisible] = useState<boolean>(false);
  const [articleFormVisible, setArticleFormVisible] = useState<boolean>(false);
  const [articleList, setArticleList] = useState<any>([]);
  const [editArticleData, setEditArticleData] = useState<any>(null)
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
      const res = await getArticleListApi(Number(params.id), { page, contentCateId, size: 10 })
      if (res.success) {
        setArticleList(addKeyForListData(res.data.articleList.result) || [])
        setCateList(addKeyForListData(res.data.cateList) || [])
        setTotal(res.data.articleList.totalRecord)
      } else {
        message.error(res.message);
      }
      setListLoading(false)
    })()
  }, [page, contentCateId])

  return (<div>
    <ContentHeader type={ShopModuleType.ARTICLE}/>
    <div className="container">
      <ArticleNav
        cateList={cateList}
        onChange={(cateId: number) => { setPage(1); setContentCateId(cateId) }}
        showGroup={() => setModuleGroupVisible(true)}
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
        addArticleList={(item) => {
          const addList = [item, ...articleList]
          setArticleList(addKeyForListData(addList))
          setTotal(addList.length)
          // 处理一下cateList的num
          const cateItem: any = cateList.find((x: any) => x.id == item.contentCateId)
          cateItem.num += 1
          setCateList([...cateList ])
        }}
        updateArticleList={(item) => {
          const editIndex = articleList.findIndex((a: any) => a.id === item.id)
          articleList.splice(editIndex, 1, item)
          setArticleList(addKeyForListData([...articleList]))
        }}
        cateList={cateList}
        editData={editArticleData}
        updateCateList={(x) => setCateList(addKeyForListData([x, ...cateList]))}
        visible={articleFormVisible}
        onClose={() => setArticleFormVisible(false)}/>
    </div>
  </div>)
}
