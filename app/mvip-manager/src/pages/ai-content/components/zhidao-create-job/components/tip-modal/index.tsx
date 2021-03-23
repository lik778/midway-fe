import React, { FC, useCallback, useEffect, useState } from 'react'
import { Link } from 'umi'
import { Progress } from 'antd'
import { ActiveKey } from '@/pages/ai-content/ai-zhidao/index'
import { ExclamationCircleOutlined, InfoCircleOutlined, CloseOutlined } from '@ant-design/icons'
import { CreateQuestionTaskPageStatus, CreateQuestionTaskBasicData } from '@/interfaces/ai-content'
import styles from './index.less'
import { getQuestionBuildStatus } from '@/api/ai-content'
interface TipModalProp {
  showModal: boolean
  pageStatus: CreateQuestionTaskPageStatus,
  componentBasicData: CreateQuestionTaskBasicData,
  changeActiveKey(activeKey: ActiveKey): void
  closeModal(showModal: boolean): void
}

const TipModal: FC<TipModalProp> = (props) => {
  const { pageStatus, componentBasicData, showModal, closeModal, changeActiveKey } = props
  const { canCreateTask, forceNotice, nextAction, notice } = componentBasicData
  const [getProgressTimer, setGetProgressTimer] = useState<NodeJS.Timeout | null>(null)
  const [progress, setProgress] = useState<number>(0)

  // 获取生成进度
  const getCreateTaskProgress = useCallback(async () => {
    const res = await getQuestionBuildStatus()
    // if (progress === 90) {
    //   setProgress(100)
    //   return
    // }
    if (res.success) {
      if (getProgressTimer) {
        clearInterval(getProgressTimer)
        setGetProgressTimer(null)
      }
      setProgress(100)
    } else {
      setProgress(90)
    }
  }, [getProgressTimer])

  useEffect(() => {
    if (nextAction === 'CREATE_WAITING') {
      if (getProgressTimer) {
        clearInterval(getProgressTimer)
      };
      getCreateTaskProgress()
      const timer = setInterval(() => {
        getCreateTaskProgress()
      }, 1000)
      setGetProgressTimer(timer)
    }
    return () => {
      if (getProgressTimer) {
        clearInterval(getProgressTimer);
      }
    }
  }, [nextAction])

  useEffect(()=>{
    if(progress===100){
      
    }
  },[progress])

  return showModal ? <div className={styles["tip-modal"]}>
    {
      nextAction === 'USER_MATERIAL' && <CloseOutlined className={styles['close']} onClick={() => closeModal(false)} />
    }
    {
      // 需要补充用户信息
      pageStatus === 'create' && forceNotice && nextAction === 'USER_PROFILE' && (
        <>
          <ExclamationCircleOutlined className={`${styles['icon']} ${styles['icon-user-profile']}`} />
          <div className={styles["notice"]}>{notice}</div>
          <Link to="/company-info/base">点击完善基础资料</Link>
        </>
      )
    }
    {
      // 需要补充用户信息
      pageStatus === 'create' && nextAction === 'USER_MATERIAL' && (
        <>
          <InfoCircleOutlined className={`${styles['icon']} ${styles['icon-user-material']}`} />
          <div className={styles["notice"]}>{notice}</div>
          <div className={styles["goto-user-material"]} onClick={() => changeActiveKey('basic-material')}>点击补充基础素材</div>
        </>
      )
    }
    {
      // 请求过程量
      pageStatus === 'loading' && nextAction === 'CREATE_WAITING' && (
        <>
          <Progress className={styles['progress']} type="circle" percent={progress} />
          <div  className={styles["notice"]}>{notice || '问答包生成中，请稍候~'}</div>
        </>
      )
    }

  </div> : <></>
}

export default TipModal