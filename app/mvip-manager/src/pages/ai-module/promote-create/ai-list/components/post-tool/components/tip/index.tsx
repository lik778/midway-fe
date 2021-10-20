import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { Select, Button, } from 'antd'
import { Link, useHistory } from 'umi'
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { USER_NAMESPACE } from '@/models/user';
import styles from '../../../../index.less'
import tipStyles from './index.less'
import AiModuleContext from '../../../../../context'
import MyModal, { ModalType } from '@/components/modal';
import { getOnlineADCount, getCompanyInfo } from '@/api/ai-module'
import { CompanyInfo } from '@/interfaces/ai-module';
import { VerifyItem } from '@/interfaces/user';
import { VerifyStatus } from '@/enums/index'
import { CollectionListItem } from '@/interfaces/ai-module';
import { CollectionStatus } from '@/enums/ai-module'
const { Option } = Select

interface Props {
  dataList: CollectionListItem[],
  dataTotal: number,
  verifyList: VerifyItem[],
  userLoading: boolean
}

const modalTip = {
  companyInfo: {
    title: '去完善信息',
    content: '请填写用户基础资料',
    okText: '去填写'
  },
  verifyList: {
    title: '去认证信息',
    content: '您未完成身份证或营业执照认证,完成认证后才能发帖',
    okText: '去认证'
  }
}

const Tip: FC<Props> = (props) => {
  const { dataList, dataTotal, verifyList, userLoading } = props
  const history = useHistory()
  const { activeModuleKey, handleChangeContextData, vipResourcesList, selectedVipResources } = useContext(AiModuleContext)

  const [showBaseInfoModal, setShowBaseInfoModal] = useState<boolean>(false)
  const [adCount, setAdCount] = useState<number>(0)
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null)

  const [modalType, setModalType] = useState<'companyInfo' | 'verifyList'>('companyInfo')

  const showGotoUserBtn = useMemo(() => {
    if (companyInfo) {
      return dataList.some(item => {
        if (item.id <= companyInfo.maxOldTaskId) {
          return item.status !== CollectionStatus.COLLECTION_FINISHED_STATUS
        }
      })
    }
  }, [companyInfo, dataList])

  const getCompanyInfoFn = async () => {
    const res = await getCompanyInfo()
    if (res.success) {
      setCompanyInfo(res.data)
    }
  }

  const handleCheckBaseInfo = () => {
    if (companyInfo?.isUserPerfect) {
      if (verifyList.some(item => item.status === VerifyStatus.ACCEPT)) {
        history.push('/ai-module/promote-create/post-create')
      } else {
        setModalType('verifyList')
        setShowBaseInfoModal(true)
      }
    } else {
      setModalType('companyInfo')
      setShowBaseInfoModal(true)
    }
  }

  const handleClickModalOk = () => {
    if (modalType === 'companyInfo') {
      history.push('/company-info/base')
    } else {
      location.href = "//www.baixing.com/bind/"
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
    handleChangeContextData('selectedVipResources', option.item)
  }

  useEffect(() => {
    // 每次切换module
    if (activeModuleKey === 'postTool') {
      getTipInfo()
    }
  }, [activeModuleKey])

  useEffect(() => {
    getCompanyInfoFn()
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
      <Button className={`${styles['action-btn']} ${styles['create-action-btn']}`} onClick={handleCheckBaseInfo} disabled={userLoading}>+AI批量创建推广</Button>

      {
        showGotoUserBtn && <Button className={styles['action-btn']} onClick={() => handleClickA(`//www.baixing.com/vip/manager/service/${selectedVipResources?.productLine}/postTool/addUserInfo`)}>填写基础信息</Button>
      }
      <Button className={styles['action-btn']} onClick={() => handleClickA(`https://www.baixing.com/vip/manager/service/${selectedVipResources?.productLine}/postTool/adList`)}>发帖通帖子列表</Button>
      <Button className={styles['action-btn']} onClick={() => handleClickA('https://www.baixing.com/fabu/jiameng')}>手动发布</Button>
    </div>
    <p className={styles['page-tip']}>发帖通是您的发帖小助手，通过发帖通添加素材包、设置发帖内容，系统将每天自动发布帖子。</p>
    <p className={styles['page-tip']}>“预估生成帖子数”是系统预估的最大可生成帖子数，会有一定误差，仅供参考</p>
    <p className={styles['page-tip']}>您已添加素材包数：<span className={styles['num']}>{dataTotal}</span> ；发帖通已发布当前在线帖子数：<span className={styles['num']}>{adCount}</span> ；</p>
    <MyModal
      title={modalTip[modalType].title}
      content={modalTip[modalType].content}
      type={ModalType.info}
      closable={false}
      maskClosable={false}
      onCancel={() => { setShowBaseInfoModal(false) }}
      onOk={handleClickModalOk}
      visible={showBaseInfoModal} />
  </>
}


export default connect((state: ConnectState) => {
  const { verifyList } = state[USER_NAMESPACE]
  console.log(state)
  const userLoading = state.loading.models.user
  return { verifyList, userLoading }
})(Tip)