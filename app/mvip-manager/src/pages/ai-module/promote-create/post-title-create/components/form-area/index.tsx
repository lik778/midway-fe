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
  const { selectedVipResources } = useContext(AiModuleContext)
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

  const validateCityRules = useMemo(() => {
    console.log(notCityWord)
    return [
      {
        required: !notCityWord,
        // message: `请输入核心词！(3-100个)`,
        validator: (rule: Rule, value: any) => {
          // 不需要城市在标题时，
          console.log(notCityWord)
          if (!notCityWord) {
            if (!value || value.length <= 0) {
              return Promise.reject(new Error(`城市数不得少于1个`));
            }
          }
          return Promise.resolve()
        }
      }
    ]
  }, [notCityWord])

  const formItemList: SelectConfig[] = useMemo(() => {
    return [{
      key: 'city',
      label: '城市',
      tip: '请选择城市',
      rules: validateCityRules,
      selectAll: citySelectAll,
      selectList: cityList,
    }, {
      key: 'area',
      label: '行政区',
      tip: '请选择行政区',
      rules: [
        {
          required: false,
        }
      ],
      selectAll: areaSelectAll,
      selectList: areaList,
    }]
  }, [citySelectAll, areaSelectAll, cityList, areaList, validateCityRules])

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
      setCitySelectAll(cityList.length > 0 && value.length === cityList.length)
    } else {
      setAreaSelectAll(areaList.length > 0 && value.length === areaList.length)
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

  const handleChangeNotCityWord = (checked: boolean) => {
    setNotCityWord(checked)
    form.validateFields(['city'])
  }

  return <>
    {
      formItemList.map((item, index) => <Col className={styles["group-words-item"]} flex="20%" key={item.key}>
        <div className={styles['form-item-header']} >
          {item.label}：
      </div>
        <Spin spinning={getDataLoading}>
          <FormItem name={item.key} rules={item.rules}>
            <SelectBox ref={(ref: Ref<any>) => selectRef.current[index] = ref} name={item.key} selectAll={item.selectAll} selectList={item.selectList} onValueChange={handleChangeItemValue}></SelectBox>
          </FormItem>
          <div className={styles['checkbox-group']}>
            <Checkbox className={styles['checkbox']} checked={item.selectAll} onChange={(e) => handleChangeCheckbox(e.target.checked, index)}>全选</Checkbox>
            {
              item.key === 'city' && <FormItem name='notCityWord' valuePropName="checked">
                <Checkbox className={styles['checkbox']} onChange={(e) => handleChangeNotCityWord(e.target.checked)}>标题不含城市</Checkbox>
              </FormItem>
            }
          </div>
        </Spin>
      </Col>)
    }
  </>
}

export default FormArea