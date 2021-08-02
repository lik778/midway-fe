import React, { FC, useState, useEffect } from 'react';
import { useMemo } from 'react';
import { Popover } from 'antd'
import { PageType, ComponentId } from '../../data'
import { MenuItemConfig } from '../../data'
import styles from './index.less'
import { ExclamationCircleFilled } from '@ant-design/icons'
interface Props {
  page: PageType,
  componentId: ComponentId
  menuConfig: {
    [key: string]: MenuItemConfig[]
  }
  handleChangeComponent: (componentId: ComponentId) => void
}

const Menu: FC<Props> = (props) => {
  const { page, componentId, menuConfig, handleChangeComponent } = props

  const menuList = useMemo(() => menuConfig[page || 'home'], [page])

  const handleClickPosition = (thumbnail: string) => {
    window.open(thumbnail, '_block')
  }

  return <div className={styles['menu-container']}>
    {
      menuList.map(item => {
        return <div className={`${styles['item']} ${componentId === item.id ? styles['active'] : ''}`} key={item.id} onClick={() => handleChangeComponent(item.id)}>
          <span className={styles['name']}> {item.name}</span>
          <Popover placement="right" title='所处位置' content={
            <img className={styles['thumbnail']} src={item.thumbnail}></img>
          } trigger="hover">
            <ExclamationCircleFilled className={styles['info-icon']} onClick={() => handleClickPosition(item.thumbnail)}></ExclamationCircleFilled>
          </Popover>
        </div>
      })
    }
  </div>
}

export default Menu