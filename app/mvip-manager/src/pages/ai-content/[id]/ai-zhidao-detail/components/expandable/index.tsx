import React, { FC, useEffect, useState, useRef } from 'react'
import { QuestionListItem } from '@/interfaces/ai-content'
import styles from '../../index.less'
import { cloneDeep } from 'lodash'
import ExpandableItem from './input'
import { errorMessage } from '@/components/message'
interface ExpandableProp {
  record: QuestionListItem,
  upDataLoading: boolean,
  editable: boolean
  handleSave: (record: QuestionListItem) => void;
}

const Expandable: FC<ExpandableProp> = (props) => {
  const { record, upDataLoading, editable, handleSave } = props
  const [answerList, setAnswerList] = useState<string[]>(() => {
    return cloneDeep(record.answers)
  })


  useEffect(() => {
    setAnswerList(cloneDeep(record.answers))
  }, [record])

  const handleChangeAnswer = async (answer: string, index: number) => {
    if (answerList.some(item => item === answer)) {
      errorMessage('修改后答案不得与其他答案重复！')
      return
    }
    answerList[index] = answer
    setAnswerList([...answerList])
    await save()
  }

  const save = async () => {
    try {
      await handleSave({
        ...record,
        answers: answerList
      })
    } catch (errInfo) {
      setAnswerList(record.answers)
      console.log('保存失败', errInfo);
    }
  };


  return <>
    {
      (answerList || []).map((item, index) => <div className={styles['answer-item']} key={index}>
        <ExpandableItem answer={item} upDataLoading={upDataLoading} editable={editable} handleChangeAnswer={async (answer) => await handleChangeAnswer(answer, index)}></ExpandableItem>
      </div>)
    }
  </>
}




export default Expandable