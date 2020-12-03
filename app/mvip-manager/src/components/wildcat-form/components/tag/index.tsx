import React, {useState} from 'react';
import { Tag, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TweenOneGroup } from 'rc-tween-one'
import './index.less';

export const TagModule = (props: any) => {
  const [tags, setTags] = useState<string[]>([])
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const handleClose = (removedTag: any) => {
    const oldTags = tags.concat()
    const newTags = oldTags.filter(tag => tag !== removedTag);
    setTags(newTags)
  };

  const tagsLen = tags.length


  const showInput = () => {
    setInputVisible(true)
  }

  const handleInputChange = (e: any) => {
    const value = e.target.value
    setInputValue(value.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g,''))
  }

  const handleInputConfirm = () => {
    setTags([...tags, inputValue])
    setInputVisible(false)
    setInputValue('')
  };

  const forMap = (tag: any, index: number) => {
    const tagElem = (
      <Tag className="mini-tag" key={index}
        closable
        onClose={e => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag}>
        {tagElem}
      </span>
    );
  };

  const tagChild = tags.map(forMap);

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
            appear={false}
          >
            {tagChild}
          </TweenOneGroup>
        </div>
        {inputVisible && (
          <Input
            type="text"
            size="small"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
            className="input-tag"
            maxLength={props.maxLength}
          />
        )}
        {!inputVisible && tagsLen < props.maxNum &&(
          <Tag onClick={showInput} className="site-tag-plus">
            <PlusOutlined /> 新增
          </Tag>
        )}
      </div>
  )
}
