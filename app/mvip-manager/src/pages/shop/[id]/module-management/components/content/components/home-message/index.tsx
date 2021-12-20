import React, { FC, useState, useEffect } from 'react'
import { Button, Select, Row, Col, Spin } from 'antd';
import { useParams } from 'umi'
import { successMessage } from '@/components/message';
// 首页-留咨模块接口
import { SetMessageModule } from '@/api/shop'
import { useDebounce } from '@/hooks/debounce';
import styles from './index.less'
import { options } from './config'

const { Option } = Select;
const HomeMessage: FC = () => {
  const [formLoading, setFormLoading] = useState<boolean>(false)
  const [selectItem, setSelectItem] = useState<string>('')
  const { id: shopId } = useParams<{ id: string }>()
  useEffect(() => {
    // 发请求获取数据
  }, [])
  const handleChange = (item: string) => {
    setSelectItem(item)
  }
  const handleSubmit = useDebounce(() => {
    setFormLoading(true)
    // 打接口
    successMessage('保存成功')
    setFormLoading(false)
  }, 300)
  return <Spin spinning={formLoading}>
    <div className={styles['home-message']}>
      <div className={styles['module-select']}>
        <p> <span className={styles['tip-i']}>*</span>&nbsp;行业模板：</p>
        <Select onChange={handleChange} style={{ width: 200 }}>
          {
            options.map(item => {
              return (
                <Option value={item.key}>{item.value}</Option>
              )
            })
          }
        </Select>
      </div>
      <div className={styles['img-module']}>
        <p className={styles['img-title']}><span className={styles['tip-i']}>*</span>&nbsp;整体样式查看：</p>
        <img src='' alt="logo" />
      </div>
      <div className={styles['save-btn']}>
        <Row>
          <Col span={4}>
            <Button type="primary" size="large" className={styles['btn']} onClick={handleSubmit}> 保存</Button>
          </Col>
        </Row>
      </div>
    </div>
  </Spin>
}
export default HomeMessage