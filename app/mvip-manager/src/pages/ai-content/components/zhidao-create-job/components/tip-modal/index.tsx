import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
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
  /** 当pageStatus === create时componentBasicData as CreateQuestionTaskBasicData, pageStatus===loading时componentBasicData as null */
  componentBasicData: CreateQuestionTaskBasicData | null,
  changeActiveKey(activeKey: ActiveKey): void
  closeModal(showModal: boolean): void
  /** 任务进度100%的回调函数 */
  taskBuildSuccess(): void
}

const TipModal: FC<TipModalProp> = (props) => {
  const { pageStatus, componentBasicData, showModal, closeModal, changeActiveKey, taskBuildSuccess } = props
  const { canCreateTask, forceNotice, nextAction, notice } = (componentBasicData || {})

  const [getProgressTimer, setGetProgressTimer] = useState<NodeJS.Timeout | null>(null)
  const [progress, setProgress] = useState<number>(0)

  // 获取生成进度
  const getCreateTaskProgress = useRef<() => void>()

  const getCreateTaskProgressFn = async () => {
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
      // TODO;
      if (progress < 90) {
        setProgress(progress => progress + 10)
      } else {
        setProgress(100)
      }
    }
  }

  useEffect(() => {
    getCreateTaskProgress.current = getCreateTaskProgressFn
  })

  useEffect(() => {
    if (pageStatus !== 'loading') return
    if (getProgressTimer) {
      clearInterval(getProgressTimer)
    };
    getCreateTaskProgress.current!()
    const timer = setInterval(() => {
      getCreateTaskProgress.current!()
    }, 1000)
    setGetProgressTimer(timer)
    return () => {
      if (getProgressTimer) {
        clearInterval(getProgressTimer);
      }
    }
  }, [pageStatus])

  useEffect(() => {
    if (progress === 100) {
      taskBuildSuccess()
      setProgress(0)
    }
  }, [progress])

  return showModal ? <div className={styles["tip-modal"]}>
    {
      // 补充基础素材库 可以关闭弹窗
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
      // 补充基础素材库
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
      pageStatus === 'loading' && (
        <>
          <Progress className={styles['progress']} type="circle" percent={progress} />
          <div className={styles["notice"]}>正在为您生成问答，请不要关闭页面</div>
        </>
      )
    }

  </div> : <></>
}

export default TipModal