import React, { FC, useState, useEffect, forwardRef, Ref, useRef, useImperativeHandle } from 'react';
import { Button, Row, Col, FormInstance } from 'antd'
import WildcatForm from '@/components/wildcat-form';
import { cloneDeepWith } from 'lodash';
import { swiperProductForm } from './config'
import { Detail } from './data'
import { FormConfig } from '@/components/wildcat-form/interfaces';
import styles from './index.less'
import SelectItem from '../../../../../components/select-item'
import { } from 'react';
import { mockData } from '@/utils';
interface Props {

}

const Product = (props: Props, parentRef: Ref<any>) => {
  const { } = props
  const [detail, setDetail] = useState<Detail>({
    banner: '',
    productIds: [],
  })
  const [upDataLoading, setUpDataLoading] = useState<boolean>(false)

  const formRef = useRef<{ form: FormInstance | undefined }>({ form: undefined })

  const [config, setConfig] = useState<FormConfig>(() => {
    const config = cloneDeepWith(swiperProductForm)
    config.customerFormItemList = [{
      index: 2,
      key: 'productIds',
      node: <SelectItem key='productIds' configKey='home-swiper'></SelectItem>
    }]
    return config
  });

  const getDetail = async () => {
    const res = await mockData<Detail>('data', {
      banner: '//img4.baixing.net/c08796c059928ea1cec5e1bd78996749.png_sv1',
      productIds: [{ "id": 2097, "contentCateId": 859, "headImg": "http://img5.baixing.net/ac6ffe287e5e41e21ef3bca9f4fb9740.png_sv1", "contentImg": ["http://img5.baixing.net/de4288b1bb95fc7954f15ea4dcac3e3c.png_sv1", "http://img6.baixing.net/b80dd3aafa0c36e6c27722b338df4df6.png_sv1", "http://img6.baixing.net/26438cb28ed1d84a447f9f449be3d828.png_sv1", "http://img6.baixing.net/b80dd3aafa0c36e6c27722b338df4df6.png_sv1", "http://img6.baixing.net/5b9c77aac2d80436484c7935ccfd000a.png_sv1"], "tags": ["123123123"], "content": "\n图片格式：jpg、jpeg、png，大小不超过3M，图片比例3：2，尺寸需大于300*200\n\n严禁上传侵权图片，被控侵权百姓网不承担任何责任，需用户自行承担\n图片格式：jpg、jpeg、png，大小不超过3M，图片比例3：2，尺寸需大于300*200\n\n严禁上传侵权图片，被控侵权百姓网不承担任何责任，需用户自行承担\n图片格式：jpg、jpeg、png，大小不超过3M，图片比例3：2，尺寸需大于300*200\n\n严禁上传侵权图片，被控侵权百姓网不承担任何责任，需用户自行承担\n图片格式：jpg、jpeg、png，大小不超过3M，图片比例3：2，尺寸需大于300*200\n\n严禁上传侵权图片，被控侵权百姓网不承担任何责任，需用户自行承担", "name": "12312312面议面议面议12312312面议面议面议", "price": "面议", "cateName": "分组名称2", "status": 1, "memo": "", "urlSuffix": "http://zmlc2b.shop-test.baixing.cn/p-2097.html" }, { "id": 2096, "contentCateId": 859, "headImg": "http://img4.baixing.net/ce98596e5bf55cd03cd69403c6142e93.png_sv1", "contentImg": ["http://img4.baixing.net/c9abe7739feb287fe887760e24a3efef.png_sv1", "http://img6.baixing.net/29b8891e157c0c4eddebb8b917812023.png_sv1", "http://img5.baixing.net/15fc10c3493b9429fc0fe3c571c43cff.png_sv1"], "tags": ["123"], "content": "\n用于正文介绍\n图片格式：jpg、jpeg、png，大小不超过3M，图片比例3：2，尺寸需大于300*200\n\n严禁上传侵权图片，被控侵权百姓网不承担任何责任，需用户自行承担\n用于正文介绍\n图片格式：jpg、jpeg、png，大小不超过3M，图片比例3：2，尺寸需大于300*200\n\n严禁上传侵权图片，被控侵权百姓网不承担任何责任，需用户自行承担\n用于正文介绍\n图片格式：jpg、jpeg、png，大小不超过3M，图片比例3：2，尺寸需大于300*200\n\n严禁上传侵权图片，被控侵权百姓网不承担任何责任，需用户自行承担", "name": "123", "price": "面议", "cateName": "分组名称2", "status": 1, "memo": "", "urlSuffix": "http://zmlc2b.shop-test.baixing.cn/p-2096.html" }, { "id": 2095, "contentCateId": 859, "headImg": "", "contentImg": ["http://img4.baixing.net/3b5517a9842dbb88df653001ac52c31b.png_sv1", "http://img6.baixing.net/24dc2f9e5fe8fd73253d2a44a308b5eb.png_sv1", "http://img4.baixing.net/929be35e2720fb066f68e1d0126a6960.png_sv1", "http://img5.baixing.net/a95ec7db413c47ec747fc2917de58746.png_sv1"], "tags": ["请问"], "content": "去问驱蚊器为用于正文介绍\n图片格式：jpg、jpeg、png，大小不超过3M，图片比例3：2，尺寸需大于300*200\n\n严禁上传侵权图片，被控侵权百姓网不承担任何责任，需用户自行承担\n用于正文介绍\n图片格式：jpg、jpeg、png，大小不超过3M，图片比例3：2，尺寸需大于300*200\n\n严禁上传侵权图片，被控侵权百姓网不承担任何责任，需用户自行承担", "name": "去恶趣味", "price": "qwe", "cateName": "分组名称2", "status": 1, "memo": "", "urlSuffix": "http://zmlc2b.shop-test.baixing.cn/p-2095.html" }]
    })
    setDetail(res.data)
  }

  useEffect(() => {
    getDetail()
  }, [])

  const handleSubmit = async () => {
    console.log(formRef.current.form?.getFieldsValue())
    setUpDataLoading(true)
    const res = await mockData('data', null)
    setUpDataLoading(false)
  }

  useImperativeHandle(parentRef, () => ({
    handleUpData: handleSubmit,
    disabled: upDataLoading
  }))

  return <div className={styles["about-us-container"]}>
    <WildcatForm
      ref={formRef}
      editDataSource={detail}
      config={config}
    />
  </div>
}

export default forwardRef(Product)