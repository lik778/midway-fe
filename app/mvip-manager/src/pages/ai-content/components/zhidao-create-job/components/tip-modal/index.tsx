import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Link, history } from 'umi'
import { Progress, Spin } from 'antd'
import { ActiveKey } from '@/pages/ai-content/ai-zhidao/index'
import { ExclamationCircleOutlined, InfoCircleOutlined, CloseOutlined } from '@ant-design/icons'
import { CreateQuestionTaskPageStatus, CreateQuestionTaskBasicData } from '@/interfaces/ai-content'
import styles from './index.less'
import { getQuestionBuildStatus } from '@/api/ai-content'
import MyModal, { ModalType } from '@/components/modal';

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
      setProgress(90)
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

  return <>
    {

    }
    <MyModal
      title="去完善信息"
      content={notice}
      type={ModalType.info}
      closable={false}
      maskClosable={false}
      onCancel={() => changeActiveKey('job-list')}
      onOk={() => {
        if (nextAction === 'USER_PROFILE') {
          history.push('/company-info/base')
        } else if (nextAction === 'USER_MATERIAL') {
          changeActiveKey('basic-material')
        }
      }}
      visible={pageStatus === 'create' && showModal} />
    {
      pageStatus === 'loading' && <div className={styles["tip-modal"]}>
        <Progress className={styles['progress']} type="circle" percent={progress} />
        <div className={styles["notice"]}>正在为您生成问答，请不要关闭页面</div>
        <div className={styles['spin-box']}>
          <Spin />
        </div>
      </div>
    }
  </>
}

export default TipModal