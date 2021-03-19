import React, { FC, useEffect, useState, useRef } from 'react'
import { Spin, Input } from 'antd'

interface ExpandableItemProp {
  answer: string,
  upDataLoading: boolean,
  editable: boolean
  handleChangeAnswer: (answer: string) => void
}

const ExpandableItem: FC<ExpandableItemProp> = (props) => {
  const { answer, upDataLoading, editable, handleChangeAnswer } = props
  const [editing, setEditing] = useState(false);
  const [localAnswer, setLocalAnswer] = useState<string>(answer)

  const inputRef = useRef<Input>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  // 只有修改了数据并保存 后 answer才会修改
  useEffect(() => {
    setLocalAnswer(answer)
  }, [answer])

  const toggleEdit = () => {
    // 查看模式不允许修改
    if (!editable) return
    // 如果数据在上传 则不允许修改其他项（因为没记录当前修改项）
    if (upDataLoading) return
    setEditing(!editing);
  };

  const changeAnswer = (e: any) => {
    setLocalAnswer(e.target.value)
  }

  const save = async () => {
    try {
      if (localAnswer !== answer) {
        await handleChangeAnswer(localAnswer);
      }
      toggleEdit();
    } catch (errInfo) {
      setLocalAnswer(answer)
      console.log('保存失败', errInfo);
    }
  };

  return editable && editing ? (
    <Spin spinning={upDataLoading}>
      <Input value={localAnswer} ref={inputRef} onPressEnter={save} onBlur={save} onChange={(e) => {
        e.persist()
        changeAnswer(e)
      }} />
    </Spin>
  ) : (
    <div style={{
      cursor: editable ? 'pointer' : 'null'
    }} onClick={() => toggleEdit()}>
      {localAnswer}
    </div>
  )
}

export default ExpandableItem