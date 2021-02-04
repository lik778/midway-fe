import React, { useState, useEffect } from 'react';
import { Table, Form, Select, Statistic, Input, Button, Row, Col, Divider } from 'antd';

import { LineChart } from '@/components/charts';
import { getPVData } from '@/api/report';
import MainTitle from '@/components/main-title';
import './index.less';

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
];

// get ready to update to echarts@5
// https://github.com/hustcc/echarts-for-react/issues/388

export default function IndexPage() {
  const [form] = Form.useForm()
  const [formLoading, setFormLoading] = React.useState<boolean>(false)
  const [lineOptions, setLineOptions] = useState({})

  useEffect(() => {
    (async () => {
      setFormLoading(true)
      const { code, data } = await getPVData({ page: 1, size: 10 })
      if (code === 200) {
        const { result } = data
        setLineOptions(genChartOptions({
          title: '关键词报表',
          result
        }))
      }
      setFormLoading(false)
    })()
  },[])

  return (
    <div>
      <MainTitle title="关键词报表"/>
      <div className="page container">
        <Row className="statics-con" gutter={16}>
          <Col className="statics" span={7} style={{ marginBottom: 16 }}>
            <Statistic title="凤鸣投放币" value={16888}/>
          </Col>
          <Col className="statics" span={7}>
            <Statistic title="标王投放币" value={16888}/>
          </Col>
          <Col className="statics" span={7}>
            <Statistic title="精品官网个数" value={16888}/>
          </Col>
        </Row>
        <Row className="statics-con" gutter={16} style={{ marginBottom: 16 }}>
          <Col className="statics" span={7}>
            <Statistic title="凤鸣投放关键词数" value={6}/>
          </Col>
          <Col className="statics" span={7}>
            <Statistic title="标王投放关键词数" value={6}/>
          </Col>
          <Col className="statics" span={7}>
            <Statistic title="易慧推投放关键词数" value={120}/>
          </Col>
        </Row>
        <Row className="statics-con" gutter={16} style={{ marginBottom: 16 }}>
          <Col className="statics" span={7}>
            <Statistic title="凤鸣关键词平均排名" value={6}/>
          </Col>
          <Col className="statics" span={7}>
            <Statistic title="标王关键词平均排名" value={6}/>
          </Col>
        </Row>
        <Divider />
        <LineChart option={lineOptions} />
        <Divider />
        <h1>关键词排名明细数据：</h1>
        <Form form={form} layout="inline">
          <Form.Item
            name="搜索引擎"
            label="搜索引擎"
            rules={[{ required: true, message: '请选择搜索引擎！' }]}
          >
            <Select placeholder="请选择搜索引擎">
              <Select.Option value="baidu">百度</Select.Option>
              <Select.Option value="sougou">搜狗</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary">搜索</Button>
          </Form.Item>
        </Form>
        <Table dataSource={dataSource} columns={columns} />
      </div>
    </div>
  );
}

function genChartOptions(data: any) {
  const {title, result} = data
  return {
    title: {
      text: title
    },
    xAxis : {
      type: 'category',
      data: result.map((x: any) => x.date)
    },
    yAxis : {
      type : 'value'
    },
    series : [{
      data: result.map((x: any) => x.pv),
      type: 'bar',
    }]
  }
}
