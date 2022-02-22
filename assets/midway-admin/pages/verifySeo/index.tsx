import { Pagination, Table } from 'antd';
import * as React from 'react';
import { useEffect } from 'react';
import { getSeoListApi } from '../../api/verify'
import { columns } from './constant';
import { useState } from 'react';
import { SeoCheckList } from 'assets/midway-admin/interfaces/verify';

interface propsType {
    type?: number
}
const SIZE = 30
const VerifySeo: React.FC<propsType> = (props: propsType) => {
    const [seoCheckList, setSeoCheckList] = useState<SeoCheckList>()
    const [page, setPage] = useState<number>(1)
    useEffect(() => {
       getSeoCheckList(page)
    }, [])
    const getSeoCheckList = async (page) => {
        const { data } = await getSeoListApi({page, size: SIZE})
        setSeoCheckList(data)
    }
    return <>
        <Table columns={columns} dataSource={seoCheckList && seoCheckList?.result}/>
        <Pagination defaultCurrent={1} pageSize={SIZE} total={seoCheckList && seoCheckList.totalRecord} />
    </>
}
export default VerifySeo