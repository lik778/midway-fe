
import React, { useState, useEffect } from 'react';
import { Table, Checkbox, Button, message } from 'antd';
import InputLen from "@/components/input-len"
import Loading from "@/components/loading"
import './index.less';
import { getNavListingApi, updateNavApi }  from '@/api/shop';
import { RouteParams } from '@/interfaces/shop';
import { useParams } from "umi";
import { NavItem, ModifyNavItem } from '@/interfaces/shop';

export default (props: any) => {
  const [navList, setNavList] = useState<NavItem[]>([]);
  const [modifyList, setModifyList] = useState<ModifyNavItem[]>([]);
  // isLoaded
  const [isLoading, setIsLoading] = useState(true)
  // 获取店铺id
  const params: RouteParams = useParams();
  // 店铺列表
  const columns = [
    {
      title: '名称',
      key: 'name',
      render: (node: NavItem) => {
        const name = node.id.toString()
        return(
          <InputLen value={node.name} onChange={handleInputChange} name={name} maxLength={node.maxLength}/>
        )
      }
    },
    {
      title: '页面介绍',
      dataIndex: 'desc',
      key: 'description',
    },
    {
      title: '是否显示',
      key: 'action',
      render: (node: NavItem) => 
       {
        const checked = node?.display? true : false
        const isDisabled = node?.isDisabled || false
        const name = node.id.toString()
        return (
          <Checkbox onChange={handleCheckboxChange} checked={checked} disabled={isDisabled}
          name={name}></Checkbox>
        )
      }
    },
  ];

  const handleCheckboxChange = (e: any) => {
    const target = e.target
    const name = parseInt(target.name) // 这个id以数字来回切换也是够。
    const checked = target.checked
    const navCloneList = navList.concat()
    const modifyCloneList = modifyList.concat()
    const value = checked ? 1: 0
    navCloneList.map(n=>{
      if(n.id === name) {
        n.display = value
      }
    })

    modifyCloneList.map(m=>{
      if(m.id === name) {
        m.display = value
      }
    })
    setNavList(navCloneList)
    setModifyList(modifyCloneList)
  }

  const handleInputChange = (e: any) =>{
    const target = e.target
    const name = parseInt(target.name) // 这个id以数字来回切换也是够。
    const value = target.value    
    const navCloneList = navList.concat()
    const modifyCloneList = modifyList.concat()
    navCloneList.map(n=>{
      if(n.id === name) {
        n.name = value
      }
    })

    modifyCloneList.map(m=>{
      if(m.id === name) {
        m.name = value
      }
    })
    setNavList(navCloneList)
    setModifyList(modifyCloneList)
  }

  const onClick = (e: any) => {
    (async () => {
      const res = await updateNavApi(Number(params.id), modifyList)
      if (res?.success) {
        message.success(res?.message);
      } else {
        message.error(res?.message);
      }
    })()
  }
  
  useEffect(() => {
    (async () => {
      const res = await getNavListingApi(Number(params.id))
      if (res?.success) {
        let modifyRes:ModifyNavItem[] = []
        res.data.map((r: any, i: number) => {
          res.data[i]['key'] = r.id
          res.data[i]['maxLength'] = 6
          if(r?.position === 'homePage'){
            res.data[i]['isDisabled'] = true
          } else {
            res.data[i]['isDisabled'] = false
          }
          modifyRes.push({
            id: r.id,
            name: r.name,
            display: r.display
          })
        })
        setNavList(res.data)
        setModifyList(modifyRes)
        setIsLoading(false)
      } else {
        message.error(res?.message);
      }
    })()
  }, [])

  const shopNavPage = () =>{
    if(isLoading){
      return <Loading />
    }else {
      return (
        <div className='shop-nav'>
          <Table columns={columns} dataSource={navList} />
          <Button type="primary" className="save-nav" size="large" onClick={onClick}>保存</Button>
        </div>
      )
    }
  }

  return (
    <div>
      {shopNavPage()}
    </div>
  );
}
