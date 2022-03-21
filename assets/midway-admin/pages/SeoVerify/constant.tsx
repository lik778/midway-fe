import * as React from 'react'

const STATUS_ENUM = Object.freeze({
    'DEFAULT': {text: '待审核', className: 'await'},
    'APPROVE': {text: '审核通过', className: 'pass'},
    'REJECT': {text: '审核驳回', className: 'reject'}
})
const columns = [
    {
        title: '用户id',
        dataIndex: 'userId',
        key: 'userId',
        render: (userId) => userId
    },
    {
        title: '店铺名称',
        dataIndex: 'shopName',
        key: 'shopName',
        render: (shopName) => shopName
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (createTime) => createTime
    },
    {
        title: '审核状态',
        dataIndex: 'status',
        key: 'status',
        render: (status) => <span className={STATUS_ENUM[status].className}>{STATUS_ENUM[status].text}</span>
    }
]
export { columns }