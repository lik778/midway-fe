import React, { useState, useEffect, useMemo } from 'react';
import {  Alert, Button, Menu, Modal, Popover, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Link, useHistory } from 'umi';
import { ShopBasisType, ShopTDKType, ProductType } from '@/enums';
import { useParams } from 'umi';
import { RouteParams } from '@/interfaces/shop';
import { SHOP_NAMESPACE, shopMapDispatchToProps } from '@/models/shop';
import { connect, Dispatch } from 'dva';
import { ConnectState } from '@/models/connect';
import styles from './index.less'
import { changeTemplate, changeThemeColor } from '@/api/shop';
import { NEW_TEMPLATE_ID } from '@/constants';
import { successMessage } from '@/components/message';
import { getGuideFirstClick, setGuideFirstClick } from '@/api/user';
interface Props {
  type: ShopBasisType;
  // curShopInfo: ShopInfo | null;
  // shopStatus: ShopStatus | null
  // getShopStatus: () => Promise<any>
  [key: string]: any;
  dispatch: Dispatch;
}
type colorEnum = 'BLUE' | 'RED' | 'GREEN' | 'GOLD' | 'DEFAULT'
type colorEnumValue = 1 | 2 | 3 | 4 | 5
type themeColorType = {
    key: colorEnum,
    value: string,
    preview: string,
    colorValue: colorEnumValue
}
const themeColors: themeColorType[] = [
    {
        key: 'BLUE',
        colorValue: 5,
        value: '#343434',
        preview: require('@/assets/images/template-blue.png')
    },
    {
        key: 'RED',
        colorValue: 1,
        value: '#EF1F1F',
        preview: require('@/assets/images/template-red.png')
    },
    {
        key: 'GREEN',
        colorValue: 3,
        value: '#30B015',
        preview: require('@/assets/images/template-green.png')
    },
    {
        key: 'GOLD',
        colorValue: 4,
        value: '#BF8452',
        preview: require('@/assets/images/template-gold.png')
    },
    {
        key: 'DEFAULT',
        colorValue: 2,
        value: '#336FFF',
        preview: require('@/assets/images/template-default.png')
    }
]


