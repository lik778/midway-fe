import React, { useEffect, useState } from 'react';
import { Cascader } from 'antd';
import { getAreasApi } from '@/api/user';
import { CascaderOption } from '@/interfaces/base';
import { CascaderValueType } from 'antd/lib/cascader';

interface Props {
  selectValue: string[];
  onChange(values: string[]): void;
}
export default (props: any) => {
  const [areas, setAreas] = useState<CascaderOption[]>([]);
  const { selectValue, onChange } = props

  const formatAreas = (data: any): any => {
    if (!data) return;
    return Object.keys(data).map((k: string) => {
      return { key: k, label: data[k], value: k, children: [], disabled: false }
    })
  }

  const getAreasInfo = async (areaId: string) => {
      const res = await getAreasApi(areaId);
      if (res.success) {
        if (areas.length === 0) {
          setAreas(formatAreas(res.data))
        } else {
          console.log('重新赋值')
        }
      }
  }

  useEffect(() => {
      getAreasInfo('m0')
  }, [])

  const onSelectChange = (list: CascaderValueType) => {
    onChange(list)
  }

  const loadData = (selectedOptions: any) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    setTimeout(() => {
      targetOption.loading = false;
      targetOption.children = [];
      setAreas([...areas]);
    }, 1000);
  };

  return (<Cascader size='large'
          options={areas} defaultValue={selectValue}
          loadData={loadData} onChange={onSelectChange} changeOnSelect />)
}
