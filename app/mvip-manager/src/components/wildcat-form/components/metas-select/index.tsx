import React, { useState, useEffect, FC } from 'react';
import { Form, Cascader, } from 'antd'
import { CascaderOptionType } from 'antd/lib/cascader'

import { FormItem, OptionItem, } from '../../interfaces/index'

// 三级类目选择
const MetasSelect: FC<{
  item: FormItem
}> = (props) => {
  const { item } = props
  const { options } = item // 解构出一级meta的数据结构
  const [CascaderOptions, setCascaderOptions] = useState<CascaderOptionType[]>([])

  useEffect(() => {
    setCascaderOptions(() => (options || []).map(item => ({
      ...item,
      label: item.key,
      isLeaf: false
    })))
  }, [options])

  const handleChangeFirstMates = (selectedOptions?: CascaderOptionType[]) => {
    console.log(selectedOptions)
  }

  return <>
    <Form.Item className={item.className} label='类目' name='secondCategories' key='类目' rules={[{ required: item.required }]} labelCol={item.labelCol}>
      <Cascader style={{ width: item.formItemWidth }} options={CascaderOptions} loadData={handleChangeFirstMates}></Cascader>
    </Form.Item>
    {/* <Form.Item className={item.className} label='服务内容' name='thirdMetas' key='服务内容' rules={[{ required: item.required }]} labelCol={item.labelCol}>
      <div>123</div>
    </Form.Item> */}
  </>

}

export default MetasSelect


// const optionLists = [
//   {
//     value: 'zhejiang',
//     label: 'Zhejiang',
//     isLeaf: false,
//   },
//   {
//     value: 'jiangsu',
//     label: 'Jiangsu',
//     isLeaf: false,
//   },
// ];

// const LazyOptions = () => {
//   const [options, setOptions] = React.useState(optionLists);

//   const onChange = (value, selectedOptions) => {
//     console.log(value, selectedOptions);
//   };

//   const loadData = selectedOptions => {
//     const targetOption = selectedOptions[selectedOptions.length - 1];
//     targetOption.loading = true;

//     // load options lazily
//     setTimeout(() => {
//       targetOption.loading = false;
//       targetOption.children = [
//         {
//           label: `${targetOption.label} Dynamic 1`,
//           value: 'dynamic1',
//         },
//         {
//           label: `${targetOption.label} Dynamic 2`,
//           value: 'dynamic2',
//         },
//       ];
//       setOptions([...options]);
//     }, 1000);
//   };

//   return <Cascader options={options} loadData={loadData} onChange={onChange} changeOnSelect />;
// };