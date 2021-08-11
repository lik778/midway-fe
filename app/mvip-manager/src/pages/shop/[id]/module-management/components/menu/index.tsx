import React, { FC, useState, useEffect } from 'react';
import { useMemo } from 'react';
import { Popover } from 'antd'
import { ModulePageType, ModuleComponentId } from '@/interfaces/shop'
import { MenuItemOption } from '../../data'
import styles from './index.less'
import { ExclamationCircleFilled } from '@ant-design/icons'
interface Props {
  position: ModulePageType,
  pageModule: ModuleComponentId
  menuOptions: {
    [key in ModulePageType]: MenuItemOption[]
  }
  handleChangeComponent: (pageModule: ModuleComponentId) => void
}

const Menu: FC<Props> = (props) => {
  const { position, pageModule, menuOptions, handleChangeComponent } = props

  const menuList = useMemo(() => menuOptions[position] || [], [position, menuOptions])

  return <div className={styles['menu-container']}>
    {
      menuList.map(item => {
        return <div className={`${styles['item']} ${pageModule === item.id ? styles['active'] : ''}`} key={item.id} onClick={() => handleChangeComponent(item.id)}>
          <span className={styles['name']}> {item.name}</span>
        </div>
      })
    }
  </div>
}

export default Menu