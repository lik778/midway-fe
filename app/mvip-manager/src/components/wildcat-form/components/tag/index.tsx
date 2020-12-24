import React, { useState, useEffect } from 'react';
import { Tag, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TweenOneGroup } from 'rc-tween-one'
import './index.less';

interface Props {
  value: string[];
  maxLength: number;
  minLength: number;
  maxNum: number;
  onChange(tags: any): void;
}

export const TagModule = (props: Props) => {
  const { onChange, value } = props

  const [tags, setTags] = useState<string[]>([])
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (Array.isArray(value)) {
      setTags(value)
    }
  }, [value])

  const handleClose = (removedTag: any) => {
    const oldTags = tags.concat()
    const newTags = oldTags.filter(tag => tag !== removedTag);
    onChange([...newTags].join(','))
    setTags(newTags)
  };


  const showInput = () => {
    setInputVisible(true)
  }

  const handleInputChange = (tag: string) => {
    const val = tag.trim().replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '')
    if(val.length){
      setInputValue(val);
    }
  }

  const handleInputConfirm = () => {
    // tips: 这里还要进行一下数据输入处理
   if (inputValue && !tags.includes(inputValue)) {
      onChange([...tags, inputValue].join(','))
      setTags([...tags, inputValue])
    }
    setInputVisible(false)
    setInputValue('')
  };


  return (
    <div className="tag-module">
        <div className="tag-child">
          <TweenOneGroup
            enter={{
              scale: 0.8,
              opacity: 0,
              type: 'from',
              duration: 100
            }}
            leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
            appear={false}>
            {
              tags.length > 0 && tags.map((tag: string, index: number) => {
                 return (
                     <span key={tag}>
                        <Tag className="mini-tag" key={index} closable
                             onClose={e => {
                               e.preventDefault();
                               handleClose(tag) }
                             }>{tag}</Tag>
                      </span>
                  );
               })
            }
          </TweenOneGroup>
        </div>
        {inputVisible && (
          <Input
            type="text"
            size="small"
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
            className="input-tag"
            minLength={props.minLength}
            maxLength={props.maxLength}
          />
        )}
        {!inputVisible && tags.length < props.maxNum &&(
          <Tag onClick={showInput} className="site-tag-plus">
            <PlusOutlined /> 新增
          </Tag>
        )}
      </div>
  )
}
