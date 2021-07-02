import React, { useEffect, useState } from 'react';
import { useParams } from "umi";
import { Button, Checkbox, Form, Input, Modal, Pagination } from "antd";

import ContentHeader from "../components/content-header";
import ArticleNav from './components/nav'
import Cards from './components/cards'
import { ShopModuleType } from "@/enums";
import { RouteParams } from "@/interfaces/shop";
import { successMessage, errorMessage } from "@/components/message";
import { createImagesetAlbum, updateImagesetAlbum } from "@/api/shop";

import styles from './index.less';

const FormItem = Form.Item;

export type TabScope = 'album' | 'image'

const ShopArticlePage = (props: any) => {

  /***************************************************** States */

  const params: RouteParams = useParams();
  const shopId = Number(params.id);
  const [selection, setSelection] = useState([])

  const [tabScope, setTabScope] = useState<TabScope>("album");

  const [createAlbumForm] = Form.useForm();
  const [createAlbumFormDefaultVals, setCreateAlbumFormDefaultVals] = useState<any>({})
  const isEditingAlbum = Object.keys(createAlbumFormDefaultVals).length > 0
  const [createAlbumModal, setCreateAlbumModal] = useState(false);
  const [createAlbumLoading, setCreateAlbumLoading] = useState(false);

  /***************************************************** Interaction Fns */

  const getList = () => {}
  const refresh = () => {}

  const goAlbumPage = () => setTabScope('album')
  const goImagePage = () => setTabScope('image')

  const openCreateAlbumModal = (id?: number, defaultName?: string) => {
    if (id) {
      setCreateAlbumFormDefaultVals({ id, name: defaultName })
    }
    setCreateAlbumModal(true)
  }
  useEffect(() => {
    createAlbumForm.setFieldsValue(createAlbumFormDefaultVals)
  }, [createAlbumFormDefaultVals])

  /***************************************************** API Calls */

  // 新增相册
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
          goAlbumPage={goAlbumPage}
          createAlbum={() => openCreateAlbumModal()}
        />
        <SelectionBlock
          selection={selection}
          onSelectionChange={val => setSelection(val)}
        />
        <Cards
          tabScope={tabScope}
          selection={selection}
          goImagePage={goImagePage}
          editAlbum={openCreateAlbumModal}
        />
        <Pagination
          className={styles["pagination"]}
          defaultCurrent={1}
          total={500}
        />
      </div>

      {/* Modals */}
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

interface SelectionBlockProps {
  selection: any[];
  onSelectionChange: (selection: any[]) => void;
}
function SelectionBlock (props: SelectionBlockProps) {
  const { selection, onSelectionChange } = props

  const handleCheckAll = (e: any) => {
    console.log(e)
  }

  return (
    <>
      <div className={styles["section-block"]}>
        <Checkbox onChange={handleCheckAll}>全选</Checkbox>
        <Button className={styles["delete-all-btn"]} type="text" size="small">
          批量删除
        </Button>
        <span className={styles["count-info"]}>
          共 <span className={styles["count-num"]}>{selection.length}</span>{" "}
          个相册
        </span>
      </div>
    </>
  );
}

ShopArticlePage.wrappers = ['@/wrappers/path-auth']

export default ShopArticlePage
