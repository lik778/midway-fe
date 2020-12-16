import React, { useEffect, useState } from 'react';
import { Cascader } from 'antd';
import { getAreasApi } from '@/api/user';
import { CascaderOption } from '@/interfaces/base';

interface Props {
  initialValues: string[];
  onChange(values: string[]): void;
}
export default (props: any) => {
  const [areas, setAreas] = useState<CascaderOption[]>([]);
  const [selectValue, setSelectValue] = useState<string[]>([]);
  const { initialValues, onChange } = props

  const formatAreas = (data: any, isLeaf: boolean, level: number): any => {
    if (!data) return;
    return Object.keys(data).map((k: string) => {
      return { key: k, label: data[k], value: k, disabled: false, isLeaf, level }
    })
  }

  // const formatValue = (data: string[] | any): string[] => {
  //   if (!data) return [];
  //   if (Array.isArray(data)) return data;
  //   return Object.keys(data).map((k: string) => k)
  // }

  const getAreasInfo = async (areaId: string) => {
      const res = await getAreasApi(areaId);
      if (res?.success) {
          setAreas(formatAreas(res.data, false, 1))
      }
  }

  useEffect(() => {
    getAreasInfo('m0')
  }, [])

  useEffect(() => {
    if (initialValues) {
      setSelectValue(Object.keys(initialValues).map((k: string) => initialValues[k]))
    }
  }, [initialValues])

  const onSelectChange = (list: any, selectedOptions: any) => {
    const map: any = {}
    selectedOptions.forEach((s: any) => map[s.value] = s.label)
    onChange(map)
    setSelectValue(list)
  }

  const loadData = async (selectedOptions: any) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    const res = await getAreasApi(targetOption.value);
    targetOption.loading = false;
    let level = targetOption.level;
    level += 1;
    targetOption.children = formatAreas(res.data, level === 3, level);
    setAreas([...areas])
  };

  return (<Cascader size='large' options={areas} value={selectValue}
          loadData={loadData} onChange={onSelectChange} changeOnSelect />)
}
