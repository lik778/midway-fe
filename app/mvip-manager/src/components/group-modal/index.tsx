
import React, {useState} from 'react';
import './index.less';
import { Modal, Input } from 'antd';
import classNames from 'classnames';


// 分组tkd配置
const groupConfig = [
  {
    label: '分组名称',
    placeholder: "请输入名称, 2~30个字",
    required: true,
    maxLength:20,
    minLength:1,
    id:'name',
    value: '',
    initLen: 0,
  },
  {
    label: 'title',
    placeholder: "请输入名称, 9~15个字",
    required: false,
    maxLength:15,
    minLength:9,
    id:'title',
    value: '',
    initLen: 0,
  },
  {
    label: 'keyword',
    placeholder: "请输入关键词",
    required: false,
    id:'keyword',
    value: '',
    initLen: 0,
    maxLength: undefined,
  },
  {
    label: 'description',
    placeholder: "请输入描述, 40~80个字",
    required: false,
    maxLength:80,
    minLength:40,
    id: 'description',
    value: '',
    initLen: 0,
  },
]

const gData = {
  'name': '',
  'title': '',
  'keyword': '',
  'description': ''
}

export default (props: any) => {
  const [config, setConfig] = useState(groupConfig)
  // 确定loading
  const [confirmLoading, setConfirmLoading] = useState(false);
  // 弹窗报错
  const [isInputErr, setInputErr] = useState({
    key:'',
    isRequired: false
  })

  const [resModal, setResModal] = useState(gData)

  // 弹窗错误显示
  const [err, setError] = useState('')

  const handleOk = () => {
    // setConfirmLoading(true);
    // setTimeout(() => {
    //   props.onClose(false)
    //   setConfirmLoading(false);
    // }, 2000);

    config.forEach(c => {
      console.log(c.id)
    })
    props.onClose(false)
  };

  const handleCancel = () => {
    props.onClose(false)
  };



  // 输入框必选
  const inputIsRequired = (str: string) => {
    if(isInputErr.key === str) {
      return isInputErr.isRequired? 'input-error' : ''
    }
    return ''
  }



  // 输入框
  const handleChange = (e: any) => {
    const target = e.target
    const name = target.name
    const value = target.value
    let newConfig = groupConfig.concat()
    newConfig.map(g => {
        if(g.id == name) {
          g.value = value
          g.initLen = value.length
        }
    })

    setConfig(newConfig)
  }

  return (
    <div className="group-modal">
      <Modal
        title="新建分组"
        visible={props.isModalVisible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        className="g-modal"
      >
        <p className="error">{err}</p>
        <ul className="g-main">
            { config && config.map(g => {
              return(
                <li className="f-input" key={g.id}>
                  <label htmlFor={g.id} className={classNames({'required': g.required})}>{g.label}</label>
                  <Input placeholder={g.placeholder} id={g.id} name={g.id} className={inputIsRequired(g.id)} maxLength={g.maxLength} minLength={g.minLength} onChange={handleChange} value={g.value}/>
                  {g.maxLength&&<span className="f-len">{g.initLen}/{g.maxLength}</span>}
                </li>
              )
            })}
          </ul>
      </Modal>
    </div>
  );
}
