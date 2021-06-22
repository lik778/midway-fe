import React, { useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { QQItem, UserEnterpriseInfo } from '@/interfaces/user';
import styles from './index.less'


export const QQCustomService = function (props: {
  onChange(list: QQItem[]): void,
  companyInfo: UserEnterpriseInfo,
}) {
  const { onChange, companyInfo } = props
  const [list, setList] = React.useState<QQItem[]>([]);

  useEffect(() => {
    if (companyInfo) {
      const { qqMap } = companyInfo
      setList([...qqMap])
      onChange([...qqMap])
    }
  }, [companyInfo])

  const addAction = function () {
    setList([...list, { name: '', content: '' }]);
  }

  const deleteAction = function (i: number) {
    list.splice(i, 1)
    setList([...list]);
    onChange(list);
  }

  const onInputChange = (e: any, i: number, type: 'name' | 'content') => {
    const newList = list.map((item, index) => {
      if (i !== index) {
        return item
      } else {
        return {
          ...item,
          [type]: e.target.value
        }
      }
    })
    setList(newList);
    onChange(newList);
  }

  return (
    <div className={styles['QQ-container']}>
      { list && list.length > 0 && list.map((item, i) => {
        return (
          <div key={i} style={{ width: 475, marginBottom: 16 }}>
            <Input maxLength={4} onChange={(e) => onInputChange(e, i, 'name')} value={item.name} className={styles['formItem']} placeholder="例客服张三" />
            <Input maxLength={10} onChange={(e) => onInputChange(e, i, 'content')} value={item.content} className={styles['formItem']} placeholder="请输入qq号" />
            <span className={styles['delete']} onClick={() => deleteAction(i)}>删除</span>
          </div>
        )
      })}
      <Button disabled={list && list.length >= 3} onClick={() => addAction()} className={styles['add']} type="dashed" size="large" icon={<PlusOutlined />} block>添加客服</Button>
      <p className={styles['p']}>（最多添加3个）</p>
      <p className={styles['p']}>1.QQ客服需到<a href="https://shang.qq.com/v3/index.html" target="_blank" className={styles['s']}>
        “QQ推广”</a>登录开通后即可a使用，并到悬浮框组件中将“QQ交谈开关启用”；</p>
      <p className={styles['p']}>2.显示名称只能是中英文字母、汉字、数字和下划线，不得超过10个字符；</p>
      <p className={styles['p']}>3.部分手机浏览器可能不支持该功能。</p>
    </div>)
}
