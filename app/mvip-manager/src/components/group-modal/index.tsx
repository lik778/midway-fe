
import React, { useEffect, useState } from 'react';
import './index.less';
import { message, Modal, Input } from 'antd';
import classNames from 'classnames';
import { createContentCateApi, updateContentCateApi } from '@/api/shop'
import { CateItem, RouteParams } from '@/interfaces/shop';
import { useParams } from 'umi';
import { ContentCateType } from '@/enums';


// 分组tkd配置
const groupConfig = [
  {
    label: '分组名称',
    placeholder: "请输入名称, 2~30个字",
    required: true,
    maxLength:20,
    minLength:2,
    id:'name',
    value: '',
    initLen: 0,
    err: '请输入大于2个字的名称',
    errClass:''
  },
  {
    label: 'title',
    placeholder: "请输入标题, 9~15个字",
    required: false,
    maxLength:15,
    minLength:9,
    id:'seoT',
    value: '',
    initLen: 0,
    err: '请输入大于9个字的标题',
    errClass:''
  },
  {
    label: 'keyword',
    placeholder: "请输入关键词",
    required: false,
    id:'seoK',
    value: '',
    initLen: 0,
    minLength: 0,
    maxLength: 100,
    err: '',
    errClass:''
  },
  {
    label: 'description',
    placeholder: "请输入描述, 40~80个字",
    required: false,
    maxLength:80,
    minLength:40,
    id: 'seoD',
    value: '',
    initLen: 0,
    err:'请输入大于40个字的描述',
    errClass:''
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
}
export default (props: Props) => {
  const params: RouteParams = useParams();
  const { editItem, type, onClose, groupCreate, groupUpdate } = props;
  // const haha = groupConfig.map(x => {
  //   x.value = (editItem && editItem[x.id]) || '';
  //   console.log(x)
  //   return x;
  // })
  const [config, setConfig] = useState(groupConfig)
  // 确定loading
  const [confirmLoading, setConfirmLoading] = useState(false);
  // 弹窗报错
  const [isInputErr, setInputErr] = useState({
    key:'',
    isRequired: false
  })

  useEffect(() => {
    setConfig(groupConfig.map(x => {
      x.value = (editItem && editItem[x.id]) || '';
      return x;
    }))
  }, [editItem]);

  // 弹窗错误显示
  const [err, setError] = useState('')

  const resetConfigValue = (config: any) => {
    setConfig(config.map((x: any) => { x.value = ''; return x }))
  }

    const handleOk = async () => {
    const r: any = {}

    const newConfig = config.concat()
    newConfig.forEach((c, i) => {
      r[c.id] = c.value
      if(c.required && !c.value){
        newConfig[i]['errClass'] = errClass
        setConfig(newConfig)
        return
      }

      if(c.value && c.initLen < c.minLength) {
        setError(c.err)
        newConfig[i]['errClass'] = errClass
        setConfig(newConfig)
        return
      }
    })
    // to api
    if (editItem) {
      const mergeItem = Object.assign(editItem, r);
      const res = await updateContentCateApi(Number(params.id), {...mergeItem, type})
      if (res.success) {
        message.success('编辑成功');
        groupUpdate(res.data);
        resetConfigValue(config);
        onClose();
      } else {
        message.error(res.message)
      }
    } else {
      const res = await createContentCateApi(Number(params.id), {...r, type})
      if (res.success) {
        message.success('新增分组成功');
        groupCreate(res.data);
        resetConfigValue(config);
        onClose();
      } else {
        message.error(res.message)
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
          g.value = value
          g.initLen = value.length
        }
        if(g.required && g.value) {
          g['errClass'] = ''
        }

        if(g.value && g.initLen > g.minLength) {
          g['errClass'] = ''
          setError('')
        }
        return g
    }))
  }

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
                <li className="f-input" key={g.id}>
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
