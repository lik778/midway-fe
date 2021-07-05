import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from "umi";
import { Button, Checkbox, Form, Input, Select, Modal, Pagination } from "antd";

import ContentHeader from "../components/content-header";
import ArticleNav from './components/nav'
import Cards from './components/cards'
import SelectionBlock from './components/selection'
import { ShopModuleType } from "@/enums";
import { successMessage, errorMessage } from "@/components/message";
import { createImagesetAlbum, updateImagesetAlbum } from "@/api/shop";

import { usePagination } from './hooks/pagination'

import { RouteParams } from "@/interfaces/shop";
import { TabScope, TabScopeItem, CardItem, AlbumItem, ImageItem } from './types'

import styles from './index.less';

const FormItem = Form.Item;

const ShopArticlePage = (props: any) => {

  /***************************************************** States */

  const params: RouteParams = useParams();
  const shopId = Number(params.id);
  const [selection, setSelection] = useState([])

  const [tabScope, setTabScope] = useState<TabScope>([{ type: 'album', item: null }]);
  const [isScopeAlbum, setIsScopeAlbum] = useState(false);
  const [isScopeImage, setIsScopeImage] = useState(false);
  const [curScope, setCurScope] = useState<TabScopeItem>();

  useEffect(() => {
    setCurScope(tabScope[tabScope.length - 1])
  }, [tabScope])

  useEffect(() => {
    const lastScope = tabScope[tabScope.length - 1]
    if (lastScope) {
      switch (lastScope.type) {
        case 'album':
          setIsScopeAlbum(true)
          setIsScopeImage(false)
          break
        case 'image':
          setIsScopeAlbum(false)
          setIsScopeImage(true)
          break
      }
    }
  }, [tabScope])

  const [createAlbumForm] = Form.useForm();
  const [createAlbumFormDefaultVals, setCreateAlbumFormDefaultVals] = useState<any>({})
  const isEditingAlbum = Object.keys(createAlbumFormDefaultVals).length > 0
  const [createAlbumModal, setCreateAlbumModal] = useState(false);
  const [createAlbumLoading, setCreateAlbumLoading] = useState(false);

  const [lists, setLists] = useState<CardItem[]>([]);
  const [pagi, setPagi, pagiConf, setPagiConf, resetPagi] = usePagination({
    pageSizeOptions: [8, 16, 32]
  })

  // 层级变换时重置翻页
  useEffect(() => curScope && resetPagi(), [curScope])

  /***************************************************** Interaction Fns */

  // 根据分页以及文件层级获取列表
  const refresh = useCallback(() => {
    if (!curScope) {
      return
    }
    const { current } = pagi
    console.log('current: ', current)
    let res = Array(pagiConf.pageSize).fill('').map((x, i) => {
      const idx = ((current - 1) * pagiConf.pageSize) + i
      return {
        type: 'album',
        id: idx + 1,
        name: '默认相册' + idx,
        count: ~~(Math.random() * 29),
        url: (idx % 2)
          ? `http://img4.baixing.net/cda4411639701a0745b0513f968736f8.png_sv1?x=${idx + 1}`
          : "http://img4.baixing.net/63becd57373449038fcbc3b599aecc8c.jpg_sv1",
      }
    })
    setLists(res)
    setPagiConf({ ...pagiConf, total: 80 })
  }, [pagi])

  // 切换翻页自动刷新列表
  const handlePagiChange = (page: number, pageSize?: number | undefined) => {
    pageSize = pageSize || pagiConf.pageSize
    const pageSizeChanged = pageSize !== pagiConf.pageSize
    setPagi({ ...pagi, current: pageSizeChanged ? 1 : page })
    setPagiConf({ ...pagiConf, pageSize })
  }
  useEffect(() => refresh(), [pagi])

  // const goAlbumPage = () => setTabScope('album')
  // const goImagePage = () => setTabScope('image')

  // 切换文件层级
  const goTabScope = (scope: TabScopeItem) => {
    let newScopes = [...tabScope]
    const target = newScopes.find(x => x?.item?.id === scope?.item?.id)
    if (target) {
      const idx = newScopes.findIndex(x => x === target)
      if (idx !== -1) {
        newScopes = newScopes.slice(0, idx + 1)
      }
    } else {
      newScopes.push(scope)
    }
    setTabScope(newScopes)
  }

  const openCreateAlbumModal = (album?: AlbumItem) => {
    if (album) {
      const { id, name } = album
      setCreateAlbumFormDefaultVals({ id, name })
    }
    setCreateAlbumModal(true)
  }
  useEffect(() => {
    createAlbumForm.setFieldsValue(createAlbumFormDefaultVals)
  }, [createAlbumFormDefaultVals])


  /***************************************************** API Calls */

  // 新增及编辑相册
  const createAlbum = async () => {
    createAlbumForm.validateFields([])
      .then(formvals => {
        setCreateAlbumLoading(true);
        let post = null
        let successMsg = ''
        let params: any = {}
        if (isEditingAlbum) {
          params.id = createAlbumFormDefaultVals.id
          post = updateImagesetAlbum
          successMsg = "编辑成功"
        } else {
          post = createImagesetAlbum
          successMsg = "创建成功"
        }
        post(shopId, { ...formvals, ...params })
          .then(res => {
            if (res.success) {
              successMessage(successMsg);
              refresh && refresh();
              setCreateAlbumModal(false);
              createAlbumForm.resetFields();
              setCreateAlbumFormDefaultVals({})
            } else {
              throw new Error(res.message || "出错啦，请稍后重试");
            }
          })
          .catch(error => {
            errorMessage(error.message);
          })
          .finally(() => {
            setCreateAlbumLoading(false);
          });
      })
  };

  /***************************************************** Renders */

  return (
    <>
      <ContentHeader {...props} type={ShopModuleType.ARTICLE} />
      <div className={`container ${styles["container"]}`}>
        <ArticleNav
          shopId={shopId}
          tabScope={tabScope}
          isScopeAlbum={isScopeAlbum}
          isScopeImage={isScopeImage}
          goTabScope={goTabScope}
          createAlbum={() => openCreateAlbumModal()}
        />
        <SelectionBlock
          selection={selection}
          onSelectionChange={val => setSelection(val)}
        />
        <Cards
          shopId={shopId}
          lists={lists}
          tabScope={tabScope}
          isScopeAlbum={isScopeAlbum}
          isScopeImage={isScopeImage}
          goTabScope={goTabScope}
          selection={selection}
          refresh={refresh}
          editAlbum={openCreateAlbumModal}
        />
        <Pagination
          className={styles["pagination"]}
          defaultCurrent={1}
          current={pagi.current}
          total={pagiConf.total}
          pageSize={pagiConf.pageSize}
          pageSizeOptions={pagiConf.pageSizeOptions}
          onChange={handlePagiChange}
        />
      </div>

      {/* Create Album Modal */}
      <Modal
        wrapClassName="create-album-modal"
        title={isEditingAlbum ? '编辑相册' : "新建相册"}
        width={432}
        footer={null}
        visible={createAlbumModal}
        onCancel={() => setCreateAlbumModal(false)}
      >
        <Form
          name="create-album-form"
          form={createAlbumForm}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
        >
          <FormItem
            name="name"
            label="相册名称"
            rules={[
              { pattern: /^[\s\S]{2,20}$/, message: "字数限制为 2～20 个字符" },
            ]}
          >
            <Input placeholder="请输入相册名称" />
          </FormItem>
        </Form>
        <div className={styles["extra"]}>
          <div className={styles["name-tip"]}>
            注：可填写2~30个字符，支持中、英文，请不要填写特殊符号
          </div>
          <Button
            className={styles["confirm-btn"]}
            type="primary"
            htmlType="submit"
            loading={createAlbumLoading}
            onClick={createAlbum}
          >
            确定
          </Button>
        </div>
      </Modal>
    </>
  );
}

ShopArticlePage.wrappers = ['@/wrappers/path-auth']

export default ShopArticlePage
