import React, { useEffect, useState } from "react"
import { Breadcrumb } from "antd"

import { PageNavProps } from '../../cards-page/index'

import styles from "./index.less"

export default (props: PageNavProps) => {
  return (
    <>
      <div className={styles["nav-container"]}>
        {/* left actions */}
        {(
          <Breadcrumb>
            <Breadcrumb.Item>
              <a>视频管理</a>
            </Breadcrumb.Item>
          </Breadcrumb>
        )}
        {/* right actions */}
        <div></div>
      </div>
    </>
  )
}
