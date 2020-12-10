import React, { useEffect, useState } from 'react';
import { Cascader } from 'antd';
import { getAreasApi } from '@/api/user';
import { CascaderOption } from '@/interfaces/base';
import { CascaderValueType } from 'antd/lib/cascader';

interface Props {
  initialValues: string[];
  onChange(values: string[]): void;
}
export default (props: any) => {
  const [areas, setAreas] = useState<CascaderOption[]>([]);
  const [selectValue, setSelectValue] = useState<string[]>([]);
  const { initialValues, onChange } = props

  const formatAreas = (data: any): any => {
    if (!data) return;
    return Object.keys(data).map((k: string) => {
      return { key: k, label: data[k], value: k, children: [], disabled: false }
    })
  }

  const formatValue = (data: string[] | any): string[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return Object.keys(data).map((k: string) => k)
  }

  const getAreasInfo = async (areaId: string) => {
      const res = await getAreasApi(areaId);
      if (res.success) {
          setAreas(formatAreas(res.data))
      }
  }

  useEffect(() => {
      getAreasInfo('m0')
  }, [])

  useEffect(() => {
    if (initialValues) {
      setSelectValue(formatValue(initialValues))
    }
  }, [initialValues])

  const onSelectChange = (list: any) => {
    onChange(list)
    setSelectValue(list)
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
          options={areas} value={selectValue}
          loadData={loadData} onChange={onSelectChange} changeOnSelect />)
}
