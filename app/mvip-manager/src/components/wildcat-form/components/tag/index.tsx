import React, {useState} from 'react';
import { Tag, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TweenOneGroup } from 'rc-tween-one'
import './index.less';

export const TagModule = (props: any) => {
  const [tags, setTags] = useState(['Tag 1', 'Tag 2', 'Tag 3'])
  const [inputVisible, setInputVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const handleClose = (removedTag: any) => {
    const oldTags = tags.concat()
    const newTags = oldTags.filter(tag => tag !== removedTag);
    setTags(newTags)
  };


  const showInput = () => {
    setInputVisible(true)
    // this.setState({ inputVisible: true }, () => this.input.focus());
  }

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value)
  }

  const handleInputConfirm = () => {
    let newTags:string[] = []
    if (inputValue && tags.indexOf(inputValue) === -1) {
      newTags = [...tags, inputValue];
    }
    setTags(newTags)
    setInputVisible(false)
    setInputValue('')
  };

  // const saveInputRef = input => {
  //   this.input = input;
  // };

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
          />
        )}
        {!inputVisible && (
          <Tag onClick={showInput} className="site-tag-plus">
            <PlusOutlined /> 新增
          </Tag>
        )}
      </div>
  )
}
