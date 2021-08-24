import React, { useMemo, useContext, FC } from 'react'
import { UploadFile } from 'antd/lib/upload/interface';
import styles from './index.less'
interface Props {
  file?: UploadFile
}

const StatusBox: FC<Props> = (props) => {
  const { file = {} as UploadFile } = props
  const percentNowLength = useMemo(() => {
    const radius = 25
    return Math.ceil(2 * 3.14 * radius) * (file.percent || 0) / 100
  }, [file])
  const filePercent = Math.round(file.percent || 0)
  return <div className={styles['status-box']}>
    {
      file.status === 'uploading' && <div className={styles['upload']}>
        {/* <div className={styles['upload']}> */}
        <svg className={styles['progress']} width="60px" height="60px">
          <circle r="25" cy="30" cx="30" strokeWidth="3" stroke="rgba(0,0,0,0.5)" strokeLinejoin="round" strokeLinecap="round" fill="none" />
          <circle r="25" cy="30" cx="30" strokeWidth="3" stroke="#1790FF" strokeLinejoin="round" strokeLinecap="round" fill="none" strokeDashoffset="0px" strokeDasharray={percentNowLength + 'px'} />
        </svg>
        <span className={styles["upload-info"]}>{filePercent}%</span>
      </div>
    }
    {
      file.status === 'error' && <div className={styles['error']}>
        <span className={styles["error-info"]}>
          上传失败
        </span>
      </div>
    }
    {
      props.children
    }
  </div>
}

export default StatusBox