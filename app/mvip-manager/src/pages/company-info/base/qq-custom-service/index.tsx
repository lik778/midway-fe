import React from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';

const styles = {
  p: {  color: '#999', fontSize: 12, lineHeight: 1 },
  s: { fontWeight: 1, color: '#096DD9' },
  add: { width: 414, fontSize: 14, color: '#096DD9', marginBottom: 16 },
  formItem: { width: 200, display: 'inline-block' },
  delete: { color: '#096DD9', fontSize: 14, marginLeft: 15 }
}

export const QQCustomService = (props: any) => {
  const [list, setList] = React.useState([1]);

  const add = function() {
    list.push(1);
    console.log(list)
    setList([...list]);
  }

  return (
    <div>
      <div>
        { list.map((item, i) => {
          return (
            <div key={i} style={{ width: 465, marginBottom: 16 }}>
              <Input style={{...styles.formItem, marginRight: 16}} placeholder="例客服张三"/>
              <Input style={styles.formItem} placeholder="请输入qq号"/>
              <span style={styles.delete}>删除</span>
            </div>
          )
        }) }
        <Button disabled={list.length === 3}  onClick={add} style={styles.add} type="dashed" size="large" icon={<PlusOutlined />} block>添加客服</Button>
        <p style={styles.p}>（最多添加3个）</p>
      </div>
      <div>
        <p style={styles.p}>1.QQ客服需到<strong style={styles.s}>“QQ推广”</strong>登录开通后即可使用，并到悬浮框组件中将“QQ交谈开关启用”；</p>
        <p style={styles.p}>2.显示名称只能是中英文字母、汉字、数字和下划线，不得超过10个字符；</p>
        <p style={styles.p}>3.部分手机浏览器可能不支持该功能。</p>
      </div>
  </div>)
}
