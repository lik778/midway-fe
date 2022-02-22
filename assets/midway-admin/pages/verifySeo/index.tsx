import { Button, Popconfirm, Space, Spin, Table } from 'antd';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { getSeoListApi, seoCheckAudit } from '../../api/verify'
import { ListRes } from '../../interfaces/api';
import { columns } from './constant';
import { checkListItem, SEO_STATUS } from '../../interfaces/verify';
import './index.styl';

interface propsType {
    type?: number
}
const SIZE = 30
const VerifySeo: React.FC<propsType> = () => {
    const [seoCheckList, setSeoCheckList] = useState<ListRes<checkListItem[]>>()
    const [page, setPage] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    useEffect(() => {
       getSeoCheckList(page)
    }, [])
    const getSeoCheckList = async (page) => {
        const { data } = await getSeoListApi({page, size: SIZE})
        setSeoCheckList(data)
    }

    const actionClumns = [
        {
            title: '操做',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: checkListItem) => 
            <Space>
                <Popconfirm title="确定通过审核吗？"
                onConfirm={() => auditPass(record)}>
                    <Button disabled={record.status && record.status !== SEO_STATUS.DEFAULT} type="primary">审核通过</Button>
                </Popconfirm>
                <Button disabled={record.status && record.status !== SEO_STATUS.DEFAULT} type="primary">审核拒绝</Button>
            </Space>
        }
    ]

    const auditPass = async (record: checkListItem) => {
        setLoading(true)
        try {
            await seoCheckAudit({ id: record.id, status: SEO_STATUS.APPROVE, memo: '' })
        } catch (error) {
            
        } finally {
            setLoading(false)
        }
    }
    return <>
        <Table columns={[...columns, ...actionClumns]} dataSource={seoCheckList && seoCheckList?.result}/>
        {loading && <Spin tip="加载中..."/>}
    </>
}
export default VerifySeo