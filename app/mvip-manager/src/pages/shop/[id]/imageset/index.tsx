import React, { useEffect, useState } from 'react';
import { useParams } from "umi";
import { Button, Checkbox, Form, Input, Modal, Pagination } from "antd";

import ContentHeader from "../components/content-header";
import ArticleNav from './components/nav'
import Cards from './components/cards'
import { ShopModuleType } from "@/enums";
import { RouteParams } from "@/interfaces/shop";
import { successMessage, errorMessage } from "@/components/message";
import { createImagesetAlbum } from "@/api/shop";

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
  const [createAlbumModal, setCreateAlbumModal] = useState(false);
  const [createAlbumLoading, setCreateAlbumLoading] = useState(false);

  /***************************************************** Interaction Fns */

  const getList = () => {}
  const refresh = () => {}

  const goAlbumPage = () => setTabScope('album')
  const goImagePage = () => setTabScope('image')

  /***************************************************** API Calls */

  // 新增相册
  const createAlbum = async () => {
    createAlbumForm.validateFields([])
      .then(formvals => {
        setCreateAlbumLoading(true);
        createImagesetAlbum(shopId, formvals)
          .then(res => {
            if (res.success) {
              successMessage("创建成功");
              refresh && refresh();
              createAlbumForm.resetFields();
              setCreateAlbumModal(false);
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
          openCreateAlbumModal={() => setCreateAlbumModal(true)}
        />
        <SelectionBlock
          selection={selection}
          onSelectionChange={val => setSelection(val)}
        />
        <Cards
          tabScope={tabScope}
          selection={selection}
          goImagePage={goImagePage}
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
        title="新建相册"
        width={432}
        footer={null}
        visible={createAlbumModal}
        onCancel={() => setCreateAlbumModal(false)}
      >
        <Form
          name="create-album-form"
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
