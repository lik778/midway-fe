import React, { FC, useEffect, useState, useRef } from 'react'
import { EditQuestion, QuestionListItem } from '@/interfaces/ai-content'
import { cloneDeep } from 'lodash'
import ExpandableItem from './input'
interface ExpandableProp {
  record: QuestionListItem,
  upDataLoading: boolean,
  editable: boolean
  handleSave: (requestData: EditQuestion, record: QuestionListItem) => void;
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
    try {
      answerList[index] = answer
      await handleSave({
        questionId: record.id,
        answerId: index,
        content: answer
      }, {
        ...record,
        answers: answerList
      })
    } catch (errInfo) {
      setAnswerList(record.answers)
    }
  }

  return <>
    {
      (answerList || []).map((item, index) => <ExpandableItem answers={answerList} index={index} upDataLoading={upDataLoading} editable={editable} handleChangeAnswer={handleChangeAnswer} key={index}></ExpandableItem>)
    }
  </>
}




export default Expandable