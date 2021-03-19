import React, { FC, useEffect, useState, useRef } from 'react'
import { AnswerListItem, QuestionListItem } from '@/interfaces/ai-content'
import styles from '../../index.less'
import { cloneDeep } from 'lodash'
import ExpandableItem from './input'
interface ExpandableProp {
  record: QuestionListItem,
  upDataLoading: boolean,
  editable: boolean
  handleSave: (record: QuestionListItem) => void;
}

const Expandable: FC<ExpandableProp> = (props) => {
  const { record, upDataLoading, editable, handleSave } = props
  const [answerList, setAnswerList] = useState<AnswerListItem[]>(() => {
    return cloneDeep(record.answer)
  })


  useEffect(() => {
    setAnswerList(cloneDeep(record.answer))
  }, [record])

  const handleChangeAnswer = async (answer: AnswerListItem, index: number) => {
    answerList[index] = answer
    setAnswerList([...answerList])
    await save()
  }

  const save = async () => {
    try {
      await handleSave({
        ...record,
        answer: answerList
      })
    } catch (errInfo) {
      setAnswerList(record.answer)
      console.log('保存失败', errInfo);
    }
  };


  return <>
    {
      (answerList || []).map((item, index) => <div className={styles['answer-item']} key={item.id}>
        <ExpandableItem answer={item} upDataLoading={upDataLoading} editable={editable} handleChangeAnswer={async (answer) => await handleChangeAnswer(answer, index)}></ExpandableItem>
      </div>)
    }
  </>
}




export default Expandable