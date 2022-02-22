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
        render: (status) => status
    }
]
export { columns }