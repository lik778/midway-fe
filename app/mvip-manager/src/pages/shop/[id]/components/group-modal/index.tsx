
import React, { useEffect, useState } from 'react';
import './index.less';
import { Modal, Input } from 'antd';
import classNames from 'classnames';
import { createContentCateApi, updateContentCateApi } from '@/api/shop'
import { CateItem, RouteParams, ShopInfo } from '@/interfaces/shop';
import { useParams } from 'umi';
import { ContentCateType, ProductType } from '@/enums';
import { errorMessage, successMessage } from '@/components/message';
import { SHOP_NAMESPACE } from '@/models/shop';
import { connect } from 'dva';

// 分组tkd配置
const groupConfig = [
  {
    label: '分组名称',
    placeholder: "请输入名称, 2~8个字",
    required: true,
    maxLength:8,
    minLength:2,
    id:'name',
    value: '',
    initLen: 0,
    err: '请输入大于2个字的名称',
    errClass:'',
    visible: true
  },
  {
    label: 'SEO标题',
    placeholder: "请输入标题, 9~50个字",
    required: false,
    maxLength:50,
    minLength:9,
    id:'seoT',
    value: '',
    initLen: 0,
    err: '请输入大于9个字的SEO标题',
    errClass:'',
    visible: false
  },
  {
    label: 'SEO关键词',
    placeholder: "请输入关键词",
    required: false,
    id:'seoK',
    value: '',
    initLen: 0,
    minLength: 0,
    maxLength: 100,
    err: '',
    errClass:'',
    visible: false
  },
  {
    label: 'SEO描述',
    placeholder: "请输入描述, 40~80个字",
    required: false,
    maxLength:80,
    minLength:40,
    id: 'seoD',
    value: '',
    initLen: 0,
    err:'请输入大于40个字的SEO描述',
    errClass:'',
    visible: false
  },
]


const errClass = 'input-error'

interface Props {
  editItem?: any;
  type: ContentCateType;
  visible: boolean;
  groupCreate(item: CateItem): void;
  groupUpdate(item: CateItem): void;
  onClose(): void;
  curShopInfo: ShopInfo | undefined;
}
const NewCate = (props: Props) => {
  console.log(1,props)
  const params: RouteParams = useParams();
  const { editItem, type, onClose, groupCreate, groupUpdate } = props;
  const [config, setConfig] = useState(groupConfig)
  const [err, setError] = useState('')
  const [confirmLoading, setConfirmLoading] = useState(false);
  useEffect(() => {
    const groupCloneConfig = groupConfig.concat()
    if (editItem) {
      setConfig(config.map(g => {
        g.value = editItem[g.id]
        g.initLen = editItem[g.id].length
        if(g.required && g.value) {
          g['errClass'] = ''
          setError('')
        }

        if(g.value && g.initLen > g.minLength) {
          g['errClass'] = ''
          setError('')
        }
        return g
      }))
    } else {
      setConfig(groupCloneConfig.map(x => {
        x.value = (editItem && editItem[x.id]) || '';
        return x;
      }))
    }
  }, [editItem]);



  const resetConfigValue = (config: any) => {
    setConfig(config.map((x: any) => { x.value = ''; x.initLen = 0;return x }))
  }


  const handleOk = async() => {
    if(confirmLoading) {
      return
    }
    const r: any = {}
    let errInfo: string = ''
    const newConfig = config.concat()
    newConfig.forEach((c, i) => {
      r[c.id] = c.value
      if(c.required && !c.value){
        newConfig[i]['errClass'] = errClass
        errInfo= `您输入${c.label}不能为空`
        setConfig(newConfig)
      }

      if(c.value && c.initLen < c.minLength) {
        errInfo = c.err
        newConfig[i]['errClass'] = errClass

      }
    })

    setError(errInfo)
    setConfig(newConfig)

    if(errInfo.length) {
      return;
    }
    setConfirmLoading(true)
    // to api
    if (editItem) {
      const mergeItem = Object.assign(editItem, r);
      const res = await updateContentCateApi(Number(params.id), {...mergeItem, type})
      setConfirmLoading(false)
      if (res?.success) {
        successMessage('编辑成功');
        groupUpdate(res?.data);
        resetConfigValue(config);
        onClose();
      } else {
        errorMessage(res?.message)
      }
    } else {
      const res = await createContentCateApi(Number(params.id), {...r, type})
      setConfirmLoading(false)
      if (res?.success) {
        successMessage('新增分组成功');
        groupCreate(res?.data);
        resetConfigValue(config);
        onClose();
      } else {
        errorMessage(res?.message)
      }
    }
  };

  // 输入框
  const handleChange = (e: any) => {
    const target = e.target
    const name = target.name
    const value = target.value

    setConfig(config.map(g => {
        if (g.id === name) {
          // 去掉空格
          g.value = value.replace(/\s/g, '')
          g.initLen = value.length
        }
        if(g.required && g.value) {
          g['errClass'] = ''
          setError('')
        }

        if(g.value && g.initLen > g.minLength) {
          g['errClass'] = ''
          setError('')
        }
        return g
    }))
  }

  //只有B2B的店铺，新建分组才会有SEO设置
  const { curShopInfo } = props
  useEffect(() => {
    if (curShopInfo){
      const { type } = curShopInfo
      if (type == ProductType.B2B){
        const newConfig = config.map(x => ({
          ...x,
          visible:true
        }))
        setConfig(newConfig)
      }
    }
  }, [curShopInfo])

  return (
    <div className="group-modal">
      <Modal
        title="新建分组"
        visible={props.visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={props.onClose}
        className="g-modal"
      >
        <p className="error">{err}</p>
        <ul className="g-main">
            { config && config.map(g => {
              return(
                g.visible && <li className="f-input" key={g.id}>
                  <label htmlFor={g.id} className={classNames({'required': g.required})}>{g.label}</label>
                  <Input placeholder={g.placeholder} id={g.id} name={g.id} className={g.errClass} maxLength={g.maxLength} minLength={g.minLength} onChange={handleChange}
                         value={g.value}/>
                  {g.maxLength&&<span className="f-len">{g.initLen}/{g.maxLength}</span>}
                </li>
              )
            })}
          </ul>
      </Modal>
    </div>
  );
}

//取状态管理里的当前店铺信息，用于判断店铺类型，是否显示SEO设置
export default connect((state: any): any => {
  const { curShopInfo } = state[SHOP_NAMESPACE]
  return { curShopInfo }
})(NewCate)
