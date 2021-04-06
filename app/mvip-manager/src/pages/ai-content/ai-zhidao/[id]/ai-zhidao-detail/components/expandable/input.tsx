import React, { FC, useEffect, useState, useRef } from 'react'
import { Spin, Input } from 'antd'
import styles from '../../index.less'
import { errorMessage } from '@/components/message'

interface ExpandableItemProp {
  answers: string[],
  index: number
  upDataLoading: boolean,
  editable: boolean
  handleChangeAnswer: (answer: string, index: number) => void
}

const ExpandableItem: FC<ExpandableItemProp> = (props) => {
  const { answers, index, upDataLoading, editable, handleChangeAnswer } = props
  const [editing, setEditing] = useState(false);
  const [localAnswer, setLocalAnswer] = useState<string>(answers[index])

  const inputRef = useRef<Input>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  // 只有修改了数据并保存 后 answer才会修改
  useEffect(() => {
    setLocalAnswer(answers[index])
  }, [answers])

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
      if (localAnswer !== answers[index]) {
        if (!localAnswer || localAnswer.length === 0) {
          errorMessage('答案内容不得为空！')
          setLocalAnswer(answers[index])
        } else if (answers.some((item, cIndex) => item === localAnswer && cIndex !== index)) {
          errorMessage('修改后答案不得与其他答案重复！')
          setLocalAnswer(answers[index])
        } else {
          await handleChangeAnswer(localAnswer, index);
        }
      }
      toggleEdit();
    } catch (errInfo) {
      setLocalAnswer(answers[index])
      console.log('保存失败', errInfo);
    }
  };

  return (
    <div className={`${styles['answer-item']} ${editable && editing ? styles['flex'] : ''}`}>
      <span className={styles['answer-label']}>{index > 0 ? `其他回答${index + 1}` : '最佳答案'}：</span>
      {
        editable && editing ? (
          <div className={styles['answer-input']}>
            <Spin spinning={upDataLoading}>
              <Input value={localAnswer} ref={inputRef} onPressEnter={save} onBlur={save} onChange={(e) => {
                e.persist()
                changeAnswer(e)
              }} />
            </Spin>
          </div>
        ) : (
          <span style={{
            cursor: editable ? 'pointer' : 'null',
            wordBreak: 'break-all'
          }} onClick={() => toggleEdit()}>
            {localAnswer}
          </span>
        )
      }
    </div >
  )
}

export default ExpandableItem