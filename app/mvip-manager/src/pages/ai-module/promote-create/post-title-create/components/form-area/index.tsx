import React, { FC, Ref, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Form, Checkbox, Col, FormInstance, Spin } from 'antd';
import styles from './index.less';
import SelectBox from './components/select-box'
import { SelectListItem, SelectConfig } from '../../data'
import { CollectionCityListItem } from '@/interfaces/ai-module'
import { getCreateTitleCityList } from '@/api/ai-module'
import { mockData } from '@/utils';
import { Rule } from '../../data'
import AiModuleContext from '../../../context'

const FormItem = Form.Item;

interface Props {
  form: FormInstance
}

const FormArea: FC<Props> = (props) => {
  const { form } = props
  const { postToolData } = useContext(AiModuleContext)
  const { selectedVipResources } = postToolData
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false);
  const [city, setCity] = useState<SelectListItem[]>([])
  const [cityList, setCityList] = useState<SelectListItem[]>([])
  const areaList = useMemo<SelectListItem[]>(() => {
    if (city.length !== 1) {
      return []
    } else {
      return cityList.find(item => item.value === city[0].value)?.children!
    }
  }, [cityList, city])

  const [citySelectAll, setCitySelectAll] = useState<boolean>(false)
  const [areaSelectAll, setAreaSelectAll] = useState<boolean>(false)
  const [notCityWord, setNotCityWord] = useState<boolean>(false)
  const selectRef = useRef<any>([])

  const validateCityRules = useMemo(() => [
    {
      required: !notCityWord,
      // message: `请输入核心词！(3-100个)`,
      validator: (rule: Rule, value: any) => {
        // 不需要城市在标题时，
        if (!notCityWord) {
          if (!value || value.length <= 0) {
            return Promise.reject(new Error(`城市数不得少于1个`));
          }
        }
        return Promise.resolve()
      }
    }
  ], [notCityWord])

  const formItemList: SelectConfig[] = [{
    key: 'city',
    label: '城市',
    tip: '请选择城市',
    rules: validateCityRules
  }, {
    key: 'area',
    label: '行政区',
    tip: '请选择行政区',
    rules: [
      {
        required: false,
      }
    ]
  }]

  const getCreateTitleCityListFc = async () => {
    if (!selectedVipResources) return
    setGetDataLoading(true)
    const res = await getCreateTitleCityList({ productLine: selectedVipResources.productLine, vipType: selectedVipResources.vipType })
    const cities = res.data
    const newCityList: SelectListItem[] = cities.map(item => {
      return {
        value: item.id,
        label: item.name,
        children: item.areas.map(cItem => ({
          value: cItem,
          label: cItem
        }))
      }
    })
    setCityList(newCityList)
    setGetDataLoading(false)
  }

  useEffect(() => {
    getCreateTitleCityListFc()
  }, [selectedVipResources])

  const handleChangeItemValue = (name: string, value: SelectListItem[]) => {
    if (name === 'city') {
      setCity(value)
      setCitySelectAll(value.length === cityList.length)
    } else {
      setAreaSelectAll(value.length === areaList.length)
    }
  }

  const handleChangeCheckbox = (checked: boolean, index: number) => {
    if (index === 0) {
      setCitySelectAll(checked)
    } else {
      setAreaSelectAll(checked)
    }
    selectRef.current[index]?.onCheckAllChange(checked)
  }

  return <>
    {
      formItemList.map((item, index) => <Col className={styles["group-words-item"]} flex="20%" key={item.key}>
        <div className={styles['form-item-header']} >
          {item.label}：
      </div>
        <Spin spinning={getDataLoading}>
          <FormItem name={item.key} rules={item.rules}>
            <SelectBox ref={(ref: Ref<any>) => selectRef.current[index] = ref} name={item.key} selectAll={item.key === 'city' ? citySelectAll : areaSelectAll} selectList={item.key === 'city' ? cityList : areaList} onValueChange={handleChangeItemValue}></SelectBox>
          </FormItem>
          {
            item.key == 'city' && <div className={styles['checkbox-group']}>
              <Checkbox className={styles['checkbox']} checked={citySelectAll} onChange={(e) => handleChangeCheckbox(e.target.checked, index)}>全选</Checkbox>
              <FormItem name='notCityWord' valuePropName="checked">
                <Checkbox className={styles['checkbox']} onChange={(e) => setNotCityWord(e.target.checked)}>标题不含城市</Checkbox>
              </FormItem>
            </div>
          }
        </Spin>
      </Col>)
    }
  </>
}

export default FormArea