import React, { FC, useContext, useEffect, useState } from 'react';
import { Select, Button, } from 'antd'
import { Link, useHistory } from 'umi'
import styles from '../../../../index.less'
import tipStyles from './index.less'
import AiModuleContext from '../../../../../context'
import MyModal, { ModalType } from '@/components/modal';
import { getOnlineADCount, getUserVipResources } from '@/api/ai-module'
const { Option } = Select

interface Props {
  dataTotal: number
}

const Tip: FC<Props> = (props) => {
  const { dataTotal } = props
  const history = useHistory()
  const { activeModuleKey, pageInfo, handleChangeContextData, shopStatus, postToolData, } = useContext(AiModuleContext)
  const { vipResourcesList, selectedVipResources } = postToolData
  const [showBaseInfoModal, setShowBaseInfoModal] = useState<boolean>(false)
  const [adCount, setAdCount] = useState<number>(0)

  const handleCheckBaseInfo = () => {
    if (shopStatus?.isUserPerfect) {
      history.push('/ai-module/promote-create/post-create')
    } else {
      setShowBaseInfoModal(true)
    }
  }

  const handleClickA = (url: string) => {
    window.open(url, '_blank')
  }

  // 获取提示信息
  const getTipInfo = async () => {
    const res = await getOnlineADCount()
    if (res.success) {
      setAdCount(res.data.totalCount)
    }
  }

  // 这里的option 是 Option的props
  const handleChangeSelectedVipResources = (value: string, option: any) => {
    console.log(value, option)
    handleChangeContextData({
      postToolData: {
        ...postToolData,
        selectedVipResources: option.item
      }
    })
  }

  useEffect(() => {
    // 每次切换module
    if (activeModuleKey === 'postTool') {
      getTipInfo()
    }
  }, [activeModuleKey])

  useEffect(() => {
  }, [])

  return <>
    {
      selectedVipResources && <Select className={tipStyles['select-component']} onChange={handleChangeSelectedVipResources} size={"large"} defaultValue={`${selectedVipResources.vipType}-${selectedVipResources.productLine}`}>
        {
          vipResourcesList.map((item) => <Option value={`${item.vipType}-${item.productLine}`} key={`${item.vipType}-${item.productLine}`} item={item}>{item.name}</Option>)
        }
      </Select>
    }

    <div className={styles['page-action-btn-line']}>
      <Button className={`${styles['action-btn']} ${styles['create-action-btn']}`} onClick={handleCheckBaseInfo}>+AI批量创建推广</Button>
      <Link className={styles['action-btn']} to={'/company-info/base'}>填写基础信息</Link>
      <Button className={styles['action-btn']} onClick={() => handleClickA(`https://www.baixing.com/vip/manager/service/${selectedVipResources?.vipType}/postTool/adList`)}>发帖通帖子列表</Button>
      <Button className={styles['action-btn']} onClick={() => handleClickA('https://www.baixing.com/fabu/jiameng')}>手动发布</Button>
    </div>
    <p className={styles['page-tip']}>发帖通是您的发帖小助手，通过发帖通添加素材包、设置发帖内容，系统将每天自动发布帖子。</p>
    <p className={styles['page-tip']}>“预估生成帖子数”是系统预估的最大可生成帖子数，会有一定误差，仅供参考</p>
    <p className={styles['page-tip']}>您已添加素材包数：<span className={styles['num']}>{dataTotal}</span> ；发帖通已发布当前在线帖子数：<span className={styles['num']}>{adCount}</span> ；</p>
    <MyModal
      title="去完善信息"
      content={"请填写用户基础资料"}
      type={ModalType.info}
      closable={false}
      maskClosable={false}
      onCancel={() => { setShowBaseInfoModal(false) }}
      onOk={() => {
        history.push('/company-info/base')
      }}
      visible={showBaseInfoModal} />
  </>
}
export default Tip