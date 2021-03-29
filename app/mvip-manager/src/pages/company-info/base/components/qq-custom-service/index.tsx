import React, { useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { QQItem, UserEnterpriseInfo } from '@/interfaces/user';

const styles = {
  p: {  color: '#999', fontSize: 12, lineHeight: 1 },
  s: { fontWeight: 1, color: '#096DD9' },
  add: { width: 414, fontSize: 14, color: '#096DD9', marginBottom: 16 },
  formItem: { width: 200, display: 'inline-block' },
  delete: { color: '#096DD9', fontSize: 14, marginLeft: 15, cursor: 'pointer' }
}


export const QQCustomService = function (props: {
  onChange(list: QQItem[]): void,
  companyInfo: UserEnterpriseInfo,
}) {
  const { onChange, companyInfo } = props
  const [list, setList] = React.useState<QQItem[]>([]);

  useEffect(() => {
    if (companyInfo) {
      const { qqMap } = companyInfo
      const list = qqMap && Object.keys(qqMap).map(k => ({ qq: k, name: qqMap[k] })) || []
      setList(list)
    }
  }, [ companyInfo ])

  const addAction = function() {
    setList([...list, { name: '', qq: '' }]);
  }

  const deleteAction = function(i: number) {
    list.splice(i, 1)
    setList([...list]);
    onChange(list);
  }

  const onInputChange = (e: any, i: number, type: 'name' | 'qq') => {
    list[i][type] = e.target.value
    setList([...list]);
    onChange(list);
  }

  return (
    <div>
      <div>
        { list && list.length > 0 && list.map((item, i) => {
          return (
            <div key={i} style={{ width: 465, marginBottom: 16 }}>
              <Input maxLength={4} onChange={(e) => onInputChange(e, i, 'name')} value={item.name} style={{...styles.formItem, marginRight: 16}} placeholder="例客服张三"/>
              <Input maxLength={10} onChange={(e) => onInputChange(e, i, 'qq')} value={item.qq} style={styles.formItem} placeholder="请输入qq号" />
              <span style={styles.delete} onClick={() => deleteAction(i)}>删除</span>
            </div>
          )
        }) }
        <Button disabled={list && list.length >= 3}  onClick={() => addAction()} style={styles.add} type="dashed" size="large" icon={<PlusOutlined />} block>添加客服</Button>
        <p style={styles.p}>（最多添加3个）</p>
      </div>
      <div>
        <p style={styles.p}>1.QQ客服需到<a href="https://shang.qq.com/v3/index.html" target="_blank" style={styles.s}>
          “QQ推广”</a>登录开通后即可a使用，并到悬浮框组件中将“QQ交谈开关启用”；</p>
        <p style={styles.p}>2.显示名称只能是中英文字母、汉字、数字和下划线，不得超过10个字符；</p>
        <p style={styles.p}>3.部分手机浏览器可能不支持该功能。</p>
      </div>
  </div>)
}
