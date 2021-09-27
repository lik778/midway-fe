import React, { FC, Ref, useEffect, useMemo, useRef, useState } from 'react';
import { Form, Checkbox, Col, FormInstance, Spin } from 'antd';
import styles from './index.less';
import SelectBox from './components/select-box'
import { SelectConfig, SelectListItem } from './data'
import { CollectionCityListItem } from '@/interfaces/ai-module'
import { getCreateTitleCityList } from '@/api/ai-module'
import { mockData } from '@/utils';
import { Rule } from '../../data'

const FormItem = Form.Item;

interface Props {
  form: FormInstance
}

const FormArea: FC<Props> = (props) => {
  const { form } = props
  const [getDataLoading, setGetDataLoading] = useState<boolean>(false);
  const [city, setCity] = useState<string[]>([])
  const [cityList, setCityList] = useState<SelectListItem[]>([])
  const areaList = useMemo<SelectListItem[]>(() => {
    if (city.length !== 1) {
      return []
    } else {
      const cityId = city[0]
      const cityItem = cityList.find(item => item.value === cityId)
      return cityItem!.children!
    }
  }, [cityList, city])

  const [citySelectAll, setCitySelectAll] = useState<boolean>(false)
  const [areaSelectAll, setAreaSelectAll] = useState<boolean>(false)

  const selectRef = useRef<any>([])

  const formItemList: SelectConfig[] = [{
    key: 'city',
    label: '城市',
    tip: '请选择城市',
    rules: [
      {
        required: true,
        // message: `请输入核心词！(3-100个)`,
        validator: (rule: Rule, value: any) => {
          if (!value || value.length <= 0) {
            return Promise.reject(new Error(`城市数不得少于1个`));
          }
          return Promise.resolve()
        }
      }
    ]
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
    setGetDataLoading(true)
    // const res = await getCreateTitleCityList()
    const res = await mockData<{ cities: CollectionCityListItem[] }>('data', { "cities": [{ "name": "上海", "id": "m30", "areas": ["浦东新区", "闵行", "徐汇", "嘉定", "松江", "宝山", "普陀", "长宁", "黄浦", "青浦", "杨浦", "虹口", "静安", "闸北", "奉贤", "上海周边", "南汇", "金山", "卢湾", "崇明"] }, { "name": "天津", "id": "m31", "areas": ["南开", "河西", "塘沽", "河东", "西青", "东丽", "北辰", "和平", "河北", "武清", "红桥", "滨海新区", "津南", "静海", "大港", "宝坻", "蓟县", "宁河", "汉沽"] }, { "name": "重庆", "id": "m32", "areas": ["江北", "九龙坡", "沙坪坝", "渝北", "渝中", "南岸", "巴南", "大渡口", "北碚", "开州", "万州", "江津", "永川", "涪陵", "合川", "璧山", "长寿", "铜梁", "云阳", "南川", "万盛", "大足", "双桥", "石柱", "黔江", "荣昌", "綦江", "巫溪", "潼南", "城口", "奉节", "巫山", "丰都", "秀山", "彭水", "垫江", "梁平", "武隆", "忠县", "酉阳"] }] })
    const { cities } = res.data
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
    // 设置defaultChecked无效
    form.setFieldsValue({
      useCityWord: true
    })
  }, [])

  const handleChangeItemValue = (name: string, value: string[]) => {
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
    console.log(selectRef)
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
            item.key == 'city' && <>
              <Checkbox className={styles['checkall']} checked={citySelectAll} onChange={(e) => handleChangeCheckbox(e.target.checked, index)}>全选</Checkbox>
              <FormItem name='useCityWord' valuePropName="checked">
                <Checkbox>标题不含城市</Checkbox>
              </FormItem>
            </>
          }
        </Spin>
      </Col>)
    }
  </>
}

export default FormArea