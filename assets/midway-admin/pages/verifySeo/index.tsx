import { Button, Popconfirm, Space, Spin, Table, Input, Modal, message } from 'antd';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { getSeoListApi, seoCheckAudit } from '../../api/verify'
import { ListRes } from '../../interfaces/api';
import { columns } from './constant';
import { checkListItem, SEO_STATUS } from '../../interfaces/verify';
import './index.styl';
const { TextArea } = Input;


interface propsType {
    type?: number
}
const SIZE = 30
const VerifySeo: React.FC<propsType> = () => {
    const [seoCheckList, setSeoCheckList] = useState<ListRes<checkListItem[]>>()
    const [page, setPage] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [currentRecord, setCurrentRecord] = useState<checkListItem>()
    const [memo, setMemo] = useState<string>()
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
                <Button onClick={() => { setIsModalVisible(true), setCurrentRecord(record)}} disabled={record.status && record.status !== SEO_STATUS.DEFAULT} type="primary">审核拒绝</Button>
            </Space>
        }
    ]

    const auditPass = async (record: checkListItem) => {
        setLoading(true)
        try {
            await seoCheckAudit({ id: record.id, status: SEO_STATUS.APPROVE, memo: '' })
            await getSeoCheckList(page)
            message.success('审核已通过！')
        } catch (error) {
            
        } finally {
            setLoading(false)
        }
    }
    const auditReject = async () => {
        if(!memo){
            message.error('请填写拒绝原因！')
            return
        }
        setLoading(true)
        try {
            await seoCheckAudit({ id: currentRecord.id, status: SEO_STATUS.REJECT, memo })
            await getSeoCheckList(page)
            message.success('审核已拒绝！')
        } catch (error) {
            
        } finally {
            setLoading(false)
            setIsModalVisible(false)
        }
    }
    return <>
        <Table columns={[...columns, ...actionClumns]} dataSource={seoCheckList && seoCheckList?.result}/>
        {loading && <Spin tip="加载中..."/>}
        <Modal title="审核拒绝" visible={isModalVisible} onOk={auditReject} onCancel={() => setIsModalVisible(false)}>
            <TextArea onChange={(e) => setMemo(e.target.value)} rows={4} placeholder="请填写拒绝原因" maxLength={6} />
        </Modal>
    </>
}
export default VerifySeo