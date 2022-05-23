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
      label: "页头设置",
      key: ShopBasisType.NAV,
      display: true,
    },
    {
      link: `/shop/${params.id}/${ShopBasisType.SEO}/${ShopTDKType.INDEX}`,
      label: "SEO设置",
      key: ShopBasisType.SEO,
      display: true,
    },
    {
      link: `/shop/${params.id}/${ShopBasisType.CONSULTATION}`,
      label: "留咨设置",
      key: ShopBasisType.CONSULTATION,
      display: true,
    },
    {
      // tip: 基础资料设置只有游龙工单申请过，加入白名单的用户才能使用
      link: `/shop/${params.id}/${ShopBasisType.INFO}`,
      label: "基础资料设置",
      key: ShopBasisType.INFO,
      display: false,
    },
    {
      link: `/shop/${params.id}/${ShopBasisType.MODULE}`,
      label: "模块管理",
      key: ShopBasisType.MODULE,
      display: true,
    }
  ]

  //只有B2B的店铺，才会有SEO设置
  // 只有shopStatus.hasMultiShopRights 为true 才会有基础设置
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
            // 如果该用户不是白名单用户 还出现在info页面 则跳到首页
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
            <li><Button size='small' type="primary" onClick={switchColor}>确认</Button></li>
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
        successMessage(message || '操作成功')
    }
  }
  const switchTemlate = async () => {
    const templateId = NEW_TEMPLATE_ID
    const {code, message} = await changeTemplate(curShopInfo.id, {templateId })
    if(code === 200){
        successMessage(message || '操作成功')
        location.reload()
    }else{
        successMessage(message || '操作失败')
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
        {curShopInfo && curShopInfo.type === ProductType.B2B && curShopInfo.templateId === NEW_TEMPLATE_ID ? <Popover content={themeColor} title="更换主题色" trigger="click">
            <span className={styles['color-btn']}>主题颜色</span>
        </Popover> : curShopInfo && curShopInfo.type === ProductType.B2B && <span className={styles['color-btn']} onClick={() => setIsSwitchTemplate(true)}>更换模板</span>}
        <Tooltip color='#fff' overlayStyle={{ maxWidth: 600 }} overlayInnerStyle={{ color: '#999', padding: '10px 20px' }} title={<img style={{ width: '500px' }} src="//file.baixing.net/202112/ad8e1bd75395e197bd2d3f32cf7f386f.png" />} placement='bottomLeft'>
            <QuestionCircleOutlined className={styles['icon']} />使用指引
        </Tooltip>
      </div>
      <Modal width="50%" title="更换新模板" visible={isSwitchTemplate} onOk={switchTemlate} onCancel={cancel}>
        <p>点击“更换”，当前店铺的全部内容会同步到店铺新模板中。</p>
        <Alert message="更换至新模板后，将不可恢复，新模板样式如下图所示：" type="warning" showIcon />
        <div className={styles['new-template']}>
            <img src={require('@/assets/images/template-default.png')}/>
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

//取状态管理里的当前店铺信息，用于判断店铺类型，是否显示SEO设置
export default connect<any, any, Props>(
  mapStateToProps,
  mapDispatchToProps
)(BasisTab)
