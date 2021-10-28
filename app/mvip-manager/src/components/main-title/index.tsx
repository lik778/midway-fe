import React from 'react';
import { Link, useHistory } from 'umi'
import styles from './index.less'

interface Props {
  title: React.ReactNode;
  showJumpIcon?: boolean
  clickUrl?: string
  jumpIcon?: React.ReactNode
}

const MainTitle = (props: Props) => {
  const history = useHistory()
  const { title, showJumpIcon = false, jumpIcon, clickUrl } = props

  const handleClickA = () => {
    if (clickUrl) {
      history.replace(clickUrl)
    } else {
      history.goBack();
    }
  }

  return (
    <div className={styles['page-main-title']}>
      {
        showJumpIcon && <div className={styles['jump-btn']} onClick={handleClickA}>{
          jumpIcon || <div className={styles['arrow']}></div>
        }
        </div>
      }
      <div className={styles['title']}>{title}</div>
    </div>
  );
}

export default MainTitle