import React, { useEffect, useState } from "react"
import { Breadcrumb, Button, Radio } from "antd"

import styles from "./index.less"

export default (props: {
  sourceType: 'IMAGE' | 'VIDEO'
  refresh: (resetPagi: boolean) => void
  setSourceType: (type: 'IMAGE'|'VIDEO') => void
}) => {

  const { sourceType, setSourceType, refresh } = props

  const handleNav = (e: any) => {
    const value = e.target.value
    setSourceType(value)
    refresh(true)
  }

  return (
    <>
      <div className={styles["nav-container"]}>
        {/* left actions */}
        {(
          <Breadcrumb>
            <Breadcrumb.Item>
              <Radio.Group value={sourceType} onChange={handleNav}>
                <Radio.Button value="IMAGE">图片</Radio.Button>
                <Radio.Button value="VIDEO">视频</Radio.Button>
              </Radio.Group>
            </Breadcrumb.Item>
          </Breadcrumb>
        )}
        {/* right actions */}
        <div></div>
      </div>
    </>
  )
}
