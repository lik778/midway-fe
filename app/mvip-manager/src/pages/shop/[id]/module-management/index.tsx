import React, { FC, useEffect, useMemo, useState } from 'react'
import { useParams } from 'umi';
import BasisHeader from '@/pages/shop/[id]/components/basis-header'
import { ShopBasisType } from '@/enums'
import { PageType } from './data'
import SelectPage from './components/select-page'
import Menu from './components/menu'
import Content from './components/content'
import styles from './index.less'

const ModuleManagement = () => {
  const [page, setPage] = useState<PageType>('home')


  return <>
    <BasisHeader type={ShopBasisType.MODULE} />
    <div className={`${styles['module-management-container']} container`}>
      <div className={styles['module-management-content']}>
        <SelectPage handleChangePage={setPage} page={page}></SelectPage>
        <div className={styles['line']}>
          <div className={styles['menu']}>
            <Menu></Menu>
          </div>
          <div className={styles['content']}>
            <Content></Content>
          </div>
        </div>
      </div>
    </div>
  </>
}

export default ModuleManagement