const BasisTab = (props: Props) => {
  const { shopStatus, curShopInfo, getShopStatus } = props
  const params: RouteParams = useParams();
  const history = useHistory()
  const [current, setCurrent] = useState(props.type)
  const [currentTheme, setCurrentTheme] = useState<colorEnumValue>(curShopInfo?.currentTheme)
  const [isSwitchTemplate, setIsSwitchTemplate] = useState<boolean>(false)
  const [isGuideFirstClick, setIsGuideFirstClick] = useState<boolean>(false)
  const menuList = [
    {
      link: `/shop/${params.id}/${ShopBasisType.NAV}`,
      label: "????????????",
      key: ShopBasisType.NAV,
      display: true,
    },
    {
      link: `/shop/${params.id}/${ShopBasisType.SEO}/${ShopTDKType.INDEX}`,
      label: "SEO??????",
      key: ShopBasisType.SEO,
      display: true,
    },
    {
      link: `/shop/${params.id}/${ShopBasisType.CONSULTATION}`,
      label: "????????????",
      key: ShopBasisType.CONSULTATION,
      display: true,
    },
    {
      // tip: ????????????????????????????????????????????????????????????????????????????????????
      link: `/shop/${params.id}/${ShopBasisType.INFO}`,
      label: "??????????????????",
      key: ShopBasisType.INFO,
      display: false,
    },
    {
      link: `/shop/${params.id}/${ShopBasisType.MODULE}`,
      label: "????????????",
      key: ShopBasisType.MODULE,
      display: true,
    }
  ]

  //??????B2B?????????????????????SEO??????
  // ??????shopStatus.hasMultiShopRights ???true ?????????????????????
  const menuListNow = useMemo(() => {
    if (curShopInfo && typeof shopStatus?.hasMultiShopRights === 'boolean') {
      const { type } = curShopInfo;
      const isB2B = Boolean(type === ProductType.B2B)
      const { hasMultiShopRights } = shopStatus;

      return menuList.map(item => {
        if (item.key === ShopBasisType.INFO) {
          if (hasMultiShopRights) {
            item.display = true
          } else if (history.location.pathname.includes(ShopBasisType.INFO)) {
            // ???????????????????????????????????? ????????????info?????? ???????????????
            history.replace('/shop')
          }
        }
        return item
      })
    } else {
      return menuList
    }
  }, [curShopInfo, shopStatus])

  useEffect(() => {
    getIsGuideFirstClick()
    if (!shopStatus || (shopStatus && Object.keys(shopStatus).length === 0)) {
        getShopStatus()
    }
    setCurrentTheme(curShopInfo?.currentTheme)
  }, [curShopInfo, shopStatus ])

  const getIsGuideFirstClick = async () => {
    const { data } = await getGuideFirstClick()
    if(curShopInfo && curShopInfo.templateId !== NEW_TEMPLATE_ID && curShopInfo.type === ProductType.B2B && data){
      setIsSwitchTemplate(true)
    }
    setIsGuideFirstClick(data)
  }

  const handleClick = (e: { key: any; }) => { setCurrent(e.key) };
  const themeColor = () => {
      const currentThemeColor = themeColors.find(theme => theme.colorValue === currentTheme)
    return <div className={styles['theme-color']}>
        <ul>
            {
                themeColors.map(theme => <li onClick={() => setCurrentTheme(theme.colorValue)} className={currentThemeColor?.key === theme.key ? styles['active-theme'] : styles['theme-item'] } style={{background: `${theme.value}`}}></li>)
            }
            <li><Button size='small' type="primary" onClick={switchColor}>??????</Button></li>
        </ul>
        <div className={styles['theme-preview']}>
            <img src={currentThemeColor?.preview}/>
        </div>
    </div>
  }

  const switchColor = async () => {
    const color = currentTheme
    const {code, message} = await changeThemeColor(curShopInfo.id, { color })
    if(code === 200){
        successMessage(message || '????????????')
    }
  }
  const switchTemlate = async () => {
    const templateId = NEW_TEMPLATE_ID
    const {code, message} = await changeTemplate(curShopInfo.id, {templateId })
    if(code === 200){
        successMessage(message || '????????????')
        location.reload()
    }else{
        successMessage(message || '????????????')
        setIsSwitchTemplate(false)
    }
    if(isGuideFirstClick){
        await setGuideFirstClick()
    }
  }

  const cancel = async () => {
    setIsSwitchTemplate(false)
    if(isGuideFirstClick){
        await setGuideFirstClick()
    }
  }
  return (
    <div className={styles['tab-container']}>
      <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal" className="a-menu">
        {menuListNow.filter(x => x.display).map(item => {
          return <Menu.Item key={item.key}>
            <Link to={item.link}>{item.label}</Link>
          </Menu.Item>
        })}
      </Menu>
      <div className={styles['tip']}>
        {curShopInfo && curShopInfo.type === ProductType.B2B && curShopInfo.templateId === NEW_TEMPLATE_ID ? <Popover content={themeColor} title="???????????????" trigger="click">
            <span className={styles['color-btn']}>????????????</span>
        </Popover> : curShopInfo && curShopInfo.type === ProductType.B2B && <span className={styles['color-btn']} onClick={() => setIsSwitchTemplate(true)}>????????????</span>}
        <Tooltip color='#fff' overlayStyle={{ maxWidth: 600 }} overlayInnerStyle={{ color: '#999', padding: '10px 20px' }} title={<img style={{ width: '500px' }} src="//file.baixing.net/202112/ad8e1bd75395e197bd2d3f32cf7f386f.png" />} placement='bottomLeft'>
            <QuestionCircleOutlined className={styles['icon']} />????????????
        </Tooltip>
      </div>
      <Modal width="50%" title="???????????????" visible={isSwitchTemplate} onOk={switchTemlate} onCancel={cancel} bodyStyle={{ padding: '0 24px' }}>
        {/* <p>?????????????????????????????????????????????????????????????????????????????????</p>
        <Alert message="???????????????????????????????????????????????????????????????????????????" type="warning" showIcon /> */}
        <div className={styles["container-modal"]}>
              <div className={styles["modal-left"]}>
                <p>?????????????????????????????????????????????????????????????????????????????????</p>
                <p style={{ color: '#F1492C', margin: '14px 0' }}>????????????????????????????????????????????????</p>
                <div className={styles["left-tip"]}>
                    <img className={styles['tip-home']} src="//file.baixing.net/202206/813c90ec42df1ca27613d0231b52958d.png" alt="logo" />
                    <p className={styles['tip-top']}>????????????????????????????????????????????????</p>
                    <ul>
                      <li>
                        <img className={styles['tip-icon']} src="//file.baixing.net/202206/424a5e2805b8196d076a7ba9d78622f6.png"></img>
                        ?????????????????????????????????
                      </li>
                      <li>
                        <img className={styles['tip-icon']} src="//file.baixing.net/202206/424a5e2805b8196d076a7ba9d78622f6.png"></img>
                        ????????????????????????????????????????????????????????????
                      </li>
                      <li>
                        <img className={styles['tip-icon']} src="//file.baixing.net/202206/424a5e2805b8196d076a7ba9d78622f6.png"></img>
                        ??????????????????????????????
                      </li>
                    </ul>
                </div>
              </div>
              <div className={styles["modal-right"]}>
              <p>??????????????????????????????????????????????????????????????????</p>
              <div className={styles['new-template']}>
                <img src={require('@/assets/images/template-default.png')}/>
              </div>
              </div>
        </div>
      </Modal>
    </div>
  );
}

const mapStateToProps = (state: any) => {
  const { curShopInfo, shopStatus } = (state as ConnectState)[SHOP_NAMESPACE]
  return { curShopInfo, shopStatus }
}


const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    ...shopMapDispatchToProps(dispatch)
  }
};

//?????????????????????????????????????????????????????????????????????????????????SEO??????
export default connect<any, any, Props>(
  mapStateToProps,
  mapDispatchToProps
)(BasisTab)
