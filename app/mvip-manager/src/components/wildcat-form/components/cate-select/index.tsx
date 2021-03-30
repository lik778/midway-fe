import React, { useState, useEffect } from 'react';
import {Form, Select} from 'antd';
import { addKeyForListData, formatTime, mockData } from '@/utils';

const FormItem = Form.Item;
const Option = Select.Option;

interface Props {
    initialValues: string[];
    //value: string;
    onChange(values: string[]): void;
}

export default (props: any) => {
    const [cate, setCate] = useState<[]>([]);
    const { initialValues, onChange } = props
    const [selectKeys, setSelectKeys] = useState<string[]>([]);
    const [selectValues, setSelectValues] = useState<string[]>([]);

    useEffect(()=>{
        if (initialValues) {
            //console.log(Object.keys(initialValues).map((k:string) => initialValues[k]))
            setSelectKeys(Object.keys(initialValues))
            setSelectValues(Object.values(initialValues))
        }
    }, [ initialValues])


    return (
        <Select
            size='large'
            //选择值后打接口，生成meta
            onChange = { onChange }
        >
            {
                initialValues === null ?
                <Option disabled key='disabled' value="none">未找到</Option>:
                selectKeys.map(k => <Option key={k}>{initialValues[k]}</Option> )
            }
        </Select>
    )

}
